import { Router } from "express";
import {registroDetalles,listarDetalles,buscarDetalles} from '../controllers/detalles.controller.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorDetalles  } from "../validation/detalle.validate.js";

const detalles = Router();

detalles.post("/registrar" ,validatorDetalles, registroDetalles );
detalles.get("/listar", listarDetalles );
detalles.get('/buscar/:id',buscarDetalles );

export default detalles;