import "../style/dashboardContent.css";
import React, { useEffect, useRef, useState } from "react";
import "../style/producto.css";
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
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const ProductoCaducar = () => {


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
        ordering: false
     });
		}
	}, [productos]);

  useEffect(() => {
      listarProducto();
      listarUp();
      listarTipo();
  }, []); 

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
	return (
    <div>
      <div className="d-flex justify-content-between m-4">
        <h1>Lista de los productos cerca a caducar</h1>
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
            ) : (                  
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
                    </tr>
                  ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
	);
};

export default ProductoCaducar;
