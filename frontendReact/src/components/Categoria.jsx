import React, { useEffect } from "react";
import { IconSearch } from "@tabler/icons-react";

const Categoria = () => {

  useEffect(() => {
    listarCategorias();
  }, []);

  function listarCategorias() {
    fetch("http://localhost:3000/categoria/listar", {
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
                <td>${element.id_categoria}</td>        
                <td>${element.nombre_categoria}</td>        
                <td><a href="javaScript:editarCategoria(${element.id_categoria})">Editar</a></td>           
                <td><a href="javaScript:eliminarCategoria(${element.id_categoria})">Eliminar</a></td>           
              </tr>`
          document.getElementById('tableCatategoria').innerHTML = row;
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
            Registrar nueva Categoria
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
              <h1 className="modal-title fs-5" id="exampleModalLabel">Registro Categoria </h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <div className=" d-flex justify-content-center">
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
