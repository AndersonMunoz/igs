import { Router } from "express";

import {validarFacturaMovimiento,validarFacturaMovimientoActu,validarFacturaMovimientoSalida,validarFacturaMovimientoActuSalida} from '../validation/facturaMovimiento.validator.js';
import {listarMovimientos,buscarMovimiento,actualizarMovimiento,obtenerProCategoria,obtenerUnidad,guardarMovimientoEntrada,listarMovimientosEntrada,listarMovimientosSalida,guardarMovimientoSalida,actualizarMovimientoSalida,listarProductosCaducar,obtenerValorTotalProductos} from '../controllers/facturaMovimiento.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";

const facturaMovimientoRoute = Router();
facturaMovimientoRoute.post('/registrarEntrada',validarToken,validarFacturaMovimiento, guardarMovimientoEntrada);
facturaMovimientoRoute.post('/registrarSalida',validarToken,validarFacturaMovimientoSalida, guardarMovimientoSalida);
facturaMovimientoRoute.get('/listar',validarToken,listarMovimientos);
facturaMovimientoRoute.get('/listarEntrada',validarToken,listarMovimientosEntrada);
facturaMovimientoRoute.get('/listarSalida',validarToken,listarMovimientosSalida);
facturaMovimientoRoute.get('/listarEntradaSalida',validarToken,obtenerValorTotalProductos);
facturaMovimientoRoute.get('/buscar/:id',validarToken,buscarMovimiento);
facturaMovimientoRoute.get('/listarCaducados', listarProductosCaducar);
facturaMovimientoRoute.put('/actualizar/:id',validarToken,validarFacturaMovimientoActu,actualizarMovimiento);
facturaMovimientoRoute.put('/actualizarSalida/:id',validarToken,validarFacturaMovimientoActuSalida,actualizarMovimientoSalida);
facturaMovimientoRoute.get('/buscarProCat/:id_categoria',validarToken,obtenerProCategoria);
facturaMovimientoRoute.get('/buscarUnidad/:id_producto',validarToken,obtenerUnidad);

export default facturaMovimientoRoute;