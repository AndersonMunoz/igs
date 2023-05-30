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

firstSubmit.addEventListener("click", function(event) {
    event.preventDefault(); 
    form1.style.display = "none"; 
    form2.style.display = "grid"; 
});


secondSubmit.addEventListener("click",function(event){
    event.preventDefault();
    form2.style.display = "none";
    form3.style.display = "grid";
});
firstBack.addEventListener("click",function(event){
    event.preventDefault();
    form2.style.display = "none";
    form1.style.display = "grid";
});

thirdSubmit.addEventListener("click", function(event){
    event.preventDefault();
    form3.style.display = "none";
    form4.style.display = "grid";
});
secondtBack.addEventListener("click",function(event){
    event.preventDefault();
    form3.style.display = "none";
    form2.style.display = "grid";
});

fourthSubmit.addEventListener("click", function(event){
    event.preventDefault();
    form4.style.display = "none";
    form1.style.display = "grid";
})
thirdBack.addEventListener("click", function(event){
    event.preventDefault();
    form4.style.display = "none";
    form3.style.display = "grid";
});
