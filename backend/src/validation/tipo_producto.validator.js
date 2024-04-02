import { check } from "express-validator";

export const validatorTipo_producto = [
    check('nombre_tipo', 'El nombre solo debe contener letras, espacios, apóstrofes, la letra ñ, el guion "-" y los paréntesis "()"')
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 2, max: 45 })
        .matches(/^[A-Za-zÁÉÍÓÚáéíóúÜü\sñ'()-]+$/),
    check('unidad_peso').custom((value, { req }) => {
        const unidadesValidas = ['kg', 'lb', 'gr', 'lt', 'ml', 'oz'];
        const unidadSeleccionada = req.body.unidad_peso;
        if (unidadesValidas.includes(unidadSeleccionada.toLowerCase())) {
            return true;
        } else if (unidadSeleccionada.toLowerCase().includes('unidad') || unidadSeleccionada.toLowerCase().includes('unidades')) {
            return true;
        } else {
            throw new Error('Seleccione una unidad de peso válida.');
        }
    }),
];
