import React, { useState } from "react";
import Sweet from "../helpers/Sweet";
import Inicio from "../Login/Inicio";
import LogoSena from './LogoSena';
import IgsLogo from "../../img/IGS.png";
import Fondo1 from "../../img/fondoIGS2.jpg"
import Fondo2 from "../../img/fondoIGS1.jpg"
import Fondo3 from "../../img/fondoIGS3.jpg"
import "bootstrap";
import './css/login.css';
import { dataEncript } from "../components/encryp/encryp";
import { Link } from "react-router-dom";

const LoginForm = () => {
    const [documento, setDocumento] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [loginSuccesFull, setLoginSuccesFull] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [recuperar, setRecuperar] = useState(false);

    function removeModalBackdrop() {
        const modalBackdrop = document.querySelector('.modal-backdrop');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    }

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
                    setShowModal(false);
                } else {
                    Sweet.error(data.message);
                    setLoginSuccesFull(false)
                }
            });
        console.log("documento:", documento);
        console.log("Contraseña:", contrasena);
    };

    const handleCloseRecuperarModal = () => {
        setRecuperar(false);
        removeModalBackdrop();
        setShowModal(true); // Asegurarse de que el modal de inicio de sesión esté visible después de cerrar el modal de recuperar contraseña
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
                        <button type="button" id="UserInicio" className="btn btn-light inicio222" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => { setShowModal(true) }}>
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
                                            <button type="button" className="blue" data-bs-toggle="modal" data-bs-target="#staticBackdrop2" onClick={() => { setRecuperar(true); }}>
                                                ¿Olvidó Contraseña?
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel2" aria-hidden="true" style={{ display: recuperar ? 'block' : 'none' }}>
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h1 className="modal-title fs-5" id="staticBackdropLabel2">Recuperacion de Contraseña</h1>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={handleCloseRecuperarModal}></button>
                                </div>
                                <div className="modal-body">
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="cedula"
                                        placeholder="Ingresa documento"
                                    />
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                                    <button type="button" className="btn btn-success">Enviar</button>
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
