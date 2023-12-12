import React, { useEffect, useRef, useState } from "react";
import "../style/producto.css";
import { IconSearch } from "@tabler/icons-react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';

const Up= () => {

  const [unidad_productiva, setunidad_productiva] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalCategoriaRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [upSeleccionada, setupSeleccionada] = useState({});

  

  useEffect(() => {
   listarUp()
  }, []); 

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
 
  function listarUp() {
    fetch("http://localhost:3000/up/listar", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
    if(Array.isArray(data)){
      setunidad_productiva(data);
    }
    
    })
    .catch((e) => {
      console.log(e);
    });
  }
  
  function registrarUp() {
    let nombre_up = document.getElementById('nombreUp').value;
    const validacionExitosa = Validate.validarCampos('.form-empty');

    fetch('http://localhost:3000/up/registrar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_up}),
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
        listarUp()
        setShowModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
        Validate.limpiar('.limpiar');
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }
  function editarUp(id) {
    fetch(`http://localhost:3000/up/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setupSeleccionada(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  function actualizarUp(id){
    const validacionExitosa = Validate.validarCampos('.form-update');
    fetch(`http://localhost:3000/up/editar/${id}`,{
      method: 'PUT',
      headers:{
        'Content-type':'application/json'
      },
       body: JSON.stringify(upSeleccionada),
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
      listarUp();
      setUpdateModal(false);
      removeModalBackdrop();
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
    })
  }

  const [search, setSeach] = useState('');

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button type="button" id="modalCategoria" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => setShowModal(true)}>
          Registrar Nueva Unidad productiva        </button>
        <div className="d-flex align-items-center">
          <input type="text" placeholder="Buscar Categoria" className="input-buscar limpiar" onChange={(e)=>setSeach(e.target.value)}/>
          <IconSearch className="iconSearch" />
        </div>
      </div>
      <div className="wrapper-editor">
        <table id="dtBasicExample" className="table table-striped table-bordered" cellSpacing={0} width="100%">
          <thead className="text-center text-justify">
            <tr>
              <th className="th-sm">id</th>
              <th className="th-sm">nombre Up</th>
              <th className="th-sm" colSpan={2}> Botones Acciones</th>
            </tr>
          </thead>
          <tbody id="tableunidadProductiva" className="text-center">
            {unidad_productiva.filter((item)=>{return search.toLowerCase()=== '' ? item : item.nombre_up.toLowerCase().includes(search)}).map((element) => (
              <tr key={element.id_up}>
                <td>{element.id_up}</td>
                <td>{element.nombre_up}</td>
                <td className="mx-2"onClick={() => {setUpdateModal(true);editarUp(element.id_up);}} data-bs-toggle="modal" data-bs-target="#actualizarModal">
                  <button className="btn btn-color">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="modal fade"id="exampleModal"tabIndex="-1"aria-labelledby="exampleModalLabel"aria-hidden="true" ref={modalCategoriaRef} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Registrar Unidad productiva </h1>
                <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
              <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormInputGroupUp"
                      >
                       Up 
                      </label>
                      <div className="input-group">
                        <div className="input-group-text">  </div>
                        <input
                          type="text"
                          className="form-control limpiar"
                          id="nombreUp"
                          placeholder="Nombre Up "
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormSelectPref"
                      >
                        Preference
                      </label>
                    </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
              <button type="button" className="btn btn-color" onClick={registrarUp}>
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
              <h1 className="modal-title fs-5" id="actualizarModalLabel">Actualizar Unidad productiva </h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
              <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormInputGroupUp"
                      >
                       Up
                      </label>
                      <div className="col-md-12">
                    <label htmlFor="nombre_up" className="label-bold mb-2">nombre unidad productiva </label>
                    <input type="hidden" value={upSeleccionada.nombre_up || ''} onChange={(e) => setupSeleccionada({ ...upSeleccionada, nombre_up: e.target.value })} disabled/>
                    <input type="text" className="form-control form-update" placeholder="nombre up" value={upSeleccionada.nombre_up || ''} name="nombre_up" onChange={(e) => setupSeleccionada({ ...upSeleccionada, nombre_up: e.target.value })}/>
                    <div className="invalid-feedback is-invalid">
                    </div>       
                     </div>    
                     </div>    
                    <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormSelectPref"
                      >
                        Preference
                      </label>
                    </div>
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar </button>
              <button type="button" className="btn btn-color"   onClick={() => {actualizarUp(upSeleccionada.id_up);}}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Up;