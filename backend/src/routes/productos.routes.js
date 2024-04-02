import { Router } from "express";
import {guardarProducto,listarProductos,buscarProducto,actualizarProducto,obtenerValorTotalProductosFecha} from '../controllers/productos.controller.js';
import {validatorProducto} from '../validation/producto.validator.js'
import { validarToken } from "../controllers/autentificacion.controller.js";

const productoRouter = Router();

productoRouter.post('/registrar', validarToken,validatorProducto,  guardarProducto);
productoRouter.get('/listar',listarProductos);
productoRouter.get('/listarProductoTotal', obtenerValorTotalProductosFecha);
productoRouter.get('/buscar/:id',validarToken,buscarProducto);
productoRouter.put('/actualizar/:id',validarToken, validatorProducto ,actualizarProducto);


export default productoRouter;
