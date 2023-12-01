import React from "react";

const Movimiento = () => {
  return (
   <>
   <div>
    <h1 className="text-center">Registro de movimiento</h1>
    <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
  Registrar nuevo movimiento
  </button>
  <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
                  <select class="form-select" id="form6Example1" aria-label="Default select example">
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
                  <select class="form-select" id="form6Example2" aria-label="Default select example">
                    <option value="">Seleccione una opción</option>
                    <option value="entrada">Pechuga de pollo</option>
                    <option value="salida">Costillas de cerdo</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" for="form6Example3">Tipo de movimeinto</label>
                  <select class="form-select" id="form6Example3" aria-label="Default select example">
                    <option value="">Seleccione una opción</option>
                    <option value="entrada">Entrada</option>
                    <option value="salida">Salida</option>
                  </select>
                </div>
              </div>
              <div className="col">
                <div data-mdb-input-init className="form-outline">
                  <label className="form-label" for="form6Example4">Cantidad</label>
                  <input type="text" id="form6Example4" className="form-control" />
                  
                </div>
              </div>
            </div>
            <div className="row mb-4">
              <div data-mdb-input-init className="form-outline mb-4">
                <label className="form-label" for="form6Example5">Unidad</label>
                <select class="form-select" id="form6Example5" aria-label="Default select example">
                      <option value="">Seleccione una opción</option>
                      <option value="kg">Kilo (Kg)</option>
                      <option value="lb">Libra (Lb)</option>
                      <option value="gr">Gramo (Gr)</option>
                      <option value="lt">Litro (Lt)</option>
                      <option value="ml">Mililitro (Ml)</option>
                    </select>
              </div>
              <div data-mdb-input-init className="form-outline mb-4">
              <label className="form-label" for="form6Example4">Precio total del producto:</label>
              <input type="number" id="form6Example4" className="form-control" />
            </div>
            </div>
            

            

            <div data-mdb-input-init className="form-outline mb-4">
              <label className="form-label" for="form6Example6">Estado</label>
              <select class="form-select" id="form6Example6" aria-label="Default select example">
                    <option value="">Seleccione una opción</option>
                    <option value="bueno">Bueno</option>
                    <option value="regular">Regular</option>
                    <option value="malo">Malo</option>
                  </select>
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
              <label className="form-label" for="form6Example6">Nota</label>
              <input type="text" id="form6Example6" className="form-control" />
            </div>

            <div data-mdb-input-init className="form-outline mb-4">
              <p>Aplica fecha de caducidad</p>
            <div className="form-check">
              <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
              <label className="form-check-label" for="flexCheckDefault">Si</label>
            </div>
              <label className="form-label" for="form6Example7">Fecha caducidad</label>
              <input type="date" id="form6Example7" className="width: 20%  form-control" />
            </div>

            <button data-mdb-ripple-init type="button" className=" bg-success btn btn-primary btn-block mb-4">Registrar Movimiento</button>
          </form>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          <button type="button" className="btn btn-primary bg-success bg-gradient">Registrar</button>
        </div>
      </div>
    </div>
  </div>
  </div>
    
    </>
  );
};

export default Movimiento;