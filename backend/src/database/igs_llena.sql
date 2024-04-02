-- phpMyAdmin SQL Dump
-- version 5.1.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-04-2024 a las 03:03:33
-- Versión del servidor: 10.4.18-MariaDB
-- Versión de PHP: 7.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `igs`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bodega`
--

CREATE TABLE `bodega` (
  `id_up` int(11) NOT NULL,
  `nombre_up` varchar(45) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_producto`
--

CREATE TABLE `categorias_producto` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(45) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `tipo_categoria` enum('perecedero','no perecedero') NOT NULL,
  `codigo_categoria` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `categorias_producto`
--

INSERT INTO `categorias_producto` (`id_categoria`, `nombre_categoria`, `estado`, `tipo_categoria`, `codigo_categoria`) VALUES
(1, 'carnes y salsamentaria ', 1, 'perecedero', 'CS'),
(2, 'pescados y mariscos  ', 1, 'perecedero', 'PM'),
(3, 'Aves y caza ', 1, 'perecedero', 'AC'),
(4, 'Lácteos(1)', 1, 'perecedero', 'L1'),
(5, 'Frutas y verduras ', 1, 'perecedero', 'FV'),
(6, 'Lácteos(2)', 1, 'no perecedero', 'L2'),
(7, 'Enlatados y envasados ', 1, 'no perecedero', 'EE'),
(8, 'Granos', 1, 'no perecedero', 'G'),
(9, 'Licores(Bebidas Alcohólicas)', 1, 'no perecedero', 'LC'),
(10, 'Vinos', 1, 'no perecedero', 'V'),
(11, 'gaseosas ', 1, 'no perecedero', 'Gs');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalles`
--

CREATE TABLE `detalles` (
  `id_detalle` int(11) NOT NULL,
  `destino_movimiento` enum('taller','produccion','evento') DEFAULT NULL,
  `fk_id_movimiento` int(11) NOT NULL,
  `fk_id_titulado` int(11) DEFAULT NULL,
  `fk_id_instructor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `factura_movimiento`
--

CREATE TABLE `factura_movimiento` (
  `id_factura` int(11) NOT NULL,
  `fecha_movimiento` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `tipo_movimiento` enum('entrada','salida') NOT NULL,
  `cantidad_peso_movimiento` float NOT NULL,
  `precio_movimiento` float NOT NULL,
  `estado_producto_movimiento` enum('optimo','deficiente') DEFAULT NULL,
  `nota_factura` varchar(300) NOT NULL,
  `fecha_caducidad` date DEFAULT NULL,
  `precio_total_mov` float DEFAULT NULL,
  `fk_id_producto` int(11) NOT NULL,
  `fk_id_usuario` int(11) NOT NULL,
  `fk_id_proveedor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instructores`
--

CREATE TABLE `instructores` (
  `id_instructores` int(11) NOT NULL,
  `documento_instructor` int(10) UNSIGNED NOT NULL,
  `nombre_instructor` varchar(45) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `cantidad_peso_producto` float DEFAULT 0,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `fk_id_up` int(11) NOT NULL,
  `fk_id_tipo_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedores` int(11) NOT NULL,
  `nombre_proveedores` varchar(45) NOT NULL,
  `telefono_proveedores` varchar(45) NOT NULL,
  `direccion_proveedores` varchar(50) NOT NULL,
  `contrato_proveedores` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `inicio_contrato` date NOT NULL,
  `fin_contrato` date NOT NULL,
  `archivo_contrato` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_productos`
--

CREATE TABLE `tipo_productos` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(45) NOT NULL,
  `fk_categoria_pro` int(11) NOT NULL,
  `unidad_peso` enum('kg','lb','gr','lt','ml','oz','unidad(es)') NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `tipo_productos`
--

INSERT INTO `tipo_productos` (`id_tipo`, `nombre_tipo`, `fk_categoria_pro`, `unidad_peso`, `estado`) VALUES
(1, 'Costilla Baby', 1, 'lb', 1),
(2, 'beef Chatas', 1, 'lb', 1),
(3, 'Lomo Pierna', 1, 'lb', 1),
(4, 'Rib o Beef', 1, 'lb', 1),
(5, 'Sobrebarriga', 1, 'lb', 1),
(6, 'T bone Hígado', 1, 'lb', 1),
(7, 'Lengua Sesos', 1, 'lb', 1),
(8, 'Riñones', 1, 'lb', 1),
(9, 'Chuleta Lomo', 1, 'lb', 1),
(10, 'Pierna Pecho', 1, 'lb', 1),
(11, 'Riñones Sesos', 1, 'lb', 1),
(12, 'Hígado', 1, 'lb', 1),
(13, 'Chuleta Lomo', 1, 'lb', 1),
(14, 'Costilla Pierna', 1, 'lb', 1),
(15, 'Tocino', 1, 'lb', 1),
(16, 'Chuleta Entero', 1, 'lb', 1),
(17, 'Paleta Pernil', 1, 'lb', 1),
(18, 'Chorizo Morcilla', 1, 'lb', 1),
(19, 'Mortadela Salami', 1, 'gr', 1),
(20, 'Paté Longaniza', 1, 'gr', 1),
(21, 'Tocineta', 1, 'gr', 1),
(22, 'Salchicha Cocktail', 1, 'gr', 1),
(23, 'Salchicha Ternera', 1, 'gr', 1),
(24, 'Salchicha Vienesa', 1, 'gr', 1),
(25, 'Salchicha', 1, 'gr', 1),
(26, ' Costilla Ahumada', 1, 'lb', 1),
(27, 'Jamón Cocido', 1, 'lb', 1),
(28, 'Jamón Ahumado', 1, 'lb', 1),
(29, 'Bagre', 2, 'kg', 1),
(30, 'Almejas', 2, 'kg', 1),
(31, 'Corvina', 2, 'kg', 1),
(32, 'Chipi-Chipi', 2, 'kg', 1),
(33, 'Lenguado', 2, 'kg', 1),
(34, 'Calamar', 2, 'kg', 1),
(35, 'Pargo Rojo', 2, 'kg', 1),
(36, 'Langosta', 2, 'kg', 1),
(37, 'Entero', 2, 'kg', 1),
(38, 'Langostinos', 2, 'kg', 1),
(39, 'Pargo Rojo Filete', 2, 'kg', 1),
(40, 'Camarones', 2, 'kg', 1),
(41, 'Trucha fresca', 2, 'kg', 1),
(42, 'Ostiones', 2, 'kg', 1),
(43, 'Trucha ahumada', 2, 'kg', 1),
(44, 'Mejillones', 2, 'kg', 1),
(45, 'Róbalo', 2, 'kg', 1),
(46, 'Cangrejos', 2, 'kg', 1),
(47, 'Codorniz', 3, 'lb', 1),
(48, 'Pato', 3, 'lb', 1),
(49, 'Pavo', 3, 'lb', 1),
(50, 'Conejo', 3, 'lb', 1),
(51, 'Pollo', 3, 'lb', 1),
(52, 'Gallina', 3, 'lb', 1),
(53, 'Higado de Pollo', 3, 'lb', 1),
(54, 'Calabacín', 5, 'gr', 1),
(55, 'Calabacín', 5, 'lb', 1),
(56, 'Lechuga blanca Mazorca con armero', 5, 'lb', 1),
(57, 'Aguacate', 5, 'lb', 1),
(58, 'melón ', 5, 'lb', 1),
(59, 'Banano', 5, 'lb', 1),
(60, 'Mora de castilla', 5, 'lb', 1),
(61, 'Calabaza', 5, 'lb', 1),
(62, 'Ciruela importada', 5, 'lb', 1),
(63, 'Naranja valencia', 5, 'lb', 1),
(64, 'Cebolla Cabezona blanca', 5, 'lb', 1),
(65, 'Papa criolla', 5, 'lb', 1),
(66, 'Carambolo', 5, 'lb', 1),
(67, 'Papaya Melona', 5, 'lb', 1),
(68, 'Cebolla larga', 5, 'lb', 1),
(69, 'Papa pastusa', 5, 'lb', 1),
(70, 'Papayuela', 5, 'lb', 1),
(71, 'Cebolla puerro', 5, 'lb', 1),
(72, 'Papa sabanera', 5, 'lb', 1),
(73, 'Durazno', 5, 'lb', 1),
(74, 'Patilla Pera importada', 5, 'lb', 1),
(75, 'Cebollín', 5, 'lb', 1),
(76, 'Pepino cohombro', 5, 'lb', 1),
(77, 'Feijoa', 5, 'lb', 1),
(78, 'Piña Cayena', 5, 'lb', 1),
(79, 'Cilantro', 5, 'lb', 1),
(80, 'Perejil crespo', 5, 'lb', 1),
(81, 'Fresa extra', 5, 'lb', 1),
(82, 'Granadilla', 5, 'lb', 1),
(83, 'Pitaya', 5, 'lb', 1),
(84, 'Colicero', 5, 'lb', 1),
(85, 'Pimentón', 5, 'lb', 1),
(86, 'Tomate de árbol', 5, 'lb', 1),
(87, 'Coliflor', 5, 'lb', 1),
(88, 'Plátano maduro', 5, 'lb', 1),
(89, 'Kiwi', 5, 'lb', 1),
(90, 'Espinacas', 5, 'lb', 1),
(91, 'Plátano verde', 5, 'lb', 1),
(92, 'Limón Tahiti', 5, 'lb', 1),
(93, 'Mandarina', 5, 'lb', 1),
(94, 'Uchuvas', 5, 'lb', 1),
(95, 'Uva champaña blanca', 5, 'lb', 1),
(96, 'Frijol Verde', 5, 'lb', 1),
(97, 'Rábano blanco', 5, 'lb', 1),
(98, 'Uva champaña roja', 5, 'lb', 1),
(99, 'Guascas', 5, 'lb', 1),
(100, 'Rábano rojo', 5, 'lb', 1),
(101, 'Mango azúcar', 5, 'lb', 1),
(102, 'Haba Verde', 5, 'lb', 1),
(103, 'Remolacha', 5, 'lb', 1),
(104, 'Manzana roja', 5, 'lb', 1),
(105, 'Habichuela', 5, 'lb', 1),
(106, 'Repollo blanco', 5, 'lb', 1),
(107, 'Manzana verde', 5, 'lb', 1),
(108, 'Hierbas aromáticas', 5, 'lb', 1),
(109, 'Repollo morado', 5, 'lb', 1),
(110, 'Laurel', 5, 'lb', 1),
(111, 'Tomate chonto', 5, 'lb', 1),
(112, 'Lechuga Batavia', 5, 'lb', 1),
(113, 'Tomate milano', 5, 'lb', 1),
(114, 'Lechuga morada', 5, 'lb', 1),
(115, 'Tomillo', 5, 'lb', 1),
(116, 'Zanahoria', 5, 'lb', 1),
(117, 'Leche', 4, 'lt', 1),
(118, 'Crema de Leche (No empacada)', 4, 'ml', 1),
(119, 'Queso Campesino (No industrial)', 4, 'lb', 1),
(120, 'Requesón Cuajada', 4, 'lb', 1),
(121, 'Helados', 4, 'unidad(es)', 1),
(122, 'Natas', 4, 'gr', 1),
(123, 'Cuajada', 4, 'lb', 1),
(124, 'Pan Francés', 4, 'unidad(es)', 1),
(125, 'Pan Bloque', 4, 'unidad(es)', 1),
(126, 'Bizcochos', 4, 'unidad(es)', 1),
(127, 'Tortas', 4, 'unidad(es)', 1),
(128, 'Pan Tajado', 4, 'unidad(es)', 1),
(129, 'Huevo (Codorniz)', 4, 'unidad(es)', 1),
(130, 'Frescos A', 4, 'unidad(es)', 1),
(131, 'Frescos B', 4, 'unidad(es)', 1),
(132, 'Queso Camembert', 6, 'unidad(es)', 1),
(133, 'Queso Roquefort', 6, 'unidad(es)', 1),
(134, 'Queso Gladis', 6, 'unidad(es)', 1),
(135, 'Queso Campesino', 6, 'unidad(es)', 1),
(136, 'Queso Gruyere', 6, 'unidad(es)', 1),
(137, 'Margarina', 6, 'unidad(es)', 1),
(138, 'Yogurt', 6, 'unidad(es)', 1),
(139, 'Queso Holandés', 6, 'unidad(es)', 1),
(140, 'Crema de Leche', 6, 'unidad(es)', 1),
(141, 'Queso Parmesano', 6, 'unidad(es)', 1),
(142, 'Mantequilla', 6, 'unidad(es)', 1),
(143, 'Queso Americano', 6, 'unidad(es)', 1),
(144, 'Casillero del Diablo Tinto', 10, 'unidad(es)', 1),
(145, 'Chardonay', 10, 'unidad(es)', 1),
(146, 'Grajales Blanco', 10, 'unidad(es)', 1),
(147, 'Grajales Tinto', 10, 'unidad(es)', 1),
(148, 'Grajales Moscatel', 10, 'unidad(es)', 1),
(149, 'Undurraga Blanco', 10, 'unidad(es)', 1),
(150, 'Undurruaga Tinto', 10, 'unidad(es)', 1),
(151, 'Absolut', 9, 'unidad(es)', 1),
(152, 'Aguardientes', 9, 'unidad(es)', 1),
(153, 'Amaretto', 9, 'unidad(es)', 1),
(154, 'Aperitivos', 9, 'unidad(es)', 1),
(155, 'Bacardí', 9, 'unidad(es)', 1),
(156, 'Bailey', 9, 'unidad(es)', 1),
(157, 'Black and White', 9, 'unidad(es)', 1),
(158, 'Buchanan s', 9, 'unidad(es)', 1),
(159, 'Campari', 9, 'unidad(es)', 1),
(160, 'Cointreau', 9, 'unidad(es)', 1),
(161, 'Ron', 9, 'unidad(es)', 1),
(162, 'Cremas', 9, 'unidad(es)', 1),
(163, 'Agua botella', 11, 'unidad(es)', 1),
(164, 'Coca-cola', 11, 'unidad(es)', 1),
(165, 'Postobon', 11, 'unidad(es)', 1),
(166, 'Jugo Hit', 11, 'unidad(es)', 1),
(167, 'Aceite', 7, 'unidad(es)', 1),
(168, 'Polvo para Hornear', 7, 'unidad(es)', 1),
(169, 'Arveja', 7, 'unidad(es)', 1),
(170, 'Champiñones', 7, 'unidad(es)', 1),
(171, 'Gelatina', 7, 'unidad(es)', 1),
(172, 'Pastas', 7, 'unidad(es)', 1),
(173, 'Maicena', 7, 'unidad(es)', 1),
(174, 'Pasta de Tomate', 7, 'unidad(es)', 1),
(175, 'Mayonesa', 7, 'unidad(es)', 1),
(176, 'Sal Refinada', 7, 'unidad(es)', 1),
(177, 'Mostaza', 7, 'unidad(es)', 1),
(178, 'Salsa China', 7, 'unidad(es)', 1),
(179, 'Arroz', 8, 'lb', 1),
(180, 'Azúcar', 8, 'kg', 1),
(181, 'Arveja Seca', 8, 'unidad(es)', 1),
(182, 'Fríjol Blanco', 8, 'lb', 1),
(183, 'Fríjol Rojo', 8, 'lb', 1),
(184, 'Garbanzo', 8, 'lb', 1),
(185, 'Lenteja', 8, 'lb', 1),
(186, 'Harina de Maíz', 8, 'lb', 1),
(187, 'Harina de Trigo', 8, 'lb', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `titulados`
--

CREATE TABLE `titulados` (
  `id_titulado` int(11) NOT NULL,
  `nombre_titulado` varchar(45) NOT NULL,
  `id_ficha` varchar(45) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `documento_usuario` bigint(50) NOT NULL,
  `email_usuario` varchar(45) NOT NULL,
  `nombre_usuario` varchar(45) NOT NULL,
  `contrasena_usuario` varchar(45) NOT NULL,
  `tipo_usuario` enum('administrador','coadministrador') NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `stock_minimo` int(11) DEFAULT 10
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id_usuario`, `documento_usuario`, `email_usuario`, `nombre_usuario`, `contrasena_usuario`, `tipo_usuario`, `estado`, `stock_minimo`) VALUES
(1, 1234567890, 'admin@admin.com', 'Admin', 'U2FsdGVkX19bEFpwZOZoL0IRtUmN/D5kjY4MQh8onY4=', 'administrador', 1, 10),
(2, 1084259187, 'andersons_munoz@soy.sena.edu.co', 'Anderson Munoz', 'U2FsdGVkX1+rrJzjBliuDua2/1C210jhG/+tIdps4K4=', 'coadministrador', 1, 10);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bodega`
--
ALTER TABLE `bodega`
  ADD PRIMARY KEY (`id_up`);

--
-- Indices de la tabla `categorias_producto`
--
ALTER TABLE `categorias_producto`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `detalles`
--
ALTER TABLE `detalles`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `fk_id_movimiento_idx` (`fk_id_movimiento`),
  ADD KEY `fk_id_instructor_idx` (`fk_id_titulado`),
  ADD KEY `fk_id_instructor_idx1` (`fk_id_instructor`);

--
-- Indices de la tabla `factura_movimiento`
--
ALTER TABLE `factura_movimiento`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `tener5` (`fk_id_producto`),
  ADD KEY `tener6` (`fk_id_usuario`),
  ADD KEY `tener99` (`fk_id_proveedor`);

--
-- Indices de la tabla `instructores`
--
ALTER TABLE `instructores`
  ADD PRIMARY KEY (`id_instructores`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `tener2` (`fk_id_up`),
  ADD KEY `tener4` (`fk_id_tipo_producto`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedores`);

--
-- Indices de la tabla `tipo_productos`
--
ALTER TABLE `tipo_productos`
  ADD PRIMARY KEY (`id_tipo`),
  ADD KEY `nada` (`fk_categoria_pro`);

--
-- Indices de la tabla `titulados`
--
ALTER TABLE `titulados`
  ADD PRIMARY KEY (`id_titulado`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bodega`
--
ALTER TABLE `bodega`
  MODIFY `id_up` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias_producto`
--
ALTER TABLE `categorias_producto`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `detalles`
--
ALTER TABLE `detalles`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `factura_movimiento`
--
ALTER TABLE `factura_movimiento`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `instructores`
--
ALTER TABLE `instructores`
  MODIFY `id_instructores` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedores` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `tipo_productos`
--
ALTER TABLE `tipo_productos`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=188;

--
-- AUTO_INCREMENT de la tabla `titulados`
--
ALTER TABLE `titulados`
  MODIFY `id_titulado` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `detalles`
--
ALTER TABLE `detalles`
  ADD CONSTRAINT `detalles_ibfk_1` FOREIGN KEY (`fk_id_titulado`) REFERENCES `titulados` (`id_titulado`),
  ADD CONSTRAINT `fk_id_instructor` FOREIGN KEY (`fk_id_instructor`) REFERENCES `instructores` (`id_instructores`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_id_movimiento` FOREIGN KEY (`fk_id_movimiento`) REFERENCES `factura_movimiento` (`id_factura`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `factura_movimiento`
--
ALTER TABLE `factura_movimiento`
  ADD CONSTRAINT `factura_movimiento_ibfk_1` FOREIGN KEY (`fk_id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `factura_movimiento_ibfk_2` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `factura_movimiento_ibfk_3` FOREIGN KEY (`fk_id_proveedor`) REFERENCES `proveedores` (`id_proveedores`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`fk_id_up`) REFERENCES `bodega` (`id_up`),
  ADD CONSTRAINT `tener4` FOREIGN KEY (`fk_id_tipo_producto`) REFERENCES `tipo_productos` (`id_tipo`);

--
-- Filtros para la tabla `tipo_productos`
--
ALTER TABLE `tipo_productos`
  ADD CONSTRAINT `nada` FOREIGN KEY (`fk_categoria_pro`) REFERENCES `categorias_producto` (`id_categoria`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
