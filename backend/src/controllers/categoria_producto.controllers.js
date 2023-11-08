import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";

export const registrocategoria_producto = async (req, res) => {

    try {

        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error)
        }

        let { nombre_categoria } = req.body;
        let sql = `insert into categorias_producto (nombre_categoria)
  values('${nombre_categoria}')`;
        console.log(sql);

        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {

            res.status(200).json({
                "status": 200,
                "menssage": " el producto  de categoria fue  registrado  con exito "
            })
        } else {
            res.status(403).json({
                "status": 403,
                "menssage": "el producto  de categoria  no se puedo registrar"
            })

        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "status": "Error interno, intente nuevamente" + error
        })
    }

}

export const listarcategoria_producto = async (req, res) => {
    try {
        const [result] = await pool.query('select * from categorias_producto');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(401).json({ "status": 401, "message": "No se pudo listar  las  categoria  de productos   " });

        }

    } catch (err) {
        res.status(500).json({
            massage: 'error en servidor:' + err
        })
    }

};
export const editarcategoria_producto = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error)
        }
        let id = req.params.id;
        let { nombre_categoria } = req.body;

        let sql = `UPDATE categorias_producto SET nombre_categoria = '${nombre_categoria}'
        WHERE id_categoria = ${id}`;
        console.log(sql)

        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json(
                { "status": 200, "menssge": "Se actualizo con exito la categoria  de producto   " });
        } else {
            res.status(401).json(
                { "status": 401, "menssge": "No se actualizo la  categoria de producto  " });
        }
    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}