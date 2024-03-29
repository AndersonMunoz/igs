import React, { useEffect, useState, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../style/Style.css";
import $ from 'jquery';
import { Link } from "react-router-dom";
import Validate from '../helpers/Validate'
import 'bootstrap';
import 'datatables.net';
import 'datatables.net-bs5';
import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive';
import 'datatables.net-responsive-bs5';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import esES from '../languages/es-ES.json';
import { DownloadTableExcel } from 'react-export-table-to-excel';
import generatePDF from 'react-to-pdf';
import Select from 'react-select'
import * as xlsx from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ExelLogo from "../../img/excel.224x256.png";
import PdfLogo from "../../img/pdf.224x256.png";

const Inventario = () => {
  const [categories, setCategories] = useState([]);
  const [categoriaItem, setCategoriaItem] = useState([]);
  const [selectedCategoriaNombre, setSelectedCategoriaNombre] = useState("");
  const tableRef = useRef();

  const handleOnExport = () => {
    const wsData = getTableData();
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet(wsData);
    xlsx.utils.book_append_sheet(wb, ws, 'ExcelCategorias');
    xlsx.writeFile(wb, 'Categorias.xlsx');
  };

  const doc = new jsPDF();
  const exportPdfHandler = () => {
    const doc = new jsPDF();

    const columns = [
      { title: 'N°', dataKey: 'id_categoria' },
      { title: 'NombreProducto', dataKey: 'NombreProducto' },
      { title: 'NombreCategoria', dataKey: 'NombreCategoria' },
      { title: 'Cantidad', dataKey: 'Cantidad' },
      { title: 'Unidad', dataKey: 'Unidad' },
      { title: 'FechaIngreso', dataKey: 'FechaIngreso' },
      { title: 'FechaCaducidad', dataKey: 'FechaCaducidad' },
      { title: 'Descripcion', dataKey: 'Descripcion' }
    ];

    // Obtener los datos de la tabla
    const tableData = categoriaItem.map((element) => ({
      id_producto: element.id_categoria,
      NombreProducto: element.NombreProducto,
      NombreCategoria: element.NombreCategoria,
      Cantidad: element.Cantidad,
      Unidad: element.Unidad,
      FechaIngreso: element.FechaIngreso ? Validate.formatFecha(element.FechaIngreso) : 'No asignada',
      FechaCaducidad: element.FechaCaducidad ? Validate.formatFecha(element.FechaCaducidad) : 'No asignada',
      Descripcion: element.Descripcion
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
    doc.save('Categoria.pdf');
  };
  const getTableData = () => {
    const wsData = [];

    // Obtener las columnas
    const columns = [
      'N°',
      'NombreCategoria',
      'NombreProducto',
      'Cantidad',
      'Unidad',
      'FechaIngreso',
      'FechaCaducidad',
      'Descripcion'
    ];
    wsData.push(columns);

    // Obtener los datos de las filas
    categoriaItem.forEach(element => {
      const rowData = [
        element.id_categoria,
        element.NombreProducto,
        element.NombreCategoria,
        element.Cantidad,
        element.Unidad,
        element.FechaIngreso ? Validate.formatFecha(element.FechaIngreso) : 'No asignada',
        element.FechaCaducidad ? Validate.formatFecha(element.FechaCaducidad) : 'No asignada',
        element.Descripcion,
      ];
      wsData.push(rowData);
    });

    return wsData;
  };

  const handleModalOpen = (categoryName) => {
    setSelectedCategoriaNombre(categoryName);
  }

  useEffect(() => {
    if (categoriaItem.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable({
        responsive: true,
        language: esES,
        lengthMenu: [
          [10, 50, 100, -1],
          ['10 Filas', '50 Filas', '100 Filas', 'Ver Todo']
        ],
      });
    }
  }, [categoriaItem]);

  useEffect(() => {
    listaCat();
  }, []);

  function listaCat() {
    fetch("http://localhost:3000/categoria/listar", {
      method: "get",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
      });
  }

  const listarCategoriaItem = (id) => {
    // Destruye el DataTable si existe
    if ($.fn.DataTable.isDataTable(tableRef.current)) {
      $(tableRef.current).DataTable().destroy();
    }

    // Realiza la solicitud para obtener los datos
    fetch(`http://localhost:3000/categoria/listarCategoriaItem/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "Application/json",
        token: localStorage.getItem('token'),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCategoriaItem(data);
      })
      .catch((error) => {
        console.error('Error al obtener los datos:', error);
      });
  }


  return (
    <div className="container rounded p-2 mt-2">
      <div className="rounded p-1 mb-4 ">
        <h1 className="text-center hghg">Inventario por Categorias</h1>
      </div>

      <div className="container">
        <div className="row">
          {categories.map((categorie, index) => (
            <div key={categorie.id_categoria} className="col-md-6" >
              <div className={`rounded ${index % 2 === 0 ? 'bg-colorrr' : 'bg-colorrr'}`} >
                <button
                  type="button"
                  id="modalProducto"
                  className="btn btn-block bg-colorrr mb-4"
                  data-bs-toggle="modal"
                  style={{ textTransform: 'capitalize' }}
                  data-bs-target="#staticBackdrop"
                  value={categorie.id_categoria}
                  onClick={() => { handleModalOpen(categorie.nombre_categoria); listarCategoriaItem(categorie.id_categoria) }}
                >
                  {categorie.nombre_categoria}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


      <div className="modal fade" data-bs-keyboard="false" id="staticBackdrop" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog  modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header bg txt-color ">
              <h1 className="modal-title fs-5 ">Categoria {selectedCategoriaNombre}</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal"></button>
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
                  onClick={exportPdfHandler}                >
                  <img src={PdfLogo} className="logoExel" />
                </button>
              </div>
            </div>
            <div className="modal-body  ">
              <table id="dtBasicExample max-width-5" className="table table-striped table-bordered border display responsive nowrap " cellSpacing={0} width="100%" ref={tableRef}>
                <thead className="text-center text-justify">
                  <tr>
                    <th className="th-sm">#Lote</th>
                    <th className="th-sm">Nombre producto</th>
                    <th className="th-sm">Cantidad</th>
                    <th className="th-sm">Unidad</th>
                    <th className="th-sm">Fecha ingreso</th>
                    <th className="th-sm">Fecha caducidad</th>
                  </tr>
                </thead>
                <tbody id="tableProducto" className="text-center">
                  {categoriaItem.length === 0 ? (
                    <tr>
                      <td colSpan={12}>
                        <div className="d-flex justify-content-center">
                          <div className="alert alert-danger text-center mt-4 w-50">
                            <h2> En este momento no contamos con ningún categoriaItem disponible.😟</h2>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <>
                      {categoriaItem.map((element, index) => (
                        <tr key={index} style={{ textTransform: 'capitalize' }}>
                          <td>{element.Lote}</td>
                          <td>{element.NombreProducto}</td>
                          <td>{element.Cantidad}</td>
                          <td>{element.Unidad}</td>
                          <td>{element.FechaIngreso ? Validate.formatFecha(element.FechaIngreso) : 'No asignada'}</td>
                          <td>{element.FechaCaducidad ? Validate.formatFecha(element.FechaCaducidad) : 'No asignada'}</td>
                        </tr>
                      ))}
                    </>
                  )}
                </tbody>
              </table>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>


        <div className="d-flex row mt-2">
          <div className="col text-center">
            <button className="btn btn-danger" >
              <Link to="/producto/caducar" style={{ textDecoration: 'none', color: 'white' }}>
                <div>
                  Productos a caducar
                </div>
              </Link>
            </button>

        </div>
      </div>
    </div>
  );
};

export const newLink = Inventario.newLink; // Exporta la función newLink

export default Inventario;
