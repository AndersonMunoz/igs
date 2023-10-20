import { Router } from "express";
import {guardarProducto,listarProductos,buscarProducto,actualizarProducto,deshabilitarProducto} from '../controllers/productos.controller.js';
import {validatorProducto} from '../validation/validator.js'

const productoRouter = Router();

productoRouter.post('/registrar',guardarProducto);
productoRouter.get('/listar',listarProductos);
productoRouter.get('/buscar/:id',buscarProducto);
productoRouter.put('/actualizar/:id',validatorProducto,actualizarProducto);
productoRouter.patch('/deshabilitar/:id',deshabilitarProducto);

export default productoRouter;
