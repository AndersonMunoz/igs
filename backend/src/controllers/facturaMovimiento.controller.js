import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const guardarMovimiento = async (req, res) => {
	try {
		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error);
		}
		let { tipo_movimiento, cantidad_peso_movimiento, unidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
			nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor, num_lote } = req.body;

		if (tipo_movimiento === "entrada") {

			let sql = `
			INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento, unidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
			nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor,num_lote)
			VALUES ('${tipo_movimiento}','${cantidad_peso_movimiento}','${unidad_peso_movimiento}','${precio_movimiento}','${estado_producto_movimiento}','${nota_factura}',
		'${fecha_caducidad}','${fk_id_producto}','${fk_id_usuario}','${fk_id_proveedor}','${num_lote}');
		`;  
			let sql3 = `
                UPDATE productos
                SET cantidad_peso_producto = cantidad_peso_producto + ?,
                    unidad_peso_producto = ?,
                    precio_producto = ?
                    WHERE id_producto = ?
            `;

			const [result1, result2] = await Promise.all([
				pool.query(sql),
				pool.query(sql3, [cantidad_peso_movimiento, unidad_peso_movimiento, precio_movimiento, fk_id_producto]),
			]);

			if (result1[0].affectedRows > 0 && result2[0].affectedRows > 0) {
				res.status(200).json({
					"status": 200,
					"message": "Se registró el movimiento de entrada :D"
				}
				)
			} else {
				res.status(401).json({
					"status": 401,
					"message": "No se registro factura movimientos"
				});
			}
		} else if (tipo_movimiento === "salida") {


			let sql4 = `select cantidad_peso_producto from productos where id_producto = ${fk_id_producto}`

			let cantidadPeso = await pool.query(sql4)

			let cantidadPeso2 = cantidadPeso[0]

			let cantidad3 = cantidadPeso2[0]

			let cantidadPesoTotal = cantidad3.cantidad_peso_producto

			console.log(cantidadPesoTotal)

			if (cantidadPesoTotal < cantidad_peso_movimiento) {
				return res.status(403).json({
					"status":403,
					"mensaje":"Ya no hay suficiente stock del producto"
				})
			} else if (cantidadPesoTotal >= 0) {

				let sql10 = `
				INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento, unidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
				nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor,num_lote)
				VALUES ('${tipo_movimiento}','${cantidad_peso_movimiento}','${unidad_peso_movimiento}','${precio_movimiento}','${estado_producto_movimiento}','${nota_factura}',
				'${fecha_caducidad}','${fk_id_producto}','${fk_id_usuario}','${fk_id_proveedor}','${num_lote}');`;

				let sql6 = `UPDATE productos SET  cantidad_peso_producto = cantidad_peso_producto -${cantidad_peso_movimiento} 
				WHERE id_producto = ${fk_id_producto}`

				const [result3, result4] = await Promise.all([
					pool.query(sql10),
					pool.query(sql6)

				]);

				if (result3[0].affectedRows > 0 && result4[0].affectedRows > 0) {
					res.status(200).json({
						"status": 200,
						"message": "Se registró el movimiento  de salida:D"
					}
					)
				}else {
					res.status(401).json({
						"status": 401,
						"message": "No se registro factura movimientos"
					});
				}
			}
		}
	} catch (e) {
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
};


export const listarMovimientos = async (req, res) => {
	try {
		const [result] = await pool.query
			(
				`SELECT f.id_factura,us.nombre_usuario, f.tipo_movimiento, t.nombre_tipo, c.nombre_categoria, f.fecha_movimiento, f.cantidad_peso_movimiento, f.unidad_peso_movimiento, f.precio_movimiento, f.estado_producto_movimiento,
				(f.precio_movimiento * f.cantidad_peso_movimiento) AS PrecioTotalFactura,
				f.nota_factura,f.fecha_caducidad, pr.nombre_proveedores,f.num_lote
					FROM factura_movimiento f 
					JOIN usuarios us ON f.fk_id_usuario = us.id_usuario
					JOIN productos p ON f.fk_id_producto = p.id_producto
					JOIN proveedores pr ON f.fk_id_proveedor = pr.id_proveedores
					JOIN bodega u ON p.fk_id_up = u.id_up	
					JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
					JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria`
			);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(204).json({
				"status": 204,
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
		let { estado_producto_movimiento, nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario,num_lote } = req.body;

		let sql = `UPDATE factura_movimiento SET estado_producto_movimiento='${estado_producto_movimiento}',nota_factura='${nota_factura}',fecha_caducidad='${fecha_caducidad}',fk_id_producto='${fk_id_producto}',fk_id_usuario='${fk_id_usuario}',num_lote='${num_lote}' where id_factura=${id}`;

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


