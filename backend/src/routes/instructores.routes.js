import { Router } from "express";
import { registroInstructor,listarInstructor,listarActivoInstructor,buscarIntructor,editarInstructor,deshabilitarInstructor,activarInstructor, listarInstructoresCount} from '../controllers/instructores.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorInstructores } from "../validation/instructores.validator.js";

const instructoresRouter = Router();

instructoresRouter.post("/registrar",validarToken,validatorInstructores, registroInstructor);
instructoresRouter.get("/listar",validarToken, listarInstructor);
instructoresRouter.get("/listarCount",validarToken, listarInstructoresCount);
instructoresRouter.get("/listarActivo",validarToken, listarActivoInstructor );
instructoresRouter.get('/buscar/:id',validarToken, buscarIntructor);
instructoresRouter.patch('/activar/:id',validarToken, activarInstructor);
instructoresRouter.patch('/deshabilitar/:id',validarToken, deshabilitarInstructor);
instructoresRouter.put("/editar/:id",validarToken,validatorInstructores, editarInstructor);

export default instructoresRouter;