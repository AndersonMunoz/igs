const form = document.getElementById('registration-form');
const registerButton = document.getElementById('idReg');
const cancelButton = document.getElementById('idCan');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Evitar el envío del formulario

    // Validar si todos los campos requeridos están completos
    if (form.checkValidity()) {
      alert('¡Registro exitoso!');
      form.reset(); // Opcionalmente puedes restablecer los campos del formulario
    }
  });

  // Mostrar el botón de registro cuando se completen todos los campos requeridos
  form.addEventListener('input', function() {
    registerButton.style.display = form.checkValidity() ? 'block' : 'none';
  });

  // Agregar evento al botón de cancelar para redirigir a otra página
  cancelButton.addEventListener('click', function() {
    window.location.href = 'modelo-anderson.html'; // Reemplaza 'otra_pagina.html' con la URL de la página a la que deseas redirigir
  });