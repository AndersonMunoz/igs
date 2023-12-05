import React from "react";
import '../services/categoria'

const Categoria = () => {
  return (
    <>
      <p className="h4 mb-4 p-2 text-center  "> Categoria</p>
      <div>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
          Registrar nuevo Categoria
        </button>
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  {" "}
                  Registrar nuevo Categoria
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"/>
              </div>
              <div className="modal-body">
                <div className="container w-100 h-100 d-flex justify-content-center ">
                  <form className="row row-cols-lg-auto g-3 align-items-center">
                    <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormInputGroupCategoria"
                      >
                        Categoria
                      </label>
                      <div className="input-group">
                        <div className="input-group-text">  </div>
                        <input type="text" className="form-control" id="inlineFormInputGroupCategoria" placeholder="Nombre Categoria "/>
                      </div>
                    </div>
                    <div className="col-12">
                      <label className="visually-hidden" htmlFor="inlineFormSelectPref">
                        Preference
                      </label>
                    </div>
                  </form>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                  Close
                </button>
                <button data-mdb-ripple-init type="submit" className="btn btn-success">
                  Enviar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <table id="dtBasicExample" className="table table-striped table-bordered" cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th className="th-sm">Id</th>
            <th className="th-sm">Categoria</th>
            <th className="th-sm text-center" colSpan={2}> Botones de acción</th>
          </tr>
        </thead>
        <tbody id="tableCatategoria">
          
        </tbody>
      </table>
    </>
  );
};

export default Categoria;
