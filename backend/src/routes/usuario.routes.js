import  router  from "express";

import { registroUsuario } from "../controllers/usuario.controller.js";



const usuarioRoute = router();


usuarioRoute.post("/registro", registroUsuario );

export default usuarioRoute;