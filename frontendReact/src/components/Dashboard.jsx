import React, { useEffect, useState } from "react";
import { Chart as Chartjs } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import userPng from '../../img/53-532960_person-icon-png.png'
import "../style/dashboardContent.css";
import { Outlet, Link } from "react-router-dom";
import { IconArrowBigRight } from '@tabler/icons-react';

const Dashboard = () => {
	const [productos, setProductos] = useState([]);
	const [usuariosCount, setUsuariosCount] = useState(0);

	useEffect(() => {
		listarProducto();
		listarUsuario();
	}, []);

	function listarProducto() {
		fetch("http://localhost:3000/producto/listar", {
			method: "GET",
			headers: {
				"Content-type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setProductos(data);
				console.log(data);
			})
			.catch((e) => {
				console.log(e);
			});
	}
	function listarUsuario() {
		fetch("http://localhost:3000/usuario/listarCount", {
			method: "get",
			headers: {
				"Content-type": "application/json",
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
	const barColors = [
		'rgba(255, 99, 132, 0.5)',
		'rgba(54, 162, 235, 0.5)',
		'rgba(255, 206, 86, 0.5)',
		'rgba(75, 192, 192, 0.5)',
		'rgba(153, 102, 255, 0.5)',
		'rgba(255, 159, 64, 0.5)',
		'rgba(255, 99, 132, 0.5)',
	];

	const doughnutColors = [
		'rgba(255, 99, 132, 0.5)',
		'rgba(54, 162, 235, 0.5)',
		'rgba(255, 206, 86, 0.5)',
		'rgba(75, 192, 192, 0.5)',
		'rgba(153, 102, 255, 0.5)',
		'rgba(255, 159, 64, 0.5)',
		'rgba(255, 99, 132, 0.5)',
	];

	return (
		<div className="dashboard-container">

			<div className="container-wrapper">
				<div className="small-container1">
					<div className="contInterno">
						<p className="usuarioTiti">Usuarios Registrados: {usuariosCount}</p>
					</div>
					<div className="contInterno2">
						<svg xmlns="http://www.w3.org/2000/svg" className="ssssIcono" fill="#ffffff" viewBox="0 0 640 512"><path d="m96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm32 32h-64c-17.6 0-33.5 7.1-45.1 18.6 40.3 22.1 68.9 62 75.1 109.4h66c17.7 0 32-14.3 32-32v-32c0-35.3-28.7-64-64-64zm-256 0c61.9 0 112-50.1 112-112s-50.1-112-112-112-112 50.1-112 112 50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3c-63.6 0-115.2 51.6-115.2 115.2v28.8c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zm-223.7-13.4c-11.6-11.5-27.5-18.6-45.1-18.6h-64c-35.3 0-64 28.7-64 64v32c0 17.7 14.3 32 32 32h65.9c6.3-47.4 34.9-87.3 75.2-109.4z" />
						</svg>
					</div>
					<Link className="linkContenido" to="/usuario">
						<div className="tamañoLateral">
							<span className="">Ver Usuarios</span>
							<IconArrowBigRight className="iconosDashboard" />
						</div>

					</Link>

				</div>
				<div className="small-container2">
					<div className="contInterno">

					</div>
					<div className="contInterno2">

					</div>
					<div className="linkContenido">

					</div>
				</div>
				<div className="small-container3">
					<div className="contInterno">

					</div>
					<div className="contInterno2">

					</div>
					<div className="linkContenido">

					</div>
				</div>
				<div className="small-container4">
					<div className="contInterno">

					</div>
					<div className="contInterno2">

					</div>
					<div className="linkContenido">

					</div>
				</div>


			</div>
			<div className="container-wrapper2">
				<div className="conteEstadistica1">
					<Doughnut className="sssss12"
						data={{
							labels: productos.map(producto => producto.NombreProducto),
							datasets: [
								{
									label: "Productos",
									data: productos.map(producto => producto.Peso),
									backgroundColor: doughnutColors,
								}
							]
						}}
					/>
				</div>
				<div className="conteEstadistica2">
					<Line
						data={{
							labels: productos.map(producto => producto.NombreProducto),
							datasets: [
								{
									label: "Productos",
									data: productos.map(producto => producto.Peso),
									backgroundColor: doughnutColors,
								},
								{
									label: "Productos",
									data: productos.map(producto => producto.Peso),
									backgroundColor: doughnutColors,
								},
							]
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
