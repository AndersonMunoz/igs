import { Router } from "express";
import { registroUnidadProductiva, listarUnidadProductiva, editarUnidadProductiva, buscarup, activarUp, deshabilitarUp } from '../controllers/unidadProductiva.controllers.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorUnidad_productiva } from "../validation/unidad_productiva.validator.js";

const unidadProductivaRouter = Router();

unidadProductivaRouter.post("/registrar",validarToken, validatorUnidad_productiva , registroUnidadProductiva);
unidadProductivaRouter.get("/listar",validarToken, listarUnidadProductiva);
unidadProductivaRouter.get('/buscar/:id',validarToken, buscarup);
unidadProductivaRouter.patch('/activar/:id',validarToken, activarUp);
unidadProductivaRouter.patch('/deshabilitar/:id',validarToken, deshabilitarUp);
unidadProductivaRouter.put("/editar/:id",validarToken, validatorUnidad_productiva, editarUnidadProductiva);

export default unidadProductivaRouter;