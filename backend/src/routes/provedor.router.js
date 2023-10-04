import { Router } from "express";

import {listarprovedor, buscarprovedor, registrarprovedor, eliminarprovedor, actualizarprovedor} from '../controllers/provedor.controler';

const provedorRouter = Router();

provedorRouter.get('/listar', listarprovedor);
provedorRouter.get('/buscar', buscarprovedor);
provedorRouter.get('/registrar', registrarprovedor);
provedorRouter.get('/eliminar', eliminarprovedor);
provedorRouter.get('/actualizar', actualizarprovedor);

export default provedorRouter;