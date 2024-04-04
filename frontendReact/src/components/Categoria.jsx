import React, { useEffect, useRef, useState } from "react";
import { IconEdit, IconFileSpreadsheet, IconTrash } from "@tabler/icons-react";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import esES from "../languages/es-ES.json";
import ExelLogo from "../../img/excel.224x256.png";
import PdfLogo from "../../img/pdf.224x256.png";
import $ from "jquery";
import "bootstrap";
import "datatables.net";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import portConexion from "../const/portConexion";
import generatePDF from "react-to-pdf";
import * as xlsx from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { dataDecript } from "./encryp/decryp";

const Categoria = () => {
  const tableRef = useRef();
  const [categorias_producto, setcategorias_producto] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalCategoriaRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [userRoll, setUserRoll] = useState("");
  const [categoriaSeleccionada, setcategoriaSeleccionada] = useState({});

  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, "ExcelCategoria");
    xlsx.writeFile(wb, "Categoriadetalle.xlsx");
  };
  const getTableData = () => {
    const wsData = [];

    // Obtener las columnas
    const columns = ["Id", "Nombre", "Tipo ", "Codigo"];
    wsData.push(columns);

    // Obtener los datos de las filas
    categorias_producto.forEach((element) => {
      const rowData = [
        element.id_categoria,
        element.nombre_categoria,
        element.tipo_categoria,
        element.codigo_categoria,
      ];
      wsData.push(rowData);
    });

    return wsData;
  };
  
  const resetFormState = () => {
    const formFields = modalCategoriaRef.current.querySelectorAll(
      '.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]'
    );
    formFields.forEach((field) => {
      if (field.type === "checkbox") {
        field.checked = false;
      } else {
        field.value = "";
      }
      field.classList.remove("is-invalid");
    });
  };

  const doc = new jsPDF();
  const exportPdfHandler = () => {
    const doc = new jsPDF();

    const columns = [
      { title: "Id", dataKey: "id_categoria" },
      { title: "Nombre de categoria", dataKey: "nombre_categoria" },
      { title: "Tipo categoria  ", dataKey: "tipo_categoria" },
      { title: "Codigo", dataKey: "codigo_categoria" },
    ];

    // Obtener los datos de la tabla
    const tableData = categorias_producto.map((element) => ({
      id_categoria: element.id_categoria,
      nombre_categoria: element.nombre_categoria,
      tipo_categoria: element.tipo_categoria,
      codigo_categoria: element.codigo_categoria,
    }));

    // Agregar las columnas y los datos a la tabla del PDF
    doc.autoTable({
      columns,
      body: tableData,
      margin: { top: 20 },
      styles: { overflow: "linebreak" },
      headStyles: { fillColor: [0, 100, 0] },
    });

    // Guardar el PDF
    doc.save("Categoria.pdf");
  };

  useEffect(() => {
    if (categorias_producto.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable({
        columnDefs: [
          {
            targets: -1,
            responsivePriority: 1,
          },
        ],
        responsive: true,
        language: esES,
        paging: true,
        select: {
          style: "multi",
          selector: "td:first-child",
        },
        lengthMenu: [
          [10, 50, 100, -1],
          ["10 Filas", "50 Filas", "100 Filas", "Ver Todo"],
        ],
        order: [[4, "asc"]],
      });
    }
  }, [categorias_producto]);

  useEffect(() => {
    window.onpopstate = function (event) {
      window.location.reload();
    };
    setUserRoll(dataDecript(localStorage.getItem("roll")));
    listarCategoria();
  }, []);

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }

  function listarCategoria() {
    fetch(`http://${portConexion}:3000/categoria/listar`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == 500) {
          Sweet.error(data.message);
        }
        if (data.status == 204) {
          Sweet.error(data.message);
        }
        if (data !== null) {
          setcategorias_producto(data);
        }
      })
      .catch((e) => {});
  }

  function registrarCategoria() {
    let nombre_categoria = document.getElementById("nombreCategoria").value;
    let tipo_categoria = document.getElementById("tipo_categoria").value;
    let codigo_categoria = document.getElementById("codigoCategoria").value;

    const validacionExitosa = Validate.validarCampos(".form-empty");

    fetch(`http://${portConexion}:3000/categoria/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        nombre_categoria,
        tipo_categoria,
        codigo_categoria,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.registroFallido();
          return;
        }

        if (data.status === 200) {
          Sweet.exito(data.menssage);
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
          }
          listarCategoria();
        }
        if (data.status === 409) {
          Sweet.error(data.message);
          return;
        }
        if (data.status === 403) {
          Sweet.error(data.error.errors[0].msg);
          return;
        }
        listarCategoria();
        setShowModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function deshabilitarCategoria(id) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://${portConexion}:3000/categoria/deshabilitar/${id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            token: localStorage.getItem("token"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 200) {
              Sweet.exito(data.message);
            } else {
              Sweet.error(data.menssage);
            }
            listarCategoria();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }
  function activarCategoria(id) {
    Sweet.confirmacionActivar().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://${portConexion}:3000/categoria/activar/${id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            token: localStorage.getItem("token"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 200) {
              Sweet.actualizacionExitoso();
            }
            if (data.status === 401) {
              Sweet.actualizacionFallido();
            }
            listarCategoria();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }
  function editarCategoria(id) {
    fetch(`http://${portConexion}:3000/categoria/buscar/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setcategoriaSeleccionada(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function actualizarCategoria(id) {
    const validacionExitosa = Validate.validarCampos(".form-update");
    const codigoExistente = categorias_producto.some(
      (cat) =>
        cat.codigo_categoria.toLowerCase() ===
          categoriaSeleccionada.codigo_categoria.toLowerCase() &&
        cat.id_categoria !== categoriaSeleccionada.id_categoria
    );
    if (codigoExistente) {
      Sweet.error(
        "El código ingresado ya está en uso. Por favor, ingrese un código diferente."
      );
      return;
    }

    if (
      !categoriaSeleccionada.tipo_categoria ||
      !categoriaSeleccionada.codigo_categoria
    ) {
      Sweet.error("Por favor, complete todos los campos.");
      return;
    }

    fetch(`http://${portConexion}:3000/categoria/editar/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(categoriaSeleccionada),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.actualizacionFallido();
          return;
        }
        if (data.status === 200) {
          Sweet.exito(data.menssge);
        } else {
          Sweet.error(data.errors[0].msg);
        }
        listarCategoria();
        setUpdateModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      });
  }

  const [search, setSeach] = useState("");

  return (
    <div>
      <div className="boxBtnContendidoTitulo">
        <div className="btnContenido1">
          <button
            type="button"
            id="modalCategoria"
            className="btn-color btn"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            onClick={() => { setShowModal(true); Validate.limpiar('.limpiar'); resetFormState();}}
          >
            Registrar Categorias
          </button>
        </div>
        <div className="btnContenido22">
          <h2 className="tituloHeaderpp">Lista las categorias</h2>
        </div>
        <div className="btnContenido3">
          <div
            className="flex btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            <div className="" title="Descargar Excel">
              <button
                onClick={handleOnExport}
                type="button"
                className="btn btn-light"
              >
                <img src={ExelLogo} className="logoExel" />
              </button>
            </div>
            <div className="" title="Descargar Pdf">
              <button
                type="button"
                className="btn btn-light"
                onClick={exportPdfHandler}
              >
                <img src={PdfLogo} className="logoExel" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid w-full">
        <table
          id="dtBasicExample"
          className="table table-striped table-bordered border display responsive nowrap"
          ref={tableRef}
          cellSpacing={0}
          width="100%"
        >
          <thead className="text-center text-justify">
            <tr>
              <th className="th-sm">#</th>
              <th className="th-sm">Nombre categoria</th>
              <th className="th-sm">Tipo</th>
              <th className="th-sm">Codigo</th>
              <th className="th-sm"> Botones de acciones</th>
            </tr>
          </thead>
          <tbody id="tableCategoria" className="text-center">
            {categorias_producto.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="d-flex justify-content-center">
                    <div className=" alert alert-danger text-center mt-4 w-50">
                      <h2>
                        {" "}
                        En este momento no contamos con ningúna Categoria
                        disponible.😟{" "}
                      </h2>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {categorias_producto.map((element, index) => (
                  <tr key={index}>
                    <td style={{ textTransform: "capitalize" }}>
                      {element.id_categoria}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      {element.nombre_categoria}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      {element.tipo_categoria}
                    </td>
                    <td style={{ textTransform: "capitalize" }}>
                      {element.codigo_categoria}
                    </td>
                    {userRoll == "administrador" ? (
                      <td className="p-0">
                        {element.estado === 1 ? (
                          <>
                          
                            <button
                              className="btn btn-danger "
                              onClick={() =>
                                deshabilitarCategoria(element.id_categoria)
                              }
                            >
                              <IconTrash />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary "
                            onClick={() =>
                              activarCategoria(element.id_categoria)
                            }
                          >
                            Activar
                          </button>
                        )}
                      </td>
                    ) : (
                      <td>  <button
                      className="btn btn-color mx-2"
                      onClick={() => {
                        setUpdateModal(true);
                        editarCategoria(element.id_categoria);
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop2"
                    >
                      <IconEdit />
                    </button></td>
                    )}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        tabIndex="-1"
        data-bs-backdrop="static"
        ref={modalCategoriaRef}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Registrar Categoria</h1>
              <button
                type="button"
                className="btn-close text-white bg-white limpiar"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="col mb-2">
                  <label htmlFor="nombre_categoria" className="label-bold mb-2">
                    Nombre Categoria
                  </label>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control limpiar form-empty"
                      id="nombreCategoria"
                      placeholder="Nombre Categoria"
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, ingrese una categoria
                    </div>
                  </div>
                </div>
                <div className="col-12">
                  <label
                    className="visually-hidden"
                    htmlFor="inlineFormSelectPref"
                  >
                    Preference
                  </label>
                </div>
                <div className="row">
                  <div className="col">
                    <label
                      htmlFor="inlineFormInputGroupUp"
                      className="label-bold mb-2"
                    >
                      Tipo
                    </label>

                    <select
                      id="tipo_categoria"
                      name="tipo_categoria"
                      className="form-select form-control form-empty limpiar"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="perecedero">Perecedero </option>
                      <option value="no perecedero">No perecedero </option>
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un tipo de categoria
                    </div>
                  </div>
                  <div className="col">
                    <label
                      htmlFor="inlineFormInputGroupUp"
                      className="label-bold mb-2"
                    >
                      Código
                    </label>
                    <input
                      type="text"
                      className="form-control form-empty limpiar"
                      id="codigoCategoria"
                      name="codigoCategoria"
                      placeholder="Escribe el Codigo "
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, ingrese el Código
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => { resetFormState()}}
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-color"
                onClick={registrarCategoria}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop2"
        data-bs-backdrop="static"
        tabIndex="-1"
        aria-labelledby="actualizarModalLabel"
        aria-hidden="true"
        ref={modalUpdateRef}
        style={{ display: updateModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg text-white">
              <h1 className="modal-title fs-5" id="actualizarModalLabel">
                Actualizar Categoria
              </h1>
              <button
                type="button"
                className="btn-close text-white bg-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="col-12">
                  <label
                    className="visually-hidden"
                    htmlFor="inlineFormInputGroupUp"
                  >
                    Up
                  </label>
                  <div className="col-md-12">
                    <label
                      htmlFor="nombre_categoria"
                      className="label-bold mb-2"
                    >
                      Nombre Categoria
                    </label>
                    <input
                      type="hidden"
                      value={categoriaSeleccionada.nombre_categoria || ""}
                      onChange={(e) =>
                        setcategoriaSeleccionada({
                          ...categoriaSeleccionada,
                          nombre_categoria: e.target.value,
                        })
                      }
                      disabled
                    />
                    <input
                      type="text"
                      className="form-control form-update"
                      placeholder="nombre categoria"
                      value={categoriaSeleccionada.nombre_categoria || ""}
                      name="nombre_categoria"
                      onChange={(e) =>
                        setcategoriaSeleccionada({
                          ...categoriaSeleccionada,
                          nombre_categoria: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback is-invalid"></div>
                  </div>
                </div>
                <div className="col-12">
                  <label
                    className="visually-hidden"
                    htmlFor="inlineFormSelectPref"
                  >
                    Preference
                  </label>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="tipo_categoria "
                      className="label-bold mb-2"
                    >
                      tipo categoria{" "}
                    </label>
                    <select
                      className="form-select form-update"
                      value={categoriaSeleccionada.tipo_categoria || ""}
                      name="tipo_categoria"
                      onChange={(e) =>
                        setcategoriaSeleccionada({
                          ...categoriaSeleccionada,
                          tipo_categoria: e.target.value,
                        })
                      }
                    >
                      {" "}
                      <option value="">Seleccione una opción</option>
                      <option value="perecedero">Perecedero </option>
                      <option value="no perecedero">No perecedero </option>
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un tipo de categoria
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label
                      htmlFor="codigo_Categoria"
                      className="label-bold mb-2"
                    >
                      Codigo
                    </label>
                    <input
                      type="hidden"
                      value={categoriaSeleccionada.codigo_categoria || ""}
                      onChange={(e) =>
                        setcategoriaSeleccionada({
                          ...categoriaSeleccionada,
                          codigo_categoria: e.target.value,
                        })
                      }
                      disabled
                    />
                    <input
                      type="text"
                      className="form-control form-update"
                      placeholder="nombre categoria"
                      value={categoriaSeleccionada.codigo_categoria || ""}
                      name="codigo_categoria"
                      onChange={(e) =>
                        setcategoriaSeleccionada({
                          ...categoriaSeleccionada,
                          codigo_categoria: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, ingrese el Código
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar{" "}
              </button>
              <button
                type="button"
                className="btn btn-color"
                onClick={() => {
                  actualizarCategoria(categoriaSeleccionada.id_categoria);
                }}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categoria;
