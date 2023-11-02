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
let inputP = document.querySelector(".producto");

producto.addEventListener('click', () => {
    if (inputP.classList.contains('producto')) {
        inputP.classList.remove('producto');
        inputP.classList.add('productoAll');
    } else {
        inputP.classList.add('producto');
        inputP.classList.remove('productoAll');
    }

})