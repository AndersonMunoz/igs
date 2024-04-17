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

//formatear una fecha a formato año, mes, dia

const formatDateYYYYMMDD = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const reporte = () => {
  const [rangoMovInicio, setRangoMovInicio] = useState();
  const [rangoMovFin, setRangoMovFin] = useState();
  const [expMov, setExpMov] = useState("aqui para exportar");
  const [reporte, setReporte] = useState([]);
  const [valEntradas, setValEntradas] = useState('0')
  const [valSalidas, setValSalidas] = useState('0')
  const [valorTotal, setValorTotal] = useState('0')
  const tableRef = useRef(null);
  // Función para exportar datos a un archivo Excel

  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, "ExcelTotal");
    xlsx.writeFile(wb, "reportes-fechas.xlsx");
  };
  // Función para exportar datos a un archivo PDF

  const exportPdfHandler = () => {
    const doc = new jsPDF();

    const columns = [
      { title: "Productos", dataKey: "nombre_producto" },
      { title: "Categoría", dataKey: "nombre_categoria" },
      { title: "Entradas", dataKey: "total_entradas" },
      { title: "Salidas", dataKey: "total_salidas" },
      { title: "valor", dataKey: "precio_total" },
      { title: "Fecha último movimiento", dataKey: "ultima_fecha_movimiento" },
    ];

    // Obtener los datos de la tabla
    const tableData = reporte.map((element) => ({
      nombre_producto: element.nombre_producto,
      nombre_categoria: element.nombre_categoria,
      total_entradas: element.total_entradas,
      total_salidas: element.total_salidas,
      precio_total: element.precio_total,
      ultima_fecha_movimiento: Validate.formatFecha(element.ultima_fecha_movimiento),
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
  // Función para obtener los datos de la tabla

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
        Validate.formatFecha(element.ultima_fecha_movimiento)
      ];
      wsData.push(rowData);
    });

    return wsData;
  };
  // Efecto secundario para inicializar la tabla de datos cuando el reporte cambia

  useEffect(() => {
    if (reporte) {
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
          order: [[5, "asc"]],
        });
      }
    }
  }, [reporte]);
  // Efecto secundario para inicializar datos cuando el componente se monta

  useEffect(() => {
    setRangoMovFin(formatDateYYYYMMDD(new Date()));
    listarProducto()
    listaCat()
  }, [])
  // Función para listar las categorías en un select

  function listaCat() {
    var select = document.getElementById("categoryFilter");
    fetch(`http://${portConexion}/categoria/listar`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data !== null) {
          data.forEach(element => {
            var option = document.createElement("option");
            option.text = element.nombre_categoria;
            option.value = element.nombre_categoria;
            select.appendChild(option)
          })
        }
      });
  }
  // Función para listar productos por rango de fechas

  function ListartPorRango(inicio, fin) {
    fetch(`http://${portConexion}/producto/listarProductoTotal`, {
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
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
          }
          let valEntradas = 0;
          let valSalidas = 0;
          let ReporteDelFiltro = [];
          let fechaInicio = new Date(inicio);
          let fechaFin = new Date(fin);
          fechaFin.setDate(fechaFin.getDate() + 1);
          fechaFin.setHours(23, 59, 59);
          for (let index = 0; index < data.productos.length; index++) {
            const fechaDeProducto = new Date(data.productos[index].ultima_fecha_movimiento);
            if (fechaDeProducto >= fechaInicio && fechaDeProducto <= fechaFin) {
              valEntradas = valEntradas + parseInt(data.productos[index].total_entradas);
              valSalidas = valSalidas + parseInt(data.productos[index].total_salidas);
              ReporteDelFiltro.push(data.productos[index])
            }
          }
          setValEntradas(valEntradas)
          setValSalidas(valSalidas)
          setReporte(ReporteDelFiltro)
        }
      })
  }
  // Función para filtrar productos por categoría y rango de fechas

  function filtrarCategorias(inicio, fin) {
    var select = document.getElementById("categoryFilter").value;

    fetch(`http://${portConexion}/producto/listarProductoTotal`, {
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
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
          }
          let valEntradas = 0;
          let valSalidas = 0;
          let ReporteDelFiltro = [];
          let valTotal = 0;
          let fechaInicio = new Date(inicio);
          let fechaFin = new Date(fin);
          fechaFin.setDate(fechaFin.getDate() + 1);
          fechaFin.setHours(23, 59, 59);
          for (let index = 0; index < data.productos.length; index++) {
            const fechaDeProducto = new Date(data.productos[index].ultima_fecha_movimiento);
            if (fechaDeProducto >= fechaInicio && fechaDeProducto <= fechaFin) {
              if (data.productos[index].nombre_categoria == select) {

                valEntradas = valEntradas + parseInt(data.productos[index].total_entradas);
                valSalidas = valSalidas + parseInt(data.productos[index].total_salidas);
                valTotal = valTotal + (data.productos[index].precio_total);
                ReporteDelFiltro.push(data.productos[index])
              }
              if (select == 'todas') {
                listarProducto()
              }
            }
          }
          setValorTotal(valTotal)
          setValEntradas(valEntradas)
          setValSalidas(valSalidas)
          setReporte(ReporteDelFiltro)
        }
      })

  }
  // Función para listar los productos
  function listarProducto() {
    fetch(`http://${portConexion}/producto/listarProductoTotal`, {
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
        //  console.log(data);
        if (data !== null) {
          setValEntradas(data.entraron)
          setValSalidas(data.salieron)
          setReporte(data.productos)
          let valor = 0;
          data.productos.forEach(element => {
            valor = valor + element.precio_total;
          })
          setValorTotal(valor)
          setRangoMovInicio(formatDateYYYYMMDD(new Date('2023-03-19')))
        }
      })
  }


  return (
    <div>
      <h5 className="text-center mt-2">Reporte por fecha</h5>
      <div className="boxBtnContendidoTituloF">

        <div className="btnContenidoF11">
          <div className="ContFechaR1">
            <h6 className="textoReporte">Inicio</h6>
            <input onChange={(e) => setRangoMovInicio(e.target.value)} className="inputFechaReporte" type="date" name="inicio" id="inicio" defaultValue={rangoMovInicio} />

          </div>
          <div className="ContFechaR2">
            <h6 className="textoReporte">Fin</h6>
            <input onChange={(e) => setRangoMovFin(e.target.value)} className="inputFechaReporte" type="date" name="fin" id="fin" defaultValue={rangoMovFin} />

          </div>
          <div className="botonBuscarFecha">
            <button className="btn btn-color " onClick={() => { ListartPorRango(rangoMovInicio, rangoMovFin) }}>buscar</button>
          </div>
        </div>

        <div className="btnContenidoF22">
          <div className="conteFiltrar">
            <select className="form-select CategoriasInput" name="categoryFilter" id="categoryFilter">
              <option value="todas">Filtrar por Categorias</option>
            </select>
            <button className="btn btn-color" onClick={() => { filtrarCategorias(rangoMovInicio, rangoMovFin) }}>Filtrar</button>
          </div>
          <div className="btn-group grupoBOtoness" role="group" aria-label="Basic mixed styles example">
            <div className="" title="Descargar Excel">
              <button onClick={handleOnExport} type="button" className="btn btn-light">
                <img src={ExelLogo} className="logoExel" />
              </button>
            </div>
            <div className="" title="Descargar Pdf">
              <button type="button" className="btn btn-light" onClick={exportPdfHandler}>
                <img src={PdfLogo} className="logoExel" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid w-full">
        <table id="dtBasicExample" className="table table-striped table-bordered border display responsive nowrap b-4" ref={tableRef} cellSpacing={0} width="100%">
          <thead className="text-center">
            <tr>
              <th className="th-sm">Productos</th>
              <th className="th-sm">Categoría</th>
              <th className="th-sm">Entradas (<span style={{ color: 'rgb(13,110,253)' }}>{valEntradas}</span>)</th>
              <th className="th-sm">Salidas (<span style={{ color: 'rgb(13,110,253)' }}>{valSalidas}</span>)</th>
              <th className="th-sm">Valor total(<span style={{ color: 'rgb(13,110,253)' }}>${valorTotal}</span>)</th>
              <th className="th-sm">Fecha último movimiento</th>
            </tr>
          </thead>
          <tbody>
            {reporte != null && reporte.length > 0 ? (
              <>
                {reporte.map((element, index) => (
                  <tr key={index}>
                    <td>{element.nombre_producto}</td>
                    <td>{element.nombre_categoria}</td>
                    <td>{element.total_entradas}</td>
                    <td>{element.total_salidas}</td>
                    <td>${element.precio_total}</td>
                    <td>{formatDateYYYYMMDD(new Date(element.ultima_fecha_movimiento))}</td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={6}>
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
