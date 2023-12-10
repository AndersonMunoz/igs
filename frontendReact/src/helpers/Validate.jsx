const Validate = {
  validarCampos: (formSelector) => {
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
  }
};

export default Validate;
