import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";

export const registroDetalles = async (req, res) => {

	try {

	let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
    let { destino_movimiento,fk_id_movimiento,fk_id_instructor } = req.body;
		let sql = `insert into detalles (destino_movimiento,fk_id_movimiento,fk_id_instructor	)
        values('${destino_movimiento}','${fk_id_movimiento}','${fk_id_instructor}')`;

		const [rows] = await pool.query(sql);

		if (rows.affectedRows > 0) {
			res.status(200).json({
				"status": 200,
				"menssage": "El detalle se  registrada con exito "
			})
		} else {
			res.status(403).json({
				"status": 403,
				"menssage": "detalle no se puedo registrar"
			})

		}
	} catch (error) {
		res.status(500).json({
			"status": 500,
			"status": "Error interno, intente nuevamente" + error
		})
	}
}
export const listarDetalles = async (req, res) => {
	try {
		const [result] = await pool.query(`SELECT
		i.nombre_instructor AS NombreInstructor, i.documento_instructor AS Documento,
		d.destino_movimiento AS Detalle,
		f.fecha_movimiento AS Fecha, f.cantidad_peso_movimiento AS Cantidad,
		p.num_lote AS Lote,
		t.nombre_titulado AS Titulado, t.id_ficha AS Ficha
		FROM detalles d
		JOIN instructores i ON d.fk_id_movimiento = i.id_instructores
		JOIN titulados t ON i.fk_id_titulado = t.id_titulado
		JOIN factura_movimiento f ON d.fk_id_movimiento = f.id_factura
		JOIN productos p ON f.fk_id_producto = p.id_producto
    `);
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(204).json({ "status": 204, "message": "No se pudo listar detalles" });
		}
	} catch (err) {
        res.status(500).json({
            "status": 500, "message": "Error en el servidor   "+err
        
        })
    }
};
export const buscarDetalles = async (req, res) => {
  try {
    let id = req.params.id;
    const [result] = await pool.query(
      "SELECT * FROM detallles WHERE id_detalle=" + id
    );
    res.status(200).json(result);
    }catch(e){
        res.status(500).json({message: 'Error en  buscar  : '+e})
    }
}

// export const editarTitulado = async (req, res) => {
// 	try {
// 		let error = validationResult(req);
// 		if (!error.isEmpty()) {
// 			return res.status(400).json(error)
// 		}
// 		let id = req.params.id;
// 		let { nombre_titulado,id_ficha} = req.body;

// 		let sql = `update titulados SET nombre_titulado = '${nombre_titulado}',id_ficha ='${id_ficha}'
//         where id_titulado = ${id} `;
		

// 		const [rows] = await pool.query(sql);
// 		if (rows.affectedRows > 0) {
// 			res.status(200).json(
// 				{ "status": 200, "menssge": "Se actualizo con exito el  titulado " });
// 		} else {
// 			res.status(401).json(
// 				{ "status": 401, "menssge": "No se actualizo el titulado " });
// 		}

// 	} catch (e) {
// 		res.status(500).json({
// 			"status": 500,
// 			"menssge": "Error interno en el sevidor " + e
// 		});
// 	}
// }
