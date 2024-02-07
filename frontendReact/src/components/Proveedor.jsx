import React, { useEffect, useRef, useState } from "react";
import "../style/proveedor.css";
import Sweet from "../helpers/Sweet2";
import Validate from "../helpers/Validate";
import $ from 'jquery';
import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
import 'datatables.net-bs4';


const proveedor = () => {
  const tableRef = useRef();
  const [proveedor, setProveedor] = useState([]);
  const [search, setSeach] = useState('');
  const [modal, setModal] = useState(false);
  const [selectedProveedorData, setSelectedProveedorData] = useState(null);

  function removeFond() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
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

      $(tableRef.current).DataTable();
    }
  }, [proveedor]);

  useEffect(() => {
    listarProveedor();
  }, []);

  function listarProveedor() {
    fetch('http://localhost:3000/proveedor/listar', {
      method: 'get',
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedor(data)
        if (data.status === 500) {
          Sweet.error(  data.message)
        }
      })
      .catch((e) => {
        console.log(e);
      })
  }

  function registrarProveedor() {
    const validacionExitosa = Validate.validarCampos('.form-empty');
    let nombre_proveedores = document.getElementById('nombresProveedor').value;
    let direccion_proveedores = document.getElementById('direccionProveedor').value;
    let contrato_proveedores = document.getElementById('contratoProveedor').value;
    let telefono_proveedores = document.getElementById('telefonoProveedor').value;

    if (validacionExitosa) {
      fetch('http://localhost:3000/proveedor/registrar', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nombre_proveedores, direccion_proveedores, contrato_proveedores, telefono_proveedores }),
      })
        .then((res) => res.json())
        .then(data => {

          if (data.status === 200) {
            Sweet.exito(  data.message);
            listarProveedor();
            removeFond();
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
              $(tableRef.current).DataTable().destroy()
            }
          } else {
            if (data.status === 403) {
              Sweet.error(  data.error.errors[0].msg)
            } else {
              Sweet.error(  data.message)
            }
          }
        })
    }
  }
  function deshabilitarProveedor(id) {
    Sweet.confirmacion().then((res) => {
      if (res.isConfirmed) {
        fetch(`http://localhost:3000/proveedor/eliminar/${id}`, {
          method: 'put',
          headers: {
            "Content-type": "application/json"
          }
        })
          .then(res => res.json())
          .then(data => {
            listarProveedor()
            if (data.status === 200) {
              Sweet.exito(  data.message)
            } else {
              Sweet.error(  data.message)
            }
          })
      }
    })
  }

  function editarProveedor(id) {
    document.getElementById('titleSctualizar').classList.remove('d-none');
    document.getElementById('titleRegistro').classList.add('d-none');
    document.getElementById('btnAgregar').classList.add('d-none');
    document.getElementById('btnActualizar').classList.remove('d-none');
    fetch(`http://localhost:3000/proveedor/buscar/${id}`, {
      method: 'get',
      headers: {
        "Content-type": "application/json"
      }
    })
      .then((res) => res.json())
      .then(data => {
        if (data.length > 0) {
          setSelectedProveedorData(data[0]);
          document.getElementById('nombresProveedor').value = data[0].nombre_proveedores;
          document.getElementById('direccionProveedor').value = data[0].direccion_proveedores;
          document.getElementById('contratoProveedor').value = data[0].contrato_proveedores;
          document.getElementById('telefonoProveedor').value = data[0].telefono_proveedores;
        } else {
          listarProveedor()
        }
      })
  }

  function actualizarProveedor(id) {
    let nombre_proveedores = document.getElementById('nombresProveedor').value;
    let direccion_proveedores = document.getElementById('direccionProveedor').value;
    let contrato_proveedores = document.getElementById('contratoProveedor').value;
    let telefono_proveedores = document.getElementById('telefonoProveedor').value;

    fetch(`http://localhost:3000/proveedor/actualizar/${id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_proveedores, direccion_proveedores, contrato_proveedores, telefono_proveedores }),
    })
      .then((res) => res.json())
      .then(data => {
        if (data.status === 200) {
          Sweet.exito(  data.message);
          listarProveedor();
          removeFond();
        } else {
          if (data.status === 403) {
            Sweet.error(  data.error.errors[0].msg)
          } else {
            Sweet.error(  data.message)
          }
        }
      })
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button type="button" id="modalProducto" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {
          setModal(true); Validate.limpiar('.limpiar');
          document.getElementById('titleSctualizar').classList.add('d-none');
          document.getElementById('titleRegistro').classList.remove('d-none');
          document.getElementById('btnAgregar').classList.remove('d-none');
          document.getElementById('btnActualizar').classList.add('d-none');
        }}>
          Registrar Nuevo Proveedor
        </button>
      </div>
      <div className="wrapper-editor">
        <table id="dtBasicExample" className="table table-striped table-bordered" ref={tableRef} cellSpacing={0}>
          <thead className="text-center">
            <tr>
              <th className="th-sm">N°</th>
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Telefono</th>
              <th className="th-sm">Direccion</th>
              <th className="th-sm">Contrato</th>
              <th className="th-sm">Estado</th>
              <th className="th'sm text-center">acciones</th>
            </tr>
          </thead>
          <tbody id="tableProveedores" className="text-center">
            {proveedor.length > 0 ? (
              <>
                {proveedor.filter((item) => search.toLowerCase() === '' ? item : item.nombre_proveedores.toLowerCase().includes(search)).map((element, index) => (
                  <tr key={element.id_proveedores}>
                    <td>{index + 1}</td>
                    <td>{element.nombre_proveedores}</td>
                    <td>{element.telefono_proveedores}</td>
                    <td>{element.direccion_proveedores}</td>
                    <td>{element.contrato_proveedores}</td>
                    <td>{element.estado === 1 ? 'Activo' : 'Inactivo'}</td>
                    <td>
                      {element.estado !== 1 ? 'NO DISPONIBLES' : (
                        <>
                          <button type="button" className="btn-color btn mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setModal(true); editarProveedor(element.id_proveedores) }}>
                            Editar
                          </button>
                          <button className="btn btn-danger" type="button" onClick={() => deshabilitarProveedor(element.id_proveedores)}>
                            Deshabilitar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2> En este momento no contamos con ningún proveedor disponible.😟</h2>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* desde aqui el modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: modal == true ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h1 className="modal-title fs-5" id="titleRegistro">Registro Proveedor</h1>
              <h1 className="modal-title fs-5 d-none" id="titleSctualizar">Actualizar proveedor</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
                <form className="text-center border border-light" action="#!">
                  <div className="d-flex form-row mb-4">
                    <div className="col">
                      <label htmlFor="nombresProveedor">Nombres</label>
                      <input type="text" id="nombresProveedor" name="nombresProveedor" className="form-control form-empty limpiar" placeholder="Nombres" required></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                    <div className="col ms-3">
                      <label htmlFor="direccionProveedor">Direccion</label>
                      <input type="text" id="direccionProveedor" name="direccionProveedor" className="form-control form-empty limpiar" placeholder="Direccion"></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex form-row mb-1">
                    <div className="col">
                      <label htmlFor="contratoProveedor">Contrato</label>
                      <input type="text" name="contratoProveedor" id="contratoProveedor" className="form-control form-empty  limpiar" placeholder="N° de contrato"></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                    <div className="col ms-3">
                      <label htmlFor="">Telefono</label>
                      <input type="text" name="telefonoProveedor" id="telefonoProveedor" className="form-control form-empty limpiar" placeholder="Telefono" aria-describedby="defaultRegisterFormPhoneHelpBlock"></input>
                      <div className="invalid-feedback is-invalid">
                        Este campo es obligatorio.
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button id="btnAgregar" type="button" className="btn btn-color" onClick={registrarProveedor} >Agregar</button>
              <button id="btnActualizar" type="button" className="btn btn-color d-none" onClick={() => actualizarProveedor(selectedProveedorData.id_proveedores)}>Actualizar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};
export default proveedor;