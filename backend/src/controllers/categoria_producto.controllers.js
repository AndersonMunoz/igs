import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";

export const registrocategoria_producto = async (req, res) => {

    try {

       let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        };

        let { nombre_categoria
         } = req.body;
         const CategoriaQuery = `SELECT * FROM categorias_producto WHERE nombre_categoria = '${nombre_categoria}'`;
        const [existingCategoria] = await pool.query(CategoriaQuery);
        
       
        if (existingCategoria.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "La categoria ya esta registrada"
            });
        }
        let sql = `insert into categorias_producto (nombre_categoria)
  values('${nombre_categoria}')`;

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

export const buscarCategoria = async (req, res) => {
    try {
      let id = req.params.id;
      const [result] = await pool.query(
        "SELECT * FROM categorias_producto WHERE 	id_categoria=" + id
      );
      res.status(200).json(result);
      }catch(e){
          res.status(500).json({message: 'Error en  buscar  : '+e})
      }
  }
export const listarcategoria_producto = async (req, res) => {
    try {
        const [result] = await pool.query('select * from categorias_producto');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({ "status": 204, "message": "No se pudo listar  las  categorias     " });

        }
    } catch (err) {
        res.status(500).json({
            "status": 500, "message": "Error en el servidor   "+err
        
        })
    }
};
export const listarCountCategoria = async (req, res) => {
    try {
        const [result] = await pool.query(`SELECT c.nombre_categoria AS Categoria, COUNT(tp.id_tipo) AS CantidadTiposProductos
        FROM categorias_producto c
        LEFT JOIN tipo_productos tp ON c.id_categoria = tp.fk_categoria_pro
        GROUP BY c.nombre_categoria`);
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({ "status": 204, "message": "No se pudo listar  las  categorias     " });

        }
    } catch (err) {
        res.status(500).json({
            "status": 500, "message": "Error en el servidor   "+err
        
        })
    }
};


export const listarActivo = async (req, res) => {
    try {
        const [result] = await pool.query('select * from categorias_producto WHERE estado = 1');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({ "status": 204, "message": "No se pudo listar  las  categorias     " });

        }

    } catch (err) {
        res.status(500).json({
            "status": 500, "message": "Error en el servidor   "+err
        
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

export const deshabilitarCategoria = async (req, res) => {
	try {
		let id = req.params.id;
		let sql = `UPDATE categorias_producto SET estado = 0 WHERE id_categoria  = ${id}`;
		const [rows] = await pool.query(sql);
		if (rows.affectedRows > 0) {
			res
				.status(200)
				.json({ status: 200, message: "Se deshabilitó con éxito la cetegoria " });
		} else {
			res
				.status(401)
				.json({ status: 401, message: "No se deshabilitó la cetegoria" });
		}
	} catch (e) {
		res.status(500).json({ message: "Error en deshabilitartipo la la cetegoria: " + e });
	}
};

export const activarCategoria = async (req, res) => {
	try {
		let id = req.params.id;
		let sql = `UPDATE categorias_producto SET estado = 1 WHERE id_categoria  = ${id}`;
		const [rows] = await pool.query(sql);
		if (rows.affectedRows > 0) {
			res
				.status(200)
				.json({ status: 200, message: "Se activo  con éxito  la cetegoria" });
		} else {
			res
				.status(401)
				.json({ status: 401, message: "No se activo  cetegoria " });
		}
	} catch (e) {
		res.status(500).json({ message: "Error en activarCategoria" + e });
	}
};
export const listarCategoriaItem = async (req, res) => {
    try {
        let id = req.params.id;
        const [result] = await pool.query(
            `SELECT
                p.num_lote AS Lote,
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
             WHERE c.id_categoria = ? GROUP BY Lote`,
            [id]
        );
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: "Error listarProductos: " + err.message,
        });
    }
};
