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
import portConexion from "../const/portConexion";

const ProductoCaducar = () => {
  const [productos, setProductos] = useState([]);
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
      { title: 'Cantidad', dataKey: 'cantidad_peso_movimiento' },
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
      Cantidad: element.cantidad_peso_movimiento,
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
        element.cantidad_peso_movimiento,
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
  }, []); 
	// Funciones para obtener datos de los productos
  function listarProducto() {
    fetch(`http://${portConexion}:3000/facturamovimiento/listarCaducados`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem('token')
      },
    })
    .then((res) => res.json())
    .then((data) => {
      const productosConFechaCaducidad = data.filter(item => item.FechaCaducidad !== null && item.cantidad_peso_movimiento > 0);
      setProductos(productosConFechaCaducidad);
    })
    .catch((e) => {
      console.error('Error:', e);
    });
  }
  

	return (
    <div>
      <h1 className="text-center modal-title fs-5 m-4">Lista de Productos a Caducar</h1>
      <div className="d-flex justify-content-between m-4">
        <span></span>
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
            <th className="th-sm">Número Lote</th>
            <th className="th-sm">Nombre Producto</th>
            <th className="th-sm">Nombre Categoria</th>
            <th className="th-sm">Cantidad</th>
            <th className="th-sm">Unidad</th>
            <th className="th-sm">Bodega</th>
            <th className="th-sm">Precio Total</th>
            <th className="th-sm text-center">Fecha de Caducidad</th>
          </tr>
        </thead>
          <tbody id="tableProducto" className="text-center">
            {productos.length === 0 ? (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2> En este momento no contamos con <br></br> productos disponibles.😟</h2>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (                  
              <>
                {productos.map((element,index) => {
                  const fechaActual = new Date();
                  const fechaCaducidad = new Date(element.FechaCaducidad);

                  const diferenciaFechas = fechaCaducidad - fechaActual;

                  const diasFaltantes = Math.ceil(diferenciaFechas / (1000 * 60 * 60 * 24));

                  let mensaje = '';
                  if (diasFaltantes > 2) {
                    mensaje = <span style={{ color: 'green' }}>{`Faltan ${diasFaltantes} días para la fecha de caducidad`}</span>;
                  } else if (diasFaltantes === 2) {
                    mensaje = <span style={{ color: 'orange' }}>Faltan 2 días para la fecha de caducidad</span>;
                  } else if (diasFaltantes === 1) {
                    mensaje = <span style={{ color: 'orange' }}>Falta 1 día para la fecha de caducidad</span>;
                  } else if (diasFaltantes === 0) {
                    mensaje = <span style={{ color: 'red' }}>El producto caduca hoy</span>;
                  } else {
                    mensaje = <span style={{ color: 'red', fontWeight: 'bold' }}>El producto ya caducó</span>;
                  }

                  return (
                    <tr key={index + 1} style={{ textTransform: 'capitalize' }}>
                      <td className="pt-3">{element.num_lote}</td>
                      <td className="pt-3">{element.NombreProducto}</td>
                      <td className="pt-3">{element.NombreCategoria}</td>
                      <td className="pt-3">{element.cantidad_peso_movimiento}</td>
                      <td className="pt-3">{element.Unidad}</td>
                      <td className="pt-3">{element.UnidadProductiva}</td>
                      <td className="pt-3">{element.PrecioTotal.toFixed(2)}</td>
                        <td>
                        {element.FechaCaducidad ? (
                          <>
                            {Validate.formatFecha(element.FechaCaducidad)}<br/>{mensaje}
                          </>
                        ) : (
                          'No asignada'
                        )}
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
    </div>
	);
};

export default ProductoCaducar;
