import React, { useEffect, useState, useRef } from "react";
import '../style/Proveedor.css'
import { IconSearch } from "@tabler/icons-react";
import Validate from '../helpers/Validate';
import Sweet from '../helpers/Sweet';
import { Result } from "express-validator";

const Proveedor = () => {
  const [Proveedores, setProveedor] = useState([]);
  const sortedProveedores = [...Proveedores].sort((a, b) => a.id_proveedores - b.id_proveedores);
  const [selectedProveedorData, setSelectedProveedorData] = useState(null);
  let validacionExitosa='';
 
  useEffect(() => {
    listarProveedor();
  }, []);

  function registrarProveedor() {
    const nombre_proveedores = document.getElementById('nombresProveedor').value;
    const telefono_proveedores = document.getElementById('telefonoProveedor').value;
    const direccion_proveedores = document.getElementById('direccionProveedor').value;
    const contrato_proveedores = document.getElementById('contratoProveedor').value;

     validacionExitosa= Validate.validarCampos('.form-empty')

    const requestBody = {
      telefono_proveedores,
      direccion_proveedores,
      contrato_proveedores,
      nombre_proveedores,
    };

    fetch("http://localhost:3000/proveedor/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        listarProveedor();
        if (!validacionExitosa) {
          Sweet.registroFallido
          return;
        }
        if (data.status == 200) {
          Sweet.registroExitoso()
        } else {
          Sweet.registroFallido()
        }
      })
      .catch((error) => {
        console.error("Error al registrar el proveedor:", error);
      });
  }
  function listarProveedor() {
    fetch("http://localhost:3000/proveedor/listar", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedor(data)
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function eliminarProveedor(id) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        const url = `http://localhost:3000/proveedor/eliminar/${id}`;
        fetch(url, {
          method: "put",
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 200) {
              Sweet.deshabilitadoExitoso();
            }
            if (data.status === 401) {
              Sweet.deshabilitadoFallido();
            }
            listarProveedor();
          })
          .catch((error) => {
            console.error("Error al eliminar el proveedor:", error);
          });
      }
    })
  }

  function editarProveedor(id) {
    const url = `http://localhost:3000/proveedor/buscar/${id}`;
    return fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setSelectedProveedorData(data[0]);
          document.getElementById('nombresProveedor').value = data[0].nombre_proveedores;
          document.getElementById('direccionProveedor').value = data[0].direccion_proveedores;
          document.getElementById('contratoProveedor').value = data[0].contrato_proveedores;
          document.getElementById('telefonoProveedor').value = data[0].telefono_proveedores;
          document.getElementById('btnAgregar').classList.add('d-none');
          document.getElementById('exampleModalLabel').classList.add('d-none');
          document.getElementById('btnActualizar').classList.remove('d-none');
          document.getElementById('titleSctualizar').classList.remove('d-none');
        } else {
          console.log('No hay datos para el ID:', id);
        }
      })
      .catch((error) => {
        console.error('Error al buscar el proveedor:', error);
      });
  }
  function buscarProveedor(id) {
    const url = `http://localhost:3000/proveedor/buscar/${id}`;
    return fetch(url, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedor(data)
        document.getElementById('btnActivar').classList.remove('d-none');
      })
      .catch((error) => {
        console.error('Error al buscar el proveedor:', error);
        throw error;
      });
  }
  function actualizarProveedor(id) {
    const nombre_proveedores = document.getElementById('nombresProveedor').value;
    const telefono_proveedores = document.getElementById('telefonoProveedor').value;
    const direccion_proveedores = document.getElementById('direccionProveedor').value;
    const contrato_proveedores = document.getElementById('contratoProveedor').value;
    const requestBody = {
      telefono_proveedores,
      direccion_proveedores,
      contrato_proveedores,
      nombre_proveedores,
    };
    fetch(`http://localhost:3000/proveedor/actualizar/${id}`, {
      method: "Put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status == 200) {
          Sweet.actualizacionExitoso()
        } else {
          Sweet.actualizacionFallido()
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el proveedor:", error);
      });
  }

  function limpiarModal() {
    Validate.limpiar('.limpiar')
    document.getElementById('btnAgregar').classList.remove('d-none');
    document.getElementById('exampleModalLabel').classList.remove('d-none');
    document.getElementById('btnActualizar').classList.add('d-none');
    document.getElementById('titleSctualizar').classList.add('d-none');
  }

  return (
    <>
      <div>
        <h1 className="text-center">Proveedores</h1>


        <div className="d-flex justify-content-between">
          <button type="button" className="btn-color btn  mb-4 " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={limpiarModal}>
            Registrar nuevo Proveedor
          </button>
          <div className="d-flex align-items-center">
            <input id="buscarProveedorId" type="text" placeholder="Buscar un proveedor" className="input-buscar" />
            <IconSearch className="iconSearch" onClick={() => buscarProveedor(document.getElementById('buscarProveedorId').value)} />
          </div>
        </div>
      </div>
      <div className="wrapper-editor">
        <table id="dtBasicExample" className="table table-striped table-bordered" cellSpacing={0} width="100%">
          <thead className="text-center">
            <tr>
              <th className="th-sm">Id</th>
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Telefono</th>
              <th className="th-sm">Direccion</th>
              <th className="th-sm">Contrato</th>
              <th className="th-sm">Estado</th>
              <th className="th'sm">acciones</th>
            </tr>
          </thead>
          <tbody id="tableProveedores" className="text-center">
            {sortedProveedores.map((element, index) => (
              <tr key={element.id_proveedores}>
                <td>{element.id_proveedores}</td>
                <td>{element.nombre_proveedores}</td>
                <td>{element.telefono_proveedores}</td>
                <td>{element.direccion_proveedores}</td>
                <td>{element.contrato_proveedores}</td>
                <td>
                  {element.estado === 1 ? 'Activo' : 'Deshabilitado'}
                </td>
                <td>
                  {element.estado !== 1 ? 'NO DISPONIBLES' : (
                    <>
                      <button type="button" className="btn-color btn mx-2" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => editarProveedor(element.id_proveedores)}>
                        Editar
                      </button>
                      <button className="btn btn-danger" type="button" onClick={() => eliminarProveedor(element.id_proveedores)}>
                        Deshabilitar
                      </button>

                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Registro Proveedor</h1>
              <h1 className="modal-title fs-5 d-none" id="titleSctualizar">Actualizar proveedor</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
                <form className="text-center border border-light" action="#!">
                  <div className="d-flex form-row mb-4">
                    <div className="col">
                      <h2 className="fs-5">Nombres</h2>
                      <input type="text" id="nombresProveedor" className="form-control form-empty limpiar" placeholder="Nombres" required></input>
                      <div className="invalid-feedback is-invalid">
                        Por favor, ingrese un nombre valido
                      </div>
                    </div>
                    <div className="col ms-3">
                      <h2 className="fs-5">Direccion</h2>
                      <input type="text" id="direccionProveedor" className="form-control form-empty limpiar" placeholder="Direccion"></input>
                      <div className="invalid-feedback is-invalid">
                        Error en la direccion.
                      </div>
                    </div>
                  </div>
                  <div className="d-flex form-row mb-1">
                    <div className="col">
                      <h2 className="fs-5">Contrato</h2>
                      <input type="text" id="contratoProveedor" className="form-control form-empty mb-4 limpiar" placeholder="N° de contrato"></input>
                      <div className="invalid-feedback is-invalid">
                        Por favor, Verifique el N° de contrato
                      </div>
                    </div>
                    <div className="col ms-3">
                      <h2 className="fs-5">Telefono</h2>
                      <input type="text" id="telefonoProveedor" className="form-control form-empty limpiar" placeholder="Telefono" aria-describedby="defaultRegisterFormPhoneHelpBlock"></input>
                      <div className="invalid-feedback is-invalid">
                        Por favor, Ingrese un telefono valido.
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button id="btnAgregar" type="button" className="btn btn-color" data-bs-dismiss={validacionExitosa ? "modal" : undefined} onClick={registrarProveedor}>Agregar</button>
              <button id="btnActualizar" type="button" data-bs-dismiss="modal" className="btn btn-color d-none" onClick={() => actualizarProveedor(selectedProveedorData.id_proveedores)}>Actualizar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Proveedor;