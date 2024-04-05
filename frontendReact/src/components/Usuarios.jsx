import React, { useEffect, useRef, useState } from "react";
import "../style/usuarios.css";
import { IconEdit, IconEye, IconTrash, IconEyeOff } from "@tabler/icons-react";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import esES from "../languages/es-ES.json";
import ExelLogo from "../../img/excel.224x256.png";
import PdfLogo from "../../img/pdf.224x256.png";
import $ from "jquery";
import "bootstrap";
import "datatables.net";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css";
import "datatables.net-responsive";
import "datatables.net-responsive-bs5";
import "datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css";
import { DownloadTableExcel } from "react-export-table-to-excel";
import generatePDF from "react-to-pdf";
import portConexion from "../const/portConexion";
import { secretKey } from "../const/keys";
import CryptoJs from "crypto-js";


const Usuario = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const modalUsuarioRef = useRef(null);
  const [updateModal, setUpdateModal] = useState(false);
  const modalUpdateRef = useRef(null);
  const tableRef = useRef();

  const [userRoll, setUserRoll] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordMatch, setPasswordMatch] = useState(false);
  const [isValidPassword, setIsValidPassword] = useState(false);


  function dataDecript(encryptedPassword) {
    const bytes = CryptoJs.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(CryptoJs.enc.Utf8);
  }

  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState({
    id_usuario: "",
    contrasena_usuario: ""
  });
  const [contrasenaValue, setContrasenaValue] = useState("");

  const desencriptarContrasena = (contrasenaEncriptada) => {
    return dataDecript(contrasenaEncriptada).replace(/"/g, '');
  };


  useEffect(() => {
    const contrasenaDesencriptada = desencriptarContrasena(usuarioSeleccionado.contrasena_usuario);
    setContrasenaValue(contrasenaDesencriptada);
    validatePassword2(contrasenaDesencriptada);
  }, [usuarioSeleccionado.contrasena_usuario]);


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


  ///registro usuario \/ \/ \/ \/

  const handleRegistration = () => {
    setPassword("");
    setConfirmPassword("");
    setPasswordMatch(false);
  };

  useEffect(() => { }, [passwordMatch]);

  const handlePasswordChange = (event) => {
    const newPassword = event.target.value;
    setPassword(newPassword);
    setPasswordMatch(newPassword === confirmPassword);
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const isValidPassword = passwordRegex.test(newPassword);
    setIsValidPassword(isValidPassword);

    validatePassword(newPassword, confirmPassword);
  };

  const handleConfirmPasswordChange = (event) => {
    const newConfirmPassword = event.target.value;
    setConfirmPassword(newConfirmPassword);
    setPasswordMatch(password === newConfirmPassword);
    validatePassword(password, newConfirmPassword);
  };

  const validatePassword = (newPassword, newConfirmPassword) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    const isValidPassword = passwordRegex.test(newPassword);

    setPasswordError(
      !isValidPassword ||
      newPassword.trim() === "" ||
      newConfirmPassword.trim() === ""
    );

  };

  function obtenerContrasena(password, confirmPassword) {
    if (password !== confirmPassword) {
      throw new Error("Las contraseñas no coinciden");
    }
    return password;
  }


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const resetFormState = () => {
    const formFields = modalUsuarioRef.current.querySelectorAll(
      '.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]'
    );
    formFields.forEach((field) => {
      if (field.type === "checkbox") {
        field.checked = false;
      } else {
        field.value = "";
      }
      field.classList.remove("is-invalid");
    });
  };
  const resetFormState2 = () => {
    const formFields = modalUpdateRef.current.querySelectorAll(
      '.form-control,.form-update,.form-empty, select, input[type="number"], input[type="checkbox"]'
    );
    formFields.forEach((field) => {
      if (field.type === "checkbox") {
        field.checked = false;
      } else {
        field.value = "";
      }
      field.classList.remove("is-invalid");
    });
  };




  useEffect(() => {
    if (usuarios.length > 0) {
      if ($.fn.DataTable.isDataTable(tableRef.current)) {
        $(tableRef.current).DataTable().destroy();
      }
      $(tableRef.current).DataTable({
        columnDefs: [
          {
            targets: -1,
            responsivePriority: 1,
          },
        ],
        responsive: true,
        language: esES,
        paging: true,
        select: {
          style: "multi",
          selector: "td:first-child",
        },
        lengthMenu: [
          [10, 50, 100, -1],
          ["10 Filas", "50 Filas", "100 Filas", "Ver Todo"],
        ],
      });
    }
  }, [usuarios]);

  useEffect(() => {
    window.onpopstate = function (event) {
      window.location.reload();
    };
    listarUsuario();
  }, []);





  function removeModalBackdrop() {
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.remove();
    }
  }
  ///listar usuario
  function listarUsuario() {
    fetch(`http://${portConexion}:3000/usuario/listar`, {
      method: "get",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem('token')
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuarios(data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  function registrarUsuario() {
    let documento_usuario = document.getElementById("documento_usuario").value;
    let email_usuario = document.getElementById("email_usuario").value;
    let nombre_usuario = document.getElementById("nombre_usuario").value;
    let tipo_usuario = document.getElementById("tipo_usuario").value;

    const validacionExitosa = Validate.validarCampos(".form-empty");

    fetch(`http://${portConexion}:3000/usuario/registrar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem('token')
      },
      body: JSON.stringify({
        documento_usuario,
        email_usuario,
        nombre_usuario,
        contrasena_usuario: obtenerContrasena(password, confirmPassword),
        tipo_usuario,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (!validacionExitosa) {
          Sweet.registroFallido();
          return;
        }
        if (data.status === 200) {
          Sweet.exito(data.message);
          if ($.fn.DataTable.isDataTable(tableRef.current)) {
            $(tableRef.current).DataTable().destroy();
          }
          listarUsuario();
          handleRegistration();
        }
        if (data.status === 409) {
          Sweet.error(data.message);
          return;
        }
        if (data.status !== 200) {
          Sweet.error(data.error.errors[0].msg);
          return;
        }
        handleRegistration();
        listarUsuario();
        setShowModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      })
      .catch((error) => {
        console.error("Error registro fallido:", error);
      });
  }
  ///eliminar
  function eliminarUsuario(id_usuario) {
    Sweet.confirmacion().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://${portConexion}:3000/usuario/deshabilitar/${id_usuario}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            token: localStorage.getItem('token')
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 200) {
              Sweet.deshabilitadoExitoso();
            }
            if (data.status === 401) {
              Sweet.deshabilitadoFallido();
            }

            listarUsuario();
            setShowModal(false);
            removeModalBackdrop();
            const modalBackdrop = document.querySelector(".modal-backdrop");
            if (modalBackdrop) {
              modalBackdrop.remove();
            }
          })
          .catch((error) => {
            console.error("Error usuario no medificado:", error);
          });
      }
    });
  }
  function activarUsuario(id_usuario) {
    Sweet.confirmacionActivar().then((result) => {
      if (result.isConfirmed) {
        fetch(`http://${portConexion}:3000/usuario/activar/${id_usuario}`, {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            token: localStorage.getItem('token')
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status === 200) {
              Sweet.habilitadoExitoso();
            }
            if (data.status === 401) {
              Sweet.habilitadoFallido();
            }
            listarUsuario();
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  }
  function editarUsuario(id) {
    fetch(`http://${portConexion}:3000/usuario/buscar/${id}`, {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem('token')
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsuarioSeleccionado(data[0]);
        setUpdateModal(true);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
  function actualizarUsuario(id) {
    const validacionExitosa = Validate.validarCampos(".form-update");

    const dataToSend = {
      ...usuarioSeleccionado,
      contrasena_usuario: contrasenaValue
    };


    fetch(`http://${portConexion}:3000/usuario/editar/${id}`, {
      method: "PUT",
      headers: {
        "Content-type": "application/json",
        token: localStorage.getItem('token')
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
        listarUsuario();
        setUpdateModal(false);
        removeModalBackdrop();
        const modalBackdrop = document.querySelector(".modal-backdrop");
        if (modalBackdrop) {
          modalBackdrop.remove();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  return (
    <div>
      <div className="boxBtnContendidoTitulo">
        <div className="btnContenido1">
          <button
            type="button"
            id="modalUsuario"
            className="btn-color btn"
            data-bs-toggle="modal"
            data-bs-target="#staticBackdrop"
            onClick={() => {
              setShowModal(true);
              Validate.limpiar(".limpiar");
              resetFormState();
              handleRegistration();
            }}
          >
            Registrar Usuario
          </button>
        </div>
        <div className="btnContenido22">
          <h2 className="tituloHeaderpp">Lista de Usuarios</h2>
        </div>
        <div className="btnContenido3">
          <div
            className="flex btn-group"
            role="group"
            aria-label="Basic mixed styles example"
          >
            <div className="" title="Descargar Excel">
              <DownloadTableExcel
                filename="Usuarios Detalles Excel"
                sheet="Usuarios"
                currentTableRef={tableRef.current}
              >
                <button type="button" className="btn btn-light">
                  <img src={ExelLogo} className="logoExel" />
                </button>
              </DownloadTableExcel>
            </div>
            <div className="" title="Descargar Pdf">
              <button
                type="button"
                className="btn btn-light"
                onClick={() =>
                  generatePDF(tableRef, {
                    filename: "Usuarios Detalles table.pdf",
                  })
                }
              >
                <img src={PdfLogo} className="logoExel" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container-fluid w-full">
        <table
          id="dtBasicExample"
          className="table table-striped table-hover rouden-3 overflow-hidden shadow table-bordered  display responsive nowrap b-4"
          ref={tableRef}
          cellSpacing={0}
          width="100%"
        >
          <thead className="text-center text-justify">
            <tr>
              <th className="th-sm">#</th>
              <th className="th-sm">Nombre</th>
              <th className="th-sm">Documento</th>
              <th className="th-sm">Correo Electrónico</th>
              <th className="th-sm">Cargo</th>
              <th className="th-sm">Acciones</th>
            </tr>
          </thead>
          <tbody id="listarUsuario" className="text-center cell">
            {usuarios.length === 0 ? (
              <tr>
                <td colSpan={12}>
                  <div className="d-flex justify-content-center">
                    <div className="alert alert-danger text-center mt-4 w-50">
                      <h2>
                        {" "}
                        En este momento no contamos con ningún usuario
                        disponible.😟
                      </h2>
                    </div>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {usuarios.map((element, index) => (
                  <tr key={element.id_usuario}>
                    <td>{index + 1}</td>
                    <td style={{ textTransform: 'capitalize' }}>{element.nombre_usuario}</td>
                    <td>{element.documento_usuario}</td>
                    <td>{element.email_usuario}</td>
                    <td style={{ textTransform: 'capitalize' }}>{element.tipo_usuario}</td>
                    <td className="p-0">
                      {element.estado === 1 ? (
                        <>
                          <button
                            className="btn btn-color mx-2"
                            onClick={() => {
                              setUpdateModal(true);
                              editarUsuario(element.id_usuario);
                              resetFormState2();
                            }}
                            data-bs-toggle="modal"
                            data-bs-target="#staticBackdrop2"
                          >
                            <IconEdit />
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => eliminarUsuario(element.id_usuario)}
                          >
                            {" "}
                            <IconTrash />
                          </button>
                        </>
                      ) : (
                        <button
                          className="btn btn-primary"
                          onClick={() => activarUsuario(element.id_usuario)}
                        >
                          Activar
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        ref={modalUsuarioRef}
        style={{ display: showModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header bg txt-color">
              <h2 className="modal-title fs-5">Registrar Usuario</h2>
              <button
                type="button"
                className="btn-close text-white bg-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="text-center border border-light ">
                <div className="row mb-2">
                  <div className="col">
                    <label htmlFor="nombreUsuario" className="label-bold mb-2">
                      Nombre
                    </label>
                    <input
                      type="text"
                      className="form-control form-empty limpiar"
                      id="nombre_usuario"
                      name="nombreUsuario"
                      placeholder="Ingrese su nombre"
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, Ingresar un nombre valido.
                    </div>
                  </div>
                  <div className="col">
                    <label
                      htmlFor="documentoUsuario"
                      className="label-bold mb-1"
                    >
                      Documento
                    </label>
                    <input
                      type="number"
                      className="form-control form-empty limpiar"
                      id="documento_usuario"
                      name="documentoUsuario"
                      placeholder="Ingrese su documento"
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, Ingresar un documento valido
                    </div>
                  </div>
                </div>

                <div className="row mb-2">
                  <div className="col">
                    <label htmlFor="emailUsuario" className="label-bold mb-2">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control form-empty limpiar"
                      id="email_usuario"
                      name="emailUsuario"
                      placeholder="Ingrese su email"
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, Ingresar un correo valido
                    </div>
                  </div>
                  <div className="col">
                    <label htmlFor="tipoUsuario" className="label-bold mb-2">
                      Cargo
                    </label>
                    <select
                      className="form-select form-control form-empty limpiar"
                      id="tipo_usuario"
                      name="tipoUsuario"
                      defaultValue=""
                    >
                      <option value="">Selecciona un cargo</option>
                      <option value="administrador">Administrador</option>
                      <option value="coadministrador">Co-Administrador</option>
                    </select>
                    <div className="invalid-feedback is-invalid">
                      Por favor, selecciona un cargo
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col-md-12 mb-2">
                    <label
                      htmlFor="contrasenaUsuario"
                      className="label-bold mb-2"
                    >
                      Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control form-empty limpiar"
                        id="contrasena_usuario"
                        name="contrasenaUsuario"
                        placeholder="Ingrese una contraseña"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-secondary"
                          type="button"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <IconEyeOff /> : <IconEye />}
                        </button>
                      </div>
                    </div>
                    <div className="row text-center">
                      <div className="col">
                        {password.length > 0 && !isValidPassword && (
                          <div className="text-danger">
                            La contraseña debe tener al menos 6 caracteres, una
                            mayúscula, una minúscula y un número.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12 pl-2 ">
                    <label
                      htmlFor="confirmarContrasena"
                      className="label-bold mb-2"
                    >
                      Confirmar Contraseña
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control form-empty limpiar"
                        id="confirmar_contrasena"
                        name="confirmarContrasena"
                        placeholder="Confirme su contraseña"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
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
                    </div>
                    <div className="row text-center">
                      <div className="col">
                        {confirmPassword.length > 0 && !passwordMatch && (
                          <div className="text-danger">
                            Las contraseñas no coinciden
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                /*  disabled={!registrationEnabled} */
                className="btn btn-color"
                onClick={registrarUsuario}
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* modal actualizar */}
      <div
        className="modal fade"
        id="staticBackdrop2"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        ref={modalUpdateRef}
        style={{ display: updateModal ? "block" : "none" }}
      >
        <div className="modal-dialog modal-lg modal-dialog-centered d-flex align-items-center">
          <div className="modal-content">
            <div className="modal-header txt-color">
              <h2 className="modal-title fs-5">Actualizar Usuario</h2>
              <button
                type="button"
                className="btn-close text-white bg-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <form className="text-center border border-light ">
                <div className="row mb-2">
                  <div className="col">
                    <label htmlFor="nombre_usuario" className="label-bold mb-2">
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
                    <div className="invalid-feedback is-invalid">
                      Por favor, Ingresar un nombre valido.
                    </div>
                  </div>
                  <div className="col">
                    <label
                      htmlFor="documento_usuario"
                      className="label-bold mb-1"
                    >
                      Documento
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
                      disabled
                    />
                    <input
                      type="text"
                      className="form-control form-update"
                      placeholder="Ingrese su documento"
                      value={usuarioSeleccionado.documento_usuario || ""}
                      name="documento_usuario"
                      onChange={(e) =>
                        setUsuarioSeleccionado({
                          ...usuarioSeleccionado,
                          documento_usuario: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback is-invalid">
                      Por favor, Ingresar un documento valido
                    </div>
                  </div>
                </div>
                <div className="row mb-2">
                  <div className="col">
                    <label htmlFor="email_usuario" className="label-bold mb-2">
                      Correo Electrónico
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
                      type="email"
                      className="form-control form-update"
                      placeholder="Ingrese su email"
                      value={usuarioSeleccionado.email_usuario || ""}
                      name="email_usuario"
                      onChange={(e) =>
                        setUsuarioSeleccionado({
                          ...usuarioSeleccionado,
                          email_usuario: e.target.value,
                        })
                      }
                    />
                    <div className="invalid-feedback is-invalid">
                      Por Favor, Ingresar un correo valido
                    </div>
                  </div>
                  <div className="col">
                    <label htmlFor="tipo_usuario" className="label-bold mb-2">
                      Cargo
                    </label>
                    <select
                      className="form-select form-control limpiar"
                      value={usuarioSeleccionado.tipo_usuario || ""}
                      name="tipo_usuario"
                      onChange={(e) =>
                        setUsuarioSeleccionado({
                          ...usuarioSeleccionado,
                          tipo_usuario: e.target.value,
                        })
                      }
                    >
                      <option value="" disabled>
                        Seleccione un Cargo
                      </option>
                      <option value="administrador">Administrador</option>
                      <option value="coadministrador">Co-Administrador</option>
                    </select>
                  </div>
                </div>
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
              </form>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Cerrar
              </button>
              <button
                type="button"
                className="btn btn-color"
                onClick={() => {
                  actualizarUsuario(usuarioSeleccionado.id_usuario, contrasenaValue);
                }}
              >
                Actualizar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Usuario;
