import React, { useEffect, useRef, useState } from "react";
import "../style/usuarios.css"
import { IconEdit, IconTrash, IconEye, IconEyeOff } from "@tabler/icons-react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';
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
import { DownloadTableExcel } from 'react-export-table-to-excel';
import generatePDF from 'react-to-pdf';

const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalUsuarioRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});
  const tableRef = useRef();
  const [showPassword, setShowPassword] = useState(false);



  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }



  useEffect(() => {
    if (usuarios.length > 0) {
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
  }, [usuarios]);


  useEffect(() => {
    listarUsuario()
  }, []);

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
  ///listar usuario
  function listarUsuario() {
    fetch("http://localhost:3000/usuario/listar", {
      method: "get",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function registrarUsuario() {
    let documento_usuario = document.getElementById('documento_usuario').value
    let email_usuario = document.getElementById('email_usuario').value
    let nombre_usuario = document.getElementById('nombre_usuario').value
    let contrasena_usuario = document.getElementById('contrasena_usuario').value
    let tipo_usuario = document.getElementById('tipo_usuario').value

    const validacionExitosa = Validate.validarCampos('.form-empty');

    fetch('http://localhost:3000/usuario/registrar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ documento_usuario, email_usuario, nombre_usuario, contrasena_usuario, tipo_usuario })
    })
      .then((res) => res.json())
      .then(data => {
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
        if (data.status !== 200) {
          Sweet.error(data.error.errors[0].msg);
          return;
        }
        console.log(data);
        listarUsuario();
        setShowModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      })
      .catch(error => {
        console.error('Error registro fallido:', error);
      });
  }
  ///eliminar
  function eliminarUsuario(id_usuario) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/usuario/deshabilitar/${id_usuario}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json"
          }
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status === 200) {
              Sweet.deshabilitadoExitoso();
            }
            if (data.status === 401) {
              Sweet.deshabilitadoFallido();
            }

            console.log(data);
            listarUsuario();
            setShowModal(false);
            removeModalBackdrop();
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
              modalBackdrop.remove();
            }
          })
          .catch(error => {
            console.error('Error usuario no medificado:', error);
          });
      }
    });
  }
  function activarUsuario(id_usuario) {
    Sweet.confirmacionActivar().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/usuario/activar/${id_usuario}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json"
          }
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status === 200) {
              Sweet.habilitadoExitoso();
            }
            if (data.status === 401) {
              Sweet.habilitadoFallido();
            }
            listarUsuario();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }
  function editarUsuario(id) {
    fetch(`http://localhost:3000/usuario/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setUsuarioSeleccionado(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  function actualizarUsuario(id) {
    const validacionExitosa = Validate.validarCampos('.form-update');
    fetch(`http://localhost:3000/usuario/editar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(usuarioSeleccionado),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.actualizacionFallido();
          return;
        }
        if (data.status == 200) {
          Sweet.actualizacionExitoso();
        }
        if (data.status == 401) {
          Sweet.actualizacionFallido();
        }
        listarUsuario();
        setUpdateModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button type="button" id="modalUsuario" className="bgfondo btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
          onClick={() => {
            setShowModal(true);
            Validate.limpiar('.limpiar')
          }}>
          Registrar Usuario
        </button>
        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
          <div className="" title="Descargar Excel">
            <DownloadTableExcel
              filename="Usuarios Detalles Excel"
              sheet="Usuarios"
              currentTableRef={tableRef.current}
            ><button type="button" className="btn btn-light">
                <img src={ExelLogo} className="logoExel" />
              </button></DownloadTableExcel>
          </div>
          <div className="" title="Descargar Pdf">
            <button type="button" className="btn btn-light" onClick={() => generatePDF(tableRef, { filename: "Usuarios Detalles table.pdf" })}
            ><img src={PdfLogo} className="logoExel" />
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
          <thead className="text-center text-justify">
            <tr>
              <th className="th-sm">#</th>
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Documento</th>
              <th className="th-sm">Correo Electrónico</th>
              <th className="th-sm">Cargo</th>
              <th className="th-sm">Acciones</th>
            </tr>
          </thead>
          <tbody id="listarUsuario" className="text-center cell">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2> En este momento no contamos con ningún usuario disponible.😟</h2>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {usuarios.map((element, index) => (
                  <tr key={element.id_usuario}>
                    <td>{index + 1}</td>
                    <td>{element.nombre_usuario}</td>
                    <td>{element.documento_usuario}</td>
                    <td>{element.email_usuario}</td>
                    <td>{element.tipo_usuario}</td>
                    <td className="p-0">
                      {element.estado === 1 ? (
                        <>
                          <button className="btn btn-color mx-2" onClick={() => { setUpdateModal(true); editarUsuario(element.id_usuario); }} data-bs-toggle="modal" data-bs-target="#staticBackdrop2">
                            <IconEdit />
                          </button>
                          <button className="btn btn-danger" onClick={() => eliminarUsuario(element.id_usuario)
                          }> <IconTrash /></button>
                        </>
                      ) : (
                        <button className="btn btn-primary" onClick={() => activarUsuario(element.id_usuario)}>Activar</button>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            )}

          </tbody>
        </table>
      </div>


      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" ref={modalUsuarioRef} style={{ display: showModal ? 'block' : 'none' }} >
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h2 className="modal-title fs-5">Registrar Usuario</h2>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center">
                <form className="text-center border border-light ">
                  <div className="mb-3 row">
                    <div className="col-md-12 mb-2">
                      <label htmlFor="nombreUsuario" className="label-bold mb-2">
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="form-control form-empty limpiar"
                        id="nombre_usuario"
                        name="nombreUsuario"
                        placeholder="Ingrese su nombre"
                      />
                      <div className="invalid-feedback is-invalid">
                        Por favor, Ingresar un nombre valido.
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="documentoUsuario" className="label-bold mb-1">
                        Documento
                      </label>
                      <input
                        type="number"
                        className="form-control form-empty limpiar"
                        id="documento_usuario"
                        name="documentoUsuario"
                        placeholder="Ingrese su documento"
                      />
                      <div className="invalid-feedback is-invalid">
                        Por favor, Ingresar un documento valido
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="emailUsuario" className="label-bold mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        className="form-control form-empty limpiar"
                        id="email_usuario"
                        name="emailUsuario"
                        placeholder="Ingrese su email"
                      />
                      <div className="invalid-feedback is-invalid">
                        Por favor, Ingresar un correo valido
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="tipoUsuario" className="label-bold mb-2">
                        Cargo
                      </label>
                      <select
                        className="form-select form-control form-empty limpiar"
                        id="tipo_usuario"
                        name="tipoUsuario"
                        defaultValue=""
                      >
                        <option value="">Selecciona un cargo
                        </option>
                        <option value="administrador">Administrador</option>
                        <option value="coadministrador">Co-Administrador</option>
                      </select>
                      <div className="invalid-feedback is-invalid">
                        Por favor, selecciona un cargo
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="contrasenaUsuario" className="label-bold mb-2">
                        Contraseña
                      </label>
                      <div className="input-group">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control form-empty limpiar"
                          id="contrasena_usuario"
                          name="contrasenaUsuario"
                          placeholder="Ingrese una contraseña"
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.75" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                              <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                              <path d="M3 3l18 18" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.75" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                            </svg>}
                          </button>
                        </div>
                      </div>
                      <div className="invalid-feedback is-invalid">
                        Por favor, Ingresar una contraseña válida debe tener una mayúscula, minúscula y un número
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
              <button type="button" className="btn btn-color" onClick={registrarUsuario} >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* modal actualizar */}
      <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h2 className="modal-title fs-5">Actualizar Usuario</h2>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center">
                <form className="text-center border border-light ">
                  <div className="mb-3 row">
                    <div className="col-md-12 mb-2">
                      <label htmlFor="nombre_usuario" className="label-bold mb-2">
                        Nombre
                      </label>
                      <input type="hidden" value={usuarioSeleccionado.id_usuario || ''} onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, id_usuario: e.target.value })} disabled />
                      <input type="text" className="form-control form-update" placeholder="Ingrese su nombre" value={usuarioSeleccionado.nombre_usuario || ''} name="nombre_usuario" onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, nombre_usuario: e.target.value })} />
                      <div className="invalid-feedback is-invalid">
                        Por favor, Ingresar un nombre valido.
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="documento_usuario" className="label-bold mb-1">
                        Documento
                      </label>
                      <input type="hidden" value={usuarioSeleccionado.id_usuario || ''} onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, id_usuario: e.target.value })} disabled />
                      <input type="text" className="form-control form-update" placeholder="Ingrese su documento" value={usuarioSeleccionado.documento_usuario || ''} name="documento_usuario" onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, documento_usuario: e.target.value })} />
                      <div className="invalid-feedback is-invalid">
                        Por favor, Ingresar un documento valido
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="email_usuario" className="label-bold mb-2">
                        Correo Electrónico
                      </label>
                      <input type="hidden" value={usuarioSeleccionado.id_usuario || ''} onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, id_usuario: e.target.value })} disabled />
                      <input type="email" className="form-control form-update" placeholder="Ingrese su email" value={usuarioSeleccionado.email_usuario || ''} name="email_usuario" onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, email_usuario: e.target.value })} />
                      <div className="invalid-feedback is-invalid">
                        Por Favor, Ingresar un correo valido
                      </div>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="tipo_usuario" className="label-bold mb-2">
                        Cargo
                      </label>
                      <select
                        className="form-select form-control limpiar"
                        value={usuarioSeleccionado.tipo_usuario || ''} name="tipo_usuario" onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, tipo_usuario: e.target.value })}>
                        <option value="" disabled>
                          Seleccione un Cargo
                        </option>
                        <option value="administrador">Administrador</option>
                        <option value="coadministrador">Co-Administrador</option>
                      </select>
                    </div>
                    <div className="col-md-12 mb-2">
                      <label htmlFor="contrasena_usuario" className="label-bold mb-2">
                        Contraseña
                      </label>
                      <div className="input-group">
                        <input
                          type="hidden"
                          value={usuarioSeleccionado.id_usuario || ''}
                          onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, id_usuario: e.target.value })}
                          disabled />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className="form-control form-update"
                          onChange={(e) => setUsuarioSeleccionado({ ...usuarioSeleccionado, id_usuario: e.target.value })}
                          value={usuarioSeleccionado.contrasena_usuario || ''}
                          name="contrasena_suario"
                          placeholder="Ingrese una contraseña"
                        />
                        <div className="input-group-append">
                          <button
                            className="btn btn-secondary"
                            type="button"
                            onClick={togglePasswordVisibility}
                          >
                            {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye-off" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.75" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M10.585 10.587a2 2 0 0 0 2.829 2.828" />
                              <path d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87" />
                              <path d="M3 3l18 18" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-eye" width="24" height="24" viewBox="0 0 24 24" strokeWidth="1.75" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                              <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                              <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                            </svg>}
                          </button>
                        </div>
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
              <button type="button" className="btn btn-color" onClick={() => { actualizarUsuario(usuarioSeleccionado.id_usuario); }}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>


    </div >
  )
};

export default Usuario;