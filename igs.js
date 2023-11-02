import express from 'express';
import body_parser from  'body-parser';
import cors from 'cors';
import facturaMovimientoRoute from './backend/src/routes/facturaMovimiento.routes.js';
import productoRouter from './backend/src/routes/productos.routes.js';
import provedorRouter from './backend/src/routes/provedor.routes.js';
import usuarioRouter from './backend/src/routes/usuario.routes.js';
import autRouter from './backend/src/routes/autentificacion.routes.js';


const igs = express();

igs.use(body_parser.json());
igs.use(body_parser.urlencoded({extended:false}));
igs.use(cors());

igs.use('/facturamovimiento',facturaMovimientoRoute);

igs.use('/producto',productoRouter);

igs.use('/provedor', provedorRouter);

igs.use('/usuario', usuarioRouter);

igs.use('/aut', autRouter);

igs.listen(3000,()=>{
    console.log('Servidor IGS ejecutando en el puerto 3000');
})


