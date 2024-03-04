import React, { useEffect, useState } from "react";
import "../style/ajustesCss.css";
import ImagenLogo from "../../img/perfil-del-usuario.png";
import { dataDecript } from "./encryp/decryp";



const PerfilAjustes = () => {
    const [userName, setUserName] = useState('');
    const [userRoll, setUserRoll] = useState('');


    useEffect(() => {
        setUserName(dataDecript(localStorage.getItem('name')));
        setUserRoll(dataDecript(localStorage.getItem('roll')));
    })






    return (
        <>

            <div className="containerAjustes">
                <div className="ajustesDiv">
                    <div className="contPerfilajustes">
                        <img src={ImagenLogo} className="imagenPerfiajustes" alt="" />
                    </div>
                    <div className="boxPerfilAjus">
                        <div className="cargoUser1">
                            <span className="nombreTamañousuario1">{userName}</span>
                            <span className="tamañocargoUsuario1">Cargo: {userRoll}</span>
                        </div>
                    </div>
                </div>

                <div className="boxBtnCambiarcontrasena">
                    <button className="btn btn-color BtnCamContra">Cambiar Contraseña</button>
                </div>
                
                <div className="ajustesFormu">
                    <form action="" className="text-center border border-light">
                        <div className="row mt-4">
                            <div className="col">
                                <label htmlFor="nombre_usuario" className="label-bold fw-bold mb-2">
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    value="Santiago"
                                    className="form-control form-update"
                                    placeholder="Ingrese su nombre"
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="nombre_usuario" className="label-bold fw-bold mb-2">
                                    Cargo
                                </label>
                                <input
                                    type="text"
                                    value="Santiago"
                                    className="form-control form-update"
                                    placeholder="Ingrese su nombre"
                                />

                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col">
                                <label htmlFor="nombre_usuario" className="label-bold fw-bold mb-2">
                                    Documento
                                </label>
                                <input
                                    type="text"
                                    value="Santiago"
                                    className="form-control form-update"
                                    placeholder="Ingrese su nombre"
                                />
                            </div>
                            <div className="col">
                                <label htmlFor="nombre_usuario" className="label-bold fw-bold mb-2">
                                    Correo Electronico
                                </label>
                                <input
                                    type="text"
                                    value="Santiago"
                                    className="form-control form-update"
                                    placeholder="Ingrese su nombre"
                                />

                            </div>
                        </div>
                    </form>
                    <button
                    type="button"
                    className="btn btn-color mt-4">Guardar Datos</button>


                </div>
            </div>
        </>
    )

};
export default PerfilAjustes