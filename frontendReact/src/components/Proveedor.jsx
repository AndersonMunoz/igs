import React, { useEffect, usuEffect } from "react";
import '../style/Proveedor.css'
import { IconSearch } from "@tabler/icons-react";


const Proveedor = () => {

  useEffect(() => {
    listarProveedor();
  }, []);

  function registrarProveedor() {
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
        console.log(data);
        let row = '';
        data.forEach((element) => {
          row += `<tr>
              <td>${element.id_proveedores}</td>
              <td>${element.nombre_proveedores}</td>
              <td>${element.telefono_proveedores}</td>
              <td>${element.direccion_proveedores}</td>
              <td>${element.contrato_proveedores}</td>
              <td>${element.estado}</td>
              <td>
                <a href="javaScript:editarProveedor(${element.id_proveedores})">Editar</a>
                <a href="javascript:void(0);" onclick="eliminarProveedor(${element.id_proveedores})">Eliminar</a>              </td>
            </tr>`;
          document.getElementById('tableProveedores').innerHTML = row;
        });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function eliminarProveedor(id) {
    // Puedes construir la URL con el ID y realizar la solicitud DELETE
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



  // Agrega una función para editarProveedor si no la tienes ya definida
  function editarProveedor(id) {
    console.log('Editar proveedor con ID:', id);
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
          <tbody id="tableProveedores">

          </tbody>
        </table>
      </div>
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
              <button type="button" className="btn btn-color" onClick={registrarProveedor}>Agregar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Proveedor;