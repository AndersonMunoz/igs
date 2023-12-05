
import React, { useEffect } from "react";
import { IconSearch } from "@tabler/icons-react";

const UnidadProductiva = () => {
  return (
    <>
      <div className="d-flex justify-content-between">
          <button type="button" className="btn-color btn  mb-4 " data-bs-toggle="modal" data-bs-target="#exampleModal">
            Registrar nuevo Proveedor
          </button>
          <div className="d-flex align-items-center">
          <input type="text" placeholder="Buscar Producto" className="input-buscar" />
          <IconSearch className="iconSearch" />
        </div>
        </div> 
     <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Registro Proveedor</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
              <form className="row row-cols-lg-auto g-3 align-items-center">
                    <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormInputGroupUp"
                      >
                       Up
                      </label>
                      <div className="input-group">
                        <div className="input-group-text">  </div>
                        <input
                          type="text"
                          className="form-control"
                          id="inlineFormInputGroupUp"
                          placeholder="Nombre Unidad productiva "
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormSelectPref"
                      >
                        Preference
                      </label>
                    </div>
                  </form>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn btn-color">Agregar</button>
            </div>
          </div>
        </div>
      </div>
      <table
        id="dtBasicExample"
        className="table table-striped table-bordered"
        cellSpacing={0}
        width="100%"
      >
        <thead>
          <tr>
            <th className="th-sm">Id</th>
            <th className="th-sm">Unidad Productiva</th>
            <th className="th-sm text-center" colSpan={2}> Botones de acción</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>carnes</td>
            <td>res</td>
            <td ></td>
            <td></td>
          </tr>
          <tr>
            <td>Garrett Winters</td>
            <td>Accountant</td>
            <td ></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default UnidadProductiva;
