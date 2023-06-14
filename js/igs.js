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
let eror = document.getElementById('modalAlertFalse');

let notnom = document.getElementById('notName');
let notapl = document.getElementById('notSurName');
let notMail = document.getElementById('notEmail');
let notPass = document.getElementById('notPassWord');
let user = document.getElementById('notUser');
let btnaceptar = document.getElementById('btnAceptar');


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
        eror.classList.add('modal-alert');
        eror.classList.remove('none');
        notnom.style.visibility = 'visible'
    }else {
        notnom.style.visibility = 'hidden'
    }
    if (Surname.value.length === 0) {
        eror.classList.add('modal-alert');
        eror.classList.remove('none');
        notapl.style.visibility = 'visible'
    }else {
        notapl.style.visibility = 'hidden'
    }
    if (Email.value.length === 0) {
        eror.classList.add('modal-alert');
        eror.classList.remove('none');
        notMail.style.visibility = 'visible'
    }else {
        notMail.style.visibility = 'hidden'
    }
    if (Pass.value.length === 0) {
        eror.classList.add('modal-alert');
        eror.classList.remove('none');
        notPass.style.visibility = 'visible'
    }else {
        notPass.style.visibility = 'hidden'
    }
    if (userType.value == 0) {
        eror.classList.add('modal-alert');
        eror.classList.remove('none');
        user.style.visibility = 'visible'
    }else {
        user.style.visibility = 'hidden'
    }
    if ((nombre.value.length !== 0)&&(Email.value.length !== 0)&&(Pass.value.length !== 0)&&(userType.value != 0)) {
        alerta.classList.add('modal-alert');
        alerta.classList.remove('none');
    }
});
btnaceptar.addEventListener('click', function () {
    eror.classList.remove('modal-alert');
    eror.classList.add('none');
})
