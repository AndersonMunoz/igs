const form = document.getElementById('registration-form');
const registerButton = document.getElementById('idReg');
const modelAlert = document.querySelector('.model-alert');
const modelAlert2 = document.querySelector('.model-alert2');
const btnAceptar = document.getElementById("btnAceptar");
const letX = document.getElementById("letX");
const btnAceptar2 = document.getElementById("btnAceptar2");
const letX2 = document.getElementById("letX2");
const textoAlert = document.getElementById("textoAlert");
const textoAlert2 = document.getElementById("textoAlert2");
const textoAlert3 = document.getElementById("textoAlert3");
const textoAlert4 = document.getElementById("textoAlert4");
const textoAlert5 = document.getElementById("textoAlert5");
const textoAlert6 = document.getElementById("textoAlert6");
const textoAlert7 = document.getElementById("textoAlert7");
const textoAlert8 = document.getElementById("textoAlert8");
const textoAlert9 = document.getElementById("textoAlert9");
const ide = document.getElementById("ide");
const idTipoCargo = document.getElementById("idTipoCargo");
const numId = document.getElementById("numId");
const nombreUsuario = document.getElementById("nombreUsuario");
const apellido = document.getElementById("apellido");
const emailPe = document.getElementById("emailPe");
const admin = document.getElementById("admin");
const coadmin = document.getElementById("coadmin");
const contra = document.getElementById("contra");
const cancelButton = document.getElementById('idCan');

// Función para mostrar el elemento con la clase model-alert y restablecer el formulario
function mostrarModelAlert() {
  modelAlert.style.display = 'flex';
  form.reset();
}

// Función para validar y mostrar las alertas correspondientes
function validarCampos() {
  let valid = true;

  if (nombreUsuario.value.length === 0) {
    textoAlert.classList.add('texto-alert-visible');
    textoAlert.classList.remove('texto-alert-hidden');
    valid = false;
  } else {
    textoAlert.classList.remove('texto-alert-visible');
    textoAlert.classList.add('texto-alert-hidden');
  }

  if (apellido.value.length === 0) {
    textoAlert2.classList.add('texto-alert-visible');
    textoAlert2.classList.remove('texto-alert-hidden');
    valid = false;
  } else {
    textoAlert2.classList.remove('texto-alert-visible');
    textoAlert2.classList.add('texto-alert-hidden');
  }

  if (emailPe.value.length === 0) {
    textoAlert3.classList.add('texto-alert-visible');
    textoAlert3.classList.remove('texto-alert-hidden');
    valid = false;
  } else {
    textoAlert3.classList.remove('texto-alert-visible');
    textoAlert3.classList.add('texto-alert-hidden');
  }

  if (ide.value.length === 0) {
    textoAlert4.classList.add('texto-alert-visible');
    textoAlert4.classList.remove('texto-alert-hidden');
    valid = false;
  } else {
    textoAlert4.classList.remove('texto-alert-visible');
    textoAlert4.classList.add('texto-alert-hidden');
  }

  if (numId.value.length === 0) {
    textoAlert5.classList.add('texto-alert-visible');
    textoAlert5.classList.remove('texto-alert-hidden');
    valid = false;
  } else {
    textoAlert5.classList.remove('texto-alert-visible');
    textoAlert5.classList.add('texto-alert-hidden');
  }

  if (!document.querySelector('input[name="tipoAdmin"]:checked')) {
    textoAlert6.classList.add('texto-alert-visible');
    textoAlert6.classList.remove('texto-alert-hidden');
    valid= false;
  } else {
  textoAlert6.classList.remove('texto-alert-visible');
  textoAlert6.classList.add('texto-alert-hidden');
  }
  
  if (idTipoCargo.value.length === 0) {
  textoAlert7.classList.add('texto-alert-visible');
  textoAlert7.classList.remove('texto-alert-hidden');
  valid = false;
  } else {
  textoAlert7.classList.remove('texto-alert-visible');
  textoAlert7.classList.add('texto-alert-hidden');
  }
  
  if (!document.querySelector('input[name="sede"]:checked')) {
  textoAlert8.classList.add('texto-alert-visible');
  textoAlert8.classList.remove('texto-alert-hidden');
  valid = false;
  } else {
  textoAlert8.classList.remove('texto-alert-visible');
  textoAlert8.classList.add('texto-alert-hidden');
  }
  
  if (contra.value.length === 0) {
  textoAlert9.classList.add('texto-alert-visible');
  textoAlert9.classList.remove('texto-alert-hidden');
  valid = false;
  } else {
  textoAlert9.classList.remove('texto-alert-visible');
  textoAlert9.classList.add('texto-alert-hidden');
  }
  
  return valid;
  }
  
  form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar el envío del formulario
  
  // Validar si todos los campos requeridos están completos
  if (!form.checkValidity() || !validarCampos()) {
  modelAlert2.style.display = 'flex';
  } else {
  modelAlert.style.display = 'flex';
  form.reset();
  }
  });
  
  registerButton.addEventListener('click', function() {
  if (!validarCampos()) {
  modelAlert2.style.display = 'flex';
  } else {
  modelAlert.style.display = 'flex';
  }
  });


btnAceptar.addEventListener('click', function() {
  modelAlert.style.display = 'none';
});

letX.addEventListener('click', function() {
  modelAlert.style.display = 'none';
});

btnAceptar2.addEventListener('click', function() {
  modelAlert2.style.display = 'none';
});

letX2.addEventListener('click', function() {
  modelAlert2.style.display = 'none';
});

cancelButton.addEventListener('click', function() {
window.location.href = 'modelo-anderson.html'})