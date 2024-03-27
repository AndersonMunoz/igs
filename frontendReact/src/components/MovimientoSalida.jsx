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
import Select from 'react-select'

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
  const [selectedTipo, setSelectedTipo] = useState(null);
  const [selectedCategoria, setSelectedCategoria] = useState(null);
  const [selectedLote, setSelectedLote] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedOptionTit, setSelectedOptionTit] = useState(null);
  const [selectedOptionIns, setSelectedOptionIns] = useState(null);
  const [destinoMovimiento, setDestinoMovimiento] = useState('');
  const [tituladoList,setTitulado] = useState(null);
  const [selectedTitulado, setSelectedTitulado] = useState(null);
  const [instructorList,setInstrucor] = useState(null);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showInstructorTituladoSelects, setShowInstructorTituladoSelects] = useState(false);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState('');


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
      'Unidad',
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

  const handleCategoria = (selectedOption) => {
    setSelectedCategoria(selectedOption); 
    setSelectedTipo(null); 
    setUnidadSeleccionada('No hay unidad de medida');
  };

  const handleTipo = (selectedOption) => {
    setSelectedOption(selectedOption);
    setSelectedTipo(selectedOption.value.id_tipo);
    // Ahora puedes usar selectedOption.value.fk_id_producto también
};

  const handleTitulado = (selectedOptionTit) => {
    setSelectedOptionTit(selectedOptionTit);
    setSelectedTitulado(selectedOptionTit.value); 
    //console.log(" titulado id: "+selectedOptionTit.value);// Actualiza el estado del titulado seleccionado
};

const handleInstructor = (selectedOptionIns) => {
    setSelectedOptionIns(selectedOptionIns);
    setSelectedInstructor(selectedOptionIns.value); 
    //console.log("oinstructor id:"+selectedOptionIns.value);// Actualiza el estado del instructor seleccionado
};
  
const handleDestino = (event) => {
  setDestinoMovimiento(event.target.value);
  console.log(event.target.value)
  setShowInstructorTituladoSelects(event.target.value === "taller" || event.target.value === "evento");
};



  
  
  const tableRef = useRef();
  const fkIdUsuarioRef = useRef(null);

  const [aplicaFechaCaducidad2, setAplicaFechaCaducidad2] = useState(false);

  const handleCheckboxChange2 = () => {
    setAplicaFechaCaducidad2(!aplicaFechaCaducidad2);
  };
  // const resetFormState = () => {
  //   const formFields = modalProductoRef.current.querySelectorAll('.form-control,.form-update,.my-custom-class,.form-empty, select, input[type="number"], input[type="checkbox"]');
  //   const formFields2 = modalUpdateRef.current.querySelectorAll('.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]');
  // };
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
    window.onpopstate = function(event) {
      window.location.reload();
    };
    listarMovimiento();
    listarCategoria();
    listarTipo();
    listarProveedor();
    listarUsuario();
    listarTitulado();
    listarInstructor();
    if (selectedCategoria) {
      listarProductoCategoria(selectedCategoria.value);
    }
    if (selectedTipo) {
      listarUnidadesPro(selectedTipo.value);
    }
}, [selectedCategoria, selectedTipo]);

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

  function listarTitulado() {
    fetch(`http://${portConexion}:3000/titulado/listaractivo`, {
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
          setTitulado(data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function listarInstructor() {
    fetch(`http://${portConexion}:3000/instructor/listarActivo`, {
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
          setInstrucor(data);
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
      `http://${portConexion}:3000/facturamovimiento/buscarProPro/${id_categoria == '' ? 0 : id_categoria}`,
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
        `http://${portConexion}:3000/facturamovimiento/buscarUnidad/${id_producto}`,
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
        //console.log("Unidades del producto:", data);
        if (data && data.length > 0) {
            // Actualizar el estado con la unidad de peso
            setUnidadSeleccionada(data[0].unidad_peso);
            //console.log(data[0].unidad_peso)
        } else {
            setUnidadSeleccionada('No hay unidad de medida');
        }
    })
    .catch((e) => {
        setUnidadSeleccionada('No hay unidad de medida');
        //console.log("Error al obtener unidades:", e);
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

  function editarDetalleDestino(id) {
    fetch(`http://${portConexion}:3000/facturamovimiento/buscarDetalleMovimiento/${id}`, {
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

  function registrarMovimientoSalida() {
    let fk_id_usuario = userId;
    let cantidad_peso_movimiento = document.getElementById('cantidad_peso_movimiento').value;
    let nota_factura = document.getElementById('nota_factura').value;
    let destino_movimiento = document.getElementById('destino_movimiento').value;
    let num_lote = selectedLote ? selectedLote : null;
    let fk_id_producto = selectedTipo ? selectedTipo : null;
    let fk_id_titulado = null;
    let fk_id_instructor = null;

    // Si el destino es "Taller" o "Evento", obtener los valores de los campos "fk_id_titulado" y "fk_id_instructor"
    if (destino_movimiento === "taller" || destino_movimiento === "evento") {
        fk_id_titulado = selectedOptionTit.value; // Obtener el valor del campo seleccionado para fk_id_titulado
        fk_id_instructor = selectedOptionIns.value; // Obtener el valor del campo seleccionado para fk_id_instructor
    }

    // Validación de campos aquí...
    Validate.validarCampos('.form-empty');
    const validacionExitosa = Validate.validarSelect('.form-empt');

    if (!validacionExitosa) {
      Sweet.registroFallido();
      return;
    }

    fetch(`http://${portConexion}:3000/facturamovimiento/registrarSalida`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token")
        },
        body: JSON.stringify({ cantidad_peso_movimiento, nota_factura, num_lote, destino_movimiento, fk_id_producto, fk_id_usuario, fk_id_titulado, fk_id_instructor }),
    })
    .then((res) => res.json())
    .then(data => {
        if (data.status === 200) {
            Sweet.exito(data.message);
            setShowModal(false);
            removeModalBackdrop(true);
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy();
            }
            listarMovimiento();
        } else if (data.status === 403) {
            Sweet.error(data.error.errors[0].msg);
        } else if (data.status === 402) {
            Sweet.error(data.mensaje);
        } else if (data.status === 409) {
            Sweet.error(data.message);
        } else {
            listarMovimiento();
            setShowModal(false);
            removeModalBackdrop(true);
            const modalBackdrop = document.querySelector('.modal-backdrop');
            if (modalBackdrop) {
                modalBackdrop.remove();
            }
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
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
          <button type="button" className="btn-color btn  m-1 " data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setShowModal(true); Validate.limpiar('.limpiar'); resetFormState();setSelectedTipo(null);setSelectedCategoria(null);setSelectedOptionIns(null);setSelectedOptionTit(null);setSelectedOption(null)}}>
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
                <th className="th-sm">Unidad</th>
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
                  {movimientos.map((element,index) => (
                    <tr style={{ textTransform: 'capitalize' }} key={element.id_factura}>
                      <td className="p-2 text-center" >{index +1}</td>
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
                        <button className="btn btn-color"  style={{ textTransform: 'capitalize' }}onClick={() => { setUpdateModal(true);editarDetalleDestino(element.id_factura); editarMovimiento(element.id_factura); resetFormState();}} data-bs-toggle="modal" data-bs-target="#movimientoEditarModal">
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
                              <Select
                                className="react-select-container form-empty limpiar my-custom-clas form-empt"
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
                      </div>
                      <div className="col">
                        <div data-mdb-input-init className="form-outline">
                          <label className="form-label" htmlFor="fk_id_producto">Producto</label>
                          <Select
                              className="react-select-container form-empt limpiar my-custom-class"
                              classNamePrefix="react-select"
                              options={selectedCategoria && productosCategoria.length > 0 ? productosCategoria.map(element => ({ key: element.id_tipo, value: { id_tipo: element.id_tipo, id_producto: element.id_producto }, label: `${element.nombre_tipo} - ${element.cantidad_peso_producto} ${element.unidad_peso} disponible(s)` })) : [{ value: '', label: 'No hay productos disponibles' }]}
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
                      </div>
                    </div>
                    <div className="row mb-4"><div className="col">
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
                              <label className="form-label" htmlFor="destino_movimiento">Destino</label>
                              <select  className="form-select form-empty limpiar" key="destino_movimiento" id="destino_movimiento" name="destino_movimiento" aria-label="Default select example" onChange={handleDestino} value={destinoMovimiento}>
                                  <option value="">Seleccione una opción</option>
                                  <option value="taller">Taller</option>
                                  <option value="produccion">Producción</option>
                                  <option value="evento">Evento</option>
                              </select>
                              <div className="invalid-feedback is-invalid">
                                  Por favor, seleccione un destino.
                              </div>
                          </div>
                      </div>
                      {/* Si el destino es "Taller" o "Evento", mostrar los selectores de instructores y titulados */}
                      {destinoMovimiento === "taller" || destinoMovimiento === "evento" ? (
                          <>
                              <div className="col">
                                  <div data-mdb-input-init className="form-outline">
                                      <label className="form-label" htmlFor="fk_id_titulado">Titulado</label>
                                      <Select
                                        className="react-select-container  form-empt my-custom-class"
                                        classNamePrefix="react-select"
                                        options={tituladoList.map(element => ({key: element.id_titulado, value: element.id_titulado, label: `${element.nombre_titulado} - ${element.id_ficha}`}))}
                                        placeholder="Selecciona..."
                                        onChange={handleTitulado}
                                        value={selectedOptionTit}
                                        id="fk_id_titulado"
                                      />
                                      <div className="invalid-feedback is-invalid">
                                          Por favor, seleccione un titulado.
                                      </div>
                                  </div>
                              </div>
                                <div className="col">
                                    <div data-mdb-input-init className="form-outline">
                                        <label className="form-label" htmlFor="fk_id_instructor">Instructor</label>
                                        <Select
                                          className="react-select-container  form-empt my-custom-class"
                                          classNamePrefix="react-select"
                                          options={instructorList.map(element => ({key: element.id, value: element.id, label: element.nombre}))}
                                          placeholder="Selecciona..."
                                          onChange={handleInstructor}
                                          value={selectedOptionIns}
                                          id="fk_id_instructor"
                                        />
                                        <div className="invalid-feedback is-invalid">
                                            Por favor, seleccione un instructor.
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : null}
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
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" className="btn-color btn" onClick={registrarMovimientoSalida}>Registrar</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="movimientoEditarModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef}>

              <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header bg text-white">
                        <h1 className="modal-title fs-5" id="actualizarModalLabel">Editar de movimiento de salida</h1>
                        <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="row mb-4">
                                <div className="col">
                                    <div data-mdb-input-init className="form-outline">
                                        <label className="form-label" htmlFor="nota_factura">Descripción</label>
                                        <input type="text" className="form-control form-update limpiar" placeholder="Precio del Producto" value={movimientoSeleccionado.nota_factura || ''} name="nota_factura" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, nota_factura: e.target.value })} />
                                        <div className="invalid-feedback is-invalid">
                                            Por favor, ingrese una nota más larga.
                                        </div>
                                    </div>
                                </div>
                                <div className="col">
                                    <div data-mdb-input-init className="form-outline">
                                        <label className="form-label" htmlFor="cantidad_peso_movimiento">Cantidad</label>
                                        <input type="text" className="form-control form-update limpiar" placeholder="Precio del Producto" value={movimientoSeleccionado.cantidad_peso_movimiento || ''} name="cantidad_peso_movimiento" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, cantidad_peso_movimiento: e.target.value })} />
                                        <div className="invalid-feedback is-invalid">
                                            Por favor, ingrese una cantidad.
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mb-4">
                                <div className="col">
                                    <div className="form-outline">
                                        <label className="form-label" htmlFor="destino_movimiento">Destino</label>
                                        <select className="form-select" value={movimientoSeleccionado.destino_movimiento || ''} name="destino_movimiento" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, destino_movimiento: e.target.value })}>
                                            <option value="">Seleccio una opción </option>
                                            <option value="taller">Taller</option>
                                            <option value="evento">Evento</option>
                                            <option value="produccion">Producción</option>
                                        </select>
                                    </div>
                                </div>
                                {showInstructorTituladoSelects &&
                                    <>
                                        <div className="col">
                                            <div className="form-outline">
                                            <label className="form-label" htmlFor="fk_id_instructor">Instructor</label>
                                              <select value={movimientoSeleccionado.estado_producto_movimiento || ''}  className="form-select form-empty limpiar" id="fk_id_instructor" name="fk_id_instructor" aria-label="Default select example" onChange={(e) => setMovimientoSeleccionado({ ...selectedInstructor, nombre_instructor: e.target.value })}>
                                                <option value="">Seleccione una opción</option>
                                                {instructorList.map((element) => (
                                                  <option key={element.id_instructores} value={element.id_instructores}>{element.nombre_instructor}</option>
                                                ))}
                                              </select>
                                              <div className="invalid-feedback is-invalid">
                                                Por favor, seleccione un instructor.
                                              </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className="form-outline">
                                                <label className="form-label" htmlFor="fk_id_titulado">Titulado</label>
                                                <select className="form-select" value={movimientoSeleccionado.fk_id_titulado} name="fk_id_titulado" onChange={(e) => setMovimientoSeleccionado({ ...movimientoSeleccionado, fk_id_titulado: e.target.value })}>
                                                    <option value="">Seleccionar titulado</option>
                                                    {tituladoList && tituladoList.map(titulado => (
                                                        <option key={titulado.id} value={titulado.id}>{titulado.nombre}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </>
                                }
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                        <button type="button" className="btn btn-color" onClick={actualizarMovimiento}>Actualizar</button>
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