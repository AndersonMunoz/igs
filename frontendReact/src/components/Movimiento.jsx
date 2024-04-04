import React, { useState, useEffect, useRef } from "react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';
import '../style/movimiento.css';
import ExelLogo from "../../img/excel.224x256.png";
import PdfLogo from "../../img/pdf.224x256.png";
import esES from '../languages/es-ES.json';
import $ from 'jquery';
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import { Link } from "react-router-dom";
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import portConexion from "../const/portConexion";

const Movimiento = () => {
  

  const [movimientos, setMovimientos] = useState([]);
  const [productosCategoria,setProCat] = useState([]);
  const [unidadesProductos,setUniPro] = useState([]);
  const [aplicaFechaCaducidad, setAplicaFechaCaducidad] = useState(false);
  const [categoria_list, setcategorias_producto] = useState([]);
  const [proveedor_list, setProveedor] = useState([]);
  const [tipos, setTipo] = useState([]);
  const [usuario_list, setUsuario] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [movimientoSeleccionado, setMovimientoSeleccionado] = useState({});
  const modalUpdateRef = useRef(null);
  const modalProductoRef = useRef(null);
  
  const tableRef = useRef(null);
  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelTotal');
    xlsx.writeFile(wb, 'MovimientoTotal.xlsx');
  };
  const exportPdfHandler = () => {
    const doc = new jsPDF('landscape');
  
    const columns = [
      { title: 'Nombre producto', dataKey: 'nombre_tipo' },
      { title: 'Categoría', dataKey: 'nombre_categoria' },
      { title: 'Tipo categoría', dataKey: 'tipo_categoria' },
      { title: 'Código categoría', dataKey: 'codigo_categoria' },
      { title: 'Fecha del movimiento', dataKey: 'fecha_movimiento' },
      { title: 'Tipo de movimiento', dataKey: 'tipo_movimiento' },
      { title: 'Cantidad', dataKey: 'cantidad_peso_movimiento' },
      { title: 'Unidad Peso', dataKey: 'unidad_peso' },
      { title: 'Precio movimiento', dataKey: 'precio_movimiento' },
      { title: 'Precio total', dataKey: 'precio_total_mov' },
      { title: 'Estado producto', dataKey: 'estado_producto_movimiento' },
      { title: 'Nota', dataKey: 'nota_factura' },
      { title: 'Fecha de caducidad', dataKey: 'fecha_caducidad' },
      { title: 'Usuario que hizo movimiento', dataKey: 'nombre_usuario' },
      { title: 'Proveedor', dataKey: 'nombre_proveedores' },
    ];
  
    // Obtener los datos de la tabla
    const tableData = movimientos.map((element) => ({
      nombre_tipo: element.nombre_tipo,
      nombre_categoria: element.nombre_categoria,
      tipo_categoria: element.tipo_categoria,
      codigo_categoria: element.codigo_categoria,
      fecha_movimiento: Validate.formatFecha(element.fecha_movimiento),
      tipo_movimiento: element.tipo_movimiento,
      cantidad_peso_movimiento: element.cantidad_peso_movimiento,
      unidad_peso: element.unidad_peso,
      precio_movimiento: element.precio_movimiento,
      precio_total_mov: element.precio_total_mov,
      estado_producto_movimiento: element.estado_producto_movimiento,
      nota_factura: element.nota_factura,
      fecha_caducidad: Validate.formatFecha(element.fecha_caducidad),
      nombre_usuario: element.nombre_usuario,
      nombre_proveedores: element.nombre_proveedores,
    }));
  
    // Agregar las columnas y los datos a la tabla del PDF
    doc.autoTable({
      columns,
      body: tableData,
      margin: { top: 20 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [0, 100,0] },
    });
  
    // Guardar el PDF
    doc.save('MovimientosTotales.pdf');
  };
  const getTableData = () => {
    const wsData = [];

    // Obtener las columnas
    const columns = [
      'Nombre producto',
      'Categoría',
      'Tipo categoría',
      'Código categoría',
      'Fecha del movimiento',
      'Tipo de movimiento',
      'Cantidad',
      'Unidad Peso',
      'Precio individual',
      'Precio total',
      'Estado producto',
      'Nota',
      'Fecha de caducidad',
      'Usuario que hizo movimiento',
      'Proveedor'
    ];
    wsData.push(columns);

    // Obtener los datos de las filas
    movimientos.forEach(element => {
      const rowData = [
        element.nombre_tipo,
        element.nombre_categoria,
        element.tipo_categoria,
        element.codigo_categoria,
        Validate.formatFecha(element.fecha_movimiento),
        element.tipo_movimiento,
        element.cantidad_peso_movimiento,
        element.unidad_peso,
        element.precio_movimiento,
        element.precio_total_mov,
        element.estado_producto_movimiento,
        element.nota_factura,
        Validate.formatFecha(element.fecha_caducidad),
        element.nombre_usuario,
        element.nombre_proveedores
      ];
      wsData.push(rowData);
    });

    return wsData;
  };
  const handleCheckboxChange = () => {
    setAplicaFechaCaducidad(!aplicaFechaCaducidad);
  };
  const fkIdUsuarioRef = useRef(null);

  const [aplicaFechaCaducidad2, setAplicaFechaCaducidad2] = useState(false);

  const handleCheckboxChange2 = () => {
    setAplicaFechaCaducidad2(!aplicaFechaCaducidad2);
  };
  const resetFormState = () => {
    const formFields = modalProductoRef.current.querySelectorAll('.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]');
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
  useEffect(() => {
    if (movimientos.length > 0) {
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
  }, [movimientos]);


  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }

  useEffect(() => {
    window.onpopstate = function(event) {
      window.location.reload();
    };
    listarMovimiento();
    listarCategoria();
    listarTipo();
    listarProveedor();
    listarUsuario();

  }, []);

  function listarCategoria() {
    fetch(`http://${portConexion}:3000/categoria/listar`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token")
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
          setcategorias_producto(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function listarTipo() {
    fetch(`http://${portConexion}:3000/tipo/listar`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem("token")
      },
    })
      .then((res) => {
        if (res.status === 204) {
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
  function listarProveedor() {
    fetch(`http://${portConexion}:3000/proveedor/listar`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        token: localStorage.getItem("token")
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedor(data)
      })
      .catch((e) => {
        console.log(e);
      })
      ;
  }


  function listarProductoCategoria(id_categoria) {

    fetch(
      `http://${portConexion}:3000/facturamovimiento/buscarProCat/${id_categoria == '' ? 0 : id_categoria}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: localStorage.getItem("token")
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUniPro([]);
        setProCat(data);
        
        console.log("PRODUCTO - CATEGORIA : ", data);
      })
      .catch((e) => {
        setProCat([]);
        console.log("Error:: ", e);
      });
  }

  function listarUnidadesPro(id_producto) {

    fetch(
      `http://${portConexion}:3000/facturamovimiento//buscarUnidad/${id_producto == '' ? 0 : id_producto}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
          token: localStorage.getItem("token")
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setUniPro(data);
        console.log("Unidades producto   : ", data);
      })
      .catch((e) => {
        setUniPro([]);
        console.log("Error:: ", e);
      });
  }
  function editarMovimiento(id) {
    fetch(`http://${portConexion}:3000/facturamovimiento/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.getItem("token")
      },
    })
      .then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setMovimientoSeleccionado(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  function actualizarMovimiento(id) {
    const validacionExitosa = Validate.validarCampos('.form-update');
    
    fetch(`http://${portConexion}:3000/facturamovimiento/actualizar/${id}`, {
      method: "PUT",
      headers: {
        'Content-type': 'application/json',
        token: localStorage.getItem("token")
      },
      body: JSON.stringify(movimientoSeleccionado),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.actualizacionFallido();
          return;
        }
        if (data.status == 200) {
          Sweet.exito(data.message);
        }
        if (data.status == 401) {
          Sweet.error(data.error.errors[0].msg);
        return;}
        //console.log(data);
        listarMovimiento();
        setUpdateModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      })
  }
  function registrarMovimiento() {

    let fk_id_usuario = fkIdUsuarioRef.current.value;
    let tipo_movimiento = document.getElementById('tipo_movimiento').value;
    let num_lote = document.getElementById('num_lote').value;
    let cantidad_peso_movimiento = document.getElementById('cantidad_peso_movimiento').value;
    let precio_movimiento = document.getElementById('precio_movimiento').value;
    let estado_producto_movimiento = document.getElementById('estado_producto_movimiento').value;
    let nota_factura = document.getElementById('nota_factura').value;
    let fecha_caducidad = null;
    let fk_id_producto = document.getElementById('fk_id_producto').value;
    let fk_id_proveedor = document.getElementById('fk_id_proveedor').value;
    if (aplicaFechaCaducidad) {
      fecha_caducidad = document.getElementById('fecha_caducidad').value;
    }

    const validacionExitosa = Validate.validarCampos('.form-empty');

    fetch(`http://${portConexion}:3000/facturamovimiento/registrar`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      body: JSON.stringify({ tipo_movimiento, cantidad_peso_movimiento,  precio_movimiento, estado_producto_movimiento, nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor, num_lote }),
    })
    .then((res) => res.json())
    .then(data => {
      if (!validacionExitosa) {
        Sweet.registroFallido();
        return;
      }
      if (data.status === 200) {
        Sweet.exito(data.message);
        if ($.fn.DataTable.isDataTable(tableRef.current)) {
          $(tableRef.current).DataTable().destroy();
        }
        listarMovimiento();
      }
      
      if (data.status === 403) {
        Sweet.error(data.error.errors[0].msg);
        return;
      }
      if (data.status === 409) {
        Sweet.error(data.message);
        return;
      }
      console.log(data);
      listarMovimiento();
      setShowModal(false);
      removeModalBackdrop();
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }

    })
    .catch(error => {
      console.error('Error:', error);
    })
    //console.log(document.getElementById('fecha_caducidad'));
  }
  function listarUsuario() {
    fetch(`http://${portConexion}:3000/usuario/listar`, {
      method: "get",
      headers: {
        "content-type": "application/json",
        token: localStorage.getItem("token")
      }
    }).then((res) => {
      if (res.status === 204) {
        return null;
      }
      return res.json();
    })
      .then(data => {
        setUsuario(data);
      })
      .catch(e => { console.log(e); })
  }

  function listarMovimiento() {
    fetch(`http://${portConexion}:3000/facturamovimiento/listar`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
        token: localStorage.getItem("token")
      },
    }).then((res) => {
      if (res.status === 204) {
        return null;
      }
      return res.json();
    })
      .then((data) => {
        if (Array.isArray(data)) {
          setMovimientos(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }



  return (
    <>
      <div>
        <h1 className="text-center modal-title fs-5 m-4">Movimientos Totales</h1>
        <div className="d-flex justify-content-between mb-4">
          <div>
          <Link to="/movimiento/entrada"><button type="button"  className="btn-color btn  m-1 ">Registrar Entrada</button></Link>
          <Link to="/movimiento/salida"><button type="button" className="btn btn-danger m-1 ">Registrar Salida</button></Link>
            
          </div>
          
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
        <div className="container-fluid w-full">
          <table id="dtBasicExample"
            className="table table-striped table-bordered border display responsive nowrap b-4"
            ref={tableRef}
            cellSpacing={0}
            width="100%">
            <thead className="text-center text-justify">
              <tr>
                <th className="th-sm">N°</th>
                <th className="th-sm">Nombre producto</th>
                <th className="th-sm">Categoria</th>                
                <th className="th-sm">Código categoría</th>
                <th className="th-sm">Tipo categoría</th>
                <th className="th-sm">Fecha del movimiento</th>
                <th className="th-sm">Tipo de movimiento</th>
                <th className="th-sm">Cantidad</th>
                <th className="th-sm">Unidad</th>
                <th className="th-sm">Precio individual</th>
                <th className="th-sm">Estado producto</th>
                <th className="th-sm">Nota</th>
                <th className="th-sm">Fecha de caducidad</th>
                <th className="th-sm">Usuario que hizo movimiento</th>
                <th className="th-sm">Proveedor</th>
                <th className="th-sm">Precio total</th>
              </tr>
            </thead>
            <tbody id="tableMovimiento">
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={16}>
                    <div className="d-flex justify-content-center">
                      <div className="alert alert-danger text-center mt-4 w-50">
                        <h2> En este momento no contamos con ningún movimiento disponible.😟</h2>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {movimientos.map((element,index) => (
                    <tr style={{ textTransform: 'capitalize' }}  key={element.id_factura}>
                      <td className="p-2 text-center" >{index+1}</td>
                      <td className="p-2 text-center" >{element.nombre_tipo}</td>
                      <td className="p-2 text-center">{element.nombre_categoria}</td>
                      <td className="p-2 text-center">{element.codigo_categoria}</td>
                      <td className="p-2 text-center">{element.tipo_categoria}</td>
                      <td className="p-2 text-center" >{Validate.formatFecha(element.fecha_movimiento)}</td>
                      <td className="p-2 text-center" >{element.tipo_movimiento}</td>
                      <td className="p-2 text-center" >
                        {Number.isInteger(element.cantidad_peso_movimiento) ? element.cantidad_peso_movimiento : element.cantidad_peso_movimiento.toFixed(2)}
                      </td>
                      <td className="p-2 text-center" >{element.unidad_peso}</td>
                      <td className="p-2 text-center" >
                        {isNaN(Number(element.precio_movimiento)) ? element.precio_movimiento : (Number.isInteger(Number(element.precio_movimiento)) ? Number(element.precio_movimiento) : Number(element.precio_movimiento).toFixed(2))}
                      </td>
                      <td className="p-2 text-center" >{element.estado_producto_movimiento}</td>
                      <td className="p-2 text-center" >{element.nota_factura}</td>
                      <td className="p-2 text-center" >{Validate.formatFecha(element.fecha_caducidad)}</td>
                      <td className="p-2 text-center" >{element.nombre_usuario}</td>
                      <td className="p-2 text-center" >{element.nombre_proveedores}</td>
                      <td className="p-2 text-center">{element.precio_total_mov}</td>
                    </tr>
                  ))}</>)}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center align-items-center w-full h-full">
          <div className="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalProductoRef} style={{ display: showModal ? 'block' : 'none' }} >
            <div className="modal-dialog modal-xl modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header txt-color">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Registro de movimiento</h1>
                  <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>

                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="categoria">Categoria</label>
                          <select onChange={(e)=>{listarProductoCategoria(e.target.value)}} className="form-select form-empty limpiar" id="categoria" name="categoria" aria-label="Default select example">
                            <option value="">Selecciona una categoria</option>
                            {categoria_list.map((element) => (
                              
                              <option  key={element.id_categoria} value={element.id_categoria}>{element.nombre_categoria}</option>
                            ))}
                          </select>
                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione una categoria.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="fk_id_producto">Producto</label>
                          <select onChange={(e)=>{listarUnidadesPro(e.target.value)}} defaultValue="" className="form-select form-empty limpiar" id="fk_id_producto" name="fk_id_producto" aria-label="Default select example">
                            <option value="">Seleccione una opción</option>
                            {productosCategoria.length > 0 ? productosCategoria.map((element) => (
                              <option key={element.id_producto} value={element.id_producto}>{element.nombre_tipo}</option>
                            )): ""}
                          </select>
                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione un producto.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="tipo_movimiento">Tipo de movimeinto</label>
                          <select defaultValue="" className="form-select form-empty limpiar" id="tipo_movimiento" name="tipo_movimiento" aria-label="Default select example">
                            <option value="">Seleccione una opción</option>
                            <option value="entrada">Entrada</option>
                            <option value="salida">Salida</option>
                          </select>
                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione un tipo de movimiento.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="fk_id_proveedor">Proveedor</label>
                          <select defaultValue="" className="form-select form-empty limpiar" id="fk_id_proveedor" name="fk_id_proveedor" aria-label="Default select example">
                            <option value="">Seleccione una opción</option>
                            {proveedor_list.map((element) => (
                              <option key={element.id_proveedores} value={element.id_proveedores}>{element.nombre_proveedores}</option>
                            ))}
                          </select>
                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione un proveedor.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="cantidad_peso_movimiento">Cantidad</label>
                          <input type="number" id="cantidad_peso_movimiento" name="cantidad_peso_movimiento" className="form-control form-empty limpiar" />
                          <div className="invalid-feedback is-invalid">
                            Por favor, ingrese una cantidad.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="unidad_peso_movimiento">Unidad</label><br></br>
                          
                            

                          {unidadesProductos.length > 0 ? unidadesProductos.map((element) => (
                              <input type="text" id="unidad_peso_movimiento" className="form-control form-empty limpiar" name="unidad_peso_movimiento"key={element.id_producto} defaultValue={element.unidad_peso}/>
                              )): "No hay unidad de medida"}
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="precio_movimiento">Precio total del producto:</label>
                          <input type="number" id="precio_movimiento" name="precio_movimiento" className="form-control form-empty limpiar" />
                          <div className="invalid-feedback is-invalid">
                            Por favor, ingrese un peso válido.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="estado_producto_movimiento">Estado</label>
                          <select defaultValue="" className="form-select form-empty limpiar" id="estado_producto_movimiento" name="estado_producto_movimiento" aria-label="Default select example">
                            <option value="">Seleccione una opción</option>
                            <option value="bueno">Bueno</option>
                            <option value="regular">Regular</option>
                            <option value="malo">Malo</option>
                          </select>
                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione un estado.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="num_lote">Número de Lote</label>
                          <input type="number" id="num_lote" name="num_lote" className="form-control form-empty limpiar" />
                          <div className="invalid-feedback is-invalid">
                            Por favor, ingrese un número válido.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="nota_factura">Nota</label>
                          <input type="text" id="nota_factura" name="nota_factura" className="form-control form-empty limpiar" />
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="fk_id_usuario'">Usuario</label>
                          <select
                            className="form-select form-empty limpiar"
                            id="fk_id_usuario"
                            name="fk_id_usuario"
                            aria-label="Default select example"
                            ref={fkIdUsuarioRef}
                          >
                            <option defaultValue="" value="">
                              Selecciona un usuario
                            </option>
                            {usuario_list.map((element) => (
                              <option key={element.id_usuario} value={element.id_usuario}>
                                {element.nombre_usuario}
                              </option>
                            ))}
                          </select>
                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione el usuario que hizo el movimiento.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <p>¿Aplica fecha de caducidad?</p>
                          <div className="form-check">
                            <input
                              className="form-check-input form-empty limpiar"
                              type="checkbox"
                              value={aplicaFechaCaducidad}
                              id="flexCheckDefault"
                              onChange={handleCheckboxChange}
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault">
                              Si
                            </label>
                          </div>
                        </div>
                      </div>
                      {aplicaFechaCaducidad && (
                        <div className="col">
                          <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="fecha_caducidad">
                              Fecha caducidad
                            </label>
                            <input
                              type="date"
                              id="fecha_caducidad"
                              name="fecha_caducidad"
                              className="width: 20% form-control form-empty limpiar"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="button" className="btn-color btn" onClick={registrarMovimiento}>Registrar</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="movimientoEditarModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="actualizarModalLabel">Editar de movimiento</h1>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="estado_producto_movimiento">Estado</label>
                          <select className="form-control limpiar form-update" value={movimientoSeleccionado.estado_producto_movimiento || ''} name="estado_producto_movimiento" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, estado_producto_movimiento: e.target.value })}>
                            <option value="">Seleccione una opción</option>
                            <option value="bueno">Bueno</option>
                            <option value="regular">Regular</option>
                            <option value="malo">Malo</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="nota_factura">Nota</label>
                          <input type="text" className="form-control form-update limpiar" placeholder="Precio del Producto" value={movimientoSeleccionado.nota_factura || ''} name="nota_factura" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, nota_factura: e.target.value })} />
                          <div className="invalid-feedback is-invalid">
                          Por favor, ingrese una nota mas larga.
                        </div>
                        </div>
                      </div>
                    </div>
                    <div className="col">
                      <div data-mdb-input-init className="form-outline">
                        <label className="form-label" htmlFor="num_lote">Número lote</label>
                        <input type="number" id="num_lote" name="num_lote" className="form-control form-update " value={movimientoSeleccionado.num_lote || ''} onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, num_lote: e.target.value })} />
                        <div className="invalid-feedback is-invalid">
                          Por favor, ingrese una cantidad.
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <p>¿Deseas editar la fecha de caducidad?</p>
                          <div className="form-check">
                            <input
                              className="form-check-input form-update "
                              type="checkbox"
                              value={aplicaFechaCaducidad2}
                              id="flexCheckDefault2"
                              onChange={handleCheckboxChange2}
                            />
                            <label className="form-check-label" htmlFor="flexCheckDefault2">
                              Si
                            </label>
                          </div>
                        </div>
                      </div>
                      {aplicaFechaCaducidad2 && (
                        <div className="col">
                          <label className="form-label" htmlFor="fecha_caducidad">
                            Fecha caducidad
                          </label>
                          <input
                            type="date"
                            id="fecha_caducidad"
                            className="width: 20% form-control form-update"
                            value={movimientoSeleccionado.fecha_caducidad || ''} name="fecha_caducidad" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, fecha_caducidad: e.target.value })}
                          />
                        </div>
                      )}
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => { resetFormState();}}>Cerrar</button>
                  <button type="button" className="btn btn-color" onClick={() => { actualizarMovimiento(movimientoSeleccionado.id_factura); }}>Actualizar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
  );
};

export default Movimiento;