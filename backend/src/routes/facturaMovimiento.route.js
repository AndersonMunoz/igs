import { Router } from "express";

import {guardarMovimiento,listarMovimientos,buscarMovimiento,actualizarMovimiento} from '../controllers/facturaMovimiento.controller.js';
const facturaMovimientoRoute = Router();

facturaMovimientoRoute.post('/registar',guardarMovimiento);
facturaMovimientoRoute.get('/listar',listarMovimientos);
facturaMovimientoRoute.get('/buscar/:id',buscarMovimiento);
facturaMovimientoRoute.put('/actualizar/:id',actualizarMovimiento);

export default facturaMovimientoRoute ;