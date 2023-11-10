import { Router } from "express";
import { registroTipo_producto, editarTipo_producto, listarTipoProducto } from '../controllers/tipo_producto.controllers.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorTipo_producto } from "../validation/tipo_producto.validator.js";

const tipo_productoRouter = Router();

tipo_productoRouter.post("/registrar",validarToken, validatorTipo_producto, registroTipo_producto );
tipo_productoRouter.get("/listar", listarTipoProducto );
tipo_productoRouter.put("/editar/:id",validatorTipo_producto, validarToken, editarTipo_producto );


export default tipo_productoRouter;