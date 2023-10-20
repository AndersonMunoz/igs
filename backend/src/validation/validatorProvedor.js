import { check } from 'express-validator';

export const validarProvedor = [
    check('nombres', 'Error en el nombre de usuario')
        .not()
        .isEmpty()
        .isString()
        .isLength({ min: 5 , max : 45}),

    check('telefono_proveedores', 'Error en el telefono de usuario')
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({min:10, max:12}),
    
    check('direccion_proveedores','la direccion es erronea')
        .not()
        .isEmpty()
        .isLength({min:5, max:50}),
    
    check('contrato_proveedores','Error en contrato')
        .not()
        .isEmpty()
        .isNumeric(),
];
