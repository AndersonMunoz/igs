import express from 'express';
import body_parser from  'body-parser';

// importar la ruta de provedor
import provedorRouter from './backend/src/routes/provedor.router'


const igs = express();

igs.use(body_parser.json());
igs.use(body_parser.urlencoded({extended:false}));


igs.use('/provedor', provedorRouter);







igs.listen(3000,()=>{
    console.log('Servidor IGS ejecutando en el puerto 3000');
})


