import Swal from 'sweetalert2';

const Sweet = {
  exito: (mensaje) => {
    Swal.fire({
      icon: 'success',
      title: `${mensaje}`,
      confirmButtonText: 'Cerrar',
      didClose: () => {
        document.querySelector('[data-bs-dismiss="modal"]').click();
      }
    });
  },
  error: (mensaje) => {
    Swal.fire({
      icon: 'error',
      title: `${mensaje}`,
      confirmButtonText: 'Cerrar',
    });
  },
  logIn: (mensaje) => {
    Swal.fire({
      icon: 'success',
      title: `${mensaje}`,
      timer: 1000,
      toast: true,
      showConfirmButton: false
    });
  }
};

export default Sweet;
