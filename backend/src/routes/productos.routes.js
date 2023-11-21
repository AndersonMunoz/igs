import { Router } from "express";
import {guardarProducto,listarProductos,buscarProducto,actualizarProducto,deshabilitarProducto} from '../controllers/productos.controller.js';
import {validatorProducto} from '../validation/producto.validator.js'
import { validarToken } from "../controllers/autentificacion.controller.js";

const productoRouter = Router();

<<<<<<< HEAD
productoRouter.post('/registrar',guardarProducto);
productoRouter.get('/listar',listarProductos);
productoRouter.get('/buscar/:id',buscarProducto);
productoRouter.put('/actualizar/:id',actualizarProducto);
productoRouter.patch('/deshabilitar/:id',deshabilitarProducto);

=======
productoRouter.post('/registrar', validarToken,validatorProducto, guardarProducto);
/* productoRouter.get('/listar',listarProductos); */
productoRouter.get('/buscar/:id',buscarProducto);
productoRouter.put('/actualizar/:id',validarToken, validatorProducto,actualizarProducto);
productoRouter.patch('/deshabilitar/:id', validarToken, deshabilitarProducto);
productoRouter.get('/listar', listarProductos);
>>>>>>> development

export default productoRouter;
