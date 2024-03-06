import React, { useEffect, useRef, useState } from "react";
import "../style/Style.css";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import { IconEdit, IconTrash } from "@tabler/icons-react";
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
import { DownloadTableExcel } from "react-export-table-to-excel";
import * as xlsx from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import portConexion from "../const/portConexion";
import { dataDecript } from "./encryp/decryp";

const proveedor = () => {
  const tableRef = useRef();
  const [proveedor, setProveedor] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProveedorData, setSelectedProveedorData] = useState(null);
  const [nombre_proveedores, setNombre_proveedores] = useState("");
  const [direccion_proveedores, setDireccion_proveedores] = useState("");
  const [contrato_proveedores, setContrato_proveedores] = useState("");
  const [telefono_proveedores, setTelefono_proveedores] = useState("");
  const [inicio_contrato, setContratoInicio] = useState("");
  const [fin_contrato, setContratoFin] = useState("");
  const [userRoll, setUserRoll] = useState("");

  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, "ExcelTotal");
    xlsx.writeFile(wb, "Proveedores.xlsx");
  };
  const exportPdfHandler = () => {
    const doc = new jsPDF();

    const columns = [
      { title: "N°", dataKey: "id_proveedores" },
      { title: "Nombre", dataKey: "nombre_proveedores" },
      { title: "Telefono", dataKey: "telefono_proveedores" },
      { title: "Dirección", dataKey: "direccion_proveedores" },
      { title: "Contrato", dataKey: "contrato_proveedores" },
      { title: "Estado", dataKey: "estado" },
    ];

    // Obtener los datos de la tabla
    const tableData = proveedor.map((element) => ({
      id_proveedores: element.id_proveedores,
      nombre_proveedores: element.nombre_proveedores,
      telefono_proveedores: element.telefono_proveedores,
      direccion_proveedores: element.direccion_proveedores,
      contrato_proveedores: element.contrato_proveedores,
      estado: element.estado,
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
    doc.save("Proveedores.pdf");
  };
  const getTableData = () => {
    const wsData = [];

    // Obtener las columnas
    const columns = [
      "N°",
      "Nombre",
      "Telefono",
      "Dirección",
      "Contrato",
      "Estado",
    ];
    wsData.push(columns);

    // Obtener los datos de las filas
    proveedor.forEach((element) => {
      const rowData = [
        element.id_proveedores,
        element.nombre_proveedores,
        element.telefono_proveedores,
        element.direccion_proveedores,
        element.contrato_proveedores,
        element.estado,
      ];
      wsData.push(rowData);
    });

    return wsData;
  };

  function removeFond() {
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
      setModal(false);
      console.log(modal);
    }
  }

  useEffect(() => {
    if (proveedor.length > 0) {
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
        lengthMenu: [
          [10, 50, 100, -1],
          ["10 Filas", "50 Filas", "100 Filas", "Ver Todo"],
        ],
      });
    }
  }, [proveedor]);

  useEffect(() => {
    setUserRoll(dataDecript(localStorage.getItem("roll")));
    listarProveedor();
  }, []);

  function listarProveedor() {
    fetch(`http://${portConexion}:3000/proveedor/listar`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedor(data);
        if (data.status === 500) {
          Sweet.error(data.message);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function registrarProveedor() {
    const validacionExitosa = Validate.validarCampos(".form-empty");
    console.log(contratoInicio);
    if (validacionExitosa) {
      fetch(`http://${portConexion}:3000/proveedor/registrar`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
        },
        body: JSON.stringify({
          nombre_proveedores,
          direccion_proveedores,
          contrato_proveedores,
          telefono_proveedores,
          inicio_contrato,
          fin_contrato,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status === 200) {
            Sweet.exito(data.message);
            listarProveedor();
            removeFond();
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
              $(tableRef.current).DataTable().destroy();
            }
          } else {
            if (data.status === 403) {
              Sweet.error(data.error.errors[0].msg);
            } else {
              Sweet.error(data.message);
            }
          }
        });
    }
  }
  function deshabilitarProveedor(id) {
    Sweet.confirmacion().then((res) => {
      if (res.isConfirmed) {
        fetch(`http://${portConexion}:3000/proveedor/eliminar/${id}`, {
          method: "put",
          headers: {
            "Content-type": "application/json",
            token: localStorage.getItem("token"),
          },
        })
          .then((res) => res.json())
          .then((data) => {
            listarProveedor();
            if (data.status === 200) {
              Sweet.exito(data.message);
            } else {
              Sweet.error(data.message);
            }
          });
      }
    });
  }

  function editarProveedor(id) {
    document.getElementById("titleSctualizar").classList.remove("d-none");
    document.getElementById("titleRegistro").classList.add("d-none");
    document.getElementById("btnAgregar").classList.add("d-none");
    document.getElementById("btnActualizar").classList.remove("d-none");
    fetch(`http://localhost:3000/proveedor/buscar/${id}`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setSelectedProveedorData(data[0]);
          document.getElementById("nombresProveedor").value =
            data[0].nombre_proveedores;
          document.getElementById("direccionProveedor").value =
            data[0].direccion_proveedores;
          document.getElementById("contratoProveedor").value =
            data[0].contrato_proveedores;
          document.getElementById("telefonoProveedor").value =
            data[0].telefono_proveedores;
          document.getElementById("contratoInicio").value = formtDate(
            data[0].inicio_contrato
          );
          document.getElementById("contratoFin").value = formtDate(
            data[0].fin_contrato
          );
        } else {
          listarProveedor();
        }
      });
  }
  function actualizarProveedor(id) {
    fetch(`http://${portConexion}:3000/proveedor/actualizar/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        nombre_proveedores,
        direccion_proveedores,
        contrato_proveedores,
        telefono_proveedores,
        inicio_contrato,
        fin_contrato,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          Sweet.exito(data.message);
          listarProveedor();
          removeFond();
        } else {
          if (data.status === 403) {
            Sweet.error(data.error.errors[0].msg);
          } else {
            Sweet.error(data.message);
          }
        }
      });
  }
  return (
    <div>
      <div className="d-flex justify-content-between mt-4">
        <div>
          {userRoll == "Administrador" && (
            <button
              type="button"
              id="modalProducto"
              className="btn-color btn mb-4"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
              onClick={() => {
                setModal(true);
                Validate.limpiar(".limpiar");
                document
                  .getElementById("titleSctualizar")
                  .classList.add("d-none");
                document
                  .getElementById("titleRegistro")
                  .classList.remove("d-none");
                document
                  .getElementById("btnAgregar")
                  .classList.remove("d-none");
                document
                  .getElementById("btnActualizar")
                  .classList.add("d-none");
              }}
            >
              Registrar Nuevo Proveedor
            </button>
          )}
        </div>
        <div
          className="btn-group"
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
      <div className="container-fluid w-full">
        <table
          id="dtBasicExample"
          className="table table-striped table-bordered border display responsive nowrap b-4"
          ref={tableRef}
          cellSpacing={0}
          width="100%"
        >
          <thead className="text-center">
            <tr>
              <th className="th-sm">N°</th>
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Teléfono</th>
              <th className="th-sm">Dirección</th>
              <th className="th-sm">Contrato</th>
              <th className="th-sm">Estado</th>
              <th className="th-sm">Inicio de contrato</th>
              <th className="th-sm">Fin de contrato</th>
              {userRoll == "Administrador" && (
                <th className="th-sm text-center">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody id="tableProveedores" className="text-center">
            {proveedor.length > 0 ? (
              <>
                {proveedor.map((element, index) => (
                  <tr key={element.id_proveedores}>
                    <td>{index + 1}</td>
                    <td>{element.nombre_proveedores}</td>
                    <td>{element.telefono_proveedores}</td>
                    <td>{element.direccion_proveedores}</td>
                    <td>{element.contrato_proveedores}</td>
                    <td>{element.estado === 1 ? "Activo" : "Inactivo"}</td>
                    <td>{Validate.formatFecha(element.inicio_contrato)}</td>
                    <td>{Validate.formatFecha(element.fin_contrato)}</td>
                    {userRoll == "Administrador" && (
                      <td>
                        {element.estado !== 1 ? (
                          "NO DISPONIBLES"
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn-color btn mx-2"
                              data-bs-toggle="modal"
                              data-bs-target="#exampleModal"
                              onClick={() => {
                                setModal(true);
                                editarProveedor(element.id_proveedores);
                              }}
                            >
                              <IconEdit />
                            </button>
                            <button
                              className="btn btn-danger"
                              type="button"
                              onClick={() =>
                                deshabilitarProveedor(element.id_proveedores)
                              }
                            >
                              <IconTrash />
                            </button>
                          </>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2>
                        {" "}
                        En este momento no contamos con ningún proveedor
                        disponible.😟
                      </h2>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* desde aqui el modal */}
      <div
        className="modal fade"
        id="exampleModal"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
        style={{ display: modal == true ? "block" : "none" }}
      >
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h1 className="modal-title fs-5" id="titleRegistro">
                Registro Proveedor
              </h1>
              <h1 className="modal-title fs-5 d-none" id="titleSctualizar">
                Actualizar proveedor
              </h1>
              <button
                type="button"
                className="btn-close text-white bg-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
                <form className="text-center border border-light" action="#!">
                  <div className="d-flex form-row mb-4">
                    <div className="col">
                      <label htmlFor="nombresProveedor">Nombres</label>
                      <input
                        onChange={(e) => {
                          setNombre_proveedores(e.target.value);
                        }}
                        type="text"
                        id="nombresProveedor"
                        name="nombresProveedor"
                        className="form-control form-empty limpiar"
                        placeholder="Nombres"
                        required
                      ></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                    <div className="col ms-3">
                      <label htmlFor="direccionProveedor">Direccion</label>
                      <input
                        onChange={(e) => {
                          setDireccion_proveedores(e.target.value);
                        }}
                        type="text"
                        id="direccionProveedor"
                        name="direccionProveedor"
                        className="form-control form-empty limpiar"
                        placeholder="Direccion"
                      ></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex form-row mb-4">
                    <div className="col">
                      <label htmlFor="contratoProveedor">N° Contrato</label>
                      <input
                        onChange={(e) => {
                          setContrato_proveedores(e.target.value);
                        }}
                        type="text"
                        name="contratoProveedor"
                        id="contratoProveedor"
                        className="form-control form-empty  limpiar"
                        placeholder="N° de contrato"
                      ></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                    <div className="col ms-3">
                      <label htmlFor="">Telefono</label>
                      <input
                        onChange={(e) => {
                          setTelefono_proveedores(e.target.value);
                        }}
                        type="text"
                        name="telefonoProveedor"
                        id="telefonoProveedor"
                        className="form-control form-empty limpiar"
                        placeholder="Telefono"
                        aria-describedby="defaultRegisterFormPhoneHelpBlock"
                      ></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>

                  <div className="d-flex form-row mb-1">
                    <div className="col">
                      <label htmlFor="contratoInicio">Inicio de contrato</label>
                      <input
                        onChange={(e) => {
                          setContratoInicio(e.target.value);
                        }}
                        type="date"
                        name="contratoInicio"
                        id="contratoInicio"
                        className="form-control form-empty  limpiar"
                        placeholder="N° de contrato"
                      ></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                    <div className="col ms-3">
                      <label htmlFor="contratoFin">Fin de contrato</label>
                      <input
                        onChange={(e) => {
                          setContratoFin(e.target.value);
                        }}
                        type="date"
                        name="contratoFin"
                        id="contratoFin"
                        className="form-control form-empty limpiar"
                        placeholder="Telefono"
                        aria-describedby="defaultRegisterFormPhoneHelpBlock"
                      ></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>
                </form>
              </div>
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
                id="btnAgregar"
                type="button"
                className="btn btn-color"
                onClick={registrarProveedor}
              >
                Agregar
              </button>
              <button
                id="btnActualizar"
                type="button"
                className="btn btn-color d-none"
                onClick={() =>
                  actualizarProveedor(selectedProveedorData.id_proveedores)
                }
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
export default proveedor;
