import { Router } from "express";
import {registroUsuario,listarUsuario,buscarUsuario,actualizarEstado,activarEstado, editarUsuario, listarUsuarioActivo, listarUsuarioCount,buscarUsuarioCedula} from '../controllers/cliente.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorUsuario } from "../validation/usuario.validator.js";

const usuarioRouter = Router();

usuarioRouter.post("/registrar" ,validatorUsuario, registroUsuario );
usuarioRouter.get("/listar", listarUsuario );
usuarioRouter.get("/listaractivo", listarUsuarioActivo );
usuarioRouter.get("/buscar/:id", buscarUsuario );
usuarioRouter.post("/buscarCedula/:documento_usuario", buscarUsuarioCedula );
usuarioRouter.put("/editar/:id",validatorUsuario, /* validarToken, */ editarUsuario );
usuarioRouter.patch("/deshabilitar/:id" /* ,validarToken */ , actualizarEstado );
usuarioRouter.patch("/activar/:id",/* validarToken , */ activarEstado );
usuarioRouter.get("/listarCount", listarUsuarioCount );


export default usuarioRouter;