import { pool } from "../database/conexion.js";
import jwt from 'jsonwebtoken';

export const validarUsuario = async (req,res) =>{
	try{
		let {documento, contrasena} = req.body;
		let sql = `SELECT id_usuario, email_usuario, nombre_usuario, tipo_usuario from usuarios estado WHERE documento_usuario='${documento}' AND contrasena_usuario = '${contrasena}'`;
		const [rows] = await pool.query(sql);
		if(rows.length > 0){
			let token = jwt.sign({user:rows},process.env.AUT_SECRET,{expiresIn:process.env.AUT_EXPIRE});
			return res.status(200).json({token:token,message:'Usuario Autorizado'});
		}else{
			res.status(401).json({"status":401,"message":"Usuario no encontrado..."})
		}
	}catch(e){
		res.status(500).json({message: 'Error en validarUsuario: '+e})
	}
}
export const validarToken = async (req,res,next) =>{
	try{
		let tokenUsuario = req.headers['token'];
		if(!tokenUsuario){
			return res.status(401).json({message:"Se requiere el token..."})
		}else{
			const decoded = jwt.verify(tokenUsuario,process.env.AUT_SECRET,(error,decoded)=>{
				if(error){
					return res.status(401).json({message:"Token invalido",autorizado:false});
				}else{
					next();
				}
			})
		}
	}catch(e){
    res.status(500).json({message: 'Error en validarToken: '+e})
  }
}