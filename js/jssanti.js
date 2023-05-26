const nombreInput = document.getElementById('nombre');
const nombreLabel = document.getElementById('nombreLabel');

nombreInput.addEventListener('input', function () {
    if (nombreInput.value !== '') {
        nombreLabel.style.color = 'rgb(255, 136, 0)';
    } else {
        nombreLabel.style.color = '';
    }
});

const docInput = document.getElementById('documento');
const docLabel = document.getElementById('docLabel');

docInput.addEventListener('input', function () {
    if (docInput.value !== '') {
        docLabel.style.color = 'rgb(255, 136, 0)';
    } else {
        docLabel.style.color = '';
    }
});

const apeInput = document.getElementById('apellido');
const apeLabel = document.getElementById('apeLabel');

apeInput.addEventListener('input', function () {
    if (apeInput.value !== '') {
        apeLabel.style.color = 'rgb(255, 136, 0)';
    } else {
        apeLabel.style.color = '';
    }
});

const docnput = document.getElementById('doc');
const tipoLabel = document.getElementById('tipoDoc');

docnput.addEventListener('change', function () {
    if (docnput.value !== '') {
        tipoLabel.style.color = 'rgb(255, 136, 0)';
    }
});

const instructorInput = document.getElementById('instructor');
const encargadoInput = document.getElementById('encargado');
const tipoUsuarioLabel = document.querySelector('label[for="tipoUsuario"]');

instructorInput.addEventListener('change', function () {
    if (instructorInput.checked) {
        tipoUsuarioLabel.style.color = 'rgb(255, 136, 0)'; 
    } else {
        tipoUsuarioLabel.style.color = ''; 
    }
});

encargadoInput.addEventListener('change', function () {
    if (encargadoInput.checked) {
        tipoUsuarioLabel.style.color = 'rgb(255, 136, 0)';
    } else {
        tipoUsuarioLabel.style.color = ''; 
    }
});


