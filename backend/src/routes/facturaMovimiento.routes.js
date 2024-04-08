// Importación del enrutador y las funciones controladoras
import { Router } from "express";
import { validarFacturaMovimiento, validarFacturaMovimientoActu, validarFacturaMovimientoSalida, validarFacturaMovimientoActuSalida } from '../validation/facturaMovimiento.validator.js';
import { listarMovimientos, buscarMovimiento, actualizarMovimiento, obtenerProCategoria, obtenerUnidad, guardarMovimientoEntrada, listarMovimientosEntrada, listarMovimientosSalida, guardarMovimientoSalida, actualizarMovimientoSalida, listarProductosCaducar, obtenerValorTotalProductos, obtenerProProductos, buscarMovimientoDetalle } from '../controllers/facturaMovimiento.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";

// Creación del enrutador para las rutas relacionadas con la factura de movimientos
const facturaMovimientoRoute = Router();

// Rutas para registrar movimientos de entrada y salida
facturaMovimientoRoute.post('/registrarEntrada', validarToken, validarFacturaMovimiento, guardarMovimientoEntrada);
facturaMovimientoRoute.post('/registrarSalida', validarToken, validarFacturaMovimientoSalida, guardarMovimientoSalida);

// Rutas para listar movimientos
facturaMovimientoRoute.get('/listar', validarToken, listarMovimientos);
facturaMovimientoRoute.get('/listarEntrada', validarToken, listarMovimientosEntrada);
facturaMovimientoRoute.get('/listarSalida', validarToken, listarMovimientosSalida);

// Rutas para obtener información sobre movimientos de entrada y salida
facturaMovimientoRoute.get('/listarEntradaSalida', validarToken, obtenerValorTotalProductos);
facturaMovimientoRoute.get('/buscarDetalleMovimiento/:id', validarToken, buscarMovimientoDetalle);
facturaMovimientoRoute.get('/buscar/:id', validarToken, buscarMovimiento);

// Ruta para listar productos caducados
facturaMovimientoRoute.get('/listarCaducados', listarProductosCaducar);

// Rutas para actualizar movimientos de entrada y salida
facturaMovimientoRoute.put('/actualizar/:id', validarToken, validarFacturaMovimientoActu, actualizarMovimiento);
facturaMovimientoRoute.put('/actualizarSalida/:id', validarToken, validarFacturaMovimientoActuSalida, actualizarMovimientoSalida);

// Rutas para buscar productos por categoría, unidad y productos disponibles
facturaMovimientoRoute.get('/buscarProCat/:id_categoria', validarToken, obtenerProCategoria);
facturaMovimientoRoute.get('/buscarUnidad/:id_producto', validarToken, obtenerUnidad);
facturaMovimientoRoute.get('/buscarProPro/:id_categoria', validarToken, obtenerProProductos);

export default facturaMovimientoRoute;
