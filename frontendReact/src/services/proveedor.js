function listarProveedor() {
    fetch('http://localhost:3000/proveedor/listar', {
        method: 'get',
        headers: {
            "content-type": "application/json"
        }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            let row = '';
            data.forEach(element => {
                row += `<tr>
                  <td>${element.id_proveedores }</td>        
                  <td>${element.nombre_categoria}</td>        
                  <td><a href="javaScript:editarCategoria(${element.id_categoria})">Editar</a></td>           
                  <td><a href="javaScript:eliminarCategoria(${element.id_categoria})">Eliminar</a></td>           
                </tr>`
                document.getElementById('tableCatategoria').innerHTML = row;
            });
        })
        .catch(e => { console.log(e); })
}
listarProveedor()
