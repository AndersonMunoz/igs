import { check, validationResult } from 'express-validator';

// Función de validación personalizada para verificar el tipo de archivo
const validarTipoArchivo = (value, { req }) => {
    if (!req.file) {
        // Si no se ha adjuntado ningún archivo, la validación pasa sin problemas
        return true;
    }
    // Verifica si el tipo de archivo es PDF
    if (req.file.mimetype !== 'application/pdf') {
        throw new Error('El archivo debe ser de tipo PDF');
    }
    return true;
};

export const validarProvedor = [
    check('nombre_proveedores', '¡Error! Valor mínimo para el nombre 5 y máximo 45 caracteres.')
        .exists()
        .not()
        .isEmpty()
        .matches(/^[A-Za-z\s']+$/)
        .isLength({ min: 5, max: 45 }),

    check('telefono_proveedores', '¡Error! Un número de teléfono debe estar formado por 10 números positivos.')
        .not()
        .isEmpty()
        .isNumeric()
        .isLength({ min: 10, max: 10 })
        .custom(value => value >= 0),

    check('direccion_proveedores', 'Error en la dirección. Límite: 50 caracteres.')
        .not()
        .isEmpty()
        .isLength({ max: 50 }),

    check('contrato_proveedores', '¡Error! El contrato solo puede ser numérico positivo.')
        .not()
        .isEmpty()
        .isNumeric()
        .custom(value => value >= 0),

    // Validación del tipo de archivo
    check('archivo_contrato').custom(validarTipoArchivo)
];
