import { check } from "express-validator";

export const validatorTipo_producto = [
    check('nombre_tipo', 'El nombre solo debe contener letras, espacios y apóstrofes')
        .exists()
        .not()
        .isEmpty()
        .isLength({min: 2, max: 45})
        .matches(/^[A-Za-z\s']+$/),
        check('unidad_peso','Ingrese una unida de peso válida en minúscula. Valores válidos: kg, lb, gr, lt, ml').matches(/^(gr|lb|kg|ml|lt)$/).notEmpty(),
];