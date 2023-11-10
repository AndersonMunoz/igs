import { Router } from "express";
import {registrocategoria_producto,listarcategoria_producto, editarcategoria_producto} from '../controllers/categoria_producto.controllers.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorCategoria_producto } from "../validation/categoria_producto.validation.js";

const categoria_producto = Router();

categoria_producto.post("/registrar",validarToken, validatorCategoria_producto, registrocategoria_producto );
categoria_producto.get("/listar", listarcategoria_producto );
categoria_producto.put("/editar/:id",validatorCategoria_producto , validarToken, editarcategoria_producto );

export default categoria_producto;