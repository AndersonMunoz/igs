import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";

export const registroInstructor = async (req, res) => {
 
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(403).json(error)
        }
        let {documento_instructor, nombre_instructor} = req.body;
        const documento_instructorQuery = `SELECT * FROM  instructores  WHERE documento_instructor = '${documento_instructor}'`;
        const [existingInstructor] = await pool.query(documento_instructorQuery);
        
        
        if (existingInstructor.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El documento ya esta registrado"
            });
        }
        let sql = `insert into instructores (documento_instructor,nombre_instructor) values('${documento_instructor}','${nombre_instructor}')`;
      
        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                "status": 200,
                "menssage": " El Instructor fue  registrado  con exito "
            })
        } else {
            res.status(403).json({
                "status": 403,
                "menssage": "El Instructor no se puedo registrar"
            })
        }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "status": "Error interno, intente nuevamente" + error
        })
    }
}
export const listarInstructor = async (req, res) => {
    try {
        const [result] = await pool.query
            ('SELECT estado, id_instructores, documento_instructor, nombre_instructor FROM instructores');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({
                "status": 204,
                "message": "No se Listo los intructores"
            });
        }
    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}

export const listarInstructoresCount = async (req, res) => {
    try {
        const [result] = await pool.query('SELECT COUNT(*) AS count FROM instructores');
        if (result.length > 0) {
            res.status(200).json({ count: result[0].count });

        }
    } catch (err) {
        res.status(500).json({
            message: 'Error en servidor:' + err
        })
    }
};

export const listarActivoInstructor = async (req, res) => {
    try {
        const [result] = await pool.query
            ('SELECT i.estado, i.id_instructores AS id, i.documento_instructor AS Documento,i.nombre_instructor AS nombre FROM instructores i');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({
                "status": 204,
                "message": "No se Listo los intrutores"
            });
        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}

export const buscarIntructor = async (req, res) => {
    try {
      let id = req.params.id;
      const [result] = await pool.query(
        "SELECT * FROM instructores WHERE 	id_instructores=" + id
      );
      res.status(200).json(result);
      }catch(e){
          res.status(500).json({message: 'Error en  buscar  : '+e})
      }
  }


export const editarInstructor = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error)
        }
        let id = req.params.id;
        let { documento_instructor , nombre_instructor} = req.body;

        let sql = `update instructores SET documento_instructor = '${documento_instructor}' , nombre_instructor= '${nombre_instructor}'
        where id_instructores = ${id} `;
        console.log(sql)

        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json(
                { "status": 200, "menssge": "Se actualizo con exito el instructor  " });
        } else {
            res.status(401).json(
                { "status": 401, "menssge": "No se actualizo el instructor  " });
        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}


export const deshabilitarInstructor = async (req, res) => {
    try {
      let id = req.params.id;
      let sql = `UPDATE instructores SET estado = 0 WHERE id_instructores  = ${id}`;
      const [rows] = await pool.query(sql);
      if (rows.affectedRows > 0) {
        res
          .status(200)
          .json({ status: 200, message: "Se deshabilitó con éxito el instructor " });
      } else {
        res
          .status(401)
          .json({ status: 401, message: "No se deshabilitó el instructor" });
      }
    } catch (e) {
      res.status(500).json({ message: "Error en deshabilitar el instructor: " + e });
    }
  };

  export const activarInstructor = async (req, res) => {
    try {
      let id = req.params.id;
      let sql = `UPDATE instructores SET estado = 1 WHERE id_instructores  = ${id}`;
      const [rows] = await pool.query(sql);
      if (rows.affectedRows > 0) {
        res
          .status(200)
          .json({ status: 200, message: "Se activo  con éxito el instructor " });
      } else {
        res
          .status(401)
          .json({ status: 401, message: "No se activo  el instructor" });
      }
    } catch (e) {
      res.status(500).json({ message: "Error en activar el instructor: " + e });
    }
  };