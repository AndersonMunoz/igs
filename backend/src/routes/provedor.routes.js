import { Router } from "express";

import {listarProvedor, buscarProvedor, registrarProvedor, eliminarProvedor, actualizarProvedor} from '../controllers/provedor.controler.js';

const ProvedorRouter = Router();

ProvedorRouter.get('/listar', listarProvedor);
ProvedorRouter.get('/buscar/:id', buscarProvedor);
ProvedorRouter.post('/registrar', registrarProvedor);
ProvedorRouter.put('/eliminar/:id', eliminarProvedor);
ProvedorRouter.put('/actualizar/:id', actualizarProvedor);

export default ProvedorRouter;