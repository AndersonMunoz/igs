import React, { useEffect, useRef, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';

const Categoria = () => {

  const [categorias_producto, setcategorias_producto] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalCategoriaRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [categoriaSeleccionada, setcategoriaSeleccionada] = useState({});

  

  useEffect(() => {
    listarCategoria();
  }, []); 

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
 
  function listarCategoria() {
    fetch("http://localhost:3000/categoria/listar", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      if(Array.isArray(data)){
        setcategorias_producto(data);
      }
    })
    .catch((e) => {
      console.log(e);
    });
  }
  
  function registrarCategoria() {
    let nombre_categoria = document.getElementById('nombreCategoria').value;
  
    const validacionExitosa = Validate.validarCampos('.form-empty');

    fetch('http://localhost:3000/categoria/registrar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_categoria}),
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
        listarCategoria();
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

  function deshabilitarCategoria(id) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/categoria/deshabilitar/${id}`, {
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
            listarCategoria();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }
  function activarCategoria(id) {
    Sweet.confirmacionActivar().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/categoria/activar/${id}`, {
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
            listarCategoria();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }
  function editarCategoria(id) {
    fetch(`http://localhost:3000/categoria/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setcategoriaSeleccionada(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  function actualizarCategoria(id){
    const validacionExitosa = Validate.validarCampos('.form-update');
    fetch(`http://localhost:3000/categoria/editar/${id}`,{
      method: 'PUT',
      headers:{
        'Content-type':'application/json'
      },
       body: JSON.stringify(categoriaSeleccionada),
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
      listarCategoria();
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
      <button type="button" id="modalProducto" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {setShowModal(true);Validate.limpiar('.limpiar');}}>
          Registrar Nueva Categoria
        </button>
        <div className="d-flex align-items-center">
          <input type="text" placeholder="Buscar Categoria" className="input-buscar" onChange={(e)=>setSeach(e.target.value)}/>
          <IconSearch className="iconSearch" />
        </div>
      </div>
      <div className="wrapper-editor">
        <table id="dtBasicExample" className="table table-striped table-bordered" cellSpacing={0} width="100%">
          <thead className="text-center text-justify">
            <tr>
              <th className="th-sm">Id</th>
              <th className="th-sm">Nombre Categoria</th>
              <th className="th-sm" colSpan={2}> Botones Acciones</th>
            </tr>
          </thead>
          <tbody id="tableCategoria" className="text-center">

          {categorias_producto.length === 0 ? (
        <tr>
          <td colSpan={12}>


          <div className="d-flex justify-content-center">
              <div className=" alert alert-danger text-center mt-4 w-50">
              <h2> En este momento no contamos con ningúna Categoria disponible. </h2>
              </div>
            </div>
          </td>
        </tr>
      ) : (
        <>
          {categorias_producto.filter((item) => {
    return search.toLowerCase() === '' ? item : item.nombre_categoria.toLowerCase().includes(search);
  }).map((element) => (
    <tr key={element.id_categoria}>
      <td>{element.id_categoria}</td>
      <td>{element.nombre_categoria}</td>  
      {element.estado === 1 ? (
                  <>
                  <td className="mx-2"onClick={() => {setUpdateModal(true);editarCategoria(element.id_categoria);}} data-bs-toggle="modal" data-bs-target="#actualizarModal">
                  <button className="btn btn-color">
                    Editar
                  </button>
                    </td>
                    <td className="mx-2">
                      <button className="btn btn-danger" onClick={() => deshabilitarCategoria(element.id_categoria)}>Deshabilitar</button>
                    </td>
                  </>
                ): (
                  <td className="mx-2" colSpan={2}>
                    <button className="btn btn-primary" onClick={() => activarCategoria(element.id_categoria)}>Activar</button>
                  </td>
                )}

              </tr>
            ))}
        </>
      )}
          </tbody>
        </table>
      </div>
      <div className="modal fade"id="exampleModal"tabIndex="-1"aria-labelledby="exampleModalLabel"aria-hidden="true" ref={modalCategoriaRef} style={{ display: showModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Registrar Categoria</h1>
                <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
              <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormInputGroupUp"
                      >
                       Categoria 
                      </label>
                      <div className="input-group">
                        <div className="input-group-text">  </div>
                        <input
                          type="text"
                          className="form-control limpiar "
                          id="nombreCategoria"
                          placeholder="Nombre Categoria "
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
              <button type="button" className="btn btn-color" onClick={registrarCategoria}>
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
              <h1 className="modal-title fs-5" id="actualizarModalLabel">Actualizar Categoria</h1>
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
                    <label htmlFor="nombre_categoria" className="label-bold mb-2">nombre categoria</label>
                    <input type="hidden" value={categoriaSeleccionada.nombre_categoria || ''} onChange={(e) => setcategoriaSeleccionada({ ...categoriaSeleccionada, nombre_categoria: e.target.value })} disabled/>
                    <input type="text" className="form-control form-update" placeholder="nombre categoria" value={categoriaSeleccionada.nombre_categoria || ''} name="nombre_categoria" onChange={(e) => setcategoriaSeleccionada({ ...categoriaSeleccionada, nombre_categoria: e.target.value })}/>
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
              <button type="button" className="btn btn-color"   onClick={() => {actualizarCategoria(categoriaSeleccionada.id_categoria);}}>
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Categoria;