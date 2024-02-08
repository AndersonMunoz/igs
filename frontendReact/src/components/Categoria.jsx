import React, { useEffect, useRef, useState } from "react";
import {IconEdit, IconFileSpreadsheet, IconTrash } from "@tabler/icons-react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';
import esES from '../languages/es-ES.json';
import $ from 'jquery';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import {DownloadTableExcel}  from 'react-export-table-to-excel';
import generatePDF from 'react-to-pdf';

const Categoria = () => {
  const tableRef = useRef();
  const [categorias_producto, setcategorias_producto] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalCategoriaRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [categoriaSeleccionada, setcategoriaSeleccionada] = useState({});
 

  useEffect(() => {
		if (categorias_producto.length > 0) {
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
	}, [categorias_producto]);

  

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
      if (data.status == 500) {
        Sweet.error(data.message)
        }
        if (data.status == 204) {
          Sweet.error(data.message)
          }
      if (data !== null) {
        setcategorias_producto(data);
      }
      console.log(data)
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
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.registroFallido();
          return;
        }

        if (data.status === 200) {
          Sweet.exito(data.menssage);
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
            
          }
          listarCategoria();
        }
        if (data.status === 403) {
          Sweet.error(data.error.errors[0].msg);
      
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
              Sweet.exito(data.message);
          
            }
            else  {
              Sweet.error(data.menssage);
          
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
      if (data.status === 200) {
        Sweet.exito(data.menssge);
    
      }
      else {
        Sweet.error(data.errors[0].msg);
    
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
    <div >
      <div className="d-flex justify-content-between  mb-4">
      <button type="button" id="modalProducto" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => {setShowModal(true);Validate.limpiar('.limpiar');}}>
          Registrar Nueva Categoria
        </button>
        <div>
          <DownloadTableExcel
            filename="Tabla Categoria"
            sheet="Categoria"
            currentTableRef={tableRef.current}
          >
            <button type="button" className="btn-color btn me-2">
              Excel
            </button>
          </DownloadTableExcel>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => generatePDF(tableRef, { filename: "Categoria.pdf" })}
          >
           PDF
          </button>
        </div>
      </div>
      <div className="wrapper-editor" >
      <table
        id="dtBasicExample"
        className="table table-striped table-bordered border display responsive nowrap"
        ref={tableRef}
        cellSpacing={0}
        width="100%"
      >
        <thead className="text-center text-justify">
          <tr>
            <th className="th-sm">Id</th>
            <th className="th-sm">Nombre Categoria</th>
            <th className="th-sm">Acciones</th>
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

        {categorias_producto
          .filter((item) => {
            return (
              search.toLowerCase() === '' ||
              item.nombre_categoria.toLowerCase().includes(search)
            );
          })
          .map((element) => (
            <tr key={element.id_categoria}>
              <td style={{textTransform: 'capitalize'}}>{element.id_categoria}</td>
              <td style={{textTransform: 'capitalize'}}>{element.nombre_categoria}</td>
              <td>
                {element.estado === 1 ? (
                  <>
                    <button
                      className="btn btn-color mx-2"
                      onClick={() => {
                        setUpdateModal(true);
                        editarCategoria(element.id_categoria);
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#actualizarModal"
                    >
                       <IconEdit />
                    </button>
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() =>
                        deshabilitarCategoria(element.id_categoria)
                      }
                    >
                    <IconTrash />
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary mx-2"
                    onClick={() =>
                      activarCategoria(element.id_categoria)
                    }
                  >
                    Activar
                  </button>
                )}
              </td>
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
                    <label htmlFor="nombre_categoria" className="label-bold mb-2">Nombre Categoria</label>
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