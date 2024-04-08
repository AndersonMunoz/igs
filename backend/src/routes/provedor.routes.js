import { Router } from "express";

import {listarProvedor,buscarProvedor,registrarProvedor,eliminarProvedor,actualizarProvedor, listarProvedorActivo,cargarImagen} from '../controllers/provedor.controler.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validarProvedor } from "../validation/validatorProvedor.js";

const provedorRouter = Router();

provedorRouter.get('/listar', validarToken, listarProvedor);
provedorRouter.get('/listarActivo', validarToken, listarProvedorActivo);
provedorRouter.get('/buscar/:id', validarToken,buscarProvedor);
provedorRouter.post('/registrar' ,cargarImagen,validarProvedor,validarToken,registrarProvedor);
provedorRouter.put('/eliminar/:id' ,validarToken , eliminarProvedor);
provedorRouter.put('/actualizar/:id',validarProvedor,validarToken,actualizarProvedor);


export default provedorRouter;