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
      icon: 'warning',
      title: `${mensaje}`,
      confirmButtonText: 'Cerrar',
      
    });
  },
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
      text: 'Registro Fallido, llenar campos vacios',
      confirmButtonText: 'Cerrar'
    });
  },
  confirmacion: () => {
    return Swal.fire({
      title: "¿Seguro que quieres desabilitarlo?",
      text: "¡Puede que el dato se pierda!",
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
      text: 'Desactivación Exitosa',
      confirmButtonText: 'Cerrar',
    });
  },
  deshabilitadoFallido: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'warning',
      text: 'Desactivación Fallida',
      confirmButtonText: 'Cerrar',
    });
  },
  confirmacionActivar: () => {
    return Swal.fire({
      title: "¿Seguro que quieres activarlo?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si",
      cancelButtonText: "Cancelar"
    });
  },
  habilitadoExitoso: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'success',
      text: 'Habilitado Exitosa',
      confirmButtonText: 'Cerrar',
    });
  },
  habilitadoFallido: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'warning',
      text: 'Habilitado Fallido',
      confirmButtonText: 'Cerrar',
    });
  },
  actualizacionExitoso: () => {
    Swal.fire({
      title: 'Mensaje',
      icon: 'success',
      text: 'Actualización Exitosa',
      confirmButtonText: 'Cerrar',
      didClose: () => {
        document.querySelector('[data-bs-dismiss="modal"]').click();
      }
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
