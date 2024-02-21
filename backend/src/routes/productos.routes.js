import { Router } from "express";
import {guardarProducto,listarProductos,buscarProducto,actualizarProducto,deshabilitarProducto,activarProducto,listarProductosCaducar} from '../controllers/productos.controller.js';
import {validatorProducto} from '../validation/producto.validator.js'
import { validarToken } from "../controllers/autentificacion.controller.js";

const productoRouter = Router();

productoRouter.post('/registrar',/*  validarToken,*/validatorProducto,  guardarProducto);
productoRouter.get('/listar', listarProductos);
productoRouter.get('/listarCaducados', listarProductosCaducar);
productoRouter.get('/buscar/:id',buscarProducto);
productoRouter.put('/actualizar/:id'/* ,validarToken*/, validatorProducto ,actualizarProducto);
productoRouter.patch('/deshabilitar/:id'/* , validarToken */, deshabilitarProducto);
productoRouter.patch('/activar/:id', activarProducto);

export default productoRouter;
