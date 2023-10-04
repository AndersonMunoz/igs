import  router  from "express";
import {guardarProducto,listarProductos,buscarProducto,actualizarProducto,deshabilitarProducto} from '../controllers/productos.controller.js';

const productoRouter = router();

productoRouter.post('/registar',guardarProducto);
productoRouter.get('/listar',listarProductos);
productoRouter.get('/buscar/:id',buscarProducto);
productoRouter.put('/actualizar/:id',actualizarProducto);
productoRouter.patch('/deshabilitar/:id',deshabilitarProducto);

export default productoRouter;
