import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";
import { dataEncript } from "./encryp/encryp.js";


export const registroUsuario = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error });
        }

        let { documento_usuario, email_usuario, nombre_usuario, contrasena_usuario, tipo_usuario } = req.body;

        // Encriptar la contraseña
        contrasena_usuario = dataEncript(contrasena_usuario);

        const documentQuery = `SELECT * FROM usuarios WHERE documento_usuario = '${documento_usuario}'`;
        const [existingUsers] = await pool.query(documentQuery);

        const emailQuery = `SELECT * FROM usuarios WHERE email_usuario = '${email_usuario}'`;
        const [existingEmail] = await pool.query(emailQuery);

        if (existingUsers.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El documento ya está registrado"
            });
        }
        if (existingEmail.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El email ya está registrado"
            });
        }

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
            message: 'error en servidor:' + err
        })
    }

};

export const listarUsuarioActivo = async (req, res) => {

    try {
        const [result] = await pool.query('select * from usuarios where estado = 1');
        if (result.length > 0) {
            res.status(200).json(result);
        }
    } catch (err) {
        res.status(500).json({
            message: 'error en servidor:' + err
        })
    }

}
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

export const editarUsuario = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error })
        }

        let id = req.params.id;

        let { documento_usuario, email_usuario, contrasena_usuario, nombre_usuario, tipo_usuario } = req.body;

        let sql = `SELECT documento_usuario, email_usuario, contrasena_usuario, nombre_usuario, tipo_usuario FROM usuarios WHERE id_usuario = ${id}`;
        const [existingUser] = await pool.query(sql);
   
        // Verificar si el usuario existe
        if (existingUser.length === 0) {
            return res.status(404).json({
                "status": 404,
                "message": "El usuario no existe"
            });
        }

        // Verificar duplicidad de documento solo si el documento se está actualizando
        if (documento_usuario !== existingUser[0].documento_usuario) {
            const documentQuery = `SELECT * FROM usuarios WHERE documento_usuario = '${documento_usuario}' AND id_usuario != ${id}`;
            const [existingDocument] = await pool.query(documentQuery);

            if (existingDocument.length > 0) {
                return res.status(409).json({
                    "status": 409,
                    "message": "El documento ya está registrado"
                });
            }
        }

        // Verificar duplicidad de correo electrónico solo si el correo se está actualizando
        if (email_usuario !== existingUser[0].email_usuario) {
            const emailQuery = `SELECT * FROM usuarios WHERE email_usuario = '${email_usuario}' AND id_usuario != ${id}`;
            const [existingEmail] = await pool.query(emailQuery);

            if (existingEmail.length > 0) {
                return res.status(409).json({
                    "status": 409,
                    "message": "El correo electrónico ya está registrado"
                });
            }
        }
        
        sql = `UPDATE usuarios SET documento_usuario = '${documento_usuario}',
            email_usuario = '${email_usuario}', nombre_usuario = '${nombre_usuario}',
            contrasena_usuario = '${contrasena_usuario = dataEncript(contrasena_usuario)}', tipo_usuario = '${tipo_usuario}'
            WHERE id_usuario = ${id}`;

        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            return res.status(200).json({
                "status": 200,
                "message": "Se actualizó con éxito el usuario"
            });
        } else {
            return res.status(401).json({
                "status": 401,
                "message": "No se actualizó el usuario"
            });
        }
    } catch (e) {
        return res.status(500).json({
            "status": 500,
            "message": "Error interno en el servidor: " + e.message
        });
    }
};

export const listarUsuarioCount = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT COUNT(*) AS count FROM usuarios');
        if (result.length > 0) {
            res.status(200).json({ count: result[0].count });

        }
    } catch (err) {
        res.status(500).json({
            message: 'Error en servidor:' + err
        })
    }
};

export const actualizarEstado = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE usuarios SET estado = 0 WHERE id_usuario= ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({
                "status": 200, "message": "Se actualizo el estado del usuario"
            })
        } else {
            res.status(401).json({
                "status": 401, "message": "No se  actualizo el estado "
            })
        }
    } catch (e) {
        res.status(500).json({ message: 'Error en actualizar estado de usuario : ' + e })
    }
}
export const activarEstado = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE usuarios SET estado = 1 WHERE id_usuario= ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({
                "status": 200, "message": "Se actualizo el estado del usuario"
            })
        } else {
            res.status(401).json({
                "status": 401, "message": "No se  actualizo el estado "
            })
        }
    } catch (e) {
        res.status(500).json({ message: 'Error en actualizar estado de usuario : ' + e })
    }
}