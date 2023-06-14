const form = document.getElementById('registration-form');
let registerButton = document.getElementById('idReg');
const modelAlert = document.querySelector('.model-alert');
const modelAlert2 = document.querySelector('.model-alert2');
let btnAceptar = document.getElementById("btnAceptar");
let letX = document.getElementById("letX");
let btnAceptar2 = document.getElementById("btnAceptar2");
let letX2 = document.getElementById("letX2");
let textoAlert = document.getElementById("textoAlert");
let textoAlert2 = document.getElementById("textoAlert2");
let textoAlert3 = document.getElementById("textoAlert3");
let textoAlert4 = document.getElementById("textoAlert4");
let textoAlert5 = document.getElementById("textoAlert5");
let textoAlert6 = document.getElementById("textoAlert6");
let textoAlert7 = document.getElementById("textoAlert7");
let textoAlert8 = document.getElementById("textoAlert8");
let textoAlert9 = document.getElementById("textoAlert9");
let ide = document.getElementById("ide");
let idTipoCargo = document.getElementById("idTipoCargo");
let numId = document.getElementById("numId");
let nombreUsuario = document.getElementById("nombreUsuario");
let apellido = document.getElementById("apellido");
let emailPe = document.getElementById("emailPe");
const cancelButton = document.getElementById('idCan');
let admin = document.getElementById("admin");
let coadmin = document.getElementById("coadmin");
let contra = document.getElementById("contra");


form.addEventListener('submit', function(event) {
  event.preventDefault(); // Evitar el envío del formulario

  // Validar si todos los campos requeridos están completos
  if (form.checkValidity()===0) {
    form.reset(); // Opcionalmente puedes restablecer los campos del formulario
      // Mostrar el div modelAlert
      modelAlert1.style.display = 'flex';
  } 
  if (!form.checkValidity()) {
    // Mostrar el div modelAlert
    modelAlert2.style.display = 'flex';
  }  
});


/* form.reportValidity(); // Mostrar los mensajes de validación si existen campos incompletos
  
  // Si todos los campos requeridos están llenos, se ejecutará el evento 'submit' del formulario
  if (form.checkValidity()) {
    form.dispatchEvent(new Event('submit'));
  } */
registerButton.addEventListener('click', function() {

   if (nombreUsuario.value.length===0) {
    textoAlert.classList.add('texto-alert-visible');
    textoAlert.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert.classList.remove('texto-alert-visible');
    textoAlert.classList.add('texto-alert-hidden');
  }

  if (apellido.value.length===0) {
    textoAlert2.classList.add('texto-alert-visible');
    textoAlert2.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert2.classList.remove('texto-alert-visible');
    textoAlert2.classList.add('texto-alert-hidden');
  }
  if (emailPe.value.length===0) {
    textoAlert3.classList.add('texto-alert-visible');
    textoAlert3.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert3.classList.remove('texto-alert-visible');
    textoAlert3.classList.add('texto-alert-hidden');
  }
  if (ide.value.length===0) {
    textoAlert4.classList.add('texto-alert-visible');
    textoAlert4.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert4.classList.remove('texto-alert-visible');
    textoAlert4.classList.add('texto-alert-hidden');
  }

  if (numId.value.length===0) {
    textoAlert5.classList.add('texto-alert-visible');
    textoAlert5.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert5.classList.remove('texto-alert-visible');
    textoAlert5.classList.add('texto-alert-hidden');
  }

  if(!document.querySelector('input[name="tipoAdmin"]:checked')) {
    textoAlert6.classList.add('texto-alert-visible');
    textoAlert6.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert6.classList.remove('texto-alert-visible');
    textoAlert6.classList.add('texto-alert-hidden');
  }

  if (idTipoCargo.value.length===0) {
    textoAlert7.classList.add('texto-alert-visible');
    textoAlert7.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert7.classList.remove('texto-alert-visible');
    textoAlert7.classList.add('texto-alert-hidden');
  }

  if(!document.querySelector('input[name="sede"]:checked')) {
    textoAlert8.classList.add('texto-alert-visible');
    textoAlert8.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert8.classList.remove('texto-alert-visible');
    textoAlert8.classList.add('texto-alert-hidden');
  }

  if (contra.value.length===0) {
    textoAlert9.classList.add('texto-alert-visible');
    textoAlert9.classList.remove('texto-alert-hidden');
    modelAlert2.style.display = 'flex';
  } else {
    textoAlert9.classList.remove('texto-alert-visible');
    textoAlert9.classList.add('texto-alert-hidden');
  }
  
  
  // Validar si todos los campos requeridos están completos
  if (form.checkValidity()===0) {
    form.reset(); 
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