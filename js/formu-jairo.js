
        function validarFormulario(event) {
            event.preventDefault(); 
          
            let nombre = document.getElementById("nombre").value;
            let apellido = document.getElementById("apellido").value;
            let cedula = document.getElementById("cedula").value;
            let email = document.getElementById("email").value;
            
        
            // if (nombre === "" || apellido === "" || cedula === "" || email === "") {
            //     alert("Por favor, completa todos los campos.");
            // } else {
            //     alert("¡Bienvenido!");
            // }
        }
        const open = document.getElementById('open');
        const modal_container = document.getElementById('modal_container');
        const close = document.getElementById('close');
        
        open.addEventListener('click', () => {
          modal_container.classList.add('show');  
        });
        
        close.addEventListener('click', () => {
          modal_container.classList.remove('show');
        });