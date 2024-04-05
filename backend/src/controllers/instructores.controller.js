import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

// Registrar un nuevo instructor en la base de datos
export const registroInstructor = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json(error);
        }
        let { documento_instructor, nombre_instructor } = req.body;
        const documento_instructorQuery = `SELECT * FROM  instructores  WHERE documento_instructor = '${documento_instructor}'`;
        const [existingInstructor] = await pool.query(documento_instructorQuery);

        if (existingInstructor.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El documento ya está registrado"
            });
        }
        let sql = `INSERT INTO instructores (documento_instructor, nombre_instructor) 
                   VALUES ('${documento_instructor}', '${nombre_instructor}')`;

        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                "status": 200,
                "message": "El instructor fue registrado con éxito"
            });
        } else {
            res.status(403).json({
                "status": 403,
                "message": "El instructor no se pudo registrar"
            });
        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "message": "Error interno, intente nuevamente" + error
        });
    }
}

// Listar todos los instructores en la base de datos
export const listarInstructor = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT estado, id_instructores, documento_instructor, nombre_instructor FROM instructores');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({
                "status": 204,
                "message": "No se listaron los instructores"
            });
        }
    } catch (e) {
        res.status(500).json({
            "status": 500,
            "message": "Error interno en el servidor " + e
        });
    }
}

// Contar la cantidad de instructores registrados
export const listarInstructoresCount = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT COUNT(*) AS count FROM instructores');
        if (result.length > 0) {
            res.status(200).json({ count: result[0].count });

        }
    } catch (err) {
        res.status(500).json({
            message: 'Error en servidor:' + err
        })
    }
};

// Listar los instructores activos
export const listarActivoInstructor = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT i.estado, i.id_instructores AS id, i.documento_instructor AS Documento, i.nombre_instructor AS nombre FROM instructores i');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({
                "status": 204,
                "message": "No se listaron los instructores"
            });
        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "message": "Error interno en el servidor " + e
        });
    }
}

// Buscar un instructor por su ID
export const buscarIntructor = async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await pool.query("SELECT * FROM instructores WHERE id_instructores=" + id);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: 'Error en buscar: ' + e })
    }
}

// Editar la información de un instructor
export const editarInstructor = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        let id = req.params.id;
        let { documento_instructor, nombre_instructor } = req.body;

        let sql = `UPDATE instructores SET documento_instructor = '${documento_instructor}', nombre_instructor= '${nombre_instructor}'
                   WHERE id_instructores = ${id} `;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json(
                { "status": 200, "message": "Se actualizó con éxito el instructor" });
        } else {
            res.status(401).json(
                { "status": 401, "message": "No se actualizó el instructor" });
        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "message": "Error interno en el servidor " + e
        });
    }
}

// Deshabilitar un instructor
export const deshabilitarInstructor = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE instructores SET estado = 0 WHERE id_instructores  = ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({ status: 200, message: "Se deshabilitó con éxito el instructor" });
        } else {
            res.status(401).json({ status: 401, message: "No se deshabilitó el instructor" });
        }
    } catch (e) {
        res.status(500).json({ message: "Error en deshabilitar el instructor: " + e });
    }
};

// Activar un instructor
export const activarInstructor = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE instructores SET estado = 1 WHERE id_instructores  = ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({ status: 200, message: "Se activó con éxito el instructor" });
        } else {
            res.status(401).json({ status: 401, message: "No se activó el instructor" });
        }
    } catch (e) {
        res.status(500).json({ message: "Error en activar el instructor: " + e });
    }
};
