import React, { useEffect, useRef, useState } from "react";
import "../style/usuario.css"
import { IconSearch } from "@tabler/icons-react";
import Sweet from '../helpers/Sweet';
import Validate from '../helpers/Validate';

const Usuario = () => {
	const [showModal, setShowModal] = useState(false);
	const modalProductoRef = useRef(null);
	const [updateModal, setUpdateModal] = useState(false);
	const modalUpdateRef = useRef(null);

	useEffect(() => {
		listarUsuario()
	}, []);

	///listar usuario
	function listarUsuario() {
		fetch("http://localhost:3000/usuario/listar", {
			method: "get",
			headers: {
				"content-type": "application/json"
			}
		}).then(resp => resp.json())
			.then(data => {
				console.log(data);
				let row = '';
				data.forEach(element => {
					row += `<tr>
									<td>${element.id_usuario}</td>        
									<td>${element.nombre_usuario}</td>        
									<td>${element.documento_usuario}</td>        
									<td>${element.email_usuario}</td>        
									<td>${element.tipo_usuario}</td>        
									<td>${element.estado}</td>        
									<td class='mx-2'>
										<button class='btn btn-danger' onClick='${eliminarUsuario(element.id_usuario)}'>Eliminar</button>
									</td> 
									<td class='mx-2'><div class='btn btn-primary' '>Actualizar</div></td>       
								</tr>`
					document.getElementById('listarUsuario').innerHTML = row;/* onclick='modalAct(${element.id}) */
				});
			})
			.catch(e => { console.log(e); })
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
				if (data.status == 401) {
					Sweet.registroFallido();
				}
				console.log(data, "xd")
				listarUsuario()
				Validate.limpiar('.limpiar')

			}).catch(error => {
				console.error('Error:', error);
			});

	}
	///eliminar
	function eliminarUsuario(id_usuario) {
		fetch(`http://localhost:3000/usuario/deshabilitar/${id_usuario}`, {
			method: 'patch',
			headers: {
				"content-type": "application/json"
			}
		}).then((res) => res.json())
			.then(data => {
				if (data.status == 200) {
					listarUsuario()
					deshabilitadoExitoso()

				}
				if (data.status == 401) {
					listarUsuario()
					deshabilitadoFallido()

				}
			}).catch(error => {
				console.error('Error:', error);
			});

	}


	return (
		<div>
			<div className="d-flex justify-content-between mb-4">
				<button type="button" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#modalUsuario">
					Registrar Usuario
				</button>
				<div className="d-flex align-items-center">
					<input type="text" placeholder="Buscar Usuario" className="input-buscar from-control" />
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

					</tbody>
				</table>
			</div>
			<div className="modal fade" id="modalUsuario" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
												Please choose a username.
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
												Please choose a username.
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
												Please choose a username.
											</div>
										</div>
										<div className="col-md-12 mb-2">
											<label htmlFor="tipo_usuario" className="label-bold mb-2">
												Cargo
											</label>
											<select
												className="form-select form-empty limpiar"
												id="tipo_usuario"
												name="tipo_usuario"
											>
												<option value="" disabled selected>
													Seleccione un Cargo
												</option>
												<option value="administrador">Administrador</option>
												<option value="co-administrador">Co-Administrador</option>
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
												Please choose a username.
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


		</div>
	)
};

export default Usuario;