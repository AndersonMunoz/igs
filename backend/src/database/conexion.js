import {createPool} from 'mysql2/promise';
import dotenv from 'dotenv';
<<<<<<< HEAD
dotenv.config({path:'./env/.env'});


export const pool = createPool({
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        port:process.env.DB_PORT,
        database:process.env.DB_DATABASE
=======
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../env/.env") });

export const pool = createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
	database: process.env.DB_DATABASE
})

pool.getConnection().then(connect => {
console.log("Conexión a base de datos exitosa.");
connect.release();
})
.catch(error => {
	console.error("Conexion a base de datos fallida. " + error);
>>>>>>> c1e8298d05e346890ac7cf7b88488fefd181ae05
})