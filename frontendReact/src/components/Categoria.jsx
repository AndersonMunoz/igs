import React, { useEffect, useRef, useState } from "react";
import {IconEdit, IconFileSpreadsheet, IconTrash } from "@tabler/icons-react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';
import esES from '../languages/es-ES.json';
import ExelLogo from "../../img/excel.224x256.png";
import PdfLogo from "../../img/pdf.224x256.png";
import $ from 'jquery';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css'; 
import portConexion from "../const/portConexion";
import generatePDF from 'react-to-pdf';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Categoria = () => {
  const tableRef = useRef();
  const [categorias_producto, setcategorias_producto] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalCategoriaRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [categoriaSeleccionada, setcategoriaSeleccionada] = useState({});
 
  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelCategoria');
    xlsx.writeFile(wb, 'Categoriadetalle.xlsx');
  };
  const getTableData = () => {
    const wsData = [];

    // Obtener las columnas
    const columns = [
      'Id',
      'Nombre'
    ];
    wsData.push(columns);

    // Obtener los datos de las filas
    categorias_producto.forEach(element => {
      const rowData = [
        element.id_categoria,
        element.nombre_categoria
      ];
      wsData.push(rowData);
    });

    return wsData;
  };

  const doc= new jsPDF();
  const exportPdfHandler = () => {
    const doc = new jsPDF();
  
    const columns = [
      { title: 'Id', dataKey: 'id_categoria' },
      { title: 'Nombre de categoria', dataKey: 'nombre_categoria' },
    ];
  
    // Obtener los datos de la tabla
    const tableData = categorias_producto.map((element) => ({
      id_categoria: element.id_categoria,
      nombre_categoria: element.nombre_categoria,
    }));
  
    // Agregar las columnas y los datos a la tabla del PDF
    doc.autoTable({
      columns,
      body: tableData,
      margin: { top: 20 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [100, 100, 100] },
    });
  
    // Guardar el PDF
    doc.save('Tipodeproducto.pdf');
  };

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
    fetch(`http://${portConexion}:3000/categoria/listar`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
          token: localStorage.getItem("token"),
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

    fetch(`http://${portConexion}:3000/categoria/registrar`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
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
        } if (data.status === 409) {
          Sweet.error(data.message);
          return;
        }
        if (data.status === 403) {
          Sweet.error(data.error.errors[0].msg);
          return;
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
        fetch(`http://${portConexion}:3000/categoria/deshabilitar/${id}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json",
            token: localStorage.getItem("token"),
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
        fetch(`http://${portConexion}:3000/categoria/activar/${id}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json",
          token: localStorage.getItem("token"),
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
    fetch(`http://${portConexion}:3000/categoria/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.getItem("token"),
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
    fetch(`http://${portConexion}:3000/categoria/editar/${id}`,{
      method: 'PUT',
      headers:{
        'Content-type':'application/json',
        token: localStorage.getItem("token"),
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
      <h1 className="text-center modal-title fs-5 m-4">Lista de Categorias</h1>
      <div className="d-flex justify-content-between  mt-4">
      <button type="button" id="modalProducto" className="btn-color btn mb-4" data-bs-toggle="modal"  data-bs-target="#staticBackdrop"onClick={() => {setShowModal(true);Validate.limpiar('.limpiar');}}>
          Registrar Nueva Categoria
        </button>
        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
            <div className="" title="Descargar Excel">
            <button onClick={handleOnExport} type="button" className="btn btn-light">
                <img src={ExelLogo} className="logoExel" />
                </button>
            </div>
            <div className="" title="Descargar Pdf">
              <button
                type="button"
                className="btn btn-light"
                onClick={exportPdfHandler}
              >
                <img src={PdfLogo} className="logoExel" />
              </button>
            </div>
          </div>
      </div>
      <div className="container-fluid w-full" >
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
              <h2> En este momento no contamos con ningúna Categoria disponible.😟 </h2>
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
              <td className="p-0">
                {element.estado === 1   ? (
                  <>
                    <button
                      className="btn btn-color mx-2"
                      onClick={() => {
                        setUpdateModal(true);
                        editarCategoria(element.id_categoria);
                      }}
                      data-bs-toggle="modal"
                      data-bs-target="#staticBackdrop2"
                    >
                       <IconEdit />
                    </button>
                    <button
                      className="btn btn-danger "
                      onClick={() =>
                        deshabilitarCategoria(element.id_categoria)
                      }
                    >
                    <IconTrash />
                    </button>
                  </>
                ) : (
                  <button
                    className="btn btn-primary "
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
      <div className="modal fade"id="staticBackdrop" tabIndex="-1"data-bs-backdrop="static"ref={modalCategoriaRef} style={{ display: showModal ? 'block' : 'none' }}>
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
                          className="form-control limpiar form-empty form-control"
                          id="nombreCategoria"
                          placeholder="Nombre Categoria"
                        />
                         <div className="invalid-feedback is-invalid">
                        Por favor, ingrese una categoria
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

      <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
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