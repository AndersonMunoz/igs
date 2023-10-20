import { Router } from "express";

import {listarProvedor,buscarProvedor,registrarProvedor,eliminarProvedor,actualizarProvedor} from '../controllers/provedor.controler.js';
import { validarToken } from "../controllers/autentificacion.controller.js";

const provedorRouter = Router();

provedorRouter.get('/listar', listarProvedor);
provedorRouter.get('/buscar/:id',buscarProvedor);
provedorRouter.post('/registrar',validarToken,registrarProvedor);
provedorRouter.put('/eliminar/:id',validarToken, eliminarProvedor);
provedorRouter.put('/actualizar/:id',validarToken, actualizarProvedor);

export default provedorRouter;