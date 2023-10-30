import {pool} from '../database/conexion.js';
import{validationResult} from 'express-validator';

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

export const listarMovimientos = async (req, res) =>{
try{
	const [result] = await pool.query('SELECT * FROM factura_movimiento');
		res.status(200).json(result);
}catch(e){
	res.status(500).json({message: 'Error en listar movimientos: '+e})
}
}

export const buscarMovimiento = async (req, res) => {
	try {
		let error = validationResult(req);
        if (!error.isEmpty()){
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

export const actualizarMovimiento = async (req,res) =>{
	try {
			let id = req.params.id;
			let{estado_producto_movimiento,nota_factura,fecha_caducidad_producto,fk_id_producto,fk_id_usuario} = req.body;

			let sql=`UPDATE factura_movimiento SET estado_producto_movimiento='${estado_producto_movimiento}',nota_factura='${nota_factura}',fecha_caducidad_producto='${fecha_caducidad_producto}',fk_id_producto='${fk_id_producto}',fk_id_usuario='${fk_id_usuario}' where id_factura=${id}`;

			const [rows]=await pool.query(sql);
			
			if (rows.affectedRows>0) {
					res.status(200).json({"status":200,"message":"Se actualizó el movimiento con éxito :D ..!!"});
			} else {
					res.status(401).json({"status":401,"message":"NO se actualizó el movimiento :(  ..!!"});
			}
	} catch (e){
			res.status(500).json({"status":500,"message":"Error en el servidor"+e});
	}
};
