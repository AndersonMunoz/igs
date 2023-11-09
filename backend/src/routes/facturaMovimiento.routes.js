import { Router } from "express";

import {validarFacturaMovimiento} from '../validation/facturaMovimiento.validator.js';
import {listarMovimientos,buscarMovimiento,actualizarMovimiento} from '../controllers/facturaMovimiento.controller.js';

const facturaMovimientoRoute = Router();

facturaMovimientoRoute.post('/registrar',validarFacturaMovimiento);
facturaMovimientoRoute.get('/listar', listarMovimientos);
facturaMovimientoRoute.get('/buscar/:id',buscarMovimiento);
facturaMovimientoRoute.put('/actualizar/:id',validarFacturaMovimiento,actualizarMovimiento);


export default facturaMovimientoRoute;