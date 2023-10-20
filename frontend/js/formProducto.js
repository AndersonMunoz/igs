const nuevoProducto = document.getElementById("nuevoProducto");

nuevoProducto.addEventListener("submit", (e) => {
  e.preventDefault();
  const numLote = document.getElementById("numLote").value;
  const fechaCaducidad = document.getElementById("fechaCaducidad").value;
  const selectPeso = document.getElementById("selectPeso").value;
  const descripcion = document.getElementById("descripcion").value;
  const precio = document.getElementById("precio").value;
  const requestBody = {
    fecha_caducidad_producto: fechaCaducidad,
    cantidad_peso_producto: numLote,
    unidad_peso_producto: selectPeso,
    descripcion_producto: descripcion,
    precio_producto: precio,
  };
  let guardarProductoJSON = JSON.stringify(requestBody);
  console.log(guardarProductoJSON);

  fetch("http://localhost:3000/producto/registrar", {
    method: "POST",
    body: guardarProductoJSON,
    headers: {
      "Content-Type": "application/json", 
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data); 
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// fetch("http://localhost:3000/producto/registrar").then(x=>x.json()).then(console.log())
