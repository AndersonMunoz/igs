let sidebarHidden = document.querySelector(".sidebar");
let movId = document.getElementById("movId");
let subsubJs = document.getElementById("subsubJs");
let movId2 = document.getElementById("movId2");
let subsubJs2 = document.getElementById("subsubJs2");
let movId3 = document.getElementById("movId3");
let subsubJs3 = document.getElementById("subsubJs3");
let burger = document.getElementById("burgerJS");


// burger.addEventListener("click", function(){
//     if(sidebarHidden.classList.contains("sidebar")){
//         sidebarHidden.classList.add("sidebar-hidden");
//         sidebarHidden.classList.remove("sidebar")
//     }else{
//         sidebarHidden.classList.remove("sidebar-hidden");
//         sidebarHidden.classList.add("sidebar");
//     }
// });
burger.addEventListener("click", function(){
    if (navVi.classList.contains("nav-vi")) {
        navVi.classList.add("nav-hidden");
        navVi.classList.remove("nav-vi");
    } else {
        navVi.classList.remove("nav-hidden");
        navVi.classList.add("nav-vi");
    }; 
})

movId.addEventListener("click", function (){
    if (subsubJs.classList.contains("submenu")) {
        subsubJs.classList.add("subsub-invisible");
        subsubJs.classList.remove("submenu");
    } else {
        subsubJs.classList.remove("subsub-invisible");
        subsubJs.classList.add("submenu");
    }; 
})
movId2.addEventListener("click", function (){
    if (subsubJs2.classList.contains("submenu")) {
        subsubJs2.classList.add("subsub-invisible");
        subsubJs2.classList.remove("submenu");
    } else {
        subsubJs2.classList.remove("subsub-invisible");
        subsubJs2.classList.add("submenu");
    }; 
})
movId3.addEventListener("click", function (){
    if (subsubJs3.classList.contains("submenu")) {
        subsubJs3.classList.add("subsub-invisible");
        subsubJs3.classList.remove("submenu");
    } else {
        subsubJs3.classList.remove("subsub-invisible");
        subsubJs3.classList.add("submenu");
    }; 
})



