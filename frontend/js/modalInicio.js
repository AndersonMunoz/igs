let UserInicio = document.getElementById("UserInicio");
let modal = document.querySelector(".userOculto");
let closeX = document.getElementById("closeX");

<<<<<<< HEAD
=======


>>>>>>> c1e8298d05e346890ac7cf7b88488fefd181ae05
UserInicio.addEventListener('click', () => {

    

    modal.classList.toggle('userOculto');
    modal.classList.toggle('container-login');
});

closeX.addEventListener('click', () => {
    modal.classList.remove('container-login')
    modal.classList.add('userOculto')
<<<<<<< HEAD
});
=======
});

// para el copy
let copyRight = document.querySelector('.yearCopi');

// Obtenemos la fecha actual
const fechaActual = new Date();

// Obtenemos el año actual

const añoActual = fechaActual.getFullYear();
// Mostramos el año actual en el elemento con id "year"
copyRight.textContent= `${añoActual}`
>>>>>>> c1e8298d05e346890ac7cf7b88488fefd181ae05
