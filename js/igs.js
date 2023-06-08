let mini=document.querySelector('#mini');
let full=document.querySelector('#full');
let mian=document.getElementById('menuHamb');
let newUser=document.querySelector('#addNewUser');
let btnNew=document.querySelector('#newUser');
let btnNew2=document.querySelector('#newUser2');
let alerta = document.querySelector('#modalAlert');
let btnReg = document.querySelector('#btnReg');
let nombre = document.getElementById('Name');
let Surname = document.getElementById('Surname');
let Email = document.getElementById('Email');
let Pass = document.getElementById('passWord');
let userType = document.getElementById('userType')


mian.addEventListener('click', function () {

    if (mini.classList.contains('none')) {
        mini.classList.add('menu');
        mini.classList.remove('none');
        full.classList.remove('menu');
        full.classList.add('none');
    }else{
        mini.classList.remove('menu');
        mini.classList.add('none');
        full.classList.add('menu');
        full.classList.remove('none');
    }
}
);

btnNew.addEventListener('click', function add() {
    if (newUser.classList.contains('none')) {
        newUser.classList.remove('none');
        newUser.classList.add('add-new-user');
    }else{
        newUser.classList.add('none');
        newUser.classList.remove('add-new-user');
    }
});
btnReg.addEventListener('click', function () {
    if ((nombre.value.length === 0)||(Email.value.length === 0)||(Pass.value.length === 0)||(userType.value == 0)) {
        alert ('Por favor, asegúrese de llenar todos los campos correctamente.')
    }else{ 
        alerta.classList.add('modal-alert');
        alerta.classList.remove('none');
 
    }
});