import React, { useEffect, useRef, useState } from "react";
import "../style/producto.css";
import { IconEdit, IconFileSpreadsheet, IconTrash } from "@tabler/icons-react";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import esES from "../languages/es-ES.json";
import $ from "jquery";
import "bootstrap";
import "datatables.net";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";
import generatePDF from "react-to-pdf";

const Tipo = () => {
  const [tipos, setTipo] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalProductoRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [tiposeleccionado, setTiposeleccionado] = useState({});
  const tableRef = useRef();

  useEffect(() => {
		if (tipos.length > 0) {
			if ($.fn.DataTable.isDataTable(tableRef.current)) {
				$(tableRef.current).DataTable().destroy();
			}
			$(tableRef.current).DataTable({
				columnDefs: [
					{
						targets: -1,
						responsivePriority: 1
					}
				],
				responsive: true,
				language: esES,
				paging: true,
				select: {
					'style': 'multi',
					'selector': 'td:first-child',
				},
				lengthMenu: [
					[10, 50, 100, -1],
					['10 Filas', '50 Filas', '100 Filas', 'Ver Todo']
				],
			});
		}
	}, [tipos]);

  useEffect(() => {
    listarTipo();
    listarCategoria();
  }, []);

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }

  function listarTipo() {
    fetch("http://localhost:3000/tipo/listar", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 204) {
          console.log("No hay datos disponibles");
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
    fetch("http://localhost:3000/categoria/listar", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 204) {
          console.log("No hay datos disponibles");
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

  function registrarTipo() {
    let nombre_tipo = document.getElementById("nombre_tipo").value;
    let fk_categoria_pro = document.getElementById("fk_categoria_pro").value;
    let unidad_peso = document.getElementById("unidad_peso").value;

    const validacionExitosa = Validate.validarCampos(".form-empty");

    fetch("http://localhost:3000/tipo/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_tipo, fk_categoria_pro,unidad_peso }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.registroFallido();
        }
        if (data.status == 200) {
          Sweet.exito(data.menssage);
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
          }
          listarTipo();
        }
        if (data.status !== 200) {
          Sweet.error(data.errors[0].msg);
          return;
        }
        console.log(data);
        listarTipo();
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

  function deshabilitarTipo(id) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/tipo/deshabilitar/${id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
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
        fetch(`http://localhost:3000/tipo/activar/${id}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
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
    fetch(`http://localhost:3000/tipo/buscar/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTiposeleccionado(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function actualizarTipo(id) {
    const validacionExitosa = Validate.validarCampos(".form-update");
    fetch(`http://localhost:3000/tipo/editar/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
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
        console.log(data);
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

  const [search, setSeach] = useState("");

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button
          type="button"
          id="modalProducto"
          className="btn-color btn mb-4"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => {
            setShowModal(true);
            Validate.limpiar(".limpiar");
          }}
        >
          Registrar Nuevo Tipo de Producto
        </button>
        <div>
          <DownloadTableExcel
            filename="Tabla Tipo de producto"
            sheet="Tipo"
            currentTableRef={tableRef.current}
          >
            <button type="button" className="btn-color btn me-2">
              Excel
            </button>
          </DownloadTableExcel>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => generatePDF(tableRef, { filename: "tipo.pdf" })}
          >
           PDF
          </button>
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
              <th className="th-sm">Nombre Producto</th>
              <th className="th-sm">Nombre Categoria</th>
              <th className="th-sm">Unidad Peso</th>
              <th className="th-sm">Acciones</th>
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
                        disponible.{" "}
                      </h2>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {tipos
                  .filter((item) => {
                    return search.toLowerCase() === ""
                      ? item
                      : item.NombreProducto.toLowerCase().includes(search);
                  })
                  .map((element) => (
                    <tr key={element.id}>
                      <td>{element.id}</td>
                      <td style={{textTransform: 'capitalize'}}>{element.NombreProducto}</td>
                      <td style={{textTransform: 'capitalize'}}>{element.Categoría}</td>
                      <td style={{textTransform: 'capitalize'}}>{element.UnidadPeso}</td>
                      <td>
                        {element.estado === 1 ? (
                          <>
                            <button
                              className="btn btn-color mx-2"
                              onClick={() => {
                                setUpdateModal(true);
                                editarTipo(element.id);
                              }}
                              data-bs-toggle="modal"
                              data-bs-target="#actualizarModal"
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
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        ref={modalProductoRef}
        style={{ display: showModal ? "block" : "none" }}
      >
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
                      Tipo Producto
                    </label>
                    <input
                      type="text"
                      className="form-control form-empty limpiar"
                      id="nombre_tipo"
                      name="	nombre_tipo"
                      placeholder="Nombre de tipo de producto "
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, el Nombre
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-7">
                    <label
                      htmlFor="fk_categoria_pro"
                      className="label-bold mb-2"
                    >
                      Categoria
                    </label>
                    <select
                      className="form-select form-control form-empty limpiar"
                      id="fk_categoria_pro"
                      name=" fk_categoria_pro"
                      defaultValue=""
                    >
                      {categoria.length === 0 ? (
                        <option value="" disabled>
                          No hay Categorias
                        </option>
                      ) : (
                        <>
                          <option value="">Selecciona una Categoria</option>
                          {categoria.map((element) => (
                            <option
                              key={element.id_categoria}
                              value={element.id_categoria}
                            >
                              {element.nombre_categoria}
                            </option>
                          ))}
                        </>
                      )}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un Categoria
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-12">
                  <label
                      htmlFor="unidad_peso"
                      className="label-bold mb-2"
                    >
                    Unidad de Peso 
                    </label>
          
                   <select name="unidad_peso" id="unidad_peso" className="form-select form-control form-empty limpiar">
                   <option value="">Seleccione una opción</option>
                            <option value="kg">Kilo (Kg)</option>
                            <option value="lb">Libra (Lb)</option>
                            <option value="gr">Gramo (Gr)</option>
                            <option value="lt">Litro (Lt)</option>
                            <option value="ml">Mililitro (Ml)</option>
                   </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, la Unidad de peso 
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
        id="actualizarModal"
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
                      Nombre{" "}
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
                      Por favor, ingrese el nombre
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
                      <option value="">Selecciona un Tipo</option>
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
                      Por favor, seleccione un tipo de producto.
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-12">
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
        
                    > <option value="">Seleccione una opción</option>
                    <option value="kg">Kilo (Kg)</option>
                    <option value="lb">Libra (Lb)</option>
                    <option value="gr">Gramo (Gr)</option>
                    <option value="lt">Litro (Lt)</option>
                    <option value="ml">Mililitro (Ml)</option>
           </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor,  unidad de peso 
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
                Close
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
