-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-03-2024 a las 13:33:49
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `bodega`
--

INSERT INTO `bodega` (`id_up`, `nombre_up`, `estado`) VALUES
(1, 'Economato', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_producto`
--

CREATE TABLE `categorias_producto` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(45) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias_producto`
--

INSERT INTO `categorias_producto` (`id_categoria`, `nombre_categoria`, `estado`) VALUES
(1, 'Licores', 1),
(2, 'Vegetales', 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `detalles`
--

INSERT INTO `detalles` (`id_detalle`, `destino_movimiento`, `fk_id_movimiento`, `fk_id_titulado`, `fk_id_instructor`) VALUES
(1, NULL, 1, NULL, NULL),
(3, 'evento', 3, 1, 1),
(4, NULL, 4, NULL, NULL),
(5, NULL, 5, NULL, NULL),
(6, NULL, 6, NULL, NULL),
(7, NULL, 7, NULL, NULL);

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
  `num_lote` int(11) NOT NULL,
  `fk_id_producto` int(11) NOT NULL,
  `fk_id_usuario` int(11) NOT NULL,
  `fk_id_proveedor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `factura_movimiento`
--

INSERT INTO `factura_movimiento` (`id_factura`, `fecha_movimiento`, `tipo_movimiento`, `cantidad_peso_movimiento`, `precio_movimiento`, `estado_producto_movimiento`, `nota_factura`, `fecha_caducidad`, `precio_total_mov`, `num_lote`, `fk_id_producto`, `fk_id_usuario`, `fk_id_proveedor`) VALUES
(1, '2024-03-19 12:20:04', 'entrada', 5, 100, 'optimo', 'Yogurt alpinasssss', '2023-11-17', 500, 1, 1, 1, 1),
(2, '2024-03-19 12:21:17', 'salida', 2, 0, NULL, 'Prueba insomnia salida', NULL, NULL, 1, 1, 1, NULL),
(3, '2024-03-19 12:22:26', 'salida', 2, 0, NULL, 'Prueba insomnia salida', NULL, NULL, 1, 1, 1, NULL),
(4, '2024-03-20 12:11:26', 'entrada', 2, 1000, 'optimo', 'sdfsdfsdfsdfsdf', '2024-03-07', 2000, 2, 2, 1, 1),
(5, '2024-03-20 12:22:43', 'entrada', 1, 1000, 'optimo', 'sdfsdfsdfsdfsdf', '2024-05-10', 1000, 3, 3, 1, 1),
(6, '2024-03-20 12:20:39', 'entrada', 4, 500, 'optimo', 'sdfsdfsdfsdfsdf', '1899-11-30', 2000, 14, 4, 1, 1),
(7, '2024-03-20 12:31:32', 'entrada', 5, 400, 'optimo', 'sdfsdfsdfsdfsdf', '2024-03-24', 2000, 4, 5, 1, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `instructores`
--

CREATE TABLE `instructores` (
  `id_instructores` int(11) NOT NULL,
  `documento_instructor` int(10) UNSIGNED NOT NULL,
  `nombre_instructor` varchar(45) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `instructores`
--

INSERT INTO `instructores` (`id_instructores`, `documento_instructor`, `nombre_instructor`, `estado`) VALUES
(1, 1045789523, 'Wilson', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `cantidad_peso_producto` float DEFAULT 0,
  `descripcion_producto` varchar(200) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1,
  `num_lote` int(11) NOT NULL,
  `fk_id_up` int(11) NOT NULL,
  `fk_id_tipo_producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id_producto`, `cantidad_peso_producto`, `descripcion_producto`, `estado`, `num_lote`, `fk_id_up`, `fk_id_tipo_producto`) VALUES
(1, 1, 'Yogurt alpinasssss', 1, 1, 1, 1),
(2, 2, 'sdfsdfsdfsdfsdf', 1, 2, 1, 2),
(3, 1, 'sdfsdfsdfsdfsdf', 1, 3, 1, 2),
(4, 4, 'sdfsdfsdfsdfsdf', 1, 14, 1, 2),
(5, 5, 'sdfsdfsdfsdfsdf', 1, 4, 1, 2);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id_proveedores`, `nombre_proveedores`, `telefono_proveedores`, `direccion_proveedores`, `contrato_proveedores`, `estado`, `inicio_contrato`, `fin_contrato`, `archivo_contrato`) VALUES
(1, 'Colombina', '6014567891', 'Pitalito', 1, 1, '2024-06-25', '2024-09-26', '');

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `tipo_productos`
--

INSERT INTO `tipo_productos` (`id_tipo`, `nombre_tipo`, `fk_categoria_pro`, `unidad_peso`, `estado`) VALUES
(1, 'Whiskey', 1, 'unidad(es)', 1),
(2, 'Tomate', 2, 'lb', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `titulados`
--

CREATE TABLE `titulados` (
  `id_titulado` int(11) NOT NULL,
  `nombre_titulado` varchar(45) NOT NULL,
  `id_ficha` varchar(45) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `titulados`
--

INSERT INTO `titulados` (`id_titulado`, `nombre_titulado`, `id_ficha`, `estado`) VALUES
(1, 'ADSO', '2556456', 1);

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `id_up` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `categorias_producto`
--
ALTER TABLE `categorias_producto`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `detalles`
--
ALTER TABLE `detalles`
  MODIFY `id_detalle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `factura_movimiento`
--
ALTER TABLE `factura_movimiento`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `instructores`
--
ALTER TABLE `instructores`
  MODIFY `id_instructores` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id_proveedores` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `tipo_productos`
--
ALTER TABLE `tipo_productos`
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `titulados`
--
ALTER TABLE `titulados`
  MODIFY `id_titulado` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

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
