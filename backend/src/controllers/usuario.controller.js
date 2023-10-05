import { pool } from "../database/conexion.js"


export const registroUsuario = async (req, res) => {

    try {
        let { documento, email, nombre, contraseña, tipo } = req.body;
        let sql = `insert into usuarios (documento_usuario,email_usuario,nombre_usuario, contrasena_usuario, tipo_usuario)
    values('${documento}','${email}','${nombre}','${contraseña}','${tipo}')`;
        console.log(sql);

        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {

            res.status(200).json({
                "status": 200,
                "menssage": "Usuario registrado con exito"
            })
        } else {
            res.status(403).json({
                "status": 403,
                "menssage": "Usuario no fue registrado, datos isuficientes"
            })

        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "status": "Error interno, intente nuevamente" + error
        })
    }

}

export const listarUsuario = async (req, res) => {
    try {
        const [result] = await pool.query('select * from usuarios');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(401).json({ "status": 401, "message": "No se pudo listar los usuarios " });

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