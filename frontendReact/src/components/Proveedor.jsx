import React from "react";
import '../style/Proveedor.css'


const Proveedor = () => {
  return (
    <>
      <div>
        <h1 className="text-center">Proveedores</h1>
        <div className="d-flex justify-content-between">
          <button type="button" className="btn-color btn  mb-4 " data-bs-toggle="modal" data-bs-target="#exampleModal">
            Registrar nuevo Proveedor
          </button>
          <button type="button" className="btn-color btn  mb-4 " data-bs-toggle="modal" data-bs-target="#buscarUsuario">
            Buscar un Proveedor
          </button>
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
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Telefono</th>
              <th className="th-sm">Direccion</th>
              <th className="th-sm">Contrato</th>
              <th className="th-sm">Estado</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Mecar todo</td>
              <td>3252355654</td>
              <td>cra #3-57 Patio Bonito</td>
              <td>61</td>
              <td>Activo</td>
            </tr>
          </tbody>
        </table>
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
                <form className="text-center border border-light" action="#!">
                  <div className="d-flex form-row mb-4">
                    <div className="col">
                      <input type="text" id="defaultRegisterFormFirstName" className="form-control" placeholder="Nombres"></input>
                    </div>
                    <div className="col ms-3">
                      <input type="text" id="defaultRegisterFormLastName" className="form-control" placeholder="Direccion"></input>
                    </div>
                  </div>
                  <div className="d-flex form-row mb-1">
                    <div className="col">
                      <input type="text" id="defaultRegisterFormEmail" className="form-control mb-4" placeholder="Contrato"></input>
                    </div>
                    <div className="col ms-3">
                      <input type="text" id="defaultRegisterPhonePassword" className="form-control" placeholder="Telefono" aria-describedby="defaultRegisterFormPhoneHelpBlock"></input>
                    </div>
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
      {/* modal para buscar */}
      <div className="modal fade" id="buscarUsuario" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h5 className="modal-title" id="exampleModalLabel">
                Buscar proveedor
              </h5>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <input type="text" className="form-control" id="formGroupExampleInput" placeholder="Ingrese un id o nombre de proveedor" />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cerrar
              </button>
              <button type="button" className="btn btn-color">
                Buscar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Proveedor;