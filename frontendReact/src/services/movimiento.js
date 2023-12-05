function listarMovimiento(){
    fetch('http://localhost:3000/facturamovimiento/listar',{
      method: "get",
      headers:{
        "content-type":"application/json"
      }
    })
    .then(res=>res.json())
    .then(data=>{
      console.log(data);
      let row = '';
      data.forEach(element => {
        row += `<tr>
                  <td>${element.fk_id_producto}</td>        
                  <td>${element.fecha_movimiento}</td>        
                  <td>${element.tipo_movimiento}</td>        
                  <td>${element.cantidad_peso_movimiento_movimiento}</td>        
                  <td>${element.unidad_peso_movimiento}</td>        
                  <td>${element.precio_movimiento}</td>        
                  <td>${element.estado_producto_movimientoo}</td>        
                  <td>${element.nota_factura}</td>        
                  <td>${element.fecha_caducidad}</td>        
                  <td><a data-bs-toggle="modal" data-bs-target="#exampleModal2" href="javaScript:editarMovimiento(${element.id_factura})">Editar</a></td>           
                </tr>`
        document.getElementById('tableMovimiento').innerHTML = row;
      });
    })
    .catch(e => {console.log(e);})
  }
  listarMovimiento()