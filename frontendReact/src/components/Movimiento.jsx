
import React, { useState } from "react";


const Movimiento = () => {
  const [aplicaFechaCaducidad, setAplicaFechaCaducidad] = useState(false);

  const handleCheckboxChange = () => {
    setAplicaFechaCaducidad(!aplicaFechaCaducidad);
  };

  const [aplicaFechaCaducidad2, setAplicaFechaCaducidad2] = useState(false);

  const handleCheckboxChange2 = () => {
    setAplicaFechaCaducidad2(!aplicaFechaCaducidad2);
  };
  return (
   <>
  <div>
    <h1 className="text-center">Registro de movimiento</h1>
    <button type="button" className="btn btn-primary bg-success" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Registrar nuevo movimiento
    </button>
    <table className="table table-striped table-hover w-80">
  <thead>
    <tr>
      <th className="p-2 text-center ">Nombre producto</th>
      <th className="p-2 text-center">Fecha del movimiento</th>
      <th className="p-2 text-center">Tipo de movimiento</th>
      <th className="p-2 text-center">Cantidad</th>
      <th className="p-2 text-center">Unidad Peso</th>
      <th className="p-2 text-center">Precio movimiento</th>
      <th className="p-2 text-center">Estado producto</th>
      <th className="p-2 text-center">Nota</th>
      <th className="p-2 text-center">Fecha de caducidad</th>
      <th className="p-2 text-center">Usuario que hizo movimiento</th>
      <th className="p-2 text-center">Editar</th>
    </tr>
  </thead>
  <tbody id="tableMovimiento">
    <tr>
      
    </tr>
  </tbody>
</table>

    <div className="d-flex justify-content-center align-items-center w-full h-full">
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Registro de movimiento</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example1">Categoria</label>
                      <select className="form-select" id="form6Example1" aria-label="Default select example">
                        <option selected>Seleccione una opción</option>
                        <option value="1">Vegetal</option>
                        <option value="2">Carne</option>
                        <option value="3">Granos</option>
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example2">Producti</label>
                      <select className="form-select" id="form6Example2" aria-label="Default select example">
                        <option value="">Seleccione una opción</option>
                        <option value="entrada">Pechuga de pollo</option>
                        <option value="salida">Costillas de cerdo</option>
                      </select>
                    </div>
                  </div>
                  <div className="col">
                  <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example3">Tipo de movimeinto</label>
                      <label className="form-label" htmlFor="form6Example3">Tipo de movimeinto</label>
                      <select className="form-select" id="form6Example3" aria-label="Default select example">
                        <option value="">Seleccione una opción</option>
                        <option value="entrada">Entrada</option>
                        <option value="salida">Salida</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                        <label className="form-label" for="form6Example4">Cantidad</label>
                        <input type="text" id="form6Example4" className="form-control" />
                      </div>
                    </div>
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example5">Unidad</label>
                      <select className="form-select" id="form6Example5" aria-label="Default select example">
                            <option value="">Seleccione una opción</option>
                            <option value="kg">Kilo (Kg)</option>
                            <option value="lb">Libra (Lb)</option>
                            <option value="gr">Gramo (Gr)</option>
                            <option value="lt">Litro (Lt)</option>
                            <option value="ml">Mililitro (Ml)</option>
                          </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example4">Precio total del producto:</label>
                      <input type="number" id="form6Example4" className="form-control" />
                    </div>
                  </div>
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example6">Estado</label>
                        <select className="form-select" id="form6Example6" aria-label="Default select example">
                          <option value="">Seleccione una opción</option>
                          <option value="bueno">Bueno</option>
                          <option value="regular">Regular</option>
                          <option value="malo">Malo</option>
                        </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example6">Nota</label>
                      <input type="text" id="form6Example6" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <p>¿Aplica fecha de caducidad?</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={aplicaFechaCaducidad}
                          id="flexCheckDefault"
                          onChange={handleCheckboxChange}
                        />
                        <label className="form-check-label" htmlFor="flexCheckDefault">
                          Si
                        </label>
                      </div>
                    </div>
                  </div>
                  {aplicaFechaCaducidad && (
                    <div className="col">
                      <label className="form-label" htmlFor="form6Example7">
                        Fecha caducidad
                      </label>
                      <input
                        type="date"
                        id="form6Example7"
                        className="width: 20% form-control"
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn btn-primary bg-success bg-gradient">Registrar</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel2" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel2">Editar de movimiento</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example6">Estado</label>
                        <select className="form-select" id="form6Example6" aria-label="Default select example">
                          <option value="">Seleccione una opción</option>
                          <option value="bueno">Bueno</option>
                          <option value="regular">Regular</option>
                          <option value="malo">Malo</option>
                        </select>
                    </div>
                  </div>
                  <div className="col">
                  <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example3">Tipo de movimeinto</label>
                      <select className="form-select" id="form6Example3" aria-label="Default select example">
                        <option value="">Seleccione una opción</option>
                        <option value="entrada">Entrada</option>
                        <option value="salida">Salida</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" for="form6Example6">Nota</label>
                      <input type="text" id="form6Example6" className="form-control" />
                    </div>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <p>¿Deseas editar la fecha de caducidad?</p>
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value={aplicaFechaCaducidad2}
                          id="flexCheckDefault2"
                          onChange={handleCheckboxChange2}
                        />
                        <label className="form-check-label" htmlFor="flexCheckDefault2">
                          Si
                        </label>
                      </div>
                    </div>
                  </div>
                  {aplicaFechaCaducidad2 && (
                    <div className="col">
                      <label className="form-label" htmlFor="form6Example7">
                        Fecha caducidad
                      </label>
                      <input
                        type="date"
                        id="form6Example7"
                        className="width: 20% form-control"
                      />
                    </div>
                  )}
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn btn-primary bg-success bg-gradient">Actualizar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    
    </>
  );
};

export default Movimiento;