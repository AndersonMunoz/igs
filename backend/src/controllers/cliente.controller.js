import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";


export const registroUsuario = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({"status": 403 ,error})
        }

        let { documento_usuario, email_usuario, nombre_usuario, contrasena_usuario, tipo_usuario } = req.body;

        // Consultar si el documento ya está registrado
        const documentQuery = `SELECT * FROM usuarios WHERE documento_usuario = '${documento_usuario}'`;
        const [existingUsers] = await pool.query(documentQuery);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El documento ya está registrado"
            });
        }

        // Si el documento no está registrado, proceder con la inserción
        const insertQuery = `INSERT INTO usuarios (documento_usuario, email_usuario, nombre_usuario, contrasena_usuario, tipo_usuario)
                             VALUES ('${documento_usuario}', '${email_usuario}', '${nombre_usuario}', '${contrasena_usuario}', '${tipo_usuario}')`;

        const [rows] = await pool.query(insertQuery);

        if (rows.affectedRows > 0) {
            return res.status(200).json({
                "status": 200,
                "message": "Usuario registrado con éxito"
            });
        } else {
            return res.status(401).json({
                "status": 401,
                "message": "Usuario no fue registrado, datos insuficientes"
            });
        }
    } catch (error) {
        return res.status(500).json({
            "status": 500,
            "message": "Error interno, intente nuevamente: " + error
        });
    }
}

export const listarUsuario = async (req, res) => {
    try {
        const [result] = await pool.query('select * from usuarios');
        if (result.length > 0) {
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({
            massage: 'error en servidor:' + err
        })
    }

};
export const buscarUsuario = async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await pool.query('select * from usuarios where id_usuario=' + id);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(401).json({ "status": 401, "message": "No se pudo encontar el usuario" });

        }

    } catch (err) {
        res.status(500).json({
            massage: 'error en servidor:' + err
        })
    }

};

export const editarUsuario = async (req ,res) =>{
    try {
        let error= validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error)           
        }
        let id = req.params.id;
    let {documento_usuario, email_usuario, nombre_usuario, contrasena_usuario, tipo_usuario } = req.body;

    let sql=`update usuarios SET documento_usuario = '${documento_usuario}',
    email_usuario = '${email_usuario}', nombre_usuario = '${nombre_usuario}',contrasena_usuario = '${contrasena_usuario}',tipo_usuario = '${tipo_usuario}'
    where id_usuario = ${id} `;
    console.log(sql)

    const [rows] = await pool.query(sql);
    if (rows.affectedRows>0){
        res.status(200).json(
            {"status": 200,"menssge": "Se actualizo con exito el usuario"});
    }else{
        res.status(401).json(
            {"status": 401,"menssge": "No se actualizo el usuario"});
    }

    } catch (e) {
        res.status(500).json({
        "status": 500,
        "menssge": "Error interno en el sevidor :(" + e});
    }
}

export const actualizarEstado = async (req,res) =>{
    try{
        let id = req.params.id;
        let sql = `UPDATE usuarios SET estado = 0 WHERE id_usuario= ${id}`;
        const [rows] = await pool.query(sql);
        if(rows.affectedRows > 0){
            res.status(200).json({"status":200,"message":"Se actualizo el estado del usuario"
            })
        }else{
            res.status(401).json({"status":401,"message":"No se  actualizo el estado "
            }) 
        }
    }catch(e){
        res.status(500).json({message: 'Error en actualizar estado de usuario : '+e})
     }
        }
export const activarEstado = async (req,res) =>{
    try{
        let id = req.params.id;
        let sql = `UPDATE usuarios SET estado = 1 WHERE id_usuario= ${id}`;
        const [rows] = await pool.query(sql);
        if(rows.affectedRows > 0){
            res.status(200).json({"status":200,"message":"Se actualizo el estado del usuario"
            })
        }else{
            res.status(401).json({"status":401,"message":"No se  actualizo el estado "
            }) 
        }
    }catch(e){
        res.status(500).json({message: 'Error en actualizar estado de usuario : '+e})
     }
        }