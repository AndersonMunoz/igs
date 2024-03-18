-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 18-03-2024 a las 03:24:03
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.1.17

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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias_producto`
--

CREATE TABLE `categorias_producto` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(45) DEFAULT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  `estado_producto_movimiento` enum('optimo','deficiente') NOT NULL,
  `nota_factura` varchar(300) NOT NULL,
  `fecha_caducidad` date DEFAULT NULL,
  `precio_total_mov` float DEFAULT NULL,
  `num_lote` int(11) NOT NULL,
  `fk_id_producto` int(11) NOT NULL,
  `fk_id_usuario` int(11) NOT NULL,
  `fk_id_proveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
  MODIFY `id_up` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categorias_producto`
--
ALTER TABLE `categorias_producto`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT;

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
  MODIFY `id_tipo` int(11) NOT NULL AUTO_INCREMENT;

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
