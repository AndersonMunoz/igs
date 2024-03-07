import { Router } from "express";
import { registroTipo_producto, editarTipo_producto, listarTipoProducto, buscarTipoProducto, deshabilitarTipo,activarTipo,listarActivoTipo } from '../controllers/tipo_producto.controllers.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorTipo_producto } from "../validation/tipo_producto.validator.js";

const tipo_productoRouter = Router();

tipo_productoRouter.post("/registrar",validarToken ,validatorTipo_producto , registroTipo_producto );
tipo_productoRouter.get("/listar",validarToken, listarTipoProducto );
tipo_productoRouter.get("/listarActivo",validarToken, listarActivoTipo );
tipo_productoRouter.get("/buscar/:id",validarToken, buscarTipoProducto);
tipo_productoRouter.patch('/deshabilitar/:id',validarToken , validarToken , deshabilitarTipo);
tipo_productoRouter.patch('/activar/:id',validarToken , validarToken , activarTipo);
tipo_productoRouter.put("/editar/:id",validarToken,validatorTipo_producto, editarTipo_producto );


export default tipo_productoRouter;