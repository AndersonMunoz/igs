import express from 'express';
import cors from'cors';
import body_parser from  'body-parser';
import facturaMovimientoRoute from './backend/src/routes/facturaMovimiento.routes.js';
import productoRouter from './backend/src/routes/productos.routes.js';
import provedorRouter from './backend/src/routes/provedor.routes.js';
import usuarioRouter from './backend/src/routes/usuario.routes.js';
import tipo_productoRouter from './backend/src/routes/tipo_producto.routes.js';
import categoria_productoRouter from './backend/src/routes/categoria_producto.routes.js';
import unidadProductiva from './backend/src/routes/unidadProductiva.routes.js';
import autRouter from './backend/src/routes/autentificacion.routes.js';

const port = 3000;

const igs = express();

igs.use(cors());

igs.use(body_parser.json());
igs.use(body_parser.urlencoded({extended:false}));
igs.use(cors());

igs.set('view engine','ejs')
igs.set('views','../igs/backend/src/views');

igs.use(express.static('../igs/backend/src/public'))
igs.use(express.static('../igs/backend/src/views/js'))

igs.get('/documents', (req,res) => {
    res.render('index.ejs');
});



igs.use(express.json()); 

igs.use('/facturamovimiento',facturaMovimientoRoute);

igs.use('/producto',productoRouter);

igs.use('/proveedor', provedorRouter);

igs.use('/usuario', usuarioRouter);

igs.use('/tipo', tipo_productoRouter);

igs.use('/categoria', categoria_productoRouter);

igs.use('/up', unidadProductiva);

igs.use('/aut', autRouter);

igs.listen(3000,()=>{
    console.log(`Servidor IGS ejecutando en http://localhost:${port}`);
})


