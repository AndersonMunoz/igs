const form = document.getElementById('registration-form');
const registerButton = document.getElementById('idReg');
const modelAlert = document.querySelector('.model-alert');
let btnAceptar = document.getElementById("btnAceptar");
let letX = document.getElementById("letX");

form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar el envío del formulario

  // Validar si todos los campos requeridos están completos
  if (form.checkValidity()) {
    form.reset(); // Opcionalmente puedes restablecer los campos del formulario
    
    // Mostrar el div modelAlert
    modelAlert.style.display = 'flex';
  }
});

registerButton.addEventListener('click', function() {
  form.reportValidity(); // Mostrar los mensajes de validación si existen campos incompletos
  
  // Si todos los campos requeridos están llenos, se ejecutará el evento 'submit' del formulario
  if (form.checkValidity()) {
    form.dispatchEvent(new Event('submit'));
  }
});

btnAceptar.addEventListener('click', function() {
  modelAlert.style.display = 'none';
});

letX.addEventListener('click', function() {
  modelAlert.style.display = 'none';
});
