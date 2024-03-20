

function listarProductos(){
	fetch('http://localhost:3000/producto/listar',
	{
			method:'GET'
	})
	.then(res=>res.json())
	.then(data=>{
			let row = '';
			data.forEach((element, index) => {
					row += `
					<tr>
						<td>${index + 1}</td>
						<td>${element.NombreProducto}</td>
						<td>${element.FechaCaducidad}</td>
						<td>${element.Peso}</td>
						<td>${element.Unidad}</td>
						<td>${element.PrecioIndividual}</td>
						<td>${element.PrecioTotal}</td>
						<td>${element.NombreCategoria }</td>
						<td>${element.UnidadProductiva }</td>
						<td>${element.Descripcion}</td>
					</tr>
					`
			});
		document.getElementById('tableProducto').innerHTML=row;
	})
}
listarProductos();