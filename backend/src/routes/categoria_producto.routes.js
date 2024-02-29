import { Router } from "express";
import {registrocategoria_producto,listarcategoria_producto, editarcategoria_producto, buscarCategoria, deshabilitarCategoria, activarCategoria, listarActivo, listarCountCategoria,listarProductos} from '../controllers/categoria_producto.controllers.js';
// import { validarToken } from "../controllers/autentificacion.controller.js";
import { validatorCategoria_producto } from "../validation/categoria_producto.validation.js";

const categoria_producto = Router();

categoria_producto.post("/registrar", validatorCategoria_producto , registrocategoria_producto );
categoria_producto.get("/listar", listarcategoria_producto );
categoria_producto.get("/listarCountCategoria", listarCountCategoria );
categoria_producto.get("/listarProducto", listarProductos );
categoria_producto.get("/listarActivo", listarActivo );
categoria_producto.get('/buscar/:id',buscarCategoria );
categoria_producto.patch('/activar/:id', activarCategoria);
categoria_producto.patch('/deshabilitar/:id', deshabilitarCategoria);
categoria_producto.put("/editar/:id",validatorCategoria_producto ,editarcategoria_producto );

export default categoria_producto;