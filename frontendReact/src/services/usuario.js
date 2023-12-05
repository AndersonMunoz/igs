/* async function listarCategoria() {
  try {
    const response = await fetch('http://localhost:3000/usuario/listar', {
      method: "get",
      headers: {
        "content-type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    const row = data.map(generarFilaUsuario).join('');
    document.getElementById('listarUsuario').innerHTML = row;
  } catch (error) {
    console.error('Error al realizar la solicitud:', error);
  }
}

function generarFilaUsuario(usuario) {
  return `<tr>
            <td>${usuario.id_usuario}</td>        
            <td>${usuario.nombre_usuario}</td>        
            <td>${usuario.documento_usuario}</td>        
            <td>${usuario.email_usuario}</td>        
            <td>${usuario.tipo_usuario}</td>        
          </tr>`;
} */
