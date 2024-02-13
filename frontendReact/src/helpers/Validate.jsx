const Validate = {
  validarCampos: (formSelector) => {// function para validar si los campos se mandan vacios
    const formControl = document.querySelectorAll(`${formSelector}`);
  
    const camposVacios = [];
    formControl.forEach((campo) => {
      const value = campo.value.trim();
      if (!value) {
        camposVacios.push(campo.id);
        campo.classList.add('is-invalid');
      } else {
        campo.classList.remove('is-invalid');
      }
    });
  
    if (camposVacios.length > 0) {
      console.log('Campos vacíos:', camposVacios);
      return false; 
    }
  
    return true; 
  },
  validarSelect: function(selector) {
    const selects = document.querySelectorAll(selector);
    let validacionExitosa = true;
    selects.forEach(select => {
      const selectedOption = select.querySelector('.react-select__single-value');
      if (!selectedOption || !selectedOption.textContent) {
        select.classList.add('is-invalid');
        validacionExitosa = false;
      } else {
        select.classList.remove('is-invalid');
      }
    });
    return validacionExitosa;
  },
  formatFecha: (fecha) => { // function para hacer que cualquier fecha sea legible
    if (fecha === 'No aplica') {
        return 'No aplica';
    }
    const fechaObj = new Date(fecha);
    const year = fechaObj.getFullYear();
    const month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
    const day = fechaObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
},
  limpiar: (limpiar) => {//funcion para limpiar los campos del formulario
    let limpiarElemento = document.querySelectorAll(`${limpiar}`);
    limpiarElemento.forEach((element) => {
      element.value = '';
    });
  }
};

export default Validate;