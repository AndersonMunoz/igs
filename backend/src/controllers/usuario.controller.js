import { pool } from "../database/conexion.js"


export const registroUsuario = async (req, res)=>{

    try {
        let { documento,email,nombre,contraseña, tipo } = req.body;
        let sql = `insert into usuarios (documento_usuario,email_usuario,nombre_usuario, contrasena_usuario, tipo_usuario)
    values('${documento}','${email}','${nombre}','${contraseña}','${tipo}')`;
        console.log(sql);

        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            
            res.status(200).json({
                "status" : 200,
                "menssage" : "Usuario registrado con exito"
            })
        } else {
            res.status(403).json({
                "status" : 403,
                "menssage" : "Usuario no fue registrado, datos isuficientes"
            })
            
        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "status": "Error interno, intente nuevamente" + error
        })
    }

}