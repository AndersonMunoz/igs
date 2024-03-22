import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

export const guardarMovimientoEntrada = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error });
        }

        let { cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
            nota_factura, fecha_caducidad, fk_id_usuario, fk_id_proveedor, num_lote, fk_id_up, fk_id_tipo_producto} = req.body;

        // Si fecha_caducidad no está definida o es una cadena vacía, establece su valor como null
        if (!fecha_caducidad) {
            fecha_caducidad = null;
        }

        const loteQuery = `SELECT * FROM factura_movimiento WHERE num_lote = '${num_lote}'`;
        const [existingLote] = await pool.query(loteQuery);
        if (existingLote.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El lote ya está registrado"
            });
        }

        const sql2 = `INSERT INTO productos (num_lote, fk_id_up, fk_id_tipo_producto) VALUES ('${num_lote}', '${fk_id_up}', '${fk_id_tipo_producto}')`;
        const resultInsertProductos = await pool.query(sql2).catch(err => console.log(err));

        const newIdProducto = resultInsertProductos[0].insertId;

        const precio_total_mov = precio_movimiento * cantidad_peso_movimiento;
        const sql = `
            INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento, nota_factura, fecha_caducidad, precio_total_mov,fk_id_producto, fk_id_usuario, fk_id_proveedor, num_lote ) 
            VALUES ('entrada', '${cantidad_peso_movimiento}', '${precio_movimiento}', '${estado_producto_movimiento}', '${nota_factura}', ?, ?, '${newIdProducto}', '${fk_id_usuario}', '${fk_id_proveedor}','${num_lote}');
        `;

        const resultInsertFacturaMovimiento = await pool.query(sql, [fecha_caducidad, precio_total_mov]);

        const sql3 = `
            UPDATE productos
            SET cantidad_peso_producto = cantidad_peso_producto + '${cantidad_peso_movimiento}'
            WHERE num_lote = '${num_lote}'
        `;
        const resultUpdateProductos = await pool.query(sql3, [cantidad_peso_movimiento, num_lote]);

		let resultPrev = await pool.query('SELECT LAST_INSERT_ID() as id from factura_movimiento');
		let newIdFactura = resultPrev[0][0].id;
		let sql7 = `INSERT INTO detalles (fk_id_movimiento) VALUES (?)`;
		const resultInsertarDetalles = await pool.query(sql7, [newIdFactura]);


        if (resultInsertProductos[0].affectedRows > 0 && resultInsertFacturaMovimiento[0].affectedRows > 0 && resultUpdateProductos[0].affectedRows > 0 && resultInsertarDetalles[0].affectedRows > 0 ) {
            res.status(200).json({
                "status": 200,
                "message": "¡Se registró el movimiento de entrada!"
            });
        } else {
            res.status(401).json({
                "status": 401,
                "message": "¡No se registró movimiento de entrada!"
            });
        }
    } catch (e) {
		console.error(e); // Imprime el error en la consola del servidor
		res.status(500).json({
		  "status": 500,
		  "message": "Error en el servidor" + e
		});
	  }
}


export const guardarMovimientoSalida = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error });
        }
        let { cantidad_peso_movimiento, nota_factura, fk_id_producto, fk_id_usuario, num_lote, destino_movimiento, fk_id_titulado, fk_id_instructor } = req.body;
        let sql4 = `SELECT cantidad_peso_producto FROM productos WHERE num_lote = ${num_lote}`;

        let cantidadPeso = await pool.query(sql4);
        let cantidadPeso2 = cantidadPeso[0];
        let cantidad3 = cantidadPeso2[0];
        let cantidadPesoTotal = cantidad3.cantidad_peso_producto;

        if (cantidadPesoTotal < cantidad_peso_movimiento) {
            return res.status(402).json({
                "status": 402,
                "mensaje": "Ya no hay suficiente stock del producto"
            });
        } else if (cantidadPesoTotal >= 0) {
            let sql10 = `
                INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento,
                nota_factura, num_lote, fk_id_producto, fk_id_usuario)
                VALUES ('salida','${cantidad_peso_movimiento}','${nota_factura}','${num_lote}',
                '${fk_id_producto}','${fk_id_usuario}');`;

            let sql6 = `UPDATE productos 
                SET cantidad_peso_producto = CASE 
                    WHEN cantidad_peso_producto - ${cantidad_peso_movimiento} <= 0 THEN 0
                    ELSE cantidad_peso_producto - ${cantidad_peso_movimiento}
                END
                WHERE num_lote = ${num_lote}`;

            let result10 = await pool.query(sql10);
            if (result10.affectedRows == 0) {
                return res.status(401).json({
                    "status": 401,
                    "message": "¡No se pudo insertar el movimiento de salida en factura_movimiento!"
                });
            }

            let resultPrev = await pool.query('SELECT LAST_INSERT_ID() as id');
            let newIdFactura = resultPrev[0][0].id;

            let sql7;

            if (destino_movimiento === "taller" || destino_movimiento === "evento") {
                sql7 = `INSERT INTO detalles (destino_movimiento,fk_id_movimiento,fk_id_titulado,fk_id_instructor) VALUES ('${destino_movimiento}','${newIdFactura}','${fk_id_titulado}','${fk_id_instructor}') `;
            } else if (destino_movimiento === "produccion") {
                sql7 = `INSERT INTO detalles (destino_movimiento,fk_id_movimiento) VALUES ('${destino_movimiento}','${newIdFactura}') `;
            }

            let [result6, result7] = await Promise.all([
                pool.query(sql6),
                pool.query(sql7)
            ]);

            if (result6.affectedRows == 0 || result7.affectedRows == 0) {
                return res.status(401).json({
                    "status": 401,
                    "message": "¡No se pudo insertar los detalles del movimiento de salida!"
                });
            }

            res.status(200).json({
                "status": 200,
                "message": "¡Se registró el movimiento de salida!"
            });
        }
    } catch (e) {
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor" + e
        });
    }
}


export const obtenerValorTotalProductos = async (req, res) => {
	try {
			const [resultEntradas] = await pool.query(`SELECT COUNT(tipo_movimiento) AS total_entradas FROM factura_movimiento WHERE tipo_movimiento = 'entrada'`);
			const [resultSalidas] = await pool.query(`SELECT COUNT(tipo_movimiento) AS total_salidas FROM factura_movimiento WHERE tipo_movimiento = 'salida'`);

			const totalEntradas = resultEntradas[0].total_entradas || 0;
			const totalSalidas = resultSalidas[0].total_salidas || 0;

			const valorTotalProductos = {
					"entraron": totalEntradas,
					"salieron": totalSalidas
			};

			res.status(200).json(valorTotalProductos);
	} catch (error) {
			console.error("Error al obtener el valor total de los productos:", error);
			res.status(500).json({
					"status": 500,
					"message": "Error en el servidor"
			});
	}
};
export const listarProductosCaducar = async (req, res) => {
  try {
    const [result] = await pool.query(
      `SELECT 
      p.id_producto, 
      t.nombre_tipo AS NombreProducto,
			f.num_lote,
      f.fecha_caducidad AS FechaCaducidad, 
      c.nombre_categoria AS NombreCategoria,
      f.cantidad_peso_movimiento,
      t.unidad_peso AS Unidad,
      f.nota_factura AS Descripcion,
      (f.precio_movimiento * f.cantidad_peso_movimiento) AS PrecioTotal, 
      u.nombre_up AS UnidadProductiva, 
      p.estado AS estado 
    FROM productos p 
    JOIN factura_movimiento f ON p.id_producto = f.fk_id_producto
    JOIN bodega u ON p.fk_id_up = u.id_up
    JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
    JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria
    WHERE f.fecha_caducidad <> '1899-11-30'
GROUP BY f.num_lote 
ORDER BY FechaCaducidad ASC `
    );
    res.status(200).json(result);
  } catch (er) {
    res.status(500).json({
      status: 500,
      menssge: "Error listarProductos " + er,
    });
  }
};

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

			//console.log(cantidadPesoTotal)

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
			`SELECT 
			f.id_factura,
			us.nombre_usuario,
			f.tipo_movimiento,
			t.nombre_tipo,
			c.nombre_categoria,
			f.fecha_movimiento,
			f.cantidad_peso_movimiento,
			t.unidad_peso,
			CASE 
				WHEN f.tipo_movimiento = 'salida' AND (f.precio_movimiento IS NULL OR f.precio_movimiento = 0) THEN 'No aplica'
				ELSE CAST(f.precio_movimiento AS CHAR)
			END AS precio_movimiento,
			CASE 
				WHEN f.tipo_movimiento = 'salida' OR f.tipo_movimiento IS NULL THEN 'No aplica'
				ELSE f.estado_producto_movimiento
			END AS estado_producto_movimiento,
			(f.precio_movimiento * f.cantidad_peso_movimiento) AS PrecioTotalFactura,
			f.nota_factura,
			CASE 
				WHEN f.fecha_caducidad IS NULL THEN 'No aplica'
				WHEN f.fecha_caducidad = '0000-00-00' THEN 'No aplica'
				WHEN f.fecha_caducidad = '1899-11-29' THEN 'No aplica'
				ELSE f.fecha_caducidad
			END AS fecha_caducidad,
			CASE 
				WHEN pr.id_proveedores IS NULL OR pr.id_proveedores = 0 THEN 'No aplica'
				ELSE pr.nombre_proveedores
			END AS nombre_proveedores,
			f.num_lote,
			CASE 
				WHEN f.precio_total_mov IS NULL THEN 'No aplica'
				ELSE f.precio_total_mov
			END AS precio_total_mov
		FROM 
			factura_movimiento f 
		JOIN 
			usuarios us ON f.fk_id_usuario = us.id_usuario
		JOIN 
			productos p ON f.fk_id_producto = p.id_producto
		LEFT JOIN 
			proveedores pr ON f.fk_id_proveedor = pr.id_proveedores
		JOIN 
			bodega u ON p.fk_id_up = u.id_up    
		JOIN 
			tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
		JOIN 
			categorias_producto c ON t.fk_categoria_pro = c.id_categoria
		ORDER BY 
			CASE 
				WHEN f.fecha_caducidad = '1899-11-30' THEN 1 
				ELSE 0 
			END,
			f.id_factura DESC;
		`
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
			END as fecha_caducidad, pr.nombre_proveedores,f.num_lote,
			CASE 
			WHEN f.precio_total_mov IS NULL THEN 'No aplica'
			ELSE f.precio_total_mov
		END as precio_total_mov
					FROM factura_movimiento f 
					JOIN usuarios us ON f.fk_id_usuario = us.id_usuario
					JOIN productos p ON f.fk_id_producto = p.id_producto
					JOIN proveedores pr ON f.fk_id_proveedor = pr.id_proveedores
					JOIN bodega u ON p.fk_id_up = u.id_up	
					JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
					JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria WHERE f.tipo_movimiento = "entrada"
					ORDER BY f.id_factura DESC`
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
					JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria WHERE f.tipo_movimiento = "salida"
					ORDER BY f.id_factura DESC`
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
        
        const id = req.params.id;
        const { estado_producto_movimiento, precio_movimiento, nota_factura, fecha_caducidad, cantidad_peso_movimiento, num_lote } = req.body;
        const nuevoNumLote = `${num_lote}`;

        // Obtener el número de lote inicial del movimiento seleccionado
        const [movimientoInicial] = await pool.query(`SELECT cantidad_peso_movimiento, num_lote FROM factura_movimiento WHERE id_factura = ${id}`);
        const cantidadMovimientoInicial = movimientoInicial[0].cantidad_peso_movimiento;

        console.log("Cantidad de movimiento inicial:", cantidadMovimientoInicial);
        console.log("Movimiento inicial:", movimientoInicial);

        // Verificar si el número de lote ha sido modificado
        const numLoteModificado = num_lote !== movimientoInicial[0].num_lote;

        if (numLoteModificado) {
            // Verificar si el nuevo número de lote ya existe en la base de datos
            const [existingLote] = await pool.query(`SELECT num_lote FROM productos WHERE num_lote = ${num_lote}`);
            if (existingLote.length > 0) {
                return res.status(409).json({
                    "status": 409,
                    "message": "El lote ya está registrado"
                });
            }
        }

        // Calcular la diferencia entre la nueva cantidad de movimiento y la cantidad inicial de movimiento
        const diferenciaMovimiento = cantidadMovimientoInicial - cantidad_peso_movimiento;

        // Obtener la cantidad actual del producto
        const [productoActual] = await pool.query(`SELECT cantidad_peso_producto FROM productos WHERE num_lote = ${movimientoInicial[0].num_lote}`);
        const cantidadProductoActual = productoActual[0].cantidad_peso_producto;

        console.log("Cantidad actual del producto:", cantidadProductoActual);

        if (diferenciaMovimiento > 0 && cantidadProductoActual - diferenciaMovimiento >= 0) {
            // Si la diferencia es positiva y la resta no resulta en un valor negativo, realizar la actualización del movimiento y de la tabla de productos
            const sql = `UPDATE factura_movimiento SET estado_producto_movimiento=?, precio_movimiento=?, nota_factura=?, num_lote=?, fecha_caducidad=?, cantidad_peso_movimiento=? WHERE id_factura=? AND num_lote=?`;
            const sql2 = `UPDATE factura_movimiento SET precio_total_mov = cantidad_peso_movimiento * precio_movimiento, precio_movimiento = precio_movimiento WHERE id_factura=?`;
            const sql3 = `UPDATE productos SET cantidad_peso_producto = cantidad_peso_producto - ?, num_lote=? WHERE num_lote=?`;
            const sql4 = `UPDATE factura_movimiento SET num_lote = ? WHERE num_lote=? AND tipo_movimiento='salida'`;

            const [result1, result2, result3] = await Promise.all([
                pool.query(sql, [estado_producto_movimiento, precio_movimiento, nota_factura, num_lote, fecha_caducidad, cantidad_peso_movimiento, id, movimientoInicial[0].num_lote]),
                pool.query(sql2, [id]),
                pool.query(sql3, [Math.abs(diferenciaMovimiento), nuevoNumLote, movimientoInicial[0].num_lote]),
            ]);

            // Verificar si hay un movimiento de tipo 'salida' con el número de lote antiguo
            const [existingSalida] = await pool.query(`SELECT num_lote FROM factura_movimiento WHERE num_lote = ${movimientoInicial[0].num_lote} AND tipo_movimiento='salida'`);
            if (existingSalida.length > 0) {
                const result4 = await pool.query(sql4, [nuevoNumLote, movimientoInicial[0].num_lote]);
            }

            if (result1[0].affectedRows > 0 && result2[0].affectedRows > 0 && result3[0].affectedRows >= 0) {
                res.status(200).json({ "status": 200, "message": "¡Se actualizó el movimiento con éxito!" });
            } else {
                res.status(401).json({ "status": 401, "message": "¡NO se actualizó el movimiento!" });
            }
        } else if (diferenciaMovimiento < 0 && cantidadProductoActual + diferenciaMovimiento >= 0) {
            // Si la diferencia es negativa y la suma no resulta en un valor negativo, realizar la actualización del movimiento y sumar la diferencia a la tabla de productos
            const sql = `UPDATE factura_movimiento SET estado_producto_movimiento=?, precio_movimiento=?, nota_factura=?, num_lote=?, fecha_caducidad=?, cantidad_peso_movimiento=? WHERE id_factura=? AND num_lote=?`;
            const sql2 = `UPDATE factura_movimiento SET precio_total_mov = cantidad_peso_movimiento * precio_movimiento, precio_movimiento = precio_movimiento WHERE id_factura=?`;
            const sql3 = `UPDATE productos SET cantidad_peso_producto = cantidad_peso_producto + ?, num_lote=? WHERE num_lote=?`;
            const sql4 = `UPDATE factura_movimiento SET num_lote = ? WHERE num_lote=? AND tipo_movimiento='salida'`;

            const [result1, result2,result3] = await Promise.all([
                pool.query(sql, [estado_producto_movimiento, precio_movimiento, nota_factura, num_lote, fecha_caducidad, cantidad_peso_movimiento, id, movimientoInicial[0].num_lote]),
                pool.query(sql2, [id]),
                pool.query(sql3, [Math.abs(diferenciaMovimiento), nuevoNumLote, movimientoInicial[0].num_lote]),
            ]);

            // Verificar si hay un movimiento de tipo 'salida' con el número de lote antiguo
            const [existingSalida] = await pool.query(`SELECT num_lote FROM factura_movimiento WHERE num_lote = ${movimientoInicial[0].num_lote} AND tipo_movimiento='salida'`);
            if (existingSalida.length > 0) {
                const result4 = await pool.query(sql4, [nuevoNumLote, movimientoInicial[0].num_lote]);
            }

            if (result1[0].affectedRows > 0 && result2[0].affectedRows > 0 && result3[0].affectedRows >= 0) {
                res.status(200).json({ "status": 200, "message": "¡Se actualizó el movimiento con éxito!" });
            } else {
                res.status(401).json({ "status": 401, "message": "¡NO se actualizó el movimiento!" });
            }
        } else if (diferenciaMovimiento === 0) {
            // Si la diferencia es cero, realizar la actualización del movimiento
            const sql = `UPDATE factura_movimiento SET estado_producto_movimiento=?, precio_movimiento=?, nota_factura=?, num_lote=?, fecha_caducidad=?, cantidad_peso_movimiento=? WHERE id_factura=? AND num_lote=?`;
            const sql2 = `UPDATE factura_movimiento SET precio_total_mov = cantidad_peso_movimiento * precio_movimiento, precio_movimiento = precio_movimiento WHERE id_factura=?`;
            const sql3 = `UPDATE productos SET num_lote=? WHERE num_lote=?`;
            const sql4 = `UPDATE factura_movimiento SET num_lote = ? WHERE num_lote=? AND tipo_movimiento='salida'`;

            const [result1, result2, result3] = await Promise.all([
                pool.query(sql, [estado_producto_movimiento, precio_movimiento, nota_factura, num_lote, fecha_caducidad, cantidad_peso_movimiento, id, movimientoInicial[0].num_lote]),
                pool.query(sql2, [id]),
                pool.query(sql3, [nuevoNumLote, movimientoInicial[0].num_lote]),
            ]);

            // Verificar si hay un movimiento de tipo 'salida' con el número de lote antiguo
            const [existingSalida] = await pool.query(`SELECT num_lote FROM factura_movimiento WHERE num_lote = ${movimientoInicial[0].num_lote} AND tipo_movimiento='salida'`);
            if (existingSalida.length > 0) {
                const result4 = await pool.query(sql4, [nuevoNumLote, movimientoInicial[0].num_lote]);
            }

            if (result1[0].affectedRows > 0 && result2[0].affectedRows > 0 && result3[0].affectedRows >= 0) {
                res.status(200).json({ "status": 200, "message": "¡Se actualizó el movimiento con éxito!" });
            } else {
                res.status(401).json({ "status": 401, "message": "¡NO se actualizó el movimiento!" });
            }
        } else {
            // Si la suma o resta resulta en un valor negativo, no realizar ninguna actualización en la tabla de productos ni en el movimiento
            res.status(409).json({ "status": 409, "message": "No se realizó ninguna actualización ya que la cantidad de movimiento resultaría en un valor negativo." });
        }
    } catch (e) {
        console.error("Error en el servidor:", e);
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor"
        });
    }
};





export const actualizarMovimientoSalida = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }

        let id = req.params.id;
        let { nota_factura, cantidad_peso_movimiento, destino_movimiento, fk_id_instructor, fk_id_titulado } = req.body;
		
		let cantidadNueva = cantidad_peso_movimiento;

        let sqlPrev = `SELECT cantidad_peso_movimiento,tipo_movimiento, fk_id_producto, num_lote FROM factura_movimiento WHERE id_factura=${id}`;
        let resultPrev = await pool.query(sqlPrev, id);
        let prevMovimiento = resultPrev[0][0].cantidad_peso_movimiento;
        let fk_id_producto = resultPrev[0][0].fk_id_producto;
        let num_lote = resultPrev[0][0].num_lote;

		let sql6 = `SELECT cantidad_peso_movimiento FROM factura_movimiento WHERE num_lote = '${num_lote}' AND tipo_movimiento = 'entrada'`;
        let result5 = await pool.query(sql6);
        let cantidadMovEntrada = result5[0][0].cantidad_peso_movimiento;



        let nuevaCantidadPesoProducto = cantidadMovEntrada -  cantidadNueva;
        if (nuevaCantidadPesoProducto < 0) {
            return res.status(402).json({
                "status": 402,
                "mensaje": "La nueva cantidad total es menor que 0. Ingrese una cantidad no mayor a lo que tiene disponible."
            });
        } else {
            // Realizar la actualización en la base de datos
            let sql = `UPDATE factura_movimiento SET nota_factura='${nota_factura}',cantidad_peso_movimiento='${cantidad_peso_movimiento}' where id_factura=${id}`;
            let diffMovimiento = cantidad_peso_movimiento - prevMovimiento;
            let sql2 = `UPDATE productos SET cantidad_peso_producto = cantidad_peso_producto - ${diffMovimiento}  WHERE num_lote='${num_lote}'`;

			let sql7;

            if (destino_movimiento === "taller" || destino_movimiento === "evento") {
                sql7 = `UPDATE detalles SET destino_movimiento = '${destino_movimiento}', fk_id_instructor = '${fk_id_instructor}', fk_id_titulado = '${fk_id_titulado}'  WHERE fk_id_movimiento=${id}`;
            } else if (destino_movimiento === "produccion") {
                sql7 = `UPDATE detalles SET destino_movimiento = '${destino_movimiento}', fk_id_instructor = NULL, fk_id_titulado = NULL WHERE fk_id_movimiento=${id}`;
            }
            const [result1, result2, result3] = await Promise.all([
                pool.query(sql, [nota_factura, cantidad_peso_movimiento, id]),
                pool.query(sql2, [fk_id_producto]),
                pool.query(sql7),
            ]);

            if (result1[0].affectedRows > 0 && result2[0].affectedRows > 0 && result3[0].affectedRows > 0) {
                res.status(200).json({ "status": 200, "message": "¡Se actualizó el movimiento con éxito!" });
            } else {
                res.status(401).json({ "status": 401, "message": "¡NO se actualizó el movimiento!" });
            }

        }
    } catch (e) {
        res.status(500).json({
            "status": 500,
            "errors": [{ "msg": "Error en el servidor: " + e }]
        });
    }
};


export const obtenerProCategoria = async (req, res) => {
	try {
		let id = req.params.id_categoria;
		let sql = `SELECT pr.id_tipo, pr.nombre_tipo, pr.unidad_peso FROM tipo_productos pr JOIN categorias_producto cat ON cat.id_categoria = pr.fk_categoria_pro where cat.id_categoria= ${id} and pr.estado=1;`;

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
		let sql = `SELECT pr.id_tipo, pr.unidad_peso, pr.nombre_tipo FROM productos p JOIN tipo_productos pr ON p.fk_id_tipo_producto = pr.id_tipo where p.id_producto= ${id};`;

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

export const obtenerProProductos = async (req, res) => {
	try {
		let id = req.params.id_categoria;
		let sql = `SELECT p.id_producto, pr.nombre_tipo,p.cantidad_peso_producto,pr.unidad_peso,p.num_lote FROM  productos p JOIN tipo_productos pr ON p.fk_id_tipo_producto = pr.id_tipo JOIN categorias_producto cat ON pr.fk_categoria_pro = cat.id_categoria WHERE cat.id_categoria= ${id} and pr.estado=1 and p.cantidad_peso_producto > 0;`;

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


