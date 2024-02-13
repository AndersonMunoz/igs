import { Router } from "express";

import {validarFacturaMovimiento,validarFacturaMovimientoActu,validarFacturaMovimientoSalida,validarFacturaMovimientoActuSalida} from '../validation/facturaMovimiento.validator.js';
import {listarMovimientos,buscarMovimiento,actualizarMovimiento,obtenerProCategoria,obtenerUnidad,guardarMovimientoEntrada,listarMovimientosEntrada,listarMovimientosSalida,guardarMovimientoSalida,actualizarMovimientoSalida} from '../controllers/facturaMovimiento.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";

const facturaMovimientoRoute = Router();
facturaMovimientoRoute.post('/registrarEntrada'/* validarToken ,*/,validarFacturaMovimiento, guardarMovimientoEntrada);
facturaMovimientoRoute.post('/registrarSalida'/* validarToken ,*/,validarFacturaMovimientoSalida, guardarMovimientoSalida);
facturaMovimientoRoute.get('/listar', listarMovimientos);
facturaMovimientoRoute.get('/listarEntrada', listarMovimientosEntrada);
facturaMovimientoRoute.get('/listarSalida', listarMovimientosSalida);
facturaMovimientoRoute.get('/buscar/:id',buscarMovimiento);
facturaMovimientoRoute.put('/actualizar/:id', /*validarToken, */validarFacturaMovimientoActu,actualizarMovimiento);
facturaMovimientoRoute.put('/actualizarSalida/:id', /*validarToken, */validarFacturaMovimientoActuSalida,actualizarMovimientoSalida);
facturaMovimientoRoute.get('/buscarProCat/:id_categoria',obtenerProCategoria);
facturaMovimientoRoute.get('/buscarUnidad/:id_producto',obtenerUnidad);

export default facturaMovimientoRoute;