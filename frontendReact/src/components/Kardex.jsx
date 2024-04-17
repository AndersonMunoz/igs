// Importación de bibliotecas y componentes necesarios
import React, { useState, useEffect, useRef } from "react";
import Sweet from '../helpers/Sweet'; // Componente Sweet para notificaciones
import Validate from '../helpers/Validate'; // Funciones de validación
import '../style/movimiento.css'; // Estilos específicos para esta página
import ExelLogo from "../../img/excel.224x256.png"; // Logo para exportar a Excel
import PdfLogo from "../../img/pdf.224x256.png"; // Logo para exportar a PDF
import esES from '../languages/es-ES.json'; // Archivo de traducción al español
import $ from 'jquery'; // Biblioteca jQuery para manipulación del DOM
import 'bootstrap'; // Bootstrap para estilos y componentes de UI
import 'datatables.net'; // DataTables para la visualización de datos en tablas
import 'datatables.net-bs5'; // Estilos de DataTables para Bootstrap 5
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css'; // Estilos de DataTables para Bootstrap 5
import 'datatables.net-responsive'; // Extensiones de DataTables para tablas responsivas
import 'datatables.net-responsive-bs5'; // Estilos de DataTables responsivos para Bootstrap 5
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css'; // Estilos de DataTables responsivos para Bootstrap 5
import { Link } from "react-router-dom"; // Componente de enlace para React Router
import * as xlsx from 'xlsx'; // Biblioteca para exportar a Excel
import jsPDF from 'jspdf'; // Biblioteca para generar PDFs
import autoTable from 'jspdf-autotable'; // Extensión de jsPDF para tablas en PDF
import portConexion from "../const/portConexion"; // Puerto de conexión para las solicitudes HTTP

// Definición del componente funcional Movimiento
const Movimiento = () => {
  
    // Definición de estados
    const [title, setTitle] = useState('Kardex'); // Título de la página
    const [movimientos, setMovimientos] = useState([]); // Lista de movimientos
    const tableRef = useRef(null); // Referencia al elemento de la tabla

    // Función para exportar a Excel
    const handleOnExport = () => {
        const wsData = getTableData(); // Obtener datos de la tabla
        const wb = xlsx.utils.book_new(); // Crear nuevo libro de Excel
        const ws = xlsx.utils.aoa_to_sheet(wsData); // Convertir datos a formato adecuado para Excel
        xlsx.utils.book_append_sheet(wb, ws, 'ExcelTotal'); // Agregar hoja al libro
        xlsx.writeFile(wb, 'Kardex.xlsx'); // Escribir archivo de Excel
    };

    // Función para exportar a PDF
    const exportPdfHandler = () => {
        const doc = new jsPDF('landscape'); // Crear nuevo documento PDF en formato paisaje
        const columns = [ // Definir columnas de la tabla en PDF
            { title: 'Nombre producto', dataKey: 'nombre_tipo' },
            { title: 'Fecha del movimiento', dataKey: 'fecha_movimiento' },
            { title: 'Tipo de movimiento', dataKey: 'tipo_movimiento' },
            { title: 'Cantidad', dataKey: 'cantidad_peso_movimiento' },
            { title: 'Unidad Peso', dataKey: 'unidad_peso' },
            { title: 'Precio individual', dataKey: 'precio_movimiento' },
            { title: 'Precio total', dataKey: 'precio_total_mov' },
            { title: 'Fecha de caducidad', dataKey: 'fecha_caducidad' }
        ];
        
        // Obtener los datos de la tabla y formatearlos adecuadamente
        const tableData = movimientos.map((element) => ({
            nombre_tipo: element.nombre_tipo,
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

    // Función para obtener datos de la tabla
    const getTableData = () => {
        const wsData = []; // Array para almacenar datos de la tabla
        
        // Obtener las columnas
        const columns = [
            'Nombre producto',
            'Fecha del movimiento',
            'Tipo de movimiento',
            'Cantidad',
            'Unidad peso',
            'Precio individual',
            'Precio total',
            'Fecha de caducidad'
        ];
        wsData.push(columns); // Agregar columnas al array
        
        // Obtener los datos de las filas
        movimientos.forEach(element => {
            const rowData = [
                element.nombre_tipo,
                Validate.formatFecha(element.fecha_movimiento),
                element.tipo_movimiento,
                element.cantidad_peso_movimiento,
                element.unidad_peso,
                element.precio_movimiento,
                element.precio_total_mov,
                Validate.formatFecha(element.fecha_caducidad)
            ];
            wsData.push(rowData); // Agregar fila al array
        });

        return wsData; // Devolver datos de la tabla
    };

    // Efecto para inicializar la tabla DataTables cuando cambian los movimientos
    useEffect(() => {
        if (movimientos.length > 0) {
            if ($.fn.DataTable.isDataTable(tableRef.current)) {
                $(tableRef.current).DataTable().destroy(); // Destruir tabla si ya existe
            }
            $(tableRef.current).DataTable({ // Inicializar DataTable
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
    }, [movimientos]); // Dependencia del efecto: movimientos

    // Función para eliminar el fondo modal
    function removeModalBackdrop() {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    }

    // Efecto para recargar la página al cambiar la historia del navegador
    useEffect(() => {
        window.onpopstate = function(event) {
            window.location.reload(); // Recargar página al cambiar la historia del navegador
        };
        listarMovimiento(); // Listar movimientos al cargar la página
    }, []); // Efecto ejecutado solo una vez al montar el componente

    // Función para obtener y listar movimientos desde el servidor
    function listarMovimiento() {
        fetch(`http://${portConexion}/facturamovimiento/listar`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
                token: localStorage.getItem("token")
            },
        }).then((res) => {
            if (res.status === 204) {
                return null; // Si no hay contenido, devolver nulo
            }
            return res.json(); // Convertir respuesta a JSON
        })
        .then((data) => {
            if (Array.isArray(data)) {
                setMovimientos(data); // Actualizar estado de movimientos con los datos recibidos
            }
        })
        .catch((e) => {
            console.log(e); // Manejar errores
        });
    }  return (
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