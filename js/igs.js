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
let userType = document.getElementById('userType');

let notnom = document.getElementById('notName');
let notapl = document.getElementById('notSurName');
let notMail = document.getElementById('notSurName');
let notPass = document.getElementById('notPassWord');


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
    if (nombre.value.length === 0) {
        alert ('te falta el nombre');
    }else if (Surname.value.length === 0) {
        alert ('falta los apellidos');
    }else if (Email.value.length === 0) {
        alert('te falta el email');
    }else if (Pass.value.length === 0) {
        alert ('falta la contraseña');
    }else if (userType.value == 0) {
        alert ('tipo de usuario');
    }
    if ((nombre.value.length !== 0)&&(Email.value.length !== 0)&&(Pass.value.length !== 0)&&(userType.value != 0)) {
        alerta.classList.add('modal-alert');
        alerta.classList.remove('none');
    }

});