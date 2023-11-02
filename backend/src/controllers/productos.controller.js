import { pool } from "../database/conexion.js";
import {validationResult} from 'express-validator';


export const guardarProducto = async (req,res) =>{
	try{	
		let error = validationResult(req);
		if(!error.isEmpty()){
			return res.status(403).json(error)
		}
		let {fecha_caducidad_producto,cantidad_peso_producto,unidad_peso_producto,descripcion_producto,precio_producto} = req.body;
		let sql = `INSERT INTO productos (fecha_caducidad_producto, cantidad_peso_producto, unidad_peso_producto, descripcion_producto, precio_producto, fk_id_up, fk_id_tipo_producto) VALUES ('${fecha_caducidad_producto}', '${cantidad_peso_producto}', '${unidad_peso_producto}', '${descripcion_producto}', '${precio_producto}',NULL, NULL)`;
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
export const listarProductos = async (req, res) =>{
	try{
		const [result] = await pool.query('SELECT * FROM productos');
    res.status(200).json(result);
	}catch(e){
		res.status(500).json({message: 'Error en listarProductos: '+e})
	}
}
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
