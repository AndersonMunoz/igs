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
  
    const [title, setTitle] = useState('Kardex');
    const [movimientos, setMovimientos] = useState([]);
     const tableRef = useRef(null);
    const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelTotal');
    xlsx.writeFile(wb, 'Kardex.xlsx');
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
      { title: 'Precio individual', dataKey: 'precio_movimiento' },
      { title: 'Precio total', dataKey: 'precio_total_mov' },
      { title: 'Fecha de caducidad', dataKey: 'fecha_caducidad' }
    ];
  
    // Obtener los datos de la tabla
    const tableData = movimientos.map((element) => ({
      nombre_tipo: element.nombre_tipo,
      num_lote: element.num_lote,
      fecha_movimiento: Validate.formatFecha(element.fecha_movimiento),
      tipo_movimiento: element.tipo_movimiento,
      cantidad_peso_movimiento: element.cantidad_peso_movimiento,
      unidad_peso: element.unidad_peso,
      precio_movimiento: element.precio_movimiento,
      precio_total_mov: element.precio_total_mov,
      fecha_caducidad: Validate.formatFecha(element.fecha_caducidad),
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
    doc.save('Kardex.pdf');
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
      'Unidad peso',
      'Precio individual',
      'Precio total',
      'Fecha de caducidad'
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
        element.precio_movimiento,
        element.precio_total_mov,
        Validate.formatFecha(element.fecha_caducidad)
      ];
      wsData.push(rowData);
    });

    return wsData;
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

  }, []);

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
        
        <div className="boxBtnContendidoTitulo">
            <div  className="btnContenido1">
            </div>
            <div  className="btnContenido2">
            <h2 className="tituloHeaderpp">{title}</h2>
            </div>
            <div className="btnContenido3">
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
                <th className="th-sm">Precio individual</th>
                <th className="th-sm">Fecha de caducidad</th>
                <th className="th-sm">Precio total</th>
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
                    <tr style={{ textTransform: 'capitalize' }}  key={element.id_factura}>
                      <td className="p-2 text-center" >{element.id_factura}</td>
                      <td className="p-2 text-center" >{element.nombre_tipo}</td>
                      <td className="p-2 text-center" >{element.num_lote}</td>
                      <td className="p-2 text-center" >{Validate.formatFecha(element.fecha_movimiento)}</td>
                      <td className="p-2 text-center" >{element.tipo_movimiento}</td>
                      <td className="p-2 text-center" >
                        {Number.isInteger(element.cantidad_peso_movimiento) ? element.cantidad_peso_movimiento : element.cantidad_peso_movimiento.toFixed(2)}
                      </td>
                      <td className="p-2 text-center" >{element.unidad_peso}</td>
                      <td className="p-2 text-center" >
                        {isNaN(Number(element.precio_movimiento)) ? element.precio_movimiento : (Number.isInteger(Number(element.precio_movimiento)) ? Number(element.precio_movimiento) : Number(element.precio_movimiento).toFixed(2))}
                      </td>
                      <td className="p-2 text-center" >{Validate.formatFecha(element.fecha_caducidad)}</td>
                      <td className="p-2 text-center">{element.precio_total_mov}</td>
                    </tr>
                  ))}</>)}
            </tbody>
          </table>
        </div>
      </div>

    </>
  );
};

export default Movimiento;