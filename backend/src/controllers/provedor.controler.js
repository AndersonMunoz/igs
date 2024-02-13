import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const listarProvedor = async (req, res) => {
    try {
        const [result] = await pool.query('select * from 	proveedores ORDER BY estado DESC');
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ "status": 500, "message": `error en listar proveedores: ${e} en servidor` })
        console.log(e);
    }
}



export const buscarProvedor = async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await pool.query('select * from proveedores where id_proveedores=' + id);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ message: 'Error en buscar proveedor: ' + e })
    }
}

export const registrarProvedor = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error })
        }
        let { nombre_proveedores, telefono_proveedores, direccion_proveedores, contrato_proveedores } = req.body;
        let selectUser = "SELECT nombre_proveedores FROM proveedores WHERE contrato_proveedores= " + contrato_proveedores
        const [rows] = await pool.query(selectUser)
        if (rows.length > 0) {
            res.status(409).json({
                "status": 409, "message": "Duplicidad en contratos"
            });
        } else {
            let sql = `insert into proveedores (nombre_proveedores,telefono_proveedores,direccion_proveedores,contrato_proveedores)
                values ('${nombre_proveedores}','${telefono_proveedores}','${direccion_proveedores}','${contrato_proveedores}')`;
            const [rows] = await pool.query(sql);
            if (rows.affectedRows > 0) {
                res.status(200).json({
                    "status": 200, "message": "Se registró con éxito el Proveedor"
                });
            } else {
                res.status(401).json({
                    "status": 401, "message": "No se registró el Proveedor"
                });
            }
        }
    } catch (e) {
        res.status(500).json({ message: 'Error en guardar Provedor: ' + e })
    }
}

export const eliminarProvedor = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE proveedores SET estado = 0 WHERE id_proveedores= ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({
                "status": 200, "message": "Se deshabilitó con éxito el Proveedor"
            })
        } else {
            res.status(401).json({
                "status": 401, "message": "No se deshabilitó con éxito el proveedor."
            })
        }
    } catch (e) {
        res.status(500).json({ message: 'Error en eliminar Provedor: ' + e })
    }
}



export const actualizarProvedor = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error })
        }
        let id = req.params.id;
        let { nombre_proveedores, telefono_proveedores, contrato_proveedores, direccion_proveedores } = req.body;

        let selectUser = "SELECT nombre_proveedores FROM proveedores WHERE contrato_proveedores= " + contrato_proveedores
        const [userExist] = await pool.query(selectUser)

        if (!userExist.length > 0) {
            let sql = `update proveedores set nombre_proveedores='${nombre_proveedores}',telefono_proveedores='${telefono_proveedores}',contrato_proveedores='${contrato_proveedores}', direccion_proveedores='${direccion_proveedores}' where id_proveedores= ${id}`;
            const [rows] = await pool.query(sql);
            if (rows.affectedRows > 0) {
                res.status(200).json({
                    "status": 200, "message": "Proveedor actualizado con éxito"
                })
            } else {
                res.status(401).json({
                    "status": 401, "message": "No se actualizó el proveedor"
                })
            }
        }
        else{
            res.status(409).json({
                "status": 409, "message": "Duplicidad en contratos"
            });
        }
    } catch (e) {
        res.status(500).json({ message: 'Error interno en el servidor: ' + e })
    }
}