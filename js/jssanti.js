//// VALIDACION
let documentoTxt = document.getElementById('documento');
let nombreTxt = document.getElementById('nombre');
let apellidoTxt = document.getElementById('apellido');
let btnEnviar = document.getElementById('enviar');

btnEnviar.addEventListener("click", function() {
    if (((documentoTxt)(nombreTxt)(apellidoTxt)).value.length === 0 || ' '){
        alert("Este campo es requerido, porfavor completar")
    }
    else{
        alert("bienvendido")
    }
});

let enviarModal = document.querySelectorAll('modal')
let modal = document.querySelectorAll('modal-alert')

enviarModal.addEventListener("click", function(){
    alert(sadfasdf)
})







const nombreInput = document.getElementById('nombre');
const nombreLabel = document.getElementById('nombreLabel');

nombreInput.addEventListener('input', function () {
    if (nombreInput.value !== '') {
        nombreLabel.style.color = 'rgb(255, 115, 0)';
    } else {
        nombreLabel.style.color = '';
    }
});

const docInput = document.getElementById('documento');
const docLabel = document.getElementById('docLabel');

docInput.addEventListener('input', function () {
    if (docInput.value !== '') {
        docLabel.style.color = 'rgb(255, 115, 0)';
    } else {
        docLabel.style.color = '';
    }
});

const apeInput = document.getElementById('apellido');
const apeLabel = document.getElementById('apeLabel');

apeInput.addEventListener('input', function () {
    if (apeInput.value !== '') {
        apeLabel.style.color = 'rgb(255, 115, 0)';
    } else {
        apeLabel.style.color = '';
    }
});

const docnput = document.getElementById('doc');
const tipoLabel = document.getElementById('tipoDoc');

docnput.addEventListener('change', function () {
    if (docnput.value !== '') {
        tipoLabel.style.color = 'rgb(255, 115, 0)';
    }
});

const instructorInput = document.getElementById('instructor');
const encargadoInput = document.getElementById('encargado');
const tipoUsuarioLabel = document.querySelector('label[for="tipoUsuario"]');

instructorInput.addEventListener('change', function () {
    if (instructorInput.checked) {
        tipoUsuarioLabel.style.color = 'rgb(255, 115, 0)'; 
    } else {
        tipoUsuarioLabel.style.color = ''; 
    }
});

encargadoInput.addEventListener('change', function () {
    if (encargadoInput.checked) {
        tipoUsuarioLabel.style.color = 'rgb(255, 115, 0)';
    } else {
        tipoUsuarioLabel.style.color = ''; 
    }
});


