-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: propfirm
-- ------------------------------------------------------
-- Server version	26.7.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '83e1a27f-8ab3-11f1-930f-c03532150b2c:1-27';

--
-- Table structure for table `bankaccounts`
--

DROP TABLE IF EXISTS `bankaccounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bankaccounts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `Cnic` varchar(45) NOT NULL,
  `Iban` varchar(45) NOT NULL,
  `Bankname` varchar(45) NOT NULL,
  `Address` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `Cnic_UNIQUE` (`Cnic`),
  UNIQUE KEY `IBAN_UNIQUE` (`Iban`),
  CONSTRAINT `chek_cnic_format` CHECK (regexp_like(`Cnic`,_utf8mb4'^[0-9]{5}-[0-9]{7}-[0-9]{1}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bankaccounts`
--

LOCK TABLES `bankaccounts` WRITE;
/*!40000 ALTER TABLE `bankaccounts` DISABLE KEYS */;
/*!40000 ALTER TABLE `bankaccounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customers` (
  `Customerid` int NOT NULL AUTO_INCREMENT,
  `Fname` varchar(45) NOT NULL,
  `Lname` varchar(45) DEFAULT NULL,
  `Cnic` varchar(45) NOT NULL,
  `Phonenumber` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  PRIMARY KEY (`Customerid`),
  UNIQUE KEY `Customerid_UNIQUE` (`Customerid`),
  UNIQUE KEY `Cnic_UNIQUE` (`Cnic`),
  UNIQUE KEY `Phonenumber_UNIQUE` (`Phonenumber`),
  CONSTRAINT `chk_cnic_rules` CHECK (regexp_like(`Cnic`,_utf8mb4'^[0-9]{5}-[0-9]{7}-[0-9]{1}$')),
  CONSTRAINT `chk_phone_rules` CHECK (((char_length(`Phonenumber`) = 11) and regexp_like(`Phonenumber`,_utf8mb4'^[0-9]+$')))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'Faran','Mukhtar','43301-7654434-9','03334567890','faran@gmail.com','123'),(2,'Chris','Asif','43301-7654453-9','03334565432','chris@gmail.com','123'),(3,'Ahmed','AKbar','46607-9876654-7','03334567811','Ahmed@gmail.com','123');
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stocks`
--

DROP TABLE IF EXISTS `stocks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stocks` (
  `Stockid` int NOT NULL AUTO_INCREMENT,
  `Traderid` int NOT NULL,
  `Companyname` varchar(45) NOT NULL,
  `Symbol` varchar(10) NOT NULL,
  `Quantity` int NOT NULL,
  `BuyingPrice` decimal(12,2) NOT NULL,
  PRIMARY KEY (`Stockid`),
  KEY `fk_stocks_traders` (`Traderid`),
  CONSTRAINT `fk_stocks_traders` FOREIGN KEY (`Traderid`) REFERENCES `traders` (`Traderid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stocks`
--

LOCK TABLES `stocks` WRITE;
/*!40000 ALTER TABLE `stocks` DISABLE KEYS */;
INSERT INTO `stocks` VALUES (1,1,'SYSTEMS','SYS',100,200.00),(2,1,'Muslim Comertial bank','MCB',100,200.00),(3,1,'Pakistan State Oil','PSO',100,200.00);
/*!40000 ALTER TABLE `stocks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `traders`
--

DROP TABLE IF EXISTS `traders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `traders` (
  `Traderid` int NOT NULL AUTO_INCREMENT,
  `Fname` varchar(45) NOT NULL,
  `Lname` varchar(45) NOT NULL,
  `Phonenumber` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `Cnic` varchar(45) NOT NULL,
  `Password` varchar(45) NOT NULL,
  `Max-Limit` double DEFAULT '0',
  `Invested` double DEFAULT '0',
  PRIMARY KEY (`Traderid`),
  UNIQUE KEY `Traderid_UNIQUE` (`Traderid`),
  UNIQUE KEY `Phonenumber_UNIQUE` (`Phonenumber`),
  UNIQUE KEY `Cnic_UNIQUE` (`Cnic`),
  CONSTRAINT `chk_cnic_format` CHECK (regexp_like(`Cnic`,_utf8mb4'^[0-9]{5}-[0-9]{7}-[0-9]{1}$'))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `traders`
--

LOCK TABLES `traders` WRITE;
/*!40000 ALTER TABLE `traders` DISABLE KEYS */;
INSERT INTO `traders` VALUES (1,'Faran','Mukhtar','03332345678','faran@gmail.com','42201-8765543-7','abc123',100000,0);
/*!40000 ALTER TABLE `traders` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-08-05  0:36:24
