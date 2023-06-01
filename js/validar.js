let nameuser = document.getElementById('nameUser');
let btnEnviar=document.getElementById('btnEnviar');

btnEnviar.addEventListener('click', function () {
    if (nameuser.value.length === 0){
        alert ('ingrese su nombre')
    }else{
        alert ('bienvenido')
    }
})