import React, { useState, useEffect, useRef } from "react";
import { Outlet, Link } from "react-router-dom";
import Sweet from '../helpers/Sweet'; // Importación de utilidad Sweet
import { dataDecript } from "./encryp/decryp"; // Importación de función dataDecript
import Validate from '../helpers/Validate'; // Importación de utilidad Validate
import '../style/movimiento.css'; // Importación de estilos CSS
import { IconEdit } from "@tabler/icons-react"; // Importación de icono IconEdit
import ExelLogo from "../../img/excel.224x256.png"; // Importación de logo de Excel
import PdfLogo from "../../img/pdf.224x256.png"; // Importación de logo de PDF
import esES from '../languages/es-ES.json'; // Importación de archivo de idioma es-ES.json
import $ from 'jquery'; // Importación de jQuery
import 'bootstrap'; // Importación de Bootstrap
import 'datatables.net'; // Importación de DataTables
import 'datatables.net-bs5'; // Importación de DataTables para Bootstrap 5
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'; // Importación de estilos de DataTables para Bootstrap 5
import 'datatables.net-responsive'; // Importación de funcionalidad DataTables responsive
import 'datatables.net-responsive-bs5'; // Importación de DataTables responsive para Bootstrap 5
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css'; // Importación de estilos de DataTables responsive para Bootstrap 5
import * as xlsx from 'xlsx'; // Importación de la librería xlsx
import jsPDF from 'jspdf'; // Importación de la librería jsPDF
import autoTable from 'jspdf-autotable'; // Importación de funcionalidad autoTable de jsPDF
import portConexion from "../const/portConexion"; // Importación de constante portConexion
import Select from 'react-select'; // Importación de componente Select de react-select

const Movimiento = () => {
  // Definición de estados del componente
    const [userId, setUserId] = useState('');
    const [movimientos, setMovimientos] = useState([]);
    const [productosCategoria,setProCat] = useState([]);
    const [userRoll, setUserRoll] = useState("");
    const [unidadesProductos,setUniPro] = useState([]);
    const [aplicaFechaCaducidad, setAplicaFechaCaducidad] = useState(false);
    const [categoria_list, setcategorias_producto] = useState([]);
    const [proveedor_list, setProveedor] = useState([]);
    const [tipos, setTipo] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [updateModal, setUpdateModal] = useState(false);
    const [movimientoSeleccionado, setMovimientoSeleccionado] = useState({});
    const modalUpdateRef = useRef(null);
    const modalProductoRef = useRef(null);
    const [up, setUp] = useState([]);
    const [selectedUp, setSelectedUp] = useState(null);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [selectedCategoria, setSelectedCategoria] = useState(null);
    const [fechaCaducidadModificada, setFechaCaducidadModificada] = useState(false);
    const [unidadSeleccionada, setUnidadSeleccionada] = useState('');
    const [fechaCaducidad, setFechaCaducidad] = useState()

 // Definición de referencia para la tabla
const tableRef = useRef(null);

// Función para exportar a Excel
const handleOnExport = () => {
  const wsData = getTableData();
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.aoa_to_sheet(wsData);
  xlsx.utils.book_append_sheet(wb, ws, 'ExcelEntrada');
  xlsx.writeFile(wb, 'MovimientoEntrada.xlsx');
};

// Función para exportar a PDF
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
    { title: 'Proveedor', dataKey: 'nombre_proveedores' }
  ];

  const tableData = movimientos.map((element) => {
    const fechaCaducidad = element.fecha_caducidad ? Validate.formatFecha(element.fecha_caducidad) : "No aplica";
    return {
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
      fecha_caducidad: fechaCaducidad,
      nombre_usuario: element.nombre_usuario,
      nombre_proveedores: element.nombre_proveedores,
    };
  });

  doc.autoTable({
    columns,
    body: tableData,
    margin: { top: 20 },
    styles: { overflow: 'linebreak' },
    headStyles: { fillColor: [0, 100, 0] },
  });

  doc.save('MovimientosEntrada.pdf');
};

// Función para obtener los datos de la tabla que irán en el documento excel
const getTableData = () => {
  const wsData = [];

  const columns = [
    'Nombre producto',
    'Categoría',
    'Tipo categoría',
    'Código categoría',
    'Fecha del movimiento',
    'Tipo de movimiento',
    'Cantidad',
    'Unidad Peso',
    'Precio movimiento',
    'Precio total',
    'Estado producto',
    'Nota',
    'Fecha de caducidad',
    'Usuario que hizo movimiento',
    'Proveedor'
  ];
  wsData.push(columns);

  movimientos.forEach(element => {
    const fechaCaducidad = element.fecha_caducidad ? Validate.formatFecha(element.fecha_caducidad) : "No aplica";
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
      fechaCaducidad,
      element.nombre_usuario,
      element.nombre_proveedores
    ];
    wsData.push(rowData);
  });

  return wsData;
};

 // Función para cambiar el estado de aplicaFechaCaducidad
const handleCheckboxChange = () => {
  setAplicaFechaCaducidad(!aplicaFechaCaducidad);
};

// Función para cerrar el modal y reiniciar el estado
const handleCloseModal = () => {
  setShowModal(false);
  setAplicaFechaCaducidad(false); 
  resetFormState(); 
};

// Función para manejar la selección de categoría
const handleCategoria = (selectedOption) => {
  setSelectedCategoria(selectedOption); 
  setSelectedTipo(null); 
  setUnidadSeleccionada('No hay unidad de medida');
};

// Función para manejar la selección de tipo
const handleTipo = (selectedOption) => {
  setSelectedTipo(selectedOption);
  listarUnidadesPro(selectedOption.value);
};

// Función para manejar la selección de UP
const handleUp = (selectedOption) => {
  setSelectedUp(selectedOption);
};

// Referencia para el usuario
const fkIdUsuarioRef = useRef(null);

// Estado para aplicaFechaCaducidad2 y función para cambiar su estado
const [aplicaFechaCaducidad2, setAplicaFechaCaducidad2] = useState(false);
const handleCheckboxChange2 = () => {
  setAplicaFechaCaducidad2(prevState => !prevState);
};

// Función para cerrar el modal 2 y reiniciar el estado
const handleCloseModal2 = () => {
  setShowModal(false);
  setAplicaFechaCaducidad2(false); 
  resetFormState(); 
};

// Función para manejar el cambio en la fecha de caducidad
const handleFechaCaducidadChange = (e) => {
  setMovimientoSeleccionado({ ...movimientoSeleccionado, fecha_caducidad: e.target.value });
  setFechaCaducidadModificada(true);
};

// Función para reiniciar el estado del formulario
const resetFormState = () => {
  const formFields = modalProductoRef.current.querySelectorAll('.form-control,.form-update,.my-custom-class,.form-empty, select, input[type="number"], input[type="checkbox"]');
  const formFields2 = modalUpdateRef.current.querySelectorAll('.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]');
  setAplicaFechaCaducidad2(false);
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

// Efecto para inicializar el DataTable cuando hay cambios en movimientos
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
  setUserRoll(dataDecript(localStorage.getItem("roll")));
}, [movimientos]);

 // Función para remover el backdrop del modal
function removeModalBackdrop() {
  const modalBackdrop = document.querySelector('.modal-backdrop');
  if (modalBackdrop) {
    modalBackdrop.remove();
  }
}

// Efecto para limpiar el estado del movimiento seleccionado cuando el modal de actualización se abre
useEffect(() => {
  if (updateModal) {
    setMovimientoSeleccionado({});
  }
}, [updateModal]);

// Efecto para recargar la página cuando se detecta un cambio en el historial del navegador
useEffect(() => {
  window.onpopstate = function(event) {
    window.location.reload();
  };
  setUserId(dataDecript(localStorage.getItem('id')));
  listarMovimiento();
  listarCategoria();
  listarTipo();
  listarProveedor();
  listarUp();
  if (selectedCategoria) {
    listarProductoCategoria(selectedCategoria.value);
  }
  if (selectedTipo) {
    listarUnidadesPro(selectedTipo.value);
  }
}, [selectedCategoria, selectedTipo]);

// Función para listar los UP
function listarUp() {
  fetch(`http://${portConexion}/up/listar`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token: localStorage.getItem("token"),
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
      setUp(data);
    }
  })
  .catch((e) => {
    console.error("Error al procesar la respuesta:", e);
  });
}

// Función para listar las categorías
function listarCategoria() {
  fetch(`http://${portConexion}/categoria/listarActivo`, {
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

// Función para listar los tipos
function listarTipo(){
  fetch(`http://${portConexion}/tipo/listarActivo`, {
    method: "GET",
    headers: {
      "Content-type": "application/json",
      token: localStorage.getItem("token"),
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

  // Función para listar los proveedores
function listarProveedor() {
  fetch(`http://${portConexion}/proveedor/listarActivo`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      token: localStorage.getItem("token"),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      setProveedor(data);
    })
    .catch((e) => {
      console.log(e);
    });
}

// Función para listar los productos de una categoría
function listarProductoCategoria(id_categoria) {
  fetch(
    `http://${portConexion}/facturamovimiento/buscarProCat/${id_categoria == '' ? 0 : id_categoria}`,
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
    })
    .catch((e) => {
      setProCat([]);
      console.log("Error:: ", e);
    });
}

// Función para listar las unidades de un producto
function listarUnidadesPro(id_producto) {
  fetch(
      `http://${portConexion}/facturamovimiento/buscarUnidad/${id_producto}`,
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
      if (data && data.length > 0) {
          setUnidadSeleccionada(data[0].unidad_peso);
      } else {
          setUnidadSeleccionada('No hay unidad de medida');
      }
  })
  .catch((e) => {
      setUnidadSeleccionada('No hay unidad de medida');
  });
}

// Función para editar un movimiento
function editarMovimiento(id) {
  fetch(`http://${portConexion}/facturamovimiento/buscar/${id}`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      token: localStorage.getItem("token")
    },
  })
    .then((res) => res.json())
    .then((data) => {
      
      if (data[0].fecha_caducidad) {
        let check = document.getElementById('flexCheckDefault2');
        check.checked = true; // Establecer el valor de check como true
        handleCheckboxChange2();
        setFechaCaducidad(data[0].fecha_caducidad)
        setFechaCaducidadModificada(true);
    }
    
    
      setMovimientoSeleccionado(data[0]);
      setUpdateModal(true);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

// Función para actualizar un movimiento
function actualizarMovimiento(id) {
  let fecha_caducidad = null;
  if (aplicaFechaCaducidad2 && fechaCaducidadModificada && movimientoSeleccionado.fecha_caducidad && movimientoSeleccionado.fecha_caducidad !== '') {
      const fechaSeleccionada = new Date(movimientoSeleccionado.fecha_caducidad);
      fechaSeleccionada.setDate(fechaSeleccionada.getDate() + 1);
      fecha_caducidad = fechaSeleccionada.toISOString().split('T')[0];
  } else if (movimientoSeleccionado.fecha_caducidad && movimientoSeleccionado.fecha_caducidad !== '') {
      fecha_caducidad = movimientoSeleccionado.fecha_caducidad;
  }
  let body = { ...movimientoSeleccionado };
  if (fecha_caducidad !== null) {
      body.fecha_caducidad = fecha_caducidad;
  }
  fetch(`http://${portConexion}/facturamovimiento/actualizar/${id}`, {
      method: "PUT",
      headers: {
          'Content-type': 'application/json',
          token: localStorage.getItem("token"),
      },
      body: JSON.stringify(body),
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
      removeModalBackdrop();
      const modalBackdrop = document.querySelector('.modal-backdrop');
      if (modalBackdrop) {
          modalBackdrop.remove();
      }
      setMovimientoSeleccionado({});
  })
  .catch((error) => {
      error.json().then((body) => {
          if (body.status === 404) {
              Sweet.error(body.message);
          } else if (body.status === 409) {
              Sweet.error(body.message);
          }   else if (body.errors) {
              body.errors.forEach((err) => {
                  Sweet.error(err.msg);
              });
          } else {
              Sweet.error('Error en el servidor');
          }
      });
  });
}

 // Función para registrar un movimiento
function registrarMovimiento() {
  let fk_id_usuario = userId;
  let cantidad_peso_movimiento = document.getElementById('cantidad_peso_movimiento').value;
  let precio_movimiento = document.getElementById('precio_movimiento').value;
  let estado_producto_movimiento = document.getElementById('estado_producto_movimiento').value;
  let nota_factura = document.getElementById('nota_factura').value;
  let fecha_caducidad = null;
  let fk_id_proveedor = document.getElementById('fk_id_proveedor').value;
  let fk_id_tipo_producto = selectedTipo ? selectedTipo.value : null;
  let fk_id_up = selectedUp ? selectedUp.value : null;
  if (aplicaFechaCaducidad) {
    fecha_caducidad = document.getElementById('fecha_caducidad').value;
  }
  Validate.validarCampos('.form-empty');
  const validacionExitosa = Validate.validarSelect('.form-empt');

  if (!validacionExitosa) {
    Sweet.registroFallido();
    return;
  }
  fetch(`http://${portConexion}/facturamovimiento/registrarEntrada`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      token: localStorage.getItem("token")
    },
    body: JSON.stringify({ fk_id_usuario,cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento, nota_factura, fecha_caducidad, fk_id_proveedor,fk_id_up,fk_id_tipo_producto}),
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
    if (data.status === 409) {
      Sweet.error(data.message); 
      return;
    }
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
  });
}

// Función para listar los movimientos
function listarMovimiento() {
  fetch(`http://${portConexion}/facturamovimiento/listarEntrada`, {
    method: "GET",
    headers: {
      "content-type": "application/json",
      token: localStorage.getItem("token"),
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
        <h1 className="text-center modal-title fs-5 m-4">Movimientos de Entrada</h1>
        <div className="d-flex justify-content-between mb-4">
          <div>
          <button type="button" className="btn-color btn  m-1 " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setShowModal(true); Validate.limpiar('.limpiar'); resetFormState();setSelectedTipo(null);setSelectedUp(null);setSelectedCategoria(null);}}>
            Registrar nuevo movimiento de Entrada
          </button>
          <Link to="/movimiento"><button type="button"  className="btn btn-primary m-1 ">Volver a Movimientos Totales</button></Link>
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
                <th className="th-sm">Unidad peso</th>
                <th className="th-sm">Precio individual</th>
                <th className="th-sm">Precio total</th>
                <th className="th-sm">Estado producto</th>
                <th className="th-sm">Descripción</th>
                <th className="th-sm">Fecha de caducidad</th>
                <th className="th-sm">Usuario que hizo movimiento</th>
                <th className="th-sm">Proveedor</th>
                <th className="th-sm">Editar</th>
              </tr>
            </thead>
            <tbody id="tableMovimiento">
              {movimientos.length === 0 ? (
                <tr>
                  <td colSpan={17}>
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
                    <tr style={{ textTransform: 'capitalize' }} key={element.id_factura}>
                      <td className="p-2 text-center" >{index+1}</td>
                      <td className="p-2 text-center" >{element.nombre_tipo}</td>
                      <td className="p-2 text-center">{element.nombre_categoria}</td>
                      <td className="p-2 text-center">{element.codigo_categoria}</td>
                      <td className="p-2 text-center">{element.tipo_categoria}</td>
                      <td className="p-2 text-center">{Validate.formatFecha(element.fecha_movimiento)}</td>
                      <td className="p-2 text-center">{element.tipo_movimiento}</td>
                      <td className="p-2 text-center" >
                        {Number.isInteger(element.cantidad_peso_movimiento) ? element.cantidad_peso_movimiento : element.cantidad_peso_movimiento.toFixed(2)}
                      </td>
                      <td className="p-2 text-center">{element.unidad_peso}</td>
                      <td className="p-2 text-center" >
                        {isNaN(Number(element.precio_movimiento)) ? element.precio_movimiento : (Number.isInteger(Number(element.precio_movimiento)) ? Number(element.precio_movimiento) : Number(element.precio_movimiento).toFixed(2))}
                      </td>
                      <td className="p-2 text-center">{element.precio_total_mov}</td>
                      <td className="p-2 text-center">
                        {element.estado_producto_movimiento === 'optimo' ? 'Óptimo' : element.estado_producto_movimiento.charAt(0).toUpperCase() + element.estado_producto_movimiento.slice(1).toLowerCase()}
                      </td>
                      <td className="p-2 text-center">
                        {element.nota_factura.charAt(0).toUpperCase() + element.nota_factura.slice(1).toLowerCase()}
                      </td>
                      <td>
                        {element.fecha_caducidad ? (
                          Validate.formatFecha(element.fecha_caducidad)
                        ) : (
                          'No aplica'
                        )}
                      </td>
                      <td className="p-2 text-center">{element.nombre_usuario}</td>
                      <td className="p-2 text-center">{element.nombre_proveedores}</td>
                    <td className="p-0 text-center"  > 
                      { (userRoll === "administrador") ? (
                        
                        <button className="btn btn-color"onClick={() => { setUpdateModal(true); editarMovimiento(element.id_factura); resetFormState();}} data-bs-toggle="modal" data-bs-target="#movimientoEditarModal">
                        <IconEdit />
                        </button>
                      ) :(

                        <span>No disponible</span>
                      )}
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
                  <h1 className="modal-title fs-5" id="exampleModalLabel">Registro de movimiento de entrada</h1>
                  <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" onClick={handleCloseModal} aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row mb-4">
                      <div className="col">
                        <label className="form-label" htmlFor="categoria">Categoria</label>
                          <Select
                            className="react-select-container  form-empt my-custom-class"
                            classNamePrefix="react-select"
                            options={categoria_list.map(element => ({ value: element.id_categoria, label: element.nombre_categoria}))}
                            placeholder="Selecciona..."
                            onChange={handleCategoria}
                            value={selectedCategoria}
                            id="categoria"
                          />
                        <div className="invalid-feedback is-invalid">
                        Por favor, seleccione una categoria.
                        </div>
                      </div>
                      <div className="col">
                        <label htmlFor="fk_id_tipo_producto" className="label-bold mb-2">Producto</label>
                        <Select
                          className="react-select-container form-empt limpiar my-custom-class"
                          classNamePrefix="react-select"
                          options={selectedCategoria && productosCategoria.length > 0 ? productosCategoria.map(element => ({ key: element.id_tipo, value: element.id_tipo, label: element.nombre_tipo })) : [{ value: '', label: 'No hay productos disponibles' }]}
                          placeholder="Selecciona..."
                          onChange={handleTipo}
                          value={selectedTipo}
                          id="fk_id_tipo_producto"
                          name="fk_id_tipo_producto"
                        />
                        <div className="invalid-feedback is-invalid">
                          Por favor, seleccione un producto.
                        </div>
                      </div>
                      <div className="col">
                        <label htmlFor="fk_id_up" className="label-bold mb-2">Bodega</label>
                        <Select
                            className="react-select-container form-empt my-custom-class"
                            classNamePrefix="react-select"
                            options={up.map(element => ({ value: element.id_up, label: element.nombre_up}))}
                            placeholder="Selecciona..."
                            onChange={handleUp}
                            value={selectedUp}
                            id="fk_id_up"
                            name="fk_id_up"
                          />
                        <div className="invalid-feedback is-invalid">
                          Por favor, seleccione una bodega.
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
                          <input 
                              type="text" 
                              id="unidad_peso_movimiento" 
                              className="form-control form-empty limpiar" 
                              disabled={true} 
                              name="unidad_peso_movimiento" 
                              value={unidadSeleccionada || 'No hay unidad de medida'}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="precio_movimiento">Precio por unidad:</label>
                          <input type="number" id="precio_movimiento" name="precio_movimiento" className="form-control form-empty limpiar" />
                          <div className="invalid-feedback is-invalid">
                            Por favor, ingrese un precio válido.
                          </div>
                        </div>
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="estado_producto_movimiento">Estado</label>
                          <select defaultValue="" className="form-select form-empty limpiar" id="estado_producto_movimiento" name="estado_producto_movimiento" aria-label="Default select example">
                            <option value="">Seleccione una opción</option>
                            <option value="optimo">Óptimo</option>
                            <option value="deficiente">Deficiente</option>
                          </select>
                          <div className="invalid-feedback is-invalid">
                            Por favor, seleccione un estado.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row mb-4">
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="nota_factura">Descripción</label>
                          <textarea id="nota_factura" name="nota_factura" className="form-control form-empty limpiar"></textarea>

                          <div className="invalid-feedback is-invalid">
                            Por favor, ingrese una descripción válida.
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
                              checked={aplicaFechaCaducidad}
                              onChange={handleCheckboxChange}
                              id="flexCheckDefault"
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
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>Cerrar</button>
                  <button type="button" className="btn-color btn" onClick={() =>{registrarMovimiento()}}>Registrar</button>
                </div>
              </div>
            </div>
          </div>
            <div className="modal fade" id="movimientoEditarModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header bg text-white">
                    <h1 className="modal-title fs-5" id="actualizarModalLabel">Editar de movimiento de entrada</h1>
                    <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseModal2}></button>
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="row mb-4">
                        <div className="col">
                          <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="estado_producto_movimiento">Estado</label>
                            <select className="form-control limpiar form-update" value={movimientoSeleccionado.estado_producto_movimiento || ''} name="estado_producto_movimiento" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, estado_producto_movimiento: e.target.value })}>
                              <option value="">Seleccione una opción</option>
                              <option value="optimo">Óptimo</option>
                              <option value="deficiente">Deficiente</option>
                            </select>
                          </div>
                        </div>
                        <div className="col">
                          <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="precio_movimiento">Precio</label>
                            <input type="text" className="form-control form-update limpiar" placeholder="Precio del Producto" value={movimientoSeleccionado.precio_movimiento || ''} name="precio_movimiento" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, precio_movimiento: e.target.value })} />
                            <div className="invalid-feedback is-invalid">
                              Por favor, ingrese un precio individual.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                      <div className="col">
                          <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="cantidad_peso_movimiento">Cantidad</label>
                            <input type="text" className="form-control form-update limpiar" placeholder="Cantidad" value={movimientoSeleccionado.cantidad_peso_movimiento || ''} name="cantidad_peso_movimiento" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, cantidad_peso_movimiento: e.target.value })} />
                            <div className="invalid-feedback is-invalid">
                              Por favor, ingrese una cantidad.
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="row mb-4">
                      <div className="col">
                          <div data-mdb-input-init className="form-outline">
                            <label className="form-label" htmlFor="nota_factura">Descripción</label>
                            <textarea className="form-control form-update limpiar" placeholder="Nota" value={movimientoSeleccionado.nota_factura || ''} name="nota_factura" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, nota_factura: e.target.value })} />
                            <div className="invalid-feedback is-invalid">
                              Por favor, ingrese una nota mas larga.
                            </div>
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
                            <label className="form-label" htmlFor="fecha_caducidad2">
                              Fecha caducidad
                            </label>
                            <input
                              type="date"
                              id="fecha_caducidad2"
                              className="width: 20% form-control form-update"
                              defaultValue={Validate.formatFecha(fechaCaducidad)}
                              name="fecha_caducidad2" 
                              onChange={(e) => {
                                setMovimientoSeleccionado({ ...movimientoSeleccionado, fecha_caducidad: e.target.value });
                                setFechaCaducidadModificada(true);
                              }}
                            />

                          </div>
                        )}
                      </div>
                    </form>
                  </div>
                  
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal"  onClick={() => { resetFormState()}}>Cerrar</button>
                    <button
                      type="button"
                      className="btn btn-color"
                      onClick={() => {
                        actualizarMovimiento(movimientoSeleccionado.id_factura)
                      }}
                    >
                      Actualizar
                    </button>

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