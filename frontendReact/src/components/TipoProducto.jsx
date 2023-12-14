import React, { useEffect, useRef, useState } from "react";
import "../style/producto.css";
import { IconSearch } from "@tabler/icons-react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';

const Tipo = () => {

  const [tipos, settipo] = useState([]);
  const [categoria, setCategoria] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalProductoRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [tiposeleccionado, setTiposeleccionado] = useState({});

  

  useEffect(() => {
    listarTipo();
    
  }, []); 

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
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
    .then((res) => res.json())
    .then((data) => {
      if(Array.isArray(data)){
        settipo(data);
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }
  function listarcategoria(){
    fetch("http://localhost:3000/categoria/listar",{
      method: "GET",
      headers:{
        "Content-type": "application/json",
      },
    })
    .then((res)=>res.json())
    .then((data)=>{
      if(Array.isArray(data)){
        setCategoria(data);
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }
  
  function registrarTipo() {
    let  nombre_tipo = document.getElementById('nombre_tipo').value; 
    let fk_categoria_pro = document.getElementById('fk_categoria_pro').value;

    const validacionExitosa = Validate.validarCampos('.form-empty');

    fetch('http://localhost:3000/tipo/registrar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_tipo, fk_categoria_pro}),
    })
      .then((res) => res.json())
      .then(data => {
        if (!validacionExitosa) {
          Sweet.registroFallido();
          return;
        }
        if(data.status == 200){
          Sweet.registroExitoso();
        }
        if(data.status == 401){
          Sweet.registroFallido();
        }
        console.log(data);
        listarTipo();
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


  function deshabilitarTipo(id) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/tipo/deshabilitar/${id}`, {
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
            listarTipo();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }
  function activarTipo(id) {
    Sweet.confirmacionActivar().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/tipo/activar/${id}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json"
          }
        })
          .then(res => res.json())
          .then(data => {
            console.log(data);
            if (data.status === 200) {
              Sweet.actualizacionExitoso();
            }
            if (data.status === 401) {
              Sweet.actualizacionFallido();
            }
            listarTipo();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }
  
  
  function editarTipo(id) {
    fetch(`http://localhost:3000/tipo/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTiposeleccionado(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  function actualizarTipo(id){
    const validacionExitosa = Validate.validarCampos('.form-update');
    fetch(`http://localhost:3000/tipo/editar/${id}`,{
      method: 'PUT',
      headers:{
        'Content-type':'application/json'
      },
       body: JSON.stringify(tiposeleccionado),
    })
    .then((res)=>res.json())
    .then((data)=>{
      if(!validacionExitosa){
        Sweet.actualizacionFallido();
        return;
      }
      if(data.status == 200){
        Sweet.actualizacionExitoso();
      }
      if(data.status == 401){
        Sweet.actualizacionFallido();
      }
      console.log(data);
      listarTipo();
      setUpdateModal(false);
      removeModalBackdrop();
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }

    })
    .catch(error=>{
      console.error('Error:',error)
    })
  }

  const [search, setSeach] = useState('');

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button type="button" id="modalProducto" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {setShowModal(true);Validate.limpiar('.limpiar');}}>
          Registrar Nuevo tipo de producto 
        </button>
        <div className="d-flex align-items-center">
          <input type="text" placeholder="Buscar Producto" className="input-buscar" onChange={(e)=>setSeach(e.target.value)}/>
          <IconSearch className="iconSearch" />
        </div>
      </div>
      <div className="wrapper-editor">
        <table id="dtBasicExample" className="table table-striped table-bordered" cellSpacing={0} width="100%">
          <thead className="text-center text-justify">
            <tr>
              <th className="th-sm">Id</th>
              <th className="th-sm">NombreProducto</th>
              <th className="th-sm">NombreCategoria</th>
              <th className="th-sm" colSpan={2}>Acciones</th>
            </tr>
          </thead>
          <tbody id="tableCategoria" className="text-center">
          {tipos.length === 0 ? (
        <tr>
          <td colSpan={12}>
            <div className="d-flex justify-content-center alert alert-danger text-center mt-4 w-100">
              <h2>¡Oops! No hay tipos disponibles en este momento 😟</h2>
            </div>
          </td>
        </tr>
      ) : (
        <>
          {tipos.filter((item) => {
    return search.toLowerCase() === '' ? item : item.NombreProducto.toLowerCase().includes(search);
  }).map((element) => (
    <tr key={element.id}>
      <td>{element.id}</td>
      <td>{element.NombreProducto}</td>
      <td>{element.Categoría }</td>
              
      {element.estado === 1 ? (
                  <>
                    <td className="mx-2">
                      <button className="btn btn-color" onClick={() => { setUpdateModal(true); editarTipo(element.id); }} data-bs-toggle="modal" data-bs-target="#actualizarModal">
                        Editar  
                      </button>
                    </td>
                    <td className="mx-2">
                      <button className="btn btn-danger" onClick={() => deshabilitarTipo(element.id)}>Deshabilitar</button>
                    </td>
                  </>
                ): (
                  <td className="mx-2" colSpan={2}>
                    <button className="btn btn-primary" onClick={() => activarTipo(element.id)}>Activar</button>
                  </td>
                )}

              </tr>
            ))}
        </>
      )}



</tbody>
        </table>
      </div>
      <div className="modal fade"id="exampleModal"tabIndex="-1"aria-labelledby="exampleModalLabel"aria-hidden="true" ref={modalProductoRef} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Registrar  tipo de producto</h1>
                <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="tipo" className="label-bold mb-2"> tipo</label>
                    <input type="text" className="form-control form-empty limpiar" id="nombre_tipo" name="	nombre_tipo" placeholder="nombre de tipo de producto " />
                    <div className="invalid-feedback is-invalid">
                      Por favor,  el nombre  
                    </div>
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="fk_categoria_pro" className="label-bold mb-2">Tipo Producto</label>
                    <select className="form-select form-control form-empty limpiar" id="fk_categoria_pro" name=" fk_categoria_pro" defaultValue="" onClick={listarcategoria}>
                      <option value="">Selecciona un Tipo</option>
                      {categoria.map((element) => (
                        <option key={element.id_categoria} value={element.id_categoria}>{element.nombre_categoria}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un tipo de producto.
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
              <button type="button" className="btn btn-color" onClick={registrarTipo}>
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="actualizarModal" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg text-white">
              <h1 className="modal-title fs-5" id="actualizarModalLabel">Actualizar tipo de producto </h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="nombre " className="label-bold mb-2">nombre </label>
                    <input type="hidden" value={tiposeleccionado.id_tipo || ''} onChange={(e) => setTiposeleccionado({ ...tiposeleccionado, id_tipo: e.target.value })} disabled/>
                    <input type="text" className="form-control form-update" placeholder="tipo" value={tiposeleccionado.	nombre_tipo || ''} name="	nombre_tipo" onChange={(e) => setTiposeleccionado({ ...tiposeleccionado, 	nombre_tipo: e.target.value })}/>
                    <div className="invalid-feedback is-invalid">
                      Por favor, ingrese el nombre 
                    </div>
                   </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="fk_categoria_pro" className="label-bold mb-2">categoria </label>
                    <select className="form-select form-update" value={tiposeleccionado.fk_categoria_pro || ''} name="fk_categoria_pro" onChange={(e) => setTiposeleccionado({ ...tiposeleccionado, fk_categoria_pro: e.target.value })} onClick={listarcategoria}>
                      <option value="">Selecciona un Tipo</option>
                      {categoria.map((element) => (
                        <option key={element.id_categoria} value={element.id_categoria}>{element.nombre_categoria}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un tipo de producto.
                    </div>
                  </div>
                </div>
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-color"   onClick={() => {actualizarTipo(tiposeleccionado.id_tipo);}}>
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