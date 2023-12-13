import Swal from 'sweetalert2';

const Sweet = {
  registroExitoso: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'success',
      text: 'Registro Exitoso',
      confirmButtonText: 'Cerrar',
    });
  },
  registroFallido: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'warning',
      text: 'Registro Fallido',
      confirmButtonText: 'Cerrar',
    });
  },
  confirmacion: () => {
    return Swal.fire({
      title: "¿Seguro Quieres Desabilitarlo?",
      text: "No se Podrá Revertir!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "Cancelar"
    });
  },
  deshabilitadoExitoso: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'success',
      text: 'Eliminación Exitosa',
      confirmButtonText: 'Cerrar',
    });
  },
  deshabilitadoFallido: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'warning',
      text: 'Eliminación Fallido',
      confirmButtonText: 'Cerrar',
    });
  },
  actualizacionExitoso: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'success',
      text: 'Actualización Exitosa',
      confirmButtonText: 'Cerrar',
    });
  },
  actualizacionFallido: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'warning',
      text: 'Actualización Fallido',
      confirmButtonText: 'Cerrar',
    });
  },
  datosinsuficientes: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'warning',
      text: 'Datos insuficientes, Intenete Nuevamente',
      confirmButtonText: 'Cerrar',
    });
  }
  
};

export default Sweet;
