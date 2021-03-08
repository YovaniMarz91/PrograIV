-- --------------------------------------------------------
-- Host:                         localhost
-- Versión del servidor:         5.7.24 - MySQL Community Server (GPL)
-- SO del servidor:              Win64
-- HeidiSQL Versión:             10.2.0.5599
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para db_sistema_agua_potable
CREATE DATABASE IF NOT EXISTS `db_sistema_agua_potable` /*!40100 DEFAULT CHARACTER SET utf8 COLLATE utf8_spanish_ci */;
USE `db_sistema_agua_potable`;

-- Volcando estructura para tabla db_sistema_agua_potable.clientes
CREATE TABLE IF NOT EXISTS `clientes` (
  `idCliente` int(11) NOT NULL AUTO_INCREMENT,
  `codigo` varchar(3) COLLATE utf8_spanish_ci NOT NULL DEFAULT '0',
  `nombre` varchar(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '0',
  `direccion` varchar(100) COLLATE utf8_spanish_ci NOT NULL DEFAULT '0',
  `zona` varchar(50) COLLATE utf8_spanish_ci NOT NULL DEFAULT '0',
  KEY `Índice 1` (`idCliente`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Volcando datos para la tabla db_sistema_agua_potable.clientes: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `clientes` DISABLE KEYS */;
INSERT INTO `clientes` (`idCliente`, `codigo`, `nombre`, `direccion`, `zona`) VALUES
	(4, '01', 'Yovani Chinchilla', 'Santa Elena', 'Usulutan'),
	(5, '03', 'Ulises Chinchilla', 'Santa Elena', 'Usulutan'),
	(8, '04', 'Angel Bran', 'Santa Elena', 'Usulutan');
/*!40000 ALTER TABLE `clientes` ENABLE KEYS */;

-- Volcando estructura para tabla db_sistema_agua_potable.lecturas
CREATE TABLE IF NOT EXISTS `lecturas` (
  `idLectura` int(11) NOT NULL AUTO_INCREMENT,
  `idCliente` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `lanterior` float NOT NULL DEFAULT '0',
  `lactual` float NOT NULL DEFAULT '0',
  `pago` float NOT NULL DEFAULT '0',
  KEY `Índice 1` (`idLectura`),
  KEY `FK__clientes` (`idCliente`),
  CONSTRAINT `FK__clientes` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`idCliente`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Volcando datos para la tabla db_sistema_agua_potable.lecturas: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `lecturas` DISABLE KEYS */;
/*!40000 ALTER TABLE `lecturas` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
