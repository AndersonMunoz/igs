import { Router } from "express";
import { registroTipo_producto, editarTipo_producto, listarTipoProducto, buscarTipoProducto, deshabilitarTipo,activarTipo,listarActivoTipo } from '../controllers/tipo_producto.controllers.js';
// import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorTipo_producto } from "../validation/tipo_producto.validator.js";

const tipo_productoRouter = Router();

tipo_productoRouter.post("/registrar" ,validatorTipo_producto , registroTipo_producto );
tipo_productoRouter.get("/listar", listarTipoProducto );
tipo_productoRouter.get("/listarActivo", listarActivoTipo );
tipo_productoRouter.get("/buscar/:id", buscarTipoProducto);
tipo_productoRouter.patch('/deshabilitar/:id'/* , validarToken */, deshabilitarTipo);
tipo_productoRouter.patch('/activar/:id'/* , validarToken */, activarTipo);
tipo_productoRouter.put("/editar/:id",validatorTipo_producto, editarTipo_producto );


export default tipo_productoRouter;