import { pool } from "../database/conexion.js";
import {validationResult} from 'express-validator';


export const guardarProducto = async (req,res) =>{
	try{	
		let error = validationResult(req);
		if(!error.isEmpty()){
			return res.status(403).json(error)
		}
		let {fecha_caducidad_producto,cantidad_peso_producto,unidad_peso_producto,descripcion_producto,precio_producto,fk_id_up,fk_id_tipo_producto} = req.body;
		let sql = `INSERT INTO productos (fecha_caducidad_producto, cantidad_peso_producto, unidad_peso_producto, descripcion_producto, precio_producto, fk_id_up, fk_id_tipo_producto) VALUES ('${fecha_caducidad_producto}', '${cantidad_peso_producto}', '${unidad_peso_producto}','${descripcion_producto}','${precio_producto}','${fk_id_up}','${fk_id_tipo_producto}')`;
		const [rows] = await pool.query(sql);
		if(rows.affectedRows > 0){
			res.status(200).json({"status":200,"message":"Se registro con exito el producto"})
		}else{
			res.status(401).json({"status":401,"message":"No se pudo registrar el producto"})
		}
	}catch(e){
		res.status(500).json({message: 'Error en guardarProducto: '+e})
	}
}
export const listarProductos = async (req, res) => {
	try {
		const [result] = await pool.query
(
	`SELECT t.nombre_tipo AS NombreProducto, c.nombre_categoria AS NombreCategoria,
	p.fecha_caducidad_producto AS FechaCaducidad, p.cantidad_peso_producto AS Peso, 
	p.unidad_peso_producto AS Unidad, p.descripcion_producto AS Descripcion,
	p.precio_producto AS PrecioIndividual, (p.precio_producto * p.cantidad_peso_producto) AS PrecioTotal, u.nombre_up AS UnidadProductiva 
	FROM productos p 
	JOIN unidad_productiva u ON p.fk_id_up = u.id_up
	JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
	JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria
	WHERE p.estado = 1`
);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(401).json({
				"status": 401,
				"message": "No se lista productos"
			});
		}

	} catch (er) {
		res.status(500).json({
			"status": 500,
			"menssge": "Error interno en el sevidor " + er
		});
	}
}

/* export const listarProductos = async (req, res) =>{
	try{
		const [result] = await pool.query('SELECT * FROM productos');
    res.status(200).json(result);
	}catch(e){
		res.status(500).json({message: 'Error en listarProductos: '+e})
	}
} */
export const buscarProducto = async (req,res) =>{
	try{
		let id = req.params.id;
		const [result] = await pool.query('SELECT * FROM productos WHERE id_producto='+id);
		res.status(200).json(result);
	}catch(e){
		res.status(500).json({message: 'Error en buscarProducto: '+e})
	}
}
export const actualizarProducto = async (req,res) =>{
	try{
		let error = validationResult(req);
		if(!error.isEmpty()){
			return res.status(403).json(error)
		}
		let id=req.params.id;
		let {fecha_caducidad_producto,cantidad_peso_producto,unidad_peso_producto,descripcion_producto,precio_producto,fk_id_categoria,fk_id_up,fk_id_tipo_producto} = req.body;
		let sql = `UPDATE productos SET fecha_caducidad_producto='${fecha_caducidad_producto}',cantidad_peso_producto='${cantidad_peso_producto}',unidad_peso_producto='${unidad_peso_producto}',descripcion_producto='${descripcion_producto}',precio_producto='${precio_producto}',fk_id_categoria='${fk_id_categoria}',fk_id_up='${fk_id_up}',fk_id_tipo_producto='${fk_id_tipo_producto}' WHERE id_producto=${id}`;
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
					res.status(200).json({ "status": 200, "message": "Se deshabilitó con éxito el producto" });
			} else {
					res.status(401).json({ "status": 401, "message": "No se deshabilitó el producto" });
			}
	} catch (e) {
			res.status(500).json({ message: 'Error en deshabilitarProducto: ' + e });
	}
};
