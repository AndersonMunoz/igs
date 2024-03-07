import { Router } from "express";
import {registrocategoria_producto,listarcategoria_producto, editarcategoria_producto, buscarCategoria, deshabilitarCategoria, activarCategoria, listarActivo, listarCountCategoria,listarCategoriaItem} from '../controllers/categoria_producto.controllers.js';
import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorCategoria_producto } from "../validation/categoria_producto.validation.js";

const categoria_producto = Router();

categoria_producto.post("/registrar",validarToken, validatorCategoria_producto , registrocategoria_producto );
categoria_producto.get("/listar",validarToken, listarcategoria_producto );
categoria_producto.get("/listarCountCategoria",validarToken, listarCountCategoria );
categoria_producto.get("/listarCategoriaItem/:id",validarToken, listarCategoriaItem );
categoria_producto.get("/listarActivo",validarToken, listarActivo );
categoria_producto.get('/buscar/:id',validarToken,buscarCategoria );
categoria_producto.patch('/activar/:id',validarToken, activarCategoria);
categoria_producto.patch('/deshabilitar/:id',validarToken, deshabilitarCategoria);
categoria_producto.put("/editar/:id",validarToken,validatorCategoria_producto ,editarcategoria_producto );

export default categoria_producto;