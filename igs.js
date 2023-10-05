import express from 'express';
import body_parser from  'body-parser';
import usuarioRoute from './backend/src/routes/usuario.routes.js';
import facturaMovimientoRoute from './backend/src/routes/facturaMovimiento.route.js';
import productoRouter from './backend/src/routes/productos.routes.js';
import provedorRouter from './backend/src/routes/provedor.routes.js';

const igs = express();

igs.use(body_parser.json());
igs.use(body_parser.urlencoded({extended:false}));

igs.use('/facturamovimiento',facturaMovimientoRoute);

igs.use('/producto',productoRouter);

igs.use('/provedor', provedorRouter);

igs.use('/usuario', usuarioRoute);

igs.listen(3000,()=>{
    console.log('Servidor IGS ejecutando en el puerto 3000');
})


