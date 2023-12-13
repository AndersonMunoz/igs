import React, { useEffect, useRef, useState } from "react";
import "../style/usuario.css"
import { IconSearch } from "@tabler/icons-react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';

const Usuario = () => {
	const [search, setSeach] = useState('');
	const [usuarios, setUsuarios] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const modalUsuarioRef = useRef(null);
	const [updateModal, setUpdateModal] = useState(false);
	const modalUpdateRef = useRef(null);
	const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({});


	useEffect(() => {
		listarUsuario()
	}, []);

	function removeModalBackdrop() {
		const modalBackdrop = document.querySelector('.modal-backdrop');
		if (modalBackdrop) {
			modalBackdrop.remove();
		}
	}

	///listar usuario
	function listarUsuario() {
		fetch("http://localhost:3000/usuario/listar", {
			method: "get",
			headers: {
				"Content-type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setUsuarios(data);
			})
			.catch((e) => {
				console.log(e);
			});
	}

	function registrarUsuario() {

		let nombre_usuario = document.getElementById('nombre_usuario').value
		let email_usuario = document.getElementById('email_usuario').value
		let contrasena_usuario = document.getElementById('contrasena_usuario').value
		let documento_usuario = document.getElementById('documento_usuario').value
		let tipo_usuario = document.getElementById('tipo_usuario').value

		const validacionExitosa = Validate.validarCampos('.form-empty');

		fetch('http://localhost:3000/usuario/registrar', {
			method: 'POST',
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ nombre_usuario, email_usuario, contrasena_usuario, documento_usuario, tipo_usuario })
		})
			.then((res) => res.json())
			.then(data => {
				if (!validacionExitosa) {
					Sweet.registroFallido();
					return;
				}
				if (data.status == 200) {
					Sweet.registroExitoso();
				}
				if (data.status == 403) {
					Sweet.registroFallido();
				}
				console.log(data);
				listarUsuario();
				setShowModal(false);
				removeModalBackdrop();
				const modalBackdrop = document.querySelector('.modal-backdrop');
				if (modalBackdrop) {
					modalBackdrop.remove();
				}
				Validate.limpiar('.limpiar');
			})
			.catch(error => {
				console.error('Error registro fallido:', error);
			});
	}
	///eliminar
	function eliminarUsuario(id_usuario) {
		Sweet.confirmacion().then((result) => {
			if (result.isConfirmed) {
				fetch(`http://localhost:3000/usuario/deshabilitar/${id_usuario}`, {
					method: 'PATCH',
					headers: {
						"Content-type": "application/json"
					}
				})
					.then(res => res.json())
					.then(data => {
						console.log(data);
						if (data.status === 200) {
							Sweet.deshabilitadoExitoso();
						}
						if (data.status === 401) {
							Sweet.deshabilitadoFallido();
						}
						listarUsuario();
					})
					.catch(error => {
						console.error('Error usuario no medificado:', error);
					});
			}
		});
	}
	function editarUsuario(id) {
		fetch(`http://localhost:3000/usuario/buscar/${id}`, {
		  method: 'GET',
		  headers: {
			'Content-type': 'application/json',
		  },
		})
		  .then((res) => res.json())
		  .then((data) => {
			console.log(data);
			setUsuarioSeleccionado(data[0]);
			setUpdateModal(true);
		  })
		  .catch((error) => {
			console.error('Error:', error);
		  });
	  }
	function actualizarUsuario(id){
		const validacionExitosa = Validate.validarCampos('.form-update');
		fetch(`http://localhost:3000/usuario/editar/${id}`,{
		  method: 'PUT',
		  headers:{
			'Content-type':'application/json'
		  },
		  body: JSON.stringify(usuarioSeleccionado),
		})
		.then((res)=>res.json())
		.then((data)=>{
		  if(!validacionExitosa){
			Sweet.actualizacionFallido();
			return;
		  }
		  if(data.status == 200){
			Sweet.actualizacionExitoso();
		  }
		  if(data.status == 401){
			Sweet.actualizacionFallido();
		  }
		  console.log(data);
		  listarUsuario();
		  setUpdateModal(false);
		  removeModalBackdrop();
		  const modalBackdrop = document.querySelector('.modal-backdrop');
		  if (modalBackdrop) {
			modalBackdrop.remove();
		  }
		})
	  }

	return (
		<div>
			<div className="d-flex justify-content-between mb-4">
				<button type="button" id="modalUsuario" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal" onClick={() => { setShowModal(true) }}>
					Registrar Usuario
				</button>
				<div className="d-flex align-items-center">
					<input type="text" placeholder="Buscar Usuario" className="input-buscar" onChange={(e) => setSeach(e.target.value)} />
					<IconSearch className="iconSearch" />
				</div>
			</div>
			<div className="wrapper-editor">
				<table
					id="dtBasicExample"
					className="table table-striped table-bordered"
					cellSpacing={0}
					width="100%"
				>
					<thead className="text-center text-justify">
						<tr>
							<th className="th-sm">#</th>
							<th className="th-sm">Nombre</th>
							<th className="th-sm">Documento</th>
							<th className="th-sm">Correo Electronico</th>
							<th className="th-sm">Cargo</th>
							<th className="th-sm">Estado</th>
							<th className="th-sm" colSpan={2}>Acciones</th>
						</tr>
					</thead>
					<tbody id="listarUsuario" className="text-center">
						{usuarios.filter((item) => { return search.toLowerCase() === '' ? item : item.nombre_usuario.toLowerCase().includes(search) }).map((element) => (
							<tr key={element.id_usuario}>
								<td>{element.id_usuario}</td>
								<td>{element.nombre_usuario}</td>
								<td>{element.documento_usuario}</td>
								<td>{element.email_usuario}</td>
								<td>{element.tipo_usuario}</td>
								<td>{element.estado}</td>
								<td className="mx-2" onClick={() => { setUpdateModal(true); editarUsuario(element.id_usuario); }} data-bs-toggle="modal" data-bs-target="#actualizarModal">
									<button className="btn btn-color">
										Actualizar
									</button>
								</td>
								<td className="mx-2">
									<button className="btn btn-danger" onClick={() => eliminarUsuario(element.id_usuario)}>Eliminar</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalUsuarioRef} style={{ display: showModal ? 'block' : 'none' }}>
				<div className="modal-dialog modal-dialog-centered d-flex align-items-center">
					<div className="modal-content">
						<div className="modal-header txt-color">
							<h2 className="modal-title fs-5">Registrar Usuario</h2>
							<button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="d-flex justify-content-center">
								<form className="text-center border border-light ">
									<div className="mb-3 row">
										<div className="col-md-12 mb-2">
											<label htmlFor="nombre_usuario" className="label-bold mb-2">
												Nombre
											</label>
											<input
												type="text"
												className="form-control form-empty limpiar"
												id="nombre_usuario"
												name="nombre_usuario"
												placeholder="Ingrese su nombre"
											/>
											<div class="invalid-feedback is-invalid">
											Por favor, Ingresar un nombre valido.
											</div>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="documento_usuario" className="label-bold mb-1">
												Documento
											</label>
											<input
												type="number"
												className="form-control form-empty limpiar"
												id="documento_usuario"
												name="documento_usuario"
												placeholder="Ingrese su documento"
											/>
											<div class="invalid-feedback is-invalid">
												Por favor, Ingresar un documento valido 
											</div>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="email_usuario" className="label-bold mb-2">
												Correo Electrónico
											</label>
											<input
												type="email_usuario"
												className="form-control form-empty limpiar"
												id="email_usuario"
												name="email_usuario"
												placeholder="Ingrese su email"
											/>
											<div class="invalid-feedback is-invalid">
												Por Favor, Ingresar un correo valido
											</div>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="tipo_usuario" className="label-bold mb-2">
												Cargo
											</label>
											<select
												className="form-select form-control form-empty limpiar"
												id="tipo_usuario"
												name="tipo_usuario"
												defaultValue=""
											>
												<option value="" disabled selected>
													Seleccione un Cargo
												</option>
												<option value="administrador">Administrador</option>
												<option value="coadministrador">Co-Administrador</option>
											</select>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="contrasena_usuario" className="label-bold mb-2">
												Contraseña
											</label>
											<input
												type="password"
												className="form-control form-empty limpiar"
												id="contrasena_usuario"
												name="contrasena_usuario"
												placeholder="Ingrese una contraseña"
											/>
											<div class="invalid-feedback is-invalid">
											Por Favor, Ingresar una contraseña valida debe tener una mayuscula, minuscula y un numero
											</div>
										</div>
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
								Cerrar
							</button>
							<button type="button" className="btn btn-color" onClick={registrarUsuario} >
								Registrar
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* modal actualizar */}
			<div className="modal fade" id="actualizarModal" tabIndex="-1" aria-labelledby="actualizarModalLabel" aria-hidden="true" ref={modalUpdateRef} style={{ display: updateModal ? 'block' : 'none' }}>
				<div className="modal-dialog modal-dialog-centered d-flex align-items-center">
					<div className="modal-content">
						<div className="modal-header txt-color">
							<h2 className="modal-title fs-5">Actualizar Usuario</h2>
							<button type="button" className="btn-close text-white bg-white" data-bs-dismiss="modal" aria-label="Close"></button>
						</div>
						<div className="modal-body">
							<div className="d-flex justify-content-center">
								<form className="text-center border border-light ">
									<div className="mb-3 row">
										<div className="col-md-12 mb-2">
											<label htmlFor="nombre_usuario" className="label-bold mb-2">
												Nombre
											</label>
											<input
												type="text"
												className="form-control form-empty limpiar"
												id="nombre_usuario"
												name="nombre_usuario"
												placeholder="Ingrese su nombre"
											/>
											<div class="invalid-feedback is-invalid">
											Por favor, Ingresar un nombre valido.
											</div>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="documento_usuario" className="label-bold mb-1">
												Documento
											</label>
											<input
												type="number"
												className="form-control form-empty limpiar"
												id="documento_usuario"
												name="documento_usuario"
												placeholder="Ingrese su documento"
											/>
											<div class="invalid-feedback is-invalid">
												Por favor, Ingresar un documento valido 
											</div>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="email_usuario" className="label-bold mb-2">
												Correo Electrónico
											</label>
											<input
												type="email_usuario"
												className="form-control form-empty limpiar"
												id="email_usuario"
												name="email_usuario"
												placeholder="Ingrese su email"
											/>
											<div class="invalid-feedback is-invalid">
												Por Favor, Ingresar un correo valido
											</div>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="tipo_usuario" className="label-bold mb-2">
												Cargo
											</label>
											<select
												className="form-select form-control form-empty limpiar"
												id="tipo_usuario"
												name="tipo_usuario"
												defaultValue=""
											>
												<option value="" disabled selected>
													Seleccione un Cargo
												</option>
												<option value="administrador">Administrador</option>
												<option value="coadministrador">Co-Administrador</option>
											</select>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="contrasena_usuario" className="label-bold mb-2">
												Contraseña
											</label>
											<input
												type="password"
												className="form-control form-empty limpiar"
												id="contrasena_usuario"
												name="contrasena_usuario"
												placeholder="Ingrese una contraseña"
											/>
											<div class="invalid-feedback is-invalid">
											Por Favor, Ingresar una contraseña valida debe tener una mayuscula, minuscula y un numero
											</div>
										</div>
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
								Cerrar
							</button>
							<button type="button" className="btn btn-color" onClick={actualizarUsuario} >
								Registrar
							</button>
						</div>
					</div>
				</div>
			</div>


		</div>
	)
};

export default Usuario;