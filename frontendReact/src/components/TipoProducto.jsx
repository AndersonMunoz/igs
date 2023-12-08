import React, { useEffect } from "react";
import { IconSearch } from "@tabler/icons-react";
const TipoProducto = () => {

  useEffect(() => {
    listarTipoProducto();
  }, []);

  function listarTipoProducto() {
    fetch("http://localhost:3000/tipo/listar", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(data=>{
        console.log(data);
        let row = '';
        data.forEach(element => {
          row += `<tr>
                <td>${element.id }</td>        
                <td>${element.NombreProducto}</td>        
                <td>${element.Categoría}</td>        
                <td><a href="javaScript:editarTipoProducto(${element.id_tipo})">Editar</a></td>           
                <td><a href="javaScript:eliminarTipoProducto(${element.id_tipo})">Eliminar</a></td>           
              </tr>`
          document.getElementById('tableTipo').innerHTML = row;
    });
  })
      .catch((e) => {
        console.log(e);
      });
  }

  return (
    <>
      <div className="d-flex justify-content-between">
          <button type="button" className="btn-color btn  mb-4 " data-bs-toggle="modal" data-bs-target="#exampleModal">
            Registrar Tipo Producto
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Registro Tipo Producto</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
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
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn btn-color">Agregar</button>
            </div>
          </div>
        </div>
      </div>
      <table id="dtBasicExample" className="table table-striped table-bordered" cellSpacing={0} width="100%">
        <thead>
          <tr>
            <th className="th-sm">Id</th>
            <th className="th-sm">nombre</th>
            <th className="th-sm">Categoria</th>
            <th className="th-sm text-center" colSpan={2}> Botones de acción</th>
          </tr>
        </thead>
        <tbody id="tableTipo"> 
        </tbody>
      </table>
    </>
  );
};
export default TipoProducto;
