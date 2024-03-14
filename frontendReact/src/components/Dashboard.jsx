import React, { useEffect, useState } from "react";
import { Chart as Chartjs } from "chart.js/auto";
import { Bar, Doughnut } from "react-chartjs-2";
import "../style/dashboardContent.css";
import { Outlet, Link } from "react-router-dom";
import { IconArrowBigRightFilled } from "@tabler/icons-react";
import { dataDecript } from "./encryp/decryp";
import portConexion from "../const/portConexion";

const Dashboard = () => {
	const [usuariosCount, setUsuariosCount] = useState(0);
	const [entradaSalida, setEntradaSalida] = useState({
		entraron: 0,
		salieron: 0,
	});
	const [categoriasCount, setCategoriasCount] = useState([]);
	const [userRoll, setUserRoll] = useState("");
	// useEffect para obtener datos del backend al cargar el componente
	useEffect(() => {
		setUserRoll(dataDecript(localStorage.getItem("roll")));
		obtenerValorTotalProductos();
		listarUsuario();
		listarCountCategoria();
	}, []);
		// Funciones para obtener la cantidad de categorias
	function listarCountCategoria() {
		fetch(`http://${portConexion}:3000/categoria/listarCountCategoria`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setCategoriasCount(data);
			})
			.catch((e) => {
				console.log(e);
			});
	}
		// Funciones para obtener datos de las facturas
	function obtenerValorTotalProductos() {
		fetch(`http://${portConexion}:3000/facturamovimiento/listarEntradaSalida`, {
			method: "GET",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setEntradaSalida(data);
			})
			.catch((e) => {
				console.log(e);
			});
	}
		// Funciones para obtener lla cantidad de usuarios
	function listarUsuario() {
		fetch(`http://${portConexion}:3000/usuario/listarCount`, {
			method: "get",
			headers: {
				"Content-type": "application/json",
				token: localStorage.getItem("token"),
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setUsuariosCount(data.count);
			})
			.catch((e) => {
				console.log(e);
			});
	}
		// Colores para los gráficos
	const barColors = [
		"rgba(54, 162, 235, 0.5)",
		"rgba(255, 99, 132, 0.5)",
		"rgba(255, 206, 86, 0.5)",
		"rgba(75, 192, 192, 0.5)",
		"rgba(153, 102, 255, 0.5)",
		"rgba(255, 159, 64, 0.5)",
		"rgba(255, 99, 132, 0.5)",
		"rgba(220, 20, 60, 0.5)",
		"rgba(124, 252, 0, 0.5)",
		"rgba(255, 215, 0, 0.5)",
		"rgba(0, 255, 255, 0.5)",
		"rgba(128, 0, 128, 0.5)",
		"rgba(255, 165, 0, 0.5)",
		"rgba(0, 128, 0, 0.5)",
		"rgba(255, 0, 255, 0.5)",
		"rgba(0, 255, 0, 0.5)",
		"rgba(255, 20, 147, 0.5)",
		"rgba(70, 130, 180, 0.5)",
		"rgba(255, 140, 0, 0.5)",
		"rgba(0, 0, 255, 0.5)",
	];
	// Colores para los gráficos
	const doughnutColors = [
		"rgba(255, 99, 132, 0.5)",
		"rgba(54, 162, 235, 0.5)",
		"rgba(255, 206, 86, 0.5)",
		"rgba(75, 192, 192, 0.5)",
		"rgba(153, 102, 255, 0.5)",
		"rgba(255, 159, 64, 0.5)",
		"rgba(255, 99, 132, 0.5)",
		"rgba(220, 20, 60, 0.5)",
		"rgba(124, 252, 0, 0.5)",
		"rgba(255, 215, 0, 0.5)",
		"rgba(0, 255, 255, 0.5)",
		"rgba(128, 0, 128, 0.5)",
		"rgba(255, 165, 0, 0.5)",
		"rgba(0, 128, 0, 0.5)",
		"rgba(255, 0, 255, 0.5)",
		"rgba(0, 255, 0, 0.5)",
		"rgba(255, 20, 147, 0.5)",
		"rgba(70, 130, 180, 0.5)",
		"rgba(255, 140, 0, 0.5)",
		"rgba(0, 0, 255, 0.5)",
	];

	return (
		<div className="dashboard-container mt-4">
			<div className="container-wrapper">
				<div className="small-container1">
					<div className="contInterno contcolor">
						<span className="usuarioTitiii">
							Usuarios Registrados: {usuariosCount}
						</span>
					</div>
					<div className="contInterno2 contcolor">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="ssssIcono"
							fill="#ffffff"
							viewBox="0 0 640 512"
						>
							<path d="m96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112s-50.1-112-112-112-112 50.1-112 112 50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3c-63.6 0-115.2 51.6-115.2 115.2v28.8c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4c-11.6-11.5-27.5-18.6-45.1-18.6h-64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z" />
						</svg>
					</div>
					{userRoll == "administrador" ? (
						<Link className="linkContenido linkColor" to="/usuario">
							<div className="tamañoLateral">
								<span className="">Ver Usuarios</span>
								<IconArrowBigRightFilled className="iconosDashboard" />
							</div>
						</Link>
					) : (
						<div className="linkContenido linkColor">
							<div className="tamañoLateral">
								<span className="">Usuarios</span>
							</div>
						</div>
					)}
				</div>
				<div className="small-container2">
					<div className="contInterno contcolor1"></div>
					<div className="contInterno2 contcolor1">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="ssssIcono333"
							width="80"
							height="80"
							focusable="false"
							viewBox="0 0 16 16"
						>
							<path
								fill="#ffffff"
								d="M15.5 11a.5.5 0 01.5.5 2.5 2.5 0 01-2.336 2.495L13.5 14H9.707l1.147 1.146a.5.5 0 01.057.638l-.057.07a.5.5 0 01-.638.057l-.07-.057-2-2a.5.5 0 01-.057-.638l.057-.07 2-2a.5.5 0 01.765.638l-.057.07L9.707 13H13.5a1.5 1.5 0 001.5-1.5.5.5 0 01.5-.5zM6 0a6 6 0 015.917 7H10.9A5 5 0 107 10.9v1.017A6 6 0 116 0zm7.784 6.089l.07.057 2 2a.5.5 0 01.057.638l-.057.07-2 2a.5.5 0 01-.765-.638l.057-.07L14.293 9H10.5A1.5 1.5 0 009 10.5a.5.5 0 11-1 0 2.5 2.5 0 012.336-2.495L10.5 8l3.793-.001-1.147-1.145a.5.5 0 01-.057-.638l.057-.07a.5.5 0 01.638-.057zM6.5 2a.5.5 0 01.492.41L7 2.5v4a.5.5 0 01-.41.492L6.5 7h-3a.5.5 0 01-.09-.992L3.5 6H6V2.5a.5.5 0 01.41-.492L6.5 2z"
							/>
						</svg>
					</div>
					<Link className="linkContenido linkColor2" to="/movimiento">
						<div className="tamañoLateral">
							<span className="">Ver Ultimos movimientos</span>
							<IconArrowBigRightFilled className="iconosDashboard" />
						</div>
					</Link>
				</div>
				<div className="small-container3">
					<div className="contInterno contcolor2"></div>
					<div className="contInterno2 contcolor2">
						<svg
							fill="none"
							height="100"
							viewBox="0 0 48 48"
							width="100"
							className="ssssIcono"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g fill="#ffffff">
								<path d="m12 5c0-.55228.4477-1 1-1s1 .44772 1 1v6c0 .5523-.4477 1-1 1s-1-.4477-1-1z" />
								<path d="m28 5c0-.55228.4477-1 1-1s1 .44772 1 1v6c0 .5523-.4477 1-1 1s-1-.4477-1-1z" />
								<g clipRule="evenodd" fillRule="evenodd">
									<path d="m14 23h-2v2h2zm-2-2c-1.1046 0-2 .8954-2 2v2c0 1.1046.8954 2 2 2h2c1.1046 0 2-.8954 2-2v-2c0-1.1046-.8954-2-2-2z" />
									<path d="m22 23h-2v2h2zm-2-2c-1.1046 0-2 .8954-2 2v2c0 1.1046.8954 2 2 2h2c1.1046 0 2-.8954 2-2v-2c0-1.1046-.8954-2-2-2z" />
									<path d="m30 23h-2v2h2zm-2-2c-1.1046 0-2 .8954-2 2v2c0 1.1046.8954 2 2 2h2c1.1046 0 2-.8954 2-2v-2c0-1.1046-.8954-2-2-2z" />
									<path d="m14 31h-2v2h2zm-2-2c-1.1046 0-2 .8954-2 2v2c0 1.1046.8954 2 2 2h2c1.1046 0 2-.8954 2-2v-2c0-1.1046-.8954-2-2-2z" />
									<path d="m22 31h-2v2h2zm-2-2c-1.1046 0-2 .8954-2 2v2c0 1.1046.8954 2 2 2h2c1.1046 0 2-.8954 2-2v-2c0-1.1046-.8954-2-2-2z" />
									<path d="m9 10h24c1.1046 0 2 .8954 2 2v16c.6906 0 1.3608.0875 2 .252v-16.252c0-2.20914-1.7909-4-4-4h-24c-2.20914 0-4 1.79086-4 4v24c0 2.2091 1.79086 4 4 4h19.0703c-.3581-.619-.6356-1.2905-.8183-2h-18.252c-1.10457 0-2-.8954-2-2v-24c0-1.1046.89543-2 2-2z" />
								</g>
								<path d="m5 12c0-2.20914 1.79086-4 4-4h24c2.2091 0 4 1.79086 4 4v7h-32z" />
								<path
									clipRule="evenodd"
									d="m33 10h-24c-1.10457 0-2 .8954-2 2v5h28v-5c0-1.1046-.8954-2-2-2zm-24-2c-2.20914 0-4 1.79086-4 4v7h32v-7c0-2.20914-1.7909-4-4-4z"
									fillRule="evenodd"
								/>
								<path
									clipRule="evenodd"
									d="m36 19h-30v-2h30z"
									fillRule="evenodd"
								/>
								<path
									clipRule="evenodd"
									d="m35 42c3.3137 0 6-2.6863 6-6s-2.6863-6-6-6-6 2.6863-6 6 2.6863 6 6 6zm0 2c4.4183 0 8-3.5817 8-8s-3.5817-8-8-8-8 3.5817-8 8 3.5817 8 8 8z"
									fillRule="evenodd"
								/>
								<path
									clipRule="evenodd"
									d="m35 31.1787c.5523 0 1 .4477 1 1v4.2981l2.4515 1.7017c.4537.3149.5662.938.2512 1.3917-.3149.4537-.938.5662-1.3917.2513l-3.311-2.2983v-5.3445c0-.5523.4477-1 1-1z"
									fillRule="evenodd"
								/>
							</g>
						</svg>
					</div>
					<Link className="linkContenido linkColor3" to="/producto/caducar">
						<div className="tamañoLateral">
							<span className="">Ver Productos a caducar</span>
							<IconArrowBigRightFilled className="iconosDashboard" />
						</div>
					</Link>
				</div>
				<div className="small-container4">
					<div className="contInterno contcolor3"></div>
					<div className="contInterno2 contcolor3">
						<svg
							fill="none"
							height="48"
							className="ssssIcono"
							viewBox="0 0 48 48"
							width="48"
							xmlns="http://www.w3.org/2000/svg"
						>
							<g fill="#ffffff">
								<path
									clipRule="evenodd"
									d="m7.06486 17.3876c-1.1217-1.0266-1.88764-2.6925-2.03775-5.3836-.03076-.5514.42481-1.0056.97701-.9959 1.67512.0293 2.95795.1439 3.93759.4328.41979-1.0885 1.25719-2.11633 2.51209-3.05534.3232-.24186.7694-.24186 1.0926 0 1.2652.9467 2.1059 1.98374 2.5223 3.08214 1.0088-.3391 2.3019-.438 3.93-.4614.5522-.0079 1.0052.4463.9744.9977-.1501 2.6911-.916 4.357-2.0377 5.3835.5477.408.8652 1.0927.7487 1.833-.2771 1.7595-.7554 4.469-1.508 7.7795h-6.176v2h5.7046c-.7509 3.0755-1.7206 6.5554-2.9573 10.209-.583 1.7224-2.9115 1.7224-3.4945 0-.4855-1.4344-.9299-2.8421-1.33608-4.209h2.08328v-2h-2.65913c-.94571-3.3914-1.64966-6.4697-2.16103-9h3.82016v-2h-4.20706c-.20029-1.0846-.35727-2.0205-.4768-2.7795-.11658-.7403.20094-1.425.74862-1.8329zm7.13374-5.211.6824 1.8003 1.825-.6135c.5032-.1691 1.184-.2701 2.1538-.3209-.2968 1.9321-1.0122 2.7481-1.6643 3.1699-.9315.6024-2.2887.7857-4.1655.7876h-.0598c-1.8767-.0019-3.23397-.1852-4.16549-.7876-.65148-.4214-1.36612-1.2363-1.66343-3.1644 1.00073.0547 1.71303.1574 2.23468.3112l1.76834.5215.6634-1.72c.1907-.4943.5589-1.0492 1.1924-1.6342.6402.5912 1.0095 1.1517 1.1985 1.6501z"
									fillRule="evenodd"
								/>
								<path
									clipRule="evenodd"
									d="m33.7071 13.7071c-1.9729 1.9729-2.1651 4.7274-1.0563 7.3203 4.8547-3.1784 10.3492.7524 10.3492 6.9726 0 5.5228-4.9249 10-11 10s-11-4.4772-11-10c0-5.7923 4.7646-9.5994 9.3403-7.5292-.7813-2.8005-.3768-5.8486 1.9526-8.1779zm6.263 16.5354c.134-.5358-.1918-1.0787-.7276-1.2127-.5358-.1339-1.0787.1918-1.2126.7276-.4105 1.6417-1.6307 2.862-3.2724 3.2724-.5358.134-.8616.6769-.7276 1.2127.1339.5358.6768.8616 1.2126.7276 2.3583-.5896 4.1381-2.3693 4.7276-4.7276z"
									fillRule="evenodd"
								/>
								<path d="m34 18c3 0 5-2 5-5-3 0-5 2-5 5z" />
							</g>
						</svg>
					</div>
					<Link className="linkContenido linkColor4" to="/inventario">
						<div className="tamañoLateral">
							<span className="">Ver Inventario</span>
							<IconArrowBigRightFilled className="iconosDashboard" />
						</div>
					</Link>
				</div>
			</div>

			
			<div className="container-wrapper2">
				<div className="conteEstadistica1">
					<Doughnut
						data={{
							labels: categoriasCount.map((count) => count.Categoria),
							datasets: [
								{
									label: "Categorias",
									data: categoriasCount.map(
										(count) => count.CantidadTiposProductos
									),
									backgroundColor: doughnutColors,
								},
							],
						}}
						options={{
							responsive: true,
							plugins: {
								legend: {
									position: "top",
								},
								title: {
									display: true,
									text: "Categorías",
								},
							},
						}}
					/>
				</div>
				<div className="conteEstadistica2">
					<Bar
						data={{
							labels: ["Entraron", "Salieron"],
							datasets: [
								{
									label: "Cantidad de Productos",
									data: [entradaSalida.entraron, entradaSalida.salieron],
									backgroundColor: barColors,
									borderWidth: 1,
								},
							],
						}}
						options={{
							responsive: true,
							plugins: {
								title: {
									display: true,
									text: "Productos Entrados y Salidos",
								},
							},
							events: [
								"mousemove",
								"mouseout",
								"click",
								"touchstart",
								"touchmove",
							],
							onClick: (event, elements) => {
								if (elements.length > 0) {
									const index = elements[0].index;
									if (index === 0) {
										window.location.href = "/movimiento/entrada";
									} else if (index === 1) {
										window.location.href = "/movimiento/salida";
									}
								}
							},
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
