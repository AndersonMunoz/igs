import { Router } from "express";
import {registroUsuario,listarUsuario,buscarUsuario,actualizarEstado,activarEstado} from '../controllers/usuario.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";

const usuarioRouter = Router();

usuarioRouter.post("/registrar",registroUsuario );
usuarioRouter.get("/listar", listarUsuario );
usuarioRouter.get("/buscar/:id", buscarUsuario );
usuarioRouter.patch("/deshabilitar/:id",validarToken, actualizarEstado );
usuarioRouter.patch("/activar/:id",validarToken, activarEstado );

export default usuarioRouter;