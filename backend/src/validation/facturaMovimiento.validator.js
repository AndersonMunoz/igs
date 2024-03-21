import {check} from 'express-validator';

export const validarFacturaMovimiento = [
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('precio_movimiento','Ingrese un precio válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('estado_producto_movimiento','Ingrese un estado válido en minúscula. Valores válidos: optimo y deficiente').matches(/^(optimo|deficiente)$/).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('fk_id_usuario','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_proveedor','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_up','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_tipo_producto','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('num_lote', 'Ingrese un número de lote válido, solo letras del alfabeto español y números enteros')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/)
        .withMessage('El número de lote solo puede contener letras del alfabeto español y números enteros')
        .notEmpty()
        .withMessage('El número de lote no puede estar vacío')
]

export const validarFacturaMovimientoSalida = [
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('fk_id_producto','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_usuario','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('num_lote')
    .notEmpty().withMessage('El número de lote no puede estar vacío')
    .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/).withMessage('El número de lote solo puede contener letras del alfabeto español y números enteros')
    .isLength({ min: 1, max: 6 }).withMessage('El número de lote debe tener entre 1 y 6 caracteres')

]



export const validarFacturaMovimientoActu = [
    check('estado_producto_movimiento','Ingrese un estado válido en minúscula. Valores válidos: optimo y deficiente').matches(/^(optimo|deficiente)$/).notEmpty(),
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('precio_movimiento','Ingrese un precio válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('num_lote', 'Ingrese un número de lote válido, solo letras del alfabeto español y números enteros')
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/)
        .withMessage('El número de lote solo puede contener letras del alfabeto español y números enteros')
        .notEmpty()
        .withMessage('El número de lote no puede estar vacío').isLength({min: 1,max:6}).withMessage('El número de lote deber ser máximo 6 caracteres')
]

export const validarFacturaMovimientoActuSalida = [
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    /* check('fk_id_instructor','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_titulado','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('destino_movimiento','Ingrese un estado válido en minúscula. Valores válidos: taller, produccion o evento').matches(/^(taller|produccion|evento)$/).notEmpty(), */
    /* check('num_lote','Ingrese un número de lote válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(), */
]