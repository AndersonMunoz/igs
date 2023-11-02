import { check } from "express-validator";

export const validatorTipo_producto = [
    check('nombre_tipo', 'El nombre solo debe contener letras, espacios y apóstrofes')
        .exists()
        .not()
        .isEmpty()
        .isLength({min: 2, max: 45})
        .matches(/^[A-Za-z\s']+$/),
];