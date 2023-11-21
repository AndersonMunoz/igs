import { Router } from "express";
import {registroUnidadProductiva,listarUnidadProductiva, editarUnidadProductiva} from '../controllers/unidadProductiva.controllers.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorUnidad_productiva } from "../validation/unidad_productiva.validator.js";

const unidadProductivaRouter = Router();

unidadProductivaRouter.post("/registrar", validarToken, validatorUnidad_productiva, registroUnidadProductiva );
unidadProductivaRouter.get("/listar", listarUnidadProductiva );
unidadProductivaRouter.put("/editar/:id",validatorUnidad_productiva, validarToken, editarUnidadProductiva );

export default unidadProductivaRouter;