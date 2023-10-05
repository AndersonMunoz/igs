import { createPool } from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config({ path: '../backend/config/.env' });

// dotenv.config({path:'./env/.env'});
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../env/.env") });



pool.getConnection().then(connect => {
console.log("Conexión a base de datos exitosa.");
connect.release();
})
.catch(error => {
		console.error("Conexion a base de datos fallida. " + error);
})
