import { check, validationResult } from "express-validator";
export const validatorProducto = [
    check('fecha_caducidad_producto', 'Error en la fecha de caducidad')
        .exists()
        .not()
        .isEmpty()
        .matches(/^\d{4}-\d{2}-\d{2}$/),
    check('cantidad_peso_producto', 'Error en la cantidad peso del producto')
        .exists()
        .not()
        .isEmpty()
        .isFloat({ min: 0 }),
    check('unidad_peso_producto', 'Error en el peso del producto')
        .isIn(['kg', 'lb', 'gr', 'lt', 'ml'])
        .exists()
        .not()
        .isEmpty(),
    check('descripcion_producto', 'Error en la descripcion del producto')
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 5, max: 200 }),
    check('precio_producto', 'Error en el precio del producto')
        .exists()
        .not()
        .isEmpty()
        .isFloat({ min: 0 })
];