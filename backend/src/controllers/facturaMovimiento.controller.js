import { pool } from '../database/conexion.js';
import { validationResult } from 'express-validator';

// Función para guardar un movimiento de entrada en la base de datos
export const guardarMovimientoEntrada = async (req, res) => {
    try {
        // Validación de los datos recibidos en la solicitud HTTP
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error });
        }

        // Extracción de los datos del cuerpo de la solicitud
        let { cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento,
            nota_factura, fecha_caducidad, fk_id_usuario, fk_id_proveedor, fk_id_up, fk_id_tipo_producto} = req.body;

        // Si no se proporciona fecha de caducidad, se establece como nulo
        if (!fecha_caducidad) {
            fecha_caducidad = null;
        }

        // Consulta para verificar si existe un producto con el mismo tipo
        const tipoQuery = `SELECT * FROM productos WHERE fk_id_tipo_producto = '${fk_id_tipo_producto}'`;
        const [existingTipo] = await pool.query(tipoQuery);

        if (existingTipo.length > 0) {
            // Si el tipo de producto ya existe, se utiliza su ID
            const newIdProducto = existingTipo[0].id_producto;

            // Cálculo del precio total del movimiento
            const precio_total_mov = precio_movimiento * cantidad_peso_movimiento;

            // Consulta para insertar el movimiento de entrada en la tabla de movimientos
            const sql = `
                INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento, nota_factura, fecha_caducidad, precio_total_mov,fk_id_producto, fk_id_usuario, fk_id_proveedor) 
                VALUES ('entrada', '${cantidad_peso_movimiento}', '${precio_movimiento}', '${estado_producto_movimiento}', '${nota_factura}', ?, ?, '${newIdProducto}', '${fk_id_usuario}', '${fk_id_proveedor}');
            `;

            // Ejecución de la consulta y almacenamiento del resultado
            const resultInsertFacturaMovimiento = await pool.query(sql, [fecha_caducidad, precio_total_mov]);

            // Consulta para actualizar la cantidad de peso del producto
            const sql3 = `
                UPDATE productos
                SET cantidad_peso_producto = cantidad_peso_producto + '${cantidad_peso_movimiento}'
                WHERE id_producto = '${newIdProducto}'
            `;

            // Ejecución de la consulta y almacenamiento del resultado
            const resultUpdateProductos = await pool.query(sql3, [cantidad_peso_movimiento,newIdProducto]);

            // Obtención del ID del último movimiento insertado
            let resultPrev = await pool.query('SELECT LAST_INSERT_ID() as id from factura_movimiento');
            let newIdFactura = resultPrev[0][0].id;

            // Consulta para insertar detalles adicionales del movimiento
            let sql7 = `INSERT INTO detalles (fk_id_movimiento) VALUES (?)`;
            const resultInsertarDetalles = await pool.query(sql7, [newIdFactura]);

            // Verificación de los resultados de las consultas y envío de la respuesta correspondiente
            if (resultInsertFacturaMovimiento[0].affectedRows > 0 && resultUpdateProductos[0].affectedRows > 0 && resultInsertarDetalles[0].affectedRows > 0 ) {
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
        } else {
            // Si no existe un producto con el tipo dado, se inserta uno nuevo
            const sql2 = `INSERT INTO productos (fk_id_up, fk_id_tipo_producto) VALUES ( '${fk_id_up}', '${fk_id_tipo_producto}')`;
            const resultInsertProductos = await pool.query(sql2).catch(err => console.log(err));

            // Obtención del ID del nuevo producto insertado
            const newIdProducto = resultInsertProductos[0].insertId;

            // Cálculo del precio total del movimiento
            const precio_total_mov = precio_movimiento * cantidad_peso_movimiento;

            // Consulta para insertar el movimiento de entrada en la tabla de movimientos
            const sql = `
                INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento, precio_movimiento, estado_producto_movimiento, nota_factura, fecha_caducidad, precio_total_mov,fk_id_producto, fk_id_usuario, fk_id_proveedor) 
                VALUES ('entrada', '${cantidad_peso_movimiento}', '${precio_movimiento}', '${estado_producto_movimiento}', '${nota_factura}', ?, ?, '${newIdProducto}', '${fk_id_usuario}', '${fk_id_proveedor}');
            `;

            // Ejecución de la consulta y almacenamiento del resultado
            const resultInsertFacturaMovimiento = await pool.query(sql, [fecha_caducidad, precio_total_mov]);

            // Consulta para actualizar la cantidad de peso del producto
            const sql3 = `
                UPDATE productos
                SET cantidad_peso_producto = cantidad_peso_producto + '${cantidad_peso_movimiento}'
                WHERE id_producto = '${newIdProducto}'
            `;

            // Ejecución de la consulta y almacenamiento del resultado
            const resultUpdateProductos = await pool.query(sql3, [cantidad_peso_movimiento,newIdProducto]);

            // Obtención del ID del último movimiento insertado
            let resultPrev = await pool.query('SELECT LAST_INSERT_ID() as id from factura_movimiento');
            let newIdFactura = resultPrev[0][0].id;

            // Consulta para insertar detalles adicionales del movimiento
            let sql7 = `INSERT INTO detalles (fk_id_movimiento) VALUES (?)`;
            const resultInsertarDetalles = await pool.query(sql7, [newIdFactura]);

            // Verificación de los resultados de las consultas y envío de la respuesta correspondiente
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
        }
    } catch (e) {
        // Captura de errores y envío de respuesta de error al cliente
        res.status(500).json({
          "status": 500,
          "message": "Error en el servidor" + e
        });
      }
}

// Función para guardar un movimiento de salida en la base de datos
export const guardarMovimientoSalida = async (req, res) => {
    try {
        // Validación de los datos recibidos en la solicitud HTTP
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json({ "status": 403, error });
        }

        // Extracción de los datos del cuerpo de la solicitud
        let { cantidad_peso_movimiento, nota_factura, fk_id_producto, fk_id_tipo_producto, fk_id_usuario, destino_movimiento, fk_id_titulado, fk_id_instructor } = req.body;

        // Consulta para obtener la cantidad de peso del producto en stock
        let sql4 = `SELECT cantidad_peso_producto FROM productos WHERE fk_id_tipo_producto = '${fk_id_tipo_producto}'`;
        let cantidadPeso = await pool.query(sql4);
        
        // Extracción de la cantidad de peso del resultado de la consulta
        let cantidadPeso2 = cantidadPeso[0];
        let cantidad3 = cantidadPeso2[0];
        let cantidadPesoTotal = cantidad3.cantidad_peso_producto;

        // Verificación de la disponibilidad de stock del producto
        if (cantidadPesoTotal < cantidad_peso_movimiento) {
            return res.status(402).json({
                "status": 402,
                "mensaje": "Ya no hay suficiente stock del producto"
            });
        } else if (cantidadPesoTotal >= 0) {
            // Consulta para insertar el movimiento de salida en la tabla de movimientos
            let sql10 = `
                INSERT INTO factura_movimiento (tipo_movimiento, cantidad_peso_movimiento,
                nota_factura,fk_id_producto, fk_id_usuario)
                VALUES ('salida','${cantidad_peso_movimiento}','${nota_factura}',
                '${fk_id_producto}','${fk_id_usuario}');`;

            // Consulta para actualizar la cantidad de peso del producto en stock
            let sql6 = `UPDATE productos 
                SET cantidad_peso_producto = CASE 
                    WHEN cantidad_peso_producto - ${cantidad_peso_movimiento} <= 0 THEN 0
                    ELSE cantidad_peso_producto - ${cantidad_peso_movimiento}
                END
                WHERE id_producto = ${fk_id_producto}`;

            // Ejecución de las consultas SQL
            let result10 = await pool.query(sql10);

            // Verificación del resultado de la inserción del movimiento en factura_movimiento
            if (result10.affectedRows == 0) {
                return res.status(401).json({
                    "status": 401,
                    "message": "¡No se pudo insertar el movimiento de salida en factura_movimiento!"
                });
            }

            // Obtención del ID del último movimiento insertado
            let resultPrev = await pool.query('SELECT LAST_INSERT_ID() as id');
            let newIdFactura = resultPrev[0][0].id;

            // Construcción de la consulta para insertar detalles del movimiento
            let sql7;
            if (destino_movimiento === "taller" || destino_movimiento === "evento") {
                sql7 = `INSERT INTO detalles (destino_movimiento,fk_id_movimiento,fk_id_titulado,fk_id_instructor) VALUES ('${destino_movimiento}','${newIdFactura}','${fk_id_titulado}','${fk_id_instructor}') `;
            } else if (destino_movimiento === "produccion") {
                sql7 = `INSERT INTO detalles (destino_movimiento,fk_id_movimiento) VALUES ('${destino_movimiento}','${newIdFactura}') `;
            }

            // Ejecución de las consultas SQL
            let [result6, result7] = await Promise.all([
                pool.query(sql6),
                pool.query(sql7)
            ]);

            // Verificación de los resultados de las consultas y envío de la respuesta correspondiente
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
        // Captura de errores y envío de respuesta de error al cliente
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor" + e
        });
    }
}


// Función para obtener el valor total de productos (entradas y salidas)
export const obtenerValorTotalProductos = async (req, res) => {
    try {
        // Consulta para obtener el total de entradas de productos
        const [resultEntradas] = await pool.query(`SELECT COUNT(tipo_movimiento) AS total_entradas FROM factura_movimiento WHERE tipo_movimiento = 'entrada'`);
        
        // Consulta para obtener el total de salidas de productos
        const [resultSalidas] = await pool.query(`SELECT COUNT(tipo_movimiento) AS total_salidas FROM factura_movimiento WHERE tipo_movimiento = 'salida'`);

        // Extracción de los totales de entradas y salidas
        const totalEntradas = resultEntradas[0].total_entradas || 0;
        const totalSalidas = resultSalidas[0].total_salidas || 0;

        // Construcción del objeto con los valores totales
        const valorTotalProductos = {
            "entraron": totalEntradas,
            "salieron": totalSalidas
        };

        // Respuesta exitosa con el objeto de valores totales
        res.status(200).json(valorTotalProductos);
    } catch (error) {
        // Respuesta de error en caso de fallo en la consulta
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor"
        });
    }
};

// Función para listar los productos que están por caducar
export const listarProductosCaducar = async (req, res) => {
    try {
        // Consulta para obtener la lista de productos por caducar
        const [result] = await pool.query(
            `SELECT 
                p.id_producto, 
                t.nombre_tipo AS NombreProducto,
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
            ORDER BY FechaCaducidad ASC `
        );

        // Respuesta exitosa con la lista de productos por caducar
        res.status(200).json(result);
    } catch (error) {
        // Respuesta de error en caso de fallo en la consulta
        res.status(500).json({
            status: 500,
            message: "Error listarProductos " + error,
        });
    }
};

// Función para listar todos los movimientos de productos
export const listarMovimientos = async (req, res) => {
    try {
        // Validación de los datos recibidos en la solicitud HTTP
        let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }

        // Consulta para obtener la lista de movimientos de productos
        const [result] = await pool.query(`
            SELECT 
                f.id_factura,
                us.nombre_usuario,
                f.tipo_movimiento,
                t.nombre_tipo,
                c.nombre_categoria,
                f.fecha_movimiento,
                f.cantidad_peso_movimiento,
                t.unidad_peso, c.codigo_categoria,c.tipo_categoria,c.nombre_categoria,
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
                    WHEN f.fecha_caducidad = '1899-11-29' THEN 'No aplica'
                    ELSE f.fecha_caducidad
                END AS fecha_caducidad,
                CASE 
                    WHEN pr.id_proveedores IS NULL OR pr.id_proveedores = 0 THEN 'No aplica'
                    ELSE pr.nombre_proveedores
                END AS nombre_proveedores,
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
        `);

        // Verificación de la existencia de resultados
        if (result.length > 0) {
            // Respuesta exitosa con la lista de movimientos
            res.status(200).json(result);
        } else {
            // Respuesta de éxito con mensaje en caso de no encontrar movimientos
            res.status(204).json({
                "status": 204,
                "message": "No se lista factura movimientos"
            });
        }
    } catch (error) {
        // Respuesta de error en caso de fallo en la consulta
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor" + error
        });
    }
};

// Función para listar los movimientos de entrada de productos
export const listarMovimientosEntrada = async (req, res) => {
	try {
		// Validación de los datos recibidos en la solicitud HTTP
		let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
		// Consulta para obtener la lista de movimientos de entrada de productos
		const [result] = await pool.query(`
			SELECT 
				f.id_factura,
				us.nombre_usuario,
				f.tipo_movimiento,
				t.nombre_tipo,
				c.nombre_categoria,
				f.fecha_movimiento,
				f.cantidad_peso_movimiento,
				t.unidad_peso,
				f.precio_movimiento,
				f.estado_producto_movimiento,
				c.codigo_categoria,
				c.tipo_categoria,
				(f.precio_movimiento * f.cantidad_peso_movimiento) AS PrecioTotalFactura,
				f.nota_factura,
				CASE 
                    WHEN f.fecha_caducidad IS NULL THEN 'No aplica'
                    WHEN f.fecha_caducidad = '1899-11-29' THEN 'No aplica'
                    ELSE f.fecha_caducidad
                END AS fecha_caducidad,
				pr.nombre_proveedores,
				CASE 
					WHEN f.precio_total_mov IS NULL THEN 'No aplica'
					ELSE f.precio_total_mov
				END as precio_total_mov
			FROM 
				factura_movimiento f 
			JOIN 
				usuarios us ON f.fk_id_usuario = us.id_usuario
			JOIN 
				productos p ON f.fk_id_producto = p.id_producto
			JOIN 
				proveedores pr ON f.fk_id_proveedor = pr.id_proveedores
			JOIN 
				bodega u ON p.fk_id_up = u.id_up	
			JOIN 
				tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
			JOIN 
				categorias_producto c ON t.fk_categoria_pro = c.id_categoria 
			WHERE 
				f.tipo_movimiento = "entrada"
			ORDER BY 
				f.id_factura DESC
		`);

		// Verificación de la existencia de resultados
		if (result.length > 0) {
			// Respuesta exitosa con la lista de movimientos de entrada
			res.status(200).json(result);
		} else {
			// Respuesta de éxito con mensaje en caso de no encontrar movimientos
			res.status(204).json({
				"status": 204,
				"message": "No se lista factura movimientos"
			});
		}

	} catch (error) {
		// Respuesta de error en caso de fallo en la consulta
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + error
		});
	}
}

// Función para listar los movimientos de salida de productos
export const listarMovimientosSalida = async (req, res) => {
	try {
		// Validación de los datos recibidos en la solicitud HTTP
		let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
		// Consulta para obtener la lista de movimientos de salida de productos
		const [result] = await pool.query(`
			SELECT 
				f.id_factura,
				us.nombre_usuario,
				f.tipo_movimiento,
				t.nombre_tipo,
				c.nombre_categoria,
				f.fecha_movimiento,
				f.cantidad_peso_movimiento,
				t.unidad_peso,
				f.nota_factura,
				c.codigo_categoria,
				c.tipo_categoria,
				d.destino_movimiento,
				CASE 
					WHEN ti.nombre_titulado IS NULL THEN 'No aplica'
					ELSE ti.nombre_titulado
				END AS nombre_titulado,
				CASE 
					WHEN ti.id_ficha IS NULL THEN 'No aplica'
					ELSE ti.id_ficha
				END AS id_ficha,
				CASE 
					WHEN i.nombre_instructor IS NULL THEN 'No aplica'
					ELSE i.nombre_instructor
				END AS nombre_instructor
			FROM 
				factura_movimiento f 
			JOIN 
				usuarios us ON f.fk_id_usuario = us.id_usuario
			JOIN 
				productos p ON f.fk_id_producto = p.id_producto
			JOIN 
				bodega u ON p.fk_id_up = u.id_up    
			JOIN 
				tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo
			JOIN 
				categorias_producto c ON t.fk_categoria_pro = c.id_categoria
			JOIN 
				detalles d ON d.fk_id_movimiento = f.id_factura
			LEFT JOIN 
				instructores i ON d.fk_id_instructor = i.id_instructores
			LEFT JOIN 
				titulados ti ON d.fk_id_titulado = ti.id_titulado 
			WHERE 
				f.tipo_movimiento = "salida"
			ORDER BY 
				d.id_detalle DESC
		`);

		// Verificación de la existencia de resultados
		if (result.length > 0) {
			// Respuesta exitosa con la lista de movimientos de salida
			res.status(200).json(result);
		} else {
			// Respuesta de éxito con mensaje en caso de no encontrar movimientos
			res.status(204).json({
				"status": 204,
				"message": "No se lista factura movimientos"
			});
		}

	} catch (error) {
		// Respuesta de error en caso de fallo en la consulta
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + error
		});
	}
}

// Función para buscar un movimiento por su ID
export const buscarMovimiento = async (req, res) => {
	try {
		// Validación de los datos recibidos en la solicitud HTTP
		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error);
		}
		// Extracción del ID del movimiento desde los parámetros de la URL
		let id = req.params.id;
		// Consulta para obtener el movimiento con el ID proporcionado
		const [result] = await pool.query('SELECT * FROM factura_movimiento f JOIN usuarios us ON f.fk_id_usuario = us.id_usuario JOIN productos p ON f.fk_id_producto = p.id_producto JOIN bodega u ON p.fk_id_up = u.id_up JOIN tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria JOIN detalles d ON d.fk_id_movimiento = f.id_factura LEFT JOIN instructores i ON d.fk_id_instructor = i.id_instructores LEFT JOIN titulados ti ON d.fk_id_titulado = ti.id_titulado WHERE f.id_factura = ?', [id]);

		// Verificación de la existencia de resultados
		if (result.length > 0) {
			// Respuesta exitosa con el movimiento encontrado
			res.status(200).json(result);
		} else {
			// Respuesta de error con mensaje en caso de no encontrar el movimiento
			res.status(404).json({
				status: 404,
				message: "No existe un movimiento con el ID proporcionado."
			});
		}
	} catch (err) {
		// Respuesta de error en caso de fallo en la consulta
		res.status(500).json({
			message: 'Error en buscar movimiento :(' + err
		});
	}
};

// Función para buscar un movimiento con detalles por su ID
export const buscarMovimientoDetalle = async (req, res) => {
	try {
		// Validación de los datos recibidos en la solicitud HTTP
		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error);
		}
		// Extracción del ID del movimiento desde los parámetros de la URL
		let id = req.params.id;
		// Consulta para obtener el movimiento con detalles con el ID proporcionado
		const [result] = await pool.query(`
			SELECT 
				*
			FROM 
				factura_movimiento f 
			JOIN 
				usuarios us ON f.fk_id_usuario = us.id_usuario 
			JOIN 
				productos p ON f.fk_id_producto = p.id_producto 
			JOIN 
				bodega u ON p.fk_id_up = u.id_up 
			JOIN 
				tipo_productos t ON p.fk_id_tipo_producto = t.id_tipo 
			JOIN 
				categorias_producto c ON t.fk_categoria_pro = c.id_categoria 
			JOIN 
				detalles d ON d.fk_id_movimiento = f.id_factura 
			LEFT JOIN 
				instructores i ON d.fk_id_instructor = i.id_instructores 
			LEFT JOIN 
				titulados ti ON d.fk_id_titulado = ti.id_titulado 
			WHERE 
				f.id_factura = ?`, [id]);

		// Verificación de la existencia de resultados
		if (result.length > 0) {
			// Respuesta exitosa con el movimiento y sus detalles
			res.status(200).json(result);
		} else {
			// Respuesta de error con mensaje en caso de no encontrar el movimiento
			res.status(404).json({
				status: 404,
				message: "No existe un movimiento con el ID proporcionado."
			});
		}
	} catch (err) {
		// Respuesta de error en caso de fallo en la consulta
		res.status(500).json({
			message: 'Error en buscar movimiento :(' + err
		});
	}
};

// Función para actualizar un movimiento
export const actualizarMovimiento = async (req, res) => {
    try {
        // Validación de los datos recibidos en la solicitud HTTP
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }
        
        // Extracción del ID del movimiento desde los parámetros de la URL
        const id = req.params.id;
        
        // Extracción de los datos actualizados del movimiento desde el cuerpo de la solicitud
        const { estado_producto_movimiento, precio_movimiento, nota_factura, fecha_caducidad, cantidad_peso_movimiento} = req.body;
        
        // Consulta para obtener la cantidad inicial del movimiento seleccionado
        const [movimientoInicial] = await pool.query(`SELECT cantidad_peso_movimiento FROM factura_movimiento WHERE id_factura = ${id}`);
        const cantidadMovimientoInicial = movimientoInicial[0].cantidad_peso_movimiento;

        // Cálculo de la diferencia entre la nueva cantidad de movimiento y la cantidad inicial de movimiento
        const diferenciaMovimiento = cantidad_peso_movimiento - cantidadMovimientoInicial;

        // Consulta para obtener el ID del producto asociado al movimiento
        const [id_producto] = await pool.query(`SELECT fk_id_producto FROM factura_movimiento WHERE id_factura = ${id}`);
        const idProducto = id_producto[0].fk_id_producto;

        // Consulta para obtener la cantidad actual del producto
        const [productoActual] = await pool.query(`SELECT cantidad_peso_producto FROM productos WHERE id_producto = ${idProducto}`);
        const cantidadProductoActual = productoActual[0].cantidad_peso_producto;

        // Verificar si la cantidad actualizada del producto es válida
        if (cantidadProductoActual + diferenciaMovimiento >= 0) {
            // Consulta para actualizar el movimiento
            const sql = `UPDATE factura_movimiento SET estado_producto_movimiento=?, precio_movimiento=?, nota_factura=?, fecha_caducidad=?, cantidad_peso_movimiento=? WHERE id_factura=?`;
            
            // Consulta para actualizar la cantidad de producto en la tabla de productos
            const sql2 = `UPDATE productos SET cantidad_peso_producto = cantidad_peso_producto + ? WHERE id_producto=?`;
            
            // Cálculo del nuevo precio total del movimiento
            const precioTotalMov = precio_movimiento * cantidad_peso_movimiento;

            // Consulta para actualizar el precio total del movimiento
            const sql3 = `UPDATE factura_movimiento SET precio_total_mov = ? WHERE id_factura=?`;
            
            // Ejecutar las consultas en paralelo
            const [result1, result2, result3] = await Promise.all([
                pool.query(sql, [estado_producto_movimiento, precio_movimiento, nota_factura, fecha_caducidad, cantidad_peso_movimiento, id]),
                pool.query(sql2, [diferenciaMovimiento, idProducto]),
                pool.query(sql3, [precioTotalMov, id])
            ]);

            // Verificar si todas las consultas se ejecutaron correctamente
            if (result1[0].affectedRows > 0 && result2[0].affectedRows >= 0 && result3[0].affectedRows > 0) {
                // Respuesta exitosa
                res.status(200).json({ "status": 200, "message": "¡Se actualizó el movimiento con éxito!" });
            } else {
                // Respuesta de error en caso de fallo en alguna consulta
                res.status(401).json({ "status": 401, "message": "¡No se actualizó el movimiento!" });
            }
        }
    } catch (e) {
        // Respuesta de error en caso de fallo en el servidor
        res.status(500).json({
            "status": 500,
            "message": "Error en el servidor"
        });
    }
};



// Función para actualizar un movimiento de salida
export const actualizarMovimientoSalida = async (req, res) => {
    try {
        // Validación de los datos recibidos en la solicitud HTTP
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error);
        }

        // Extracción del ID del movimiento desde los parámetros de la URL
        let id = req.params.id;
        // Extracción de los datos actualizados del movimiento desde el cuerpo de la solicitud
        let { nota_factura, cantidad_peso_movimiento, fk_id_producto, destino_movimiento, fk_id_instructor, fk_id_titulado } = req.body;
		
        // Validación de la presencia de titulado e instructor si el destino es taller o evento
        if ((destino_movimiento === "taller" || destino_movimiento === "evento") && (!fk_id_titulado || !fk_id_instructor)) {
            return res.status(400).json({
                "status": 400,
                "mensaje": "En taller o evento es necesario un titulado e instructor."
            });
        }

        let cantidadNueva = cantidad_peso_movimiento;

        // Consulta para obtener la cantidad de producto original
        let sql6 = `SELECT cantidad_peso_producto FROM productos WHERE id_producto = '${fk_id_producto}'`;
        let result5 = await pool.query(sql6);
        let cantidadOriginalProducto = result5[0][0].cantidad_peso_producto;

        // Consulta para obtener la cantidad de movimiento previa
        let sqlPrevMovimiento = `SELECT cantidad_peso_movimiento FROM factura_movimiento WHERE id_factura = '${id}'`;
        let resultPrevMovimiento = await pool.query(sqlPrevMovimiento);
        let prevMovimiento = resultPrevMovimiento[0][0].cantidad_peso_movimiento;

        let nuevaCantidadTotal = cantidadOriginalProducto - cantidadNueva;
        if (nuevaCantidadTotal < 0) {
            return res.status(402).json({
                "status": 402,
                "mensaje": "La nueva cantidad total es menor que 0. Ingrese una cantidad no mayor a lo que tiene disponible."
            });
        } else {
            // Realizar la actualización en la base de datos
            let sql = `UPDATE factura_movimiento SET nota_factura='${nota_factura}',cantidad_peso_movimiento='${cantidad_peso_movimiento}' where id_factura=${id}`;
            let diffMovimiento = cantidad_peso_movimiento - prevMovimiento;
            let sql2 = `UPDATE productos SET cantidad_peso_producto = cantidad_peso_producto - ${diffMovimiento} WHERE id_producto = ${fk_id_producto}`;

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
        // Respuesta de error en caso de fallo en el servidor
        res.status(500).json({
            "status": 500,
            "errors": [{ "msg": "Error en el servidor: " + e }]
        });
    }
};

// Función para obtener productos por categoría
export const obtenerProCategoria = async (req, res) => {
	try {
		// Extracción del ID de la categoría desde los parámetros de la URL
		let id = req.params.id_categoria;
		// Consulta para obtener productos de una categoría específica
		let sql = `SELECT pr.id_tipo, pr.nombre_tipo, pr.unidad_peso FROM tipo_productos pr JOIN categorias_producto cat ON cat.id_categoria = pr.fk_categoria_pro where cat.id_categoria= ${id} and pr.estado=1;`;

		// Ejecución de la consulta
		const [rows] = await pool.query(sql);

		// Verificación de la existencia de resultados
		if (rows.length > 0) {
			// Respuesta exitosa con los productos de la categoría especificada
			res.status(200).json(rows);
		} else {
			// Respuesta indicando que no se encontraron productos para la categoría especificada
			res.status(200).json({ "status": 401 , "message":"No se listaron productos"});
		}
	} catch (e) {
		// Respuesta de error en caso de fallo en el servidor
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
};


// Función para obtener la unidad de peso de un producto
export const obtenerUnidad = async (req, res) => {
	try {
		// Extracción del ID del producto desde los parámetros de la URL
		let id = req.params.id_producto;
		// Consulta para obtener la unidad de peso del producto específico
		let sql = `SELECT pr.id_tipo, pr.unidad_peso, pr.nombre_tipo FROM tipo_productos pr where pr.id_tipo=${id};`;

		// Ejecución de la consulta
		const [rows] = await pool.query(sql);

		// Verificación de la existencia de resultados
		if (rows.length > 0) {
			// Respuesta exitosa con la unidad de peso del producto
			res.status(200).json(rows);
		} else {
			// Respuesta indicando que no se encontraron unidades para el producto
			res.status(200).json({ "status": 401 , "message":"No se listaron unidades"});
		}
	} catch (e) {
		// Respuesta de error en caso de fallo en el servidor
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
};

// Función para obtener los productos de una categoría con cantidad disponible
export const obtenerProProductos = async (req, res) => {
	try {
		// Extracción del ID de la categoría desde los parámetros de la URL
		let id = req.params.id_categoria;
		// Consulta para obtener los productos de una categoría específica con cantidad disponible
		let sql = `SELECT p.id_producto, pr.nombre_tipo,p.cantidad_peso_producto,pr.unidad_peso,pr.id_tipo FROM  productos p JOIN tipo_productos pr ON p.fk_id_tipo_producto = pr.id_tipo JOIN categorias_producto cat ON pr.fk_categoria_pro = cat.id_categoria WHERE cat.id_categoria= ${id} and pr.estado=1 and p.cantidad_peso_producto > 0;`;

		// Ejecución de la consulta
		const [rows] = await pool.query(sql);

		// Verificación de la existencia de resultados
		if (rows.length > 0) {
			// Respuesta exitosa con los productos de la categoría especificada y cantidad disponible
			res.status(200).json(rows);
		} else {
			// Respuesta indicando que no se encontraron productos para la categoría o no hay cantidad disponible
			res.status(200).json({ "status": 401 , "message":"No se listaron productos"});
		}
	} catch (e) {
		// Respuesta de error en caso de fallo en el servidor
		res.status(500).json({
			"status": 500,
			"message": "Error en el servidor" + e
		});
	}
};