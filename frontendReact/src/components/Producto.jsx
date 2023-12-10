import React, { useEffect, useRef, useState } from "react";
import "../style/producto.css";
import { IconSearch } from "@tabler/icons-react";


const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipo] = useState([]);
  const [up, setUp] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalProductoRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const sortedProductos = [...productos].sort((a, b) => a.id_producto - b.id_producto);
  const [productoSeleccionado, setProductoSeleccionado] = useState({});


  useEffect(() => {
    listarProducto();
    listarUp();
    listarTipo();
  }, []); 

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
  function formatFecha(fecha) {
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  function listarProducto() {
    fetch("http://localhost:3000/producto/listar", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      setProductos(data);
    })
    .catch((e) => {
      console.log(e);
    });
  }
  function listarTipo(){
    fetch("http://localhost:3000/tipo/listar",{
      method: "GET",
      headers:{
        "Content-type": "application/json",
      },
    })
    .then((res)=>res.json())
    .then((data)=>{
      setTipo(data)
    })
    .catch((e) => {
      console.log(e);
    });
  }
  function listarUp(){
    fetch("http://localhost:3000/up/listar",{
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res)=>res.json())
    .then((data)=>{
      setUp(data)
    })
    .catch((e) => {
      console.log(e);
    });
  }
  function registrarProducto() {
    let precio_producto = document.getElementById('precio_producto').value;
    let descripcion_producto = document.getElementById('descripcion_producto').value;
    let fk_id_up = document.getElementById('fk_id_up').value;
    let fk_id_tipo_producto = document.getElementById('fk_id_tipo_producto').value;

    fetch('http://localhost:3000/producto/registrar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ precio_producto, descripcion_producto, fk_id_up, fk_id_tipo_producto }),
    })
      .then((res) => res.json())
      .then(data => {
        console.log(data);
        listarProducto();
        setShowModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  function deshabilitarProducto(id){
    fetch(`http://localhost:3000/producto/deshabilitar/${id}`,{
      method: 'PATCH',
      headers: {
        "Content-type": "application/json"
      }
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
      listarProducto();
    })
  }
  function editarProducto(id) {
    fetch(`http://localhost:3000/producto/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setProductoSeleccionado(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }


  function actualizarProducto(id){
    fetch(`http://localhost:3000/producto/actualizar/${id}`,{
      method: 'PUT',
      headers:{
        'Content-type':'application/json'
      },
       body: JSON.stringify(productoSeleccionado),
    })
    .then((res)=>res.json())
    .then((data)=>{
      console.log(data);
      listarProducto();
      setUpdateModal(false);
      removeModalBackdrop();
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    })
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button type="button" id="modalProducto" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setShowModal(true)}>
          Registrar Nuevo Producto
        </button>
        <div className="d-flex align-items-center">
          <input type="text" placeholder="Buscar Producto" className="input-buscar" />
          <IconSearch className="iconSearch" />
        </div>
      </div>
      <div className="wrapper-editor">
        <table id="dtBasicExample" className="table table-striped table-bordered" cellSpacing={0} width="100%">
          <thead className="text-center text-justify">
            <tr>
              <th className="th-sm">N°</th>
              <th className="th-sm">NombreProducto</th>
              <th className="th-sm">NombreCategoria</th>
              <th className="th-sm">FechaCaducidad</th>
              <th className="th-sm">Peso</th>
              <th className="th-sm">Unidad</th>
              <th className="th-sm">PrecioIndividual</th>
              <th className="th-sm">UnidadProductiva</th>
              <th className="th-sm">Descripcion</th>
              <th className="th-sm">PrecioTotal</th>
              <th className="th-sm" colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody id="tableProducto" className="text-center">
            {sortedProductos.map((element, index) => (
              <tr key={element.id_producto}>
                <td>{index + 1}</td>
                <td>{element.NombreProducto}</td>
                <td>{element.NombreCategoria}</td>
                <td>{formatFecha(element.FechaCaducidad)}</td>
                <td>{element.Peso}</td>
                <td>{element.Unidad}</td>
                <td>{element.PrecioIndividual}</td>
                <td>{element.UnidadProductiva}</td>
                <td>{element.Descripcion}</td>
                <td>{element.PrecioTotal}</td>
                <td className="mx-2"onClick={() => {setUpdateModal(true);editarProducto(element.id_producto);}} data-bs-toggle="modal" data-bs-target="#actualizarModal">
                  <button className="btn btn-color">
                    Editar
                  </button>
                </td>
                <td className="mx-2">
                  <button className="btn btn-danger" onClick={()=>deshabilitarProducto(element.id_producto)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal fade"id="exampleModal"tabIndex="-1"aria-labelledby="exampleModalLabel"aria-hidden="true" ref={modalProductoRef} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Registrar Producto</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="precioProducto" className="label-bold mb-2">Precio del Producto</label>
                    <input type="text" className="form-control" id="precio_producto" name="precio_producto" placeholder="Precio del Producto" />
                    <div className="invalid-feedback is-invalid">
                      Por favor, ingrese el precio del producto.
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="fk_id_tipo_producto" className="label-bold mb-2">Tipo Producto</label>
                    <select className="form-select" id="fk_id_tipo_producto" name="fk_id_tipo_producto" defaultValue="">
                      <option value="">Selecciona un Tipo</option>
                      {tipos.map((element) => (
                        <option key={element.id} value={element.id}>{element.NombreProducto}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un tipo de producto.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="unidadPeso" className="label-bold mb-2">U.P</label>
                    <select className="form-select" id="fk_id_up" name="fk_id_up" defaultValue="">
                      <option value="">Selecciona una UP</option>
                      {up.map((element) => (
                        <option key={element.id_up} value={element.id_up}>{element.nombre_up}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione una unidad de peso.
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcionProducto" className="label-bold mb-2">Descripción</label>
                  <textarea className="form-control" id="descripcion_producto" placeholder="Descripción del Producto" name="descripcion_producto" rows="4"></textarea>
                  <div className="invalid-feedback is-invalid">
                    Por favor, ingrese una descripción del producto.
                  </div>
                </div>
              </form>
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

      <div className="modal fade" id="actualizarModal" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="actualizarModalLabel">Actualizar Producto</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="precioProducto" className="label-bold mb-2">Precio del Producto</label>
                    <input type="hidden" value={productoSeleccionado.id_producto || ''} onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, id_producto: e.target.value })} disabled/>
                    <input type="text" className="form-control" placeholder="Precio del Producto" value={productoSeleccionado.precio_producto || ''} name="precio_producto" onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, precio_producto: e.target.value })}/>
                    <div className="invalid-feedback is-invalid">
                      Por favor, ingrese el precio del producto.
                    </div>
                   </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="fk_id_tipo_producto" className="label-bold mb-2">Tipo Producto</label>
                    <select className="form-select" value={productoSeleccionado.fk_id_tipo_producto || ''} name="fk_id_tipo_producto" onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, fk_id_tipo_producto: e.target.value })}>
                      <option value="">Selecciona un Tipo</option>
                      {tipos.map((element) => (
                        <option key={element.id} value={element.id}>{element.NombreProducto}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un tipo de producto.
                    </div>
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="unidadPeso" className="label-bold mb-2">U.P</label>
                    <select className="form-select" value={productoSeleccionado.fk_id_up || ''} name="fk_id_up" onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, fk_id_up: e.target.value })}>
                      <option value="">Selecciona una UP</option>
                      {up.map((element) => (
                        <option key={element.id_up} value={element.id_up}>{element.nombre_up}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione una unidad de peso.
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="descripcionProducto" className="label-bold mb-2">Descripción</label>
                  <textarea className="form-control" placeholder="Descripción del Producto" name="descripcion_producto" rows="4" value={productoSeleccionado.descripcion_producto || ''} onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, descripcion_producto: e.target.value })}
                  ></textarea>
                  <div className="invalid-feedback is-invalid">
                    Por favor, ingrese una descripción del producto.
                  </div>
                </div>
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-color"   onClick={() => {actualizarProducto(productoSeleccionado.id_producto);}}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Producto;