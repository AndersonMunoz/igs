import React, { useEffect, useRef, useState } from "react";
import "../style/producto.css";
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
import Select from 'react-select'
import generatePDF from "react-to-pdf";
import { newLink } from "./Inventario.jsx";
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import portConexion from "../const/portConexion";
import autoTable from 'jspdf-autotable';





const resetFormState = () => {
  const formFields = modalProductoRef.current.querySelectorAll('.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]');
  const formFields2 = modalUpdateRef.current.querySelectorAll('.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]');
  formFields.forEach(field => {
    if (field.type === 'checkbox') {
      field.checked = false;
    } else {
      field.value = '';
    }
    field.classList.remove('is-invalid');
  });
  formFields2.forEach(field => {
    if (field.type === 'checkbox') {
      field.checked = false;
    } else {
      field.value = '';
    }
    field.classList.remove('is-invalid');
  });
};

const Tipo = () => {
  const [tipos, setTipo] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalProductoRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [tiposeleccionado, setTiposeleccionado] = useState({});
  const tableRef = useRef();
  const categoriaRecived = "";
 

  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelTipo');
    xlsx.writeFile(wb, 'Tipodetalle.xlsx');
  };

  const doc= new jsPDF();
  const exportPdfHandler = () => {
    const doc = new jsPDF();
  
    const columns = [
      { title: 'Id', dataKey: 'id_tipo' },
      { title: 'Nombre tipo de producto', dataKey: 'nombre_tipo' },
      { title: 'Nombre Categoria ', dataKey: 'nombre_categoria' },
      { title: 'Unidad de Peso ', dataKey: 'unidad_peso' },
    ];
  
    // Obtener los datos de la tabla
    const tableData = tipos.map((element) => ({
      id_tipo: element.id,
      nombre_tipo: element.NombreProducto,
      nombre_categoria: element.Categoría,
      unidad_peso: element.UnidadPeso,
    }));
  
    // Agregar las columnas y los datos a la tabla del PDF
    doc.autoTable({
      columns,
      body: tableData,
      margin: { top: 20 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [0, 100, 0] },
    });
  
    // Guardar el PDF
    doc.save('Tipodeproducto.pdf');
  };
  const getTableData = () => {
    const wsData = [];
  
    // Obtener las columnas
    const columns = [
      'Id',
      'Nombre tipo de producto ',
      'Nombre Categoria ',
      'Unidad de peso ',
      'estado '
    ];
    wsData.push(columns);
  
    // Obtener los datos de las filas
    tipos.forEach(element => {
      const rowData = [
        element.id,
        element.NombreProducto,
        element.Categoría,
        element.UnidadPeso,
        element.estado
  
      ];
      wsData.push(rowData);
    });
  
    return wsData;
  };

  useEffect(() => {
    if (tipos.length > 0) {
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
  }, [tipos]);

  useEffect(() => {
    window.onpopstate = function(event) {
      window.location.reload();
  };
    listarTipo();
    listarCategoria();
  }, []);


  const resetFormState = () => {
    const formFields = modalProductoRef.current.querySelectorAll('.form-control,.form-update,.my-custom-class,.form-empty, select, input[type="number"], input[type="checkbox"]');
    const formFields2 = modalUpdateRef.current.querySelectorAll('.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]');
    formFields.forEach(field => {
      if (field.type === 'checkbox') {
        field.checked = false;
      } else {
        field.value = '';
      }
      field.classList.remove('is-invalid');
    });
    formFields2.forEach(field => {
      if (field.type === 'checkbox') {
        field.checked = false;
      } else {
        field.value = '';
      }
      field.classList.remove('is-invalid');
    });
  };


  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }

  function listarTipo() {
    fetch(`http://${portConexion}:3000/tipo/listar`, {
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
          setTipo(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function listarCategoria() {
    fetch(`http://${portConexion}:3000/categoria/listar`, {
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
          setCategoria(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const handleCategoria = (selectedOption) => {
    setSelectedCategoria(selectedOption); 
  };
  function registrarTipo() {
    let nombre_tipo = document.getElementById("nombre_tipo").value;
    let unidad_peso = document.getElementById("unidad_peso").value;
    Validate.validarCampos('.form-empty');

    const validacionCategoria = Validate.validarSelect('#fk_categoria_pro');
    Validate.validarSelect('.form-empt');
    const validacionExitosa = validacionCategoria;
  
    if (!validacionExitosa) {
      Sweet.registroFallido();
      return;
    }

    fetch(`http://${portConexion}:3000/tipo/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({ nombre_tipo, fk_categoria_pro: selectedCategoria.value, unidad_peso }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          Sweet.exito(data.menssage);
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
          }
          listarTipo();
          setShowModal(false);
          removeModalBackdrop();
          const modalBackdrop = document.querySelector('.modal-backdrop');
          if (modalBackdrop) {
            modalBackdrop.remove();
          }
        } else if (data.status === 403) {
          Sweet.error(data.error.errors[0].msg);
        }else if(data.status === 409){
            Sweet.error(data.menssage);
            return;
        } else {
          console.error('Error en la petición:', data);
          Sweet.error('Lo siento, se ha producido un error al seleccionar el tipo de producto. Por favor, asegúrate de elegir una opción válida e inténtalo de nuevo.');
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function deshabilitarTipo(id) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://${portConexion}:3000/tipo/deshabilitar/${id}`, {
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
            }
            if (data.status != 200) {
              Sweet.error(data.message);
            }
            listarTipo();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }
  function activarTipo(id) {
    Sweet.confirmacionActivar().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://${portConexion}:3000/tipo/activar/${id}`, {
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
            }
            if (data.status !== 200) {
              Sweet.error(data.message);
            }
            listarTipo();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }

  function editarTipo(id) {
    fetch(`http://${portConexion}:3000/tipo/buscar/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setTiposeleccionado(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function actualizarTipo(id) {
    const validacionExitosa = Validate.validarCampos(".form-update");
    fetch(`http://${portConexion}:3000/tipo/editar/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(tiposeleccionado),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.actualizacionFallido();
          return;
        }
        if (data.status == 200) {
          Sweet.exito(data.menssge);
        }
        if (data.status != 200) {
          Sweet.error(data.errors[0].msg);
        }
        listarTipo();
        setUpdateModal(false);
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
  // Componente externo donde se define category
  const category = categoriaRecived;

  // Componente donde se define la función setSearch
  const setSeach = ({ category }) => {
    return category;
  };

  const search = setSeach({ category }); // Pasando el valor de category como argumento

  return (
    <div>
       <div className="boxBtnContendidoTitulo">
        <div className="btnContenido1">
          <button
            type="button"
            id="modalUsuario"
            className="btn-color btn"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            onClick={() => {
              setShowModal(true);
              Validate.limpiar(".limpiar");
              resetFormState();
              handleRegistration();
            }}
          >
            Registrar Tipo de producto
          </button>
        </div>
        <div className="btnContenido22">
          <h2 className="tituloHeaderpp">Lista de tipo de productos</h2>
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
              <th className="th-sm">Id</th>
              <th className="th-sm">Nombre tipo de producto</th>
              <th className="th-sm">Nombre categoria</th>
              <th className="th-sm">Unidad peso</th>
              <th className="th-sm">Botones de acciones</th>
            </tr>
          </thead>
          <tbody id="tableTipo" className="text-center">
            {tipos.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2>
                        {" "}
                        En este momento no contamos con ningún tipo de producto
                        disponible.😟{" "}
                      </h2>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {tipos
                  .filter((item) => {
                    return typeof search === "string" &&
                      search.toLowerCase() === ""
                      ? item
                      : item.Categoría.toLowerCase().includes(search);
                  })

                  .map((element) => (
                    <tr key={element.id}>
                      <td>{element.id}</td>
                      <td style={{ textTransform: "capitalize" }}>
                        {element.NombreProducto}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {element.Categoría}
                      </td>
                      <td style={{ textTransform: "capitalize" }}>
                        {element.UnidadPeso}
                      </td>
                      <td className="p-0">
                        {element.estado === 1 ? (
                          <>
                            <button
                              className="btn btn-color mx-2"
                              onClick={() => {
                                setUpdateModal(true);
                                editarTipo(element.id);
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#staticBackdrop2"
                            >
                              <IconEdit />
                            </button>

                            <button
                              className="btn btn-danger"
                              onClick={() => deshabilitarTipo(element.id)}
                            >
                              <IconTrash />
                            </button>
                          </>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => activarTipo(element.id)}
                          >
                            Activar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" ref={modalProductoRef} style={{ display: showModal ? 'block' : 'none' }} >
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Registrar Tipo de Producto</h1>
              <button
                type="button"
                className="btn-close text-white bg-white"
                data-bs-dismiss="modal"
              ></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="tipo" className="label-bold mb-2">
                      {" "}
                      Nombre Tipo  de Producto
                    </label>
                    <input
                      type="text"
                      className="form-control form-empty limpiar"
                      id="nombre_tipo"
                      name="	nombre_tipo"
                      placeholder="Nombre de tipo de producto "
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor,  ingrese el nombre de tipo de producto 
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="fk_categoria_pro"
                      className="label-bold mb-2"
                    >
                      Categoria
                    </label>
                    <Select
                        className="react-select-container  form-empt my-custom-class"
                        classNamePrefix="react-select"
                        options={categoria.map(element => ({ value: element.id_categoria, label: element.nombre_categoria}))}
                        placeholder="Selecciona..."
                        onChange={handleCategoria}
                        value={selectedCategoria}
                        id="fk_categoria_pro"
                      />
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione una categoria
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="unidad_peso" className="label-bold mb-2">
                      Unidad de Peso
                    </label>

                    <select
                      name="unidad_peso"
                      id="unidad_peso"
                      className="form-select form-control form-empty limpiar"
                    >
                      <option value="">Seleccione una opción</option>
                      <option value="kg">Kilo (Kg)</option>
                      <option value="lb">Libra (Lb)</option>
                      <option value="gr">Gramo (Gr)</option>
                      <option value="lt">Litro (Lt)</option>
                      <option value="ml">Mililitro (Ml)</option>
                      <option value="oz">Onzas (Oz)</option>
                      <option value="unidad(es)">Unidad(es)</option>
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione una unidad de medida
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
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-color"
                onClick={registrarTipo}
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
                Actualizar Tipo de Producto{" "}
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
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="nombre " className="label-bold mb-2">
                      Nombre Tipo de Producto{" "}
                    </label>
                    <input
                      type="hidden"
                      value={tiposeleccionado.id_tipo || ""}
                      onChange={(e) =>
                        setTiposeleccionado({
                          ...tiposeleccionado,
                          id_tipo: e.target.value,
                        })
                      }
                      disabled
                    />
                    <input
                      type="text"
                      className="form-control form-update"
                      placeholder="tipo"
                      value={tiposeleccionado.nombre_tipo || ""}
                      name="	nombre_tipo"
                      onChange={(e) =>
                        setTiposeleccionado({
                          ...tiposeleccionado,
                          nombre_tipo: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, ingrese el nombre  del Tipo de Producto 
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label
                      htmlFor="fk_categoria_pro"
                      className="label-bold mb-2"
                    >
                      Categoria{" "}
                    </label>
                    <select
                      className="form-select form-update"
                      value={tiposeleccionado.fk_categoria_pro || ""}
                      name="fk_categoria_pro"
                      onChange={(e) =>
                        setTiposeleccionado({
                          ...tiposeleccionado,
                          fk_categoria_pro: e.target.value,
                        })
                      }
                      onClick={listarCategoria}
                    >
                      <option value="">Selecciona una Catecoria</option>
                      {categoria.map((element) => (
                        <option
                          key={element.id_categoria}
                          value={element.id_categoria}
                        >
                          {element.nombre_categoria}
                        </option>
                      ))}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione una categoria 
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="unidad_peso " className="label-bold mb-2">
                      Unidad de Peso{" "}
                    </label>
                    <select
                      className="form-select form-update"
                      value={tiposeleccionado.unidad_peso || ""}
                      name="unidad_peso"
                      onChange={(e) =>
                        setTiposeleccionado({
                          ...tiposeleccionado,
                          unidad_peso: e.target.value,
                        })
                      }
                    >
                      {" "}
                      <option value="">Seleccione una opción</option>
                      <option value="kg">Kilo (Kg)</option>
                      <option value="lb">Libra (Lb)</option>
                      <option value="gr">Gramo (Gr)</option>
                      <option value="lt">Litro (Lt)</option>
                      <option value="ml">Mililitro (Ml)</option>
                      <option value="oz">Onzas (OZ)</option>
                      <option value="unidad(es)">Unidad (ES)</option>
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor,  seleccione una unidad de peso
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
                  actualizarTipo(tiposeleccionado.id_tipo);
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

export default Tipo;
