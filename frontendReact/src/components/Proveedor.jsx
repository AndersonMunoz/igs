import React, { useEffect, useState, useRef } from "react";
import '../style/Proveedor.css'
import { IconSearch } from "@tabler/icons-react";


const Proveedor = () => {
  const [Proveedores, setProveedor] = useState([]);
  const sortedProveedores = [...Proveedores].sort((a, b) => a.id_proveedores - b.id_proveedores);
  const [updateModal, setUpdateModal] = useState(false);
  const [selectedProveedorData, setSelectedProveedorData] = useState(null);

  useEffect(() => {
    listarProveedor();
  }, []);

  function registrarProveedor() {
    const nombre_proveedores = document.getElementById('nombresProveedor').value;
    const telefono_proveedores = document.getElementById('telefonoProveedor').value;
    const direccion_proveedores = document.getElementById('direccionProveedor').value;
    const contrato_proveedores = document.getElementById('contratoProveedor').value;
    document.getElementById('btnAgregar').classList.remove('d-none');
    document.getElementById('btnActualizar').classList.add('d-none');

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
        console.log(data);
        listarProveedor();
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
    const url = `http://localhost:3000/proveedor/eliminar/${id}`;
    fetch(url, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        listarProveedor();
      })
      .catch((error) => {
        console.error("Error al eliminar el proveedor:", error);
      });
  }

  function editarProveedor(id) {
    buscarProveedor(id)
      .then((data) => {
        if (data.length > 0) {
          setSelectedProveedorData(data[0]);
          document.getElementById('nombresProveedor').value = data[0].nombre_proveedores;
          document.getElementById('direccionProveedor').value = data[0].direccion_proveedores;
          document.getElementById('contratoProveedor').value = data[0].contrato_proveedores;
          document.getElementById('telefonoProveedor').value = data[0].telefono_proveedores;
          document.getElementById('btnAgregar').classList.add('d-none');
          document.getElementById('btnActualizar').classList.remove('d-none');
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
        listarProveedor();
      })
      .catch((error) => {
        console.error("Error al registrar el proveedor:", error);
      });
  }






  return (
    <>
      <div>
        <h1 className="text-center">Proveedores</h1>


        <div className="d-flex justify-content-between">
          <button type="button" className="btn-color btn  mb-4 " data-bs-toggle="modal" data-bs-target="#exampleModal">
            Registrar nuevo Proveedor
          </button>
          <div className="d-flex align-items-center">
            <input type="text" placeholder="Buscar Producto" className="input-buscar" />
            <IconSearch className="iconSearch" />
          </div>
        </div>
      </div>
      <div className="wrapper-editor">
        <table
          id="dtBasicExample"
          className="table table-striped table-bordered"
          cellSpacing={0}
          width="100%"
        >
          <thead>
            <tr>
              <th className="th-sm">Id</th>
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Telefono</th>
              <th className="th-sm">Direccion</th>
              <th className="th-sm">Contrato</th>
              <th className="th-sm">Estado</th>
              <th className="th'sm"   >acciones</th>
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
                <td>{element.estado}</td>
                <td>
                  <button type="button" className="btn-color btn " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => editarProveedor(element.id_proveedores)}>
                    editar
                  </button>
                  <button className="btn btn-danger" type="button" onClick={() => eliminarProveedor(element.id_proveedores)}> eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ display: updateModal ? "block" : "none" }}>
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Registro Proveedor</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
                <form className="text-center border border-light" action="#!">
                  <div className="d-flex form-row mb-4">
                    <div className="col">
                      <input type="text" id="nombresProveedor" className="form-control" placeholder="Nombres"></input>
                    </div>
                    <div className="col ms-3">
                      <input type="text" id="direccionProveedor" className="form-control" placeholder="Direccion"></input>
                    </div>
                  </div>
                  <div className="d-flex form-row mb-1">
                    <div className="col">
                      <input type="text" id="contratoProveedor" className="form-control mb-4" placeholder="Contrato"></input>
                    </div>
                    <div className="col ms-3">
                      <input type="text" id="telefonoProveedor" className="form-control" placeholder="Telefono" aria-describedby="defaultRegisterFormPhoneHelpBlock"></input>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button id="btnAgregar" type="button" className="btn btn-color" onClick={registrarProveedor}>Agregar</button>
              <button id="btnActualizar" type="button" className="btn btn-color d-none" onClick={()=> actualizarProveedor(selectedProveedorData.id_proveedores)}>Actualizar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Proveedor;