import { Router } from "express";

import {validarFacturaMovimiento} from '../validation/facturaMovimiento.validator.js';
import {guardarMovimiento,listarMovimientos,buscarMovimiento,actualizarMovimiento} from '../controllers/facturaMovimiento.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";

const facturaMovimientoRoute = Router();

facturaMovimientoRoute.post('/registrar',validarToken, validarFacturaMovimiento,guardarMovimiento);
facturaMovimientoRoute.get('/listar', listarMovimientos);
facturaMovimientoRoute.get('/buscar/:id',buscarMovimiento);
facturaMovimientoRoute.put('/actualizar/:id', validarToken, validarFacturaMovimiento,actualizarMovimiento);


export default facturaMovimientoRoute;