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


const Inventario = () => {
  const [categories, setCategories] = useState([]);
  const [categoriaItem, setCategoriaItem] = useState([]);
  const [selectedCategoriaNombre, setSelectedCategoriaNombre] = useState("");
  const tableRef = useRef();

  const handleModalOpen = (categoryName) => {
    setSelectedCategoriaNombre(categoryName);
  }

  useEffect(() => {
		if (categoriaItem.length > 0) {
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
    <div className="container rounded p-4 mt-4">
      <div className="rounded p-1 mb-4 txt-color">
        <h1 className="text-center">INVENTARIO</h1>
      </div>
      
      {categories.map((categorie, index) => (
      <div key={categorie.id_categoria} className="bg-light p-3 mb-3 rounded d-grid">
        <button
          type="button"
          id="modalProducto"
          className={`btn ${index % 2 === 0 ? 'btn-color' : 'btn-warning'} mb-4`}
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          value={categorie.id_categoria}
          onClick={() => { handleModalOpen(categorie.nombre_categoria); listarCategoriaItem(categorie.id_categoria) }}
        >
          {categorie.nombre_categoria}
        </button>
      </div>
    ))}

      <div className="modal fade" data-bs-keyboard="false" id="staticBackdrop" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true" data-bs-backdrop="static">
        <div className="modal-dialog modal-dialog-centered modal-xl">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h1 className="modal-title fs-5">Categoria {selectedCategoriaNombre}</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
                <table id="dtBasicExample" className="table table-striped table-bordered border display responsive nowrap" cellSpacing={0} width="100%" ref={tableRef}>
                  <thead className="text-center text-justify">
                    <tr>
                      <th className="th-sm">N°</th>
                      <th className="th-sm">NombreCategoria</th>
                      <th className="th-sm">Peso</th>
                      <th className="th-sm">Unidad</th>
                      <th className="th-sm">FechaIngreso</th>
                      <th className="th-sm">FechaCaducidad</th>
                      <th className="th-sm">Descripcion</th>
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
                            <td>{index + 1}</td>
                            <td>{element.NombreCategoria}</td>
                            <td>{element.Peso}</td>
                            <td>{element.Unidad}</td>
                            <td>{element.FechaIngreso ? Validate.formatFecha(element.FechaIngreso) : 'No asignada'}</td>
                            <td>{element.FechaCaducidad ? Validate.formatFecha(element.FechaCaducidad) : 'No asignada'}</td>
                            <td>{element.Descripcion}</td>
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

      <div className="d-grid gap-2 col-3 mx-auto mt-4">
        <div className="row">
          <div className="col text-center">
            <button className="btn btn-primary mb-2 w-100">Kardes</button>
          </div>
        </div>
        <div className="row">
          <div className="col text-center">
            <button className="btn btn-danger w-100">
              <Link to="/producto/caducar">
                <div className="tamañoLateral">
                  Productos a caducar
                </div>
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const newLink = Inventario.newLink; // Exporta la función newLink

export default Inventario;
