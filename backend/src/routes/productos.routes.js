import  router  from "express";
import {guardarProducto,listarProductos,buscarProducto,actualizarProducto,eliminarProducto} from '../controllers/productos.controller.js';

const productoRouter = router();

productoRouter.post('/registar',guardarProducto);
productoRouter.get('/listar',listarProductos);
productoRouter.get('/buscar/:id',buscarProducto);
productoRouter.put('/actualizar/:id',actualizarProducto);
productoRouter.patch('/eliminar/:id',eliminarProducto);

export default productoRouter;
