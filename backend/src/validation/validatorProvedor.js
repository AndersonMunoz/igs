import { check } from 'express-validator';

export const validarProvedor = [
    check('nombre_proveedores', 'Error en el nombre de proveedor')
    .exists()
    .not()
    .isEmpty()
    .matches(/^[A-Za-z\s']+$/)
    .isLength({ min: 5, max: 45 }),

check('telefono_proveedores', 'Error en el telefono de proveedor')
    .not()
    .isEmpty()
    .isNumeric()
    .isLength({ min: 10, max: 10 }),

check('direccion_proveedores', 'la direccion de proveedor')
    .not()
    .isEmpty()
    .isLength({ min: 5, max: 50 }),

check('contrato_proveedores', 'Error en contrato')
    .not()
    .isEmpty()
    .isNumeric(),
];