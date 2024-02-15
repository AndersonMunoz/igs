import React, { useState } from "react";
import { Container, Form, Button } from "react-bootstrap";
import Sweet from "../helpers/Sweet";
import Inicio from "../Login/Inicio";
import LogoSena from './LogoSena';
import IgsLogo from "../../img/IGS.png";
import "bootstrap";
import './css/login.css';


const LoginForm = () => {
	const [documento, setDocumento] = useState("");
	const [contrasena, setContrasena] = useState("");
	const [loginSuccesFull, setLoginSuccesFull] = useState(false);


	const handledocumentoChange = (e) => {
		setdocumento(e.target.value);
	};

	const handlecontrasenaChange = (e) => {
		setcontrasena(e.target.value);
	};

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
					console.log(data.token);
					setLoginSuccesFull(true)
					localStorage.setItem("token", data.token);
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
								<LogoSena/>	
						</div>
						<div className="titleIgs">
							<h1 className="h1Titulo">INVENTARIO GASTRONOMICO SENA</h1>
						</div>
						<div className="container-logo">
							<img src={IgsLogo} className="logoigs" />
						</div>
					</div>
					<div class="nav">
						<button type="button" id="UserInicio" className="btn btn-light inicio" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
							Iniciar Sesion
						</button>

					</div>

					<div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
						<div class="modal-dialog">
							<div class="modal-content">
								<div class="modal-header">
									<h1 class="modal-title fs-5" id="staticBackdropLabel">Modal title</h1>
									<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
								</div>
								<div class="modal-body">
									...
								</div>
								<div class="modal-footer">
									<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
									<button type="button" class="btn btn-primary">Understood</button>
								</div>
							</div>
						</div>
					</div>
					<div className="login-container">
						<form onSubmit={handleSubmit}>
							<label htmlFor="email">documento:</label>
							<input
								type="text"
								id="text"
								value={documento}
								onChange={(event) => setDocumento(event.target.value)}
							/>
							<label htmlFor="password">Contaseña:</label>
							<input
								type="password"
								id="password"
								value={contrasena}
								onChange={(event) => setContrasena(event.target.value)}
							/>

							<button type="submit">Log in</button>
							<div className="mt-3">
								<a href="#">Olvide mi Contraseña</a>
							</div>
						</form>
					</div>
				</>
			}
		</>

	);
};

export default LoginForm;
