import React, { useRef, useEffect, useState } from "react";

const InventarioItem = () => {
  const tableRef = useRef();
  const [name, setName] = useState([]);
  const [item, setItem] = useState([]);


  useEffect(() => {
    const category = localStorage.getItem('category'); // Obtener el valor de localStorage
    setName(category); // Establecer el nombre de la categoría
    if (category) {
      listarCategoriaItem(category); // Llamar a listarCategoriaItem con el valor de localStorage
    }
  }, []);

  const listarCategoriaItem = (category) => {
    console.log(category);
    fetch(`http://localhost:3000/categoria/listarCategoriaItem/${category}`, {
      method: "GET",
      headers: {
        'Content-type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      setItem(data);
    })
    .catch((e) => {
      console.log("Error: ", e);
    });
  }

  useEffect(() => {
    if (item.length > 0) {
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
      });
    }
  }, [item]);

  return (
    <>
      <div className="text-center mb-4 mt-4">
        <h1>{name}</h1>
      </div>
      <div className="container-fluid w-full">
        <table
          id="dtBasicExample"
          className="table table-striped table-bordered border display responsive nowrap b-4"
          ref={tableRef}
          cellSpacing={0}
          width="100%"
        >
          <thead className="text-center">
            <tr>
              <th className="th-sm">N°</th>
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Cantidad</th>
              <th className="th-sm">Unidad</th>
              <th className="th-sm">Fecha Ingreso</th>
              <th className="th-sm">Caducidad</th>
              <th className="th-sm">Descripcion</th>
            </tr>
          </thead>
          <tbody id="tableItem" className="text-center">
            {item.length > 0 ? (
              <>
                {item.map((element, index) => (
                  <tr key={element.id_categoria}>
                    <td>{index + 1}</td>
                    <td>{element.NombreCategoria}</td>
                    <td>{element.Peso}</td>
                    <td>{element.Unidad}</td>
                    <td>{Validate.formatFecha(element.FechaIngreso)}</td>
                    <td>{Validate.formatFecha(element.FechaCaducidad)}</td>
                    <td>{element.Descripcion}</td>
                    <td>
                      <button
                        type="button"
                        className="btn-color btn mx-2"
                        data-bs-toggle="modal"
                        data-bs-target="#exampleModal"
                        onClick={() => {
                          setModal(true);
                          editarProveedor(element.id_categoria);
                        }}
                      >
                        <IconEdit />
                      </button>
                      <button
                        className="btn btn-danger"
                        type="button"
                        onClick={() =>
                          deshabilitarProveedor(element.id_categoria)
                        }
                      >
                        <IconTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </>
            ) : (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2>
                        En este momento no contamos con ningún proveedor
                        disponible.😟
                      </h2>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default InventarioItem;
