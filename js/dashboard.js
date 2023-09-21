let arrow = document.querySelectorAll(".arrow");
for (var i = 0; i < arrow.length; i++) {
    arrow[i].addEventListener("click", (e) => {
        let arrowParent = e.target.parentElement.parentElement;//selecting main parent of arrow
        arrowParent.classList.toggle("showMenu");
    });
}
let sidebar = document.querySelector(".sidebar");
let sidebarBtn = document.querySelector(".bx-menu");
console.log(sidebarBtn);
sidebarBtn.addEventListener("click", () => {
    sidebar.classList.toggle("close");
});




let modalUser = document.getElementById("userAlert");
let modal = document.querySelector(".modalClose");
let closeX = document.getElementById("closeX");

userAlert.addEventListener('click', () => {
    modal.classList.toggle('modalClose');
    modal.classList.toggle('modalUser');
});

closeX.addEventListener('click', () => {
    modal.classList.remove('modalUser')
    modal.classList.add('modalClose')
});