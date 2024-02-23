import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Sweet from "../helpers/Sweet";
import Inicio from "../Login/Inicio";
import LogoSena from './LogoSena';
import IgsLogo from "../../img/IGS.png";
import Fondo1 from "../../img/fondomio.jpg"
import Fondo2 from "../../img/fondo.jpg"
import Fondo3 from "../../img/fruit-171671.jpg"
import "bootstrap";
import './css/login.css';
import { dataEncript } from "../components/encryp/encryp";

const LoginForm = () => {
	const [documento, setDocumento] = useState("");
	const [contrasena, setContrasena] = useState("");
	const [loginSuccesFull, setLoginSuccesFull] = useState(false);
	const handleSubmit = (e) => {
		e.preventDefault();
		fetch("http://localhost:3000/aut/validar", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				documento,
				contrasena,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (data.status == 200) {
					console.log(data);
					setLoginSuccesFull(true)
					localStorage.setItem("token", data.token);
					localStorage.setItem("name", dataEncript(data.nombre));
					localStorage.setItem("roll", dataEncript(data.tipo));
					localStorage.setItem("id", dataEncript(data.id));
					window.location.reload()
				} else {
					Sweet.error(data.message);
					setLoginSuccesFull(false)
				}
			});
		console.log("documento:", documento);
		console.log("Contraseña:", contrasena);
	};

	return (
		<>
			{loginSuccesFull ? <Inicio /> :
				<>
					<div className="header">
						<div className="sena">
							<LogoSena />
						</div>
						<div className="titleIgs">
							<h1 className="h1Titulo">INVENTARIO GASTRONOMICO SENA</h1>
						</div>
						<div className="container-logo">
							<img src={IgsLogo} className="logoigs" />
						</div>
					</div>
					<div className="nav">
						<button type="button" id="UserInicio" className="btn btn-light inicio222" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
							Iniciar Sesion
						</button>
					</div>

					<div id="carouselExampleFade" className="carousel slide carousel-fade">
						<div className="carousel-inner">
							<div className="carousel-item active">
								<img src={Fondo1} className="d-block w-100 " alt="..." />
							</div>
							<div className="carousel-item">
								<img src={Fondo2} className="d-block w-100" alt="..." />
							</div>
							<div className="carousel-item">
								<img src={Fondo3} className="d-block w-100" alt="..." />
							</div>
						</div>
						<button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
							<span className="carousel-control-prev-icon" aria-hidden="true"></span>
							<span className="visually-hidden">Previous</span>
						</button>
						<button className="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
							<span className="carousel-control-next-icon" aria-hidden="true"></span>
							<span className="visually-hidden">Next</span>
						</button>
					</div>



					<div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
						<div className="modal-dialog modal-dialog-centered">
							<div className="modal-content">
								<div className="modal-header d-flex justify-content-center">
									<div className="titulocentrado222">
										<h1 className="modal-title h222 text-center" id="staticBackdropLabel">INCIO DE SESION IGS</h1>
									</div>
									<button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div className="modal-body">
									<div className="login-container">
										{/* <div className="h5 text-muted text-center mb-2">Ingresa tus Datos</div> */}
										<form onSubmit={handleSubmit}>
											<div className="mb-3">
												<label htmlFor="email" className="form-label">Documento:</label>
												<input
													type="number"
													className="form-control"
													id="email"
													placeholder="Ingresa tu documento"
													value={documento}
													onChange={(event) => setDocumento(event.target.value)}
												/>
											</div>
											<div className="mb-3">
												<label htmlFor="password" className="form-label">Contraseña:</label>
												<input
													type="password"
													className="form-control"
													id="password"
													placeholder="Ingresa tu contraseña"
													value={contrasena}
													onChange={(event) => setContrasena(event.target.value)}
												/>
											</div>
											<button type="submit" className="btn btn-block text-center my-3">Iniciar Sesión</button>
											<div className="mt-3">
												<a href="#">Olvidé mi Contraseña</a>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					</div>

				</>
			}
		</>

	);
};

export default LoginForm;
