import { check } from "express-validator";

export const validatorCategoria_producto = [
    check('nombre_categoria', 'El nombre solo debe contener letras, espacios, apóstrofes, números, caracteres especiales y paréntesis')
        .exists()
        .not()
        .isEmpty()
        .isLength({min: 2, max: 45})
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÜü\s0-9'()]+$/),
];
