import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

// Registra una nueva categoría de producto en la base de datos
export const registrocategoria_producto = async (req, res) => {

    try {

       let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        };

        let { nombre_categoria,tipo_categoria,codigo_categoria
         } = req.body;
         const CategoriaQuery = `SELECT * FROM categorias_producto WHERE nombre_categoria = '${nombre_categoria}'`;
        const [existingCategoria] = await pool.query(CategoriaQuery);
        const CosigoQuery = `SELECT * FROM categorias_producto WHERE codigo_categoria = '${codigo_categoria}'`;
        const [existingCodigo] = await pool.query(CosigoQuery);
        
       
        if (existingCategoria.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "La categoria ya esta registrada"
            });
        }
        if (existingCodigo.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El codigo ya esta regirtado"
            });
        }
        let sql = `insert into categorias_producto (nombre_categoria,tipo_categoria,codigo_categoria)
  values('${nombre_categoria}','${tipo_categoria}','${codigo_categoria}')`;

        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {

            res.status(200).json({
                "status": 200,
                "menssage": " La categoria fue  registrada  con exito "
            })
        } else {
            res.status(403).json({
                "status": 403,
                "menssage": "La categoria  no se puedo registrar"
            })

        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "status": "Error interno, intente nuevamente" + error
        })
    }

}

// Busca una categoría de producto por su ID en la base de datos
export const buscarCategoria = async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await pool.query(
            "SELECT * FROM categorias_producto WHERE id_categoria=" + id
        );
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({message: 'Error en buscar: ' + e});
    }
};

// Lista todas las categorías de productos disponibles en la base de datos
export const listarcategoria_producto = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM categorias_producto');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({"status": 204, "message": "No se pudo listar las categorías"});
        }
    } catch (err) {
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor " + err
        });
    }
};

// Lista la cantidad de tipos de productos asociados a cada categoría
export const listarCountCategoria = async (req, res) => {
    try {
        const [result] = await pool.query(`SELECT c.nombre_categoria AS Categoria, COUNT(tp.id_tipo) AS CantidadTiposProductos
            FROM categorias_producto c
            LEFT JOIN tipo_productos tp ON c.id_categoria = tp.fk_categoria_pro
            GROUP BY c.nombre_categoria`);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({"status": 204, "message": "No se pudo listar las categorías"});
        }
    } catch (err) {
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor " + err
        });
    }
};

// Lista solo las categorías de productos activas en la base de datos
export const listarActivo = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM categorias_producto WHERE estado = 1');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({"status": 204, "message": "No se pudo listar las categorías"});
        }
    } catch (err) {
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor " + err
        });
    }
};

// Edita una categoría de producto existente en la base de datos
export const editarcategoria_producto = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error)
        }   
        let id = req.params.id;
        let { nombre_categoria,tipo_categoria,codigo_categoria } = req.body;

        let sql = `UPDATE categorias_producto SET nombre_categoria = '${nombre_categoria}',tipo_categoria='${tipo_categoria}',codigo_categoria='${codigo_categoria}'
        WHERE id_categoria = ${id}`;
        

        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json(
                { "status": 200, "menssge": "Se actualizo con exito la categoria    " });
        } else {
            res.status(403).json(
                { "status": 403, "menssge": "No se actualizo la  categoria   " });
        }
    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}

// Deshabilita una categoría de producto en la base de datos
export const deshabilitarCategoria = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE categorias_producto SET estado = 0 WHERE id_categoria = ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({"status": 200, "message": "Se deshabilitó con éxito la categoría"});
        } else {
            res.status(401).json({"status": 401, "message": "No se deshabilitó la categoría"});
        }
    } catch (e) {
        res.status(500).json({"message": "Error en deshabilitar la categoría: " + e});
    }
};

// Activa una categoría de producto que previamente fue deshabilitada
export const activarCategoria = async (req, res) => {
    try {
        let id = req.params.id;
        let sql = `UPDATE categorias_producto SET estado = 1 WHERE id_categoria = ${id}`;
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json({"status": 200, "message": "Se activó con éxito la categoría"});
        } else {
            res.status(401).json({"status": 401, "message": "No se activó la categoría"});
        }
    } catch (e) {
        res.status(500).json({"message": "Error en activar la categoría: " + e});
    }
};

// Lista los productos asociados a una categoría específica
export const listarCategoriaItem = async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await pool.query(
            `SELECT
                c.id_categoria,
                c.nombre_categoria AS NombreCategoria,
                p.cantidad_peso_producto AS Cantidad,
                t.nombre_tipo AS NombreProducto,
                t.unidad_peso AS Unidad,
                f.fecha_movimiento AS FechaIngreso,
                f.fecha_caducidad AS FechaCaducidad,
                f.nota_factura AS Descripcion
            FROM categorias_producto c
            JOIN tipo_productos t ON t.fk_categoria_pro = c.id_categoria
            JOIN productos p ON p.fk_id_tipo_producto = t.id_tipo
            LEFT JOIN factura_movimiento f ON p.id_producto = f.fk_id_producto
            WHERE c.id_categoria = ? GROUP BY NombreCategoria`,
            [id]
        );
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            "status": 500,
            "message": "Error listarProductos: " + err.message,
        });
    }
};