import React, { useEffect, useRef, useState } from "react";
import Sweet from "../helpers/Sweet";
import Inicio from "../Login/Inicio";
import LogoSena from "./LogoSena";
import IgsLogo from "../../img/IGS.svg";
import Fondo1 from "../../img/fondoIGS2.jpg";
import Fondo2 from "../../img/fondoIGS1.jpg";
import Fondo3 from "../../img/fondoIGS3.jpg";
import "bootstrap";
import "./css/login.css";
import { dataEncript } from "../components/encryp/encryp";
import { Navigate } from "react-router-dom";
import portConexion from "../const/portConexion";

const LoginForm = () => {
  const [documento, setDocumento] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loginSuccesFull, setLoginSuccesFull] = useState(false);
  const [message, setMessage] = useState("");

  function handleSubmitRecuperar() {
    fetch(`http://${portConexion}:3000/usuario/buscarCedula/${documento}`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === 200) {
          Sweet.recuperacionExitosa();
        } else {
          Sweet.recuperacionFallida();
          setMessage("Error: No se pudo encontrar el usuario.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Error: Fallo al enviar la solicitud.");
      });
  }

  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`http://${portConexion}:3000/aut/validar`, {
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
          setLoginSuccesFull(true);
          localStorage.setItem("token", data.token);
          localStorage.setItem("name", dataEncript(data.nombre));
          localStorage.setItem("roll", dataEncript(data.tipo));
          localStorage.setItem("id", dataEncript(data.id));
          window.location.reload();
        } else {
          Sweet.error(data.message);
          setLoginSuccesFull(false);
        }
      });
    console.log("documento:", documento);
    console.log("Contraseña:", contrasena);
  };

  const handleCloseRecuperarModal = () => {
    removeModalBackdrop();
    window.location.reload();
  };

  return (
    <>
      {loginSuccesFull ? (
        <Inicio />
      ) : (
        <>
          <div className="header">
            <div className="sena">
              <LogoSena />
            </div>
            <div className="titleIgs">
              <h1 className="h1Titulo">INVENTARIO GASTRONÓMICO SENA</h1>
            </div>
            <div className="container-logo">
              <img src={IgsLogo} className="logoigs" />
            </div>
          </div>
          <div className="nav">
            <button
              type="button"
              id="UserInicio"
              className="btn btn-light inicio222"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              Iniciar Sesión
            </button>
          </div>

          <div
            id="carouselExampleFade"
            className="carousel slide carousel-fade"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active" data-bs-interval="6000">
                <img src={Fondo1} className="d-block w-100 " alt="..." />
              </div>
              <div className="carousel-item" data-bs-interval="6000">
                <img src={Fondo2} className="d-block w-100" alt="..." />
              </div>
              <div className="carousel-item" data-bs-interval="6000">
                <img src={Fondo3} className="d-block w-100" alt="..." />
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleFade"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleFade"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
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
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header d-flex justify-content-center">
                  <div className="titulocentrado222">
                    <h1
                      className="modal-title h222 text-center"
                      id="staticBackdropLabel"
                    >
                      INICIO DE SESIÓN IGS
                    </h1>
                  </div>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="login-container">
                    {/* <div className="h5 text-muted text-center mb-2">Ingresa tus Datos</div> */}
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Documento:
                        </label>
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
                        <label htmlFor="password" className="form-label">
                          Contraseña:
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="password"
                          placeholder="Ingresa tu contraseña"
                          value={contrasena}
                          onChange={(event) =>
                            setContrasena(event.target.value)
                          }
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-block text-center my-3"
                      >
                        <Navigate to="/" />
                        Iniciar Sesión
                      </button>
                      <a
                        type="button"
                        className="blue"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop2"
                      >
                        ¿Olvidó Contraseña?
                      </a>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="modal fade"
            id="staticBackdrop2"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel2"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h1 className="modal-title fs-5" id="staticBackdropLabel2">
                    Recuperación de Contraseña
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => {
                      handleCloseRecuperarModal();
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSubmitRecuperar();
                    }}
                  >
                    <label htmlFor="">Documento</label>
                    <input
                      type="number"
                      className="form-control mt-2"
                      id="documento_usuario"
                      placeholder="Ingrese documento"
                      value={documento}
                      onChange={(e) => setDocumento(e.target.value)}
                    />
                    {message && (
                      <p className="mt-2 text-danger">
                        {message} {documento}
                      </p>
                    )}
                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        data-bs-dismiss="modal"
                        onClick={() => {
                          setMessage("");
                          handleCloseRecuperarModal();
                        }}
                      >
                        Cerrar
                      </button>
                      <button type="submit" className="btn btn-color">
                        Enviar
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="footerContent">
            <div className="boxFooter1"></div>
            <div className="boxFooter2"></div>
            <div className="boxFooter3"></div>
          </div>
        </>
      )}
    </>
  );
};

export default LoginForm;
