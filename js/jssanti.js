//// VALIDACION
let documentoTxt = document.getElementById('documento');
let nombreTxt = document.getElementById('nombre');
let apellidoTxt = document.getElementById('apellido');
let btnEnviar = document.getElementById('enviar');
let modalCor = document.getElementById('modal');
let cerrar = document.getElementById('cerrarModal');
let modalCor2 = document.getElementById('modal2');
let cerrar2 = document.getElementById('cerrarModal2');

btnEnviar.addEventListener("click", function() {
    if (documentoTxt.value.length === 0 && " "){

        modalCor.classList.add('modal--show');
        modalCor.classList.remove('modal');

        cerrar.addEventListener("click",function(){
            modalCor.classList.remove('modal--show')
        modalCor.classList.add('modal')
        })
    }
    if(nombreTxt.value.length === 0 && " "){

        modalCor.classList.add('modal--show');
        modalCor.classList.remove('modal');

        cerrar.addEventListener("click",function(){
            modalCor.classList.remove('modal--show')
        modalCor.classList.add('modal')
        })
    }
    if(apellidoTxt.value.length === 0 && " "){

        modalCor.classList.add('modal--show');
        modalCor.classList.remove('modal');

        cerrar.addEventListener("click",function(){
            modalCor.classList.remove('modal--show')
        modalCor.classList.add('modal')
        })
    }
    else{
        modalCor2.classList.add('modal--show2');
        modalCor2.classList.remove('modal2');

        cerrar2.addEventListener("click",function(){
        modalCor2.classList.remove('modal--show2')
        modalCor2.classList.add('modal2')
        })
    }
});

cerrar.addEventListener("click",function(){
            modalCor.classList.remove('modal--show')
        modalCor.classList.add('modal')
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


