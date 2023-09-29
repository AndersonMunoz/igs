let burger = document.getElementById("burgerJS");
let navVi = document.getElementById("navVi");
let movId = document.getElementById("movId");
let subsubJs = document.getElementById("subsubJs");

movId.addEventListener("click", function (){
    if (subsubJs.classList.contains("subsub")) {
        subsubJs.classList.add("subsub-invisible");
        subsubJs.classList.remove("subsub");
    } else {
        subsubJs.classList.remove("subsub-invisible");
        subsubJs.classList.add("subsub");
    }; 
})

burger.addEventListener("click", function(){
    if (navVi.classList.contains("nav-vi")) {
        navVi.classList.add("nav-hidden");
        navVi.classList.remove("nav-vi");
    } else {
        navVi.classList.remove("nav-hidden");
        navVi.classList.add("nav-vi");
    }; 
})