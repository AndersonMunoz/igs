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


const Titulados = () => {
	const [titulados, setTitulados] = useState([]);
	const [showModal, setShowModal] = useState(false);
	const modalTituladoRef = useRef(null);
	const [updateModal, setUpdateModal] = useState(false);
	const modalUpdateRef = useRef(null);
	const tableRef = useRef();
	const [tituladoSeleccionado, setTituladoSeleccionado] = useState({});

	useEffect(() => {
		if (titulados.length > 0) {
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
	}, [titulados]);

	const resetFormState = () => {
		const formFields = modalTituladoRef.current.querySelectorAll(
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

		listarTitulados();

	}, []);

	function removeModalBackdrop() {
		const modalBackdrop = document.querySelector(".modal-backdrop");
		if (modalBackdrop) {
			modalBackdrop.remove();
		}
	}


	function listarTitulados() {
		fetch(`http://${portConexion}:3000/titulado/listar`, {
			method: "get",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem('token')
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setTitulados(data);
			})
			.catch((e) => {
				console.log(e);
			});
	}
	function registrarTitulado() {
		let nombre_titulado = document.getElementById("nombre_titulado").value;
		let id_ficha = document.getElementById("ficha_titulado").value;

		const validacionExitosa = Validate.validarCampos(".form-empty");

		fetch(`http://${portConexion}:3000/titulado/registrar`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				token: localStorage.getItem('token')
			},
			body: JSON.stringify({
				nombre_titulado,
				id_ficha,
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
					listarTitulados();
				}
				if (data.status === 409) {
					Sweet.error(data.message);
					return;
				}
				if (data.status !== 200) {
					Sweet.error(data.error.errors[0].msg);
					return;
				}
				listarTitulados();
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
	function eliminarTitulado(id_titulado) {
		Sweet.confirmacion().then((result) => {
			if (result.isConfirmed) {
				fetch(`http://${portConexion}:3000/titulado/deshabilitar/${id_titulado}`, {
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

						listarTitulados();
						setShowModal(false);
						removeModalBackdrop();
						const modalBackdrop = document.querySelector(".modal-backdrop");
						if (modalBackdrop) {
							modalBackdrop.remove();
						}
					})
					.catch((error) => {
						console.error("Error titulado no medificado:", error);
					});
			}
		});
	}
	function activarTitulado(id_titulado) {
		Sweet.confirmacionActivar().then((result) => {
			if (result.isConfirmed) {
				fetch(`http://${portConexion}:3000/titulado/activar/${id_titulado}`, {
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
						listarTitulados();
					})
					.catch((error) => {
						console.error("Error:", error);
					});
			}
		});
	}
	function editarTitulado(id) {
		fetch(`http://${portConexion}:3000/titulado/buscar/${id}`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem('token')
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setTituladoSeleccionado(data[0]);
				setUpdateModal(true);
			})
			.catch((error) => {
				console.error("Error:", error);
			});
	}

	function actualizarTitulado(id) {
		const validacionExitosa = Validate.validarCampos(".form-update");

		const dataToSend = {
			...tituladoSeleccionado,
		};


		fetch(`http://${portConexion}:3000/titulado/editar/${id}`, {
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
				listarTitulados();
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
					<button
						type="button"
						id="modalTitulado"
						className="btn-color btn"
						data-bs-toggle="modal"
						data-bs-target="#staticBackdrop"
						onClick={() => {
							setShowModal(true);
							Validate.limpiar(".limpiar");
							resetFormState();
						}}
					>
						Registrar Titulado
					</button>
				</div>
				<div className="btnContenido22">
					<h2 className="tituloHeaderpp">Lista de Titulados </h2>
				</div>
				<div className="btnContenido3">
					<div
						className="flex btn-group"
						role="group"
						aria-label="Basic mixed styles example"
					>
						<div className="" title="Descargar Excel">
							<DownloadTableExcel
								filename="Titulados Detalles Excel"
								sheet="UsuaTituladosrios"
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
										filename: "Titulados Detalles table.pdf",
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
							<th className="th-sm">Nombre Titulado</th>
							<th className="th-sm">Ficha Titulado</th>
							<th className="th-sm">Acciones</th>
						</tr>
					</thead>
					<tbody id="listarTitulado" className="cell">
						{titulados.length === 0 ? (
							<tr>
								<td colSpan={12}>
									<div className="d-flex justify-content-center">
										<div className="alert alert-danger text-center mt-4 w-50">
											<h2>
												{" "}
												En este momento no contamos con ningún Titulado
												disponible.😟
											</h2>
										</div>
									</div>
								</td>
							</tr>
						) : (
							<>
								{titulados.map((element, index) => (
									<tr key={element.id_titulado}>
										<td className="text-center">{index + 1}</td>
										<td style={{ textTransform: 'capitalize' }}>{element.nombre_titulado}</td>
										<td>{element.id_ficha}</td>
										{<td className="p-0 text-center">
											{element.estado === 1 ? (
												<>
													<button
														className="btn btn-color mx-2"
														onClick={() => {
															setUpdateModal(true);
															editarTitulado(element.id_titulado);
															resetFormState();
														}}
														data-bs-toggle="modal"
														data-bs-target="#staticBackdrop2"
													>
														<IconEdit />
													</button>
													<button
														className="btn btn-danger"
														onClick={() => eliminarTitulado(element.id_titulado)}
													>
														{" "}
														<IconTrash />
													</button>
												</>
											) : (
												<button
													className="btn btn-primary"
													onClick={() => activarTitulado(element.id_titulado)}
												>
													Activar
												</button>
											)}
										</td>}
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
				ref={modalTituladoRef}
				style={{ display: showModal ? "block" : "none" }}
			>
				<div className="modal-dialog modal-l modal-dialog-centered
				 d-flex align-items-center">
					<div className="modal-content">
						<div className="modal-header bg txt-color">
							<h2 className="modal-title fs-5">Registrar Titulado</h2>
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
										<label htmlFor="nombreTitulado" className="label-bold mb-2">
											Titulado
										</label>
										<input
											type="text"
											className="form-control form-empty limpiar"
											id="nombre_titulado"
											name="nombreTitulado"
											placeholder="Ingrese un titulado"
										/>
										<div className="invalid-feedback is-invalid">
											Por favor, Ingresar un nombre valido.
										</div>
									</div>
								</div>
								<div className="row mb-2">
									<div className="col">
										<label
											htmlFor="fichaTitulado"
											className="label-bold mb-1"
										>
											Ficha Titulado
										</label>
										<input
											type="number"
											className="form-control form-empty limpiar"
											id="ficha_titulado"
											name="fichaTitulado"
											placeholder="Ingrese una ficha"
										/>
										<div className="invalid-feedback is-invalid">
											Por favor, Ingresar una ficha valida
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
								onClick={registrarTitulado}
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
							<h2 className="modal-title fs-5">Actualizar Titulado</h2>
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
										<label htmlFor="nombre_titulado" className="label-bold mb-2">
											Nombre Titulado
										</label>
										<input
											type="hidden"
											value={tituladoSeleccionado.id_titulado || ""}
											onChange={(e) =>
												setTituladoSeleccionado({
													...tituladoSeleccionado,
													id_titulado: e.target.value,
												})
											}
										/>
										<input
											type="text"
											className="form-control form-update"
											placeholder="Ingrese nombre de titulado"
											value={tituladoSeleccionado.nombre_titulado || ""}
											name="nombre_titulado"
											onChange={(e) =>
												setTituladoSeleccionado({
													...tituladoSeleccionado,
													nombre_titulado: e.target.value,
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
											Ficha Titulado
										</label>
										<input
											type="hidden"
											value={tituladoSeleccionado.id_titulado || ""}
											onChange={(e) =>
												setTituladoSeleccionado({
													...tituladoSeleccionado,
													id_titulado: e.target.value,
												})
											}
											disabled
										/>
										<input
											type="number"
											className="form-control form-update"
											placeholder="Ingrese su ficha"
											value={tituladoSeleccionado.id_ficha || ""}
											name="idFicha"
											onChange={(e) =>
												setTituladoSeleccionado({
													...tituladoSeleccionado,
													id_ficha: e.target.value,
												})
											}
										/>
										<div className="invalid-feedback is-invalid">
											Por favor, Ingresar una ficha valida
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
									actualizarTitulado(tituladoSeleccionado.id_titulado);
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


export default Titulados;