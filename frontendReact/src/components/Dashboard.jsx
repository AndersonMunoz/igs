import React, { useEffect, useState } from "react";
import { Chart as Chartjs } from 'chart.js/auto';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import userPng from '../../img/53-532960_person-icon-png.png'
import "../style/dashboardContent.css";

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
			<div>
				<div className="container-wrapper">
					<div className="small-container1">
						<p className="usuarioTiti">Usuarios Registrados: {usuariosCount}</p>
						<img src={userPng} className="iconoUsuarioPng" alt="" />
					</div>
					<div className="small-container2">
						<p>Cantidad </p>
					</div>
					<div className="small-container3">
						<p>Contenedor 3</p>
					</div>
					<div className="small-container4">
						<p>Contenedor 4</p>
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
									},
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
		</div>
	);
};

export default Dashboard;
