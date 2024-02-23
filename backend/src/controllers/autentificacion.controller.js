import { pool } from "../database/conexion.js";
import jwt from 'jsonwebtoken';
import CryptoJs from "crypto-js";
import { secretKey } from "../const/keys.js";

export const validarUsuario = async (req, res) => {
    try {
        let { documento, contrasena } = req.body;
        let sql = `SELECT id_usuario, email_usuario, nombre_usuario, tipo_usuario, contrasena_usuario from usuarios WHERE documento_usuario='${documento}' AND estado = 1`; // Corregir la consulta SQL, no se necesita "estado"
        const [rows] = await pool.query(sql);
        
        if (rows.length > 0) {
            const contraseñaDB = dataDecript(rows[0].contrasena_usuario).replace(/"/g, ''); 
            if (contrasena == contraseñaDB) {
                const { nombre_usuario, tipo_usuario, id_usuario } = rows[0]; // Obtener nombre y tipo de usuario
                let token = jwt.sign({ user: rows }, process.env.AUT_SECRET, { expiresIn: process.env.AUT_EXPIRE });
                return res.status(200).json({ "status": 200, token: token, id:id_usuario, nombre: nombre_usuario, tipo: tipo_usuario});
            } else {
                return res.status(401).json({ "status": 401, "message": "Error, no te hemos encontrado" });
            }
        } else {
            return res.status(401).json({ "status": 401, "message": "Error, no te hemos encontrado" });
        }
    } catch (e) {
        return res.status(500).json({ message: 'Error en validarUsuario: ' + e });
    }
}

// Función para desencriptar la contraseña
function dataDecript(encryptedPassword) {
    const bytes = CryptoJs.AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(CryptoJs.enc.Utf8);
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