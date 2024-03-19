import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";

export const registroTitulado = async (req, res) => {

	try {

	let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }


		let { nombre_titulado,id_ficha } = req.body;
        const id_fichaQuery = `SELECT * FROM titulados WHERE id_ficha = '${id_ficha}'`;
		const [existingid_ficha] = await pool.query(id_fichaQuery);
		

        if (existingid_ficha.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El id de ficha  ya está registrado"
            });
        }

		let sql = `insert into titulados (nombre_titulado,id_ficha	)
        values('${nombre_titulado}','${id_ficha}')`;

		const [rows] = await pool.query(sql);

		if (rows.affectedRows > 0) {

			res.status(200).json({
				"status": 200,
				"menssage": "El titulado se  registrada con exito "
			})
		} else {
			res.status(204).json({
				"status": 204,
				"message": "No se Listo el titulado "
			});
		}
		} catch (error) {
		res.status(500).json({
			"status": 500,
			"status": "Error interno, intente nuevamente" + error
		})
	}
}

export const listarTitulado = async (req, res) => {
	try {
		const [result] = await pool.query('select * from titulados');
		if (result.length > 0) {
			res.status(200).json(result);
		} else {
			res.status(204).json({ "status": 204, "message": "No se pudo listar tituladoss" });
		}

	} catch (err) {
        res.status(500).json({
            "status": 500, "message": "Error en el servidor   "+err
        
        })
    }

};
export const buscarTitulado = async (req, res) => {
    try {
      let id = req.params.id;
      const [result] = await pool.query(
        "SELECT * FROM titulados WHERE id_titulado=" + id
      );
      res.status(200).json(result);
      }catch(e){
          res.status(500).json({message: 'Error en  buscar  : '+e})
      }
  }
export const editarTitulado = async (req, res) => {
	try {
		let error = validationResult(req);
		if (!error.isEmpty()) {
			return res.status(400).json(error)
		}
		let id = req.params.id;
		let { nombre_titulado,id_ficha} = req.body;

		let sql = `update titulados SET nombre_titulado = '${nombre_titulado}',id_ficha ='${id_ficha}'
        where id_titulado = ${id} `;
		

		const [rows] = await pool.query(sql);
		if (rows.affectedRows > 0) {
			res.status(200).json(
				{ "status": 200, "menssge": "Se actualizo con exito el  titulado " });
		} else {
			res.status(401).json(
				{ "status": 401, "menssge": "No se actualizo el titulado " });
		}

	} catch (e) {
		res.status(500).json({
			"status": 500,
			"menssge": "Error interno en el sevidor " + e
		});
	}
}

export const deshabilitarTitulado = async (req, res) => {
	try {
		let id = req.params.id;
		let sql = `UPDATE titulados SET estado = 0 WHERE id_titulado  = ${id}`;
		const [rows] = await pool.query(sql);
		if (rows.affectedRows > 0) {
			res
				.status(200)
				.json({ status: 200, message: "Se deshabilitó con éxito el titulado " });
		} else {
			res
				.status(401)
				.json({ status: 401, message: "No se deshabilitó el titulado" });
		}
	} catch (e) {
		res.status(500).json({ message: "Error en deshabilitartipo el  titulado: " + e });
	}
};

export const activarTitulado = async (req, res) => {
	try {
		let id = req.params.id;
		let sql = `UPDATE titulados SET estado = 1 WHERE id_titulado  = ${id}`;
		const [rows] = await pool.query(sql);
		if (rows.affectedRows > 0) {
			res
				.status(200)
				.json({ status: 200, message: "Se activo  con éxito el titulado" });
		} else {
			res
				.status(401)
				.json({ status: 401, message: "No se activo  titulado " });
		}
	} catch (e) {
		res.status(500).json({ message: "Error en activarTipo titulado: " + e });
	}
};