import { Router } from "express";

import {listarProvedor,buscarProvedor,registrarProvedor,eliminarProvedor,actualizarProvedor} from '../controllers/provedor.controler.js';

const provedorRouter = Router();

provedorRouter.get('/listar', listarProvedor);
provedorRouter.get('/buscar/:id', buscarProvedor);
provedorRouter.post('/registrar', registrarProvedor);
provedorRouter.put('/eliminar/:id', eliminarProvedor);
provedorRouter.put('/actualizar/:id', actualizarProvedor);

export default provedorRouter;