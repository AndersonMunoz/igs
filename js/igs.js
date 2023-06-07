let mini=document.querySelector('#mini');
let full=document.querySelector('#full');
let mian=document.getElementById('menuHamb');
let newUser=document.querySelector('#addNewUser');
let btnNew=document.querySelector('#newUser');
let btnNew2=document.querySelector('#newUser2');
let alerta = document.querySelector('#modalAlert');
let btnReg = document.querySelector('#btnReg')


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
    if (alerta.classList.contains('none')) {
        alerta.classList.add('modal-alert');
        alerta.classList.remove('none');
    }
    
})