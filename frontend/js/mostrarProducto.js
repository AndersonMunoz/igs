

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
						<td>${element.fk_id_tipo_producto}</td>
						<td>${element.fecha_caducidad_producto}</td>
						<td>${element.cantidad_peso_producto}</td>
						<td>${element.unidad_peso_producto}</td>
						<td>${element.precio_producto}</td>
						<td>${element.fk_id_categoria }</td>
						<td>${element.fk_id_up }</td>
						<td>${element.descripcion_producto}</td>
						<td>${element.estado}</td>
					</tr>
					`
			});
		document.getElementById('tableProducto').innerHTML=row;
	})
}
listarProductos();