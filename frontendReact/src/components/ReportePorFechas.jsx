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

const reporte = () => {
    const [title, setTitle] = useState('aqui va el titulo');
    const [rangoMovInicio, setrangoMovInicio] = useState('aqui van los rangos de mov de inicio');
    const [rangoMovFin, setrangoMovFin] = useState('aqui van los rangos de mov final');
    const [expMov, setExpMov] = useState('aqui para exportar');
    const [reporte, setReporte]= useState([])
    const tableRef = useRef();

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
        //   { title: "N°", dataKey: "id_proveedores" },
        //   { title: "Nombre", dataKey: "nombre_proveedores" },
        //   { title: "Telefono", dataKey: "telefono_proveedores" },
        //   { title: "Dirección", dataKey: "direccion_proveedores" },
        //   { title: "Contrato", dataKey: "contrato_proveedores" },
        //   { title: "Estado", dataKey: "estado" },
        ];
    
        // Obtener los datos de la tabla
        const tableData = reporte.map((element) => ({
        //   id_proveedores: element.id_proveedores,
        //   nombre_proveedores: element.nombre_proveedores,
        //   telefono_proveedores: element.telefono_proveedores,
        //   direccion_proveedores: element.direccion_proveedores,
        //   contrato_proveedores: element.contrato_proveedores,
        //   estado: element.estado,
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
          "N°",
          "Nombre",
          "Telefono",
          "Dirección",
          "Contrato",
          "Estado",
        ];
        wsData.push(columns);
    
        // Obtener los datos de las filas
        reporte.forEach((element) => {
          const rowData = [
            // element.id_proveedores,
            // element.nombre_proveedores,
            // element.telefono_proveedores,
            // element.direccion_proveedores,
            // element.contrato_proveedores,
            // element.estado,
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
            order: [[8, "asc"]],
          });
        }
      }, [reporte]);
    

    return(
        <div>
            <div className="boxBtnContendidoTitulo">
                <div className="btnContenido1">
                    <div style={{width: '200px', marginRight: '20px'}} className="d-flex">
                        <input type="date" name="Inicio" id="Inicio" onChange={()=>{setrangoMovInicio()}}/>
                        <h2>Inicio</h2>
                    </div>
                    <div style={{width: '200px'}} className="d-flex">
                        <input className="flex" type="date" name="Inicio" id="Inicio" onChange={()=>{setrangoMovFin()}}/>
                        <h2>Fin</h2>
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
            <table id="dtBasicExample" className="table table-striped table-bordered border display responsive nowrap b-4" ref={tableRef} cellSpacing={0} width="100%">
                <thead className="text-center">
                    <tr>
                        <th className="th-sm">Categoría</th>
                        <th className="th-sm">Productos</th>
                        <th className="th-sm">Entradas</th>
                        <th className="th-sm">Salidas</th>
                        <th className="th-sm">valor</th>
                        <th className="th-sm">Fecha último movimiento</th>
                        <th className="th-sm">Usuario</th>
                    </tr>
                </thead>
                <tbody id="tableReportes" className="text-center">
                    {reporte.length > 0 ? (
                        <>
                            console.log('okis');
                        </>
                    ):(
                        <tr>
                          <td colSpan={12}>
                            <div className="d-flex justify-content-center">
                              <div className="alert alert-danger text-center mt-4 w-50">
                                <h2>
                                  En este momento no contamos con ningún reporte.😟
                                </h2>
                              </div>
                            </div>
                          </td>
                        </tr>
                    )}
                </tbody>
            </table>


            </div>
        </div>
    )
}
export default reporte;