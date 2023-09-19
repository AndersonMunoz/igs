-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 19-09-2023 a las 23:43:29
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
  `id_tiene` int(11) NOT NULL,
  `fecha_movimiento` date DEFAULT NULL,
  `tipo_movimiento` enum('Entrada','Salida') DEFAULT NULL,
  `cantidad_movimiento` float DEFAULT NULL,
  `fk_id_producto` int(11) DEFAULT NULL,
  `fk_numero_registro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientos`
--

CREATE TABLE `movimientos` (
  `numero_registro` int(11) NOT NULL,
  `fk_id_usuario` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id_producto` int(11) NOT NULL,
  `nuLote_producto` varchar(45) DEFAULT NULL,
  `fecha_caducidad_producto` date DEFAULT NULL,
  `stock_producto` int(11) DEFAULT NULL,
  `unidad_peso_producto` enum('KG','LB','GR') DEFAULT NULL,
  `cantidad_peso_producto` float DEFAULT NULL,
  `descripcion_producto` varchar(200) DEFAULT NULL,
  `estado_producto` enum('Bueno','Regular','Malo') DEFAULT NULL,
  `precio_producto` float DEFAULT NULL,
  `fk_id_categoria` int(11) DEFAULT NULL,
  `fk_id_bodega` int(11) DEFAULT NULL,
  `fk_id_tipo_producto` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id_proveedores` int(11) NOT NULL,
  `nombre_proveedores` varchar(45) DEFAULT NULL,
  `telefono_proveedores` varchar(45) DEFAULT NULL,
  `direccion_proveedores` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `suministros`
--

CREATE TABLE `suministros` (
  `id_suministros` int(11) NOT NULL,
  `fk_id_producto` int(11) DEFAULT NULL,
  `fk_id_proveedor` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tipo_productos`
--

CREATE TABLE `tipo_productos` (
  `id_tipo` int(11) NOT NULL,
  `nombre_tipo` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidad_productiva`
--

CREATE TABLE `unidad_productiva` (
  `id_up` int(11) NOT NULL,
  `nombre_up` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id_usuario` int(11) NOT NULL,
  `email_usuario` varchar(45) DEFAULT NULL,
  `nombre_usuario` varchar(45) DEFAULT NULL,
  `contrasena_usuario` varchar(45) DEFAULT NULL,
  `tipo_usuario` enum('Administrador','CoAdministrador') DEFAULT NULL
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
  ADD PRIMARY KEY (`id_tiene`),
  ADD KEY `tener5` (`fk_id_producto`),
  ADD KEY `tener6` (`fk_numero_registro`);

--
-- Indices de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`numero_registro`),
  ADD KEY `tener1` (`fk_id_usuario`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id_producto`),
  ADD KEY `tener2` (`fk_id_bodega`),
  ADD KEY `tener3` (`fk_id_categoria`),
  ADD KEY `tener4` (`fk_id_tipo_producto`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id_proveedores`);

--
-- Indices de la tabla `suministros`
--
ALTER TABLE `suministros`
  ADD PRIMARY KEY (`id_suministros`),
  ADD KEY `tener7` (`fk_id_producto`),
  ADD KEY `tener8` (`fk_id_proveedor`);

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
  MODIFY `id_tiene` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `numero_registro` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `suministros`
--
ALTER TABLE `suministros`
  MODIFY `id_suministros` int(11) NOT NULL AUTO_INCREMENT;

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
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `factura_movimiento`
--
ALTER TABLE `factura_movimiento`
  ADD CONSTRAINT `tener5` FOREIGN KEY (`fk_id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `tener6` FOREIGN KEY (`fk_numero_registro`) REFERENCES `movimientos` (`numero_registro`);

--
-- Filtros para la tabla `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `tener1` FOREIGN KEY (`fk_id_usuario`) REFERENCES `usuarios` (`id_usuario`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `tener2` FOREIGN KEY (`fk_id_bodega`) REFERENCES `unidad_productiva` (`id_up`),
  ADD CONSTRAINT `tener3` FOREIGN KEY (`fk_id_categoria`) REFERENCES `categorias_producto` (`id_categoria`),
  ADD CONSTRAINT `tener4` FOREIGN KEY (`fk_id_tipo_producto`) REFERENCES `tipo_productos` (`id_tipo`);

--
-- Filtros para la tabla `suministros`
--
ALTER TABLE `suministros`
  ADD CONSTRAINT `tener7` FOREIGN KEY (`fk_id_producto`) REFERENCES `productos` (`id_producto`),
  ADD CONSTRAINT `tener8` FOREIGN KEY (`fk_id_proveedor`) REFERENCES `proveedores` (`id_proveedores`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
