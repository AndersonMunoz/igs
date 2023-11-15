import { Router } from "express";
import {registroUsuario,listarUsuario,buscarUsuario,actualizarEstado,activarEstado, editarUsuario} from '../controllers/cliente.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorUsuario } from "../validation/usuario.validator.js";

const usuarioRouter = Router();

usuarioRouter.post("/registrar" ,validatorUsuario , registroUsuario );
usuarioRouter.get("/listar", listarUsuario );
usuarioRouter.get("/buscar/:id", buscarUsuario );
usuarioRouter.patch("/deshabilitar/:id" ,validarToken , actualizarEstado );
usuarioRouter.patch("/activar/:id",validarToken , activarEstado );
usuarioRouter.put("/editar/:id",/* validatorUsuario, */ /* validarToken, */ editarUsuario );

export default usuarioRouter;