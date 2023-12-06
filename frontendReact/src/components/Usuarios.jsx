import React, { useEffect } from "react";
import "../style/usuario.css";
import { IconSearch } from "@tabler/icons-react";
import Swal from 'sweetalert2'
import {  } from 'sweetalert2-react-content'

const Usuario = () => {

	useEffect(() => {
		listarUsuario()
		eliminarUsuario()
		registrarUsuario();
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
									<td><a class="btn btn-danger" href='javaScript:eliminarUsuario(${element.id_usuario})'>Eliminar</a></td>        
								</tr>`
					document.getElementById('listarUsuario').innerHTML = row;
				});
			})
			.catch(e => { console.log(e); })
	}
	///registrar
/* 	let formControl = document.querySelectorAll(".form-control");
	let invalidFeedback = document.querySelectorAll(".invalid-feedback");


const MySwal = withReactContent(Swal) /* */

	 function registrarUsuario() {
    let datos = new URLSearchParams();
    datos.append('nombre_usuario', document.getElementById('nombre_usuario').value)
    datos.append('email_usuario', document.getElementById('email_usuario').value)
    datos.append('contrasena_usuario', document.getElementById('contrasena_usuario').value)
    datos.append('documento_usuario', document.getElementById('documento_usuario').value)
    datos.append('tipo_usuario', document.getElementById('tipo_usuario').value)

    fetch('http://localhost:3000/usuario/registrar', {
        method: 'POST',
        body: datos
    })
        .then(rep => rep.json())
        .then(data => {
            if (data.errors) {
                let keys = [
                    "nombre_usuario",
                    "email_usuario",
                    "contrasena_usuario",
                    "documento_usuario",
                    "tipo_usuario"
                ]
                console.log(data.errors.path)
                for (let x = 0; x < keys.length; x++) {
                    for (let u = 0; u < data.errors.length; u++) {

                        for (let i = 0; i < keys.length; i++) {
                            console.log(data.errors[u].path, [keys[x]])
                            if (data.errors[u].path == [keys[x]]) {
                                formControl[x].classList.add("is-invalid")
                                formControl[x].classList.remove("is-valid")

                            }
                        }
                    }

                }
            }
            if (data.status == 200) {
                
							MySwal.fire({
                    title: 'Mensaje',
                    icon: 'success',
                    text: data.menssge,
                    ConfirmButtonText: 'Cerrar',
                })
            }
            if (data.status == 401) {
                
							MySwal.fire({
                    title: 'Mensaje',
                    icon: 'warning',
                    text: data.menssge,
                    ConfirmButtonText: 'Cerrar',
                })
            }
            if (data.status == 500) {
                
							MySwal.fire({
                    title: 'Mensaje',
                    icon: 'warning',
                    text: data.menssge,
                    ConfirmButtonText: 'Cerrar',
                })
            }
            console.log(data, "xd")
            
            modalUsuario.hide()

        })

} 
	///eliminar
	function eliminarUsuario(id_usuario) {
		fetch(`http://localhost:3000/usuario/eliminar/${id_usuario}`, {
			method: 'patch',
			headers: {
				"content-type": "application/json"
			}

		})
			.then(rep => rep.json())
			.then(data => {
				if (data.status == 200) {
					listarUsuario()
					Swal.fire({
						title: 'Mensaje',
						icon: 'warnig',
						text: data.menssge,
						ConfirmButtonText: 'Cerrar',
					})
				}
				if (data.status == 401) {
					listarUsuario()
					Swal.fire({
						title: 'Mensaje',
						icon: 'success',
						text: data.menssge,
						ConfirmButtonText: 'Cerrar',
					})
				}
				if (data.status == 500) {
					listarUsuario()
					Swal.fire({
						title: 'Mensaje',
						icon: 'error',
						text: data.menssge,
						ConfirmButtonText: 'Cerrar',
					})
				}

			})

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
					<thead>
						<tr>
							<th className="th-sm">#</th>
							<th className="th-sm">Nombre</th>
							<th className="th-sm">Documento</th>
							<th className="th-sm">Correo Electronico</th>
							<th className="th-sm">Cargo</th>
							<th className="th-sm">Estado</th>
							<th className="th-sm">Eliminar</th>
						</tr>
					</thead>
					<tbody id="listarUsuario">

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
										<div className="col-md-12 mb-3">
											<label htmlFor="nombre_usuario" className="label-bold mb-2">
												Nombre
											</label>
											<input
												type="text"
												className="form-control"
												id="nombre_usuario"
												name="nombre_usuario"
												placeholder="Ingrese su nombre"
											/>
											<div class="invalid-feedback is-invalid">
												Please choose a username.
											</div>
										</div>
										<div className="col-md-12 mb-3">
											<label htmlFor="documento_usuario" className="label-bold mb-2">
												Documento
											</label>
											<input
												type="number"
												className="form-control"
												id="documento_usuario"
												name="documento_usuario"
												placeholder="Ingrese su documento"
											/>
											<div class="invalid-feedback is-invalid">
												Please choose a username.
											</div>
										</div>
										<div className="col-md-12 mb-3">
											<label htmlFor="email_usuario" className="label-bold mb-2">
												Correo Electrónico
											</label>
											<input
												type="email_usuario"
												className="form-control"
												id="email_usuario"
												name="email_usuario"
												placeholder="Ingrese su email"
											/>
											<div class="invalid-feedback is-invalid">
												Please choose a username.
											</div>
										</div>
										<div className="col-md-12 mb-3">
											<label htmlFor="tipo_usuario" className="label-bold mb-2">
												Cargo
											</label>
											<select
												className="form-select"
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
										<div className="col-md-12 mb-3">
											<label htmlFor="contrasena_usuario" className="label-bold mb-2">
												Contraseña
											</label>
											<input
												type="password"
												className="form-control"
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
							<button type="button" className="btn btn-color" onClick="registrarUsuario" >
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