import { check } from "express-validator";

export const validatorUsuario = [
    check('documento_usuario', 'El documento debe ser mayor a 6 caracteres')
        .exists()
        .not()
        .isEmpty()
        .matches(/^\d{8,12}$/),

    check('email_usuario', 'El correo electrónico es inválido')
        .exists()
        .not()
        .isEmpty()
        .isEmail(),

    check('nombre_usuario', 'El nombre solo debe contener letras, espacios y apóstrofes')
        .exists()
        .not()
        .isEmpty()
        .matches(/^[A-Za-z\s'ñ]+$/),

    check('contrasena_usuario', 'La contraseña debe tener: un número, mayúsculas, minúsculas y ser mayor de 6 caracteres y menor de 12 caracteres')
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 6, max: 12 })
        .matches(/[a-z]/)
        .matches(/[A-Z]/)
        .matches(/\d/),

    check('tipo_usuario', '¡El tipo de usuario es requerido!')
        .not()
        .isEmpty()
        .isIn(['administrador', 'coadministrador'])
];

export const validatorContrasena = [
    check('contrasena_usuario', 'La contraseña debe tener: un número, mayúsculas, minúsculas y ser mayor de 6 caracteres y menor de 12 caracteres')
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 6, max: 12})
        .matches(/[a-z]/)
        .matches(/[A-Z]/)
        .matches(/\d/)
];

export const validatorUsuarioAjustes = [

    check('documento_usuario', 'El documento debe ser mayor a 6 caracteres')
        .exists()
        .not()
        .isEmpty()
        .matches(/^\d{8,12}$/),

    check('email_usuario', 'El correo electrónico es inválido')
        .exists()
        .not()
        .isEmpty()
        .isEmail(),

    check('nombre_usuario', 'El nombre solo debe contener letras, espacios y apóstrofes')
        .exists()
        .not()
        .isEmpty()
        .matches(/^[A-Za-z\s'ñ]+$/),
]