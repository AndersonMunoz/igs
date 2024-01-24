import { Router } from "express";
import { registroUnidadProductiva, listarUnidadProductiva, editarUnidadProductiva, buscarup, activarUp, deshabilitarUp } from '../controllers/unidadProductiva.controllers.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorUnidad_productiva } from "../validation/unidad_productiva.validator.js";

const unidadProductivaRouter = Router();

unidadProductivaRouter.post("/registrar", validatorUnidad_productiva , registroUnidadProductiva);
unidadProductivaRouter.get("/listar", listarUnidadProductiva);
unidadProductivaRouter.get('/buscar/:id', buscarup);
unidadProductivaRouter.patch('/activar/:id', activarUp);
unidadProductivaRouter.patch('/deshabilitar/:id', deshabilitarUp);
unidadProductivaRouter.put("/editar/:id", validatorUnidad_productiva, editarUnidadProductiva);

export default unidadProductivaRouter;