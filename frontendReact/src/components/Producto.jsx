import React, { useEffect } from "react";
import "../style/producto.css";
import { IconSearch } from "@tabler/icons-react";

const Producto = () => {
  useEffect(() => {
    listarProducto();
  }, []); 
  function listarProducto() {
    fetch("http://localhost:3000/producto/listar", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      let rows = '';
      data.forEach((element) => {
        rows += `<tr key=${element.id_producto}>
                    <td>${element.id_producto}</td>
                    <td>${element.fk_id_tipo_producto}</td>
                    <td>${element.fk_id_up}</td>
                    <td>${element.fecha_caducidad_producto}</td>
                    <td>${element.cantidad_peso_producto}</td>
                    <td>${element.unidad_peso_producto}</td>
                    <td>${element.precio_producto}</td>
                    <td>${element.descripcion_producto}</td>
                    <td><a href='#' onclick='eliminarProducto(${element.id_producto}); return false;'>Eliminar</a></td>
                  </tr>`;
      });
      document.getElementById('tableProducto').innerHTML = rows;
    })
    .catch((e) => {
      console.log(e);
    });
  }
  function eliminarProducto(id){
    fetch(`http://localhost:3000/producto/deshabilitar/${id}`,{
      method: 'patch',
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
      listarProducto();
    })
  }

      function registrarProducto() {
        let datos = new FormData(document.getElementById('formuProducto'));
        // let datos = new URLSearchParams();
        // datos.append('fk_id_tipo_producto', document.getElementById('fk_id_tipo_producto').value);
        // datos.append('fk_id_up', document.getElementById('fk_id_up').value);
        // datos.append('fecha_caducidad_producto', document.getElementById('fecha_caducidad_producto').value);
        // datos.append('cantidad_peso_producto', document.getElementById('cantidad_peso_producto').value);
        // datos.append('unidad_peso_producto', document.getElementById('unidad_peso_producto').value);
        // datos.append('precio_producto', document.getElementById('precio_producto').value);
        // datos.append('descripcion_producto', document.getElementById('descripcion_producto').value);
        
        fetch('http://localhost:3000/producto/registrar', {
          method: 'POST',
          body: datos,
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button type="button" id="modalProducto" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" >
          Registrar Nuevo Producto
        </button>
        <div className="d-flex align-items-center">
          <input type="text" placeholder="Buscar Producto" className="input-buscar" />
          <IconSearch className="iconSearch" />
        </div>
      </div>
      <div className="wrapper-editor">
        <table id="dtBasicExample" className="table table-striped table-bordered" cellSpacing={0} width="100%">
          <thead>
            <tr>
              <th className="th-sm">ID</th>
              <th className="th-sm">Producto</th>
              <th className="th-sm">Unidad Productiva</th>
              <th className="th-sm">Fecha de Caducidad</th>
              <th className="th-sm">Cantidad de Peso</th>
              <th className="th-sm">Unidad de Peso</th>
              <th className="th-sm">Precio</th>
              <th className="th-sm">Descipcion</th>
              <th className="th-sm"></th>
            </tr>
          </thead>
          <tbody id="tableProducto">

          </tbody>
        </table>
      </div>
      <div className="modal fade" id="exampleModal" tabIndex="-1"aria-labelledby="exampleModalLabel" aria-hidden="false">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h2 className="modal-title fs-5">Registrar Producto</h2>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center">
                <form className="text-center border border-light p-5" id="formuProducto">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="fk_id_tipo_producto" className="label-bold">
                        Categoría
                      </label>
                      <select className="form-select" id="fk_id_tipo_producto" name="fk_id_tipo_producto" defaultValue="">
                        <option value="">
                          Selecciona una Categoría
                        </option>
                        <option value="1">Categoría 1</option>
                        <option value="2">Categoría 2</option>
                        <option value="3">Categoría 3</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="unidadPeso" className="label-bold">
                        U.P
                      </label>
                      <select className="form-select" id="unidadPeso" name="unidad_peso_producto" defaultValue="">
                        <option value="">
                          Selectione una UP
                        </option>
                        <option value="">U.P1</option>
                        <option value="">U.P2</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="fechaCaducidad" className="label-bold">
                        Fecha de Caducidad
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechaCaducidad"
                        name="fecha_caducidad_producto"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="cantidadProducto" className="label-bold">
                        Cantidad del Producto
                      </label>
                      <input type="text" className="form-control" id="cantidadProducto" name="cantidad_peso_producto" placeholder="Cantidad del Producto"/>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="precioProducto" className="label-bold">
                        Precio del Producto
                      </label>
                      <input type="text" className="form-control" id="precioProducto" name="precio_producto" placeholder="Precio del Producto"/>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="unidadMedida" className="label-bold">
                        Unidad de Medida
                      </label>
                      <select className="form-select" id="unidadMedida" name="unidad_peso_producto" defaultValue="">
                        <option value="">
                          Selecciona una unidad de medida
                        </option>
                        <option value="kg">Kilogramo</option>
                        <option value="lb">Libra</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descripcionProducto" className="label-bold">
                      Descripción
                    </label>
                    <textarea className="form-control" id="descripcionProducto" placeholder="Descripción del Producto" name="descripcion_producto" rows="4"></textarea>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
              <button type="button" className="btn btn-color" onClick={registrarProducto}>
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Producto;