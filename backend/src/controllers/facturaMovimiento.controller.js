import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const guardarMovimiento = async (req,res)=>{
	try{	
		let error = validationResult(req);
        if (!error.isEmpty()){
            return res.status(400).json(error);
        }
			let{tipo_movimiento,cantidad_peso_movimiento,unidad_peso_movimiento,precio_movimiento,estado_producto_movimiento,nota_factura,fecha_caducidad_producto,fk_id_producto,fk_id_usuario,fk_id_proveedor} = req.body;
			let sql=`INSERT INTO factura_movimiento (tipo_movimiento,cantidad_peso_movimiento,unidad_peso_movimiento,precio_movimiento,estado_producto_movimiento,nota_factura,fecha_caducidad_producto,fk_id_producto,fk_id_usuario,fk_id_proveedor)
									VALUES ('${tipo_movimiento}','${cantidad_peso_movimiento}','${unidad_peso_movimiento}','${precio_movimiento}','${estado_producto_movimiento}','${nota_factura}','${fecha_caducidad_producto}','${fk_id_producto}','${fk_id_usuario}','${fk_id_proveedor}')`;
			//console.log(sql); En caso de no servir la inserción, descomente esto
			const [rows] = await pool.query(sql);
			//console.log(rows);
			if (rows.affectedRows>0){
					res.status(200).json(
							{
								"status":200,
								"message":"Se registró el movimiento :D "
							}
					)
			} else {
					res.status(401).json(
							{
									"status":401,
									"message":"NO se registró el movimiento :("
							}
					)
			}
			console.log()
	} catch (e){
			res.status(500).json({"status":500,"message":"Error en el servidor"+e});
	}
};
/* export const guardarMovimiento = async (req, res) => {
	try {
		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error);
		}
		let { tipo_movimiento, cantidad_peso_movimiento, unidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
			nota_factura, fecha_caducidad_producto, fk_id_producto, fk_id_usuario, fk_id_proveedor } = req.body;
			
		let sql = `START TRANSACTION;

		INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento, unidad_peso_movimiento, precio_movimiento, estado_producto_movimiento, nota_factura, fecha_caducidad_producto, fk_id_producto, fk_id_usuario, fk_id_proveedor)
		VALUES ('${tipo_movimiento}', '${cantidad_peso_movimiento}', '${unidad_peso_movimiento}', '${precio_movimiento}', '${estado_producto_movimiento}', '${nota_factura}', '${fecha_caducidad_producto}', '${fk_id_producto}', '${fk_id_usuario}', '${fk_id_proveedor}');
		
		UPDATE productos
		SET cantidad_peso_producto = 
			CASE
				WHEN '${tipo_movimiento}' = 'entrada' THEN cantidad_peso_producto + '${cantidad_peso_movimiento}'
				WHEN '${tipo_movimiento}' = 'salida' THEN cantidad_peso_producto - '${cantidad_peso_movimiento}'
			END
		WHERE id_producto = '${fk_id_producto}';
		
		COMMIT;

		
		`;

		//console.log(sql); En caso de no servir la inserción, descomente esto
		const [rows] = await pool.query(sql);
		//console.log(rows);
		if (rows.affectedRows > 0) {
			res.status(200).json(
				{
					"status": 200,
					"message": "Se registró el movimiento :D "
				}
			)
		} else {
			res.status(401).json(
				{
					"status": 401,
					"message": "NO se registró el movimiento :("
				}
			)
		}
	} catch (e) {
		res.status(500).json({ "status": 500, "message": "Error en el servidor" + e });
	}
}; */


export const listarMovimientos = async (req, res) => {
	try {
		const [result] = await pool.query
			(
				`SELECT us.nombre_usuario, f.tipo_movimiento, t.nombre_tipo, c.nombre_categoria, f.fecha_movimiento, f.cantidad_peso_movimiento, f.unidad_peso_movimiento, f.precio_movimiento, f.estado_producto_movimiento,
				(f.precio_movimiento * f.cantidad_peso_movimiento) AS PrecioTotalFactura,
				f.nota_factura,f.fecha_caducidad_producto, pr.nombre_proveedores
					FROM factura_movimiento f 
					JOIN usuarios us ON f.fk_id_usuario = us.id_usuario
					JOIN productos p ON f.fk_id_producto = p.id_producto
					JOIN proveedores pr ON f.fk_id_proveedor = pr.id_proveedores
					JOIN unidad_productiva u ON p.fk_id_up = u.id_up	
					JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
					JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria`
			);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(401).json({
				"status": 401,
				"message": "No se lista factura movimientos"
			});
		}

	} catch (error) {
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + error
		});
	}
}

export const buscarMovimiento = async (req, res) => {
	try {
		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error);
		}
		let id = req.params.id;
		const [result] = await pool.query('SELECT * FROM factura_movimiento WHERE id_factura = ?', [id]);

		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(404).json({
				status: 404,
				message: "No existe un movimiento con el ID proporcionado."
			});
		}
	} catch (err) {
		res.status(500).json({
			message: 'Error en buscar movimiento :(' + err
		});
	}
};

export const actualizarMovimiento = async (req, res) => {
	try {
		let id = req.params.id;
		let { estado_producto_movimiento, nota_factura, fecha_caducidad_producto, fk_id_producto, fk_id_usuario } = req.body;

		let sql = `UPDATE factura_movimiento SET estado_producto_movimiento='${estado_producto_movimiento}',nota_factura='${nota_factura}',fecha_caducidad_producto='${fecha_caducidad_producto}',fk_id_producto='${fk_id_producto}',fk_id_usuario='${fk_id_usuario}' where id_factura=${id}`;

		const [rows] = await pool.query(sql);

		if (rows.affectedRows > 0) {
			res.status(200).json({ "status": 200, "message": "Se actualizó el movimiento con éxito :D ..!!" });
		} else {
			res.status(401).json({ "status": 401, "message": "NO se actualizó el movimiento :(  ..!!" });
		}
	} catch (e) {
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
};


