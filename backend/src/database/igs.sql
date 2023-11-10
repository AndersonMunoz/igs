-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-10-2023 a las 15:07:49
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 20-10-2023 a las 17:50:40
-- Versión del servidor: 10.4.27-MariaDB
-- Versión de PHP: 8.1.12

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
-- Estructura de tabla para la tabla `categorias_producto`
--

CREATE TABLE `categorias_producto` (
  `id_categoria` int(11) NOT NULL,
  `nombre_categoria` varchar(45) DEFAULT NULL
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
  `unidad_peso_movimiento` enum('kg','lb','gr','lt','ml') NOT NULL,
  `precio_movimiento` float NOT NULL,
  `estado_producto_movimiento` enum('bueno','regular','malo') NOT NULL,
  `nota_factura` varchar(300) NOT NULL,
  `fecha_caducidad_producto` date NOT NULL,
  `fk_id_producto` int(11) NOT NULL,
  `fk_id_usuario` int(11) NOT NULL,
  `fk_id_proveedor` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `fecha_caducidad_producto` date NOT NULL,
  `cantidad_peso_producto` float NOT NULL,
  `unidad_peso_producto` enum('kg','lb','gr','lt','ml') NOT NULL,
  `descripcion_producto` varchar(200) NOT NULL,
  `precio_producto` float NOT NULL,
  `fk_id_categoria` int(11) NOT NULL,
  `fk_id_up` int(11) NOT NULL,
  `fk_id_tipo_producto` int(11) NOT NULL,
  `estado` tinyint(4) NOT NULL DEFAULT 1
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
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_productos`
--

CREATE TABLE `tipo_productos` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_productiva`
--

CREATE TABLE `unidad_productiva` (
  `id_up` int(11) NOT NULL,
  `nombre_up` varchar(45) NOT NULL
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
  `estado` tinyint(4) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `categorias_producto`
--
ALTER TABLE `categorias_producto`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `factura_movimiento`
--
ALTER TABLE `factura_movimiento`
  ADD PRIMARY KEY (`id_factura`),
  ADD KEY `tener5` (`fk_id_producto`),
  ADD KEY `tener6` (`fk_id_usuario`),
  ADD KEY `tener99` (`fk_id_proveedor`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `tener2` (`fk_id_up`),
  ADD KEY `tener3` (`fk_id_categoria`),
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
  ADD PRIMARY KEY (`id_tipo`);

--
-- Indices de la tabla `unidad_productiva`
--
ALTER TABLE `unidad_productiva`
  ADD PRIMARY KEY (`id_up`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id_usuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `categorias_producto`
--
ALTER TABLE `categorias_producto`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `factura_movimiento`
--
ALTER TABLE `factura_movimiento`
  MODIFY `id_factura` int(11) NOT NULL AUTO_INCREMENT;

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
-- AUTO_INCREMENT de la tabla `unidad_productiva`
--
ALTER TABLE `unidad_productiva`
  MODIFY `id_up` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `factura_movimiento`
--
ALTER TABLE `factura_movimiento`
  ADD CONSTRAINT `factura_movimiento_ibfk_1` FOREIGN KEY (`fk_id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `factura_movimiento_ibfk_2` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuarios` (`id_usuario`),
  ADD CONSTRAINT `tener99` FOREIGN KEY (`fk_id_proveedor`) REFERENCES `proveedores` (`id_proveedores`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`fk_id_up`) REFERENCES `unidad_productiva` (`id_up`),
  ADD CONSTRAINT `tener3` FOREIGN KEY (`fk_id_categoria`) REFERENCES `categorias_producto` (`id_categoria`),
  ADD CONSTRAINT `tener4` FOREIGN KEY (`fk_id_tipo_producto`) REFERENCES `tipo_productos` (`id_tipo`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
