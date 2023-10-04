import {pool} from '../database/conexion.js';

import{validationResult} from 'express-validator';

export const guardarFactura = async (req,res)=> {
    try{
        let error1 = validationResult(req);
        if (!error1.isEmpty()){
            return res.status(400).json(error1);
        }
        let{tipoMov,cantidadMov,unidadMov,precioMov,estadoMov,notaMov,fechaCadMov,idProductoMov,idUsuarioMov,idProveedorMove} = req.body;
        let sql=`insert into factura_movimiento (tipo_movimiento,cantidad_peso_movimiento,unidad_peso_movimiento,precio_movimiento,estado_producto_movimiento,nota_factura,fecha_caducidad_producto,fk_id_producto,fk_id_usuario,fk_id_proveedor )
                    values ('${tipoMov}','${cantidadMov}','${unidadMov}','${precioMov}','${estadoMov}','${notaMov}','${fechaCadMov}','${idProductoMov}','${idUsuarioMov}','${idProveedorMove}')`;
        console.log(sql);
        const [rows] = await pool.query(sql);
        console.log(rows);
        if (rows.affectedRows>0){
            return res.status(200).json(
                {
                    "status":200,
                    "message":"Se registró con éxito el movimiento"
                }
            )
        } else {
             return res.status(401).json(
                {
                    "status":401,
                    "message":"No se registro el movimiento"
                }
            )
        }
    } catch {
        res.status(500).json(
            {
                "status":500,
                "message":"Error en el servidor"
            }
        )
    }
}