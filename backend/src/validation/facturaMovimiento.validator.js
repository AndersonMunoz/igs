import {check} from 'express-validator';

export const validarFacturaMovimiento = [
    check('tipo_movimiento','Ingrese un movimiento válido, solamente entrada o salida').matches(/^(entrada|salida)$/).notEmpty(),
    check('cantidad_peso_movimiento','Ingrese una cantidad válida, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('unidad_peso_movimiento','Ingrese una unida de peso válida en minúscula. Valores válidos: kg, lb, gr, lt, ml').matches(/^(gr|lb|kg|ml|lt)$/).notEmpty(),
    check('precio_movimiento','Ingrese un precio válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('estado_producto_movimiento','Ingrese un estado válido en minúscula. Valores válidos: bueno, regular y malo').matches(/^(bueno|regular|malo)$/).notEmpty(),
    check('nota_factura','Ingrese un descripción válida, máximo 300 caracteres y mínimo 3').isLength({min: 3,max:300}).notEmpty(),
    check('fecha_caducidad','Ingrese una fecha válida en el formato año-mes-dia').matches(/^\d{4}-\d{2}-\d{2}$/).notEmpty(),
    check('fk_id_producto','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_usuario','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
    check('fk_id_proveedor','Ingrese un ID válido, mayor a 0').isNumeric().custom(value => value > 0).notEmpty(),
]
