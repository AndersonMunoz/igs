import { pool } from '../database/conexion.js'; // Importando el pool de conexión a la base de datos
import { validationResult } from 'express-validator'; // Importando el resultado de validación de express-validator
import multer from 'multer'; // Importando multer para manejar la carga de archivos

// Función para listar todos los datos de los proveedores
export const listarProvedor = async (req, res) => {
    try {
        const [result] = await pool.query('select * from proveedores'); // Consulta para seleccionar todos los datos de la tabla 'proveedores'
        res.status(200).json(result); // Enviando el resultado como respuesta JSON
    } catch (e) {
        res.status(500).json({ "status": 500, "message": `error en listar proveedores: ${e} en servidor` }); // Manejo de error
        console.log(e); // Registrando el error en la consola
    }
}

// Función para listar proveedores activos
export const listarProvedorActivo = async (req, res) => {
    try {
        const [result] = await pool.query('select * from proveedores WHERE estado = 1  ORDER BY estado DESC'); // Consulta para seleccionar proveedores activos
        res.status(200).json(result); // Enviando el resultado como respuesta JSON
    } catch (e) {
        res.status(500).json({ "status": 500, "message": `error en listar proveedores: ${e} en servidor` }); // Manejo de error
        console.log(e); // Registrando el error en la consola
    }
}


// Función para buscar un proveedor por su ID
export const buscarProvedor = async (req, res) => {
    try {
        let id = req.params.id; // Obteniendo el ID del proveedor de los parámetros de la solicitud
        const [result] = await pool.query('select * from proveedores where id_proveedores=' + id); // Consulta para buscar un proveedor por su ID
        res.status(200).json(result); // Enviando el resultado como respuesta JSON
    } catch (e) {
        res.status(500).json({ message: 'Error en buscar proveedor: ' + e }); // Manejo de error
    }
}

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "frontendReact/public/filePDF"); // Estableciendo la carpeta de destino para los archivos PDF
    },
    filename: function (req, file, cb) {
        const numeroContrato = file.originalname; // Obteniendo el nombre original del archivo
        const fecha = new Date();
        let hora = fecha.getHours; // Obtener la hora actual
        let minutos = fecha.getMinutes; // Obtener los minutos actuales
        let segundos = fecha.getSeconds(); // Obtener los segundos actuales
        const extension = file.originalname.split('.').pop(); // Obteniendo la extensión del archivo
        const nombreArchivo = `${numeroContrato}_${segundos}.${extension}`; // Creando un nombre único para el archivo
        cb(null, nombreArchivo); // Llamando al callback con el nombre de archivo generado
    }
});

// Configuración de carga de archivos con Multer
const upload = multer({ storage: storage });

// Función para cargar una imagen (archivo de contrato)
export const cargarImagen = upload.single('archivo_contrato');

// Función para registrar un proveedor
export const registrarProvedor = async (req, res) => {
    try {
        let error = validationResult(req); // Validando los resultados de la solicitud
        if (!error.isEmpty()) { // Comprobando si hay errores de validación
            return res.status(403).json({ "status": 403, error }); // Respondiendo con errores de validación si los hay
        }
        let { nombre_proveedores, telefono_proveedores, direccion_proveedores, contrato_proveedores, inicio_contrato, fin_contrato } = req.body; // Obteniendo datos del cuerpo de la solicitud
        let name = req.file.originalname; // Obteniendo el nombre original del archivo cargado
        const fecha = new Date(); // Obteniendo la fecha actual
        let hora = fecha.getHours; // Obtener la hora actual
        let minutos = fecha.getMinutes; // Obtener los minutos actuales
        let segundos = fecha.getSeconds(); // Obtener los segundos actuales
        let extension = req.file.originalname.split('.').pop(); // Obteniendo la extensión del archivo cargado
        let archivo_contrato = `${name}_${segundos}.${extension}`; // Creando un nombre único para el archivo de contrato
        
        // Consulta para verificar si ya existe un proveedor con el mismo contrato
        let selectUser = "SELECT nombre_proveedores FROM proveedores WHERE contrato_proveedores= " + contrato_proveedores
        const [rows] = await pool.query(selectUser)
        if (rows.length > 0) { // Si ya existe un proveedor con el mismo contrato
            res.status(409).json({ "status": 409, "message": "Duplicidad en contratos" }); // Respondiendo con un código de estado de conflicto
        } else {
            // Insertar los datos del proveedor en la base de datos
            let sql = `insert into proveedores (nombre_proveedores,telefono_proveedores,direccion_proveedores,contrato_proveedores,inicio_contrato, fin_contrato,archivo_contrato)
          values ('${nombre_proveedores}','${telefono_proveedores}','${direccion_proveedores}','${contrato_proveedores}','${inicio_contrato}','${fin_contrato}','${archivo_contrato}')`;
            const [rows] = await pool.query(sql);
            if (rows.affectedRows > 0) { // Si se afectó alguna fila en la base de datos
                res.status(200).json({ "status": 200, "message": "Se registró con éxito el Proveedor" }); // Respondiendo con éxito
            } else {
                res.status(401).json({ "status": 401, "message": "No se registró el Proveedor" }); // Respondiendo con un código de estado no autorizado
            }
        }
    } catch (e) {
        res.status(500).json({ message: 'Error en guardar Provedor: ' + e }); // Manejo de error interno del servidor
    }
}

// Función para eliminar un proveedor
export const eliminarProvedor = async (req, res) => {
    try {
        let id = req.params.id; // Obteniendo el ID del proveedor de los parámetros de la solicitud
        let sql = `UPDATE proveedores SET estado = 0 WHERE id_proveedores= ${id}`; // Consulta para deshabilitar un proveedor
        const [rows] = await pool.query(sql);
        if (rows.affectedRows > 0) { // Si se afectó alguna fila en la base de datos
            res.status(200).json({ "status": 200, "message": "Se deshabilitó con éxito el Proveedor" }); // Respondiendo con éxito
        } else {
            res.status(401).json({ "status": 401, "message": "No se deshabilitó con éxito el proveedor." }); // Respondiendo con un código de estado no autorizado
        }
    } catch (e) {
        res.status(500).json({ message: 'Error en eliminar Provedor: ' + e }); // Manejo de error interno del servidor
    }
}

// Función para actualizar un proveedor
export const actualizarProvedor = async (req, res) => {
    try {
        let error = validationResult(req); // Validando los resultados de la solicitud
        if (!error.isEmpty()) { // Comprobando si hay errores de validación
            return res.status(403).json({ "status": 403, error }); // Respondiendo con errores de validación si los hay
        }
        let id = req.params.id; // Obteniendo el ID del proveedor de los parámetros de la solicitud
        let { nombre_proveedores, telefono_proveedores, contrato_proveedores, direccion_proveedores, inicio_contrato, fin_contrato } = req.body; // Obteniendo datos del cuerpo de la solicitud
        
        // Consulta para verificar si ya existe otro proveedor con el mismo contrato, excluyendo al proveedor actual
        let selectUser = `SELECT nombre_proveedores FROM proveedores WHERE contrato_proveedores = '${contrato_proveedores}' AND id_proveedores != ${id}`;

        const [userExist] = await pool.query(selectUser)

        if (!userExist.length > 0) { // Si no existe otro proveedor con el mismo contrato
            // Consulta para actualizar los datos del proveedor en la base de datos
            let sql = `UPDATE proveedores SET nombre_proveedores='${nombre_proveedores}', telefono_proveedores='${telefono_proveedores}', contrato_proveedores='${contrato_proveedores}', direccion_proveedores='${direccion_proveedores}', inicio_contrato='${inicio_contrato}', fin_contrato='${fin_contrato}' WHERE id_proveedores=${id}`;

            const [rows] = await pool.query(sql);
            if (rows.affectedRows > 0) { // Si se afectó alguna fila en la base de datos
                res.status(200).json({ "status": 200, "message": "Proveedor actualizado con éxito" }); // Respondiendo con éxito
            } else {
                res.status(401).json({ "status": 401, "message": "No se actualizó el proveedor" }); // Respondiendo con un código de estado no autorizado
            }
        } else {
            res.status(409).json({ "status": 409, "message": "Duplicidad en contratos" }); // Respondiendo con un código de estado de conflicto
        }
    } catch (e) {
        res.status(500).json({ message: 'Error interno en el servidor: ' + e }); // Manejo de error interno del servidor
    }
}
