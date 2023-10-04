import { Router } from "express";

import {listarProvedor, buscarProvedor, registrarProvedor, eliminarProvedor, actualizarProvedor} from '../controllers/provedor.controler.js';

const ProvedorRouter = Router();

ProvedorRouter.get('/listar', listarProvedor);
ProvedorRouter.get('/buscar', buscarProvedor);
ProvedorRouter.post('/registrar', registrarProvedor);
ProvedorRouter.put('/eliminar', eliminarProvedor);
ProvedorRouter.put('/actualizar', actualizarProvedor);

export default ProvedorRouter;