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
import { DownloadTableExcel } from 'react-export-table-to-excel';
import generatePDF from 'react-to-pdf';
import Select from 'react-select'
import * as xlsx from 'xlsx';
import portConexion from "../const/portConexion";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { dataDecript } from "./encryp/decryp";

// Componente Producto
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
  const [userRoll, setUserRoll] = useState("");
  const [errors, setErrros] = useState([]);
  const tableRef = useRef();

  // Función para exportar datos a Excel
  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelProducto');
    xlsx.writeFile(wb, 'Productos.xlsx');
  };
  // Función para exportar datos a PDF
  const doc = new jsPDF();
  const exportPdfHandler = () => {
    const doc = new jsPDF();
    // Configuración de las columnas para el PDF
    const columns = [
      { title: 'N°', dataKey: 'id_producto' },
      { title: 'NombreProducto', dataKey: 'NombreProducto' },
      { title: 'NombreCategoria', dataKey: 'NombreCategoria' },
      { title: 'Cantidad', dataKey: 'Cantidad' },
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
      Cantidad: element.Cantidad,
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
      'Cantidad',
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
        element.Cantidad,
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

  // Efecto para inicializar la tabla de productos
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
          [10, 50, 100, -1],
          ['10 Filas', '50 Filas', '100 Filas', 'Ver Todo']
        ],
        order: [[10, 'asc']],
      });
    }
  }, [productos]);
  useEffect(() => {
    window.onpopstate = function (event) {
      window.location.reload();
    }
  }, []);
  // Efecto para cargar productos, tipos y UP al montar el componente
  useEffect(() => {
    setUserRoll(dataDecript(localStorage.getItem("roll")));
    listarProducto();
    listarUp();
  }, []);
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
        console.log(e);
      });
  }

  // Función para remover el fondo del modal
  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector('.modal-backdrop');
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
  // Función para listar los productos
  function listarProducto() {
    fetch(`http://${portConexion}/producto/listar`, {
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
          setProductos(data);
        }
      })
  }
  // Función para editar un producto
  function editarProducto(id) {
    fetch(`http://${portConexion}/producto/buscar/${id}`, {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProductoSeleccionado(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }
  // Función para actualizar un producto
  function actualizarProducto(id) {
    const validacionExitosa = Validate.validarCampos('.form-update');

    fetch(`http://${portConexion}/producto/actualizar/${id}`, {
      method: 'PUT',
      headers: {
        'Content-type': 'application/json',
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify(productoSeleccionado),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.actualizacionFallido();
          return;
        }
        if (data.status == 200) {
          Sweet.exito(data.message);
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

  return (
    <div>
      <div className="boxBtnContendidoTitulo">
        <div className="btnContenido22">
          <h2 className="tituloHeaderpp">Lista de Productos</h2>
        </div>
        <div className="btnContenido3">
          <div
            className="flex btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            <div className="" title="Descargar Excel">
              <button
                onClick={handleOnExport}
                type="button"
                className="btn btn-light"
              >
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
      </div>
      <div className="wrapper-editor">
        <table id="dtBasicExample" className="table table-striped table-bordered border display responsive nowrap" cellSpacing={0} width="100%" ref={tableRef}>
          <thead className="text-center text-justify">
            <tr>
              <th className="th-sm">#Lote</th>
              <th className="th-sm">Nombre producto</th>
              <th className="th-sm">Nombre categoria</th>
              <th className="th-sm">Cantidad</th>
              <th className="th-sm">Unidad</th>
              <th className="th-sm">Precio individual</th>
              <th className="th-sm">Unidad productiva</th>
              <th className="th-sm">Descripcion</th>
              <th className="th-sm">PrecioTotal</th>
              <th className="th-sm text-center">Fecha de Caducidad</th>
              <th className="th-sm text-center">Acciones</th>
            </tr>
          </thead>
          <tbody id="tableProducto" className="text-center">
            {productos != null && productos.length > 0 ? (
              <>
                {productos.map((element, index) => (
                  <tr key={element.id_producto} style={{ textTransform: 'capitalize' }}>
                    <td>{index + 1}</td>
                    <td>{element.NombreProducto}</td>
                    <td>{element.NombreCategoria}</td>
                    <td>{element.Cantidad}</td>
                    <td>{element.Unidad}</td>
                    <td>
                      {element.PrecioIndividual ? (
                        element.PrecioIndividual
                      ) : (
                        'No asignada'
                      )}
                    </td>
                    <td>{element.UnidadProductiva}</td>
                    <td>{element.Descripcion}</td>
                    <td>
                      {element.PrecioTotal ? (
                        element.PrecioTotal
                      ) : (
                        'No asignada'
                      )}
                    </td>
                    <td>
                      {element.FechaCaducidad ? (
                        Validate.formatFecha(element.FechaCaducidad)
                      ) : (
                        'No asignada'
                      )}
                    </td>
                    {userRoll == "administrador" ? (
                      <td className="p-0">
                        {element.estado === 1 && (
                          <>
                            <button className="btn btn-color mx-2" onClick={() => { setUpdateModal(true); editarProducto(element.id_producto); }} data-bs-toggle="modal" data-bs-target="#staticBackdrop2">
                              <IconEdit />
                            </button>
                          </>
                        )}
                      </td>
                    ) : (
                      <td>No disponible</td>
                    )}
                  </tr>
                ))}
              </>

            ) : (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2> En este momento no contamos con ningún producto disponible.😟</h2>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="modal fade" data-bs-keyboard="false" id="staticBackdrop2" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" data-bs-backdrop="static" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
        <div className="modal-dialog modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg text-white">
              <h1 className="modal-title fs-5" id="actualizarModalLabel">Actualizar Producto</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>

                <div className="row mb-3">
                  <div className="col-md-12">
                    <label htmlFor="fk_id_up" className="label-bold mb-2 text-xl">Bodega</label>
                    <select className="form-select limpiar form-update form-control" value={productoSeleccionado.fk_id_up || ''} onChange={(e) => setProductoSeleccionado({ ...productoSeleccionado, fk_id_up: e.target.value })} id="fk_id_up" name="fk_id_up">
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
              </form>

            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn btn-color" onClick={() => { actualizarProducto(productoSeleccionado.id_producto); }}>
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