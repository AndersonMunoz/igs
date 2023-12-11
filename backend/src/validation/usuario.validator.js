import { check } from "express-validator";

export const validatorUsuario = [
    check('documento_usuario', 'El documento debe ser un número de 10  dígitos')
        .exists()
        .not()
        .isEmpty()
        .matches(/^\d{10}$/),

    check('email_usuario', 'El correo electrónico es inválido')
        .exists()
        .not()
        .isEmpty()
        .isEmail(),

    check('nombre_usuario', 'El nombre solo debe contener letras, espacios y apóstrofes')
        .exists()
        .not()
        .isEmpty()
        .matches(/^[A-Za-z\s']+$/),

    check('contrasena_usuario', 'La contraseña debe cumplir los siguientes requisitos:')
        .exists()
        .not()
        .isEmpty()
        .isLength({ min: 6 }).withMessage('Debe tener al menos 6 caracteres.')
        .matches(/[a-z]/).withMessage('Debe contener al menos una letra minúscula.')
        .matches(/[A-Z]/).withMessage('Debe contener al menos una letra mayúscula.')
        .matches(/\d/).withMessage('Debe contener al menos un número.'),
        

    check('tipo_usuario', 'el tipo de usuario es requerido o !!!')
        .not()
        .isEmpty()
        .isIn(['administrador','coadministrador'])
];