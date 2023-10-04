import express from 'express';
import body_parser from  'body-parser';
import usuarioRoute from './backend/src/routes/usuario.routes.js';

const igs = express();

igs.use(body_parser.json());
igs.use(body_parser.urlencoded({extended:false}));


igs.use('/usuario', usuarioRoute);

igs.listen(3000,()=>{
    console.log('Servidor IGS ejecutando en el puerto 3000');
})


