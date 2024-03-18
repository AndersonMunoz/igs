import { check } from "express-validator";

export const validatorDetalles = [
    check('destino_movimiento').custom((value, { req }) => {
        const destino_movimiento = ['taller', 'produccion', 'evento'];
        const detinoSeleccionado = req.body.destino_movimiento;
        if (destino_movimiento.includes(detinoSeleccionado.toLowerCase())) {
            return true;
        } else if (detinoSeleccionado.toLowerCase().includes('destino') || detinoSeleccionado.toLowerCase().includes('destinos')) {
            return true;
        } else {
            throw new Error('Seleccione un movimiento validado.');
        }
    }),
];
