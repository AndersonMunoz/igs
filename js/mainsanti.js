/* var toggle = document.getElementById("toggle");
var container = document.getElementById("container");

toggle.onclick = function(){
	container.classList.toggle('active');
} */

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

/* 	let mainMenu = document.getElementById("menu--"); 

	barMenu.addEventListener("click", function(){
		if (mainMenu.classList.contains("menu--latt")){
			mainMenu.classList.remove("menu--latt")
			mainMenu.classList.add("menu_lateral")
	
		}
			else{
				mainMenu.classList.add("menu--latt")
				mainMenu.classList.remove("menu_lateral")
			}
			
		}); */

/*     if (main_Menu.classList.contains("main-menu")){
        main_Menu.classList.add("main-menu-visible");
        main_Menu.classList.remove("main-menu");
    }
        else{
            main_Menu.classList.remove("main-menu-visible");
            main_Menu.classList.add("main-menu");
        }
        
    } */