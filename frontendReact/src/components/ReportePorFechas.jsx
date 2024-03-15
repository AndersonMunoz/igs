import React, { useEffect, useRef, useState } from "react";
import "../style/Style.css";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import esES from "../languages/es-ES.json";
import ExelLogo from "../../img/excel.224x256.png";
import PdfLogo from "../../img/pdf.224x256.png";
import $ from "jquery";
import "bootstrap";
import "datatables.net";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import * as xlsx from "xlsx";
import jsPDF from "jspdf";
import portConexion from "../const/portConexion";
import { dataDecript } from "./encryp/decryp";
import Movimiento from "./Movimiento";

const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const reporte = () => {
  const [title, setTitle] = useState("Reportes por fechas");
  const [rangoMovInicio, setRangoMovInicio] = useState();
  const [rangoMovFin, setRangoMovFin] = useState();
  const [expMov, setExpMov] = useState("aqui para exportar");
  const [reporte, setReporte] = useState([]);
  const [valEntradas, setValEntradas] = useState('')
  const [valSalidas, setValSalidas] = useState('')
  const tableRef = useRef(null);

  // falta ver

  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, "ExcelTotal");
    xlsx.writeFile(wb, "reportes-fechas.xlsx");
  };
  const exportPdfHandler = () => {
    const doc = new jsPDF();

    const columns = [
        { title: "Productos",   dataKey: "nombre_producto" },
        { title: "Categoría",   dataKey: "nombre_categoria" },
        { title: "Entradas",    dataKey: "total_entradas" },
        { title: "Salidas",     dataKey: "total_salidas" },
        { title: "valor",       dataKey: "precio_total" },
        { title: "Fecha último movimiento", dataKey: "ultima_fecha_movimiento" },
        { title: "Usuario",     dataKey: "nombre_usuario" },
    ];

    // Obtener los datos de la tabla
    const tableData = reporte.map((element) => ({
      nombre_producto:element.nombre_producto,
      nombre_categoria:element.nombre_categoria,
      total_entradas:element.total_entradas,
      total_salidas:element.total_salidas,
      precio_total:element.precio_total,
      ultima_fecha_movimiento:element.ultima_fecha_movimiento,
      nombre_usuario:element.nombre_usuario,
    }));

    // Agregar las columnas y los datos a la tabla del PDF
    doc.autoTable({
      columns,
      body: tableData,
      margin: { top: 20 },
      styles: { overflow: "linebreak" },
      headStyles: { fillColor: [0, 100, 0] },
    });

    // Guardar el PDF
    doc.save("Reportes-fechas.pdf");
  };
  const getTableData = () => {
    const wsData = [];

    // Obtener las columnas
    const columns = [
      "Productos",
      "Categoría",
      "Entradas", 
      "Salidas",  
      "valor",    
      "Fecha último movimiento",
      "Usuario",  
    ];
    wsData.push(columns);

    // Obtener los datos de las filas
    reporte.forEach((element) => {
      const rowData = [
        element.nombre_producto,
        element.nombre_categoria,
        element.total_entradas,
        element.total_salidas,
        element.precio_total,
        element.ultima_fecha_movimiento,
        element.nombre_usuario,
      ];
      wsData.push(rowData);
    });

    return wsData;
  };

  useEffect(() => {
    if (reporte.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable({
        columnDefs: [
          {
            targets: -1,
            responsivePriority: 1,
          },
        ],
        responsive: true,
        language: esES,
        lengthMenu: [
          [10, 50, 100, -1],
          ["10 Filas", "50 Filas", "100 Filas", "Ver Todo"],
        ],
        order: [[6, "asc"]],
      });
    }
  }, [reporte]);

  useEffect(()=>{
    setRangoMovFin(formatDateYYYYMMDD(new Date()));
    listarProducto()
  },[])

      // Función para listar los productos
      function listarProducto() {
        fetch(`http://${portConexion}:3000/producto/listarProductoTotal`, {
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
            setValEntradas(data.entraron)
            setValSalidas(data.salieron)
            setReporte(data.productos)
            setRangoMovInicio(formatDateYYYYMMDD(new Date(data.
              primera_fecha_movimiento_primer_producto)))
            console.log(data);
          }
        })
      }
  const ponerRango = () => {
    let rangoInicio = document.getElementById("inicio");
    let rangoFin = document.getElementById("");
  };

  return (
    <div>
      <div className="boxBtnContendidoTitulo">

        <div className="btnContenido11">
          <div  style={{ width: "200px", marginRight: "10px", gap:"20px" }}  className="d-flex">
            <input className="inputFechaReporte" type="date" name="inicio" id="inicio" defaultValue={rangoMovInicio}/>
            <h5 className="mt-1">Inicio</h5>
          </div>
          <div style={{ width: "180px", height:"35px", gap:"20px"}} className="d-flex">
            <input className="inputFechaReporte" type="date"  name="fin"  id="fin"  defaultValue={rangoMovFin}/>
            <h5 className="mt-1">Fin</h5>
          </div>
          <div>
            <button className="btn btn-color" onClick={() => {}}>buscar</button>
          </div>
        </div>
        
        <div className="btnContenido22">
          <h2 className="tituloHeaderpp">{title}</h2>
        </div>
        <div className="btnContenido3">
          <div  className="btn-group"  role="group"  aria-label="Basic mixed styles example">
            <div className="" title="Descargar Excel">
              <button  onClick={handleOnExport}  type="button"  className="btn btn-light">
                <img src={ExelLogo} className="logoExel" />
              </button>
            </div>
            <div className="" title="Descargar Pdf">
              <button  type="button"  className="btn btn-light"  onClick={exportPdfHandler}>
                <img src={PdfLogo} className="logoExel" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid w-full">
        <table  id="dtBasicExample"  className="table table-striped table-bordered border display responsive nowrap b-4"  ref={tableRef}  cellSpacing={0}  width="100%">
          <thead className="text-center">
            <tr>
              <th className="th-sm">Productos</th>
              <th className="th-sm">Categoría</th>
              <th className="th-sm">Entradas ({valEntradas})</th>
              <th className="th-sm">Salidas ({valSalidas})</th>
              <th className="th-sm">valor</th>
              <th className="th-sm">Fecha último movimiento</th>
              <th className="th-sm">Usuario</th>
            </tr>
          </thead>
          <tbody id="tableReportes" className="text-center">
            {reporte.length > 0 ? (
              <>
                {reporte.map((element, index)=>(
                  <tr key={index}>
                    <td>{element.nombre_producto}</td>
                    <td>{element.nombre_categoria}</td>
                    <td>{element.total_entradas}</td>
                    <td>{element.total_salidas}</td>
                    <td>{element.precio_total}</td>
                    <td>{formatDateYYYYMMDD(new Date(element.ultima_fecha_movimiento))}</td>
                    <td>{element.nombre_usuario}</td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2>En este momento no contamos con ningún reporte.😟</h2>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default reporte;
