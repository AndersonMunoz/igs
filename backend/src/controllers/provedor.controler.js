import {pool} from '../database/conexion.js';

export const listarProvedor = async (req,res)=>{
    try {
        const [result]=await pool.query('select * from 	proveedores');
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({message: 'error en listar proveedores: '+e})
<<<<<<< HEAD
=======
        console.log(e);
>>>>>>> c1e8298d05e346890ac7cf7b88488fefd181ae05
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
        let {nombre_proveedores,telefono_proveedores,direccion_proveedores,contrato_proveedores} = req.body;
<<<<<<< HEAD
        let sql = `insert into Provedor (nombre_proveedores,telefono_proveedores,direccion_proveedores,usuario,contrato_proveedores)
                    values ('${nombre_proveedores}','${telefono_proveedores}','${direccion_proveedores}','${usuario}','${contrato_proveedores}','${estado}')`;
=======
        let sql = `insert into proveedores (nombre_proveedores,telefono_proveedores,direccion_proveedores,contrato_proveedores)
                    values ('${nombre_proveedores}','${telefono_proveedores}','${direccion_proveedores}','${contrato_proveedores}')`;
>>>>>>> c1e8298d05e346890ac7cf7b88488fefd181ae05
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
            res.status(401).json({"status":401,"message":"No se elimino el Provedor"
            }) 
        }
    }catch(e){
        res.status(500).json({message: 'Error en eliminar Provedor: '+e})
    }
}

export const actualizarProvedor = async (req,res) => {
    try{
        let id=req.params.id;
<<<<<<< HEAD
        let {nombre_proveedores,telefono_proveedores,contrato_proveedores} = req.body;
        let sql = `update proveedores set nombre_proveedores='${nombre_proveedores}',telefono_proveedores='${telefono_proveedores}',contrato_proveedores='${contrato_proveedores}', estado='${estado}' where id_proveedores= ${id}`;
=======
        let {nombre_proveedores,telefono_proveedores,contrato_proveedores,direccion_proveedores} = req.body;
        let sql = `update proveedores set nombre_proveedores='${nombre_proveedores}',telefono_proveedores='${telefono_proveedores}',contrato_proveedores='${contrato_proveedores}', direccion_proveedores='${direccion_proveedores}' where id_proveedores= ${id}`;
>>>>>>> c1e8298d05e346890ac7cf7b88488fefd181ae05
        const [rows] = await pool.query(sql);
        if(rows.affectedRows > 0){
            res.status(200).json({"status":200,"message":"Se actualizo con exito el Provedor"
            })
        }else{
            res.status(401).json({"status":401,"message":"No se actualizo el Provedor"
            }) 
        }
    }catch(e){
        res.status(500).json({message: 'Error en update Provedor: '+e})
    }
}