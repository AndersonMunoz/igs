import { Router } from 'express';
import {validarUsuario} from '../controllers/autentificacion.controller.js'

const autRouter = Router();

autRouter.post('/validar',validarUsuario);

export default autRouter;