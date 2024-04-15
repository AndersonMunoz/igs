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
      MAX(f.fecha_caducidad) AS FechaCaducidad,
      c.nombre_categoria AS NombreCategoria,
      p.cantidad_peso_producto AS Cantidad, 
      t.unidad_peso AS Unidad,
      MAX(f.nota_factura) AS Descripcion,
      MAX(f.precio_movimiento) AS PrecioIndividual, 
      SUM(precio_total_mov) AS PrecioTotal,
      u.nombre_up AS UnidadProductiva, 
      p.estado AS estado 
    FROM productos p 
    LEFT JOIN factura_movimiento f ON p.id_producto = f.fk_id_producto
    LEFT JOIN bodega u ON p.fk_id_up = u.id_up
    LEFT JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
    LEFT JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria
    GROUP BY p.id_producto`);
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
		let {fk_id_up} = req.body;
		let sql = `UPDATE productos SET fk_id_up='${fk_id_up}' WHERE id_producto=${id}`;
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
export const obtenerValorTotalProductosFecha = async (req, res) => {
  try {
    const [resultEntradas] = await pool.query(`SELECT COUNT(tipo_movimiento) AS total_entradas FROM factura_movimiento WHERE tipo_movimiento = 'entrada'`);
    const [resultSalidas] = await pool.query(`SELECT COUNT(tipo_movimiento) AS total_salidas FROM factura_movimiento WHERE tipo_movimiento = 'salida'`);

    let sql = `
    SELECT 
    p.id_producto,
    t.nombre_tipo AS nombre_producto, 
    c.nombre_categoria AS nombre_categoria, 
    SUM(f.precio_total_mov) AS precio_total, 
    MAX(f.fecha_movimiento) AS ultima_fecha_movimiento,
    GROUP_CONCAT(f.fecha_movimiento ORDER BY f.fecha_movimiento) AS todas_fechas_movimiento,
    SUM(CASE WHEN f.tipo_movimiento = 'entrada' THEN 1 ELSE 0 END) AS total_entradas,
    SUM(CASE WHEN f.tipo_movimiento = 'salida' THEN 1 ELSE 0 END) AS total_salidas
FROM 
    factura_movimiento f 
LEFT JOIN 
    productos p ON p.id_producto = f.fk_id_producto 
LEFT JOIN 
    usuarios u ON u.id_usuario = f.id_factura 
LEFT JOIN 
    tipo_productos t ON t.id_tipo = p.fk_id_tipo_producto 
LEFT JOIN 
    categorias_producto c ON c.id_categoria = t.fk_categoria_pro
GROUP BY 
    p.id_producto, nombre_categoria, nombre_producto;
 `;

    const [rows] = await pool.query(sql);

    if (rows.length > 0) {
        const totalEntradas = resultEntradas[0].total_entradas || 0;
        const totalSalidas = resultSalidas[0].total_salidas || 0;

        const valorTotalProductos = {
            "entraron": totalEntradas,
            "salieron": totalSalidas,
            "primera_fecha_movimiento_primer_producto": rows[0].primera_fecha_movimiento,
            "productos": rows
        };
        res.status(200).json(valorTotalProductos);
    } else {
        res.status(204).json({ status: 204, message: "No se encontraron datos" });
    }
} catch (error) {
    console.error("Error al obtener el valor total de los productos:", error);
    res.status(500).json({ "status": 500, "message": "Error en el servidor", error });
}



};