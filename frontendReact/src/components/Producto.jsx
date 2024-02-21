import React, { useEffect, useRef, useState } from "react";
import "../style/producto.css";
import { IconEdit, IconTrash } from "@tabler/icons-react";
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
import {DownloadTableExcel}  from 'react-export-table-to-excel';
import generatePDF from 'react-to-pdf';
import Select from 'react-select'
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';


const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [tipos, setTipo] = useState([]);
  const [up, setUp] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalProductoRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const [productoSeleccionado, setProductoSeleccionado] = useState({});
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedUp, setSelectedUp] = useState(null);

  const tableRef = useRef();

  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelProducto');
    xlsx.writeFile(wb, 'Productos.xlsx');
  };

  const doc= new jsPDF();
  const exportPdfHandler = () => {
    const doc = new jsPDF();
  
    const columns = [
      { title: 'N°', dataKey: 'id_producto' },
      { title: 'NombreProducto', dataKey: 'NombreProducto' },
      { title: 'NombreCategoria', dataKey: 'NombreCategoria' },
      { title: 'Peso', dataKey: 'Peso' },
      { title: 'Unidad', dataKey: 'Unidad' },
      { title: 'PrecioIndividual', dataKey: 'PrecioIndividual' },
      { title: 'UnidadProductiva', dataKey: 'UnidadProductiva' },
      { title: 'Descripcion', dataKey: 'Descripcion' },
      { title: 'PrecioTotal', dataKey: 'PrecioTotal' }
    ];
  
    // Obtener los datos de la tabla
    const tableData = productos.map((element) => ({
      id_producto: element.id_producto,
      NombreProducto: element.NombreProducto,
      NombreCategoria: element.NombreCategoria,
      Peso: element.Peso,
      Unidad: element.Unidad,
      PrecioIndividual: element.PrecioIndividual,
      UnidadProductiva: element.UnidadProductiva,
      Descripcion: element.Descripcion,
      PrecioTotal: element.PrecioTotal
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
    doc.save('Producto.pdf');
  };
  const getTableData = () => {
    const wsData = [];
  
    // Obtener las columnas
    const columns = [
      'N°',
      'NombreProducto',
      'NombreCategoria',
      'Peso',
      'Unidad',
      'PrecioIndividual',
      'UnidadProductiva',
      'Descripcion',
      'PrecioTotal'
    ];
    wsData.push(columns);
  
    // Obtener los datos de las filas
    productos.forEach(element => {
      const rowData = [
        element.id_producto,
        element.NombreProducto,
        element.NombreCategoria,
        element.Peso,
        element.Unidad,
        element.PrecioIndividual,
        element.UnidadProductiva,
        element.Descripcion,
        element.PrecioTotal  
      ];
      wsData.push(rowData);
    });
  
    return wsData;
  };


  useEffect(() => {
		if (productos.length > 0) {
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
        lengthMenu: [
           [ 10, 50, 100, -1 ],
           [ '10 Filas', '50 Filas', '100 Filas', 'Ver Todo' ]
        ],
     });
		}
	}, [productos]);

  useEffect(() => {
      listarProducto();
      listarUp();
      listarTipo();
      busquedaInventario();
  }, []); 

  const resetFormState = () => {
    const formFields = modalProductoRef.current.querySelectorAll('.form-control,.form-update,.my-custom-class,.form-empty, select, input[type="number"], input[type="checkbox"]');
    const formFields2 = modalUpdateRef.current.querySelectorAll('.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]');
    formFields.forEach(field => {
      if (field.type === 'checkbox') {
        field.checked = false;
      } else {
        field.value = '';
      }
      field.classList.remove('is-invalid');
    });
    formFields2.forEach(field => {
      if (field.type === 'checkbox') {
        field.checked = false;
      } else {
        field.value = '';
      }
      field.classList.remove('is-invalid');
    });
  };
  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
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
      console.log(data);
    })
    .catch((e) => {
      console.log(e);
    });
  }
  function listarTipo(){
    fetch("http://localhost:3000/tipo/listarActivo",{
      method: "GET",
      headers:{
        "Content-type": "application/json",
      },
    })
    .then((res) => {
      if (res.status === 204) {
        console.log("No hay datos disponibles");
        return null;
      }
      return res.json();
    })
    .then((data) => {
      if (data !== null) {
        setTipo(data);
      }
    })
    .catch((e) => {
      console.error("Error al procesar la respuesta:", e);
    });
  }
  function listarUp() {
    fetch("http://localhost:3000/up/listar", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 204) {
          console.log("No hay datos disponibles");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data !== null) {
          setUp(data);
        }
      })
      .catch((e) => {
        console.error("Error al procesar la respuesta:", e);
      });
  }
  const handleTipo = (selectedOption) => {
    setSelectedTipo(selectedOption); 
    console.log(selectedOption);
  };
  const handleUp = (selectedOption) => {
    setSelectedUp(selectedOption);
    console.log(selectedOption); 
  };
  function registrarProducto() {
    const descripcion_producto = document.getElementById('descripcion_producto').value;
    Validate.validarCampos('.form-empty');
    const validacionExitosa = Validate.validarSelect('.form-empt');
    
    if (!validacionExitosa) {
      Sweet.registroFallido();
      return;
    }
  
    fetch('http://localhost:3000/producto/registrar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ descripcion_producto, fk_id_up: selectedUp.value, fk_id_tipo_producto: selectedTipo.value }),
    })
    .then((res) => res.json())
    .then(data => {
      if (data.status === 200) {
        Sweet.exito(data.message);
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }
        listarProducto();
        setShowModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      } else if (data.status === 403) {
        Sweet.error(data.error.errors[0].msg);
      } else if(data.status === 409){
        Sweet.error(data.message);
        return;
      } else {
        console.error('Error en la petición:', data);
        Sweet.error('Hubo un error al registrar el producto.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      Sweet.error('Hubo un error al registrar el producto.');
    });
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
    const validacionExitosa = Validate.validarCampos('.form-update');
      
    fetch(`http://localhost:3000/producto/actualizar/${id}`,{
      method: 'PUT',
      headers:{
        'Content-type':'application/json'
      },
      body: JSON.stringify(productoSeleccionado),
    })
    .then((res)=>res.json())
    .then((data)=>{
      if (!validacionExitosa) {
        Sweet.actualizacionFallido();
        return;
      }
      if (data.status == 200) {
        Sweet.exito(data.message);
        console.log(data);
        listarProducto();
        setUpdateModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      }
      if (data.status == 403) {
        Sweet.error(data.error.errors[0].msg);
      return;
      }
      
    })
  }
  function deshabilitarProducto(id) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/producto/deshabilitar/${id}`, {
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
            listarProducto();
          })
          .catch(error => {
            console.error('Error:', error);
          });
      }
    });
  }
  function busquedaInventario() {
    let categoria = localStorage.getItem('category')
    console.log(categoria);
    // favor dejar de ultimo...
    localStorage.removeItem('category');
  }
  function activarProducto(id) {
    Sweet.confirmacionActivar().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:3000/producto/activar/${id}`, {
          method: 'PATCH',
          headers: {
            "Content-type": "application/json"
          }
        })
        .then(res => res.json())
        .then(data => {
          console.log(data);
          if (data.status === 200) {
            Sweet.habilitadoExitoso();
          }
          if (data.status === 401) {
            Sweet.habilitadoFallido();
          }
          listarProducto();
        })
        .catch(error => {
          console.error('Error:', error);
        });
      }
    });
  }

  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button type="button" id="modalProducto" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => {setShowModal(true);Validate.limpiar('.limpiar'); resetFormState();setSelectedTipo(null);setSelectedUp(null);}}>
          Registrar Nuevo Producto
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
                onClick={exportPdfHandler}                >
                <img src={PdfLogo} className="logoExel" />
              </button>
            </div>
          </div>
      </div>
      <div className="wrapper-editor">
      <table id="dtBasicExample" className="table table-striped table-bordered border display responsive nowrap" cellSpacing={0} width="100%" ref={tableRef}>
        <thead className="text-center text-justify">
          <tr>
            <th className="th-sm">N°</th>
            <th className="th-sm">NombreProducto</th>
            <th className="th-sm">NombreCategoria</th>
            <th className="th-sm">Peso</th>
            <th className="th-sm">Unidad</th>
            <th className="th-sm">PrecioIndividual</th>
            <th className="th-sm">UnidadProductiva</th>
            <th className="th-sm">Descripcion</th>
            <th className="th-sm">PrecioTotal</th>
            <th className="th-sm text-center">Fecha de Caducidad</th>
            <th className="th-sm text-center">Acciones</th>
          </tr>
        </thead>
          <tbody id="tableProducto" className="text-center">
            {productos.length === 0 ? (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2> En este momento no contamos con ningún producto disponible.😟</h2>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (                     // <td>{Validate.formatFecha(element.FechaCaducidad)}
              <>
                {productos.map((element) => (
                    <tr key={element.id_producto} style={{ textTransform: 'capitalize' }}>
                      <td>{element.id_producto}</td>
                      <td>{element.NombreProducto}</td>
                      <td>{element.NombreCategoria}</td>
                      <td>{element.Peso}</td>
                      <td>{element.Unidad}</td>
                      <td>{element.PrecioIndividual}</td>
                      <td>{element.UnidadProductiva}</td>
                      <td>{element.Descripcion}</td>
                      <td>{element.PrecioTotal.toFixed(2)}</td>
                      <td>{Validate.formatFecha(element.FechaCaducidad)}</td>
                      <td>
                      {element.estado === 1 ? (
                        <>
                          <button className="btn btn-color mx-2" onClick={() => { setUpdateModal(true); editarProducto(element.id_producto); resetFormState();}} data-bs-toggle="modal" data-bs-target="#staticBackdrop2">
                          <IconEdit /> 
                          </button>
                          <button className="btn btn-danger" onClick={() => deshabilitarProducto(element.id_producto)}><IconTrash /></button>
                        </>
                      ): (
                          <button className="btn btn-primary" onClick={() => activarProducto(element.id_producto)}>Activar</button>
                      )}
                      </td>
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div className="modal fade"data-bs-keyboard="false"id="staticBackdrop"tabIndex="-1"aria-labelledby="staticBackdropLabel"aria-hidden="true" data-bs-backdrop="static" ref={modalProductoRef} style={{ display: showModal ? 'block' : 'none' }} >
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Registrar Producto</h1>
                <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="fk_id_tipo_producto" className="label-bold mb-2">Tipo Producto</label>
                    <Select
                        className="react-select-container  form-empt my-custom-class"
                        classNamePrefix="react-select"
                        options={tipos.map(element => ({ value: element.id, label: element.NombreProducto}))}
                        placeholder="Selecciona..."
                        onChange={handleTipo}
                        value={selectedTipo}
                        id="fk_id_tipo_producto"
                      />
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un tipo de producto.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="fk_id_up" className="label-bold mb-2">Bodega</label>
                    <Select
                        className="react-select-container  form-empt my-custom-class"
                        classNamePrefix="react-select"
                        options={up.map(element => ({ value: element.id_up, label: element.nombre_up}))}
                        placeholder="Selecciona..."
                        onChange={handleUp}
                        value={selectedUp}
                        id="fk_id_up"
                      />
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione una unidad de peso.
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="descripcionProducto" className="label-bold mb-2">Descripción</label>
                  <textarea className="form-control form-empty limpiar" id="descripcion_producto" placeholder="Descripción del Producto" name="descripcion_producto" rows="4"></textarea>
                  <div className="invalid-feedback is-invalid">
                    Por favor, ingrese una descripción del producto.
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { resetFormState();}}>
                Cerrar
              </button>
              <button type="button" className="btn btn-color" onClick={registrarProducto}>
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade"data-bs-keyboard="false"id="staticBackdrop2"tabIndex="-1"aria-labelledby="staticBackdropLabel"aria-hidden="true" data-bs-backdrop="static" ref={modalUpdateRef} style={{display:updateModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg text-white">
              <h1 className="modal-title fs-5" id="actualizarModalLabel">Actualizar Producto</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="fk_id_tipo_producto" className="label-bold mb-2">Tipo Producto</label>
                    <select className="form-select limpiar form-update form-control" value={productoSeleccionado.fk_id_tipo_producto || ''}onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, fk_id_tipo_producto: e.target.value })} id="fk_id_tipo_producto"name="fk_id_tipo_producto">
                    <option value="">Selecciona...</option>
                    {tipos.map((option) => (
                      <option key={option.id} value={option.id}>{option.NombreProducto}</option>
                    ))}
                  </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione un tipo de producto.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="fk_id_up" className="label-bold mb-2">Bodega</label>
                    <select className="form-select limpiar form-update form-control" value={productoSeleccionado.fk_id_up || ''}onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, fk_id_up: e.target.value })} id="fk_id_up" name="fk_id_up">
                    <option value="">Selecciona...</option>
                    {up.map((option) => (
                            <option key={option.id_up} value={option.id_up}>{option.nombre_up}</option>
                          ))}
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, seleccione una bodega.
                    </div>
                  </div>

                </div>

                <div className="mb-3">
                  <label htmlFor="descripcionProducto" className="label-bold mb-2">Descripción</label>
                  <textarea className="form-control form-update" placeholder="Descripción del Producto" name="descripcion_producto" rows="4" value={productoSeleccionado.descripcion_producto || ''} onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, descripcion_producto: e.target.value })}
                  ></textarea>
                  <div className="invalid-feedback is-invalid">
                    Por favor, ingrese una descripción del producto.
                  </div>
                </div>
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
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