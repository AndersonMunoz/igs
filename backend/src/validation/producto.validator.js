import { check, validationResult } from "express-validator";

export const validatorProducto = [
  check('fecha_caducidad_producto', 'Error en la fecha de caducidad')
    .exists()
    .not()
    .isEmpty()
    .matches(/^\d{4}-\d{2}-\d{2}$/),
  check('cantidad_peso_producto', 'Error en la cantidad peso del producto')
    .exists()
    .not()
    .isEmpty()
    .isFloat({ min: 0 }),
  check('unidad_peso_producto','Error en el peso del producto')
    .isIn(['kg','lb','gr','lt','ml'])
    .exists()
    .not()
    .isEmpty(),
  check('descripcion_producto','Error en la descripcion del producto')
    .exists()
    .not()
    .isEmpty()
    .isLength({min: 5, max: 200}),
  check('precio_producto', 'Error en el precio del producto')
    .exists()
    .not()
    .isEmpty()
<<<<<<< HEAD:backend/src/validation/validator.js
    .isFloat({ min: 0 }),
    // (req, res, next) => {
    //   const errors = validationResult(req);
  
    //   if (errors.isEmpty()) {
    //     return next();
    //   }
  
    //   const errorsObj = {};
    //   errors.array().forEach(error => {
    //     errorsObj[error.msg] = error.msg;
    //   });
  
    //   res.status(403).json({ errors: errorsObj });
    // }
=======
    .isFloat({ min: 0 })  
>>>>>>> devdsmc:backend/src/validation/producto.validator.js
];

