// Importamos las librerías necesarias.
import express from 'express';
import cors from'cors';
import body_parser from  'body-parser';

// Importamos las rutas de cada entidad.
import facturaMovimientoRoute from './backend/src/routes/facturaMovimiento.routes.js';
import productoRouter from './backend/src/routes/productos.routes.js';
import provedorRouter from './backend/src/routes/provedor.routes.js';
import usuarioRouter from './backend/src/routes/usuario.routes.js';
import tipo_productoRouter from './backend/src/routes/tipo_producto.routes.js';
import categoria_productoRouter from './backend/src/routes/categoria_producto.routes.js';
import unidadProductiva from './backend/src/routes/unidadProductiva.routes.js';
import titulado from './backend/src/routes/titulado.routes.js';
import instructores from './backend/src/routes/instructores.routes.js';
import detalles from './backend/src/routes/detalles.routes.js';
import autRouter from './backend/src/routes/autentificacion.routes.js';

// Definimos el puerto en el que se ejecutará nuestra aplicación.
const port = 3002;

// Creamos nuestra aplicación Express.
const igs = express();

// Usamos el middleware 'cors' para permitir solicitudes de origen cruzado.
igs.use(cors());

// Usamos 'body-parser' para parsear el cuerpo de las solicitudes entrantes.
igs.use(body_parser.json());
igs.use(body_parser.urlencoded({extended:false}));

// Configuramos los encabezados de las respuestas para permitir solicitudes de origen cruzado.
igs.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCh, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, token");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", 3600);
    next();
});

// Configuramos el motor de vistas y la ubicación de las vistas.
igs.set('view engine','ejs')
igs.set('views','../igs/backend/src/views');

// Configuramos la ubicación de los archivos estáticos.
igs.use(express.static('../igs/backend/src/public'))
igs.use(express.static('../igs/backend/src/views/js'))

// Definimos una ruta para renderizar la vista 'index.ejs'.
igs.get('/documents', (req,res) => {
    res.render('index.ejs');
});

// Usamos el middleware 'express.json()' para parsear el cuerpo de las solicitudes entrantes en formato JSON.
igs.use(express.json()); 

// Definimos las rutas de nuestra aplicación.
igs.use('/facturamovimiento',facturaMovimientoRoute); 
igs.use('/producto',productoRouter);
igs.use('/proveedor', provedorRouter);
igs.use('/usuario', usuarioRouter);
igs.use('/tipo', tipo_productoRouter);
igs.use('/categoria', categoria_productoRouter);
igs.use('/up', unidadProductiva);
igs.use('/titulado',titulado);
igs.use('/instructor',instructores);
igs.use('/detalle', detalles);
igs.use('/aut', autRouter);

// Iniciamos nuestro servidor en el puerto definido.
igs.listen(port,()=>{
    console.log(`Servidor IGS ejecutando en http://localhost:${port}`);
})

