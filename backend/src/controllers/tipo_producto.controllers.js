import { pool } from "../database/conexion.js"
import { validationResult } from "express-validator";

// Esta función registra un nuevo tipo de producto en la base de datos.
export const registroTipo_producto = async (req, res) => {

    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
           return res.status(403).json({"status": 403 ,error})
        }
        let { nombre_tipo, fk_categoria_pro ,unidad_peso} = req.body;
        nombre_tipo = nombre_tipo.replace("'", "''");
        const TipoQuery = `SELECT * FROM tipo_productos WHERE nombre_tipo = '${nombre_tipo}'`;
        const [existingTipo] = await pool.query(TipoQuery);
        
        if (existingTipo.length > 0) {
            return res.status(409).json({
                "status": 409,
                "message": "El tipo de porducto ya esta registrado"
            });
        }
        let sql = `insert into tipo_productos (nombre_tipo,fk_categoria_pro,unidad_peso) values('${nombre_tipo}','${fk_categoria_pro}','${unidad_peso}')`;
      
        const [rows] = await pool.query(sql);

        if (rows.affectedRows > 0) {
            res.status(200).json({
                "status": 200,
                "menssage": " El tipo de producto fue  registrado  con exito "
            })
        } else {
            res.status(401).json({ status: 401, message: "No se pudo registrar." });
          }
    } catch (error) {
        res.status(500).json({
            "status": 500,
            "status": "Error interno, intente nuevamente" + error
        })
    }
}

 // Esta función obtiene todos los tipos de productos disponibles en la base de datos y los devuelve como resultado. Si no hay tipos de productos disponibles, devuelve un mensaje indicando que no se encontraron tipos de productos..
export const listarTipoProducto = async (req, res) => {
    try {
        const [result] = await pool.query
            ('SELECT t.estado, t.id_tipo AS id, t.nombre_tipo AS NombreProducto,t.unidad_peso AS UnidadPeso, c.nombre_categoria AS Categoría FROM tipo_productos t JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria ');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({
                "status": 204,
                "message": "No se Listo los productos"
            });
        }
    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}
 // Esta función lista solo los tipos de productos activos en la base de datos.
export const listarActivoTipo = async (req, res) => {
    try {
        const [result] = await pool.query
            ('SELECT t.estado, t.id_tipo AS id, t.nombre_tipo AS NombreProducto,t.unidad_peso AS UnidadPeso, c.nombre_categoria AS Categoría FROM tipo_productos t JOIN categorias_producto c ON t.fk_categoria_pro = c.id_categoria WHERE t.estado = 1 ORDER BY t.estado  DESC');
        if (result.length > 0) {
            res.status(200).json(result);
        } else {
            res.status(204).json({
                "status": 204,
                "message": "No se Listo los productos"
            });
        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}
  // Esta función busca un tipo de producto específico por su ID en la base de datos.
export const buscarTipoProducto = async (req, res) => {
    try {
      let id = req.params.id;
      const [result] = await pool.query(
        "SELECT * FROM tipo_productos WHERE 	id_tipo=" + id
      );
      res.status(200).json(result);
      }catch(e){
          res.status(500).json({message: 'Error en  buscar  : '+e})
      }
  }

// Esta función edita un tipo de producto existente en la base de datos.
export const editarTipo_producto = async (req, res) => {
    try {
        let error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json(error)
        }
        let id = req.params.id;
        let { nombre_tipo, fk_categoria_pro , unidad_peso} = req.body;
        nombre_tipo = nombre_tipo.replace("'", "''");
        let sql = `update tipo_productos SET nombre_tipo = '${nombre_tipo}', fk_categoria_pro= '${fk_categoria_pro}' , unidad_peso= '${unidad_peso}'
        where id_tipo = ${id} `;
        console.log(sql)

        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) {
            res.status(200).json(
                { "status": 200, "menssge": "Se actualizo con exito el tipo de producto  " });
        } else {
            res.status(401).json(
                { "status": 401, "menssge": "No se actualizo el tipo de producto  " });
        }

    } catch (e) {
        res.status(500).json({
            "status": 500,
            "menssge": "Error interno en el sevidor " + e
        });
    }
}
  // Esta función deshabilita un tipo de producto existente en la base de datos.

export const deshabilitarTipo = async (req, res) => {
    try {
      let id = req.params.id;
      let sql = `UPDATE tipo_productos SET estado = 0 WHERE id_tipo  = ${id}`;
      const [rows] = await pool.query(sql);
      if (rows.affectedRows > 0) {
        res
          .status(200)
          .json({ status: 200, message: "Se deshabilitó con éxito el tipo de producto " });
      } else {
        res
          .status(401)
          .json({ status: 401, message: "No se deshabilitó el tipo de producto" });
      }
    } catch (e) {
      res.status(500).json({ message: "Error en deshabilitartipo de producto: " + e });
    }
  };
 // Esta función activa un tipo de producto que previamente fue deshabilitado en la base de datos.

  export const activarTipo = async (req, res) => {
    try {
      let id = req.params.id;
      let sql = `UPDATE tipo_productos SET estado = 1 WHERE id_tipo  = ${id}`;
      const [rows] = await pool.query(sql);
      if (rows.affectedRows > 0) {
        res
          .status(200)
          .json({ status: 200, message: "Se activo  con éxito el tipo de producto " });
      } else {
        res
          .status(401)
          .json({ status: 401, message: "No se activo  el tipo de producto" });
      }
    } catch (e) {
      res.status(500).json({ message: "Error en activarTipo de producto: " + e });
    }
  };