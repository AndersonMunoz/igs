import React, { useEffect, useRef, useState } from "react";
import "../style/producto.css";
import { IconEdit, IconFileSpreadsheet, IconTrash } from "@tabler/icons-react";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import esES from "../languages/es-ES.json";
import $ from "jquery";
import "bootstrap";
import ExelLogo from "../../img/excel.224x256.png";
import PdfLogo from "../../img/pdf.224x256.png";
import "datatables.net";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import generatePDF from "react-to-pdf";
import * as xlsx from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import portConexion from "../const/portConexion";
import { dataDecript } from "./encryp/decryp";

const Up = () => {
  const [unidad_productiva, setunidad_productiva] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalCategoriaRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [upSeleccionada, setupSeleccionada] = useState({});
  const [userRoll, setUserRoll] = useState("");
  const tableRef = useRef(null);


  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, "ExcelBodega");
    xlsx.writeFile(wb, "Bodegadetalle.xlsx");
  };
  const doc = new jsPDF();
  const exportPdfHandler = () => {
    const doc = new jsPDF();

    const columns = [
      { title: "Id", dataKey: "id_up" },
      { title: "Nombre de Bodega", dataKey: "nombre_up" },
    ];

    // Obtener los datos de la tabla
    const tableData = unidad_productiva.map((element) => ({
      id_up: element.id_up,
      nombre_up: element.nombre_up,
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
    doc.save("Bodega.pdf");
  };
  const getTableData = () => {
    const wsData = [];

    // Obtener las columnas
    const columns = ["Id", "Nombre Bodega", "estado"];
    wsData.push(columns);

    // Obtener los datos de las filas
    unidad_productiva.forEach((element) => {
      const rowData = [element.id_up, element.nombre_up, element.estado];
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

  

  useEffect(() => {
    if (unidad_productiva.length > 0) {
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
        order: [[2, "asc"]],
      });
    }
  }, [unidad_productiva]);

  useEffect(() => {
    window.onpopstate = function(event) {
      window.location.reload();
  };
    setUserRoll(dataDecript(localStorage.getItem("roll")));
    listarUp();
  }, []);

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
// Función para listar las  bodegas 
  function listarUp() {
    fetch(`http://${portConexion}/up/listar`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => {
        if (res.status === 204) {
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data !== null) {
          setunidad_productiva(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
// Función para registrar  una nueva bodega 

  function registrarUp() {
    let nombre_up = document.getElementById("nombreUp").value;
    const validacionExitosa = Validate.validarCampos(".form-empty");

    fetch(`http://${portConexion}/up/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({ nombre_up }),
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
        }
        if (data.status === 409) {
          Sweet.error(data.message);
          return;
        }
        if (data.status === 403) {
          Sweet.error(data.error.errors[0].msg);
        }
        listarUp();
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
 // esta funcion es para deshabilitar una bodega 
  function deshabilitarUp(id) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://${portConexion}/up/deshabilitar/${id}`, {
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
            listarUp();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }
   // esta funcion es para activar una bodega deshabilitada
  function activarUp(id) {
    Sweet.confirmacionActivar().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://${portConexion}/up/activar/${id}`, {
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
            listarUp();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }
// funcion para  llamar  los datos que aparezcan el modal para actualizar
  function editarUp(id) {
    fetch(`http://${portConexion}/up/buscar/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setupSeleccionada(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
   // funcion para actualizar la  bodega 
  function actualizarUp(id) {
    const validacionExitosa = Validate.validarCampos(".form-update");
    fetch(`http://${portConexion}/up/editar/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(upSeleccionada),
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
        listarUp();
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
            Registrar Bodega
          </button>
        </div>
        <div className="btnContenido22">
          <h2 className="tituloHeaderpp">Lista de bodega</h2>
        </div>
        <div className="btnContenido3">
          <div
            className="flex btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            <div className="" title="Descargar Excel">
            <button onClick={handleOnExport} type="button" className="btn btn-light">
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
              <th className="th-sm">Nombre bodega</th>
              <th className="th-sm"> Botones acciones</th>
            </tr>
          </thead>
          <tbody id="tableunidadProductiva" className="text-center">
            {unidad_productiva.length === 0 ? (
              <tr>
                <td colSpan={3}>
                  <div className="d-flex justify-content-center">
                    <div className=" alert alert-danger text-center mt-4 w-50">
                      <h2>
                        {" "}
                        En este momento no contamos con ningúna bodega
                        disponible. 😟{" "}
                      </h2>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {unidad_productiva
                  .filter((item) => {
                    return search.toLowerCase() === ""
                      ? item
                      : item.nombre_up.toLowerCase().includes(search);
                  })
                  .map((element) => (
                    <tr key={element.id_up}>
                      <td style={{ textTransform: "capitalize" }}>
                        {element.id_up}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {element.nombre_up}
                      </td>
                      {userRoll == "administrador" ? (
                        <td className="p-0">
                        {element.estado === 1 ? (
                          <>
                           <button
                        className="btn btn-color mx-2"
                        onClick={() => {
                          setUpdateModal(true);
                          editarUp(element.id_up);
                        }}
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop2"
                      >
                        <IconEdit />
                      </button>
                            <button
                              className="btn btn-danger"
                              onClick={() => deshabilitarUp(element.id_up)}
                            >
                              <IconTrash />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => activarUp(element.id_up)}
                          >
                            Activar
                          </button>
                        )}
                      </td>
                      ):(
                        <td className="p-0"> <button
                        className="btn btn-color mx-2"
                        onClick={() => {
                          setUpdateModal(true);
                          editarUp(element.id_up);
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
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        ref={modalCategoriaRef}
        style={{ display: showModal ? "block" : "none" }}
      >
          {/* Modal de Nuevo bodega   */}
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Registrar Bodega </h1>
              <button
                type="button"
                className="btn-close text-white bg-white"
                data-bs-dismiss="modal"
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

                  <input
                    type="text"
                    className="form-control   form-empty limpiar"
                    id="nombreUp"
                    placeholder="Nombre Bodega "
                  />
                  <div className="invalid-feedback is-invalid">
                    Por favor, ingrese una bodega
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
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-color"
                onClick={registrarUp}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
   {/* Modal de actualizar de bodega  */}
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
                Actualizar bodega{" "}
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
                    <label htmlFor="nombre_up" className="label-bold mb-2">
                      nombre bodega{" "}
                    </label>
                    <input
                      type="hidden"
                      value={upSeleccionada.nombre_up || ""}
                      onChange={(e) =>
                        setupSeleccionada({
                          ...upSeleccionada,
                          nombre_up: e.target.value,
                        })
                      }
                      disabled
                    />
                    <input
                      type="text"
                      className="form-control form-update"
                      placeholder="nombre up"
                      value={upSeleccionada.nombre_up || ""}
                      name="nombre_up"
                      onChange={(e) =>
                        setupSeleccionada({
                          ...upSeleccionada,
                          nombre_up: e.target.value,
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
                  actualizarUp(upSeleccionada.id_up);
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

export default Up;
