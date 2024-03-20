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
	const modalUsuarioRef = useRef(null);
	const [updateModal, setUpdateModal] = useState(false);
	const modalUpdateRef = useRef(null);
	const tableRef = useRef();

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

	useEffect(() => {
		window.onpopstate = function (event) {
			window.location.reload();
		};

		listarTitulados();

		console.log(listarTitulados())
	}, []);


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
				console.log(data)
			})
			.catch((e) => {
				console.log(e);
			});
	}



	return (


		<>
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
					className="table table-striped table-bordered border display responsive nowrap b-4"
					ref={tableRef}
					cellSpacing={0}
					width="100%"
				>
					<thead className="text-center text-justify">
						<tr>
							<th className="th-sm">#</th>
							<th className="th-sm">Nombre</th>
							<th className="th-sm">Ficha</th>
							<th className="th-sm">Acciones</th>
						</tr>
					</thead>
					<tbody id="listarUsuario" className="text-center cell">
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
										<td>{index + 1}</td>
										<td style={{ textTransform: 'capitalize' }}>{element.nombre_titulado}</td>
										<td>{element.id_ficha}</td>
										{/* <td className="p-0">
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
										</td> */}
									</tr>
								))}
							</>
						)}
					</tbody>
				</table>
			</div>
		</>

	)

}


export default Titulados;