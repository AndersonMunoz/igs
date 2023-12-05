import React from "react";
import "../style/producto.css";
import { IconSearch } from "@tabler/icons-react";

const Producto = () => {
  return (
    <div>
      <div className="d-flex justify-content-between mb-4">
        <button type="button" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Registrar Nuevo Producto
        </button>
        <div className="d-flex align-items-center">
          <input type="text" placeholder="Buscar Producto" className="input-buscar" />
          <IconSearch className="iconSearch" />
        </div>
      </div>
      <div className="wrapper-editor">
        <table
          id="dtBasicExample"
          className="table table-striped table-bordered"
          cellSpacing={0}
          width="100%"
        >
          <thead>
            <tr>
              <th className="th-sm">Producto</th>
              <th className="th-sm">Unidad Productiva</th>
              <th className="th-sm">Fecha de Caducidad</th>
              <th className="th-sm">Cantidad de Peso</th>
              <th className="th-sm">Unidad de Peso</th>
              <th className="th-sm">Precio</th>
              <th className="th-sm">Descipcion</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h2 className="modal-title fs-5">Registrar Producto</h2>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className="d-flex justify-content-center">
                <form className="text-center border border-light p-5">
                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="categoria" className="label-bold">
                        Categoría
                      </label>
                      <select
                        className="form-select" id="categoria" name="fk_id_tipo_producto">
                        <option value="" disabled selected>
                          Selecciona una Categoría
                        </option>
                        <option value="1">Categoría 1</option>
                        <option value="2">Categoría 2</option>
                        <option value="3">Categoría 3</option>
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="unidadPeso" className="label-bold">
                        U.P
                      </label>
                      <select
                        className="form-select"
                        id="unidadPeso"
                        name="unidad_peso_producto"
                      >
                        <option value="" disabled selected>
                          Selectione una UP
                        </option>
                        <option value="">U.P1</option>
                        <option value="">U.P2</option>
                      </select>
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="fechaCaducidad" className="label-bold">
                        Fecha de Caducidad
                      </label>
                      <input
                        type="date"
                        className="form-control"
                        id="fechaCaducidad"
                        name="fecha_caducidad_producto"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="cantidadProducto" className="label-bold">
                        Cantidad del Producto
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="cantidadProducto"
                        name="cantidad_peso_producto"
                        placeholder="Cantidad del Producto"
                      />
                    </div>
                  </div>

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <label htmlFor="precioProducto" className="label-bold">
                        Precio del Producto
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="precioProducto"
                        name="precio_producto"
                        placeholder="Precio del Producto"
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="unidadMedida" className="label-bold">
                        Unidad de Medida
                      </label>
                      <select
                        className="form-select"
                        id="unidadMedida"
                        name="unidad_peso_producto"
                      >
                        <option value="" disabled selected>
                          Selecciona una unidad de medida
                        </option>
                        <option value="kg">Kilogramo</option>
                        <option value="lb">Libra</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="descripcionProducto" className="label-bold">
                      Descripción
                    </label>
                    <textarea
                      className="form-control"
                      id="descripcionProducto"
                      placeholder="Descripción del Producto"
                      name="descripcion_producto"
                      rows="4"
                    ></textarea>
                  </div>
                </form>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button type="button" className="btn btn-color">
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Producto;
