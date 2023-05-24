let btnBurger = document.getElementById("btnBurger");
let sidebarHidden = document.querySelector(".sidebar");

function hiddenBarra(sidebarHidden){

}

btnBurger.addEventListener("click", function(){
    sidebarHidden.classList.add("sidebar-hidden");
    sidebarHidden.classList.add("sidebar");
});
