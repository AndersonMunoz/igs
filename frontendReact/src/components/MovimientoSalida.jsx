import React, { useState, useEffect, useRef } from "react";
import {Link } from "react-router-dom";
import Sweet from '../helpers/Sweet';
import { dataDecript } from "./encryp/decryp";
import Validate from '../helpers/Validate';
import '../style/movimiento.css';
import { IconEdit } from "@tabler/icons-react";
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
import generatePDF from 'react-to-pdf';
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import portConexion from "../const/portConexion";

const Movimiento = () => {
  const [userId, setUserId] = useState('');
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
  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelT  Salida');
    xlsx.writeFile(wb, 'MovimientoSalida.xlsx');
  };
  const exportPdfHandler = () => {
    const doc = new jsPDF('landscape');
  
    const columns = [
      { title: 'Nombre producto', dataKey: 'nombre_tipo' },
      { title: '# Lote', dataKey: 'num_lote' },
      { title: 'Fecha del movimiento', dataKey: 'fecha_movimiento' },
      { title: 'Tipo de movimiento', dataKey: 'tipo_movimiento' },
      { title: 'Cantidad', dataKey: 'cantidad_peso_movimiento' },
      { title: 'Unidad Peso', dataKey: 'unidad_peso' },
      { title: 'Nota', dataKey: 'nota_factura' },
      { title: 'Usuario que hizo movimiento', dataKey: 'nombre_usuario' }
    ];
  
    // Obtener los datos de la tabla
    const tableData = movimientos.map((element) => ({
      nombre_tipo: element.nombre_tipo,
      num_lote: element.num_lote,
      fecha_movimiento: Validate.formatFecha(element.fecha_movimiento),
      tipo_movimiento: element.tipo_movimiento,
      cantidad_peso_movimiento: element.cantidad_peso_movimiento,
      unidad_peso: element.unidad_peso,
      nota_factura: element.nota_factura,
      nombre_usuario: element.nombre_usuario,
    }));
  
    // Agregar las columnas y los datos a la tabla del PDF
    doc.autoTable({
      columns,
      body: tableData,
      margin: { top: 20 },
      styles: { overflow: 'linebreak' },
      headStyles: { fillColor: [0,100,0] },
    });
  
    // Guardar el PDF
    doc.save('MovimientosSalida.pdf');
  };
  const getTableData = () => {
    const wsData = [];

    // Obtener las columnas
    const columns = [
      'Nombre producto',
      '# Lote',
      'Fecha del movimiento',
      'Tipo de movimiento',
      'Cantidad',
      'Unidad Peso',
      'Nota',
      'Usuario que hizo movimiento'
    ];
    wsData.push(columns);

    // Obtener los datos de las filas
    movimientos.forEach(element => {
      const rowData = [
        element.nombre_tipo,
        element.num_lote,
        Validate.formatFecha(element.fecha_movimiento),
        element.tipo_movimiento,
        element.cantidad_peso_movimiento,
        element.unidad_peso,
        element.nota_factura,
        element.nombre_usuario
      ];
      wsData.push(rowData);
    });

    return wsData;
  };
  const handleCheckboxChange = () => {
    setAplicaFechaCaducidad(!aplicaFechaCaducidad);

  };
  const tableRef = useRef();
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
    setUserId(dataDecript(localStorage.getItem('id')));
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
        
        //console.log("PRODUCTO - CATEGORIA : ", data);
      })
      .catch((e) => {
        setProCat([]);
        console.log("Error:: ", e);
      });
  }

  function listarUnidadesPro(id_producto) {

    fetch(
      `http://${portConexion}:3000/facturamovimiento/buscarUnidad/${id_producto == '' ? 0 : id_producto}`,
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
        //console.log("Unidades producto   : ", data);
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
    fetch(`http://${portConexion}:3000/facturamovimiento/actualizarSalida/${id}`, {
    method: "PUT",
    headers: {
      'Content-type': 'application/json',
      token: localStorage.getItem("token")
    },
    body: JSON.stringify(movimientoSeleccionado),
  })
  .then((res) => {
    if (!res.ok) {
      throw res;
    }
    return res.json();
  })
  .then((data) => {
    Sweet.exito(data.message);
    listarMovimiento();
    setUpdateModal(false);
    removeModalBackdrop(true );
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
        modalBackdrop.remove();
      }
  })
  .catch((error) => {
    error.json().then((body) => {
      if (body.status === 409) {
        Sweet.error('El número de lote ya está registrado');
      } else if (body.errors) {
        body.errors.forEach((err) => {
          Sweet.error(err.msg);
        });
      } else {
        Sweet.error('Error en el servidor');
      }
    });
  });
  }
  function registrarMovimientoSalida() {

    let fk_id_usuario =userId;
    let num_lote = document.getElementById('num_lote').value;
    let cantidad_peso_movimiento = document.getElementById('cantidad_peso_movimiento').value;
    let nota_factura = document.getElementById('nota_factura').value;
    let fecha_caducidad = null;
    let fk_id_producto = document.getElementById('fk_id_producto').value;
    if (aplicaFechaCaducidad) {
      fecha_caducidad = document.getElementById('fecha_caducidad').value;
    }

    const validacionExitosa = Validate.validarCampos('.form-empty');

    fetch(`http://${portConexion}:3000/facturamovimiento/registrarSalida`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token")
      },
      body: JSON.stringify({cantidad_peso_movimiento, nota_factura,  fk_id_producto, fk_id_usuario, num_lote }),
    })
    .then((res) => res.json())
    .then(data => {
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
      if (data.status === 402) {
        Sweet.error(data.mensaje); // El mensaje de error debe estar en data.mensaje
        return;
      }
      if (data.status === 409) {
        Sweet.error(data.message); // Mostrar mensaje de error para el conflicto de lote
        return;
      }
      /* console.log(data); */
      listarMovimiento();
      setShowModal(false);
      removeModalBackdrop(true );
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
    fetch(`http://${portConexion}:3000/facturamovimiento/listarSalida`, {
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
        <h1 className="text-center modal-title fs-5 m-4">Movimientos de Salida</h1>
        <div className="d-flex justify-content-between mb-4">
          <div>
          <button type="button" className="btn-color btn  m-1 " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setShowModal(true); Validate.limpiar('.limpiar'); resetFormState();}}>
            Registrar nuevo movimiento de Salida
          </button>
          <Link to="/movimiento"><button type="button"  className="btn btn-primary m-1 ">Volver a Movimientos Totales</button></Link>
          
          </div>
          <div className="btn-group" role="group" aria-label="Basic mixed styles example">
            <div className="" title="Descargar Excel">
            <div className="" title="Descargar Excel">
            <button onClick={handleOnExport} type="button" className="btn btn-light">
                <img src={ExelLogo} className="logoExel" />
                </button>
            </div>
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
                <th className="th-sm"># Lote</th>
                <th className="th-sm">Fecha del movimiento</th>
                <th className="th-sm">Tipo de movimiento</th>
                <th className="th-sm">Cantidad</th>
                <th className="th-sm">Unidad Peso</th>
                <th className="th-sm">Nota</th>
                <th className="th-sm">Usuario que hizo movimiento</th>
                <th className="th-sm">Editar</th>
              </tr>
            </thead>
            <tbody id="tableMovimiento">
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={13}>
                    <div className="d-flex justify-content-center">
                      <div className="alert alert-danger text-center mt-4 w-50">
                        <h2> En este momento no contamos con ningún movimiento disponible.😟</h2>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {movimientos.map((element) => (
                    <tr style={{ textTransform: 'capitalize' }} key={element.id_factura}>
                      <td className="p-2 text-center" >{element.id_factura}</td>
                      <td className="p-2 text-center">{element.nombre_tipo}</td>
                      <td className="p-2 text-center">{element.num_lote}</td>
                      <td className="p-2 text-center">{Validate.formatFecha(element.fecha_movimiento)}</td>
                      <td className="p-2 text-center">{element.tipo_movimiento}</td>
                      <td className="p-2 text-center" >
                        {Number.isInteger(element.cantidad_peso_movimiento) ? element.cantidad_peso_movimiento : element.cantidad_peso_movimiento.toFixed(2)}
                      </td>
                      <td className="p-2 text-center">{element.unidad_peso}</td>
                      <td className="p-2 text-center">{element.nota_factura}</td>
                      <td className="p-2 text-center">{element.nombre_usuario}</td>

                      <td className="p-0 text-center"   >
                        <button className="btn btn-color"  style={{ textTransform: 'capitalize' }}onClick={() => { setUpdateModal(true); editarMovimiento(element.id_factura); resetFormState();}} data-bs-toggle="modal" data-bs-target="#movimientoEditarModal">
                        <IconEdit />
                        </button>

                      </td>
                    </tr>

                  ))}</>)}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-center align-items-center w-80 h-full">
          <div className="modal fade" id="exampleModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalProductoRef} style={{ display: showModal ? 'block' : 'none' }} >
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header txt-color">
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Registro de movimiento de salida</h1>
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
                              <option key={element.id_producto} value={element.id_producto}>
                                {element.nombre_tipo} - {element.cantidad_peso_producto > 0 ? `${element.cantidad_peso_producto} ${element.unidad_peso} disponible(s)` : "No hay unidades disponibles"}</option>
                            )): ""}
                          </select>
                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione un producto.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="cantidad_peso_movimiento">Cantidad</label>
                          <input type="number" id="cantidad_peso_movimiento" name="cantidad_peso_movimiento"  className="form-control form-empty limpiar" />
                          <div className="invalid-feedback is-invalid">
                            Por favor, ingrese una cantidad.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline" >
                          <label className="form-label" htmlFor="unidad_peso_movimiento" >Unidad</label><br></br>
                          {unidadesProductos.length > 0 ? unidadesProductos.map((element) => (
                              <input type="text" id="unidad_peso_movimiento" disabled={true} className="form-control form-empty limpiar" name="unidad_peso_movimiento"key={element.id_tipo} defaultValue={element.unidad_peso}/>
                              )): "No hay unidad de medida"}
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
                      
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                  <button type="button" className="btn-color btn" onClick={registrarMovimientoSalida}>Registrar</button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal fade" id="movimientoEditarModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header bg text-white">
                  <h1 className="modal-title fs-5" id="actualizarModalLabel">Editar de movimiento</h1>
                  <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>
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