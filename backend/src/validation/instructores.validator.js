import { check } from "express-validator";
export const validatorInstructores = [
    check('documento_instructor', 'El documento debe ser mayor a 6 caracteres')
        .exists()
        .not()
        .isEmpty()
        .matches(/^\d{8,12}$/),


    check('nombre_instructor', 'El nombre solo debe contener letras, espacios y apóstrofes')
        .exists()
        .not()
        .isEmpty()
        .matches(/^[A-Za-z\s'ñ]+$/),


];
