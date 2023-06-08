let firstSubmit = document.getElementById("firstSubmit");
let secondSubmit = document.getElementById("secondSubmit");
let thirdSubmit = document.getElementById("thirdSubmit");
let fourthSubmit = document.getElementById("fourthSubmit");

let firstBack = document.getElementById("firstBack");
let secondtBack = document.getElementById("secondtBack");
let thirdBack = document.getElementById("thirdBack");

let form1 = document.getElementById("form1");
let form2 = document.getElementById("form2");
let form3 = document.getElementById("form3");
let form4 = document.getElementById("form4");


let nombre = document.getElementById("nombre");
let apellidos = document.getElementById("apellidos");
let form2Email = document.getElementById("form2Email");
let numeroTele = document.getElementById("numeroTele");

let modalAlert = document.getElementById("modalAlert");
let btnAceptar = document.querySelector(".modal_close");
let container = document.getElementById("container");

let modalAlerts = document.querySelector(".modal--show");
let inputName = document.querySelector(".inputName");
let inputLast = document.querySelector(".inputLast");

let textAlert = document.querySelector(".text-alert");
let textAlert2 = document.querySelector(".text-alert2");


let inputInfo = document.querySelectorAll(".inputInfo");

firstSubmit.addEventListener("click", function(event){
    for(i = 0; i < inputInfo.length; i++){
        if(inputInfo[i] === 0 || inputInfo[i] === ""){
            modalAlerts.style.display = "flex";
            event.preventDefault(); 
            container.style.background = "rgba(0, 0, 0, 0.4)";
            btnAceptar.addEventListener("click", function(){
                modalAlerts.style.display = "none";
                event.preventDefault(); 
                container.style.background = "none";
            });
        }else{
            event.preventDefault(); 
            form1.style.display = "none"; 
            form2.style.display = "grid"; 
        }
    }
});


// firstSubmit.addEventListener("click", function(event) {
//     if(nombre.value.length === 0 || nombre.value.length === "" || apellidos.value.length === 0 || apellidos.value.length === "" ){
//         modalAlerts.style.display = "flex";
//         event.preventDefault(); 
//         container.style.background = "rgba(0, 0, 0, 0.4)";
//         btnAceptar.addEventListener("click", function(){
//             modalAlerts.style.display = "none";
//             event.preventDefault(); 
//             container.style.background = "none";
//         });
//     }else{
//         event.preventDefault(); 
//         form1.style.display = "none"; 
//         form2.style.display = "grid"; 
//     }
//     if(nombre.value.length === 0 || nombre.value.length === ""){
//         inputName.style.border = "3px solid red";
//         textAlert.style.display = "flex";
//     }
//     if(apellidos.value.length === 0 || apellidos.value.length === ""){
//         inputLast.style.border = "3px solid red";
//         textAlert2.style.display = "flex";
//     }
// });

// secondSubmit.addEventListener("click",function(event){
//     if(form2Email.value.length === 0 || form2Email.value.length === "" || numeroTele.value.length === 0 || numeroTele.value.length === ""){
//         modalAlerts.style.display = "flex";
//         textAlert.style.display = "flex";
//         event.preventDefault(); 
//         container.style.background = "rgba(0, 0, 0, 0.4)";
//         btnAceptar.addEventListener("click", function(){
//             modalAlerts.style.display = "none";
//             event.preventDefault(); 
//             container.style.background = "none";
//         });
//     }else{
//         event.preventDefault();
//         form2.style.display = "none";
//         form3.style.display = "grid";
//     }
// });
// firstBack.addEventListener("click",function(event){
//     event.preventDefault();
//     form2.style.display = "none";
//     form1.style.display = "grid";
// });

// thirdSubmit.addEventListener("click", function(event){
//     event.preventDefault();
//     form3.style.display = "none";
//     form4.style.display = "grid";
// });
// secondtBack.addEventListener("click",function(event){
//     event.preventDefault();
//     form3.style.display = "none";
//     form2.style.display = "grid";
// });

// fourthSubmit.addEventListener("click", function(event){
//     event.preventDefault();
//     form4.style.display = "none";
//     form1.style.display = "grid";
//     alert("Registro de usuario con exito")
// })
// thirdBack.addEventListener("click", function(event){
//     event.preventDefault();
//     form4.style.display = "none";
//     form3.style.display = "grid";
// });
