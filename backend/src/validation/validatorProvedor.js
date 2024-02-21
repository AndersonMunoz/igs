import { check } from 'express-validator';

export const validarProvedor = [
    check('nombre_proveedores', '¡Error! Valor mínimo para el nombre 5 y máximo 45 caracteres. ')
        .exists()
        .not()
        .isEmpty()
        .matches(/^[A-Za-z\s']+$/)
        .isLength({ min: 5, max: 45 }),

    check('telefono_proveedores', '¡Error! Un número de teléfono debe estar formado por 10 números positivos. ')
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({ min: 10, max: 10 })
        .custom(value => value >= 0), 

    check('direccion_proveedores', 'Error en la dirección. límite: 50 caracteres')
        .not()
        .isEmpty()
        .isLength({ max: 50 }),

    check('contrato_proveedores', '¡Error! El contrato solo puede ser numérico positivo.')
        .not()
        .isEmpty()
        .isNumeric()
        .custom(value => value >= 0), 

    check('inicio_contrato', '¡Error! La fecha de inicio del contrato debe estar en formato día-mes-año y no puede ser menor que la fecha actual.')
        .not()
        .isEmpty()
        .matches(/^\d{2}-\d{2}-\d{4}$/)
        .custom(value => {
            const today = new Date();
            const [day, month, year] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);

            if (date < today) {
                throw new Error('¡Error! La fecha de inicio del contrato no puede ser menor que la fecha actual.');
            }
        }),

    check('fin_contrato', '¡Error! La fecha de fin del contrato debe estar en formato día-mes-año y no puede ser menor que la fecha actual.')
        .not()
        .isEmpty()
        .matches(/^\d{2}-\d{2}-\d{4}$/)
        .custom(value => {
            const today = new Date();
            const [day, month, year] = value.split('-').map(Number);
            const date = new Date(year, month - 1, day);

            if (date < today) {
                throw new Error('¡Error! La fecha de fin del contrato no puede ser menor que la fecha actual.');
            }
        })
];
