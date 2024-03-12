import { pool } from "../database/conexion.js";
import { validationResult } from "express-validator";

export const guardarProducto = async (req, res) => {
  try {
    let error = validationResult(req);
    if (!error.isEmpty()) {
       return res.status(403).json({"status": 403 ,error})
    }
    let {
      descripcion_producto,
      fk_id_up,
      fk_id_tipo_producto
    } = req.body;

    // Verificar si el fk_id_tipo_producto ya existe en la tabla de productos
    const [existingProduct] = await pool.query(
      "SELECT id_producto FROM productos WHERE fk_id_tipo_producto = ?",
      [fk_id_tipo_producto]
    );

    if (existingProduct.length > 0) {
      return res.status(409).json({
        status: 409,
        message: "El tipo de producto ya existe, no se pueden registrar datos repetidos."
      });
    }

    // Si el tipo de producto no existe, procedemos con la inserción
    const sql = "INSERT INTO productos (descripcion_producto, fk_id_up, fk_id_tipo_producto) VALUES (?, ?, ?)";
    const [rows] = await pool.query(sql, [descripcion_producto, fk_id_up, fk_id_tipo_producto]);    
    if (rows.affectedRows > 0) {
      res
        .status(200)
        .json({ status: 200, message: "Se registró con éxito el producto." });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "No se pudo registrar el producto." });
    }
  } catch (e) {
    res.status(500).json({ message: "Error en guardarProducto: " + e });
  }
};

export const listarProductos = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT 
      p.id_producto, 
      t.nombre_tipo AS NombreProducto,
      f.fecha_caducidad AS FechaCaducidad,
      c.nombre_categoria AS NombreCategoria,
      p.cantidad_peso_producto AS Peso, 
      t.unidad_peso AS Unidad,
      p.descripcion_producto AS Descripcion,
      p.precio_producto AS PrecioIndividual, 
      (p.precio_producto * p.cantidad_peso_producto) AS PrecioTotal, 
      u.nombre_up AS UnidadProductiva, 
      p.estado AS estado 
    FROM productos p 
    LEFT JOIN factura_movimiento f ON p.id_producto = f.fk_id_producto
    JOIN bodega u ON p.fk_id_up = u.id_up
    JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
    JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria
    GROUP BY p.id_producto;`);
    if (result.length > 0) {
      res.status(200).json(result);
  } else {
      res.status(204).json({
          "status": 204,
          "message": "No se Listo los productos"
      });
  }
  } catch (er) {
    res.status(500).json({
      status: 500,
      menssge: "Error listarProductos " + er,
    });
  }
};

export const buscarProducto = async (req, res) => {
  try {
    let id = req.params.id;
    const [result] = await pool.query(
      "SELECT * FROM productos WHERE id_producto=" + id
    );
    res.status(200).json(result);
	}catch(e){
		res.status(500).json({message: 'Error en listarProductos: '+e})
	}
}
export const actualizarProducto = async (req,res) =>{
	try{
    let error = validationResult(req);
    if (!error.isEmpty()) {
       return res.status(403).json({"status": 403 ,error})
    }
		let id=req.params.id;
		let {descripcion_producto,precio_producto,fk_id_up,fk_id_tipo_producto} = req.body;
		let sql = `UPDATE productos SET descripcion_producto='${descripcion_producto}',precio_producto='${precio_producto}',fk_id_up='${fk_id_up}',fk_id_tipo_producto='${fk_id_tipo_producto}' WHERE id_producto=${id}`;
		const [rows] = await pool.query(sql);
		if(rows.affectedRows > 0){
			res.status(200).json({"status":200,"message":"Se actualizo con exito el producto"});
		}else{
			res.status(401).json({"status":401,"message":"No se actualizo el producto"});
		}
	}catch(e){
		res.status(500).json({message: 'Error en actualizarProducto: '+e})
	}
}
export const deshabilitarProducto = async (req, res) => {
  try {
    let id = req.params.id;
    let sql = `UPDATE productos SET estado = 0 WHERE id_producto = ${id}`;
    const [rows] = await pool.query(sql);
    if (rows.affectedRows > 0) {
      res
        .status(200)
        .json({ status: 200, message: "Se deshabilitó con éxito el producto" });
    } else {
      res
        .status(401)
        .json({ status: 401, message: "No se deshabilitó el producto" });
    }
  } catch (e) {
    res.status(500).json({ message: "Error en deshabilitarProducto: " + e });
  }
};
export const activarProducto = async (req, res) => {
  try {
    let id = req.params.id; 
    let sql = `UPDATE productos SET estado = 1 WHERE id_producto = ${id}`;
    const [rows] = await pool.query(sql);
    if (rows.affectedRows > 0) {
      res.status(200).json({ status: 200, message: "Se habilitó con éxito el producto" });
    } else {
      res.status(404).json({ status: 404, message: "No se encontró el producto para habilitar" });
    }
  } catch (e) {
    res.status(500).json({ message: "Error en activar: " + e });
  }
};

