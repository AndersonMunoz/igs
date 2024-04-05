import React, { useEffect, useRef, useState } from "react";
import "../style/usuarios.css";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Sweet from "../helpers/Sweet";
import Validate from "../helpers/Validate";
import ExelLogo from "../../img/excel.224x256.png";
import PdfLogo from "../../img/pdf.224x256.png";
import esES from "../languages/es-ES.json";
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
import { dataDecript } from "./encryp/decryp";


const Instructores = () => {
	const [instructores, setInstructores] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const modalInstructorRef = useRef(null);
	const [updateModal, setUpdateModal] = useState(false);
	const modalUpdateRef = useRef(null);
	const tableRef = useRef();
	const [instructorSeleccionado, setInstructoreSeleccionado] = useState({});
	const [userRoll, setUserRoll]= useState('');

	useEffect(() => {
		if (instructores.length > 0) {
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
	}, [instructores]);

	const resetFormState = () => {
		const formFields = modalInstructorRef.current.querySelectorAll(
			'.form-control,.form-update,.form-empty'
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
		window.onpopstate = function (event) {
			window.location.reload();
		};

		listarInstructores();
		let roll= (localStorage.getItem("roll"));
		setUserRoll(dataDecript(roll));
	}, []);

	

	function removeModalBackdrop() {
		const modalBackdrop = document.querySelector(".modal-backdrop");
		if (modalBackdrop) {
			modalBackdrop.remove();
		}
	}


	function listarInstructores() {
		fetch(`http://${portConexion}:3000/instructor/listar`, {
			method: "get",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem('token')
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setInstructores(data);
			})
			.catch((e) => {
				console.log(e);
			});
	}
	function registrarInstructor() {
		let nombre_instructor = document.getElementById("nombre_instructor").value;
		let documento_instructor = document.getElementById("documento_instructor").value;

		const validacionExitosa = Validate.validarCampos(".form-empty");

		fetch(`http://${portConexion}:3000/instructor/registrar`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: localStorage.getItem('token')
			},
			body: JSON.stringify({
				nombre_instructor,
				documento_instructor,
			}),
		})
			.then((res) => res.json())
			.then((data) => {
				if (!validacionExitosa) {
					Sweet.registroFallido();
					return;
				}
				if (data.status === 200) {
					Sweet.exito(data.menssage);
					if ($.fn.DataTable.isDataTable(tableRef.current)) {
						$(tableRef.current).DataTable().destroy();
					}
					listarInstructores();
				}
				if (data.status === 409) {
					Sweet.error(data.message);
					return;
				}
				if (data.status !== 200) {
					Sweet.error(data.errors[0].msg);
					return;
				}
				listarInstructores();
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
	function eliminarInstructor(id_instructores) {
		Sweet.confirmacion().then((result) => {
			if (result.isConfirmed) {
				fetch(`http://${portConexion}:3000/instructor/deshabilitar/${id_instructores}`, {
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

						listarInstructores();
						setShowModal(false);
						removeModalBackdrop();
						const modalBackdrop = document.querySelector(".modal-backdrop");
						if (modalBackdrop) {
							modalBackdrop.remove();
						}
					})
					.catch((error) => {
						console.error("Error Instructor no modificado:", error);
					});
			}
		});
	}
	function activarInstructor(id_instructores) {
		Sweet.confirmacionActivar().then((result) => {
			if (result.isConfirmed) {
				fetch(`http://${portConexion}:3000/instructor/activar/${id_instructores}`, {
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
						listarInstructores();
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
		});
	}
	function editarInstructor(id) {
		fetch(`http://${portConexion}:3000/instructor/buscar/${id}`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem('token')
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setInstructoreSeleccionado(data[0]);
				setUpdateModal(true);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	function actualizarInstructor(id) {
		const validacionExitosa = Validate.validarCampos(".form-update");

		const dataToSend = {
			...instructorSeleccionado,
		};


		fetch(`http://${portConexion}:3000/instructor/editar/${id}`, {
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
				listarInstructores();
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


		<>
			<div className="boxBtnContendidoTitulo">
				<div className="btnContenido1">
					{userRoll == "administrador" && (
						<button
						type="button"
						id="modalInstructor"
						className="btn-color btn"
						data-bs-toggle="modal"
						data-bs-target="#staticBackdrop"
						onClick={() => {
							setShowModal(true);
							Validate.limpiar(".limpiar");
							resetFormState();
						}}
					>
						Registrar Instructor
					</button>
					)}
				</div>
				<div className="btnContenido22">
					<h2 className="tituloHeaderpp">Lista de Instructores </h2>
				</div>
				<div className="btnContenido3">
					<div
						className="flex btn-group"
						role="group"
						aria-label="Basic mixed styles example"
					>
						<div className="" title="Descargar Excel">
							<DownloadTableExcel
								filename="instructores Detalles Excel"
								sheet="instructores"
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
										filename: "instructores Detalles table.pdf",
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
					className="table table-striped table-bordered border display responsive nowrap"
					ref={tableRef}
					cellSpacing={0}
					width="100%"
				>
					<thead className="text-center text-justify">
						<tr>
							<th className="th-sm">#</th>
							<th className="th-sm">Nombre Instructor</th>
							<th className="th-sm">Documento Instructor</th>
							<th className="th-sm">Acciones</th>
						</tr>
					</thead>
					<tbody id="listarInstructor" className="cell">
						{instructores.length === 0 ? (
							<tr>
								<td colSpan={12}>
									<div className="d-flex justify-content-center">
										<div className="alert alert-danger text-center mt-4 w-50">
											<h2>
												{" "}
												En este momento no contamos con ningún Instructor
												disponible.😟
											</h2>
										</div>
									</div>
								</td>
							</tr>
						) : (
							<>
								{instructores.map((element, index) => (
									<tr key={element.id_instructores}>
										<td className="text-center">{index + 1}</td>
										<td style={{ textTransform: 'capitalize' }}>{element.nombre_instructor}</td>
										<td>{element.documento_instructor}</td>
										{userRoll == "administrador" ? (
											<>
											<td className="p-0 text-center">
											{element.estado === 1 ? (
												<>
													<button
														className="btn btn-color mx-2"
														onClick={() => {
															setUpdateModal(true);
															editarInstructor(element.id_instructores);
															resetFormState();
														}}
														data-bs-toggle="modal"
														data-bs-target="#staticBackdrop2"
													>
														<IconEdit />
													</button>
													<button
														className="btn btn-danger"
														onClick={() => eliminarInstructor(element.id_instructores)}
													>
														{" "}
														<IconTrash />
													</button>
												</>
											) : (
												<button
													className="btn btn-primary"
													onClick={() => activarInstructor(element.id_instructores)}
												>
													Activar
												</button>
											)}
										</td>
											</>
										):(
											<>
											<td className="text-center">No disponible</td>
											</>
										)}
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
				ref={modalInstructorRef}
				style={{ display: showModal ? "block" : "none" }}
			>
				<div className="modal-dialog modal-l modal-dialog-centered
				 d-flex align-items-center">
					<div className="modal-content">
						<div className="modal-header bg txt-color">
							<h2 className="modal-title fs-5">Registrar Instructor</h2>
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
										<label htmlFor="nombreInstructor" className="label-bold mb-2">
											Nombre Instructor
										</label>
										<input
											type="text"
											className="form-control form-empty limpiar"
											id="nombre_instructor"
											name="nombreInstructor"
											placeholder="Ingrese un nombre"
										/>
										<div className="invalid-feedback is-invalid">
											Por favor, Ingresar un nombre valido.
										</div>
									</div>
								</div>
								<div className="row mb-2">
									<div className="col">
										<label
											htmlFor="documentoInstructor"
											className="label-bold mb-1"
										>
											Documento Instructor
										</label>
										<input
											type="number"
											className="form-control form-empty limpiar"
											id="documento_instructor"
											name="documentoInstructor"
											placeholder="Ingrese una ficha"
										/>
										<div className="invalid-feedback is-invalid">
											Por favor, Ingresa un documento valido
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
								onClick={registrarInstructor}
							>
								Registrar
							</button>
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
				aria-labelledby="staticBackdropLabel"
				aria-hidden="true"
				ref={modalUpdateRef}
				style={{ display: updateModal ? "block" : "none" }}
			>
				<div className="modal-dialog modal-l modal-dialog-centered d-flex align-items-center">
					<div className="modal-content">
						<div className="modal-header txt-color">
							<h2 className="modal-title fs-5">Actualizar Instructor</h2>
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
										<label htmlFor="nombre_instructor" className="label-bold mb-2">
											Nombre Instructor
										</label>
										<input
											type="hidden"
											value={instructorSeleccionado.id_instructores || ""}
											onChange={(e) =>
												setInstructoreSeleccionado({
													...instructorSeleccionado,
													id_instructores: e.target.value,
												})
											}
										/>
										<input
											type="text"
											className="form-control form-update"
											placeholder="Ingrese nombre"
											value={instructorSeleccionado.nombre_instructor || ""}
											name="nombre_instructor"
											onChange={(e) =>
												setInstructoreSeleccionado({
													...instructorSeleccionado,
													nombre_instructor: e.target.value,
												})
											}
										/>
										<div className="invalid-feedback is-invalid">
											Por favor, Ingresar un nombre valido.
										</div>
									</div>
								</div>
								<div className="row mb-2">
									<div className="col">
										<label
											htmlFor="idFicha"
											className="label-bold mb-1"
										>
											Documento Instructor
										</label>
										<input
											type="hidden"
											value={instructorSeleccionado.id_instructores || ""}
											onChange={(e) =>
												setInstructoreSeleccionado({
													...instructorSeleccionado,
													id_instructores: e.target.value,
												})
											}
											disabled
										/>
										<input
											type="number"
											className="form-control form-update"
											placeholder="Ingrese su ficha"
											value={instructorSeleccionado.documento_instructor || ""}
											name="idFicha"
											onChange={(e) =>
												setInstructoreSeleccionado({
													...instructorSeleccionado,
													documento_instructor: e.target.value,
												})
											}
										/>
										<div className="invalid-feedback is-invalid">
											Por favor, Ingresar una docuemento valido
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
									actualizarInstructor(instructorSeleccionado.id_instructores);
								}}
							>
								Actualizar
							</button>
						</div>
					</div>
				</div >
			</div >
		</>

	)

}


export default Instructores;