import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

// Registrar un nuevo titulado en la base de datos
export const registroTitulado = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error });
        }

        let { nombre_titulado, id_ficha } = req.body;

        // Comprobar si ya existe un titulado con la misma ficha
        const id_fichaQuery = `SELECT * FROM titulados WHERE id_ficha = '${id_ficha}'`;
        const [existingid_ficha] = await pool.query(id_fichaQuery);

        if (existingid_ficha.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El id de ficha ya está registrado"
            });
        }

        // Insertar el nuevo titulado en la base de datos
        let sql = `INSERT INTO titulados (nombre_titulado, id_ficha)
                   VALUES ('${nombre_titulado}', '${id_ficha}')`;
        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                "status": 200,
                "message": "El titulado se registró con éxito"
            });
        } else {
            res.status(204).json({
                "status": 204,
                "message": "No se registró el titulado"
            });
        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "message": "Error interno, intente nuevamente" + error
        });
    }
};

// Listar todos los titulados en la base de datos
export const listarTitulado = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM titulados');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({ "status": 204, "message": "No se encontraron titulados" });
        }
    } catch (err) {
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor   " + err
        });
    }
};

// Buscar un titulado por su ID
export const buscarTitulado = async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await pool.query(
            "SELECT * FROM titulados WHERE id_titulado=" + id
        );
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: 'Error en buscar: ' + e })
    }
};

// Editar la información de un titulado
export const editarTitulado = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        let id = req.params.id;
        let { nombre_titulado, id_ficha } = req.body;

        // Comprobar si ya existe un titulado con la misma ficha
        const id_fichaQuery = `SELECT * FROM titulados WHERE id_ficha = '${id_ficha}'`;
        const [existingid_ficha] = await pool.query(id_fichaQuery);

        if (existingid_ficha.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El id de ficha ya está registrado"
            });
        }

        // Actualizar la información del titulado
        let sql = `UPDATE titulados SET nombre_titulado = '${nombre_titulado}', id_ficha ='${id_ficha}'
                   WHERE id_titulado = ${id}`;
        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            res.status(200).json(
                { "status": 200, "message": "Se actualizó con éxito el titulado" });
        } else {
            res.status(401).json(
                { "status": 401, "message": "No se actualizó el titulado" });
        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "message": "Error interno en el servidor " + e
        });
    }
};

// Contar la cantidad de titulados registrados
export const listarTituladoCount = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT COUNT(*) AS count FROM titulados');
        if (result.length > 0) {
            res.status(200).json({ count: result[0].count });
        }
    } catch (err) {
        res.status(500).json({
            message: 'Error en servidor:' + err
        });
    }
};

// Deshabilitar un titulado
export const deshabilitarTitulado = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE titulados SET estado = 0 WHERE id_titulado = ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({ status: 200, message: "Se deshabilitó con éxito el titulado" });
        } else {
            res.status(401).json({ status: 401, message: "No se deshabilitó el titulado" });
        }
    } catch (e) {
        res.status(500).json({ message: "Error en deshabilitar titulado: " + e });
    }
};

// Activar un titulado
export const activarTitulado = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE titulados SET estado = 1 WHERE id_titulado = ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({ status: 200, message: "Se activó con éxito el titulado" });
        } else {
            res.status(401).json({ status: 401, message: "No se activó el titulado" });
        }
    } catch (e) {
        res.status(500).json({ message: "Error en activar titulado: " + e });
    }
};

// Listar los titulados activos
export const listarTituladoActivo = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM titulados WHERE estado = 1');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({ "status": 204, "message": "No se encontraron titulados activos" });
        }
    } catch (err) {
        res.status(500).json({
            "status": 500, "message": "Error en el servidor   " + err
        });
    }
};
