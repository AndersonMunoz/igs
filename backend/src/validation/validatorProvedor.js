import { check } from 'express-validator';

export const validarProvedor = [
    check('nombre_proveedores', '¡Error! Valor mínimo para el nombre 5 y máximo 45 caracteres. ')
    .exists()
    .not()
    .isEmpty()
    .matches(/^[A-Za-z\s']+$/)
    .isLength({ min: 5, max: 45 }),

    check('telefono_proveedores', '¡Error! Un número de teléfono debe estar formado por 10 números positivos. ')
    .not()
    .isEmpty()
    .isNumeric()
    .isLength({ min: 10, max: 10 })
    .custom(value => value >= 0), 


    check('direccion_proveedores', 'Error en la dirección. limite: 50 caracteres')
    .not()
    .isEmpty()
    .isLength({ max: 50 }),

    check('contrato_proveedores', '¡Error! el contrato solo puede ser numérico positivo.')
    .not()
    .isEmpty()
    .isNumeric()
    .custom(value => value >= 0), 
];