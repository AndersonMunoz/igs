import {check} from 'express-validator';

export const validarFacturaMovimiento = [
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('precio_movimiento','Ingrese un precio válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('estado_producto_movimiento','Ingrese un estado válido en minúscula. Valores válidos: bueno, regular y malo').matches(/^(optimo|deficiente)$/).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
/*     check('fk_id_producto','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(), */
    check('fk_id_usuario','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_proveedor','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),/* 
    check('num_lote','Ingrese un número de lote válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(), */
]

export const validarFacturaMovimientoSalida = [
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('fk_id_producto','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_usuario','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),/* 
    check('num_lote','Ingrese un número de lote válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty() */
]



export const validarFacturaMovimientoActu = [
    check('estado_producto_movimiento','Ingrese un estado válido en minúscula. Valores válidos: bueno, regular y malo').matches(/^(optimo|deficiente)$/).notEmpty(),
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('precio_movimiento','Ingrese un precio válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    /* check('num_lote','Ingrese un número de lote válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(), */
]

export const validarFacturaMovimientoActuSalida = [
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    /* check('num_lote','Ingrese un número de lote válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(), */
]