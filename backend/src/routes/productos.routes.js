import { Router } from "express";
import {guardarProducto,listarProductos,buscarProducto,actualizarProducto,deshabilitarProducto} from '../controllers/productos.controller.js';
// import {validatorProducto} from '../validation/producto.validator.js'

const productoRouter = Router();

productoRouter.post('/registrar',guardarProducto);
/* productoRouter.get('/listar',listarProductos); */
productoRouter.get('/buscar/:id',buscarProducto);
productoRouter.put('/actualizar/:id',actualizarProducto);
productoRouter.patch('/deshabilitar/:id',deshabilitarProducto);
productoRouter.get('/listar', listarProductos);

export default productoRouter;
