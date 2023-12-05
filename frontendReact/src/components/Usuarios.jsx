import React, { useEffect } from "react";
import "../style/usuario.css";
import { IconSearch } from "@tabler/icons-react";

const Usuario = () => {

	useEffect(() => {
		listarUsuario();
	}, []);

	function listarUsuario() {
		fetch("http://localhost:3000/usuario/listar", {
			method: "get",
			headers: {
				"content-type": "application/json"
			}
		})
			.then(res => res.json())
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
								</tr>`
					document.getElementById('listarUsuario').innerHTML = row;
				});
			})
			.catch(e => { console.log(e); })
	}


	return (
		<div>
			<div className="d-flex justify-content-between mb-4">
				<button type="button" className="btn-color btn mb-4" data-bs-toggle="modal" data-bs-target="#exampleModal">
					Registrar Usuario
				</button>
				<div className="d-flex align-items-center">
					<input type="text" placeholder="Buscar Usuario" className="input-buscar" />
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
						</tr>
					</thead>
					<tbody id="listarUsuario">
						
					</tbody>
				</table>
			</div>
			<div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
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
							<button type="button" className="btn btn-color">
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