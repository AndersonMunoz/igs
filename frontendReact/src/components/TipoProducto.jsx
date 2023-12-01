const TipoProducto = () => {
  return (
    <>
      <p className="h4 mb-4 p-2 text-center  "> tipo de producto</p>
      <div>
        {/* Button trigger modal */}
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
        >
          Registrar nuevo tipo
        </button>
        {/* Modal */}
        <div
          className="modal fade"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel">
                  {" "}
                  Registrar nuevo tipo
                </h1>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                />
              </div>
              <div className="modal-body">
                <div className="container w-100 h-100 d-flex justify-content-center ">
                  <form className="row row-cols-lg-auto g-3 align-items-center">
                    <div className="col-12">
                      <label
                        className="visually-hidden"
                        htmlFor="inlineFormInputGroupTipo"
                      >
                        Tipo
                      </label>
                      <div className="input-group">
                        <div className="input-group-text">  </div>
                        <input
                          type="text"
                          className="form-control"
                          id="inlineFormInputGroupTipo"
                          placeholder="Nombre Producto "
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
                      <select
                        className="form-select"
                        aria-label="Default select example"
                      >
                        <option selected>seleciona una opcion </option>
                        <option value={1}>carnes 🥩</option>
                        <option value={2}>arros 🍚</option>
                        <option value={3}>vegetales🥦</option>
                      </select>
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
                  Close
                </button>
                <button
                  data-mdb-ripple-init
                  type="submit"
                  className="btn btn-success"
                >
                  Enviar
                </button>
              </div>
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
            <th className="th-sm">Tipo de producto</th>
            <th className="th-sm text-center" colSpan={2}> Botones de acción</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Tiger Nixon</td>
            <td>System Architect</td>
            <td ><button  className="btn btn-primary" type="button">actualizar</button></td>
            <td>eliminar</td>
          </tr>
          <tr>
            <td>Garrett Winters</td>
            <td>Accountant</td>
            <td ><button  className="btn btn-primary" type="button">actualizar</button></td>
            <td>eliminar</td>
          </tr>
          
        </tbody>
      </table>
    </>
  );
};
export default TipoProducto;
