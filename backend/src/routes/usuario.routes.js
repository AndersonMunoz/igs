import { Router } from "express";
import {registroUsuario,listarUsuario,buscarUsuario,actualizarEstado,activarEstado, editarUsuario, listarUsuarioActivo, listarUsuarioCount,buscarUsuarioCedula, editarContrasena, editarUsuarioAjustes} from '../controllers/cliente.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorContrasena, validatorUsuario, validatorUsuarioAjustes } from "../validation/usuario.validator.js";

const usuarioRouter = Router();

usuarioRouter.post("/registrar" ,validatorUsuario,validarToken, registroUsuario );
usuarioRouter.get("/listar",validarToken, listarUsuario );
usuarioRouter.get("/listaractivo",validarToken ,listarUsuarioActivo );
usuarioRouter.get("/buscar/:id",validarToken ,buscarUsuario );
usuarioRouter.post("/buscarCedula/:documento_usuario",validarToken, buscarUsuarioCedula );
usuarioRouter.put("/editar/:id",validatorUsuario, validarToken, editarUsuario );
usuarioRouter.put("/editarajustes/:id",validatorUsuarioAjustes, validarToken, editarUsuarioAjustes );
usuarioRouter.patch("/deshabilitar/:id" ,validarToken , actualizarEstado );
usuarioRouter.patch("/activar/:id",validarToken , activarEstado );
usuarioRouter.get("/listarCount",validarToken, listarUsuarioCount );
usuarioRouter.put("/editarcontrasena/:id", validatorContrasena, validarToken, editarContrasena );


export default usuarioRouter;