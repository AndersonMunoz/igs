import {pool} from '../database/conexion.js';
import {validationResult} from 'express-validator';

export const listarProvedor = async (req,res)=>{
    try {
        const [result]=await pool.query('select * from 	proveedores where estado = 1');
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({message: 'error en listar proveedores: '+e})
        console.log(e);
    }
}



export const buscarProvedor = async (req,res)=>{
    try{
        let id=req.params.id;
        const [result] = await pool.query('select * from proveedores where 	id_proveedores='+id);
        res.status(200).json(result);
    }catch(e){
        res.status(500).json({message: 'Error en buscar proveedor: '+e})
    }
}

export const registrarProvedor = async (req, res) => {
    try{
        let error = validationResult(req);
		if(!error.isEmpty()){
			return res.status(403).json(error)
		}
        let {nombre_proveedores,telefono_proveedores,direccion_proveedores,contrato_proveedores} = req.body;
        let sql = `insert into proveedores (nombre_proveedores,telefono_proveedores,direccion_proveedores,contrato_proveedores)
                    values ('${nombre_proveedores}','${telefono_proveedores}','${direccion_proveedores}','${contrato_proveedores}')`;
        const [rows] = await pool.query(sql);
        if(rows.affectedRows > 0) {
            res.status(200).json({"status":200,"message":"Se registro con exito Provedor "
            })
        }else{
            res.status(401).json({"status":401,"message":"No se registro el Provedor"
            }) 
        }
        }catch(e){
        res.status(500).json({message: 'Error en guardar Provedor: '+e})
    }
}

export const eliminarProvedor = async (req,res) =>{
    try{
        let id = req.params.id;
        let sql = `UPDATE proveedores SET estado = 0 WHERE id_proveedores= ${id}`;
        const [rows] = await pool.query(sql);
        if(rows.affectedRows > 0){
            res.status(200).json({"status":200,"message":"Se elimino con exito el Provedor"
            })
        }else{
            res.status(401).json({"status":401,"message":"No autorizado"
            }) 
        }
    }catch(e){
        res.status(500).json({message: 'Error en eliminar Provedor: '+e})
    }
}

export const actualizarProvedor = async (req,res) => {
    try{
        let error = validationResult(req);
		if(!error.isEmpty()){
			return res.status(403).json(error)
		}
        let id=req.params.id;
        let {nombre_proveedores,telefono_proveedores,contrato_proveedores,direccion_proveedores} = req.body;
        let sql = `update proveedores set nombre_proveedores='${nombre_proveedores}',telefono_proveedores='${telefono_proveedores}',contrato_proveedores='${contrato_proveedores}', direccion_proveedores='${direccion_proveedores}' where id_proveedores= ${id}`;
        const [rows] = await pool.query(sql);
        if(rows.affectedRows > 0){
            res.status(200).json({"status":200,"message":"Proveedor actualizado con éxito"
            })
        }else{
            res.status(401).json({"status":401,"message":"No se actualizó el proveedor"
            }) 
        }
    }catch(e){
        res.status(500).json({message: 'Error interno en el servidor: '+e})
    }
}