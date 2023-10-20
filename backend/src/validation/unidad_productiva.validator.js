import { check } from "express-validator";

export const validatorUnidad_productiva = [
    check('nombre_up', 'El nombre solo debe contener letras, espacios y apóstrofes')
        .exists()
        .not()
        .isEmpty()
        .isLength({min: 2, max: 45})
        .matches(/^[A-Za-z\s']+$/),
];