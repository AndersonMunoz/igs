let UserInicio = document.getElementById("UserInicio");
let modal = document.querySelector(".userOculto");
let closeX = document.getElementById("closeX");

UserInicio.addEventListener('click', () => {

    

    modal.classList.toggle('userOculto');
    modal.classList.toggle('container-login');
});

closeX.addEventListener('click', () => {
    modal.classList.remove('container-login')
    modal.classList.add('userOculto')
});