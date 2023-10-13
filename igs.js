import express from 'express';
import cors from'cors';
import body_parser from  'body-parser';
import facturaMovimientoRoute from './backend/src/routes/facturaMovimiento.routes.js';
import productoRouter from './backend/src/routes/productos.routes.js';
import provedorRouter from './backend/src/routes/provedor.routes.js';
import usuarioRouter from './backend/src/routes/usuario.routes.js';
import autRouter from './backend/src/routes/autentificacion.routes.js';

const port = 3000;

// const registerProductoArr = [];

const igs = express();

igs.use(cors());

igs.use(body_parser.json());
igs.use(body_parser.urlencoded({extended:false}));


// igs.use(express.json()); 

igs.use('/facturamovimiento',facturaMovimientoRoute);

igs.use('/producto',productoRouter);

igs.use('/provedor', provedorRouter);

igs.use('/usuario', usuarioRouter);

igs.use('/aut', autRouter);

// igs.get("/registerProducto", (req, res) => {
//     res.send(JSON.stringify(registerProductoArr))
// });


// igs.post("/registerProducto", (req, res) => {
//     try {
//         const registerProducto = req.body;
//         registerProductoArr.push(registerProducto);

//         res.json({ message: "Producto Guardado" });
//         console.log(registerProductoArr);
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ message: e.message });
//     }
// });

igs.listen(3000,()=>{
    console.log(`Servidor IGS ejecutando en http://localhost:${port}`);
})


