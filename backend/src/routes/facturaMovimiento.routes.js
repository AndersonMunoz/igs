import { Router } from "express";

import {validarFacturaMovimiento,validarFacturaMovimientoActu,validarFacturaMovimientoSalida} from '../validation/facturaMovimiento.validator.js';
import {guardarMovimiento,listarMovimientos,buscarMovimiento,actualizarMovimiento,obtenerProCategoria,obtenerUnidad,guardarMovimientoEntrada,listarMovimientosEntrada,listarMovimientosSalida,guardarMovimientoSalida} from '../controllers/facturaMovimiento.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";

const facturaMovimientoRoute = Router();

facturaMovimientoRoute.post('/registrar'/* validarToken ,*/, validarFacturaMovimiento,guardarMovimiento);
facturaMovimientoRoute.post('/registrarEntrada'/* validarToken ,*/,validarFacturaMovimiento, guardarMovimientoEntrada);
facturaMovimientoRoute.post('/registrarSalida'/* validarToken ,*/,validarFacturaMovimientoSalida, guardarMovimientoSalida);
facturaMovimientoRoute.get('/listar', listarMovimientos);
facturaMovimientoRoute.get('/listarEntrada', listarMovimientosEntrada);
facturaMovimientoRoute.get('/listarSalida', listarMovimientosSalida);
facturaMovimientoRoute.get('/buscar/:id',buscarMovimiento);
facturaMovimientoRoute.put('/actualizar/:id', /*validarToken, */validarFacturaMovimientoActu,actualizarMovimiento);
facturaMovimientoRoute.get('/buscarProCat/:id_categoria',obtenerProCategoria);
facturaMovimientoRoute.get('/buscarUnidad/:id_producto',obtenerUnidad);

export default facturaMovimientoRoute;