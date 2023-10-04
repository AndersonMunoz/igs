import express from 'express';
import body_parser from  'body-parser';
import facturaMovimientoRoute from './backend/src/routes/facturaMovimiento.route';

const igs = express();

igs.use(body_parser.json());
igs.use(body_parser.urlencoded({extended:false}));

igs.use('/facturaMovimiento',facturaMovimientoRoute);


igs.listen(3000,()=>{
    console.log('Servidor IGS ejecutando en el puerto 3000');
})


