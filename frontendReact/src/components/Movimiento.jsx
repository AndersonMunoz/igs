import React, { useState, useEffect, useRef } from "react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';
import '../style/movimiento.css';
import { IconSearch } from "@tabler/icons-react"; 

const Movimiento = () => {
  const [aplicaFechaCaducidad, setAplicaFechaCaducidad] = useState(false);
  const [categoria_list, setcategorias_producto] = useState([]);
  const [proveedor_list, setProveedor] = useState([]);
  const [tipos, setTipo] = useState([]);
  const [usuario_list, setUsuario] = useState([]);
  const handleCheckboxChange = () => {
    setAplicaFechaCaducidad(!aplicaFechaCaducidad);
  };
  const fkIdUsuarioRef = useRef(null);

  const [aplicaFechaCaducidad2, setAplicaFechaCaducidad2] = useState(false);

  const handleCheckboxChange2 = () => {
    setAplicaFechaCaducidad2(!aplicaFechaCaducidad2);
  };

  useEffect(() => {
    listarMovimiento();
    listarCategoria();
    //listarProducto();
    listarTipo();
    listarProveedor();
    listarUsuario();
  }, []);
  function listarCategoria() {
    fetch("http://localhost:3000/categoria/listar", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      setcategorias_producto(data);
    })
    .catch((e) => {
      console.log(e);
    });
  }

 /*  function listarProducto() {
    fetch("http://localhost:3000/producto/listar", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    })
    .then((res) => res.json())
    .then((data) => {
      setProductos(data);
    })
    .catch((e) => {
      console.log(e);
    });
  } */
  function listarTipo(){
    fetch("http://localhost:3000/tipo/listar",{
      method: "GET",
      headers:{
        "Content-type": "application/json",
      },
    })
    .then((res)=>res.json())
    .then((data)=>{
      setTipo(data)
    })
    .catch((e) => {
      console.log(e);
    });
  }
  function listarProveedor() {
    fetch("http://localhost:3000/proveedor/listar", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProveedor(data)
      })
      .catch((e) => {
        console.log(e);
      });
  }
  function registrarMovimiento() {
    
    let fk_id_usuario = fkIdUsuarioRef.current.value;
    let tipo_movimiento = document.getElementById('tipo_movimiento').value;
    let cantidad_peso_movimiento = document.getElementById('cantidad_peso_movimiento').value;
    let unidad_peso_movimiento = document.getElementById('unidad_peso_movimiento').value;
    let precio_movimiento= document.getElementById('precio_movimiento').value;
    let estado_producto_movimiento = document.getElementById('estado_producto_movimiento').value;
    let nota_factura = document.getElementById('nota_factura').value;
    let fecha_caducidad = null;
    let fk_id_producto = document.getElementById('fk_id_producto').value;
    let fk_id_proveedor  = document.getElementById('fk_id_proveedor').value;
    if (aplicaFechaCaducidad) {
      fecha_caducidad = document.getElementById('fecha_caducidad').value;
    }

    const validacionExitosa = Validate.validarCampos('.form-empty');

    fetch('http://localhost:3000/facturamovimiento/registrar', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({tipo_movimiento,cantidad_peso_movimiento,unidad_peso_movimiento,precio_movimiento,estado_producto_movimiento,nota_factura,fecha_caducidad,fk_id_producto,fk_id_usuario,fk_id_proveedor}),
    })
      .then((res) => res.json())
      .then(data => {
        if (!validacionExitosa) {
          Sweet.registroFallido();
          return;
        }
        if(data.status == 200){
          Sweet.registroExitoso();
        }
        if(data.status == 401){
          Sweet.registroFallido();
        }
        console.log(data);
        listarMovimiento();
        setShowModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
        Validate.limpiar('.limpiar');
      })
      .catch(error => {
        console.error('Error:', error);
      });
      //console.log(document.getElementById('fecha_caducidad'));
  }
  function listarUsuario() {
		fetch("http://localhost:3000/usuario/listar", {
			method: "get",
			headers: {
				"content-type": "application/json"
			}
		}).then(resp => resp.json())
			.then(data => {
        setUsuario(data);
			})
			.catch(e => { console.log(e); })
	}

  function listarMovimiento() {
    fetch("http://localhost:3000/facturamovimiento/listar", {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then(data=>{
        //console.log(data);
        let row = '';
        data.forEach(element => {
    
            row += `<tr>
                <td class="p-2 text-center">${element.nombre_tipo}</td>        
                <td class="p-2 text-center">${Validate.formatFecha(element.fecha_movimiento)}</td>        
                <td class="p-2 text-center">${element.tipo_movimiento}</td>        
                <td class="p-2 text-center">${element.cantidad_peso_movimiento}</td>        
                <td class="p-2 text-center">${element.unidad_peso_movimiento}</td>        
                <td class="p-2 text-center">${element.precio_movimiento}</td>        
                <td class="p-2 text-center">${element.estado_producto_movimiento}</td>        
                <td class="p-2 text-center">${element.nota_factura}</td>        
                <td class="p-2 text-center">${Validate.formatFecha(element.fecha_caducidad)}</td>
                <td class="p-2 text-center">${element.nombre_usuario}</td>          
                <td class="p-2 text-center">${element.nombre_proveedores}</td>        
                <td class="p-2 text-center"><a href="javaScript:eliminarCategoria(${element.id_categoria})">Eliminar</a></td>           
            </tr>`
        });
        document.getElementById('tableMovimiento').innerHTML = row;
    })    
      .catch((e) => {
        console.log(e);
      });
  }
  return (
   <>
  <div>
    <h1 className="text-center modal-title fs-5">Registro de movimiento</h1>
    <button type="button" className="btn-color btn  mb-4 " data-bs-toggle="modal" data-bs-target="#exampleModal" >
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
      <th className="p-2 text-center">Proveedor</th>
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
            <div className="modal-header txt-color">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Registro de movimiento</h1>
              <button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                
                <div className="row mb-4">
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" htmlFor="categoria">Categoria</label>
                      <select className="form-select" id="categoria" name="categoria" aria-label="Default select example">
                      <option defaultValue="">Selecciona una categoria</option>
                        {categoria_list.map((element) => (
                          <option key={element.id_categoria} value={element.id_categoria}>{element.nombre_categoria}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" htmlFor="fk_id_producto">Producto</label>
                      <select defaultValue="" className="form-select" id="fk_id_producto" name="fk_id_producto" aria-label="Default select example">
                        <option defaultValue="">Seleccione una opción</option>
                        {tipos.map((element) => (
                        <option key={element.id} value={element.id}>{element.NombreProducto}</option>
                      ))}
                      </select>
                    </div>
                  </div>
                  <div className="col">
                  <div data-mdb-input-init className="form-outline">
                      <label className="form-label" htmlFor="tipo_movimiento">Tipo de movimeinto</label>
                      <select defaultValue="" className="form-select" id="tipo_movimiento" name="tipo_movimiento" aria-label="Default select example">
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
                      <label className="form-label" htmlFor="fk_id_proveedor">Proveedor</label>
                      <select defaultValue=""  className="form-select" id="fk_id_proveedor" name="fk_id_proveedor" aria-label="Default select example">
                        <option value="">Seleccione una opción</option>
                        {proveedor_list.map((element) => (
                        <option key={element.id_proveedores} value={element.id_proveedores}>{element.nombre_proveedores}</option>
                      ))}
                      </select>
                    </div>
                  </div>
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" htmlFor="cantidad_peso_movimiento">Cantidad</label>
                      <input  type="text" id="cantidad_peso_movimiento" name="cantidad_peso_movimiento" className="form-control" />
                    </div>
                  </div>
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" htmlFor="	unidad_peso_movimiento">Unidad</label>
                      <select defaultValue=""  className="form-select" id="unidad_peso_movimiento" name="unidad_peso_movimiento" aria-label="Default select example">
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
                      <label className="form-label" htmlFor="precio_movimiento">Precio total del producto:</label>
                      <input  type="number" id="precio_movimiento" name="precio_movimiento"className="form-control" />
                    </div>
                  </div>
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" htmlFor="estado_producto_movimiento">Estado</label>
                        <select defaultValue="" className="form-select" id="estado_producto_movimiento" name="estado_producto_movimiento" aria-label="Default select example">
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
                      <label className="form-label" htmlFor="nota_factura">Nota</label>
                      <input type="text" id="nota_factura" name="nota_factura"className="form-control" />
                    </div>
                  </div>
                  <div className="col">
                    <div data-mdb-input-init className="form-outline">
                      <label className="form-label" htmlFor="fk_id_usuario'">Usuario</label>
                      <select
                        className="form-select"
                        id="fk_id_usuario"
                        name="fk_id_usuario"
                        aria-label="Default select example"
                        ref={fkIdUsuarioRef}
                      >
                        <option defaultValue="" value="">
                          Selecciona un usuario
                        </option>
                        {usuario_list.map((element) => (
                          <option key={element.id_usuario} value={element.id_usuario}>
                            {element.nombre_usuario}
                          </option>
                        ))}
                      </select>
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
                      <div data-mdb-input-init className="form-outline">
                        <label className="form-label" htmlFor="fecha_caducidad">
                          Fecha caducidad
                        </label>
                        <input
                          type="date"
                          id="fecha_caducidad"
                          name="fecha_caducidad"
                          className="width: 20% form-control"
                        />
                      </div>
                    </div>
                  )};
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button type="button" className="btn-color btn" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={registrarMovimiento}>Registrar</button>
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
                      <label className="form-label" htmlFor="form6Example6">Estado</label>
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
                      <label className="form-label" htmlFor="form6Example6">Nota</label>
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