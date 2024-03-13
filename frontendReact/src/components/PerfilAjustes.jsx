import React, { useEffect, useState } from "react";
import "../style/ajustesCss.css";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import ImagenLogo from "../../img/perfil-del-usuario.png";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import { secretKey } from "../const/keys";
import CryptoJs from "crypto-js";
import portConexion from "../const/portConexion";

const PerfilAjustes = () => {

	const [userName, setUserName] = useState('');
	const [userRoll, setUserRoll] = useState('');
	const [updateModal, setUpdateModal] = useState(false);


	useEffect(() => {
		setUserName(dataDecript(localStorage.getItem('name')));
		setUserRoll(dataDecript(localStorage.getItem('roll')));
		const userId = dataDecript(localStorage.getItem('id'));
		editarUsuario(userId);
	}, []);


	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [isValidPassword, setIsValidPassword] = useState(false);
	const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
		id_usuario: "",
		contrasena_usuario: ""
	});
	const [contrasenaValue, setContrasenaValue] = useState("");


	function dataDecript(encryptedPassword) {
		const bytes = CryptoJs.AES.decrypt(encryptedPassword, secretKey);
		return bytes.toString(CryptoJs.enc.Utf8);
	}

	const desencriptarContrasena = (contrasenaEncriptada) => {
		return dataDecript(contrasenaEncriptada).replace(/"/g, '');
	};

	useEffect(() => {
		const contrasenaDesencriptada = desencriptarContrasena(usuarioSeleccionado.contrasena_usuario);
		setContrasenaValue(contrasenaDesencriptada);
		validatePassword2(contrasenaDesencriptada);
	}, [usuarioSeleccionado.contrasena_usuario]);

	// Validar la contraseña
	const validatePassword2 = (newValue) => {
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
		const isValidPassword = passwordRegex.test(newValue);
		setPasswordError(!isValidPassword || newValue.trim() === "");
		setIsValidPassword(isValidPassword);
	};


	const handleChangeContrasena = (e) => {
		const newValue = e.target.value;
		setContrasenaValue(newValue);
		validatePassword2(newValue);
	};


	const toggleConfirmPasswordVisibility = () => {
		setShowConfirmPassword(!showConfirmPassword);
	};

	function removeModalBackdrop() {
		const modalBackdrop = document.querySelector(".modal-backdrop");
		if (modalBackdrop) {
			modalBackdrop.remove();
		}
	}



	function editarUsuario(userId) {
		fetch(`http://${portConexion}:3000/usuario/buscar/${userId}`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setUsuarioSeleccionado(data[0]);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}


	function actualizarUsuario(userId) {
		const validacionExitosa = Validate.validarCampos(".form-update");

		const dataToSend = {
			nombre_usuario: usuarioSeleccionado.nombre_usuario,
			documento_usuario: usuarioSeleccionado.documento_usuario,
			email_usuario: usuarioSeleccionado.email_usuario
		};

		fetch(`http://${portConexion}:3000/usuario/editarajustes/${userId}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem("token"),
			},
			body: JSON.stringify(dataToSend),
		})
			.then((res) => res.json())
			.then((data) => {
				if (!validacionExitosa) {
					Sweet.actualizacionFallido();
					return;
				}
				if (data.status === 200) {
					Sweet.actualizacionExitoso();
				}
				if (data.status === 409) {
					Sweet.error(data.message);
					return;
				}
				if (data.status !== 200) {
					Sweet.error(data.error.errors[0].msg);
					return;
				}
			})
			.catch((errors) => {
				console.error("Error:", errors);
			});
	}


	function actualizarContrasena(userId) {
		const validacionExitosa = Validate.validarCampos(".form-update");

		const dataToSend2 = {
			contrasena_usuario: contrasenaValue,

		};

		fetch(`http://${portConexion}:3000/usuario/editarcontrasena/${userId}`, {
			method: "PUT",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem("token"),
			},
			body: JSON.stringify(dataToSend2),
		})
			.then((res) => res.json())
			.then((data) => {
				if (!validacionExitosa) {
					Sweet.actualizacionFallido();
					return;
				}
				if (data.status === 200) {
					Sweet.actualizacionExitoso();
					setUpdateModal(false);
					removeModalBackdrop();
					const modalBackdrop = document.querySelector(".modal-backdrop");
					if (modalBackdrop) {
						modalBackdrop.remove();
					}
				}
				if (data.status === 409) {
					Sweet.error(data.message);
					return;
				}
				if (data.status !== 200) {
					Sweet.error(data.error.errors[0].msg);
					return;
				}

			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}


	return (
		<>
			<div className="containerAjustes">
				<div className="ajustesDiv">
					<div className="contPerfilajustes">
						<img src={ImagenLogo} className="imagenPerfiajustes" alt="" />
					</div>
					<div className="boxPerfilAjus">
						<div className="cargoUser1">
							<span className="nombreTamañousuario1">{userName.replace(/"/g, '')}</span>
							<span className="tamañocargoUsuario1">Cargo: {userRoll.replace(/"/g, '')}</span>
						</div>
					</div>
				</div>

				<div className="boxBtnCambiarcontrasena">
					<button type="button" className="btn btn-color BtnCamContra" data-bs-toggle="modal" data-bs-target="#staticBackdrop"
						onClick={() => {
							setUpdateModal(true);
						}}>
						Cambiar Contraseña
					</button>
				</div>

				<div
					className="modal fade"
					id="staticBackdrop"
					data-bs-backdrop="static"
					data-bs-keyboard="false"
					tabIndex="-1"
					aria-labelledby="staticBackdropLabel"
					aria-hidden="true"
					style={{ display: updateModal ? "block" : "none" }}
				>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h1 className="modal-title fs-5" id="staticBackdropLabel">Nueva Contraseña</h1>
								<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
							</div>
							<div className="modal-body">

								<div className="row">
									<div className="col">
										<label
											htmlFor="contrasena_usuario"
											className="label-bold mb-2"
										>
											Contraseña
										</label>
										<div className="input-group">
											<input
												type="hidden"
												value={usuarioSeleccionado.contrasena_usuario || ""}
												onChange={(e) =>
													setUsuarioSeleccionado({
														...usuarioSeleccionado,
														id_usuario: e.target.value,
													})
												}
											/>

											<input
												type={showConfirmPassword ? "text" : "password"}
												className={`form-control form-update ${passwordError ? "is-invalid" : ""}`}
												value={contrasenaValue || ""}
												onChange={handleChangeContrasena}
												name="contrasena_usuario"
												placeholder="Ingrese una contraseña"
											/>

											<div className="input-group-append">
												<button
													className="btn btn-secondary"
													type="button"
													onClick={toggleConfirmPasswordVisibility}
												>
													{showConfirmPassword ? <IconEyeOff /> : <IconEye />}
												</button>
											</div>
											<div className="row text-center">
												<div className="col">
													{!isValidPassword && (
														<div className="text-danger">
															La contraseña debe tener al menos 6 caracteres, una
															mayúscula, una minúscula y un número.
														</div>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className="modal-footer">
								<button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
								<button
									type="button"
									className="btn btn-color"
									onClick={() => {
										actualizarContrasena(usuarioSeleccionado.id_usuario, contrasenaValue);
									}}
								>
									Confirmar
								</button>

							</div>
						</div>
					</div>
				</div>



				<div className="ajustesFormu">
					<form action="" className="text-center border border-light">
						<div className="row mt-4">
							<div className="col">
								<label htmlFor="nombre_usuario" className="label-bold fw-bold mb-2">
									Nombre
								</label>
								<input
									type="hidden"
									name="nombre_usuario"
									value={usuarioSeleccionado.id_usuario || ""}
									onChange={(e) =>
										setUsuarioSeleccionado({
											...usuarioSeleccionado,
											id_usuario: e.target.value,
										})
									}
								/>
								<input
									type="text"
									className="form-control form-update"
									placeholder="Ingrese su nombre"
									value={usuarioSeleccionado.nombre_usuario || ""}
									name="nombre_usuario"
									onChange={(e) =>
										setUsuarioSeleccionado({
											...usuarioSeleccionado,
											nombre_usuario: e.target.value,
										})
									}
								/>
							</div>
							<div className="col">
								<label htmlFor="nombre_usuario" className="label-bold fw-bold mb-2">
									Documento
								</label>
								<input
									type="hidden"
									value={usuarioSeleccionado.documento_usuario || ""}
									onChange={(e) =>
										setUsuarioSeleccionado({
											...usuarioSeleccionado,
											id_usuario: e.target.value,
										})
									}
								/>
								<input
									type="number"
									value={usuarioSeleccionado.documento_usuario || ""}
									className="form-control form-update"
									placeholder="Ingrese su documento"
									onChange={(e) =>
										setUsuarioSeleccionado({
											...usuarioSeleccionado,
											documento_usuario: e.target.value,
										})
									}
								/>
							</div>
						</div>
						<div className="row mt-4">
							<div className="col">
								<label htmlFor="nombre_usuario" className="label-bold fw-bold mb-2">
									Correo Electronico
								</label>
								<input
									type="hidden"
									value={usuarioSeleccionado.documento_usuario || ""}
									onChange={(e) =>
										setUsuarioSeleccionado({
											...usuarioSeleccionado,
											id_usuario: e.target.value,
										})
									}
								/>
								<input
									type="email"
									value={usuarioSeleccionado.email_usuario || ""}
									className="form-control form-update"
									placeholder="Ingrese su correo electrónico"
									onChange={(e) =>
										setUsuarioSeleccionado({
											...usuarioSeleccionado,
											email_usuario: e.target.value,
										})
									}
								/>
							</div>
							<div className="col d-flex justify-content-start">
								<button
									onClick={() => {
										actualizarUsuario(usuarioSeleccionado.id_usuario);
									}}
									type="button"
									className="btn btn-color mt-4 jus">
									Guardar Datos
								</button>
							</div>
						</div>
					</form>
				</div>

			</div>
		</>
	)

};
export default PerfilAjustes