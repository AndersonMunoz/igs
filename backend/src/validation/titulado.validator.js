import { check } from "express-validator";
// let idFichaUtilizados = [];
export const validatorTitulados = [
    check('nombre_titulado', 'El nombre solo debe contener letras, espacios y apóstrofes')
        .exists()
        .not()
        .isEmpty()
        .matches(/^[A-Za-z\s'ñ]+$/),
            

    // check('id_ficha', 'El ID de ficha ya está en uso')
    //     .custom((value) => {
    //         if (idFichaUtilizados.includes(value)) {
    //             throw new Error('El ID de ficha ya está en uso');
    //         }
    //         idFichaUtilizados.push(value);
    //         return true;
    //     })
];



