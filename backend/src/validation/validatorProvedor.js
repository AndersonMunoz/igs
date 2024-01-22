import { check } from 'express-validator';

export const validarProvedor = [
    check('nombre_proveedores', '¡Error! Valor mínimo para el nombre 5 y máximo 45 caracteres. ')
    .exists()
    .not()
    .isEmpty()
    .matches(/^[A-Za-z\s']+$/)
    .isLength({ min: 5, max: 45 }),

check('telefono_proveedores', '¡Error! Un número de teléfono debe estar formado por 10 números. ')
    .not()
    .isEmpty()
    .isNumeric()
    .isLength({ min: 10, max: 10 }),

check('direccion_proveedores', 'Error en la dirección.')
    .not()
    .isEmpty()
    .isLength({ max: 50 }),

check('contrato_proveedores', '¡Error! el contrato solo puede ser numérico.')
    .not()
    .isEmpty()
    .isNumeric(),
];