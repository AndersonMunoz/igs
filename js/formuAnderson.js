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
  // Agregar evento al botón de cancelar para redirigir a otra página
  cancelButton.addEventListener('click', function() {
    window.location.href = 'modelo-anderson.html'; // Reemplaza 'otra_pagina.html' con la URL de la página a la que deseas redirigir
  });
// Mostrar el botón de registro cuando se completen todos los campos requeridos
form.addEventListener('input', function() {
  const requiredFields = Array.from(form.querySelectorAll('input[required]'));
  const radioFields = Array.from(form.querySelectorAll('input[type="radio"]'));
  const textFields = Array.from(form.querySelectorAll('input[type="text"]'));

  // Verificar si todos los campos requeridos están completos
/*   const allFieldsCompleted = requiredFields.every(field => field.value.trim() !== ''); */

  // Verificar si al menos uno de los campos de tipo radio está seleccionado
  const radioSelected = radioFields.some(field => field.checked);

  if (allFieldsCompleted || radioSelected) {
    registerButton.style.display = 'inline-block';
  } else {
    registerButton.style.display = 'none';
  }
});


