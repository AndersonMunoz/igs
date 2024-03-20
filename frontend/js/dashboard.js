let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
    });
}
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".ti-menu-2");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});



let modalUser = document.getElementById("userAlert");
let modal = document.querySelector(".modalClose");
let closeX = document.getElementById("closeX");

userAlert.addEventListener('click', () => {
    modal.classList.toggle('modalUser')
    modal.classList.toggle('modalClose')
});

closeX.addEventListener('click', () => {
    modal.classList.remove('modalUser')
    modal.classList.add('modalClose')
});


let producto = document.getElementById("clickProduct")
let MostrarProducto = document.getElementById("clickMostar")

let inputFrom = document.querySelector(".productoFrom");
let inputView = document.querySelector(".productoView");

producto.addEventListener('click', () => {
    if (inputFrom.classList.contains('productoFrom')) {
        inputFrom.classList.remove('productoFrom');
        inputFrom.classList.add('productoAll');
    } else {
        inputFrom.classList.add('productoFrom');
        inputFrom.classList.remove('productoAll');
    }

})

MostrarProducto.addEventListener('click', () => {
    if (inputView.classList.contains('productoView')) {
        inputView.classList.remove('productoView');
        inputView.classList.add('productoAll2');
    } else {
        inputView.classList.add('productoView');
        inputView.classList.remove('productoAll2');
    }

})