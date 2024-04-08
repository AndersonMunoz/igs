// Importamos la función 'check' desde la librería 'express-validator'.
import {check} from 'express-validator';

// Definimos un array de validaciones para la factura de movimiento.
export const validarFacturaMovimiento = [
    // Validamos que 'cantidad_peso_movimiento' sea un número mayor a 0.
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    // Validamos que 'precio_movimiento' sea un número mayor a 0.
    check('precio_movimiento','Ingrese un precio válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    // Validamos que 'estado_producto_movimiento' sea 'optimo' o 'deficiente'.
    check('estado_producto_movimiento','Ingrese un estado válido en minúscula. Valores válidos: optimo y deficiente').matches(/^(optimo|deficiente)$/).notEmpty(),
    // Validamos que 'nota_factura' tenga entre 3 y 300 caracteres.
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    // Validamos que 'fk_id_usuario' sea un número mayor a 0.
    check('fk_id_usuario','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    // Validamos que 'fk_id_proveedor' sea un número mayor a 0.
    check('fk_id_proveedor','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    // Validamos que 'fk_id_up' sea un número mayor a 0.
    check('fk_id_up','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    // Validamos que 'fk_id_tipo_producto' sea un número mayor a 0.
    check('fk_id_tipo_producto','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
];

// Definimos un array de validaciones para la factura de movimiento de salida.
export const validarFacturaMovimientoSalida = [
    // Las validaciones son similares a las anteriores, pero se añade la validación de 'destino_movimiento'.
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('fk_id_producto','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_usuario','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('destino_movimiento','Ingrese un estado válido en minúscula. Valores válidos: taller, produccion o evento').matches(/^(taller|produccion|evento)$/).notEmpty(),
];

// Definimos un array de validaciones para la actualización de la factura de movimiento.
export const validarFacturaMovimientoActu = [
    // Las validaciones son similares a las anteriores, pero se añade la validación de 'precio_movimiento'.
    check('estado_producto_movimiento','Ingrese un estado válido en minúscula. Valores válidos: optimo y deficiente').matches(/^(optimo|deficiente)$/).notEmpty(),
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('precio_movimiento','Ingrese un precio válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
];

// Definimos un array de validaciones para la actualización de la factura de movimiento de salida.
export const validarFacturaMovimientoActuSalida = [
    // Las validaciones son similares a las anteriores, pero se omite la validación de 'precio_movimiento'.
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('destino_movimiento','Ingrese un estado válido en minúscula. Valores válidos: taller, produccion o evento').matches(/^(taller|produccion|evento)$/),
];
