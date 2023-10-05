import  router  from "express";

import { registroUsuario } from "../controllers/usuario.controller.js";
import { listarUsuario } from "../controllers/usuario.controller.js";
import { buscarUsuario } from "../controllers/usuario.controller.js";
import { actualizarEstado } from "../controllers/usuario.controller.js";
import { activarEstado } from "../controllers/usuario.controller.js";



const usuarioRoute = router();


usuarioRoute.post("/registro", registroUsuario );
usuarioRoute.get("/listar", listarUsuario );
usuarioRoute.get("/buscar/:id", buscarUsuario );
usuarioRoute.patch("/eliminar/:id", actualizarEstado );
usuarioRoute.patch("/activar/:id", activarEstado );

export default usuarioRoute;