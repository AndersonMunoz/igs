import { Router } from "express";
import {guardarProducto,listarProductos,buscarProducto,actualizarProducto,deshabilitarProducto,activarProducto} from '../controllers/productos.controller.js';
import {validatorProducto} from '../validation/producto.validator.js'
import { validarToken } from "../controllers/autentificacion.controller.js";

const productoRouter = Router();

productoRouter.post('/registrar', validarToken,validatorProducto,  guardarProducto);
productoRouter.get('/listar',validarToken,listarProductos);
productoRouter.get('/buscar/:id',validarToken,buscarProducto);
productoRouter.put('/actualizar/:id',validarToken, validatorProducto ,actualizarProducto);
productoRouter.patch('/deshabilitar/:id', validarToken, deshabilitarProducto);
productoRouter.patch('/activar/:id',validarToken, activarProducto);

export default productoRouter;
