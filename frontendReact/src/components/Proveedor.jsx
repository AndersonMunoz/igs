import React, { useEffect, useRef, useState } from "react";
import "../style/Style.css";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import { IconEdit, IconTrash, IconFileDescription } from "@tabler/icons-react";
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
import * as xlsx from "xlsx";
import jsPDF from "jspdf";
import portConexion from "../const/portConexion";
import { dataDecript } from "./encryp/decryp";


const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const proveedor = () => {
  const tableRef = useRef(null);
  const [proveedor, setProveedor] = useState([]);
  const [modal, setModal] = useState(false);
  const [selectedProveedorData, setSelectedProveedorData] = useState(null);
  const [nombre_proveedores, setNombre_proveedores] = useState("");
  const [direccion_proveedores, setDireccion_proveedores] = useState("");
  const [contrato_proveedores, setContrato_proveedores] = useState("");
  const [telefono_proveedores, setTelefono_proveedores] = useState("");
  const [inicio_contrato, setinicio_contrato] = useState('');
  const [fin_contrato, setfin_contrato] = useState("");
  const [userRoll, setUserRoll] = useState("");
  const [archivo_contrato, setArchivo_contrato] = useState(null);

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
      { title: "Nombre", dataKey: "nombre_proveedores" },
      { title: "Telefono", dataKey: "telefono_proveedores" },
      { title: "Dirección", dataKey: "direccion_proveedores" },
      { title: "Contrato", dataKey: "contrato_proveedores" },
      { title: "Estado", dataKey: "estado" },
      {title: "Inicio contrato", dataKey: "Inicio"},
      {title: "Fin contrato", dataKey: "fin"},
    ];

    // Obtener los datos de la tabla
    const tableData = proveedor.map((element) => ({
      nombre_proveedores: element.nombre_proveedores,
      telefono_proveedores: element.telefono_proveedores,
      direccion_proveedores: element.direccion_proveedores,
      contrato_proveedores: element.contrato_proveedores,
      estado: element.estado == 1 ? "activo": "inactivo",
      Inicio: Validate.formatFecha(element.inicio_contrato),
      fin : Validate.formatFecha(element.fin_contrato)
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
      "Nombre",
      "Telefono",
      "Dirección",
      "Contrato",
      "Estado",
      "Inicio contrato",
      "Fin contrato"
    ];
    wsData.push(columns);

    // Obtener los datos de las filas
    proveedor.forEach((element) => {
      const rowData = [
        element.nombre_proveedores,
        element.telefono_proveedores,
        element.direccion_proveedores,
        element.contrato_proveedores,
        element.estado== 1 ? "Activo":"Inactivo",
        Validate.formatFecha(element.inicio_contrato),
        Validate.formatFecha(element.fin_contrato)
      ];
      wsData.push(rowData);
    });

    return wsData;
  };

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
        order: [[8, "asc"]],
      });
    }
  }, [proveedor]);

  useEffect(() => {
    window.onpopstate = function () {
      window.location.reload();
    };
    setUserRoll(dataDecript(localStorage.getItem("roll")));
    listarProveedor();
  }, []);

  function listarProveedor() {
    fetch(`http://${portConexion}:3000/proveedor/listar`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          data.forEach((item) => {
            const fechaActual = new Date();
            const dia = fechaActual.getDay() - 1;
            const fechafin = new Date(item.fin_contrato);
            const diaFin = fechafin.getDay();
            if (fechafin < fechaActual) {
              if (dia == diaFin) {
                if (item.estado == 1) {
                  vencioProveedor(item.id_proveedores);
                }
              }
            }
          });
          setProveedor(data);
        }
        if (data.status === 500) {
          Sweet.error(data.message);
        }
      })

      .catch((e) => {
        Sweet.error(e);
      });
  }

  function vencioProveedor(id) {
    fetch(`http://${portConexion}:3000/proveedor/eliminar/${id}`, {
      method: "put",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          Sweet.exito("Proveedor deshabilitado por fecha de fin de contrato");
          listarProveedor();
        } else {
          Sweet.error(data.message);
        }
      });
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
            if (data.status === 200) {
              Sweet.exito(data.message);
              listarProveedor();
            } else {
              Sweet.error(data.message);
            }
          });
      }
    });
  }

  function registrarProveedor(e) {
    e.preventDefault();
    const validacionExitosa = Validate.validarCampos(".form-empty");
    if (validacionExitosa) {
      const formData = new FormData();
      formData.append('nombre_proveedores', nombre_proveedores)
      formData.append('telefono_proveedores', telefono_proveedores)
      formData.append('direccion_proveedores', direccion_proveedores)
      formData.append('inicio_contrato', inicio_contrato)
      formData.append('fin_contrato', fin_contrato)
      formData.append('contrato_proveedores', contrato_proveedores)
      formData.append('archivo_contrato', document.getElementById('archivo_contrato').files[0]);

      fetch(`http://${portConexion}:3000/proveedor/registrar`, {
        method: "POST",
        headers: {
          "token": localStorage.getItem("token")
        },
        body: formData,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status === 200) {
            Sweet.exito(data.message);
            listarProveedor();
            limpiar();
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
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }

  function editarProveedor(id) {
    document.getElementById("titleSctualizar").classList.remove("d-none");
    document.getElementById("titleRegistro").classList.add("d-none");
    document.getElementById("btnAgregar").classList.add("d-none");
    document.getElementById("btnActualizar").classList.remove("d-none");
    document.getElementById("divArchContrato").classList.add("d-none");
    document.getElementById("numContrato").classList.add("d-none");

    fetch(`http://${portConexion}:3000/proveedor/buscar/${id}`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setSelectedProveedorData(data[0]);
          setNombre_proveedores(data[0].nombre_proveedores)
          setDireccion_proveedores(data[0].direccion_proveedores)
          setContrato_proveedores(data[0].contrato_proveedores)
          setTelefono_proveedores(data[0].telefono_proveedores)
          setinicio_contrato(formatDateYYYYMMDD(new Date(data[0].inicio_contrato)))
          setfin_contrato(formatDateYYYYMMDD(new Date(data[0].fin_contrato)))
        }
      });
  }
  function actualizarProveedor(id) {
    fetch(`http://${portConexion}:3000/proveedor/actualizar/${id}`, {
      method: "PUT",
      headers:{
        'Content-type':'application/json',
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({
        nombre_proveedores: nombre_proveedores,
        telefono_proveedores: telefono_proveedores,
        direccion_proveedores: direccion_proveedores,
        inicio_contrato: inicio_contrato,
        fin_contrato: fin_contrato,
        contrato_proveedores: contrato_proveedores
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 200) {
          Sweet.exito(data.message);
          listarProveedor();
          limpiar();  
        } else {
          if (data.status === 403) {
            Sweet.error(data.error.errors[0].msg);
          } else {
            Sweet.error(data.message);
          }
        }
      });
  }
  function limpiar() {
    setSelectedProveedorData('');
    setNombre_proveedores('')
    setDireccion_proveedores('')
    setContrato_proveedores('')
    setTelefono_proveedores('')
    setinicio_contrato('')
    setfin_contrato('')
    setArchivo_contrato('')
  }
  function generarURL(element) {
    // Realiza cualquier lógica necesaria para generar la URL
    const url = `/filePDF/${element}`;
    return url;
  }

  return (
    <div>
      <div className="boxBtnContendidoTitulo">
        <div className="btnContenido1">
          {userRoll == "administrador" && (
            <button type="button" id="modalProducto" className="btn-color btn" data-bs-toggle="modal" data-bs-target="#exampleModal"
              onClick={() => {
                document.getElementById("titleSctualizar").classList.add("d-none");
                document.getElementById("titleRegistro").classList.remove("d-none");
                document.getElementById("btnAgregar").classList.remove("d-none");
                document.getElementById("btnActualizar").classList.add("d-none");
                document.getElementById("divArchContrato").classList.remove("d-none");
                document.getElementById("numContrato").classList.remove("d-none");
              }}>
              Registrar Proveedor
            </button>
          )}
        </div>
        <div className="btnContenido22">
          <h2 className="tituloHeaderpp">Proveedor</h2>
        </div>
        <div className="btnContenido3">
          <div className="btn-group" role="group" aria-label="Basic mixed styles example">
            <div className="" title="Descargar Excel">
              <button onClick={handleOnExport} type="button" className="btn btn-light">
                <img src={ExelLogo} className="logoExel" />
              </button>
            </div>
            <div className="" title="Descargar Pdf">
              <button type="button" className="btn btn-light" onClick={exportPdfHandler}>
                <img src={PdfLogo} className="logoExel" />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid w-full">
        <table id="dtBasicExample" className="table table-striped table-bordered border display responsive nowrap b-4" ref={tableRef} cellSpacing={0} width="100%">
          <thead className="text-center">
            <tr>
              <th className="th-sm">Numero</th>
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Teléfono</th>
              <th className="th-sm">Dirección</th>
              <th className="th-sm">Contrato</th>
              <th className="th-sm">Estado</th>
              <th className="th-sm">Inicio de contrato</th>
              <th className="th-sm">Fin de contrato</th>

              <th className="th-sm text-center">Acciones</th>
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
                    {userRoll == "administrador" ? (
                      <td className="p-0">
                        {element.estado !== 1 ? (
                          <div>
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={() => window.open(generarURL(element.archivo_contrato), '_blank')}
                            >
                              <IconFileDescription />
                            </button>

                          </div>

                        ) : (
                          <>
                            <button
                              className="btn btn-primary"
                              type="button"
                              onClick={() => window.open(generarURL(element.archivo_contrato), '_blank')}
                            >
                              <IconFileDescription />
                            </button>

                            <button type="button" className="btn-color btn mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setModal(true); editarProveedor(element.id_proveedores); }}>
                              <IconEdit />
                            </button>
                            <button className="btn btn-danger" type="button" onClick={() => deshabilitarProveedor(element.id_proveedores)}>
                              <IconTrash />
                            </button>
                          </>
                        )}
                      </td>
                    ) : (
                      <td>No disponible</td>
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
      <div className="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: modal == true ? "block" : "none" }}>
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h1 className="modal-title fs-5" id="titleRegistro">
                Registro Proveedor
              </h1>
              <h1 className="modal-title fs-5 d-none" id="titleSctualizar">
                Actualizar proveedor
              </h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close" onClick={() => limpiar()}></button>
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
                <form className="text-center border border-light" encType='multipart/form-data' onSubmit={registrarProveedor}>
                  <div className="d-flex form-row mb-4">
                    <div className="col">
                      <label htmlFor="nombre_proveedores">Nombres</label>
                      <input value={nombre_proveedores} onChange={(e) => { setNombre_proveedores(e.target.value); }} type="text" id="nombre_proveedores" name="nombre_proveedores" className="form-control form-empty limpiar" placeholder="Nombres" required />
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                    <div className="col ms-3">
                      <label htmlFor="direccion_proveedores">Direccion</label>
                      <input value={direccion_proveedores} onChange={(e) => { setDireccion_proveedores(e.target.value); }} type="text" id="direccion_proveedores" name="direccion_proveedores" className="form-control form-empty limpiar" placeholder="Direccion"></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex form-row mb-4">
                    <div id="numContrato" className="col me-3">
                      <label htmlFor="contrato_proveedores">N° Contrato</label>
                      <input value={contrato_proveedores} onChange={(e) => { setContrato_proveedores(e.target.value); }} type="text" name="contrato_proveedores" id="contrato_proveedores" className="form-control form-empty  limpiar" placeholder="N° de contrato"></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                    <div className="col">
                      <label htmlFor="telefono_proveedores">Telefono</label>
                      <input value={telefono_proveedores} onChange={(e) => { setTelefono_proveedores(e.target.value); }} type="text" name="telefono_proveedores" id="telefono_proveedores" className="form-control form-empty limpiar" placeholder="Telefono" aria-describedby="defaultRegisterFormPhoneHelpBlock"></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>

                  <div className="d-flex form-row mb-1">
                    <div className="col">
                      <label htmlFor="inicio_contrato">Inicio de contrato</label>
                      <input value={inicio_contrato} onChange={(e) => { setinicio_contrato(e.target.value); }} type="date" name="inicio_contrato" id="inicio_contrato" className="form-control form-empty  limpiar" placeholder="N° de contrato"></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                    <div className="col ms-3">
                      <label htmlFor="fin_contrato">Fin de contrato</label>
                      <input value={fin_contrato} onChange={(e) => { setfin_contrato(e.target.value); }} type="date" name="fin_contrato" id="fin_contrato" className="form-control form-empty limpiar" placeholder="Telefono" aria-describedby="defaultRegisterFormPhoneHelpBlock"></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>

                  <div id="divArchContrato" className="d-flex form-row mb-1 mt-3">
                    <div className="col">
                      <label htmlFor="archivo_contrato">Archivo de contrato</label>
                      <input onChange={(e) => { const { value } = e.target; setArchivo_contrato(value); }} type="file" name="archivo_contrato" id="archivo_contrato" className="form-control form-empty limpiar" placeholder="file Pdf" />
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex gap-1 justify-content-end mt-3">

                    <button id="btnActualizar" type="button" className="btn btn-color d-none"
                      onClick={() => { actualizarProveedor(selectedProveedorData.id_proveedores); limpiar(); }}>
                      Actualizar
                    </button>

                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => limpiar()}>
                      Cerrar
                    </button>

                    <button id="btnAgregar" type="submit" className="btn btn-color">Enviar</button>

                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default proveedor;
