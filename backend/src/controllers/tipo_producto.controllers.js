import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";

export const registroTipo_producto = async (req, res) => {

    try {

        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error)
        }

        let { nombre_tipo, fk_categoria_pro } = req.body;
        let sql = `insert into tipo_productos (nombre_tipo,fk_categoria_pro) values('${nombre_tipo}','${fk_categoria_pro}')`;
        console.log(sql);

        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {

            res.status(200).json({
                "status": 200,
                "menssage": " el tipo de producto  registrado  con exito "
            })
        } else {
            res.status(403).json({
                "status": 403,
                "menssage": "el tipo de producto no se puedo registrar"
            })

        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "status": "Error interno, intente nuevamente" + error
        })
    }
}
export const listarTipoProducto = async (req, res) => {
    try {
        const [result] = await pool.query
            ('SELECT t.id_tipo AS ID, t.nombre_tipo AS NombreProducto, c.nombre_categoria AS Categoría FROM tipo_productos t JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(401).json({
                "status": 401,
                "message": "No se Listo los productos"
            });

        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}

/* export const listarTipo_producto = async (req, res) => {
    try {
        const [result] = await pool.query('select * from tipo_productos');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(401).json({ 
                "status": 401,
                "message": "No se pudo listar los tipos de productos  " });
        }

    } catch (err) {
        res.status(500).json({
            massage: 'error en servidor:' + err
        })
    }

}; */
export const editarTipo_producto = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error)
        }
        let id = req.params.id;
        let { nombre_tipo, fk_categoria_pro } = req.body;

        let sql = `update tipo_productos SET nombre_tipo = '${nombre_tipo}', fk_categoria_pro= '${fk_categoria_pro}'
        where id_tipo = ${id} `;
        console.log(sql)

        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json(
                { "status": 200, "menssge": "Se actualizo con exito el tipo de producto  " });
        } else {
            res.status(401).json(
                { "status": 401, "menssge": "No se actualizo el tipo de producto  " });
        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}
