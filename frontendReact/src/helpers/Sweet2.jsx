import Swal from 'sweetalert2';

const Sweet = {
  exito: (mensaje) => {
    Swal.fire({
      icon: 'success',
      title: `${mensaje}`,
      confirmButtonText: 'Cerrar',
    });
  },
  error: (mensaje) => {
    Swal.fire({
      icon: 'warning',
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
    })
  }

};

export default Sweet;
