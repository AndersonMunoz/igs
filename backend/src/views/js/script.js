document.addEventListener("DOMContentLoaded", function () {
    const hamburgerButton = document.querySelector('.hamburger-menu');
    const mainMenu = document.querySelector('.main-menu');

    // Agregar un evento de clic al botón de hamburguesa
    hamburgerButton.addEventListener('click', () => {
        mainMenu.classList.toggle('active');
    });

    // Agregar un evento de clic a los elementos con clase .sub-menu-toggle para mostrar u ocultar el submenú
    const subMenuToggleItems = document.querySelectorAll('.sub-menu-toggle');
    subMenuToggleItems.forEach(item => {
        const subMenu = item.querySelector('.sub-menu');
        item.addEventListener('click', () => {
            subMenu.classList.toggle('active');
        });
    });

    // Agregar un evento de redimensionamiento de ventana para ocultar el menú en pantallas más grandes
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) { // Puedes ajustar este ancho según tus necesidades
            mainMenu.classList.remove('active');
        }
    });

});