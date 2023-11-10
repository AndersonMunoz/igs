import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";

export const registroUnidadProductiva = async (req, res) => {

	try {

		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error)
		}

		let { nombre_up } = req.body;
		let sql = `insert into unidad_productiva (nombre_up)
        values('${nombre_up}')`;
		console.log(sql);

		const [rows] = await pool.query(sql);

		if (rows.affectedRows > 0) {

			res.status(200).json({
				"status": 200,
				"menssage": "Unidad productiva registrada con exito "
			})
		} else {
			res.status(403).json({
				"status": 403,
				"menssage": "Unidad productiva no se puedo registrar"
			})

		}
	} catch (error) {
		res.status(500).json({
			"status": 500,
			"status": "Error interno, intente nuevamente" + error
		})
	}
}

export const listarUnidadProductiva = async (req, res) => {
	try {
		const [result] = await pool.query('select * from unidad_productiva');
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(401).json({ "status": 401, "message": "No se pudo listar las unidades productivas " });
		}

	} catch (err) {
		res.status(500).json({
			massage: 'error en servidor:' + err
		})
	}

};
export const editarUnidadProductiva = async (req, res) => {
	try {
		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error)
		}
		let id = req.params.id;
		let { nombre_up } = req.body;

		let sql = `update unidad_productiva SET nombre_up = '${nombre_up}'
        where id_up = ${id} `;
		console.log(sql)

		const [rows] = await pool.query(sql);
		if (rows.affectedRows > 0) {
			res.status(200).json(
				{ "status": 200, "menssge": "Se actualizo con exito la unidad productiva " });
		} else {
			res.status(401).json(
				{ "status": 401, "menssge": "No se actualizo la unidad productiva " });
		}

	} catch (e) {
		res.status(500).json({
			"status": 500,
			"menssge": "Error interno en el sevidor " + e
		});
	}
}