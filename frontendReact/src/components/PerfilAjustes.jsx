import React, { useEffect, useState } from "react";
import "../style/ajustesCss.css";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import ImagenLogo from "../../img/perfil-del-usuario.png";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import { dataDecript } from "./encryp/decryp";
import { secretKey } from "../const/keys";
import CryptoJs from "crypto-js";



const PerfilAjustes = () => {

    const [userName, setUserName] = useState('');
    const [userRoll, setUserRoll] = useState('');
    const [userId3, setUserId] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);


    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
    });
    const [usuarioSeleccionado2, setUsuarioSeleccionado2] = useState({
        id_usuario: "",
        contrasena_usuario: ""
    });



    const [passwordError, setPasswordError] = useState(false);

    const [isValidPassword, setIsValidPassword] = useState(false);

    useEffect(() => {
        setUserName(dataDecript(localStorage.getItem('name')));
        setUserRoll(dataDecript(localStorage.getItem('roll')));
        const userId = dataDecript(localStorage.getItem('id'));
        editarUsuario(userId);
    }, []);


    function dataDecript(encryptedPassword) {
        const bytes = CryptoJs.AES.decrypt(encryptedPassword, secretKey);
        return bytes.toString(CryptoJs.enc.Utf8);
    }

    const [contrasenaValue, setContrasenaValue] = useState("");

    const desencriptarContrasena = (contrasenaEncriptada) => {
        return dataDecript(contrasenaEncriptada).replace(/"/g, '');
    };


    useEffect(() => {
        const contrasenaDesencriptada = desencriptarContrasena(usuarioSeleccionado2.contrasena_usuario);
        setContrasenaValue(contrasenaDesencriptada);
        validatePassword2(contrasenaDesencriptada);
    }, [usuarioSeleccionado2.contrasena_usuario]);


    const validatePassword2 = (newValue) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
        const isValidPassword = passwordRegex.test(newValue);
        setPasswordError(!isValidPassword || newValue.trim() === "");
        setIsValidPassword(isValidPassword);
    };

    // Manejar cambios en la contraseña
    const handleChangeContrasena = (e) => {
        const newValue = e.target.value;
        setContrasenaValue(newValue);
        validatePassword2(newValue);
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
        setInputType(inputType === "password" ? "text" : "password");
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };




    function editarUsuario(userId) {
        fetch(`http://localhost:3000/usuario/buscar/${userId}`, {
            method: "GET",
            headers: {
                "Content-type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setUsuarioSeleccionado(data[0]);
                setUsuarioSeleccionado2(data[0]);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    }



    function actualizarUsuario(userId) {
        const validacionExitosa = Validate.validarCampos(".form-update");

        const dataToSend = {
            ...usuarioSeleccionado,
            
        };
        

        fetch(`http://localhost:3000/usuario/editar/${userId}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
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
    function actualizarContraseña(userId) {
        const validacionExitosa = Validate.validarCampos(".form-update");

        const dataToSend2 = {
            ...usuarioSeleccionado,
            contrasena_usuario: contrasenaValue
        };

        fetch(`http://localhost:3000/usuario/editarcontra/${userId}`, {
            method: "PACH",
            headers: {
                "Content-type": "application/json",
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
                    <button type="button" className="btn btn-color BtnCamContra" data-bs-toggle="modal" data-bs-target="#staticBackdrop">
                        Cambiar Contraseña
                    </button>
                </div>

                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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
                                                value={usuarioSeleccionado2.contrasena_usuario || ""}
                                                onChange={(e) =>
                                                    setUsuarioSeleccionado2({
                                                        ...usuarioSeleccionado2,
                                                        id_usuario: e.target.value,
                                                    })
                                                }
                                            />
                                            <input
                                                type={showConfirmPassword ? "text" : "password"} // Utilizar type=password para ocultar la contraseña
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
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-color" onClick={actualizarContraseña(contrasenaValue)}>Comfirmar</button>
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
                                    placeholder="Ingrese su nombre"
                                    onChange={(e) =>
                                        setUsuarioSeleccionado({
                                            ...usuarioSeleccionado,
                                            email_usuario: e.target.value,
                                        })
                                    }
                                />

                            </div>
                            <div className="col">
                                <button
                                    onClick={() => {
                                        actualizarUsuario(usuarioSeleccionado.id_usuario);
                                    }}
                                    type="button"
                                    className="btn btn-color mt-4">
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