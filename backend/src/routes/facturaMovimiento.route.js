import { Router } from "express";

import {guardarFactura} from '../controllers/facturaMovimiento.controller.js';
const facturaMovimientoRoute = Router();

facturaMovimientoRoute.post('/registar',guardarFactura);

export default facturaMovimientoRoute ;