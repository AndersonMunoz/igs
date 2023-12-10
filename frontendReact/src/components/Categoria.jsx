import React, { useEffect, useRef, useState } from "react";
import { IconSearch } from "@tabler/icons-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal } from 'bootstrap'; 

const Categoria = () => {
  const modalRef = useRef(null);
  const [categoriaInput, setCategoriaInput] = useState('');

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
  function agregarCategoria() {
    const nombreCategoria = document.getElementById("inlineFormInputGroupCategoria").value;

    fetch("http://localhost:3000/categoria/registrar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_categoria: nombreCategoria }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Categoría registrada:", data);
        listarCategorias();
        setCategoriaInput('');
        const myModal = new Modal(modalRef.current); 
        myModal.hide();
      })
      .catch((error) => {
        console.error("Error al registrar la categoría:", error);
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
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Registro Categoria </h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
          <div className="d-flex justify-content-center">
            <form className="row row-cols-lg-auto g-3 align-items-center">
              <div className="col-12">
                <label className="visually-hidden" htmlFor="inlineFormInputGroupCategoria">Categoria</label>
                <div className="input-group">
                  <div className="input-group-text"></div>
                  <input
                    type="text"
                    className="form-control"
                    id="inlineFormInputGroupCategoria"
                    placeholder="Nombre Categoria"
                    value={categoriaInput}
                    onChange={(e) => setCategoriaInput(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-12">
                <label className="visually-hidden" htmlFor="inlineFormSelectPref">Preference</label>
              </div>
            </form>
          </div>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
          <button type="button" className="btn btn-color" onClick={agregarCategoria} data-bs-dismiss="modal">Agregar</button>
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
