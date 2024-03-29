import { Router } from "express";
import { registroTitulado,listarTitulado,buscarTitulado,editarTitulado,deshabilitarTitulado,activarTitulado,listarTituladoActivo, listarTituladoCount} from '../controllers/titulado.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorTitulados } from "../validation/titulado.validator.js";


const tituladosRouter = Router();

tituladosRouter.post("/registrar",validatorTitulados, registroTitulado);
tituladosRouter.get("/listar",validarToken, listarTitulado);
tituladosRouter.get("/listarCount",validarToken, listarTituladoCount);
tituladosRouter.get("/listaractivo",validarToken, listarTituladoActivo);
tituladosRouter.get('/buscar/:id',validarToken, buscarTitulado);
tituladosRouter.patch('/activar/:id',validarToken, activarTitulado);
tituladosRouter.patch('/deshabilitar/:id',validarToken, deshabilitarTitulado);
tituladosRouter.put("/editar/:id",validarToken,validatorTitulados, editarTitulado);

export default tituladosRouter;