import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const guardarMovimientoEntrada = async (req,res) => {
	try {
		let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
		
		let {cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
			nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor, num_lote } = req.body;
			const loteQuery = `SELECT * FROM factura_movimiento WHERE num_lote = '${num_lote}'`;
        	const [existingLote] = await pool.query(loteQuery);
        if (existingLote.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El lote ya está registrado"
            });
        }
			let sql = `
			INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento, nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor, num_lote)
			VALUES ('entrada', '${cantidad_peso_movimiento}', '${precio_movimiento}', '${estado_producto_movimiento}', '${nota_factura}', '${fecha_caducidad}', '${fk_id_producto}', '${fk_id_usuario}', '${fk_id_proveedor}', '${num_lote}');`;  
			let sql3 = `
                UPDATE productos
                SET cantidad_peso_producto = cantidad_peso_producto + ?,
                    precio_producto = ?
                    WHERE id_producto = ?
            `;

			const [result1, result2] = await Promise.all([
				pool.query(sql),
				pool.query(sql3, [cantidad_peso_movimiento, precio_movimiento, fk_id_producto]),
			]);

			if (result1[0].affectedRows > 0 && result2[0].affectedRows > 0) {
				res.status(200).json({
					"status": 200,
					"message": "¡Se registró el movimiento de entrada!"
				}
				)
			} else {
				res.status(401).json({
					"status": 401,
					"message": "¡No se registro movimiento de entrada!"
				});
			}
	} catch (e) {
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
}

export const guardarMovimientoSalida = async (req,res)=> {
	try {
		let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
		let {cantidad_peso_movimiento, nota_factura, fk_id_producto, fk_id_usuario, num_lote} = req.body;
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
				INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento,
				nota_factura, fk_id_producto, fk_id_usuario,num_lote)
				VALUES ('salida','${cantidad_peso_movimiento}','${nota_factura}',
				'${fk_id_producto}','${fk_id_usuario}','${num_lote}');`;

				let sql6 = `UPDATE productos SET cantidad_peso_producto = cantidad_peso_producto -${cantidad_peso_movimiento} 
				WHERE id_producto = ${fk_id_producto}`

				const [result3, result4] = await Promise.all([
					pool.query(sql10),
					pool.query(sql6)

				]);

				if (result3[0].affectedRows > 0 && result4[0].affectedRows > 0) {
					res.status(200).json({
						"status": 200,
						"message": "¡Se registró el movimiento  de salida!"
					}
					)
				}else {
					res.status(401).json({
						"status": 401,
						"message": "¡No se registro movimiento de salida!"
					});
				}
			}
	} catch (e) {
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
}

export const guardarMovimiento = async (req, res) => {
	try {
		let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
		let { tipo_movimiento, cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
			nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor, num_lote } = req.body;

		if (tipo_movimiento === "entrada") {

			let sql = `
			INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento,  precio_movimiento, estado_producto_movimiento,
			nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor,num_lote)
			VALUES ('${tipo_movimiento}','${cantidad_peso_movimiento}','${precio_movimiento}','${estado_producto_movimiento}','${nota_factura}',
		'${fecha_caducidad}','${fk_id_producto}','${fk_id_usuario}','${fk_id_proveedor}','${num_lote}');
		`;  
			let sql3 = `
                UPDATE productos
                SET cantidad_peso_producto = cantidad_peso_producto + ?,
                    precio_producto = ?
                    WHERE id_producto = ?
            `;

			const [result1, result2] = await Promise.all([
				pool.query(sql),
				pool.query(sql3, [cantidad_peso_movimiento, precio_movimiento, fk_id_producto]),
			]);

			if (result1[0].affectedRows > 0 && result2[0].affectedRows > 0) {
				res.status(200).json({
					"status": 200,
					"message": "¡Se registró el movimiento de entrada!"
				}
				)
			} else {
				res.status(401).json({
					"status": 401,
					"message": "¡No se registro movimiento de salida!"
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
				INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
				nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario, fk_id_proveedor,num_lote)
				VALUES ('${tipo_movimiento}','${cantidad_peso_movimiento}','${precio_movimiento}','${estado_producto_movimiento}','${nota_factura}',
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
						"message": "¡Se registró el movimiento de salida!"
					}
					)
				}else {
					res.status(401).json({
						"status": 401,
						"message": "¡No se registro movimiento de salida!"
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
		let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
		const [result] = await pool.query
		(
			`SELECT f.id_factura,us.nombre_usuario, f.tipo_movimiento, t.nombre_tipo, c.nombre_categoria, f.fecha_movimiento, f.cantidad_peso_movimiento, t.unidad_peso, CASE 
			WHEN f.tipo_movimiento = 'salida' AND (f.precio_movimiento IS NULL OR f.precio_movimiento = 0) THEN 'No aplica'
			ELSE CAST(f.precio_movimiento AS CHAR)
		END as precio_movimiento, CASE 
			WHEN f.tipo_movimiento = 'salida' AND f.estado_producto_movimiento IN ('bueno', 'malo', 'regular') THEN 'No aplica'
			ELSE f.estado_producto_movimiento
		END as estado_producto_movimiento,
			(f.precio_movimiento * f.cantidad_peso_movimiento) AS PrecioTotalFactura,
			f.nota_factura,CASE 
			WHEN f.fecha_caducidad = '0000-00-00' THEN 'No aplica'
			ELSE f.fecha_caducidad
		END as fecha_caducidad, CASE 
			WHEN pr.id_proveedores IS NULL OR pr.id_proveedores = 0 THEN 'No aplica'
			ELSE pr.nombre_proveedores
		END as nombre_proveedores,f.num_lote
			FROM factura_movimiento f 
			JOIN usuarios us ON f.fk_id_usuario = us.id_usuario
			JOIN productos p ON f.fk_id_producto = p.id_producto
			LEFT JOIN proveedores pr ON f.fk_id_proveedor = pr.id_proveedores
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

export const listarMovimientosEntrada = async (req, res) => {
	try {
		let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
		const [result] = await pool.query
			(
				`SELECT f.id_factura,us.nombre_usuario, f.tipo_movimiento, t.nombre_tipo, c.nombre_categoria, f.fecha_movimiento, f.cantidad_peso_movimiento, t.unidad_peso, f.precio_movimiento, f.estado_producto_movimiento,
				(f.precio_movimiento * f.cantidad_peso_movimiento) AS PrecioTotalFactura,
				f.nota_factura,CASE 
				WHEN f.fecha_caducidad = '0000-00-00' THEN 'No aplica'
				ELSE f.fecha_caducidad
			END as fecha_caducidad, pr.nombre_proveedores,f.num_lote
					FROM factura_movimiento f 
					JOIN usuarios us ON f.fk_id_usuario = us.id_usuario
					JOIN productos p ON f.fk_id_producto = p.id_producto
					JOIN proveedores pr ON f.fk_id_proveedor = pr.id_proveedores
					JOIN bodega u ON p.fk_id_up = u.id_up	
					JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
					JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria WHERE f.tipo_movimiento = "entrada"`
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

export const listarMovimientosSalida = async (req, res) => {
	try {
		let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
		const [result] = await pool.query
			(
				`SELECT f.id_factura,us.nombre_usuario, f.tipo_movimiento, t.nombre_tipo, c.nombre_categoria, f.fecha_movimiento, f.cantidad_peso_movimiento, t.unidad_peso, 
				f.nota_factura, f.num_lote
					FROM factura_movimiento f 
					JOIN usuarios us ON f.fk_id_usuario = us.id_usuario
					JOIN productos p ON f.fk_id_producto = p.id_producto
					JOIN bodega u ON p.fk_id_up = u.id_up	
					JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
					JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria WHERE f.tipo_movimiento = "salida"`
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
		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error);
		}
		let id = req.params.id;
		let { estado_producto_movimiento, nota_factura, fecha_caducidad, fk_id_producto, fk_id_usuario,num_lote } = req.body;
		
		
		/* const loteQuery = `SELECT * FROM factura_movimiento WHERE num_lote = '${num_lote}'`;
        	const [existingLote] = await pool.query(loteQuery);
        if (existingLote.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El lote ya está registrado"
            });
        } */

		
		const loteQuery = `SELECT * FROM factura_movimiento WHERE num_lote = '${num_lote}' AND id_factura != ${id}`;
const [existingLote] = await pool.query(loteQuery);

if (existingLote.length > 0 && num_lote !== existingLote[0].num_lote) {
    return res.status(409).json({
        "status": 409,
        "message": "El lote ya está registrado"
    });
}
		let sql = `UPDATE factura_movimiento SET estado_producto_movimiento='${estado_producto_movimiento}',nota_factura='${nota_factura}',fecha_caducidad='${fecha_caducidad}',fk_id_producto='${fk_id_producto}',fk_id_usuario='${fk_id_usuario}',num_lote='${num_lote}' where id_factura=${id}`;

		const [rows] = await pool.query(sql);

		if (rows.affectedRows > 0) {
			res.status(200).json({ "status": 200, "message": "¡Se actualizó el movimiento con éxito!" });
		} else {
			res.status(401).json({ "status": 401, "message": "¡NO se actualizó el movimiento!" });
		}
	} catch (e) {
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
};

export const obtenerProCategoria = async (req, res) => {
	try {
		let id = req.params.id_categoria;
		let sql = `SELECT pro.id_producto, pr.nombre_tipo  FROM productos pro JOIN tipo_productos pr on pr.id_tipo = pro.fk_id_tipo_producto JOIN categorias_producto cat on cat.id_categoria = pr.fk_categoria_pro where cat.id_categoria= ${id} and pro.estado=1;`;

		const [rows] = await pool.query(sql);

		if (rows.length > 0) {
			res.status(200).json(rows);
		} else {
			res.status(200).json({ "status": 401 , "message":"No se listaron productos"});
		}
	} catch (e) {
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
};

export const obtenerUnidad = async (req, res) => {
	try {
		let id = req.params.id_producto;
		let sql = `SELECT pr.id_tipo, pr.unidad_peso, pr.nombre_tipo FROM productos pro JOIN tipo_productos pr on pr.id_tipo = pro.fk_id_tipo_producto JOIN categorias_producto cat on cat.id_categoria = pr.fk_categoria_pro where pro.id_producto= ${id};`;

		const [rows] = await pool.query(sql);

		if (rows.length > 0) {
			res.status(200).json(rows);
		} else {
			res.status(200).json({ "status": 401 , "message":"No se listaron unidades"});
		}
	} catch (e) {
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
};


