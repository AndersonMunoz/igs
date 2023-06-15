let barMenu = document.getElementById("menu");
let main_Menu = document.getElementById("menu-lat"); 

barMenu.addEventListener("click", function(){
	if (main_Menu.classList.contains("menu_lat")){
        main_Menu.classList.add("menu--show");
        main_Menu.classList.remove("menu_lat");

    }
        else{
            main_Menu.classList.remove("menu--show");
            main_Menu.classList.add("menu_lat");	
        }
        
    });

let menu = document.querySelectorAll('.option');

menu.forEach(function(item){
    item.addEventListener('click', function(i){
        var elemento = i.target.parentNode;
        console.log(elemento.children);
        elemento.children[1].classList.toggle('activo');
        
})
})
