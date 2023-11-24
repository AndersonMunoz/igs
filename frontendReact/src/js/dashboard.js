function setupDOMListeners() {
  let arrow = document.querySelectorAll(".arrow");
  for (var i = 0; i < arrow.length; i++) {
      arrow[i].addEventListener("click", (e) => {
          let arrowParent = e.target.parentElement.parentElement;
          arrowParent.classList.toggle("showMenu");
      });
  }

  let sidebar = document.querySelector(".sidebar");
  let sidebarBtn = document.querySelector(".ti-menu-2");
  if (sidebarBtn) {
    sidebarBtn.addEventListener("click", () => {
      alert()
        sidebar.classList.toggle("close");
    });
  }

  let modalUser = document.getElementById("userAlert");
  let modal = document.querySelector(".modalClose");
  let closeX = document.getElementById("closeX");

  if (modalUser && modal && closeX) {
    modalUser.addEventListener('click', () => {
      alert("hola")
        modal.classList.toggle('modalUser');
        modal.classList.toggle('modalClose');
    });

    closeX.addEventListener('click', () => {
        modal.classList.remove('modalUser');
        modal.classList.add('modalClose');
    });
  }
}
// Llama a la función cuando el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", setupDOMListeners);
