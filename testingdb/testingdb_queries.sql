-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: b21kurar
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.20.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `ANNOUNCEMENTLOG`
--

DROP TABLE IF EXISTS `ANNOUNCEMENTLOG`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `ANNOUNCEMENTLOG` (
  `ID` int unsigned NOT NULL AUTO_INCREMENT,
  `ANNOUNCEMENTID` int unsigned NOT NULL,
  `UID` int unsigned NOT NULL,
  `CID` int unsigned NOT NULL,
  `VERSID` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `TITLE` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `MESSAGE` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `ANNOUNCETIME` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `LOGACTION` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ANNOUNCEMENTLOG`
--

LOCK TABLES `ANNOUNCEMENTLOG` WRITE;
/*!40000 ALTER TABLE `ANNOUNCEMENTLOG` DISABLE KEYS */;
/*!40000 ALTER TABLE `ANNOUNCEMENTLOG` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcement`
--

DROP TABLE IF EXISTS `announcement`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement` (
  `announcementid` int unsigned NOT NULL AUTO_INCREMENT,
  `secondannouncementid` int unsigned NOT NULL,
  `uid` int unsigned NOT NULL,
  `recipient` int unsigned NOT NULL,
  `cid` int unsigned NOT NULL,
  `versid` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` tinytext COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `announceTime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `read_status` tinyint(1) NOT NULL DEFAULT '1',
  `edited` varchar(3) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'NO',
  PRIMARY KEY (`announcementid`,`secondannouncementid`,`uid`,`cid`,`versid`),
  KEY `uid` (`uid`),
  KEY `recipient` (`recipient`),
  KEY `cid` (`cid`),
  CONSTRAINT `announcement_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `announcement_ibfk_2` FOREIGN KEY (`recipient`) REFERENCES `user` (`uid`),
  CONSTRAINT `announcement_ibfk_3` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement`
--

LOCK TABLES `announcement` WRITE;
/*!40000 ALTER TABLE `announcement` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `box`
--

DROP TABLE IF EXISTS `box`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `box` (
  `boxid` int unsigned NOT NULL,
  `exampleid` mediumint unsigned NOT NULL,
  `boxtitle` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `boxcontent` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `settings` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `wordlistid` mediumint unsigned DEFAULT NULL,
  `segment` text COLLATE utf8mb4_unicode_ci,
  `fontsize` int NOT NULL DEFAULT '9',
  PRIMARY KEY (`boxid`,`exampleid`),
  KEY `exampleid` (`exampleid`),
  CONSTRAINT `box_ibfk_1` FOREIGN KEY (`exampleid`) REFERENCES `codeexample` (`exampleid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `box`
--

LOCK TABLES `box` WRITE;
/*!40000 ALTER TABLE `box` DISABLE KEYS */;
INSERT INTO `box` VALUES (1,1,'Description','Document','PHP_Ex1.txt','[viktig=1]',4,NULL,9),(1,2,'Description','Document','PHP_Ex2.txt','[viktig=1]',4,NULL,9),(1,3,'Description','Document','PHP_Ex3.txt','[viktig=1]',4,NULL,9),(1,4,'Description','Document','JavaScript_Ex1.txt','[viktig=1]',4,NULL,9),(1,5,'JavaScript_Ex2.html','Code','JavaScript_Ex2.html','[viktig=1]',3,NULL,9),(1,6,'Description','Document','JavaScript_Ex3.txt','[viktig=1]',4,NULL,9),(1,7,'Description','Document','HTML_Ex1.txt','[viktig=1]',4,NULL,9),(1,8,'Description','Document','HTML_Ex2.txt','[viktig=1]',4,NULL,9),(1,9,'Description','Document','HTML_Ex3.txt','[viktig=1]',4,NULL,9),(1,10,'Description','Document','HTML_Ex4.txt','[viktig=1]',4,NULL,9),(1,11,'Description','Document','HTML_Ex5.txt','[viktig=1]',4,NULL,9),(1,12,'Description','Document','HTML_Ex6.txt','[viktig=1]',4,NULL,9),(1,13,'Description','Document','HTML_Ex7.txt','[viktig=1]',4,NULL,9),(1,14,'Description','Document','HTML_Ex8.txt','[viktig=1]',4,NULL,9),(1,15,'Description','Document','Shader_Ex1.txt','[viktig=1]',4,NULL,9),(1,16,'Description','Document','Shader_Ex2.txt','[viktig=1]',4,NULL,9),(1,6000,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6001,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6002,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6003,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6004,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6005,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6006,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6007,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6008,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,6009,'Html-test box 1','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(1,7000,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7001,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7002,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7003,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7004,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7005,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7006,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7007,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7008,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,7009,'JS-TEST box 1','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(1,8000,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8001,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8002,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8003,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8004,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8005,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8006,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8007,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8008,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,8009,'SQL-TEST box 1','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(1,9000,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9001,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9002,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9003,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9004,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9005,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9006,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9007,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9008,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(1,9009,'PHP-TEST box 1','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,1,'PHP_Ex1.php','Code','PHP_Ex1.php','[viktig=1]',2,NULL,9),(2,2,'PHP_Ex2.php','Code','PHP_Ex2.php','[viktig=1]',2,NULL,9),(2,3,'PHP_Ex3.php','Code','PHP_Ex3.php','[viktig=1]',2,NULL,9),(2,4,'JavaScript_Ex1.html','Code','JavaScript_Ex1.html','[viktig=1]',3,NULL,9),(2,5,'JavaScript_Ex2.js','Code','JavaScript_Ex2.js','[viktig=1]',1,NULL,9),(2,6,'JavaScript_Ex3.html','Code','JavaScript_Ex3.html','[viktig=1]',3,NULL,9),(2,7,'HTML_Ex1.html','Code','HTML_Ex1.html','[viktig=1]',3,NULL,9),(2,8,'HTML_Ex2.html','Code','HTML_Ex2.html','[viktig=1]',3,NULL,9),(2,9,'HTML_Ex3.html','Code','HTML_Ex3.html','[viktig=1]',3,NULL,9),(2,10,'HTML_Ex4.html','Code','HTML_Ex4.html','[viktig=1]',3,NULL,9),(2,11,'HTML_Ex5.html','Code','HTML_Ex5.html','[viktig=1]',3,NULL,9),(2,12,'HTML_Ex6.html','Code','HTML_Ex6.html','[viktig=1]',3,NULL,9),(2,13,'HTML_Ex7.html','Code','HTML_Ex7.html','[viktig=1]',3,NULL,9),(2,14,'HTML_Ex8.html','Code','HTML_Ex8.html','[viktig=1]',3,NULL,9),(2,15,'JavaScript Code','Code','Shader_Ex1.js','[viktig=1]',1,NULL,9),(2,16,'JavaScript Code','Code','Shader_Ex2.js','[viktig=1]',1,NULL,9),(2,6000,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,6001,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,6002,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,6003,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,6004,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,6005,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,6006,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,6007,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,6008,'Html-test box 2','Code','HTML-TEST2.html','[viktig=1]',3,NULL,9),(2,7000,'JS-TEST box 2','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(2,7001,'JS-TEST box 2','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(2,7002,'JS-TEST box 2','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(2,7003,'JS-TEST box 2','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(2,7004,'JS-TEST box 2','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(2,7005,'JS-TEST box 2','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(2,7006,'JS-TEST box 2','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(2,7007,'JS-TEST box 2','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(2,7008,'JS-TEST box 2','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(2,8000,'SQL-TEST box 2','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(2,8001,'SQL-TEST box 2','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(2,8002,'SQL-TEST box 2','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(2,8003,'SQL-TEST box 2','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(2,8004,'SQL-TEST box 2','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(2,8005,'SQL-TEST box 2','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(2,8006,'SQL-TEST box 2','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(2,8007,'SQL-TEST box 2','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(2,8008,'SQL-TEST box 2','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(2,9000,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,9001,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,9002,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,9003,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,9004,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,9005,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,9006,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,9007,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(2,9008,'PHP-TEST box 2','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(3,4,'JavaScript_Ex1.js','Code','JavaScript_Ex1.js','[viktig=1]',1,NULL,9),(3,5,'Description','Document','JavaScript_Ex2.txt','[viktig=1]',4,NULL,9),(3,6,'JavaScript_Ex3.js','Code','JavaScript_Ex3.js','[viktig=1]',1,NULL,9),(3,7,'HTML_Ex1.css','Code','HTML_Ex1.css','[viktig=1]',4,NULL,9),(3,14,'HTML_Ex8.css','Code','HTML_Ex8.css','[viktig=1]',4,NULL,9),(3,15,'Shader Output','IFRAME','Shader_Ex1.html','[viktig=1]',NULL,NULL,9),(3,16,'Shader Output','IFRAME','Shader_Ex2.html','[viktig=1]',NULL,NULL,9),(3,6002,'Html-test box 3','Code','HTML-TEST3.html','[viktig=1]',3,NULL,9),(3,6003,'Html-test box 3','Code','HTML-TEST3.html','[viktig=1]',3,NULL,9),(3,6004,'Html-test box 3','Code','HTML-TEST3.html','[viktig=1]',3,NULL,9),(3,6005,'Html-test box 3','Code','HTML-TEST3.html','[viktig=1]',3,NULL,9),(3,6006,'Html-test box 3','Code','HTML-TEST3.html','[viktig=1]',3,NULL,9),(3,6007,'Html-test box 3','Code','HTML-TEST3.html','[viktig=1]',3,NULL,9),(3,6008,'Html-test box 3','Code','HTML-TEST3.html','[viktig=1]',3,NULL,9),(3,7002,'JS-TEST box 3','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(3,7003,'JS-TEST box 3','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(3,7004,'JS-TEST box 3','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(3,7005,'JS-TEST box 3','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(3,7006,'JS-TEST box 3','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(3,7007,'JS-TEST box 3','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(3,7008,'JS-TEST box 3','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(3,8002,'SQL-TEST box 3','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(3,8003,'SQL-TEST box 3','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(3,8004,'SQL-TEST box 3','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(3,8005,'SQL-TEST box 3','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(3,8006,'SQL-TEST box 3','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(3,8007,'SQL-TEST box 3','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(3,8008,'SQL-TEST box 3','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(3,9002,'PHP-TEST box 3','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(3,9003,'PHP-TEST box 3','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(3,9004,'PHP-TEST box 3','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(3,9005,'PHP-TEST box 3','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(3,9006,'PHP-TEST box 3','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(3,9007,'PHP-TEST box 3','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(3,9008,'PHP-TEST box 3','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(4,7,'HTML_Ex1.js','Code','HTML_Ex1.js','[viktig=1]',1,NULL,9),(4,14,'HTML_Ex8.js','Code','HTML_Ex8.js','[viktig=1]',1,NULL,9),(4,6004,'Html-test box 4','Code','HTML-TEST4.html','[viktig=1]',3,NULL,9),(4,6005,'Html-test box 4','Code','HTML-TEST4.html','[viktig=1]',3,NULL,9),(4,6006,'Html-test box 4','Code','HTML-TEST4.html','[viktig=1]',3,NULL,9),(4,6007,'Html-test box 4','Code','HTML-TEST4.html','[viktig=1]',3,NULL,9),(4,6008,'Html-test box 4','Code','HTML-TEST4.html','[viktig=1]',3,NULL,9),(4,7004,'JS-TEST box 4','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(4,7005,'JS-TEST box 4','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(4,7006,'JS-TEST box 4','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(4,7007,'JS-TEST box 4','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(4,7008,'JS-TEST box 4','Code','JS-TEST2.js','[viktig=1]',3,NULL,9),(4,8004,'SQL-TEST box 4','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(4,8005,'SQL-TEST box 4','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(4,8006,'SQL-TEST box 4','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(4,8007,'SQL-TEST box 4','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(4,8008,'SQL-TEST box 4','Code','SQL-TEST2.SQL','[viktig=1]',3,NULL,9),(4,9004,'PHP-TEST box 4','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(4,9005,'PHP-TEST box 4','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(4,9006,'PHP-TEST box 4','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(4,9007,'PHP-TEST box 4','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(4,9008,'PHP-TEST box 4','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9),(5,6008,'Html-test box 5','Code','HTML-TEST1.html','[viktig=1]',3,NULL,9),(5,7008,'JS-TEST box 5','Code','JS-TEST1.js','[viktig=1]',3,NULL,9),(5,8008,'SQL-TEST box 5','Code','SQL-TEST1.SQL','[viktig=1]',3,NULL,9),(5,9008,'PHP-TEST box 5','Code','PHP-TEST1.PHP','[viktig=1]',3,NULL,9);
/*!40000 ALTER TABLE `box` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `class`
--

DROP TABLE IF EXISTS `class`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `class` (
  `class` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `responsible` int unsigned NOT NULL,
  `classname` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `regcode` int DEFAULT NULL,
  `classcode` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hp` decimal(10,1) DEFAULT NULL,
  `tempo` int DEFAULT NULL,
  `hpProgress` decimal(3,1) DEFAULT NULL,
  PRIMARY KEY (`class`,`responsible`),
  KEY `responsible` (`responsible`),
  CONSTRAINT `class_ibfk_1` FOREIGN KEY (`responsible`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `class`
--

LOCK TABLES `class` WRITE;
/*!40000 ALTER TABLE `class` DISABLE KEYS */;
INSERT INTO `class` VALUES ('DVSUG13h',100,'theGreat',199191,'DVSUG',180.0,100,NULL),('WEBUG13h',101,'theBEST',199292,'WEBUG',180.0,100,NULL),('WEBUG14h',101,'theDEST',199393,'WEBUG',180.0,100,NULL);
/*!40000 ALTER TABLE `class` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `codeexample`
--

DROP TABLE IF EXISTS `codeexample`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `codeexample` (
  `exampleid` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `cid` int unsigned NOT NULL,
  `examplename` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sectionname` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `beforeid` int DEFAULT NULL,
  `afterid` int DEFAULT NULL,
  `runlink` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cversion` int DEFAULT NULL,
  `public` tinyint unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uid` int unsigned NOT NULL,
  `templateid` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`exampleid`),
  KEY `cid` (`cid`),
  KEY `uid` (`uid`),
  KEY `templateid` (`templateid`),
  CONSTRAINT `codeexample_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`),
  CONSTRAINT `codeexample_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `codeexample_ibfk_3` FOREIGN KEY (`templateid`) REFERENCES `template` (`templateid`)
) ENGINE=InnoDB AUTO_INCREMENT=9010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `codeexample`
--

LOCK TABLES `codeexample` WRITE;
/*!40000 ALTER TABLE `codeexample` DISABLE KEYS */;
INSERT INTO `codeexample` VALUES (1,1,'PHP Startup','PHP Example 1',1,2,'PHP_Ex1.php',45656,0,'2023-05-12 13:01:53',1,1),(2,1,'PHP Startup','PHP Example 2',1,3,'PHP_Ex2.php',45656,0,'2023-05-12 13:01:53',1,1),(3,1,'PHP Variables','PHP Example 3',2,4,'PHP_Ex3.php',45656,0,'2023-05-12 13:01:54',1,1),(4,1,'Events, DOM access and console.log','JavaScript Example 1',3,5,'JavaScript_Ex1.html',45656,0,'2023-05-12 13:01:54',1,3),(5,1,'Adding and removing elements in the DOM','JavaScript Example 2',4,6,'JavaScript_Ex2.html',45656,0,'2023-05-12 13:01:54',1,4),(6,1,'Validating form data','JavaScript Example 3',5,7,'JavaScript_Ex3.html',45656,0,'2023-05-12 13:01:54',1,3),(7,1,'Basic canvas graphics','HTML5 Example 1',6,8,'HTML_Ex1.html',45656,0,'2023-05-12 13:01:54',1,6),(8,1,'Canvas Gradients and Transformations','HTML5 Example 2',7,9,'HTML_Ex2.html',45656,0,'2023-05-12 13:01:54',1,2),(9,1,'Animation and drawing images','HTML5 Example 3',8,10,'HTML_Ex3.html',45656,0,'2023-05-12 13:01:54',1,2),(10,1,'Shadows','HTML5 Example 4',9,11,'HTML_Ex4.html',45656,0,'2023-05-12 13:01:54',1,2),(11,1,'Reading mouse coordinates','HTML5 Example 5',10,12,'HTML_Ex5.html',45656,0,'2023-05-12 13:01:54',1,1),(12,1,'2D Tile Map and Mouse Coordinates','HTML5 Example 6',11,13,'HTML_Ex6.html',45656,0,'2023-05-12 13:01:54',1,1),(13,1,'Isometric Tile Map and Mouse Coordinates','HTML5 Example 7',12,14,'HTML_Ex7.html',45656,0,'2023-05-12 13:01:54',1,1),(14,1,'Cookies','HTML5 Example 8',13,15,'HTML_Ex8.html',45656,0,'2023-05-12 13:01:54',1,5),(15,1,'Per Pixel Diffuse Lighting','Shaderprogrammering',14,16,'Shader_Ex1.html',45656,0,'2023-05-12 13:01:54',1,3),(16,1,'Rim Lighting','Shaderprogrammering',15,16,'Shader_Ex2.html',45656,0,'2023-05-12 13:01:54',1,3),(6000,1885,'HTML-TEST1.html','html',6001,6000,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:25',1,1),(6001,1885,'HTML-TEST1.html','html',6002,6000,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:26',1,2),(6002,1885,'HTML-TEST1.html','html',6003,6001,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:26',1,3),(6003,1885,'HTML-TEST1.html','html',6004,6002,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:26',1,4),(6004,1885,'HTML-TEST1.html','html',6005,6003,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:26',1,5),(6005,1885,'HTML-TEST1.html','html',6006,6004,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:27',1,6),(6006,1885,'HTML-TEST1.html','html',6007,6005,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:27',1,7),(6007,1885,'HTML-TEST1.html','html',6008,6006,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:27',1,8),(6008,1885,'HTML-TEST1.html','html',6009,6007,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:28',1,9),(6009,1885,'HTML-TEST1.html','html',6000,6008,'HTML-TEST1.html',1337,0,'2023-05-12 13:02:29',1,10),(7000,1885,'JS-TEST1.js','js',7001,7000,'JS-TEST1.js',1337,0,'2023-05-12 13:02:29',1,1),(7001,1885,'JS-TEST1.js','js',7002,7000,'JS-TEST1.js',1337,0,'2023-05-12 13:02:29',1,2),(7002,1885,'JS-TEST1.js','js',7003,7001,'JS-TEST1.js',1337,0,'2023-05-12 13:02:29',1,3),(7003,1885,'JS-TEST1.js','js',7004,7002,'JS-TEST1.js',1337,0,'2023-05-12 13:02:30',1,4),(7004,1885,'JS-TEST1.js','js',7005,7003,'JS-TEST1.js',1337,0,'2023-05-12 13:02:30',1,5),(7005,1885,'JS-TEST1.js','js',7006,7004,'JS-TEST1.js',1337,0,'2023-05-12 13:02:30',1,6),(7006,1885,'JS-TEST1.js','js',7007,7005,'JS-TEST1.js',1337,0,'2023-05-12 13:02:30',1,7),(7007,1885,'JS-TEST1.js','js',7008,7006,'JS-TEST1.js',1337,0,'2023-05-12 13:02:31',1,8),(7008,1885,'JS-TEST1.js','js',7009,7007,'JS-TEST1.js',1337,0,'2023-05-12 13:02:31',1,9),(7009,1885,'JS-TEST1.js','js',7000,7008,'JS-TEST1.js',1337,0,'2023-05-12 13:02:31',1,10),(8000,1885,'SQL-TEST1.SQL','SQL',8001,8000,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:31',1,1),(8001,1885,'SQL-TEST1.SQL','SQL',8002,8000,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:32',1,2),(8002,1885,'SQL-TEST1.SQL','SQL',8003,8001,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:32',1,3),(8003,1885,'SQL-TEST1.SQL','SQL',8004,8002,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:32',1,4),(8004,1885,'SQL-TEST1.SQL','SQL',8005,8003,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:32',1,5),(8005,1885,'SQL-TEST1.SQL','SQL',8006,8004,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:33',1,6),(8006,1885,'SQL-TEST1.SQL','SQL',8007,8005,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:33',1,7),(8007,1885,'SQL-TEST1.SQL','SQL',8008,8006,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:33',1,8),(8008,1885,'SQL-TEST1.SQL','SQL',8009,8007,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:34',1,9),(8009,1885,'SQL-TEST1.SQL','SQL',8000,8008,'SQL-TEST1.SQL',1337,0,'2023-05-12 13:02:34',1,10),(9000,1885,'PHP-TEST1.PHP','PHP',9001,9000,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:34',1,1),(9001,1885,'PHP-TEST1.PHP','PHP',9002,9000,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:34',1,2),(9002,1885,'PHP-TEST1.PHP','PHP',9003,9001,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:34',1,3),(9003,1885,'PHP-TEST1.PHP','PHP',9004,9002,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:34',1,4),(9004,1885,'PHP-TEST1.PHP','PHP',9005,9003,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:35',1,5),(9005,1885,'PHP-TEST1.PHP','PHP',9006,9004,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:35',1,6),(9006,1885,'PHP-TEST1.PHP','PHP',9007,9005,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:35',1,7),(9007,1885,'PHP-TEST1.PHP','PHP',9008,9006,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:35',1,8),(9008,1885,'PHP-TEST1.PHP','PHP',9009,9007,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:35',1,9),(9009,1885,'PHP-TEST1.PHP','PHP',9000,9008,'PHP-TEST1.PHP',1337,0,'2023-05-12 13:02:36',1,10);
/*!40000 ALTER TABLE `codeexample` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `cid` int unsigned NOT NULL AUTO_INCREMENT,
  `coursecode` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coursename` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `creator` int unsigned NOT NULL,
  `visibility` tinyint unsigned NOT NULL DEFAULT '0',
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `activeversion` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activeedversion` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `capacity` int DEFAULT NULL,
  `hp` decimal(4,1) NOT NULL DEFAULT '7.5',
  `courseHttpPage` varchar(2000) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `courseGitURL` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cid`),
  UNIQUE KEY `coursecode` (`coursecode`),
  KEY `creator` (`creator`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=1895 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES (1,'DV12G','Webbprogrammering','2023-05-12 13:01:47',1,1,'2023-05-12 13:01:47','45656',NULL,NULL,7.5,NULL,NULL),(2,'IT118G','Webbutveckling - datorgrafik','2023-05-12 13:01:47',1,1,'2023-05-12 13:01:47','97732',NULL,NULL,7.5,NULL,NULL),(3,'IT500G','Datorns grunder','2023-05-12 13:01:47',1,1,'2023-05-12 13:01:47','1337',NULL,NULL,7.5,NULL,NULL),(4,'IT301G','Software Engineering','2023-05-12 13:01:47',1,1,'2023-05-12 13:01:47','1338',NULL,NULL,7.5,NULL,NULL),(305,'IT308G','Objektorienterad programmering','2023-05-12 13:01:47',1,0,'2023-05-12 13:01:47','12305',NULL,NULL,7.5,NULL,NULL),(307,'IT115G','Datorns grunder','2023-05-12 13:01:47',1,0,'2023-05-12 13:01:47','12307',NULL,NULL,7.5,NULL,NULL),(308,'MA161G','Diskret matematik','2023-05-12 13:01:47',1,0,'2023-05-12 13:01:47','12308',NULL,NULL,7.5,NULL,NULL),(309,'DA322G','Operativsystem','2023-05-12 13:01:47',1,0,'2023-05-12 13:01:47','12309',NULL,NULL,7.5,NULL,NULL),(312,'IT326G','Distribuerade system','2023-05-12 13:01:47',1,0,'2023-05-12 13:01:47','12312',NULL,NULL,7.5,NULL,NULL),(319,'DV736A','Examensarbete i datavetenskap','2023-05-12 13:01:47',1,0,'2023-05-12 13:01:47','12319',NULL,NULL,30.0,NULL,NULL),(324,'IT108G','Webbutveckling - webbplatsdesign','2023-05-12 13:01:47',1,0,'2023-05-12 13:01:47','12324',NULL,NULL,7.5,NULL,NULL),(1885,'G1337','Testing-Course','2023-05-12 13:02:25',1,1,'2023-05-12 13:02:25','1337',NULL,NULL,1.0,NULL,NULL),(1894,'G420','Demo-Course','2023-05-12 13:02:19',1,1,'2023-05-12 13:02:19','52432',NULL,NULL,1.0,NULL,NULL);
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `course_req`
--

DROP TABLE IF EXISTS `course_req`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course_req` (
  `cid` int unsigned NOT NULL,
  `req_cid` int unsigned NOT NULL,
  PRIMARY KEY (`cid`,`req_cid`),
  KEY `req_cid` (`req_cid`),
  CONSTRAINT `course_req_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`),
  CONSTRAINT `course_req_ibfk_2` FOREIGN KEY (`req_cid`) REFERENCES `course` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course_req`
--

LOCK TABLES `course_req` WRITE;
/*!40000 ALTER TABLE `course_req` DISABLE KEYS */;
INSERT INTO `course_req` VALUES (309,305),(319,305),(309,307),(319,307),(319,308),(312,309),(319,309);
/*!40000 ALTER TABLE `course_req` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coursekeys`
--

DROP TABLE IF EXISTS `coursekeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coursekeys` (
  `cid` int unsigned NOT NULL,
  `urlkey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coursecode` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `coursename` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `activeversion` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`urlkey`),
  UNIQUE KEY `urlkey` (`urlkey`),
  UNIQUE KEY `coursecode` (`coursecode`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coursekeys`
--

LOCK TABLES `coursekeys` WRITE;
/*!40000 ALTER TABLE `coursekeys` DISABLE KEYS */;
INSERT INTO `coursekeys` VALUES (3,'dagr',NULL,'Datorns grunder','1337'),(3,'datgrund',NULL,'Datorns grunder','1337'),(3,'datorgrund',NULL,'Datorns grunder','1337'),(1894,'dc',NULL,'Demo-Course','52432'),(1894,'dcourse',NULL,'Demo-Course','52432'),(1894,'deco',NULL,'Demo-Course','52432'),(1894,'dem',NULL,'Demo-Course','52432'),(1894,'demc',NULL,'Demo-Course','52432'),(1894,'demcourse',NULL,'Demo-Course','52432'),(1894,'demo',NULL,'Demo-Course','52432'),(3,'dg',NULL,'Datorns grunder','1337'),(3,'dgrunder',NULL,'Datorns grunder','1337'),(3,'grund',NULL,'Datorns grunder','1337'),(3,'grunderdata',NULL,'Datorns grunder','1337'),(1,'program',NULL,'Webbprogrammering','45656'),(1,'programmering',NULL,'Webbprogrammering','45656'),(4,'se',NULL,'Software Engineering','1338'),(4,'soen',NULL,'Software Engineering','1338'),(4,'soengi',NULL,'Software Engineering','1338'),(4,'sofeng',NULL,'Software Engineering','1338'),(4,'soft',NULL,'Software Engineering','1338'),(4,'soften',NULL,'Software Engineering','1338'),(4,'software',NULL,'Software Engineering','1338'),(1885,'testing',NULL,'Testing-Course','1337'),(2,'utveckl',NULL,'Webbutveckling - datorgrafik','97732'),(2,'utveckling',NULL,'Webbutveckling - datorgrafik','97732'),(2,'webbut',NULL,'Webbutveckling - datorgrafik','97732'),(1,'webprog',NULL,'Webbprogrammering','45656'),(2,'webutv',NULL,'Webbutveckling - datorgrafik','97732'),(1,'wepr',NULL,'Webbprogrammering','45656'),(1,'weprog',NULL,'Webbprogrammering','45656'),(2,'wgfx',NULL,'Webbutveckling - datorgrafik','97732'),(1,'wp',NULL,'Webbprogrammering','45656'),(1,'wprograming',NULL,'Webbprogrammering','45656'),(2,'wutveckling',NULL,'Webbutveckling - datorgrafik','97732'),(2,'wuve',NULL,'Webbutveckling - datorgrafik','97732');
/*!40000 ALTER TABLE `coursekeys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `eventlog`
--

DROP TABLE IF EXISTS `eventlog`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `eventlog` (
  `eid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint DEFAULT '0',
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `raddress` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `eventtext` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`eid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `eventlog`
--

LOCK TABLES `eventlog` WRITE;
/*!40000 ALTER TABLE `eventlog` DISABLE KEYS */;
/*!40000 ALTER TABLE `eventlog` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `fileLink`
--

DROP TABLE IF EXISTS `fileLink`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `fileLink` (
  `fileid` int NOT NULL AUTO_INCREMENT,
  `filename` varchar(128) COLLATE utf8mb4_unicode_ci NOT NULL,
  `path` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kind` int DEFAULT NULL,
  `cid` int unsigned NOT NULL,
  `isGlobal` tinyint(1) DEFAULT '0',
  `filesize` int NOT NULL DEFAULT '0',
  `uploaddate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `filesiz` int DEFAULT NULL,
  `vers` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`fileid`),
  KEY `cid` (`cid`),
  CONSTRAINT `fileLink_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `fileLink`
--

LOCK TABLES `fileLink` WRITE;
/*!40000 ALTER TABLE `fileLink` DISABLE KEYS */;
INSERT INTO `fileLink` VALUES (1,'HTML_Ex1.css',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(2,'HTML_Ex1.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(3,'HTML_Ex1.js',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(4,'HTML_Ex1.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(5,'HTML_Ex2.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(6,'HTML_Ex2.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(7,'HTML_Ex3.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(8,'HTML_Ex3.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(9,'HTML_Ex4.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(10,'HTML_Ex4.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(11,'HTML_Ex5.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(12,'HTML_Ex5.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(13,'HTML_Ex6.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(14,'HTML_Ex6.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(15,'HTML_Ex7.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(16,'HTML_Ex7.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(17,'HTML_Ex8.css',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(18,'HTML_Ex8.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(19,'HTML_Ex8.js',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(20,'HTML_Ex8.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(21,'JavaScript_Ex1.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(22,'JavaScript_Ex1.js',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(23,'JavaScript_Ex1.txt',NULL,2,1,1,0,'2023-05-12 13:02:08',NULL,NULL),(24,'JavaScript_Ex2.html',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(25,'JavaScript_Ex2.js',NULL,3,1,0,0,'2023-05-12 13:02:08',NULL,NULL),(26,'JavaScript_Ex2.txt',NULL,2,1,1,0,'2023-05-12 13:02:09',NULL,NULL),(27,'JavaScript_Ex3.html',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(28,'JavaScript_Ex3.js',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(29,'JavaScript_Ex3.txt',NULL,2,1,1,0,'2023-05-12 13:02:09',NULL,NULL),(30,'PHP_Ex1.php',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(31,'PHP_Ex1.txt',NULL,2,1,1,0,'2023-05-12 13:02:09',NULL,NULL),(32,'PHP_Ex2.php',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(33,'PHP_Ex2.txt',NULL,2,1,1,0,'2023-05-12 13:02:09',NULL,NULL),(34,'PHP_Ex3.php',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(35,'PHP_Ex3.txt',NULL,2,1,1,0,'2023-05-12 13:02:09',NULL,NULL),(36,'Shader_Ex1.html',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(37,'Shader_Ex1.js',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(38,'Shader_Ex1.txt',NULL,2,1,1,0,'2023-05-12 13:02:09',NULL,NULL),(39,'Shader_Ex2.html',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(40,'Shader_Ex2.js',NULL,3,1,0,0,'2023-05-12 13:02:09',NULL,NULL),(41,'Shader_Ex2.txt',NULL,2,1,1,0,'2023-05-12 13:02:09',NULL,NULL),(42,'minimikrav_m2.md',NULL,3,2,0,0,'2023-05-12 13:02:09',NULL,NULL),(43,'test.png',NULL,3,2,0,0,'2023-05-12 13:02:09',NULL,NULL),(44,'cssdugga-site-1.png',NULL,3,2,0,0,'2023-05-12 13:02:09',NULL,NULL),(45,'diagram.json',NULL,2,1,1,0,'2023-05-12 13:02:09',NULL,NULL),(46,'helloWorld.html',NULL,3,2,0,137,'2023-05-12 13:02:09',NULL,NULL),(47,'helloWorld.html',NULL,2,2,1,137,'2023-05-12 13:02:09',NULL,NULL),(48,'HelloPhp.php',NULL,3,2,0,35,'2023-05-12 13:02:09',NULL,NULL),(49,'testJS.js',NULL,4,2,0,45,'2023-05-12 13:02:09',NULL,'97732'),(50,'mdTest.md',NULL,2,2,1,60,'2023-05-12 13:02:10',NULL,NULL),(51,'Codeblock.txt',NULL,3,3,0,238,'2023-05-12 13:02:10',NULL,NULL),(52,'StylingTest.txt',NULL,3,3,0,174,'2023-05-12 13:02:10',NULL,NULL),(53,'ListTest.txt',NULL,3,3,0,513,'2023-05-12 13:02:10',NULL,NULL),(54,'LinkTest.txt',NULL,3,3,0,92,'2023-05-12 13:02:10',NULL,NULL),(55,'HTML-TEST1.html',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL),(56,'HTML-TEST2.html',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL),(57,'HTML-TEST3.html',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL),(58,'HTML-TEST4.html',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL),(59,'SQL-TEST1.sql',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL),(60,'SQL-TEST2.sql',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL),(61,'JS-TEST1.js',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL),(62,'JS-TEST2.js',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL),(63,'PHP-TEST1.php',NULL,2,1885,0,0,'2023-05-12 13:02:25',NULL,NULL);
/*!40000 ALTER TABLE `fileLink` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `git_user`
--

DROP TABLE IF EXISTS `git_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `git_user` (
  `git_uid` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status_pass` tinyint unsigned NOT NULL DEFAULT '0',
  `status_account` tinyint unsigned NOT NULL DEFAULT '0',
  `addedtime` datetime DEFAULT NULL,
  `lastvisit` datetime DEFAULT NULL,
  PRIMARY KEY (`git_uid`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `git_user`
--

LOCK TABLES `git_user` WRITE;
/*!40000 ALTER TABLE `git_user` DISABLE KEYS */;
/*!40000 ALTER TABLE `git_user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groupdugga`
--

DROP TABLE IF EXISTS `groupdugga`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groupdugga` (
  `hash` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active_users` int unsigned DEFAULT NULL,
  PRIMARY KEY (`hash`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groupdugga`
--

LOCK TABLES `groupdugga` WRITE;
/*!40000 ALTER TABLE `groupdugga` DISABLE KEYS */;
/*!40000 ALTER TABLE `groupdugga` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `groups` (
  `groupID` int unsigned NOT NULL AUTO_INCREMENT,
  `groupKind` varchar(4) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupVal` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `groupInt` int NOT NULL,
  PRIMARY KEY (`groupID`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'No','1',1),(2,'No','2',2),(3,'No','3',3),(4,'No','4',4),(5,'No','5',5),(6,'No','6',6),(7,'No','7',7),(8,'No','8',8),(9,'Le','A',1),(10,'Le','B',2),(11,'Le','C',3),(12,'Le','D',4),(13,'Le','E',5),(14,'Le','F',6),(15,'Le','G',7),(16,'Le','H',8),(17,'Vi','I',1),(18,'Vi','II',2),(19,'Vi','III',3),(20,'Vi','IV',4),(21,'Vi','V',5),(22,'Vi','VI',6),(23,'Vi','VII',7),(24,'Vi','VIII',8);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `highscore_quiz_time`
--

DROP TABLE IF EXISTS `highscore_quiz_time`;
/*!50001 DROP VIEW IF EXISTS `highscore_quiz_time`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `highscore_quiz_time` AS SELECT 
 1 AS `cid`,
 1 AS `quiz`,
 1 AS `uid`,
 1 AS `grade`,
 1 AS `score`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `improw`
--

DROP TABLE IF EXISTS `improw`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `improw` (
  `impid` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `boxid` int unsigned NOT NULL,
  `exampleid` mediumint unsigned NOT NULL,
  `istart` int DEFAULT NULL,
  `iend` int DEFAULT NULL,
  `irowdesc` varchar(1024) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uid` int unsigned NOT NULL,
  PRIMARY KEY (`impid`,`exampleid`,`boxid`),
  KEY `uid` (`uid`),
  KEY `boxid` (`boxid`,`exampleid`),
  CONSTRAINT `improw_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `improw_ibfk_2` FOREIGN KEY (`boxid`, `exampleid`) REFERENCES `box` (`boxid`, `exampleid`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `improw`
--

LOCK TABLES `improw` WRITE;
/*!40000 ALTER TABLE `improw` DISABLE KEYS */;
INSERT INTO `improw` VALUES (1,2,1,4,9,NULL,'2023-05-12 13:01:56',1),(2,2,2,3,5,NULL,'2023-05-12 13:01:56',1),(3,2,2,11,13,NULL,'2023-05-12 13:01:56',1),(4,2,3,10,12,NULL,'2023-05-12 13:01:56',1),(5,2,3,15,15,NULL,'2023-05-12 13:01:57',1),(6,2,3,21,21,NULL,'2023-05-12 13:01:57',1),(7,2,3,24,24,NULL,'2023-05-12 13:01:57',1),(8,2,4,7,8,NULL,'2023-05-12 13:01:57',1),(9,3,4,2,21,NULL,'2023-05-12 13:01:57',1),(10,3,4,24,29,NULL,'2023-05-12 13:01:57',1),(11,2,5,1,19,NULL,'2023-05-12 13:01:57',1),(12,2,5,21,30,NULL,'2023-05-12 13:01:57',1),(13,2,5,32,34,NULL,'2023-05-12 13:01:57',1),(14,3,6,1,5,NULL,'2023-05-12 13:01:57',1),(15,3,6,7,11,NULL,'2023-05-12 13:01:57',1),(16,3,6,13,16,NULL,'2023-05-12 13:01:57',1),(17,3,6,18,21,NULL,'2023-05-12 13:01:57',1),(18,3,6,23,29,NULL,'2023-05-12 13:01:57',1),(19,3,6,31,34,NULL,'2023-05-12 13:01:57',1),(20,3,6,36,47,NULL,'2023-05-12 13:01:57',1),(21,3,6,49,55,NULL,'2023-05-12 13:01:57',1),(22,4,7,6,7,NULL,'2023-05-12 13:01:57',1),(23,4,7,11,12,NULL,'2023-05-12 13:01:57',1),(24,4,7,15,17,NULL,'2023-05-12 13:01:57',1),(25,4,7,20,25,NULL,'2023-05-12 13:01:57',1),(26,4,7,28,33,NULL,'2023-05-12 13:01:57',1),(27,4,7,36,37,NULL,'2023-05-12 13:01:57',1),(28,2,8,20,30,NULL,'2023-05-12 13:01:58',1),(29,2,8,41,41,NULL,'2023-05-12 13:01:58',1),(30,2,8,44,48,NULL,'2023-05-12 13:01:58',1),(31,2,8,84,89,NULL,'2023-05-12 13:01:58',1),(32,2,8,92,97,NULL,'2023-05-12 13:01:58',1),(33,2,8,100,105,NULL,'2023-05-12 13:01:58',1),(34,2,8,108,114,NULL,'2023-05-12 13:01:58',1),(35,2,8,116,116,NULL,'2023-05-12 13:01:58',1),(36,2,9,21,38,NULL,'2023-05-12 13:01:58',1),(37,2,9,43,47,NULL,'2023-05-12 13:01:58',1),(38,2,9,50,57,NULL,'2023-05-12 13:01:58',1),(39,2,9,62,71,NULL,'2023-05-12 13:01:58',1),(40,2,9,79,79,NULL,'2023-05-12 13:01:58',1),(41,2,10,89,93,NULL,'2023-05-12 13:01:58',1),(42,2,10,96,110,NULL,'2023-05-12 13:01:58',1),(43,2,10,112,114,NULL,'2023-05-12 13:01:58',1),(44,2,11,14,16,NULL,'2023-05-12 13:01:58',1),(45,2,11,20,28,NULL,'2023-05-12 13:01:58',1),(46,2,11,31,42,NULL,'2023-05-12 13:01:58',1),(47,2,11,45,51,NULL,'2023-05-12 13:01:58',1),(48,2,11,54,65,NULL,'2023-05-12 13:01:59',1),(49,2,12,11,15,NULL,'2023-05-12 13:01:59',1),(50,2,12,36,52,NULL,'2023-05-12 13:01:59',1),(51,2,12,55,70,NULL,'2023-05-12 13:01:59',1),(52,2,12,80,84,NULL,'2023-05-12 13:01:59',1),(53,2,12,96,98,NULL,'2023-05-12 13:01:59',1),(54,2,13,11,15,NULL,'2023-05-12 13:01:59',1),(55,2,13,32,41,NULL,'2023-05-12 13:01:59',1),(56,2,13,46,62,NULL,'2023-05-12 13:01:59',1),(57,2,13,65,80,NULL,'2023-05-12 13:01:59',1),(58,2,13,90,94,NULL,'2023-05-12 13:01:59',1),(59,2,13,106,108,NULL,'2023-05-12 13:01:59',1),(60,4,14,4,19,NULL,'2023-05-12 13:01:59',1),(61,4,14,22,30,NULL,'2023-05-12 13:01:59',1),(62,4,14,33,37,NULL,'2023-05-12 13:01:59',1),(63,4,14,40,52,NULL,'2023-05-12 13:01:59',1),(64,4,14,55,59,NULL,'2023-05-12 13:01:59',1),(65,4,14,62,64,NULL,'2023-05-12 13:01:59',1),(66,4,14,67,70,NULL,'2023-05-12 13:01:59',1),(67,4,14,73,73,NULL,'2023-05-12 13:01:59',1),(68,2,16,34,35,NULL,'2023-05-12 13:01:59',1);
/*!40000 ALTER TABLE `improw` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `impwordlist`
--

DROP TABLE IF EXISTS `impwordlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `impwordlist` (
  `wordid` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `exampleid` mediumint unsigned NOT NULL,
  `word` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `UPDATED` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uid` int unsigned NOT NULL,
  PRIMARY KEY (`wordid`),
  KEY `exampleid` (`exampleid`),
  KEY `uid` (`uid`),
  CONSTRAINT `impwordlist_ibfk_1` FOREIGN KEY (`exampleid`) REFERENCES `codeexample` (`exampleid`),
  CONSTRAINT `impwordlist_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `impwordlist`
--

LOCK TABLES `impwordlist` WRITE;
/*!40000 ALTER TABLE `impwordlist` DISABLE KEYS */;
INSERT INTO `impwordlist` VALUES (1,1,'echo',NULL,'2023-05-12 13:01:59',1),(2,1,'Hello!',NULL,'2023-05-12 13:01:59',1),(3,2,'Hello!',NULL,'2023-05-12 13:02:00',1),(4,4,'onclick',NULL,'2023-05-12 13:02:00',1),(5,4,'onload',NULL,'2023-05-12 13:02:00',1),(6,4,'initializeEvents',NULL,'2023-05-12 13:02:00',1),(7,4,'console.log',NULL,'2023-05-12 13:02:00',1),(8,4,'changeBackground',NULL,'2023-05-12 13:02:00',1),(9,5,'createElement',NULL,'2023-05-12 13:02:00',1),(10,5,'innerHTML',NULL,'2023-05-12 13:02:00',1),(11,5,'appendChild',NULL,'2023-05-12 13:02:00',1),(12,5,'appendNode',NULL,'2023-05-12 13:02:00',1),(13,5,'insertBefore',NULL,'2023-05-12 13:02:00',1),(14,5,'parentNode',NULL,'2023-05-12 13:02:00',1),(15,6,'value',NULL,'2023-05-12 13:02:00',1),(16,6,'isNaN',NULL,'2023-05-12 13:02:00',1),(17,6,'className',NULL,'2023-05-12 13:02:00',1),(18,6,'options',NULL,'2023-05-12 13:02:00',1),(19,6,'selectedIndex',NULL,'2023-05-12 13:02:00',1),(20,6,'length',NULL,'2023-05-12 13:02:00',1),(21,6,'onclick',NULL,'2023-05-12 13:02:00',1),(22,6,'onload',NULL,'2023-05-12 13:02:00',1),(23,6,'onchange',NULL,'2023-05-12 13:02:00',1),(24,6,'onkeyup',NULL,'2023-05-12 13:02:00',1),(25,6,'onblur',NULL,'2023-05-12 13:02:00',1),(26,7,'canvas',NULL,'2023-05-12 13:02:00',1),(27,7,'fillRect',NULL,'2023-05-12 13:02:00',1),(28,7,'getContext',NULL,'2023-05-12 13:02:00',1),(29,7,'strokeStyle',NULL,'2023-05-12 13:02:00',1),(30,7,'strokeRect',NULL,'2023-05-12 13:02:01',1),(31,7,'fillStyle',NULL,'2023-05-12 13:02:01',1),(32,7,'fillText',NULL,'2023-05-12 13:02:01',1),(33,8,'beginPath',NULL,'2023-05-12 13:02:01',1),(34,8,'createLinearGradient',NULL,'2023-05-12 13:02:01',1),(35,8,'save()',NULL,'2023-05-12 13:02:01',1),(36,8,'rotate',NULL,'2023-05-12 13:02:01',1),(37,8,'restore()',NULL,'2023-05-12 13:02:01',1),(38,8,'closePath',NULL,'2023-05-12 13:02:01',1),(39,9,'new Image()',NULL,'2023-05-12 13:02:01',1),(40,9,'src',NULL,'2023-05-12 13:02:01',1),(41,9,'drawImage',NULL,'2023-05-12 13:02:01',1),(42,10,'shadowColor',NULL,'2023-05-12 13:02:01',1),(43,10,'shadowOffsetX',NULL,'2023-05-12 13:02:01',1),(44,10,'shadowOffsetY',NULL,'2023-05-12 13:02:01',1),(45,10,'shadowBlur',NULL,'2023-05-12 13:02:01',1);
/*!40000 ALTER TABLE `impwordlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `list`
--

DROP TABLE IF EXISTS `list`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `list` (
  `listnr` int DEFAULT NULL,
  `listeriesid` int DEFAULT NULL,
  `provdatum` date DEFAULT NULL,
  `responsible` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `responsibledate` date DEFAULT NULL,
  `course` int DEFAULT NULL,
  `listid` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`listid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `list`
--

LOCK TABLES `list` WRITE;
/*!40000 ALTER TABLE `list` DISABLE KEYS */;
INSERT INTO `list` VALUES (23415,2001,NULL,'Christina Sjogren',NULL,2,1),(23415,2004,NULL,'Christina Sjogren',NULL,2,2),(23415,2010,NULL,'Christina Sjogren',NULL,2,3),(23415,2013,NULL,'Christina Sjogren',NULL,2,4),(23415,2016,NULL,'Christina Sjogren',NULL,2,5),(23415,2019,NULL,'Christina Sjogren',NULL,2,6),(23415,2022,NULL,'Christina Sjogren',NULL,2,7);
/*!40000 ALTER TABLE `list` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `listentries`
--

DROP TABLE IF EXISTS `listentries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `listentries` (
  `lid` int unsigned NOT NULL AUTO_INCREMENT,
  `cid` int unsigned NOT NULL,
  `entryname` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `link` varchar(200) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kind` int unsigned DEFAULT NULL,
  `pos` int DEFAULT NULL,
  `creator` int unsigned NOT NULL,
  `ts` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `code_id` mediumint unsigned DEFAULT NULL,
  `visible` tinyint unsigned NOT NULL DEFAULT '0',
  `vers` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comments` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `moment` int unsigned DEFAULT NULL,
  `gradesystem` tinyint(1) DEFAULT NULL,
  `highscoremode` int DEFAULT '0',
  `rowcolor` tinyint(1) DEFAULT NULL,
  `groupID` int DEFAULT NULL,
  `groupKind` varchar(16) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tabs` tinyint DEFAULT NULL,
  `feedbackenabled` tinyint unsigned NOT NULL DEFAULT '0',
  `feedbackquestion` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`lid`),
  KEY `creator` (`creator`),
  KEY `cid` (`cid`),
  CONSTRAINT `listentries_ibfk_1` FOREIGN KEY (`creator`) REFERENCES `user` (`uid`),
  CONSTRAINT `listentries_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listentries`
--

LOCK TABLES `listentries` WRITE;
/*!40000 ALTER TABLE `listentries` DISABLE KEYS */;
INSERT INTO `listentries` VALUES (1,1885,'JavaScript-Code:','1',1,1,1,'2023-05-12 13:02:25',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2,1885,'HTML-Code:','1',1,2,1,'2023-05-12 13:02:25',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4,1885,'SQL-CODE:','1',1,3,1,'2023-05-12 13:02:25',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5,1885,'PHP-CODE:','1',1,4,1,'2023-05-12 13:02:25',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(6,1885,'Other:','1',1,5,1,'2023-05-12 13:02:25',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1001,1,'PHP examples','UNK',1,1,1,'2023-05-12 13:01:49',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1002,1,'PHP Example 1','1',2,2,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1003,1,'PHP Example 2','2',2,3,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1004,1,'PHP Example 3','3',2,4,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1005,1,'Javascript examples','UNK',1,5,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1006,1,'JavaScript Example 1','4',2,6,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1007,1,'JavaScript Example 2','5',2,7,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1008,1,'JavaScript Example 3','6',2,8,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1009,1,'HTML5 examples','UNK',1,9,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1010,1,'HTML5 Example 1','7',2,10,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1011,1,'HTML5 Example 2','8',2,11,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1012,1,'HTML5 Example 3','9',2,12,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1013,1,'HTML5 Example 4','10',2,13,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1014,1,'HTML5 Example 5','11',2,14,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1015,1,'HTML5 Example 6','12',2,15,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1016,1,'HTML5 Example 7','13',2,16,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1017,1,'HTML5 Example 8','14',2,17,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1018,1,'Shader examples','UNK',1,18,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1019,1,'Shaderprogrammering','15',2,19,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1020,1,'Shaderprogrammering','16',2,20,1,'2023-05-12 13:01:50',NULL,1,'45656',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1021,1,'PHP examples - EN','UNK',1,1,1,'2023-05-12 13:01:50',NULL,1,'45657',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1022,1,'PHP Example 1 - EN','1',2,2,1,'2023-05-12 13:01:50',NULL,1,'45657',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1023,1,'PHP Example 2 - EN','2',2,3,1,'2023-05-12 13:01:51',NULL,1,'45657',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(1024,1,'PHP Example 3 - EN','3',2,4,1,'2023-05-12 13:01:51',NULL,1,'45657',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2001,2,'Biträkningsduggor 1HP','',4,0,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2001,2,0,0,NULL,NULL,NULL,0,NULL),(2002,2,'Biträkningsdugga 1','1',3,1,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2001,0,1,0,NULL,NULL,NULL,0,NULL),(2003,2,'Biträkningsdugga 2','2',3,2,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2001,0,1,0,NULL,NULL,NULL,0,NULL),(2004,2,'Färgduggor 1HP','',4,3,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2004,2,0,0,NULL,NULL,NULL,0,NULL),(2005,2,'Färgdugga 1','3',3,4,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2004,0,1,0,NULL,NULL,NULL,0,NULL),(2006,2,'Färgdugga 2','4',3,5,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2004,0,1,0,NULL,NULL,NULL,0,NULL),(2007,2,'Geometri 2HP','',4,6,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2007,2,0,0,NULL,NULL,NULL,0,NULL),(2008,2,'Linjedugga 1','5',3,7,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2007,0,2,0,NULL,NULL,NULL,0,NULL),(2009,2,'Linjedugga 2','6',3,8,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2007,0,2,0,NULL,NULL,NULL,0,NULL),(2010,2,'Transformationer 3,5HP','',4,9,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2010,2,0,0,NULL,NULL,NULL,0,NULL),(2011,2,'Transformationsdugga 1','7',3,10,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2010,0,2,0,NULL,NULL,NULL,0,NULL),(2012,2,'Transformationsdugga 2','8',3,11,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2010,0,2,0,NULL,NULL,NULL,0,NULL),(2013,2,'Frågeduggor 1HP','',4,12,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2013,2,0,0,NULL,NULL,NULL,0,NULL),(2014,2,'Frågedugga 1','9',3,13,1,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2013,0,1,0,NULL,NULL,NULL,0,NULL),(2015,2,'Rapport 1HP','',4,14,2,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2015,2,1,0,NULL,NULL,NULL,0,NULL),(2016,2,'Rapport inlämning','10',3,15,2,'2023-05-12 13:01:51',NULL,1,'97732',NULL,2015,0,1,0,NULL,NULL,NULL,0,NULL),(2017,2,'Bit count test 1HP','',4,0,1,'2023-05-12 13:01:51',NULL,1,'97731',NULL,2017,2,0,0,NULL,NULL,NULL,0,NULL),(2018,2,'Bit count test 1','1',3,1,1,'2023-05-12 13:01:51',NULL,1,'97731',NULL,2017,0,1,0,NULL,NULL,NULL,0,NULL),(2019,2,'Bit count test 2','2',3,2,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2017,0,1,0,NULL,NULL,NULL,0,NULL),(2020,2,'Color test 1HP','',4,3,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2020,2,0,0,NULL,NULL,NULL,0,NULL),(2021,2,'Hex color test 1','3',3,4,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2020,0,1,0,NULL,NULL,NULL,0,NULL),(2022,2,'Hex color test 2','4',3,5,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2020,0,1,0,NULL,NULL,NULL,0,NULL),(2023,2,'Geometry 2HP','',4,6,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2023,2,0,0,NULL,NULL,NULL,0,NULL),(2024,2,'Geometry test 1','5',3,7,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2022,0,2,0,NULL,NULL,NULL,0,NULL),(2025,2,'Geometry test 2','6',3,8,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2022,0,2,0,NULL,NULL,NULL,0,NULL),(2026,2,'Transforms 3,5HP','',4,9,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2026,2,0,0,NULL,NULL,NULL,0,NULL),(2027,2,'Transforms test 1','7',3,10,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2026,0,2,0,NULL,NULL,NULL,0,NULL),(2028,2,'Transforms test 2','8',3,11,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2026,0,2,0,NULL,NULL,NULL,0,NULL),(2029,2,'Quizzes 1HP','',4,12,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2029,2,0,0,NULL,NULL,NULL,0,NULL),(2030,2,'Quiz 1','9',3,13,1,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2029,0,1,0,NULL,NULL,NULL,0,NULL),(2031,2,'Report 1HP','',4,14,2,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2031,2,1,0,NULL,NULL,NULL,0,NULL),(2032,2,'Report submission','10',3,15,2,'2023-05-12 13:01:52',NULL,1,'97731',NULL,2031,0,1,0,NULL,NULL,NULL,0,NULL),(2033,2,'HTML and CSS 1HP','',4,16,2,'2023-05-12 13:01:52',NULL,1,'97732',NULL,2033,2,1,0,NULL,NULL,NULL,0,NULL),(2034,2,'Random css dugga','11',3,17,2,'2023-05-12 13:01:52',NULL,1,'97732',NULL,2033,0,1,0,NULL,NULL,NULL,0,NULL),(2035,2,'Clipping','',4,18,2,'2023-05-12 13:01:52',NULL,1,'97732',NULL,2035,2,1,0,NULL,NULL,NULL,0,NULL),(2036,2,'Random clipping dugga','12',3,19,2,'2023-05-12 13:01:52',NULL,1,'97732',NULL,2035,0,1,0,NULL,NULL,NULL,0,NULL),(2110,1885,'PHP-TEST template 1','9000',2,4,1,'2023-05-12 13:02:34',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2111,1885,'PHP-TEST template 2','9001',2,4,1,'2023-05-12 13:02:34',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2112,1885,'PHP-TEST template 3','9002',2,4,1,'2023-05-12 13:02:34',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2113,1885,'PHP-TEST template 4','9003',2,4,1,'2023-05-12 13:02:34',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2114,1885,'PHP-TEST template 5','9004',2,4,1,'2023-05-12 13:02:35',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2115,1885,'PHP-TEST template 6','9005',2,4,1,'2023-05-12 13:02:35',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2116,1885,'PHP-TEST template 7','9006',2,4,1,'2023-05-12 13:02:35',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2117,1885,'PHP-TEST template 8','9007',2,4,1,'2023-05-12 13:02:35',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2118,1885,'PHP-TEST template 9','9008',2,4,1,'2023-05-12 13:02:36',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(2119,1885,'PHP-TEST template 10','9009',2,4,1,'2023-05-12 13:02:36',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3001,1894,'Tillgängliga Duggor','',4,0,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,2,0,0,NULL,NULL,NULL,0,NULL),(3002,1894,'3D Dugga','13',3,1,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3003,1894,'BIT Dugga','14',3,2,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3004,1894,'Boxmodell','15',3,3,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3005,1894,'Clipping Maskin Dugga','16',3,4,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3006,1894,'Color Dugga','17',3,5,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3007,1894,'Contribution','18',3,6,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3008,1894,'Curve Dugga','19',3,7,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3009,1894,'Daily Minutes','20',3,8,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3010,1894,'Diagram Dugga','21',3,9,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3011,1894,'Dugga 1','22',3,10,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3012,1894,'Dugga 2','23',3,11,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3013,1894,'Dugga 3','24',3,12,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3014,1894,'Dugga 4','25',3,13,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3015,1894,'Dugga 5','26',3,14,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3016,1894,'Dugga 6','27',3,15,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3017,1894,'Feedback Dugga','28',3,16,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3018,1894,'Generic Dugga File Receive','29',3,17,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3019,1894,'Group Assignment','30',3,18,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3020,1894,'HTML CSS Dugga','31',3,19,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3021,1894,'HTML CSS Dugga Light','32',3,20,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3022,1894,'Kryss','33',3,21,1,'2023-05-12 13:02:21',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3023,1894,'Placeholder Dugga','34',3,22,1,'2023-05-12 13:02:22',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3024,1894,'Shapes Dugga','35',3,23,1,'2023-05-12 13:02:22',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3025,1894,'Transforms Dugga','36',3,24,1,'2023-05-12 13:02:22',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3026,1894,'XMLAPI Report','37',3,25,1,'2023-05-12 13:02:22',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3027,1894,'Seminar Dugga','38',3,25,1,'2023-05-12 13:02:22',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3028,1894,'SVG Dugga','39',3,27,1,'2023-05-12 13:02:22',NULL,1,'52432',NULL,3001,0,1,0,NULL,NULL,NULL,0,NULL),(3110,1885,'SQL-TEST template 1','8000',2,3,1,'2023-05-12 13:02:32',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3111,1885,'SQL-TEST template 2','8001',2,3,1,'2023-05-12 13:02:32',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3112,1885,'SQL-TEST template 3','8002',2,3,1,'2023-05-12 13:02:32',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3113,1885,'SQL-TEST template 4','8003',2,3,1,'2023-05-12 13:02:32',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3114,1885,'SQL-TEST template 5','8004',2,3,1,'2023-05-12 13:02:33',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3115,1885,'SQL-TEST template 6','8005',2,3,1,'2023-05-12 13:02:33',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3116,1885,'SQL-TEST template 7','8006',2,3,1,'2023-05-12 13:02:33',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3117,1885,'SQL-TEST template 8','8007',2,3,1,'2023-05-12 13:02:33',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3118,1885,'SQL-TEST template 9','8008',2,3,1,'2023-05-12 13:02:34',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(3119,1885,'SQL-TEST template 10','8009',2,3,1,'2023-05-12 13:02:34',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4000,1885,'JS-TEST template 1','7000',2,1,1,'2023-05-12 13:02:29',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4001,1885,'JS-TEST template 2','7001',2,1,1,'2023-05-12 13:02:29',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4002,1885,'JS-TEST template 3','7002',2,1,1,'2023-05-12 13:02:30',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4003,1885,'JS-TEST template 4','7003',2,1,1,'2023-05-12 13:02:30',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4004,1885,'JS-TEST template 5','7004',2,1,1,'2023-05-12 13:02:30',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4005,1885,'JS-TEST template 6','7005',2,1,1,'2023-05-12 13:02:30',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4006,1885,'JS-TEST template 7','7006',2,1,1,'2023-05-12 13:02:31',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4007,1885,'JS-TEST template 8','7007',2,1,1,'2023-05-12 13:02:31',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4008,1885,'JS-TEST template 9','7008',2,1,1,'2023-05-12 13:02:31',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(4009,1885,'JS-TEST template 10','7009',2,1,1,'2023-05-12 13:02:31',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5000,1885,'Html-test template 1','6000',2,2,1,'2023-05-12 13:02:26',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5001,1885,'Html-test template 2','6001',2,2,1,'2023-05-12 13:02:26',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5002,1885,'Html-test template 3','6002',2,2,1,'2023-05-12 13:02:26',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5003,1885,'Html-test template 4','6003',2,2,1,'2023-05-12 13:02:26',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5004,1885,'Html-test template 5','6004',2,2,1,'2023-05-12 13:02:26',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5005,1885,'Html-test template 6','6005',2,2,1,'2023-05-12 13:02:27',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5006,1885,'Html-test template 7','6006',2,2,1,'2023-05-12 13:02:27',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5007,1885,'Html-test template 8','6007',2,2,1,'2023-05-12 13:02:27',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5008,1885,'Html-test template 9','6008',2,2,1,'2023-05-12 13:02:28',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL),(5009,1885,'Html-test template 10','6009',2,2,1,'2023-05-12 13:02:29',NULL,1,'1337',NULL,NULL,NULL,0,0,NULL,NULL,NULL,0,NULL);
/*!40000 ALTER TABLE `listentries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `opponents`
--

DROP TABLE IF EXISTS `opponents`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `opponents` (
  `presenter` int unsigned NOT NULL,
  `lid` int unsigned NOT NULL,
  `opponent1` int unsigned DEFAULT NULL,
  `opponent2` int unsigned DEFAULT NULL,
  PRIMARY KEY (`presenter`,`lid`),
  KEY `lid` (`lid`),
  KEY `opponent1` (`opponent1`),
  KEY `opponent2` (`opponent2`),
  CONSTRAINT `opponents_ibfk_1` FOREIGN KEY (`presenter`) REFERENCES `user` (`uid`),
  CONSTRAINT `opponents_ibfk_2` FOREIGN KEY (`lid`) REFERENCES `listentries` (`lid`),
  CONSTRAINT `opponents_ibfk_3` FOREIGN KEY (`opponent1`) REFERENCES `user` (`uid`),
  CONSTRAINT `opponents_ibfk_4` FOREIGN KEY (`opponent2`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `opponents`
--

LOCK TABLES `opponents` WRITE;
/*!40000 ALTER TABLE `opponents` DISABLE KEYS */;
/*!40000 ALTER TABLE `opponents` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `options` (
  `label` varchar(128) NOT NULL,
  `value` char(1) DEFAULT NULL,
  PRIMARY KEY (`label`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partresult`
--

DROP TABLE IF EXISTS `partresult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `partresult` (
  `cid` int unsigned NOT NULL,
  `uid` int unsigned NOT NULL,
  `partname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `grade` varchar(1) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `hp` decimal(3,1) DEFAULT NULL,
  PRIMARY KEY (`partname`,`cid`,`uid`),
  KEY `uid` (`uid`),
  CONSTRAINT `partresult_ibfk_1` FOREIGN KEY (`partname`, `cid`) REFERENCES `subparts` (`partname`, `cid`),
  CONSTRAINT `partresult_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partresult`
--

LOCK TABLES `partresult` WRITE;
/*!40000 ALTER TABLE `partresult` DISABLE KEYS */;
INSERT INTO `partresult` VALUES (305,200,'salstentamen','5',7.5),(305,201,'salstentamen','4',7.5),(305,202,'salstentamen','4',7.5),(305,203,'salstentamen','4',7.5),(307,200,'salstentamen','5',5.0),(307,201,'salstentamen','5',5.0),(308,200,'salstentamen','5',7.5),(308,201,'salstentamen','u',7.5),(309,200,'salstentamen','5',7.5),(309,201,'salstentamen','u',7.5),(312,200,'salstentamen','5',7.5),(312,201,'salstentamen','3',7.5),(319,201,'salstentamen','u',30.0);
/*!40000 ALTER TABLE `partresult` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `playereditor_playbacks`
--

DROP TABLE IF EXISTS `playereditor_playbacks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `playereditor_playbacks` (
  `id` varchar(32) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` smallint NOT NULL,
  `path` varchar(256) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`,`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `playereditor_playbacks`
--

LOCK TABLES `playereditor_playbacks` WRITE;
/*!40000 ALTER TABLE `playereditor_playbacks` DISABLE KEYS */;
/*!40000 ALTER TABLE `playereditor_playbacks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `programcourse`
--

DROP TABLE IF EXISTS `programcourse`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `programcourse` (
  `class` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cid` int unsigned NOT NULL,
  `period` int DEFAULT NULL,
  `term` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cid`,`class`),
  KEY `class` (`class`),
  CONSTRAINT `programcourse_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`),
  CONSTRAINT `programcourse_ibfk_2` FOREIGN KEY (`class`) REFERENCES `class` (`class`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `programcourse`
--

LOCK TABLES `programcourse` WRITE;
/*!40000 ALTER TABLE `programcourse` DISABLE KEYS */;
INSERT INTO `programcourse` VALUES ('DVSUG13h',4,NULL,NULL),('WEBUG13h',4,NULL,NULL),('DVSUG13h',305,NULL,NULL),('WEBUG13h',305,NULL,NULL),('DVSUG13h',307,NULL,NULL),('DVSUG13h',308,NULL,NULL),('DVSUG13h',309,NULL,NULL),('DVSUG13h',312,NULL,NULL),('DVSUG13h',319,NULL,NULL),('WEBUG13h',324,NULL,NULL);
/*!40000 ALTER TABLE `programcourse` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `quiz`
--

DROP TABLE IF EXISTS `quiz`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `quiz` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cid` int unsigned NOT NULL,
  `autograde` tinyint(1) NOT NULL DEFAULT '0',
  `gradesystem` tinyint(1) NOT NULL DEFAULT '2',
  `qname` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `quizFile` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'default',
  `qrelease` datetime DEFAULT NULL,
  `deadline` datetime DEFAULT NULL,
  `relativedeadline` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creator` int DEFAULT NULL,
  `vers` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `qstart` date DEFAULT NULL,
  `jsondeadline` varchar(2048) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `cid` (`cid`),
  CONSTRAINT `quiz_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `quiz`
--

LOCK TABLES `quiz` WRITE;
/*!40000 ALTER TABLE `quiz` DISABLE KEYS */;
INSERT INTO `quiz` VALUES (1,2,1,2,'Bitdugga1','dugga1','2015-01-01 00:00:00','2015-01-30 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(2,2,1,2,'Bitdugga2','dugga1','2015-01-08 00:00:00','2015-01-25 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(3,2,1,2,'colordugga1','dugga2','2015-01-01 00:00:00','2015-01-20 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(4,2,1,2,'colordugga2','dugga2','2015-01-08 00:00:00','2015-01-18 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(5,2,1,2,'linjedugga1','dugga3','2015-01-01 00:00:00','2015-02-10 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(6,2,1,2,'linjedugga2','dugga3','2015-01-01 00:00:00','2015-02-15 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(7,2,1,2,'dugga1','dugga4','2015-01-01 00:00:00','2015-02-05 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(8,2,1,2,'dugga2','dugga4','2015-02-01 00:00:00','2015-02-20 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(9,2,1,2,'Quiz','kryss','2015-01-01 00:00:00','2015-02-19 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(10,2,1,2,'Rapport','generic_dugga_file_receive','2015-01-01 00:00:00','2015-02-19 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(11,2,1,2,'HTML CSS Testdugga','html_css_dugga','2015-01-01 00:00:00','2015-02-19 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(12,2,1,2,'Clipping masking testdugga','clipping_masking_dugga','2015-01-01 00:00:00','2015-02-19 15:30:00',NULL,'2023-05-12 13:01:48',2,'97732',NULL,NULL,0),(13,1894,1,2,'3D Dugga','3d-dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(14,1894,1,2,'BIT Dugga','bit-dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(15,1894,1,2,'Boxmodell','boxmodell','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(16,1894,1,2,'Clipping Maskin Dugga','clipping_masking_dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(17,1894,1,2,'Color Dugga','color-dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(18,1894,1,2,'Contribution','contribution','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(19,1894,1,2,'Curve Dugga','curve-dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(20,1894,1,2,'Daily Minutes','daily-minutes','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(21,1894,1,2,'Diagram Dugga','diagram_dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(22,1894,1,2,'Dugga 1','dugga1','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(23,1894,1,2,'Dugga 2','dugga2','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(24,1894,1,2,'Dugga 3','dugga3','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(25,1894,1,2,'Dugga 4','dugga4','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:19',1894,'52432',NULL,NULL,0),(26,1894,1,2,'Dugga 5','dugga5','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(27,1894,1,2,'Dugga 6','dugga6','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(28,1894,1,2,'Feedback Dugga','feedback_dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(29,1894,1,2,'Generic Dugga File Receive','generic_dugga_file_receive','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(30,1894,1,2,'Group Assignment','group-assignment','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(31,1894,1,2,'HTML CSS Dugga','html_css_dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(32,1894,1,2,'HTML CSS Dugga Light','html_css_dugga_light','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(33,1894,1,2,'Kryss','kryss','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(34,1894,1,2,'Placeholder Dugga','placeholder_dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(35,1894,1,2,'Shapes Dugga','shapes-dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(36,1894,1,2,'Transforms Dugga','transforms-dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(37,1894,1,2,'XMLAPI Report','XMLAPI_report1','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(38,1894,1,2,'Seminar Dugga','seminar_dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:20',1894,'52432',NULL,NULL,0),(39,1894,1,2,'SVG Dugga','svg-dugga','2020-05-01 00:00:00','2020-06-30 00:00:00',NULL,'2023-05-12 13:02:21',1894,'52432',NULL,NULL,0);
/*!40000 ALTER TABLE `quiz` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sequence`
--

DROP TABLE IF EXISTS `sequence`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sequence` (
  `seqid` int unsigned NOT NULL,
  `cid` int unsigned NOT NULL,
  `exampleseq` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`cid`,`seqid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sequence`
--

LOCK TABLES `sequence` WRITE;
/*!40000 ALTER TABLE `sequence` DISABLE KEYS */;
/*!40000 ALTER TABLE `sequence` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `sid` int NOT NULL AUTO_INCREMENT,
  `motd` varchar(4096) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `readonly` tinyint DEFAULT '0',
  PRIMARY KEY (`sid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `shregister`
--

DROP TABLE IF EXISTS `shregister`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `shregister` (
  `cparam` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `aparam` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cid` int unsigned NOT NULL,
  `lid` int unsigned DEFAULT NULL,
  PRIMARY KEY (`cparam`,`aparam`),
  KEY `cid` (`cid`),
  KEY `lid` (`lid`),
  CONSTRAINT `shregister_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `shregister_ibfk_2` FOREIGN KEY (`lid`) REFERENCES `listentries` (`lid`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `shregister`
--

LOCK TABLES `shregister` WRITE;
/*!40000 ALTER TABLE `shregister` DISABLE KEYS */;
/*!40000 ALTER TABLE `shregister` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `studentresultCourse`
--

DROP TABLE IF EXISTS `studentresultCourse`;
/*!50001 DROP VIEW IF EXISTS `studentresultCourse`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `studentresultCourse` AS SELECT 
 1 AS `username`,
 1 AS `cid`,
 1 AS `hp`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `studentresultat`
--

DROP TABLE IF EXISTS `studentresultat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `studentresultat` (
  `sid` mediumint NOT NULL AUTO_INCREMENT,
  `pnr` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `anmkod` varchar(6) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kurskod` varchar(6) COLLATE utf8mb4_unicode_ci NOT NULL,
  `termin` varchar(5) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `resultat` decimal(3,1) DEFAULT NULL,
  `avbrott` date DEFAULT NULL,
  PRIMARY KEY (`sid`),
  KEY `anmkod` (`anmkod`),
  KEY `pnr` (`pnr`),
  KEY `kurskod` (`kurskod`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `studentresultat`
--

LOCK TABLES `studentresultat` WRITE;
/*!40000 ALTER TABLE `studentresultat` DISABLE KEYS */;
/*!40000 ALTER TABLE `studentresultat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission`
--

DROP TABLE IF EXISTS `submission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission` (
  `subid` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `uid` int DEFAULT NULL,
  `cid` int DEFAULT NULL,
  `vers` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `did` int DEFAULT NULL,
  `seq` int DEFAULT NULL,
  `fieldnme` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filepath` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `filename` varchar(128) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `extension` varchar(32) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `mime` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `kind` int DEFAULT NULL,
  `segment` int DEFAULT NULL,
  `hash` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updtime` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`subid`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission`
--

LOCK TABLES `submission` WRITE;
/*!40000 ALTER TABLE `submission` DISABLE KEYS */;
INSERT INTO `submission` VALUES (1,229,2,'97732',10,1,'InlPHPDocument','submissions/2/97732/10/Olsson_Nils_a99nilol/','Utbildningsplan_WEBUG','pdf','application/pdf',1,2016,'Fe9FhdQO','2018-04-09 14:29:37'),(2,229,2,'97732',10,1,'InlPHPZip','submissions/2/97732/10/Olsson_Nils_a99nilol/','coursesyspw.php4','zip','application/zip',1,2016,'lQyi1a5O','2018-04-09 14:29:37'),(3,217,2,'97732',10,1,'InlPHPDocument','submissions/2/97732/10/Johansson_Erik_a99erijo/','Kursplan_IT351G','pdf','application/pdf',1,2016,'BRXoRatO','2018-04-09 14:29:37'),(4,217,2,'97732',10,1,'InlPHPZip','submissions/2/97732/10/Johansson_Erik_a99erijo/','coursesyspw.php4','zip','application/zip',1,2016,'rxJ6FK9O','2018-04-09 14:29:37'),(5,217,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2002,'hpMcoe4O','2015-01-15 09:12:51'),(6,217,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2005,'atzKk6OO','2015-01-15 09:12:51'),(7,218,2,'97732',10,1,'InlPHPDocument','submissions/2/97732/10/Andersson_Anna_a99annan/','Utbildningsplan_WEBUG','pdf','application/pdf',1,2016,'sBzZBT3O','2018-04-09 14:29:37'),(8,218,2,'97732',10,1,'InlPHPZip','submissions/2/97732/10/Andersson_Anna_a99annan/','coursesyspw.php4','zip','application/zip',1,2016,'ec3HLlhO','2018-04-09 14:29:37'),(9,218,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2005,'nkd5QfxO','2018-05-17 09:12:51'),(10,218,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2006,'GCyDuFCO','2018-05-17 09:12:51'),(11,219,2,'97732',10,1,'InlPHPDocument','submissions/2/97732/10/Andersson_Lars_a99laran/','Kursplan_IT351G','pdf','application/pdf',1,2016,'pMhyenPO','2018-04-09 14:29:37'),(12,219,2,'97732',10,1,'InlPHPZip','submissions/2/97732/10/Andersson_Lars_a99laran/','coursesyspw.php4','zip','application/zip',1,2016,'ZojCqtVO','2018-04-09 14:29:37'),(13,219,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2002,'J00iyGCO','2018-05-17 09:12:51'),(14,219,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2003,'nXP9Lv0O','2018-05-17 09:12:51'),(15,219,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2008,'yFF60zpO','2018-05-17 09:50:56'),(16,219,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2009,'nJ2veYUO','2018-05-17 09:50:56'),(17,216,2,'97732',10,1,'InlPHPDocument','submissions/2/97732/10/Johansson_Maria_a99marjo/','Utbildningsplan_WEBUG','pdf','application/pdf',1,2016,'I1mZIB9O','2018-04-09 14:29:37'),(18,216,2,'97732',10,1,'InlPHPZip','submissions/2/97732/10/Johansson_Maria_a99marjo/','coursesyspw.php4','zip','application/zip',1,2016,'EjfSUFBO','2018-04-09 14:29:37'),(19,216,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2002,'0ElHtTdO','2015-01-15 09:12:51'),(20,216,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2003,'ntMBqQyO','2015-01-15 09:12:51'),(21,216,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2008,'rWyFyExO','2015-01-15 09:12:51'),(22,216,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2009,'dF1bRp2O','2015-01-15 09:12:51'),(23,216,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2011,'E5IOMAgO','2015-01-15 09:12:51'),(24,216,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2012,'T08H2VIO','2015-01-15 09:12:51'),(25,220,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2005,'sLw86MvO','2018-05-17 09:12:51'),(26,220,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2006,'XENOqfOO','2018-05-17 09:12:51'),(27,220,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2011,'mH8iAcQO','2018-05-15 09:50:56'),(28,220,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2012,'pPBeRQLO','2018-05-15 09:50:56'),(29,220,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2014,'htfnFixO','2018-05-17 10:23:28'),(30,222,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2002,'mMGFaj0O','2018-05-17 09:12:51'),(31,222,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2003,'270ISdSO','2018-05-17 09:12:51'),(32,222,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2005,'3mscbZmO','2015-01-15 09:12:51'),(33,222,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2036,'KBx31TDO','2018-05-17 10:50:42'),(34,223,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2005,'CJzptbhO','2014-05-17 09:12:51'),(35,223,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2006,'XKZLPVaO','2014-05-17 09:12:51'),(36,224,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2002,'Xzq5OgLO','2015-01-15 09:12:51'),(37,224,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2003,'j4bChGuO','2015-01-15 09:12:51'),(38,224,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2008,'7jvLKpOO','2015-01-15 09:12:51'),(39,224,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2009,'rh1YbOoO','2015-01-15 09:12:51'),(40,224,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2011,'uzu5QB0O','2015-01-15 09:12:51'),(41,224,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2012,'D14k9yrO','2015-01-15 09:12:51'),(42,225,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2002,'s8rJs2BO','2015-01-15 09:12:51'),(43,225,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2003,'PteP8R1O','2015-01-15 09:12:51'),(44,225,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2008,'vNzqnyPO','2015-01-15 09:12:51'),(45,225,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2009,'YGv4VirO','2015-01-15 09:12:51'),(46,225,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2011,'IYSCwHMO','2015-01-15 09:12:51'),(47,225,2,'97732',1,1,NULL,NULL,NULL,NULL,NULL,1,2012,'gyFUqINO','2015-01-15 09:12:51');
/*!40000 ALTER TABLE `submission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subparts`
--

DROP TABLE IF EXISTS `subparts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subparts` (
  `partname` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cid` int unsigned NOT NULL,
  `parthp` decimal(3,1) DEFAULT NULL,
  `difgrade` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`partname`,`cid`),
  KEY `cid` (`cid`),
  CONSTRAINT `subparts_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subparts`
--

LOCK TABLES `subparts` WRITE;
/*!40000 ALTER TABLE `subparts` DISABLE KEYS */;
INSERT INTO `subparts` VALUES ('salstentamen',305,7.5,'u-3-4-5'),('salstentamen',307,5.0,'u-3-4-5'),('salstentamen',308,7.5,'u-3-4-5'),('salstentamen',309,7.5,'u-3-4-5'),('salstentamen',312,5.0,'u-3-4-5'),('salstentamen',319,30.0,'u-3-4-5');
/*!40000 ALTER TABLE `subparts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template`
--

DROP TABLE IF EXISTS `template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `template` (
  `templateid` int unsigned NOT NULL,
  `stylesheet` varchar(39) COLLATE utf8mb4_unicode_ci NOT NULL,
  `numbox` int NOT NULL,
  PRIMARY KEY (`templateid`,`stylesheet`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template`
--

LOCK TABLES `template` WRITE;
/*!40000 ALTER TABLE `template` DISABLE KEYS */;
INSERT INTO `template` VALUES (0,'template0.css',0),(1,'template1.css',2),(2,'template2.css',2),(3,'template3.css',3),(4,'template4.css',3),(5,'template5.css',4),(6,'template6.css',4),(7,'template7.css',4),(8,'template8.css',3),(9,'template9.css',5),(10,'template10.css',1);
/*!40000 ALTER TABLE `template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `timesheet`
--

DROP TABLE IF EXISTS `timesheet`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timesheet` (
  `tid` int unsigned NOT NULL AUTO_INCREMENT,
  `uid` int unsigned NOT NULL,
  `cid` int unsigned NOT NULL,
  `vers` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `did` int NOT NULL,
  `moment` int unsigned NOT NULL,
  `day` date NOT NULL,
  `week` tinyint DEFAULT NULL,
  `type` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `reference` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`tid`),
  KEY `uid` (`uid`),
  KEY `cid` (`cid`),
  KEY `did` (`did`),
  KEY `moment` (`moment`),
  CONSTRAINT `timesheet_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `timesheet_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`),
  CONSTRAINT `timesheet_ibfk_3` FOREIGN KEY (`did`) REFERENCES `quiz` (`id`),
  CONSTRAINT `timesheet_ibfk_4` FOREIGN KEY (`moment`) REFERENCES `listentries` (`lid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timesheet`
--

LOCK TABLES `timesheet` WRITE;
/*!40000 ALTER TABLE `timesheet` DISABLE KEYS */;
/*!40000 ALTER TABLE `timesheet` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `uid` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lastname` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ssn` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(225) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastupdated` timestamp NULL DEFAULT NULL,
  `addedtime` datetime DEFAULT NULL,
  `lastvisit` datetime DEFAULT NULL,
  `newpassword` tinyint(1) DEFAULT NULL,
  `creator` int unsigned DEFAULT NULL,
  `superuser` tinyint(1) DEFAULT NULL,
  `email` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `class` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `totalHp` decimal(4,1) DEFAULT NULL,
  `securityquestion` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `securityquestionanswer` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `requestedpasswordchange` tinyint unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `ssn` (`ssn`)
) ENGINE=InnoDB AUTO_INCREMENT=9091 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'Grimling','Johan','Grimling','810101-5567','$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m',NULL,NULL,NULL,0,1,1,NULL,NULL,NULL,NULL,NULL,0),(2,'Toddler','Toddler','Kong','444444-5447','$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q',NULL,NULL,NULL,0,1,1,NULL,NULL,NULL,NULL,NULL,0),(3,'Tester',NULL,NULL,'111111-1111','$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q',NULL,NULL,NULL,1,1,NULL,NULL,NULL,NULL,NULL,NULL,0),(4,'teacher1','Emma','Lindberg','19770101-1231','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'teacher1@his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(5,'teacher2','Lena','Carlsson','19770101-1232','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'teacher2@his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(6,'teacher3','Bo','Lindberg','19770101-1233','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'teacher3@his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(7,'teacher4','Daniel','Magnusson','19770101-1234','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'teacher4@his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(20,'mofre','Morgan','Freeman','19370601-3134','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,0,0,'mofre@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(21,'keree','Keanu','Reeves','19640902-1233','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,0,0,'keree@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(22,'mestr','Meryl','Streep','19490622-1991','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,0,0,'mestr@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(23,'alvik','Alicia','Vikander','19881003-4591','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,0,0,'alvik@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(24,'ryrey','Ryan','Reynolds','19761023-3400','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,0,0,'ryrey@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(100,'stei','Joey','Stenhus','340101-0101','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,0,1,'joey.s@his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(101,'brom','Martin','Brobygge','340101-1232','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,0,1,'martin.b@his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(200,'a13andka','Anders','Karlsson','910202-3434','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13andka@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(201,'a13sveth','Sven','Torbjörnsson','890502-2344','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13sveth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(202,'a13saeth','Sven','Torbjörnsson','890502-2445','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13saeth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(203,'a13sbeth','Sten','Torbjörnsson','890502-2674','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13sbeth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(204,'c13sneth','Syen','Torbjörnsson','890502-2944','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13sneth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(205,'b13sceth','Suen','Torbjörnsson','890502-2389','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13sceth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(206,'a13steth','Rddn','Torbjörnsson','890702-1389','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13steth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(207,'b13syeth','Suen','Torbjörnsson','790202-2389','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13syeth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(208,'a13eyeth','Eyde','Torbjörnsson','790222-2489','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13syeth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(209,'a13eydth','tuen','Torbjörnsson','730202-2379','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13syeth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(210,'c13dddth','tuen','Torbjörnsson','781202-2389','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13syeth@student.his.se','DVSUG13h',NULL,NULL,NULL,0),(211,'c13aaath','Tuen','Torbjörnsson','781902-3381','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13syeth@student.his.se','WEBUG13h',NULL,NULL,NULL,0),(212,'c13timan','Tim','Andersson','901202-2399','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'c13timan@student.his.se','WEBUG14h',NULL,NULL,NULL,0),(213,'a13siman','Simon','Andersson','931202-2489','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13siman@student.his.se','WEBUG14h',NULL,NULL,NULL,0),(214,'a13henan','Henrik','Andersson','891202-3489','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13henan@student.his.se','WEBUG14h',NULL,NULL,NULL,0),(215,'a13jacan','Jacob','Andersson Svensson','751202-2389','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a13jacan@student.his.se','WEBUG14h',NULL,NULL,NULL,0),(216,'a99marjo','Maria','Johansson','19990101-0001','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99marjo@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(217,'a99erijo','Erik','Johansson','19990101-0002','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99erijo@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(218,'a99annan','Anna','Andersson','19990101-0003','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99annan@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(219,'a99laran','Lars','Andersson','19990101-0004','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99laran@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(220,'a99karka','Karl','Karlsson','19990101-0005','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99karka@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(221,'a99marka','Margareta','Karlsson','19990101-0006','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99marka@student.his.se','WEBUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(222,'a99elini','Elisabet','Nilsson','19990101-0007','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99elini@student.his.se','WEBUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(223,'a99andni','Anders','Nilsson','19990101-0008','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99andni@student.his.se','WEBUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(224,'a99evaer','Eva','Eriksson','19990101-0009','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99evaer@student.his.se','WEBUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(225,'a99joher','Johan','Eriksson','19990101-0010','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99joher@student.his.se','WEBUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(226,'a99krila','Kristina','Larsson','19990101-0011','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99krila@student.his.se','WEBUG14h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(227,'a99perla','Per','Larsson','19990101-0012','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99perla@student.his.se','WEBUG14h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(228,'a99birol','Birgitta','Olsson','19990101-0013','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99birol@student.his.se','WEBUG14h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(229,'a99nilol','Nils','Olsson','19990101-0014','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99nilol@student.his.se','WEBUG14h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(230,'a99karpe','Karin','Persson','19990101-0015','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99karpe@student.his.se','WEBUG14h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(231,'a99oloja','Olof','Jansson','19990101-0016','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99oloja@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(232,'a99linja','Linnéa','Jansson','19990101-0017','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99linja@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(233,'a99petha','Peter','Hansson','19990101-0018','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99petha@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(234,'a99gunbe','Gunnar','Bengtsson','19990101-0019','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99gunbe@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(235,'a99kerbe','Kerstin','Bengtsson','19990101-0020','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,NULL,NULL,'a99kerbe@student.his.se','DVSUG13h',NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(1010,'c92cober','Conny','Berg Czarnecki','19920404-4522','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'c92cober@student.his.se',NULL,NULL,'what is Toddlers Password?','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(1111,'b94brbro','Brick','Brock','19941022-2925','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'b94brbro@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(1212,'c94chcha','Chevy','Chase','19431008-6935','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'c43chcha@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(1313,'h94haste','Hanna','Sten','19890708-2535','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'h89haste@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(1414,'l94lewal','Leif','Wallberg','19890813-2435','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'l89lewal@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(1515,'j94jojoh','Johan','Johansson','19870427-6635','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'j87jojoh@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(1616,'a94anjoh','Anita','Johansson','19830617-6654','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'a83anjoh@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(1717,'b94bejoh','Berit','Johansson','19900412-2554','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'b90bejoh@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(2020,'a87antal','Ann-Marie','Tallström','19871116-7384','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'a87antal@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(3030,'a72ashal','Åsa','Hällsjö','19721224-5582','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'a72ashal@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(4040,'a92albri','Alex','Bridgeman','19920404-0404','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'a92albri@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(5050,'e93evkos','Eva','Koskinen','19930505-0505','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'e93evkos@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(6060,'s94sveri','Sven','Eriksson','19940606-0606','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'s94sveri@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(7070,'s92sveri','Sven','Eriksson','19920707-0707','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'s92sveri@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(8080,'k90kakli','Karl','Klint','19900808-0808','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'k90kakli@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0),(9090,'s91stcar','Stina','Carlsson','19910909-0909','$2y$10$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2',NULL,NULL,NULL,NULL,1,NULL,'s91stcar@student.his.se',NULL,NULL,'what is Toddlers Password? ','$2y$10$haOR5Mw2Ay1onfxODcDp.OcSeA1yPUH6C56qlzuvzKNSucGtbTA2i',0);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userAnswer`
--

DROP TABLE IF EXISTS `userAnswer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userAnswer` (
  `aid` int NOT NULL AUTO_INCREMENT,
  `cid` int unsigned NOT NULL,
  `quiz` int DEFAULT NULL,
  `variant` int DEFAULT NULL,
  `moment` int unsigned NOT NULL,
  `grade` tinyint DEFAULT NULL,
  `uid` int DEFAULT NULL,
  `useranswer` text COLLATE utf8mb4_unicode_ci,
  `submitted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `marked` timestamp NULL DEFAULT NULL,
  `vers` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `creator` int DEFAULT NULL,
  `score` int DEFAULT NULL,
  `timeUsed` int DEFAULT NULL,
  `totalTimeUsed` int DEFAULT '0',
  `stepsUsed` int DEFAULT NULL,
  `totalStepsUsed` int DEFAULT '0',
  `feedback` text COLLATE utf8mb4_unicode_ci,
  `timesGraded` int NOT NULL DEFAULT '0',
  `gradeExpire` timestamp NULL DEFAULT NULL,
  `gradeLastExported` timestamp NULL DEFAULT NULL,
  `seen_status` tinyint(1) NOT NULL DEFAULT '0',
  `hash` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `timesSubmitted` int DEFAULT NULL,
  `timesAccessed` int DEFAULT NULL,
  `last_Time_techer_visited` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`aid`),
  KEY `cid` (`cid`),
  KEY `quiz` (`quiz`),
  KEY `moment` (`moment`),
  KEY `variant` (`variant`),
  CONSTRAINT `userAnswer_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`),
  CONSTRAINT `userAnswer_ibfk_2` FOREIGN KEY (`quiz`) REFERENCES `quiz` (`id`),
  CONSTRAINT `userAnswer_ibfk_3` FOREIGN KEY (`moment`) REFERENCES `listentries` (`lid`),
  CONSTRAINT `userAnswer_ibfk_4` FOREIGN KEY (`variant`) REFERENCES `variant` (`vid`)
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userAnswer`
--

LOCK TABLES `userAnswer` WRITE;
/*!40000 ALTER TABLE `userAnswer` DISABLE KEYS */;
INSERT INTO `userAnswer` VALUES (1,2,5,13,2008,NULL,NULL,NULL,'2015-05-20 10:49:22',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'AcIj-Ld6','OjOEh8R',1,1,NULL),(2,2,5,13,2008,NULL,NULL,NULL,'2015-05-20 11:18:42',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'j-2b6WJQ','8uOlUgu',2,2,NULL),(3,2,9,19,2014,NULL,NULL,NULL,'2015-05-21 14:17:02',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'PWOXfmEw','Ns0vg96',3,3,NULL),(4,2,7,15,2011,NULL,NULL,NULL,'2015-05-20 14:40:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'wI8e3Lbn','n6D02pM',4,4,NULL),(5,2,10,21,2016,NULL,NULL,NULL,'2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'Ac3YM_fc','zIN6IVv',5,5,NULL),(6,2,10,21,2016,NULL,NULL,'2 97732 3006 Submitted,T 0 1440 900 1440 738','2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'3X9PW84D','lGR2hLN',6,6,NULL),(7,2,10,21,2016,NULL,NULL,NULL,'2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'PMQ_1lmO','8OEUgjm',2,0,NULL),(8,2,10,21,2016,NULL,NULL,'2 97732 3006 Submitted,T 0 1440 900 1440 738','2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'rHGRejwb','H1mPcH7',3,1,NULL),(9,2,10,21,2016,NULL,NULL,NULL,'2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'1iGNG0ts','EE8Z1C6',3,5,NULL),(10,2,10,21,2016,NULL,NULL,'2 97732 3006 Submitted,T 0 1440 900 1440 738','2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'fk6O8q8O','5Rau0Np',3,0,NULL),(11,2,10,21,2016,NULL,NULL,NULL,'2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'oXNRK2bE','hQI907E',3,6,NULL),(12,2,10,21,2016,NULL,NULL,'2 97732 3006 Submitted,T 0 1440 900 1440 738','2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'sTtviHYA','vAOLzOY',2,0,NULL),(13,2,10,21,2016,NULL,NULL,NULL,'2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'U2m95fJX','6j6JmEc',7,0,NULL),(14,2,10,21,2016,NULL,NULL,'2 97732 3006 Submitted,T 0 1440 900 1440 738','2015-05-20 14:50:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'i4DbRocC','SamXJ4C',3,6,NULL),(15,2,1,3,2002,NULL,NULL,NULL,'2015-01-15 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'E_X-FUTy','yMp0cdW',3,6,NULL),(16,2,1,3,2002,NULL,NULL,'2 97732 2002 00000000 0 0 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,1,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'HUQ0mMrf','iRIlrbY',5,0,NULL),(17,2,3,7,2005,NULL,NULL,NULL,'2018-05-17 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'qayEjxM','ne6FYtR',3,11,NULL),(18,2,3,7,2005,NULL,NULL,'2 97732 2005  0 1 4 0 0 0 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,6,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'5wUDgDKA','NKjeM6u',3,2,NULL),(19,2,3,7,2005,NULL,NULL,NULL,'2018-05-17 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'r9aPgMJC','z3MLEli',3,4,NULL),(20,2,3,7,2005,NULL,NULL,'2 97732 2005  0 1 4 0 0 0 1366 768 1349 662','2018-05-17 09:12:51',NULL,'97732',NULL,6,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'Bg6A9ntm','hJWG9ga',4,2,NULL),(21,2,4,10,2006,NULL,NULL,'2 97732 2006  0 4 0 4 0 0 1366 768 1349 662','2018-05-17 09:12:51',NULL,'97732',NULL,4,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'mOr-HtS7','jQ2mBWw',5,2,NULL),(22,2,1,3,2002,NULL,NULL,NULL,'2018-05-17 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'_P3gX0H8','0Yt8yk6',5,6,NULL),(23,2,1,3,2002,1,NULL,'2 97732 2002 00000000 0 0 1366 768 1349 662','2018-05-17 09:12:51','2018-05-18 09:12:51','97732',NULL,1,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'jaajJU2c','XWnaSrc',23,2,NULL),(24,2,1,3,2002,2,NULL,'2 97732 2002 01101000 4 0 1366 768 1349 662','2018-05-17 09:12:51','2018-05-18 09:12:51','97732',NULL,7,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'k03BbkMW','n0nYEO8',30,20,NULL),(25,2,1,3,2002,NULL,NULL,NULL,'2018-05-17 09:50:56',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'LZyCZVyl','daasHge',2,3,NULL),(26,2,1,3,2002,NULL,NULL,'2 97732 2002 01001011 0 0 516 1366 768 1349 662','2018-05-17 09:50:56',NULL,'97732',NULL,0,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'i5Gx1poI','pQNEOgd',3,5,NULL),(27,2,1,3,2002,NULL,NULL,'2 97732 2002 01110000 0 0 951 1366 768 1349 662','2018-05-17 09:50:56',NULL,'97732',NULL,3,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'50iDVIzI','T9eeM0Z',30,0,NULL),(28,2,1,3,2002,2,NULL,NULL,'2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,NULL,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'ud4CDi8S','PEgssrJ',3,53,NULL),(29,2,1,3,2002,2,NULL,'2 97732 2002 00000000 0 0 1366 768 1349 662','2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,1,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'aPD7uul1','dxDsL14',35,2,NULL),(30,2,1,3,2002,2,NULL,'2 97732 2002 01101000 4 0 1366 768 1349 662','2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,7,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'BiO9n3fd','nthuvyC',3,7,NULL),(31,2,1,3,2002,NULL,NULL,NULL,'2015-01-15 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'WExgDG4r','IvcJ5So',3,23,NULL),(32,2,1,3,2002,1,NULL,'2 97732 2002 01110010 7 0 1366 768 1349 662','2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,0,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'_EPw4-aR','AiDT325',6,3,NULL),(33,2,1,3,2002,NULL,NULL,'2 97732 2002 01111000 7 4 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,3,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'rt-5amuF','2NXnvnr',2,4,NULL),(34,2,1,3,2002,NULL,NULL,NULL,'2015-01-15 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'yk7bSIHl','g1NB5nI',3,5,NULL),(35,2,1,3,2002,NULL,NULL,'2 97732 2002 01010000 5 0 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,0,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'XkVYKx6g','pL9GJbG',4,5,NULL),(36,2,1,3,2002,NULL,NULL,'2 97732 2002 00000110 0 6 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,1,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'cP40SS4o','gW0We3T',4,7,NULL),(37,2,3,7,2005,NULL,NULL,NULL,'2018-05-17 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'zrnYYQE-','DOKh69W',3,3,NULL),(38,2,3,7,2005,NULL,NULL,'2 97732 2005  0 1 4 0 0 0 1366 768 1349 662','2018-05-17 09:12:51',NULL,'97732',NULL,6,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'FSvPeWIa','xDZqgWE',5,5,NULL),(39,2,3,7,2005,NULL,NULL,'2 97732 2005  0 4 0 4 0 0 1366 768 1349 662','2018-05-17 09:12:51',NULL,'97732',NULL,4,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'WWmSAvwJ','HQJtckt',3,6,NULL),(40,2,1,3,2002,NULL,NULL,NULL,'2018-05-15 09:50:56',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'GsRsvENM','6LXo0ow',6,6,NULL),(41,2,1,3,2002,NULL,NULL,'2 97732 2002 00110010 3 2 257 1366 768 1349 662','2018-05-15 09:50:56',NULL,'97732',NULL,0,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'rlzxve-7','ig3HpM0',3,3,NULL),(42,2,1,3,2002,NULL,NULL,'2 97732 2002 11110000 8 0 151 1366 768 1349 662','2018-05-15 09:50:56',NULL,'97732',NULL,1,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'Ioi7DzXO','RLXmgiC',6,7,NULL),(43,2,9,17,2014,NULL,NULL,NULL,'2018-05-17 10:23:28',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'veoWGKt3','6x5xIUB',9,7,NULL),(44,2,9,17,2014,NULL,NULL,'2 97732 2014 17 C,','2018-05-17 10:23:28',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'ZIMTvMH-','H9Fv5xI',3,10,NULL),(45,2,1,3,2002,NULL,NULL,NULL,'2018-05-17 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'85UX3vwC','4x90nEw',3,3,NULL),(46,2,1,3,2002,NULL,NULL,'2 97732 2002 00000000 0 0 1366 768 1349 662','2018-05-17 09:12:51',NULL,'97732',NULL,1,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'ZGUZ0FRm','yTHrRLE',3,23,NULL),(47,2,1,3,2002,NULL,NULL,'2 97732 2002 01101000 4 0 1366 768 1349 662','2018-05-17 09:12:51',NULL,'97732',NULL,7,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'rJeELjy7','lSBhIj1',30,63,NULL),(48,2,3,7,2005,NULL,NULL,NULL,'2015-01-15 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'E4BD7Itw','dixWjrp',3,63,NULL),(49,2,3,7,2005,NULL,NULL,'2 97732 2005  0 1 4 0 0 0 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,6,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'fRuKjKNA','EK05cvo',30,30,NULL),(50,2,12,23,2036,NULL,NULL,NULL,'2018-05-17 10:50:42',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'tzcWn6fo','r73oWMU',20,21,NULL),(51,2,12,23,2036,NULL,NULL,'2 97732 2036 ,White,T 0 1366 768 1349 662','2018-05-17 10:50:42',NULL,'97732',NULL,0,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'GafQtYbr','hfSytjU',62,62,NULL),(52,2,3,7,2005,1,NULL,NULL,'2014-05-17 09:12:51','2014-05-18 09:12:51','97732',NULL,NULL,NULL,0,NULL,0,NULL,2,NULL,NULL,0,'3yYWGueu','H1gnqan',32,32,NULL),(53,2,3,8,2005,1,NULL,'2 97732 2005  0 1 4 0 0 0 1366 768 1349 662','2014-05-17 09:12:51','2014-05-18 09:12:51','97732',NULL,6,NULL,0,NULL,0,NULL,2,NULL,NULL,0,'C4I7zCY9','ugMkvfM',64,53,NULL),(54,2,3,9,2005,2,NULL,'2 97732 2005  0 4 0 4 0 0 1366 768 1349 662','2014-05-17 09:12:51','2014-05-18 09:12:51','97732',NULL,4,NULL,0,NULL,0,NULL,2,NULL,NULL,0,'_CzUVPnP','e8NoaKG',50,50,NULL),(55,2,1,3,2002,1,NULL,NULL,'2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,NULL,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'zZDU3EZ4','G0nSWSS',32,52,NULL),(56,2,1,3,2002,1,NULL,'2 97732 2002 00000000 0 0 1366 768 1349 662','2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,1,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'8xj6wlDP','ZA8jnsT',5,57,NULL),(57,2,1,3,2002,2,NULL,'2 97732 2003 01101000 4 0 1366 768 1349 662','2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,7,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'5Q_y-XpE','vqqrtO0',73,62,NULL),(58,2,3,7,2005,NULL,NULL,NULL,'2014-05-17 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'MVoMjyzz','HhBQcE4',90,82,NULL),(59,2,3,7,2005,NULL,NULL,'2 97732 2005  0 1 4 0 0 0 1366 768 1349 662','2014-05-17 09:12:51',NULL,'97732',NULL,6,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'b7WkhPfS','v08NoPL',44,32,NULL),(60,2,3,7,2005,NULL,NULL,'2 97732 2005  0 4 0 4 0 0 1366 768 1349 662','2014-05-17 09:12:51',NULL,'97732',NULL,4,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'1lt9CRZg','ttGtOEY',30,64,NULL),(61,2,1,3,2002,NULL,NULL,NULL,'2015-01-15 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'i9LvZiTG','UwlhXmw',3,21,NULL),(62,2,1,3,2002,NULL,NULL,'2 97732 2002 01100101 6 5 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,0,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'2gUahmAG','XcH2100',3,2,NULL),(63,2,1,3,2002,NULL,NULL,'2 97732 2002 10101010 A A 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,3,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'EIGdu6tF','pU4baCA',64,64,NULL),(64,2,1,3,2002,NULL,NULL,NULL,'2015-01-15 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'R3g8Vb9O','h7DWBMV',2,7,NULL),(65,2,1,3,2002,2,NULL,'2 97732 2002 01001000 4 8 1366 768 1349 662','2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,0,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'9F1f9crH','yLZk2PH',1,7,NULL),(66,2,1,3,2002,NULL,NULL,'2 97732 2002 00100001 2 1 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,1,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'4v6v34-y','BKEOI2f',7,5,NULL),(67,2,1,3,2002,2,NULL,NULL,'2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,NULL,NULL,0,NULL,0,NULL,2,NULL,NULL,0,'plDMwkUA','CoxU6um',5,4,NULL),(68,2,1,3,2002,2,NULL,'2 97732 2002 00000000 0 0 1366 768 1349 662','2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,1,NULL,0,NULL,0,NULL,2,NULL,NULL,0,'fItTXD-f','gFOanNY',3,3,NULL),(69,2,1,3,2002,2,NULL,'2 97732 2002 01101000 4 0 1366 768 1349 662','2015-01-15 09:12:51','2015-01-16 09:12:51','97732',NULL,7,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'PWVykkqQ','nlORj8c',3,6,NULL),(70,2,3,7,2005,1,NULL,NULL,'2014-05-17 09:12:51','2014-05-18 09:12:51','97732',NULL,NULL,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'w4kSpVTx','FCkjqYK',4,6,NULL),(71,2,3,7,2005,2,NULL,'2 97732 2005  0 1 4 0 0 0 1366 768 1349 662','2014-05-17 09:12:51','2014-05-18 09:12:51','97732',NULL,6,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'quQLXaEH','qFXWiZG',5,6,NULL),(72,2,3,7,2005,1,NULL,'2 97732 2005  0 4 0 4 0 0 1366 768 1349 662','2014-05-17 09:12:51','2014-05-18 09:12:51','97732',NULL,4,NULL,0,NULL,0,NULL,1,NULL,NULL,0,'RiilHhra','bhjKKUx',3,2,NULL),(73,2,1,3,2002,NULL,NULL,NULL,'2015-01-15 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'t7tZSCOq','gM8tx24',7,7,NULL),(74,2,1,3,2002,NULL,NULL,'2 97732 2002 11111111 F F 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,0,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'VejcNiQa','Htq9bVU',4,6,NULL),(75,2,1,3,2002,NULL,NULL,'2 97732 2002 00000000 0 0 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,3,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'10M2GdnO','8uFwiv0',8,8,NULL),(76,2,1,3,2002,NULL,NULL,NULL,'2015-01-15 09:12:51',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'KYCLxJOE','xCTpfok',4,6,NULL),(77,2,1,3,2002,NULL,NULL,'2 97732 2002 10010110 9 6 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,0,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'IR-ZI93p','tYtOujJ',32,7,NULL),(78,2,1,3,2002,NULL,NULL,'2 97732 2002 01010101 5 5 1366 768 1349 662','2015-01-15 09:12:51',NULL,'97732',NULL,1,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'n4nPEAJs','UWbvbEQ',1,2,NULL),(79,2,2,4,2003,NULL,NULL,'2 97732 2003 10010110 9 6 1366 768 1349 662','2022-05-09 09:12:51',NULL,'97732',NULL,0,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'41eaf614','b506a9d3',2,9,NULL),(80,2,6,14,2009,NULL,NULL,NULL,'2022-05-09 10:49:22',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'3a75c017','b03463f7',1,1,NULL),(81,2,8,16,2012,NULL,NULL,NULL,'2022-05-09 14:40:35',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'228f1f11','c4253076',4,4,NULL),(82,2,11,22,2034,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'97732',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'729c7a78','edcb7735',3,3,NULL),(83,1894,13,24,3002,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889603','b76870af',3,3,NULL),(84,1894,14,25,3003,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889604','b76870b0',3,3,NULL),(85,1894,15,26,3004,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889605','b76870b1',3,3,NULL),(86,1894,16,27,3005,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889606','b76870b2',3,3,NULL),(87,1894,17,28,3006,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889607','b76870b3',3,3,NULL),(88,1894,18,29,3007,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889608','b76870b4',3,3,NULL),(89,1894,19,30,3008,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889609','b76870b5',3,3,NULL),(90,1894,20,31,3009,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988960A','b76870b6',3,3,NULL),(91,1894,21,32,3010,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988960B','b76870b7',3,3,NULL),(92,1894,22,33,3011,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988960C','b76870b8',3,3,NULL),(93,1894,23,34,3012,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988960D','b76870b9',3,3,NULL),(94,1894,24,35,3013,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988960E','b76870bA',3,3,NULL),(95,1894,25,36,3014,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988960F','b76870bB',3,3,NULL),(96,1894,26,37,3015,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889610','b76870bC',3,3,NULL),(97,1894,27,38,3016,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889611','b76870bD',3,3,NULL),(98,1894,28,39,3017,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889612','b76870Be',3,3,NULL),(99,1894,29,40,3018,NULL,NULL,'1894 52432 3018 Submitted,T 0 1440 900 1440 738','2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889613','b76870bF',3,3,NULL),(100,1894,30,41,3019,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889614','b76870c0',3,3,NULL),(101,1894,31,42,3020,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889615','b76870c1',3,3,NULL),(102,1894,32,43,3021,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889616','b76870c2',3,3,NULL),(103,1894,33,44,3022,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889617','b76870c3',3,3,NULL),(104,1894,34,45,3023,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889618','b76870c4',3,3,NULL),(105,1894,35,46,3024,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'99889619','b76870c5',3,3,NULL),(106,1894,36,47,3025,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988961A','b76870c6',3,3,NULL),(107,1894,37,48,3026,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988961B','b76870c7',3,3,NULL),(108,1894,38,49,3027,NULL,NULL,NULL,'2022-05-09 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988961C','b76870c8',3,3,NULL),(109,1894,39,50,3028,NULL,NULL,'1894 52432 3028 |#=#|<h3 style=\"font-family: Arial, Sans-Serif\">Default userAnswer loaded</h3>\n<svg viewBox=\"0 0 225 150\" xmlns=\"http://www.w3.org/2000/svg\" preserveAspectRatio=\"xMidYMin meet\">\n   <rect x=\"0\" y=\"0\" width=\"225\" height=\"150\" fill=\"blue\" />\n   <line x1=\"0\" y1=\"75\" x2=\"225\" y2=\"75\" stroke=\"yellow\" stroke-width=\"15\" />\n   <rect x=\"70\" y=\"0\" width=\"15\" height=\"150\" fill=\"yellow\" />\n</svg> |#=#|Default svg. hash: 9988961D hashpw: b76870c9 |#=#|9988961D','2022-05-19 14:17:02',NULL,'52432',NULL,NULL,NULL,0,NULL,0,NULL,0,NULL,NULL,0,'9988961D','b76870c9',1,1,NULL);
/*!40000 ALTER TABLE `userAnswer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_course`
--

DROP TABLE IF EXISTS `user_course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_course` (
  `uid` int unsigned NOT NULL,
  `cid` int unsigned NOT NULL,
  `result` decimal(2,1) DEFAULT '0.0',
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creator` int DEFAULT NULL,
  `access` varchar(10) COLLATE utf8mb4_unicode_ci NOT NULL,
  `period` int DEFAULT '1',
  `term` char(5) COLLATE utf8mb4_unicode_ci DEFAULT 'VT16',
  `vers` varchar(8) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `vershistory` text COLLATE utf8mb4_unicode_ci,
  `groups` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `examiner` int DEFAULT NULL,
  `teacher` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passed` int unsigned NOT NULL DEFAULT '0',
  `failed` int unsigned NOT NULL DEFAULT '0',
  `pending` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`uid`,`cid`),
  KEY `cid` (`cid`),
  CONSTRAINT `user_course_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `user_course_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_course`
--

LOCK TABLES `user_course` WRITE;
/*!40000 ALTER TABLE `user_course` DISABLE KEYS */;
INSERT INTO `user_course` VALUES (4,2,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','97732',NULL,NULL,NULL,NULL,0,0,0),(6,1,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','45656',NULL,NULL,NULL,NULL,0,0,0),(6,2,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','97731',NULL,NULL,NULL,NULL,0,0,0),(6,4,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','1338',NULL,NULL,NULL,NULL,0,0,0),(7,1,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','45656',NULL,NULL,NULL,NULL,0,0,0),(20,1,0.0,'2023-05-12 13:02:03',NULL,'ST',1,'HT15','45656',NULL,NULL,NULL,NULL,0,0,0),(20,2,0.0,'2023-05-12 13:02:03',NULL,'ST',1,'HT15','97732',NULL,NULL,NULL,NULL,0,0,0),(20,3,0.0,'2023-05-12 13:02:03',NULL,'ST',1,'HT15','1337',NULL,NULL,NULL,NULL,0,0,0),(20,4,0.0,'2023-05-12 13:02:03',NULL,'ST',1,'HT15','1338',NULL,NULL,NULL,NULL,0,0,0),(21,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,NULL,NULL,NULL,0,0,0),(21,2,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','97732',NULL,NULL,NULL,NULL,0,0,0),(21,3,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','1337',NULL,NULL,NULL,NULL,0,0,0),(21,4,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','1338',NULL,NULL,NULL,NULL,0,0,0),(22,1,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','45656',NULL,NULL,NULL,NULL,0,0,0),(22,2,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','97732',NULL,NULL,NULL,NULL,0,0,0),(22,3,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','1337',NULL,NULL,NULL,NULL,0,0,0),(22,4,0.0,'2023-05-12 13:02:03',NULL,'W',1,'HT15','1338',NULL,NULL,NULL,NULL,0,0,0),(24,1,0.0,'2023-05-12 13:02:04',NULL,'ST',1,'HT15','45656',NULL,NULL,NULL,NULL,0,0,0),(24,2,0.0,'2023-05-12 13:02:04',NULL,'ST',1,'HT15','97732',NULL,NULL,NULL,NULL,0,0,0),(24,3,0.0,'2023-05-12 13:02:03',NULL,'ST',1,'HT15','1337',NULL,NULL,NULL,NULL,0,0,0),(24,4,0.0,'2023-05-12 13:02:04',NULL,'ST',1,'HT15','1338',NULL,NULL,NULL,NULL,0,0,0),(200,4,0.0,'2023-05-12 13:02:04',NULL,'R',4,'VT-15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(200,305,0.0,'2023-05-12 13:02:04',NULL,'R',2,'VT-14','12305',NULL,'No_1',6,'BoLindberg',0,0,0),(200,307,0.0,'2023-05-12 13:02:04',NULL,'R',2,'VT-14','12307',NULL,'No_1',6,'BoLindberg',0,0,0),(200,308,0.0,'2023-05-12 13:02:04',NULL,'R',3,'HT-14','12308',NULL,'No_1',6,'BoLindberg',0,0,0),(200,309,0.0,'2023-05-12 13:02:04',NULL,'R',3,'HT-14','12309',NULL,'No_1',6,'BoLindberg',0,0,0),(200,312,0.0,'2023-05-12 13:02:04',NULL,'R',4,'VT-15','12312',NULL,'No_1',6,'BoLindberg',0,0,0),(201,4,0.0,'2023-05-12 13:02:04',NULL,'R',4,'VT-15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(201,305,0.0,'2023-05-12 13:02:04',NULL,'R',2,'VT-14','12305',NULL,'No_1',6,'BoLindberg',0,0,0),(201,307,0.0,'2023-05-12 13:02:04',NULL,'R',2,'VT-14','12307',NULL,'No_1',6,'BoLindberg',0,0,0),(201,308,0.0,'2023-05-12 13:02:04',NULL,'R',3,'HT-14','12308',NULL,'No_1',6,'BoLindberg',0,0,0),(201,309,0.0,'2023-05-12 13:02:04',NULL,'R',3,'HT-14','12309',NULL,'No_1',6,'BoLindberg',0,0,0),(201,312,0.0,'2023-05-12 13:02:04',NULL,'R',4,'VT-15','12312',NULL,'No_1',6,'BoLindberg',0,0,0),(201,319,0.0,'2023-05-12 13:02:04',NULL,'R',4,'HT-15','12319',NULL,'No_1',6,'BoLindberg',0,0,0),(202,305,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT-13','12305',NULL,'No_1',6,'BoLindberg',0,0,0),(203,305,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT-13','12305',NULL,'No_1',6,'BoLindberg',0,0,0),(216,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(216,2,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(216,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(217,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(217,2,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(217,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(218,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(218,2,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(218,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(219,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(219,2,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(219,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(220,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(220,2,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(220,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(221,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(221,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(221,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(222,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(222,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(222,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(223,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(223,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(223,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(224,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(224,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(224,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(225,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(225,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(225,4,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','1338',NULL,'No_1',6,'BoLindberg',0,0,0),(226,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_2',4,'EmmaLindberg',0,0,0),(226,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(226,4,0.0,'2023-05-12 13:02:06',NULL,'R',1,'HT15','1338',NULL,'No_2',4,'EmmaLindberg',0,0,0),(227,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_2',4,'EmmaLindberg',0,0,0),(227,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(227,4,0.0,'2023-05-12 13:02:06',NULL,'R',1,'HT15','1338',NULL,'No_2',4,'EmmaLindberg',0,0,0),(228,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_2',4,'EmmaLindberg',0,0,0),(228,2,0.0,'2023-05-12 13:02:06',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(228,4,0.0,'2023-05-12 13:02:06',NULL,'R',1,'HT15','1338',NULL,'No_2',4,'EmmaLindberg',0,0,0),(229,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_2',4,'EmmaLindberg',0,0,0),(229,2,0.0,'2023-05-12 13:02:06',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(229,4,0.0,'2023-05-12 13:02:06',NULL,'R',1,'HT15','1338',NULL,'No_2',4,'EmmaLindberg',0,0,0),(230,1,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','45656',NULL,'No_2',4,'EmmaLindberg',0,0,0),(230,2,0.0,'2023-05-12 13:02:06',NULL,'R',1,'HT15','97732',NULL,'No_2',4,'EmmaLindberg',0,0,0),(230,4,0.0,'2023-05-12 13:02:06',NULL,'R',1,'HT15','1338',NULL,'No_2',4,'EmmaLindberg',0,0,0),(231,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(231,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(232,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(232,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(233,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(233,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(234,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(234,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(235,1,0.0,'2023-05-12 13:02:04',NULL,'R',1,'HT15','45656',NULL,'No_1',6,'BoLindberg',0,0,0),(235,2,0.0,'2023-05-12 13:02:05',NULL,'R',1,'HT15','97732',NULL,'No_2',6,'EmmaLindberg',0,0,0),(1010,1,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','45656',NULL,'Le_A',6,NULL,0,0,0),(1010,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_B',6,NULL,0,0,0),(1111,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_B',6,NULL,0,0,0),(1212,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0),(1313,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_B',6,NULL,0,0,0),(1414,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0),(1515,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0),(1616,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_B',6,NULL,0,0,0),(1717,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0),(2020,1,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','45656',NULL,'Le_A',6,NULL,0,0,0),(2020,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0),(3030,1,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','45656',NULL,'Le_A',6,NULL,0,0,0),(3030,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_B',6,NULL,0,0,0),(4040,1,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','45656',NULL,'Le_A',6,NULL,0,0,0),(4040,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0),(5050,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_B',6,NULL,0,0,0),(6060,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0),(7070,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0),(8080,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_B',6,NULL,0,0,0),(9090,2,0.0,'2023-05-12 13:01:53',1,'R',0,'VT-20','97731',NULL,'Le_A',6,NULL,0,0,0);
/*!40000 ALTER TABLE `user_course` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_group`
--

DROP TABLE IF EXISTS `user_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_group` (
  `groupID` int unsigned NOT NULL,
  `userID` int unsigned NOT NULL,
  KEY `groupID` (`groupID`),
  KEY `userID` (`userID`),
  CONSTRAINT `user_group_ibfk_1` FOREIGN KEY (`groupID`) REFERENCES `groups` (`groupID`),
  CONSTRAINT `user_group_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_group`
--

LOCK TABLES `user_group` WRITE;
/*!40000 ALTER TABLE `user_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_participant`
--

DROP TABLE IF EXISTS `user_participant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_participant` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int unsigned NOT NULL,
  `lid` int unsigned NOT NULL,
  `participation` tinyint unsigned DEFAULT NULL,
  `comments` varchar(512) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `lid` (`lid`),
  KEY `uid` (`uid`),
  CONSTRAINT `user_participant_ibfk_1` FOREIGN KEY (`lid`) REFERENCES `listentries` (`lid`),
  CONSTRAINT `user_participant_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_participant`
--

LOCK TABLES `user_participant` WRITE;
/*!40000 ALTER TABLE `user_participant` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_participant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_push_registration`
--

DROP TABLE IF EXISTS `user_push_registration`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user_push_registration` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int unsigned NOT NULL,
  `endpoint` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `added` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `keyAuth` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `keyValue` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastSent` date DEFAULT NULL,
  `daysOfUnsent` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `endpoint` (`endpoint`),
  KEY `uid` (`uid`),
  CONSTRAINT `user_push_registration_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_push_registration`
--

LOCK TABLES `user_push_registration` WRITE;
/*!40000 ALTER TABLE `user_push_registration` DISABLE KEYS */;
/*!40000 ALTER TABLE `user_push_registration` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userduggafeedback`
--

DROP TABLE IF EXISTS `userduggafeedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userduggafeedback` (
  `ufid` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cid` int unsigned NOT NULL,
  `lid` int unsigned NOT NULL,
  `score` int NOT NULL,
  `entryname` varchar(68) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ufid`),
  KEY `username` (`username`),
  KEY `cid` (`cid`),
  KEY `lid` (`lid`),
  CONSTRAINT `userduggafeedback_ibfk_1` FOREIGN KEY (`username`) REFERENCES `user` (`username`),
  CONSTRAINT `userduggafeedback_ibfk_2` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`),
  CONSTRAINT `userduggafeedback_ibfk_3` FOREIGN KEY (`lid`) REFERENCES `listentries` (`lid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userduggafeedback`
--

LOCK TABLES `userduggafeedback` WRITE;
/*!40000 ALTER TABLE `userduggafeedback` DISABLE KEYS */;
/*!40000 ALTER TABLE `userduggafeedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variant`
--

DROP TABLE IF EXISTS `variant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `variant` (
  `vid` int NOT NULL AUTO_INCREMENT,
  `quizID` int DEFAULT NULL,
  `param` varchar(8126) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variantanswer` varchar(8126) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `modified` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `creator` int DEFAULT NULL,
  `disabled` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`vid`),
  KEY `quizID` (`quizID`),
  CONSTRAINT `variant_ibfk_1` FOREIGN KEY (`quizID`) REFERENCES `quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variant`
--

LOCK TABLES `variant` WRITE;
/*!40000 ALTER TABLE `variant` DISABLE KEYS */;
INSERT INTO `variant` VALUES (1,1,'{\"tal\":\"2\"}','{\"danswer\":\"00000010 0 2\"}','2023-05-12 13:01:48',2,0),(2,1,'{\"tal\":\"5\"}','{\"danswer\":\"00000101 0 5\"}','2023-05-12 13:01:48',2,0),(3,1,'{\"tal\":\"10\"}','{\"danswer\":\"00002 0 A\"}','2023-05-12 13:01:48',2,0),(4,2,'{\"tal\":\"25\"}','{\"danswer\":\"00011001 1 9\"}','2023-05-12 13:01:48',2,0),(5,2,'{\"tal\":\"87\"}','{\"danswer\":\"02111 5 7\"}','2023-05-12 13:01:48',2,0),(6,2,'{\"tal\":\"192\"}','{\"danswer\":\"11000000 C 0\"}','2023-05-12 13:01:48',2,0),(7,3,'{\"color\":\"red\",\"colorname\":\"Röd\"}','{Variant}','2023-05-12 13:01:48',2,0),(8,3,'{\"color\":\"white\",\"colorname\":\"Vit\"}','{Variant}','2023-05-12 13:01:49',2,0),(9,3,'{\"color\":\"black\",\"colorname\":\"Svart\"}','{Variant}','2023-05-12 13:01:49',2,0),(10,4,'{\"color\":\"blue\",\"colorname\":\"Blå\"}','{Variant}','2023-05-12 13:01:49',2,0),(11,4,'{\"color\":\"purple\",\"colorname\":\"Lila\"}','{Variant}','2023-05-12 13:01:49',2,0),(12,4,'{\"color\":\"teal\",\"colorname\":\"Turkos (Teal)\"}','{Variant}','2023-05-12 13:01:49',2,0),(13,5,'{\"linje\":\"10,30,19 20 40 20 50 30 50,81 65 50\"}','{Variant}','2023-05-12 13:01:49',2,0),(14,6,'{\"linje\":\"10,30,81 10 20,81 65 10,63 20 30 75 35,19 30 60 75 70 50 35,19 100 10 85 95 45 50,19 40 40 50 40 15 55,63 10 60 10 50,81 20 30\"}','{Variant}','2023-05-12 13:01:49',2,0),(15,7,'{\"variant\":\"40 13 7 20 0\"}','{Variant}','2023-05-12 13:01:49',2,0),(16,8,'{\"variant\":\"26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0\"}','{Variant}','2023-05-12 13:01:49',2,0),(17,9,'{question\"One byte is equivalent to how many bits?: A\"4: B\"8: C\"16: D\"32}','B','2023-05-12 13:01:49',2,0),(18,9,'{question\"RGB and CMYK are abbreviations for what?: A\"Red, Green, Blue and Cyan Magenta, Yellow, Key (black): B\"Red, Grey, Black and Cyclone, Magenta, Yellow, Kayo: C\"Randy´s Green Brick and Cactus Magnolia Yronema Kalmia}','A','2023-05-12 13:01:49',2,0),(19,9,'{question\"Which of these are examples of actual shaders?: A\"B32shader, 554shader: B\"Context shaders, Shadow shaders and Block shaders: C\"Vertex shaders, Pixel shaders and Geometry shaders}','C','2023-05-12 13:01:49',2,0),(20,9,'{question\"Points, lines and curves are examples of geometrical...: A\"Primitives: B\"Substitutes: C\"Formations: D\"Partitions}','A','2023-05-12 13:01:49',2,0),(21,10,'{\"type\":\"md\",\"filelink\":\"minimikrav_m2.md\", \"submissions\":[{\"fieldname\":\"InlPHPDocument\",\"type\":\"pdf\",\"instruction\":\"Your report as a .pdf document.\"},{\"fieldname\":\"InlPHPZip\",\"type\":\"zip\", \"instruction\":\"Zip your project folder and submit the file here.\"}]}',NULL,'2023-05-12 13:01:49',2,0),(22,11,'{\"instructions\" : \"Målet med denna duggan är att du skall skapa den html- och css-kod som krävs för att återskapa det du ser i target-fönstret.\", \"target\" : \"cssdugga-site-1.png\", \"target-text\" : \"1) Skall tåla att storleken på skärmen påverkas. 2) Sidan får inte bli mindre i x-led än att alla knappar,Sture 1-5, i #eilert syns. 3) Endast span-element i body skall användas, Inga andra placeholder-element ellerövriga container-element är tillåtna 4) Float får ej användas 5) html och css skall klara validering 6) Internal css style skall användas\"}',NULL,'2023-05-12 13:01:49',2,0),(23,12,'{\"target\":\"test.png\"}',NULL,'2023-05-12 13:01:49',2,0),(24,13,'{\"vertice\":[{\"x\":\"200\",\"y\":\"200\",\"z\":\"0\"},{\"x\":\"-400\",\"y\":\"-400\",\"z\":\"0\"},{\"x\":\"400\",\"y\":\"-400\",\"z\":\"0\"}],\"triangles\":[\"0,1,2\"]}','{Variant}','2023-05-12 13:02:22',2,0),(25,14,'{\"tal\":\"129\"}','{\"danswer\":\"10000001 8 1\"}','2023-05-12 13:02:22',2,0),(26,15,'{\"instructions\":\"Move and resize the box with id greger until it matches the required format.\",\"query\":\"Make the greger-box 100px x 100px and with a 25px left side margin and 50px bottom padding\"}',NULL,'2023-05-12 13:02:22',2,0),(27,16,'{\"target\":\"test.png\"}','{Variant}','2023-05-12 13:02:22',2,0),(28,17,'{\"color\":\"green\",\"colorname\":\"Grön\"}','{Variant}','2023-05-12 13:02:22',2,0),(29,18,'{\"variant\":\"Contribution\"}','{Variant}','2023-05-12 13:02:22',2,0),(30,19,'{\"linje\":\"10,30,19 20 40 20 50 30 50,81 65 50\"}','{Variant}','2023-05-12 13:02:22',2,0),(31,20,'{\"type\":\"html\",\"filelink\":\"daily-minutes-instructions.html\",\"submissions\":[{\"type\":\"timesheet\",\"fieldname\":\"timesheet\",\"instruction\":\"Fyll i din aktivitet i projektet\"}]}',NULL,'2023-05-12 13:02:22',2,0),(32,21,'{\"type\":\"md\",\"filelink\":\"HTML_Ex1.txt\",\"gType\":\"md\",\"gFilelink\":\"HTML_Ex1.txt\",\"diagram_File\":\"example_ER.json\",\"diagram_type\":{\"ER\":true,\"UML\":true},\"extraparam\":\"\",\"notes\":\"\",\"submissions\":[{\"type\":\"pdf\",\"fieldname\":\"\",\"instruction\":\"\"}],\"errorActive\":true}','{Variant}','2023-05-12 13:02:22',2,0),(33,22,'{\"tal\":\"127\"}','{\"danswer\":\"01111111 7 F\"}','2023-05-12 13:02:22',2,0),(34,23,'{\"color\":\"yellow\",\"colorname\":\"Gul\"}','{Variant}','2023-05-12 13:02:22',2,0),(35,24,'{\"linje\":\"10,30,81 10 20,81 65 10,63 20 30 75 35,19 30 60 75 70 50 35,19 100 10 85 95 45 50,19 40 40 50 40 15 55,63 10 60 10 50,81 20 30\"}','{Variant}','2023-05-12 13:02:22',2,0),(36,25,'{\"variant\":\"40 13 7 20 0\"}','{Variant}','2023-05-12 13:02:23',2,0),(37,26,'{\"vertice\":[{\"x\":\"400\",\"y\":\"0\",\"z\":\"0\"},{\"x\":\"-400\",\"y\":\"0\",\"z\":\"0\"},{\"x\":\"400\",\"y\":\"0\",\"z\":\"0\"},{\"x\":\"400\",\"y\":\"0\",\"z\":\"-800\"}],\"triangles\":[\"0,1,2\",\"1,2,3\"]}','{Variant}','2023-05-12 13:02:23',2,0),(38,27,'{\"variant\":\"Dugga 6\"}','{Variant}','2023-05-12 13:02:23',2,0),(39,28,'{\"type\":\"pdf\",\"filelink\":\"instructions.pdf\",\"submissions\":[{\"fieldname\":\"Inl1Document\",\"type\":\"pdf\"},{\"fieldname\":\"Inl2Document\",\"type\":\"zip\",\"instruction\":\"Zip your project folder and submit the file here.\"},{\"fieldname\":\"Inl3Document\",\"type\":\"multi\",\"instruction\":\"Upload all of your graphics, i.e., all the generated png and svg files.\"}]}',NULL,'2023-05-12 13:02:23',2,0),(40,29,'{\"type\":\"md\",\"filelink\":\"duggainstruction.md\", \"submissions\":[{\"fieldname\":\"SubmissionText\",\"type\":\"text\", \"instruction\":\"Type in your submission. Only text is allowed.\"}]}',NULL,'2023-05-12 13:02:23',2,0),(41,30,'{\"type\":\"pdf\",\"filelink\":\"instructions.pdf\", \"submissions\":[{\"fieldname\":\"Inl1Document\",\"type\":\"pdf\"},{\"fieldname\":\"Inl2Document\",\"type\":\"zip\", \"instruction\":\"Zip your project folder and submit the file here.\"},{\"fieldname\":\"Inl3Document\",\"type\":\"multi\", \"instruction\":\"Upload all of your graphics, i.e., all the generated png and svg files.\"}]}',NULL,'2023-05-12 13:02:23',2,0),(42,31,'{\"instructions\":\"Move and resize the box with id greger until it matches the required format.\",\"query\":\"Make the greger-box 100px x 100px and with a 25px left side margin and 50px bottom padding\"}',NULL,'2023-05-12 13:02:23',2,0),(43,32,'{\"instructions\":\"Move and resize the box with id greger until it matches the required format.\",\"query\":\"Make the greger-box 100px x 100px and with a 25px left side margin and 50px bottom padding\"}',NULL,'2023-05-12 13:02:23',2,0),(44,33,'{\"variant\":\"Kryss\"}','{Variant}','2023-05-12 13:02:23',2,0),(45,34,'{\"tal\":\"2\",\"text\":\"Placeholder\"}','{\"danswer\":\"00000010 0 2\"}','2023-05-12 13:02:23',2,0),(46,35,'{\"tal\":\"2\",\"text\":\"Shapes dugga #helptxt.\"}','{\"danswer\":\"00000010 0 2\"}','2023-05-12 13:02:23',2,0),(47,36,'{\"variant\":\"26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0\"}','{Variant}','2023-05-12 13:02:23',2,0),(48,37,'{\"variant\":\"XMLAPI Report\"}','{Variant}','2023-05-12 13:02:23',2,0),(49,38,'{\"variant\":\"Seminar\"}','{Variant}','2023-05-12 13:02:23',2,0),(50,39,'{\"variant\":\"SVG-Dugga\"}','{Variant}','2023-05-12 13:02:23',2,0);
/*!40000 ALTER TABLE `variant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vers`
--

DROP TABLE IF EXISTS `vers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vers` (
  `cid` int unsigned NOT NULL AUTO_INCREMENT,
  `vers` varchar(8) COLLATE utf8mb4_unicode_ci NOT NULL,
  `versname` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coursecode` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coursename` varchar(80) COLLATE utf8mb4_unicode_ci NOT NULL,
  `coursenamealt` varchar(45) COLLATE utf8mb4_unicode_ci NOT NULL,
  `startdate` datetime DEFAULT NULL,
  `enddate` datetime DEFAULT NULL,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `motd` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`cid`,`vers`),
  CONSTRAINT `vers_ibfk_1` FOREIGN KEY (`cid`) REFERENCES `course` (`cid`)
) ENGINE=InnoDB AUTO_INCREMENT=1895 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vers`
--

LOCK TABLES `vers` WRITE;
/*!40000 ALTER TABLE `vers` DISABLE KEYS */;
INSERT INTO `vers` VALUES (1,'45656','HT15','DV12G','Webbprogrammering','UNK','2014-12-29 00:00:00','2015-03-08 00:00:00','2023-05-12 13:01:47','Webbprogrammering - HT15'),(1,'45657','HT16','DV12G','Webbprogrammering','UNK','2015-12-29 00:00:00','2016-03-08 00:00:00','2023-05-12 13:01:47','Webbprogrammering - HT16'),(2,'97731','HT14','IT118G','Webbutveckling - datorgrafik','UNK','2014-12-29 00:00:00','2015-03-08 00:00:00','2023-05-12 13:01:47','Webbutveckling - datorgrafik - HT14'),(2,'97732','HT15','IT118G','Webbutveckling - datorgrafik','UNK','2014-12-29 00:00:00','2015-03-08 00:00:00','2023-05-12 13:01:47','Webbutveckling - datorgrafik - HT15'),(3,'1337','HT15','IT500G','Datorns grunder','UNK','2014-12-29 00:00:00','2015-03-08 00:00:00','2023-05-12 13:01:47','Datorns grunder - HT15'),(4,'1338','HT15','IT301G','Software Engineering','UNK','2014-12-29 00:00:00','2015-03-08 00:00:00','2023-05-12 13:01:47','Software Engineering - HT15'),(305,'12305','HT15','IT308G','Objektorienterad programmering','UNK',NULL,NULL,'2023-05-12 13:01:47',NULL),(307,'12307','HT15','IT115G','Datorns grunder','UNK',NULL,NULL,'2023-05-12 13:01:47',NULL),(308,'12308','HT15','MA161G','Diskret matematik','UNK',NULL,NULL,'2023-05-12 13:01:47',NULL),(309,'12309','HT15','DA322G','Operativsystem','UNK',NULL,NULL,'2023-05-12 13:01:47',NULL),(312,'12312','HT15','IT326G','Distribuerade system','UNK',NULL,NULL,'2023-05-12 13:01:48',NULL),(319,'12319','HT15','DV736A','Examensarbete i datavetenskap','UNK',NULL,NULL,'2023-05-12 13:01:48',NULL),(324,'12324','HT15','IT108G','Webbutveckling - webbplatsdesign','UNK',NULL,NULL,'2023-05-12 13:01:48',NULL),(1885,'1337','','G1337','Testing-Course','Course for testing codeviewer','2020-05-01 00:00:00','2020-06-30 00:00:00','2023-05-12 13:02:25','Code examples shows both templateid and boxid!'),(1894,'52432','ST20','G420','Demo-Course','Chaos Theory - Conspiracy 64k Demo','2020-05-01 00:00:00','2020-06-30 00:00:00','2023-05-12 13:02:19','Demo Course 2020 - All current duggas');
/*!40000 ALTER TABLE `vers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `word`
--

DROP TABLE IF EXISTS `word`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `word` (
  `wordid` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `wordlistid` mediumint unsigned NOT NULL,
  `word` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `label` varchar(256) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uid` int unsigned NOT NULL,
  PRIMARY KEY (`wordid`,`wordlistid`),
  KEY `uid` (`uid`),
  KEY `wordlistid` (`wordlistid`),
  CONSTRAINT `word_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`),
  CONSTRAINT `word_ibfk_2` FOREIGN KEY (`wordlistid`) REFERENCES `wordlist` (`wordlistid`)
) ENGINE=InnoDB AUTO_INCREMENT=1043 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `word`
--

LOCK TABLES `word` WRITE;
/*!40000 ALTER TABLE `word` DISABLE KEYS */;
INSERT INTO `word` VALUES (1,1,'for','A','2023-05-12 13:01:43',1),(2,1,'function','B','2023-05-12 13:01:43',1),(3,1,'if','C','2023-05-12 13:01:43',1),(4,1,'var','D','2023-05-12 13:01:43',1),(5,2,'echo','A','2023-05-12 13:01:44',1),(6,2,'function','B','2023-05-12 13:01:44',1),(7,2,'if','C','2023-05-12 13:01:44',1),(8,2,'else','D','2023-05-12 13:01:44',1),(9,3,'onclick','A','2023-05-12 13:01:44',1),(10,3,'onload','B','2023-05-12 13:01:44',1),(11,3,'class','C','2023-05-12 13:01:44',1),(12,3,'id','D','2023-05-12 13:01:44',1),(13,3,'html','A','2023-05-12 13:02:36',1),(14,3,'body','A','2023-05-12 13:02:36',1),(15,3,'head','A','2023-05-12 13:02:36',1),(16,3,'title','A','2023-05-12 13:02:36',1),(17,3,'div','A','2023-05-12 13:02:36',1),(18,5,'abstract','A','2023-05-12 13:02:36',1),(19,5,'continue','B','2023-05-12 13:02:36',1),(20,5,'for','C','2023-05-12 13:02:36',1),(21,5,'new','D','2023-05-12 13:02:36',1),(22,5,'switch','A','2023-05-12 13:02:36',1),(23,5,'assert','B','2023-05-12 13:02:36',1),(24,5,'default','C','2023-05-12 13:02:36',1),(25,5,'goto','D','2023-05-12 13:02:36',1),(26,5,'package','A','2023-05-12 13:02:37',1),(27,5,'synchronized','B','2023-05-12 13:02:37',1),(28,5,'boolean','C','2023-05-12 13:02:37',1),(29,5,'do','D','2023-05-12 13:02:37',1),(30,5,'if','A','2023-05-12 13:02:37',1),(31,5,'private','B','2023-05-12 13:02:37',1),(32,5,'this','C','2023-05-12 13:02:37',1),(33,5,'break','D','2023-05-12 13:02:37',1),(34,5,'double','A','2023-05-12 13:02:37',1),(35,5,'implements','B','2023-05-12 13:02:37',1),(36,5,'protected','C','2023-05-12 13:02:37',1),(37,5,'throw','D','2023-05-12 13:02:37',1),(38,5,'byte','A','2023-05-12 13:02:37',1),(39,5,'else','B','2023-05-12 13:02:37',1),(40,5,'import','C','2023-05-12 13:02:37',1),(41,5,'public','D','2023-05-12 13:02:37',1),(42,5,'throws','A','2023-05-12 13:02:37',1),(43,5,'case','B','2023-05-12 13:02:37',1),(44,5,'enum','C','2023-05-12 13:02:37',1),(45,5,'var','D','2023-05-12 13:02:37',1),(46,5,'catch','A','2023-05-12 13:02:38',1),(47,5,'instanceof','B','2023-05-12 13:02:38',1),(48,5,'return','C','2023-05-12 13:02:38',1),(49,5,'transient','D','2023-05-12 13:02:38',1),(50,5,'extends','A','2023-05-12 13:02:38',1),(51,5,'int','B','2023-05-12 13:02:38',1),(52,5,'short','C','2023-05-12 13:02:38',1),(53,5,'try','D','2023-05-12 13:02:38',1),(54,5,'char','B','2023-05-12 13:02:38',1),(55,5,'final','C','2023-05-12 13:02:38',1),(56,5,'interface','D','2023-05-12 13:02:38',1),(57,5,'static','A','2023-05-12 13:02:38',1),(58,5,'class','B','2023-05-12 13:02:38',1),(59,5,'long','C','2023-05-12 13:02:38',1),(60,5,'strictfp','D','2023-05-12 13:02:38',1),(61,5,'volatile','A','2023-05-12 13:02:38',1),(62,5,'float','B','2023-05-12 13:02:38',1),(63,5,'native','C','2023-05-12 13:02:38',1),(64,5,'super','D','2023-05-12 13:02:38',1),(65,5,'while','A','2023-05-12 13:02:38',1),(66,2,'__halt_compiler','A','2023-05-12 13:02:39',1),(67,2,'abstract','A','2023-05-12 13:02:39',1),(68,2,'and','A','2023-05-12 13:02:39',1),(69,2,'array','A','2023-05-12 13:02:39',1),(70,2,'as','A','2023-05-12 13:02:39',1),(71,2,'break','A','2023-05-12 13:02:39',1),(72,2,'callable','A','2023-05-12 13:02:39',1),(73,2,'case','A','2023-05-12 13:02:39',1),(74,2,'catch','A','2023-05-12 13:02:39',1),(75,2,'class','A','2023-05-12 13:02:39',1),(76,2,'clone','A','2023-05-12 13:02:39',1),(77,2,'const','A','2023-05-12 13:02:39',1),(78,2,'continue','A','2023-05-12 13:02:39',1),(79,2,'declare','A','2023-05-12 13:02:39',1),(80,2,'default','A','2023-05-12 13:02:39',1),(81,2,'die','A','2023-05-12 13:02:39',1),(82,2,'do','A','2023-05-12 13:02:39',1),(83,2,'echo','A','2023-05-12 13:02:40',1),(84,2,'else','A','2023-05-12 13:02:40',1),(85,2,'elseif','A','2023-05-12 13:02:40',1),(86,2,'empty','A','2023-05-12 13:02:40',1),(87,2,'enddeclare','A','2023-05-12 13:02:40',1),(88,2,'endfor','A','2023-05-12 13:02:40',1),(89,2,'endforeach','A','2023-05-12 13:02:40',1),(90,2,'endif','A','2023-05-12 13:02:40',1),(91,2,'endswitch','A','2023-05-12 13:02:40',1),(92,2,'endwhile','A','2023-05-12 13:02:40',1),(93,2,'eval','A','2023-05-12 13:02:40',1),(94,2,'exit','A','2023-05-12 13:02:40',1),(95,2,'extends','A','2023-05-12 13:02:40',1),(96,2,'final','A','2023-05-12 13:02:40',1),(97,2,'for','A','2023-05-12 13:02:40',1),(98,2,'foreach','A','2023-05-12 13:02:40',1),(99,2,'function','A','2023-05-12 13:02:40',1),(100,2,'global','A','2023-05-12 13:02:40',1),(101,2,'goto','A','2023-05-12 13:02:40',1),(102,2,'if','A','2023-05-12 13:02:40',1),(103,2,'implements','A','2023-05-12 13:02:40',1),(104,2,'include','A','2023-05-12 13:02:40',1),(105,2,'include_once','A','2023-05-12 13:02:40',1),(106,2,'instanceof','A','2023-05-12 13:02:40',1),(107,2,'insteadof','A','2023-05-12 13:02:40',1),(108,2,'interface','A','2023-05-12 13:02:40',1),(109,2,'isset','A','2023-05-12 13:02:41',1),(110,2,'list','A','2023-05-12 13:02:41',1),(111,2,'namespace','A','2023-05-12 13:02:41',1),(112,2,'new','A','2023-05-12 13:02:41',1),(113,2,'or','A','2023-05-12 13:02:41',1),(114,2,'print','A','2023-05-12 13:02:41',1),(115,2,'private','A','2023-05-12 13:02:41',1),(116,2,'protected','A','2023-05-12 13:02:41',1),(117,2,'public','A','2023-05-12 13:02:41',1),(118,2,'require','A','2023-05-12 13:02:41',1),(119,2,'require_once','A','2023-05-12 13:02:41',1),(120,2,'return','A','2023-05-12 13:02:41',1),(121,2,'static','A','2023-05-12 13:02:41',1),(122,2,'switch','A','2023-05-12 13:02:41',1),(123,2,'throw','A','2023-05-12 13:02:41',1),(124,2,'trait','A','2023-05-12 13:02:41',1),(125,2,'try','A','2023-05-12 13:02:41',1),(126,2,'unset','A','2023-05-12 13:02:41',1),(127,2,'use','A','2023-05-12 13:02:41',1),(128,2,'var','A','2023-05-12 13:02:41',1),(129,2,'while','A','2023-05-12 13:02:41',1),(130,2,'xor','A','2023-05-12 13:02:41',1),(131,4,'readme','A','2023-05-12 13:02:41',1),(132,4,'Hello','A','2023-05-12 13:02:41',1),(133,7,'A','A','2023-05-12 13:02:41',1),(134,7,'ABORT','A','2023-05-12 13:02:41',1),(135,7,'ABS','A','2023-05-12 13:02:41',1),(136,7,'ABSOLUTE','A','2023-05-12 13:02:41',1),(137,7,'ACCESS','A','2023-05-12 13:02:41',1),(138,7,'ACTION','A','2023-05-12 13:02:41',1),(139,7,'ADA','A','2023-05-12 13:02:41',1),(140,7,'ADD','A','2023-05-12 13:02:42',1),(141,7,'ADMIN','A','2023-05-12 13:02:42',1),(142,7,'AFTER','A','2023-05-12 13:02:42',1),(143,7,'AGGREGATE','A','2023-05-12 13:02:42',1),(144,7,'ALIAS','A','2023-05-12 13:02:42',1),(145,7,'ALL','A','2023-05-12 13:02:42',1),(146,7,'ALLOCATE','A','2023-05-12 13:02:42',1),(147,7,'ALSO','A','2023-05-12 13:02:42',1),(148,7,'ALTER','A','2023-05-12 13:02:42',1),(149,7,'ALWAYS','A','2023-05-12 13:02:42',1),(150,7,'ANALYSE','A','2023-05-12 13:02:42',1),(151,7,'ANALYZE','A','2023-05-12 13:02:42',1),(152,7,'AND','A','2023-05-12 13:02:42',1),(153,7,'ANY','A','2023-05-12 13:02:42',1),(154,7,'ARE','A','2023-05-12 13:02:42',1),(155,7,'ARRAY','A','2023-05-12 13:02:42',1),(156,7,'AS','A','2023-05-12 13:02:42',1),(157,7,'ASC','A','2023-05-12 13:02:42',1),(158,7,'ASENSITIVE','A','2023-05-12 13:02:42',1),(159,7,'ASSERTION','A','2023-05-12 13:02:42',1),(160,7,'ASSIGNMENT','A','2023-05-12 13:02:42',1),(161,7,'ASYMMETRIC','A','2023-05-12 13:02:42',1),(162,7,'AT','A','2023-05-12 13:02:42',1),(163,7,'ATOMIC','A','2023-05-12 13:02:42',1),(164,7,'ATTRIBUTE','A','2023-05-12 13:02:42',1),(165,7,'ATTRIBUTES','A','2023-05-12 13:02:42',1),(166,7,'AUDIT','A','2023-05-12 13:02:42',1),(167,7,'AUTHORIZATION','A','2023-05-12 13:02:42',1),(168,7,'AUTO_INCREMENT','A','2023-05-12 13:02:42',1),(169,7,'AVG','A','2023-05-12 13:02:42',1),(170,7,'AVG_ROW_LENGTH','A','2023-05-12 13:02:42',1),(171,7,'BACKUP','A','2023-05-12 13:02:42',1),(172,7,'BACKWARD','A','2023-05-12 13:02:42',1),(173,7,'BEFORE','A','2023-05-12 13:02:43',1),(174,7,'BEGIN','A','2023-05-12 13:02:43',1),(175,7,'BERNOULLI','A','2023-05-12 13:02:43',1),(176,7,'BETWEEN','A','2023-05-12 13:02:43',1),(177,7,'BIGINT','A','2023-05-12 13:02:43',1),(178,7,'BINARY','A','2023-05-12 13:02:43',1),(179,7,'BIT','A','2023-05-12 13:02:43',1),(180,7,'BIT_LENGTH','A','2023-05-12 13:02:43',1),(181,7,'BITVAR','A','2023-05-12 13:02:43',1),(182,7,'BLOB','A','2023-05-12 13:02:43',1),(183,7,'BOOL','A','2023-05-12 13:02:43',1),(184,7,'BOOLEAN','A','2023-05-12 13:02:43',1),(185,7,'BOTH','A','2023-05-12 13:02:43',1),(186,7,'BREADTH','A','2023-05-12 13:02:43',1),(187,7,'BREAK','A','2023-05-12 13:02:43',1),(188,7,'BROWSE','A','2023-05-12 13:02:43',1),(189,7,'BULK','A','2023-05-12 13:02:43',1),(190,7,'BY','A','2023-05-12 13:02:43',1),(191,7,'C','A','2023-05-12 13:02:43',1),(192,7,'CACHE','A','2023-05-12 13:02:43',1),(193,7,'CALL','A','2023-05-12 13:02:43',1),(194,7,'CALLED','A','2023-05-12 13:02:43',1),(195,7,'CARDINALITY','A','2023-05-12 13:02:43',1),(196,7,'CASCADE','A','2023-05-12 13:02:43',1),(197,7,'CASCADED','A','2023-05-12 13:02:43',1),(198,7,'CASE','A','2023-05-12 13:02:43',1),(199,7,'CAST','A','2023-05-12 13:02:43',1),(200,7,'CATALOG','A','2023-05-12 13:02:43',1),(201,7,'CATALOG_NAME','A','2023-05-12 13:02:43',1),(202,7,'CEIL','A','2023-05-12 13:02:43',1),(203,7,'CEILING','A','2023-05-12 13:02:44',1),(204,7,'CHAIN','A','2023-05-12 13:02:44',1),(205,7,'CHANGE','A','2023-05-12 13:02:44',1),(206,7,'CHAR','A','2023-05-12 13:02:44',1),(207,7,'CHAR_LENGTH','A','2023-05-12 13:02:44',1),(208,7,'CHARACTER','A','2023-05-12 13:02:44',1),(209,7,'CHARACTER_LENGTH','A','2023-05-12 13:02:44',1),(210,7,'CHARACTER_SET_CATALOG','A','2023-05-12 13:02:44',1),(211,7,'CHARACTER_SET_NAME','A','2023-05-12 13:02:44',1),(212,7,'CHARACTER_SET_SCHEMA','A','2023-05-12 13:02:44',1),(213,7,'CHARACTERISTICS','A','2023-05-12 13:02:44',1),(214,7,'CHARACTERS','A','2023-05-12 13:02:44',1),(215,7,'CHECK','A','2023-05-12 13:02:44',1),(216,7,'CHECKED','A','2023-05-12 13:02:44',1),(217,7,'CHECKPOINT','A','2023-05-12 13:02:44',1),(218,7,'CHECKSUM','A','2023-05-12 13:02:44',1),(219,7,'CLASS','A','2023-05-12 13:02:44',1),(220,7,'CLASS_ORIGIN','A','2023-05-12 13:02:44',1),(221,7,'CLOB','A','2023-05-12 13:02:44',1),(222,7,'CLOSE','A','2023-05-12 13:02:44',1),(223,7,'CLUSTER','A','2023-05-12 13:02:44',1),(224,7,'CLUSTERED','A','2023-05-12 13:02:44',1),(225,7,'COALESCE','A','2023-05-12 13:02:44',1),(226,7,'COBOL','A','2023-05-12 13:02:44',1),(227,7,'COLLATE','A','2023-05-12 13:02:44',1),(228,7,'COLLATION','A','2023-05-12 13:02:44',1),(229,7,'COLLATION_CATALOG','A','2023-05-12 13:02:44',1),(230,7,'COLLATION_NAME','A','2023-05-12 13:02:44',1),(231,7,'COLLATION_SCHEMA','A','2023-05-12 13:02:44',1),(232,7,'COLLECT','A','2023-05-12 13:02:45',1),(233,7,'COLUMN','A','2023-05-12 13:02:45',1),(234,7,'COLUMN_NAME','A','2023-05-12 13:02:45',1),(235,7,'COLUMNS','A','2023-05-12 13:02:45',1),(236,7,'COMMAND_FUNCTION','A','2023-05-12 13:02:45',1),(237,7,'COMMAND_FUNCTION_CODE','A','2023-05-12 13:02:45',1),(238,7,'COMMENT','A','2023-05-12 13:02:45',1),(239,7,'COMMIT','A','2023-05-12 13:02:45',1),(240,7,'COMMITTED','A','2023-05-12 13:02:45',1),(241,7,'COMPLETION','A','2023-05-12 13:02:45',1),(242,7,'COMPRESS','A','2023-05-12 13:02:45',1),(243,7,'COMPUTE','A','2023-05-12 13:02:45',1),(244,7,'CONDITION','A','2023-05-12 13:02:46',1),(245,7,'CONDITION_NUMBER','A','2023-05-12 13:02:46',1),(246,7,'CONNECT','A','2023-05-12 13:02:46',1),(247,7,'CONNECTION','A','2023-05-12 13:02:46',1),(248,7,'CONNECTION_NAME','A','2023-05-12 13:02:46',1),(249,7,'CONSTRAINT','A','2023-05-12 13:02:46',1),(250,7,'CONSTRAINT_CATALOG','A','2023-05-12 13:02:46',1),(251,7,'CONSTRAINT_NAME','A','2023-05-12 13:02:46',1),(252,7,'CONSTRAINT_SCHEMA','A','2023-05-12 13:02:46',1),(253,7,'CONSTRAINTS','A','2023-05-12 13:02:46',1),(254,7,'CONSTRUCTOR','A','2023-05-12 13:02:46',1),(255,7,'CONTAINS','A','2023-05-12 13:02:46',1),(256,7,'CONTAINSTABLE','A','2023-05-12 13:02:46',1),(257,7,'CONTINUE','A','2023-05-12 13:02:46',1),(258,7,'CONVERSION','A','2023-05-12 13:02:46',1),(259,7,'CONVERT','A','2023-05-12 13:02:46',1),(260,7,'COPY','A','2023-05-12 13:02:46',1),(261,7,'CORR','A','2023-05-12 13:02:46',1),(262,7,'CORRESPONDING','A','2023-05-12 13:02:46',1),(263,7,'COUNT','A','2023-05-12 13:02:47',1),(264,7,'COVAR_POP','A','2023-05-12 13:02:47',1),(265,7,'COVAR_SAMP','A','2023-05-12 13:02:47',1),(266,7,'CREATE','A','2023-05-12 13:02:47',1),(267,7,'CREATEDB','A','2023-05-12 13:02:47',1),(268,7,'CREATEROLE','A','2023-05-12 13:02:47',1),(269,7,'CREATEUSER','A','2023-05-12 13:02:47',1),(270,7,'CROSS','A','2023-05-12 13:02:47',1),(271,7,'CSV','A','2023-05-12 13:02:47',1),(272,7,'CUBE','A','2023-05-12 13:02:47',1),(273,7,'CUME_DIST','A','2023-05-12 13:02:47',1),(274,7,'CURRENT','A','2023-05-12 13:02:47',1),(275,7,'CURRENT_DATE','A','2023-05-12 13:02:47',1),(276,7,'CURRENT_DEFAULT_TRANSFORM_GROUP','A','2023-05-12 13:02:47',1),(277,7,'CURRENT_PATH','A','2023-05-12 13:02:47',1),(278,7,'CURRENT_ROLE','A','2023-05-12 13:02:47',1),(279,7,'CURRENT_TIME','A','2023-05-12 13:02:47',1),(280,7,'CURRENT_TIMESTAMP','A','2023-05-12 13:02:47',1),(281,7,'CURRENT_TRANSFORM_GROUP_FOR_TYPE','A','2023-05-12 13:02:47',1),(282,7,'CURRENT_USER','A','2023-05-12 13:02:47',1),(283,7,'CURSOR','A','2023-05-12 13:02:47',1),(284,7,'CURSOR_NAME','A','2023-05-12 13:02:47',1),(285,7,'CYCLE','A','2023-05-12 13:02:47',1),(286,7,'DATA','A','2023-05-12 13:02:47',1),(287,7,'DATABASE','A','2023-05-12 13:02:47',1),(288,7,'DATABASES','A','2023-05-12 13:02:47',1),(289,7,'DATE','A','2023-05-12 13:02:47',1),(290,7,'DATETIME','A','2023-05-12 13:02:47',1),(291,7,'DATETIME_INTERVAL_CODE','A','2023-05-12 13:02:47',1),(292,7,'DATETIME_INTERVAL_PRECISION','A','2023-05-12 13:02:47',1),(293,7,'DAY','A','2023-05-12 13:02:47',1),(294,7,'DAY_HOUR','A','2023-05-12 13:02:47',1),(295,7,'DAY_MICROSECOND','A','2023-05-12 13:02:47',1),(296,7,'DAY_MINUTE','A','2023-05-12 13:02:48',1),(297,7,'DAY_SECOND','A','2023-05-12 13:02:48',1),(298,7,'DAYOFMONTH','A','2023-05-12 13:02:48',1),(299,7,'DAYOFWEEK','A','2023-05-12 13:02:48',1),(300,7,'DAYOFYEAR','A','2023-05-12 13:02:48',1),(301,7,'DBCC','A','2023-05-12 13:02:48',1),(302,7,'DEALLOCATE','A','2023-05-12 13:02:48',1),(303,7,'DEC','A','2023-05-12 13:02:48',1),(304,7,'DECIMAL','A','2023-05-12 13:02:48',1),(305,7,'DECLARE','A','2023-05-12 13:02:48',1),(306,7,'DEFAULT','A','2023-05-12 13:02:48',1),(307,7,'DEFAULTS','A','2023-05-12 13:02:48',1),(308,7,'DEFERRABLE','A','2023-05-12 13:02:48',1),(309,7,'DEFERRED','A','2023-05-12 13:02:48',1),(310,7,'DEFINED','A','2023-05-12 13:02:48',1),(311,7,'DEFINER','A','2023-05-12 13:02:48',1),(312,7,'DEGREE','A','2023-05-12 13:02:48',1),(313,7,'DELAY_KEY_WRITE','A','2023-05-12 13:02:48',1),(314,7,'DELAYED','A','2023-05-12 13:02:48',1),(315,7,'DELETE','A','2023-05-12 13:02:48',1),(316,7,'DELIMITER','A','2023-05-12 13:02:48',1),(317,7,'DELIMITERS','A','2023-05-12 13:02:48',1),(318,7,'DENSE_RANK','A','2023-05-12 13:02:48',1),(319,7,'DENY','A','2023-05-12 13:02:48',1),(320,7,'DEPTH','A','2023-05-12 13:02:48',1),(321,7,'DEREF','A','2023-05-12 13:02:48',1),(322,7,'DERIVED','A','2023-05-12 13:02:48',1),(323,7,'DESC','A','2023-05-12 13:02:49',1),(324,7,'DESCRIBE','A','2023-05-12 13:02:49',1),(325,7,'DESCRIPTOR','A','2023-05-12 13:02:49',1),(326,7,'DESTROY','A','2023-05-12 13:02:49',1),(327,7,'DESTRUCTOR','A','2023-05-12 13:02:49',1),(328,7,'DETERMINISTIC','A','2023-05-12 13:02:49',1),(329,7,'DIAGNOSTICS','A','2023-05-12 13:02:49',1),(330,7,'DICTIONARY','A','2023-05-12 13:02:49',1),(331,7,'DISABLE','A','2023-05-12 13:02:49',1),(332,7,'DISCONNECT','A','2023-05-12 13:02:49',1),(333,7,'DISK','A','2023-05-12 13:02:49',1),(334,7,'DISPATCH','A','2023-05-12 13:02:49',1),(335,7,'DISTINCT','A','2023-05-12 13:02:49',1),(336,7,'DISTINCTROW','A','2023-05-12 13:02:49',1),(337,7,'DISTRIBUTED','A','2023-05-12 13:02:49',1),(338,7,'DIV','A','2023-05-12 13:02:49',1),(339,7,'DO','A','2023-05-12 13:02:49',1),(340,7,'DOMAIN','A','2023-05-12 13:02:49',1),(341,7,'DOUBLE','A','2023-05-12 13:02:49',1),(342,7,'DROP','A','2023-05-12 13:02:49',1),(343,7,'DUAL','A','2023-05-12 13:02:50',1),(344,7,'DUMMY','A','2023-05-12 13:02:50',1),(345,7,'DUMP','A','2023-05-12 13:02:50',1),(346,7,'DYNAMIC','A','2023-05-12 13:02:50',1),(347,7,'DYNAMIC_FUNCTION','A','2023-05-12 13:02:50',1),(348,7,'DYNAMIC_FUNCTION_CODE','A','2023-05-12 13:02:50',1),(349,7,'EACH','A','2023-05-12 13:02:50',1),(350,7,'ELEMENT','A','2023-05-12 13:02:50',1),(351,7,'ELSE','A','2023-05-12 13:02:50',1),(352,7,'ELSEIF','A','2023-05-12 13:02:50',1),(353,7,'ENABLE','A','2023-05-12 13:02:50',1),(354,7,'ENCLOSED','A','2023-05-12 13:02:50',1),(355,7,'ENCODING','A','2023-05-12 13:02:50',1),(356,7,'ENCRYPTED','A','2023-05-12 13:02:50',1),(357,7,'END','A','2023-05-12 13:02:50',1),(358,7,'END-EXEC','A','2023-05-12 13:02:50',1),(359,7,'ENUM','A','2023-05-12 13:02:50',1),(360,7,'EQUALS','A','2023-05-12 13:02:50',1),(361,7,'ERRLVL','A','2023-05-12 13:02:50',1),(362,7,'ESCAPE','A','2023-05-12 13:02:50',1),(363,7,'ESCAPED','A','2023-05-12 13:02:50',1),(364,7,'EVERY','A','2023-05-12 13:02:50',1),(365,7,'EXCEPT','A','2023-05-12 13:02:51',1),(366,7,'EXCEPTION','A','2023-05-12 13:02:51',1),(367,7,'EXCLUDE','A','2023-05-12 13:02:51',1),(368,7,'EXCLUDING','A','2023-05-12 13:02:51',1),(369,7,'EXCLUSIVE','A','2023-05-12 13:02:51',1),(370,7,'EXEC','A','2023-05-12 13:02:51',1),(371,7,'EXECUTE','A','2023-05-12 13:02:51',1),(372,7,'EXISTING','A','2023-05-12 13:02:51',1),(373,7,'EXISTS','A','2023-05-12 13:02:51',1),(374,7,'EXIT','A','2023-05-12 13:02:51',1),(375,7,'EXP','A','2023-05-12 13:02:51',1),(376,7,'EXPLAIN','A','2023-05-12 13:02:51',1),(377,7,'EXTERNAL','A','2023-05-12 13:02:51',1),(378,7,'EXTRACT','A','2023-05-12 13:02:51',1),(379,7,'FALSE','A','2023-05-12 13:02:52',1),(380,7,'FETCH','A','2023-05-12 13:02:52',1),(381,7,'FIELDS','A','2023-05-12 13:02:52',1),(382,7,'FILE','A','2023-05-12 13:02:52',1),(383,7,'FILLFACTOR','A','2023-05-12 13:02:52',1),(384,7,'FILTER','A','2023-05-12 13:02:52',1),(385,7,'FINAL','A','2023-05-12 13:02:52',1),(386,7,'FIRST','A','2023-05-12 13:02:52',1),(387,7,'FLOAT','A','2023-05-12 13:02:52',1),(388,7,'FLOAT4','A','2023-05-12 13:02:52',1),(389,7,'FLOAT8','A','2023-05-12 13:02:52',1),(390,7,'FLOOR','A','2023-05-12 13:02:52',1),(391,7,'FLUSH','A','2023-05-12 13:02:52',1),(392,7,'FOLLOWING','A','2023-05-12 13:02:52',1),(393,7,'FOR','A','2023-05-12 13:02:52',1),(394,7,'FORCE','A','2023-05-12 13:02:52',1),(395,7,'FOREIGN','A','2023-05-12 13:02:52',1),(396,7,'FORTRAN','A','2023-05-12 13:02:52',1),(397,7,'FORWARD','A','2023-05-12 13:02:52',1),(398,7,'FOUND','A','2023-05-12 13:02:53',1),(399,7,'FREE','A','2023-05-12 13:02:53',1),(400,7,'FREETEXT','A','2023-05-12 13:02:53',1),(401,7,'FREETEXTTABLE','A','2023-05-12 13:02:53',1),(402,7,'FREEZE','A','2023-05-12 13:02:53',1),(403,7,'FROM','A','2023-05-12 13:02:53',1),(404,7,'FULL','A','2023-05-12 13:02:53',1),(405,7,'FULLTEXT','A','2023-05-12 13:02:53',1),(406,7,'FUNCTION','A','2023-05-12 13:02:53',1),(407,7,'FUSION','A','2023-05-12 13:02:53',1),(408,7,'G','A','2023-05-12 13:02:53',1),(409,7,'GENERAL','A','2023-05-12 13:02:53',1),(410,7,'GENERATED','A','2023-05-12 13:02:53',1),(411,7,'GET','A','2023-05-12 13:02:53',1),(412,7,'GLOBAL','A','2023-05-12 13:02:53',1),(413,7,'GO','A','2023-05-12 13:02:53',1),(414,7,'GOTO','A','2023-05-12 13:02:53',1),(415,7,'GRANT','A','2023-05-12 13:02:53',1),(416,7,'GRANTED','A','2023-05-12 13:02:53',1),(417,7,'GRANTS','A','2023-05-12 13:02:53',1),(418,7,'GREATEST','A','2023-05-12 13:02:54',1),(419,7,'GROUP','A','2023-05-12 13:02:54',1),(420,7,'GROUPING','A','2023-05-12 13:02:54',1),(421,7,'HANDLER','A','2023-05-12 13:02:54',1),(422,7,'HAVING','A','2023-05-12 13:02:54',1),(423,7,'HEADER','A','2023-05-12 13:02:54',1),(424,7,'HEAP','A','2023-05-12 13:02:54',1),(425,7,'HIERARCHY','A','2023-05-12 13:02:54',1),(426,7,'HIGH_PRIORITY','A','2023-05-12 13:02:54',1),(427,7,'HOLD','A','2023-05-12 13:02:54',1),(428,7,'HOLDLOCK','A','2023-05-12 13:02:54',1),(429,7,'HOST','A','2023-05-12 13:02:54',1),(430,7,'HOSTS','A','2023-05-12 13:02:54',1),(431,7,'HOUR','A','2023-05-12 13:02:54',1),(432,7,'HOUR_MICROSECOND','A','2023-05-12 13:02:54',1),(433,7,'HOUR_MINUTE','A','2023-05-12 13:02:54',1),(434,7,'HOUR_SECOND','A','2023-05-12 13:02:54',1),(435,7,'IDENTIFIED','A','2023-05-12 13:02:54',1),(436,7,'IDENTITY','A','2023-05-12 13:02:54',1),(437,7,'IDENTITY_INSERT','A','2023-05-12 13:02:54',1),(438,7,'IDENTITYCOL','A','2023-05-12 13:02:54',1),(439,7,'IF','A','2023-05-12 13:02:54',1),(440,7,'IGNORE','A','2023-05-12 13:02:54',1),(441,7,'ILIKE','A','2023-05-12 13:02:54',1),(442,7,'IMMEDIATE','A','2023-05-12 13:02:54',1),(443,7,'IMMUTABLE','A','2023-05-12 13:02:54',1),(444,7,'IMPLEMENTATION','A','2023-05-12 13:02:55',1),(445,7,'IMPLICIT','A','2023-05-12 13:02:55',1),(446,7,'IN','A','2023-05-12 13:02:55',1),(447,7,'INCLUDE','A','2023-05-12 13:02:55',1),(448,7,'INCLUDING','A','2023-05-12 13:02:55',1),(449,7,'INCREMENT','A','2023-05-12 13:02:55',1),(450,7,'INDEX','A','2023-05-12 13:02:55',1),(451,7,'INDICATOR','A','2023-05-12 13:02:55',1),(452,7,'INFILE','A','2023-05-12 13:02:55',1),(453,7,'INFIX','A','2023-05-12 13:02:55',1),(454,7,'INHERIT','A','2023-05-12 13:02:55',1),(455,7,'INHERITS','A','2023-05-12 13:02:55',1),(456,7,'INITIAL','A','2023-05-12 13:02:55',1),(457,7,'INITIALIZE','A','2023-05-12 13:02:55',1),(458,7,'INITIALLY','A','2023-05-12 13:02:55',1),(459,7,'INNER','A','2023-05-12 13:02:55',1),(460,7,'INOUT','A','2023-05-12 13:02:55',1),(461,7,'INPUT','A','2023-05-12 13:02:55',1),(462,7,'INSENSITIVE','A','2023-05-12 13:02:55',1),(463,7,'INSERT','A','2023-05-12 13:02:55',1),(464,7,'INSERT_ID','A','2023-05-12 13:02:55',1),(465,7,'INSTANCE','A','2023-05-12 13:02:55',1),(466,7,'INSTANTIABLE','A','2023-05-12 13:02:55',1),(467,7,'INSTEAD','A','2023-05-12 13:02:55',1),(468,7,'INT','A','2023-05-12 13:02:55',1),(469,7,'INT1','A','2023-05-12 13:02:56',1),(470,7,'INT2','A','2023-05-12 13:02:56',1),(471,7,'INT3','A','2023-05-12 13:02:56',1),(472,7,'INT4','A','2023-05-12 13:02:56',1),(473,7,'INT8','A','2023-05-12 13:02:56',1),(474,7,'INTEGER','A','2023-05-12 13:02:56',1),(475,7,'INTERSECT','A','2023-05-12 13:02:56',1),(476,7,'INTERSECTION','A','2023-05-12 13:02:56',1),(477,7,'INTERVAL','A','2023-05-12 13:02:56',1),(478,7,'INTO','A','2023-05-12 13:02:56',1),(479,7,'INVOKER','A','2023-05-12 13:02:56',1),(480,7,'IS','A','2023-05-12 13:02:56',1),(481,7,'ISAM','A','2023-05-12 13:02:56',1),(482,7,'ISNULL','A','2023-05-12 13:02:56',1),(483,7,'ISOLATION','A','2023-05-12 13:02:56',1),(484,7,'ITERATE','A','2023-05-12 13:02:57',1),(485,7,'JOIN','A','2023-05-12 13:02:57',1),(486,7,'K','A','2023-05-12 13:02:57',1),(487,7,'KEY','A','2023-05-12 13:02:57',1),(488,7,'KEY_MEMBER','A','2023-05-12 13:02:57',1),(489,7,'KEY_TYPE','A','2023-05-12 13:02:57',1),(490,7,'KEYS','A','2023-05-12 13:02:57',1),(491,7,'KILL','A','2023-05-12 13:02:57',1),(492,7,'LANCOMPILER','A','2023-05-12 13:02:57',1),(493,7,'LANGUAGE','A','2023-05-12 13:02:57',1),(494,7,'LARGE','A','2023-05-12 13:02:57',1),(495,7,'LAST','A','2023-05-12 13:02:57',1),(496,7,'LAST_INSERT_ID','A','2023-05-12 13:02:57',1),(497,7,'LATERAL','A','2023-05-12 13:02:57',1),(498,7,'LEADING','A','2023-05-12 13:02:57',1),(499,7,'LEAST','A','2023-05-12 13:02:57',1),(500,7,'LEAVE','A','2023-05-12 13:02:57',1),(501,7,'LEFT','A','2023-05-12 13:02:57',1),(502,7,'LENGTH','A','2023-05-12 13:02:57',1),(503,7,'LESS','A','2023-05-12 13:02:57',1),(504,7,'LEVEL','A','2023-05-12 13:02:57',1),(505,7,'LIKE','A','2023-05-12 13:02:57',1),(506,7,'LIMIT','A','2023-05-12 13:02:57',1),(507,7,'LINENO','A','2023-05-12 13:02:57',1),(508,7,'LINES','A','2023-05-12 13:02:57',1),(509,7,'LISTEN','A','2023-05-12 13:02:57',1),(510,7,'LN','A','2023-05-12 13:02:57',1),(511,7,'LOAD','A','2023-05-12 13:02:58',1),(512,7,'LOCAL','A','2023-05-12 13:02:58',1),(513,7,'LOCALTIME','A','2023-05-12 13:02:58',1),(514,7,'LOCALTIMESTAMP','A','2023-05-12 13:02:58',1),(515,7,'LOCATION','A','2023-05-12 13:02:58',1),(516,7,'LOCATOR','A','2023-05-12 13:02:58',1),(517,7,'LOCK','A','2023-05-12 13:02:58',1),(518,7,'LOGIN','A','2023-05-12 13:02:58',1),(519,7,'LOGS','A','2023-05-12 13:02:58',1),(520,7,'LONG','A','2023-05-12 13:02:58',1),(521,7,'LONGBLOB','A','2023-05-12 13:02:58',1),(522,7,'LONGTEXT','A','2023-05-12 13:02:58',1),(523,7,'LOOP','A','2023-05-12 13:02:58',1),(524,7,'LOW_PRIORITY','A','2023-05-12 13:02:58',1),(525,7,'LOWER','A','2023-05-12 13:02:59',1),(526,7,'M','A','2023-05-12 13:02:59',1),(527,7,'MAP','A','2023-05-12 13:02:59',1),(528,7,'MATCH','A','2023-05-12 13:02:59',1),(529,7,'MATCHED','A','2023-05-12 13:02:59',1),(530,7,'MAX','A','2023-05-12 13:02:59',1),(531,7,'MAX_ROWS','A','2023-05-12 13:02:59',1),(532,7,'MAXEXTENTS','A','2023-05-12 13:02:59',1),(533,7,'MAXVALUE','A','2023-05-12 13:02:59',1),(534,7,'MEDIUMBLOB','A','2023-05-12 13:02:59',1),(535,7,'MEDIUMINT','A','2023-05-12 13:02:59',1),(536,7,'MEDIUMTEXT','A','2023-05-12 13:02:59',1),(537,7,'MEMBER','A','2023-05-12 13:02:59',1),(538,7,'MERGE','A','2023-05-12 13:02:59',1),(539,7,'MESSAGE_LENGTH','A','2023-05-12 13:02:59',1),(540,7,'MESSAGE_OCTET_LENGTH','A','2023-05-12 13:02:59',1),(541,7,'MESSAGE_TEXT','A','2023-05-12 13:02:59',1),(542,7,'METHOD','A','2023-05-12 13:02:59',1),(543,7,'MIDDLEINT','A','2023-05-12 13:02:59',1),(544,7,'MIN','A','2023-05-12 13:02:59',1),(545,7,'MIN_ROWS','A','2023-05-12 13:02:59',1),(546,7,'MINUS','A','2023-05-12 13:02:59',1),(547,7,'MINUTE','A','2023-05-12 13:02:59',1),(548,7,'MINUTE_MICROSECOND','A','2023-05-12 13:02:59',1),(549,7,'MINUTE_SECOND','A','2023-05-12 13:03:00',1),(550,7,'MINVALUE','A','2023-05-12 13:03:00',1),(551,7,'MLSLABEL','A','2023-05-12 13:03:00',1),(552,7,'MOD','A','2023-05-12 13:03:00',1),(553,7,'MODE','A','2023-05-12 13:03:00',1),(554,7,'MODIFIES','A','2023-05-12 13:03:00',1),(555,7,'MODIFY','A','2023-05-12 13:03:00',1),(556,7,'MODULE','A','2023-05-12 13:03:01',1),(557,7,'MONTH','A','2023-05-12 13:03:01',1),(558,7,'MONTHNAME','A','2023-05-12 13:03:01',1),(559,7,'MORE','A','2023-05-12 13:03:01',1),(560,7,'MOVE','A','2023-05-12 13:03:01',1),(561,7,'MULTISET','A','2023-05-12 13:03:01',1),(562,7,'MUMPS','A','2023-05-12 13:03:01',1),(563,7,'MYISAM','A','2023-05-12 13:03:01',1),(564,7,'NAME','A','2023-05-12 13:03:01',1),(565,7,'NAMES','A','2023-05-12 13:03:01',1),(566,7,'NATIONAL','A','2023-05-12 13:03:01',1),(567,7,'NATURAL','A','2023-05-12 13:03:01',1),(568,7,'NCHAR','A','2023-05-12 13:03:01',1),(569,7,'NCLOB','A','2023-05-12 13:03:01',1),(570,7,'NESTING','A','2023-05-12 13:03:01',1),(571,7,'NEW','A','2023-05-12 13:03:01',1),(572,7,'NEXT','A','2023-05-12 13:03:01',1),(573,7,'NO','A','2023-05-12 13:03:01',1),(574,7,'NO_WRITE_TO_BINLOG','A','2023-05-12 13:03:01',1),(575,7,'NOAUDIT','A','2023-05-12 13:03:01',1),(576,7,'NOCHECK','A','2023-05-12 13:03:01',1),(577,7,'NOCOMPRESS','A','2023-05-12 13:03:01',1),(578,7,'NOCREATEDB','A','2023-05-12 13:03:01',1),(579,7,'NOCREATEROLE','A','2023-05-12 13:03:01',1),(580,7,'NOCREATEUSER','A','2023-05-12 13:03:02',1),(581,7,'NOINHERIT','A','2023-05-12 13:03:02',1),(582,7,'NOLOGIN','A','2023-05-12 13:03:02',1),(583,7,'NONCLUSTERED','A','2023-05-12 13:03:02',1),(584,7,'NONE','A','2023-05-12 13:03:02',1),(585,7,'NORMALIZE','A','2023-05-12 13:03:02',1),(586,7,'NORMALIZED','A','2023-05-12 13:03:02',1),(587,7,'NOSUPERUSER','A','2023-05-12 13:03:02',1),(588,7,'NOT','A','2023-05-12 13:03:02',1),(589,7,'NOTHING','A','2023-05-12 13:03:02',1),(590,7,'NOTIFY','A','2023-05-12 13:03:02',1),(591,7,'NOTNULL','A','2023-05-12 13:03:02',1),(592,7,'NOWAIT','A','2023-05-12 13:03:02',1),(593,7,'NULL','A','2023-05-12 13:03:02',1),(594,7,'NULLABLE','A','2023-05-12 13:03:02',1),(595,7,'NULLIF','A','2023-05-12 13:03:02',1),(596,7,'NULLS','A','2023-05-12 13:03:02',1),(597,7,'NUMBER','A','2023-05-12 13:03:02',1),(598,7,'NUMERIC','A','2023-05-12 13:03:02',1),(599,7,'OBJECT','A','2023-05-12 13:03:02',1),(600,7,'OCTET_LENGTH','A','2023-05-12 13:03:02',1),(601,7,'OCTETS','A','2023-05-12 13:03:02',1),(602,7,'OF','A','2023-05-12 13:03:02',1),(603,7,'OFF','A','2023-05-12 13:03:02',1),(604,7,'OFFLINE','A','2023-05-12 13:03:03',1),(605,7,'OFFSET','A','2023-05-12 13:03:03',1),(606,7,'OFFSETS','A','2023-05-12 13:03:03',1),(607,7,'OIDS','A','2023-05-12 13:03:03',1),(608,7,'OLD','A','2023-05-12 13:03:03',1),(609,7,'ON','A','2023-05-12 13:03:03',1),(610,7,'ONLINE','A','2023-05-12 13:03:03',1),(611,7,'ONLY','A','2023-05-12 13:03:03',1),(612,7,'OPEN','A','2023-05-12 13:03:03',1),(613,7,'OPENDATASOURCE','A','2023-05-12 13:03:03',1),(614,7,'OPENQUERY','A','2023-05-12 13:03:03',1),(615,7,'OPENROWSET','A','2023-05-12 13:03:03',1),(616,7,'OPENXML','A','2023-05-12 13:03:03',1),(617,7,'OPERATION','A','2023-05-12 13:03:03',1),(618,7,'OPERATOR','A','2023-05-12 13:03:03',1),(619,7,'OPTIMIZE','A','2023-05-12 13:03:03',1),(620,7,'OPTION','A','2023-05-12 13:03:04',1),(621,7,'OPTIONALLY','A','2023-05-12 13:03:04',1),(622,7,'OPTIONS','A','2023-05-12 13:03:04',1),(623,7,'OR','A','2023-05-12 13:03:04',1),(624,7,'ORDER','A','2023-05-12 13:03:04',1),(625,7,'ORDERING','A','2023-05-12 13:03:04',1),(626,7,'ORDINALITY','A','2023-05-12 13:03:04',1),(627,7,'OTHERS','A','2023-05-12 13:03:04',1),(628,7,'OUT','A','2023-05-12 13:03:04',1),(629,7,'OUTER','A','2023-05-12 13:03:04',1),(630,7,'OUTFILE','A','2023-05-12 13:03:05',1),(631,7,'OUTPUT','A','2023-05-12 13:03:05',1),(632,7,'OVER','A','2023-05-12 13:03:05',1),(633,7,'OVERLAPS','A','2023-05-12 13:03:05',1),(634,7,'OVERLAY','A','2023-05-12 13:03:05',1),(635,7,'OVERRIDING','A','2023-05-12 13:03:05',1),(636,7,'OWNER','A','2023-05-12 13:03:05',1),(637,7,'PACK_KEYS','A','2023-05-12 13:03:05',1),(638,7,'PAD','A','2023-05-12 13:03:05',1),(639,7,'PARAMETER','A','2023-05-12 13:03:05',1),(640,7,'PARAMETER_MODE','A','2023-05-12 13:03:05',1),(641,7,'PARAMETER_NAME','A','2023-05-12 13:03:05',1),(642,7,'PARAMETER_ORDINAL_POSITION','A','2023-05-12 13:03:05',1),(643,7,'PARAMETER_SPECIFIC_CATALOG','A','2023-05-12 13:03:05',1),(644,7,'PARAMETER_SPECIFIC_NAME','A','2023-05-12 13:03:05',1),(645,7,'PARAMETER_SPECIFIC_SCHEMA','A','2023-05-12 13:03:05',1),(646,7,'PARAMETERS','A','2023-05-12 13:03:05',1),(647,7,'PARTIAL','A','2023-05-12 13:03:05',1),(648,7,'PARTITION','A','2023-05-12 13:03:05',1),(649,7,'PASCAL','A','2023-05-12 13:03:05',1),(650,7,'PASSword','A','2023-05-12 13:03:05',1),(651,7,'PATH','A','2023-05-12 13:03:05',1),(652,7,'PCTFREE','A','2023-05-12 13:03:05',1),(653,7,'PERCENT','A','2023-05-12 13:03:06',1),(654,7,'PERCENT_RANK','A','2023-05-12 13:03:06',1),(655,7,'PERCENTILE_CONT','A','2023-05-12 13:03:06',1),(656,7,'PERCENTILE_DISC','A','2023-05-12 13:03:06',1),(657,7,'PLACING','A','2023-05-12 13:03:06',1),(658,7,'PLAN','A','2023-05-12 13:03:06',1),(659,7,'PLI','A','2023-05-12 13:03:06',1),(660,7,'POSITION','A','2023-05-12 13:03:06',1),(661,7,'POSTFIX','A','2023-05-12 13:03:06',1),(662,7,'POWER','A','2023-05-12 13:03:06',1),(663,7,'PRECEDING','A','2023-05-12 13:03:06',1),(664,7,'PRECISION','A','2023-05-12 13:03:06',1),(665,7,'PREFIX','A','2023-05-12 13:03:07',1),(666,7,'PREORDER','A','2023-05-12 13:03:07',1),(667,7,'PREPARE','A','2023-05-12 13:03:07',1),(668,7,'PREPARED','A','2023-05-12 13:03:07',1),(669,7,'PRESERVE','A','2023-05-12 13:03:07',1),(670,7,'PRIMARY','A','2023-05-12 13:03:07',1),(671,7,'PRINT','A','2023-05-12 13:03:07',1),(672,7,'PRIOR','A','2023-05-12 13:03:07',1),(673,7,'PRIVILEGES','A','2023-05-12 13:03:07',1),(674,7,'PROC','A','2023-05-12 13:03:07',1),(675,7,'PROCEDURAL','A','2023-05-12 13:03:07',1),(676,7,'PROCEDURE','A','2023-05-12 13:03:07',1),(677,7,'PROCESS','A','2023-05-12 13:03:07',1),(678,7,'PROCESSLIST','A','2023-05-12 13:03:07',1),(679,7,'PUBLIC','A','2023-05-12 13:03:07',1),(680,7,'PURGE','A','2023-05-12 13:03:07',1),(681,7,'QUOTE','A','2023-05-12 13:03:07',1),(682,7,'RAID0','A','2023-05-12 13:03:08',1),(683,7,'RAISERROR','A','2023-05-12 13:03:08',1),(684,7,'RANGE','A','2023-05-12 13:03:08',1),(685,7,'RANK','A','2023-05-12 13:03:08',1),(686,7,'RAW','A','2023-05-12 13:03:08',1),(687,7,'READ','A','2023-05-12 13:03:08',1),(688,7,'READS','A','2023-05-12 13:03:08',1),(689,7,'READTEXT','A','2023-05-12 13:03:08',1),(690,7,'REAL','A','2023-05-12 13:03:08',1),(691,7,'RECHECK','A','2023-05-12 13:03:08',1),(692,7,'RECONFIGURE','A','2023-05-12 13:03:08',1),(693,7,'RECURSIVE','A','2023-05-12 13:03:08',1),(694,7,'REF','A','2023-05-12 13:03:08',1),(695,7,'REFERENCES','A','2023-05-12 13:03:08',1),(696,7,'REFERENCING','A','2023-05-12 13:03:09',1),(697,7,'REGEXP','A','2023-05-12 13:03:09',1),(698,7,'REGR_AVGX','A','2023-05-12 13:03:09',1),(699,7,'REGR_AVGY','A','2023-05-12 13:03:09',1),(700,7,'REGR_COUNT','A','2023-05-12 13:03:09',1),(701,7,'REGR_INTERCEPT','A','2023-05-12 13:03:09',1),(702,7,'REGR_R2','A','2023-05-12 13:03:09',1),(703,7,'REGR_SLOPE','A','2023-05-12 13:03:09',1),(704,7,'REGR_SXX','A','2023-05-12 13:03:09',1),(705,7,'REGR_SXY','A','2023-05-12 13:03:09',1),(706,7,'REGR_SYY','A','2023-05-12 13:03:09',1),(707,7,'REINDEX','A','2023-05-12 13:03:09',1),(708,7,'RELATIVE','A','2023-05-12 13:03:09',1),(709,7,'RELEASE','A','2023-05-12 13:03:09',1),(710,7,'RELOAD','A','2023-05-12 13:03:09',1),(711,7,'RENAME','A','2023-05-12 13:03:09',1),(712,7,'REPEAT','A','2023-05-12 13:03:10',1),(713,7,'REPEATABLE','A','2023-05-12 13:03:10',1),(714,7,'REPLACE','A','2023-05-12 13:03:10',1),(715,7,'REPLICATION','A','2023-05-12 13:03:10',1),(716,7,'REQUIRE','A','2023-05-12 13:03:10',1),(717,7,'RESET','A','2023-05-12 13:03:10',1),(718,7,'RESIGNAL','A','2023-05-12 13:03:10',1),(719,7,'RESOURCE','A','2023-05-12 13:03:10',1),(720,7,'RESTART','A','2023-05-12 13:03:10',1),(721,7,'RESTORE','A','2023-05-12 13:03:10',1),(722,7,'RESTRICT','A','2023-05-12 13:03:10',1),(723,7,'RESULT','A','2023-05-12 13:03:10',1),(724,7,'RETURN','A','2023-05-12 13:03:10',1),(725,7,'RETURNED_CARDINALITY','A','2023-05-12 13:03:10',1),(726,7,'RETURNED_LENGTH','A','2023-05-12 13:03:10',1),(727,7,'RETURNED_OCTET_LENGTH','A','2023-05-12 13:03:10',1),(728,7,'RETURNED_SQLSTATE','A','2023-05-12 13:03:10',1),(729,7,'RETURNS','A','2023-05-12 13:03:10',1),(730,7,'REVOKE','A','2023-05-12 13:03:11',1),(731,7,'RIGHT','A','2023-05-12 13:03:11',1),(732,7,'RLIKE','A','2023-05-12 13:03:11',1),(733,7,'ROLE','A','2023-05-12 13:03:11',1),(734,7,'ROLLBACK','A','2023-05-12 13:03:11',1),(735,7,'ROLLUP','A','2023-05-12 13:03:11',1),(736,7,'ROUTINE','A','2023-05-12 13:03:11',1),(737,7,'ROUTINE_CATALOG','A','2023-05-12 13:03:11',1),(738,7,'ROUTINE_NAME','A','2023-05-12 13:03:11',1),(739,7,'ROUTINE_SCHEMA','A','2023-05-12 13:03:11',1),(740,7,'ROW','A','2023-05-12 13:03:11',1),(741,7,'ROW_COUNT','A','2023-05-12 13:03:11',1),(742,7,'ROW_NUMBER','A','2023-05-12 13:03:11',1),(743,7,'ROWCOUNT','A','2023-05-12 13:03:11',1),(744,7,'ROWGUIDCOL','A','2023-05-12 13:03:11',1),(745,7,'ROWID','A','2023-05-12 13:03:11',1),(746,7,'ROWNUM','A','2023-05-12 13:03:11',1),(747,7,'ROWS','A','2023-05-12 13:03:12',1),(748,7,'RULE','A','2023-05-12 13:03:12',1),(749,7,'SAVE','A','2023-05-12 13:03:12',1),(750,7,'SAVEPOINT','A','2023-05-12 13:03:12',1),(751,7,'SCALE','A','2023-05-12 13:03:12',1),(752,7,'SCHEMA','A','2023-05-12 13:03:12',1),(753,7,'SCHEMA_NAME','A','2023-05-12 13:03:12',1),(754,7,'SCHEMAS','A','2023-05-12 13:03:12',1),(755,7,'SCOPE','A','2023-05-12 13:03:12',1),(756,7,'SCOPE_CATALOG','A','2023-05-12 13:03:12',1),(757,7,'SCOPE_NAME','A','2023-05-12 13:03:12',1),(758,7,'SCOPE_SCHEMA','A','2023-05-12 13:03:12',1),(759,7,'SCROLL','A','2023-05-12 13:03:12',1),(760,7,'SEARCH','A','2023-05-12 13:03:12',1),(761,7,'SECOND','A','2023-05-12 13:03:12',1),(762,7,'SECOND_MICROSECOND','A','2023-05-12 13:03:12',1),(763,7,'SECTION','A','2023-05-12 13:03:12',1),(764,7,'SECURITY','A','2023-05-12 13:03:12',1),(765,7,'SELECT','A','2023-05-12 13:03:12',1),(766,7,'SELF','A','2023-05-12 13:03:12',1),(767,7,'SENSITIVE','A','2023-05-12 13:03:12',1),(768,7,'SEPARATOR','A','2023-05-12 13:03:13',1),(769,7,'SEQUENCE','A','2023-05-12 13:03:13',1),(770,7,'SERIALIZABLE','A','2023-05-12 13:03:13',1),(771,7,'SERVER_NAME','A','2023-05-12 13:03:13',1),(772,7,'SESSION','A','2023-05-12 13:03:13',1),(773,7,'SESSION_USER','A','2023-05-12 13:03:13',1),(774,7,'SET','A','2023-05-12 13:03:13',1),(775,7,'SETOF','A','2023-05-12 13:03:13',1),(776,7,'SETS','A','2023-05-12 13:03:13',1),(777,7,'SETUSER','A','2023-05-12 13:03:13',1),(778,7,'SHARE','A','2023-05-12 13:03:13',1),(779,7,'SHOW','A','2023-05-12 13:03:13',1),(780,7,'SHUTDOWN','A','2023-05-12 13:03:13',1),(781,7,'SIGNAL','A','2023-05-12 13:03:13',1),(782,7,'SIMILAR','A','2023-05-12 13:03:13',1),(783,7,'SIMPLE','A','2023-05-12 13:03:13',1),(784,7,'SIZE','A','2023-05-12 13:03:13',1),(785,7,'SMALLINT','A','2023-05-12 13:03:13',1),(786,7,'SOME','A','2023-05-12 13:03:13',1),(787,7,'SONAME','A','2023-05-12 13:03:13',1),(788,7,'SOURCE','A','2023-05-12 13:03:13',1),(789,7,'SPACE','A','2023-05-12 13:03:14',1),(790,7,'SPATIAL','A','2023-05-12 13:03:14',1),(791,7,'SPECIFIC','A','2023-05-12 13:03:14',1),(792,7,'SPECIFIC_NAME','A','2023-05-12 13:03:14',1),(793,7,'SPECIFICTYPE','A','2023-05-12 13:03:14',1),(794,7,'SQL','A','2023-05-12 13:03:14',1),(795,7,'SQL_BIG_RESULT','A','2023-05-12 13:03:14',1),(796,7,'SQL_BIG_SELECTS','A','2023-05-12 13:03:14',1),(797,7,'SQL_BIG_TABLES','A','2023-05-12 13:03:14',1),(798,7,'SQL_CALC_FOUND_ROWS','A','2023-05-12 13:03:14',1),(799,7,'SQL_LOG_OFF','A','2023-05-12 13:03:14',1),(800,7,'SQL_LOG_UPDATE','A','2023-05-12 13:03:14',1),(801,7,'SQL_LOW_PRIORITY_UPDATES','A','2023-05-12 13:03:14',1),(802,7,'SQL_SELECT_LIMIT','A','2023-05-12 13:03:14',1),(803,7,'SQL_SMALL_RESULT','A','2023-05-12 13:03:14',1),(804,7,'SQL_WARNINGS','A','2023-05-12 13:03:14',1),(805,7,'SQLCA','A','2023-05-12 13:03:14',1),(806,7,'SQLCODE','A','2023-05-12 13:03:14',1),(807,7,'SQLERROR','A','2023-05-12 13:03:14',1),(808,7,'SQLEXCEPTION','A','2023-05-12 13:03:15',1),(809,7,'SQLSTATE','A','2023-05-12 13:03:15',1),(810,7,'SQLWARNING','A','2023-05-12 13:03:15',1),(811,7,'SQRT','A','2023-05-12 13:03:15',1),(812,7,'SSL','A','2023-05-12 13:03:15',1),(813,7,'STABLE','A','2023-05-12 13:03:15',1),(814,7,'START','A','2023-05-12 13:03:15',1),(815,7,'STARTING','A','2023-05-12 13:03:15',1),(816,7,'STATE','A','2023-05-12 13:03:15',1),(817,7,'STATEMENT','A','2023-05-12 13:03:15',1),(818,7,'STATIC','A','2023-05-12 13:03:15',1),(819,7,'STATISTICS','A','2023-05-12 13:03:15',1),(820,7,'STATUS','A','2023-05-12 13:03:15',1),(821,7,'STDDEV_POP','A','2023-05-12 13:03:15',1),(822,7,'STDDEV_SAMP','A','2023-05-12 13:03:15',1),(823,7,'STDIN','A','2023-05-12 13:03:15',1),(824,7,'STDOUT','A','2023-05-12 13:03:15',1),(825,7,'STORAGE','A','2023-05-12 13:03:15',1),(826,7,'STRAIGHT_JOIN','A','2023-05-12 13:03:15',1),(827,7,'STRICT','A','2023-05-12 13:03:15',1),(828,7,'STRING','A','2023-05-12 13:03:15',1),(829,7,'STRUCTURE','A','2023-05-12 13:03:16',1),(830,7,'STYLE','A','2023-05-12 13:03:16',1),(831,7,'SUBCLASS_ORIGIN','A','2023-05-12 13:03:16',1),(832,7,'SUBLIST','A','2023-05-12 13:03:16',1),(833,7,'SUBMULTISET','A','2023-05-12 13:03:16',1),(834,7,'SUBSTRING','A','2023-05-12 13:03:16',1),(835,7,'SUCCESSFUL','A','2023-05-12 13:03:16',1),(836,7,'SUM','A','2023-05-12 13:03:16',1),(837,7,'SUPERUSER','A','2023-05-12 13:03:16',1),(838,7,'SYMMETRIC','A','2023-05-12 13:03:16',1),(839,7,'SYNONYM','A','2023-05-12 13:03:16',1),(840,7,'SYSDATE','A','2023-05-12 13:03:16',1),(841,7,'SYSID','A','2023-05-12 13:03:16',1),(842,7,'SYSTEM','A','2023-05-12 13:03:16',1),(843,7,'SYSTEM_USER','A','2023-05-12 13:03:16',1),(844,7,'TABLE','A','2023-05-12 13:03:16',1),(845,7,'TABLE_NAME','A','2023-05-12 13:03:16',1),(846,7,'TABLES','A','2023-05-12 13:03:16',1),(847,7,'TABLESAMPLE','A','2023-05-12 13:03:16',1),(848,7,'TABLESPACE','A','2023-05-12 13:03:16',1),(849,7,'TEMP','A','2023-05-12 13:03:16',1),(850,7,'TEMPLATE','A','2023-05-12 13:03:17',1),(851,7,'TEMPORARY','A','2023-05-12 13:03:17',1),(852,7,'TERMINATE','A','2023-05-12 13:03:17',1),(853,7,'TERMINATED','A','2023-05-12 13:03:17',1),(854,7,'TEXT','A','2023-05-12 13:03:17',1),(855,7,'TEXTSIZE','A','2023-05-12 13:03:17',1),(856,7,'THAN','A','2023-05-12 13:03:17',1),(857,7,'THEN','A','2023-05-12 13:03:17',1),(858,7,'TIES','A','2023-05-12 13:03:17',1),(859,7,'TIME','A','2023-05-12 13:03:17',1),(860,7,'TIMESTAMP','A','2023-05-12 13:03:17',1),(861,7,'TIMEZONE_HOUR','A','2023-05-12 13:03:17',1),(862,7,'TIMEZONE_MINUTE','A','2023-05-12 13:03:17',1),(863,7,'TINYBLOB','A','2023-05-12 13:03:17',1),(864,7,'TINYINT','A','2023-05-12 13:03:17',1),(865,7,'TINYTEXT','A','2023-05-12 13:03:17',1),(866,7,'TO','A','2023-05-12 13:03:17',1),(867,7,'TOAST','A','2023-05-12 13:03:18',1),(868,7,'TOP','A','2023-05-12 13:03:18',1),(869,7,'TOP_LEVEL_COUNT','A','2023-05-12 13:03:18',1),(870,7,'TRAILING','A','2023-05-12 13:03:18',1),(871,7,'TRAN','A','2023-05-12 13:03:18',1),(872,7,'TRANSACTION','A','2023-05-12 13:03:18',1),(873,7,'TRANSACTION_ACTIVE','A','2023-05-12 13:03:18',1),(874,7,'TRANSACTIONS_COMMITTED','A','2023-05-12 13:03:18',1),(875,7,'TRANSACTIONS_ROLLED_BACK','A','2023-05-12 13:03:18',1),(876,7,'TRANSFORM','A','2023-05-12 13:03:18',1),(877,7,'TRANSFORMS','A','2023-05-12 13:03:18',1),(878,7,'TRANSLATE','A','2023-05-12 13:03:18',1),(879,7,'TRANSLATION','A','2023-05-12 13:03:18',1),(880,7,'TREAT','A','2023-05-12 13:03:18',1),(881,7,'TRIGGER','A','2023-05-12 13:03:18',1),(882,7,'TRIGGER_CATALOG','A','2023-05-12 13:03:18',1),(883,7,'TRIGGER_NAME','A','2023-05-12 13:03:18',1),(884,7,'TRIGGER_SCHEMA','A','2023-05-12 13:03:18',1),(885,7,'TRIM','A','2023-05-12 13:03:18',1),(886,7,'TRUE','A','2023-05-12 13:03:19',1),(887,7,'TRUNCATE','A','2023-05-12 13:03:19',1),(888,7,'TRUSTED','A','2023-05-12 13:03:19',1),(889,7,'TSEQUAL','A','2023-05-12 13:03:19',1),(890,7,'TYPE','A','2023-05-12 13:03:19',1),(891,7,'UESCAPE','A','2023-05-12 13:03:19',1),(892,7,'UID','A','2023-05-12 13:03:19',1),(893,7,'UNBOUNDED','A','2023-05-12 13:03:19',1),(894,7,'UNCOMMITTED','A','2023-05-12 13:03:19',1),(895,7,'UNDER','A','2023-05-12 13:03:19',1),(896,7,'UNDO','A','2023-05-12 13:03:19',1),(897,7,'UNENCRYPTED','A','2023-05-12 13:03:19',1),(898,7,'UNION','A','2023-05-12 13:03:19',1),(899,7,'UNIQUE','A','2023-05-12 13:03:19',1),(900,7,'UNKNOWN','A','2023-05-12 13:03:19',1),(901,7,'UNLISTEN','A','2023-05-12 13:03:19',1),(902,7,'UNLOCK','A','2023-05-12 13:03:19',1),(903,7,'UNNAMED','A','2023-05-12 13:03:20',1),(904,7,'UNNEST','A','2023-05-12 13:03:20',1),(905,7,'UNSIGNED','A','2023-05-12 13:03:20',1),(906,7,'UNTIL','A','2023-05-12 13:03:20',1),(907,7,'UPDATE','A','2023-05-12 13:03:20',1),(908,7,'UPDATETEXT','A','2023-05-12 13:03:20',1),(909,7,'UPPER','A','2023-05-12 13:03:20',1),(910,7,'USAGE','A','2023-05-12 13:03:20',1),(911,7,'USE','A','2023-05-12 13:03:20',1),(912,7,'USER','A','2023-05-12 13:03:20',1),(913,7,'USER_DEFINED_TYPE_CATALOG','A','2023-05-12 13:03:20',1),(914,7,'USER_DEFINED_TYPE_CODE','A','2023-05-12 13:03:20',1),(915,7,'USER_DEFINED_TYPE_NAME','A','2023-05-12 13:03:20',1),(916,7,'USER_DEFINED_TYPE_SCHEMA','A','2023-05-12 13:03:20',1),(917,7,'USING','A','2023-05-12 13:03:20',1),(918,7,'UTC_DATE','A','2023-05-12 13:03:20',1),(919,7,'UTC_TIME','A','2023-05-12 13:03:21',1),(920,7,'UTC_TIMESTAMP','A','2023-05-12 13:03:21',1),(921,7,'VACUUM','A','2023-05-12 13:03:21',1),(922,7,'VALID','A','2023-05-12 13:03:21',1),(923,7,'VALIDATE','A','2023-05-12 13:03:21',1),(924,7,'VALIDATOR','A','2023-05-12 13:03:21',1),(925,7,'VALUE','A','2023-05-12 13:03:21',1),(926,7,'VALUES','A','2023-05-12 13:03:21',1),(927,7,'VAR_POP','A','2023-05-12 13:03:21',1),(928,7,'VAR_SAMP','A','2023-05-12 13:03:21',1),(929,7,'VARBINARY','A','2023-05-12 13:03:21',1),(930,7,'VARCHAR','A','2023-05-12 13:03:21',1),(931,7,'VARCHAR2','A','2023-05-12 13:03:21',1),(932,7,'VARCHARACTER','A','2023-05-12 13:03:21',1),(933,7,'VARIABLE','A','2023-05-12 13:03:21',1),(934,7,'VARIABLES','A','2023-05-12 13:03:21',1),(935,7,'VARYING','A','2023-05-12 13:03:21',1),(936,7,'VERBOSE','A','2023-05-12 13:03:21',1),(937,7,'VIEW','A','2023-05-12 13:03:22',1),(938,7,'VOLATILE','A','2023-05-12 13:03:22',1),(939,7,'WAITFOR','A','2023-05-12 13:03:22',1),(940,7,'WHEN','A','2023-05-12 13:03:22',1),(941,7,'WHENEVER','A','2023-05-12 13:03:22',1),(942,7,'WHERE','A','2023-05-12 13:03:22',1),(943,7,'WHILE','A','2023-05-12 13:03:22',1),(944,7,'WIDTH_BUCKET','A','2023-05-12 13:03:22',1),(945,7,'WINDOW','A','2023-05-12 13:03:22',1),(946,7,'WITH','A','2023-05-12 13:03:22',1),(947,7,'WITHIN','A','2023-05-12 13:03:22',1),(948,7,'WITHOUT','A','2023-05-12 13:03:22',1),(949,7,'WORK','A','2023-05-12 13:03:22',1),(950,7,'WRITE','A','2023-05-12 13:03:22',1),(951,7,'WRITETEXT','A','2023-05-12 13:03:22',1),(952,7,'X509','A','2023-05-12 13:03:22',1),(953,7,'XOR','A','2023-05-12 13:03:22',1),(954,7,'YEAR','A','2023-05-12 13:03:22',1),(955,7,'YEAR_MONTH','A','2023-05-12 13:03:22',1),(956,7,'ZEROFILL','A','2023-05-12 13:03:23',1),(957,7,'ZONE','A','2023-05-12 13:03:23',1),(958,6,'->','A','2023-05-12 13:03:23',1),(959,6,'//','A','2023-05-12 13:03:23',1),(960,6,'[]','A','2023-05-12 13:03:23',1),(961,6,'P','A','2023-05-12 13:03:23',1),(962,6,'V','A','2023-05-12 13:03:23',1),(963,6,'af','A','2023-05-12 13:03:23',1),(964,6,'and','A','2023-05-12 13:03:23',1),(965,6,'any','A','2023-05-12 13:03:23',1),(966,6,'begin','A','2023-05-12 13:03:23',1),(967,6,'body','A','2023-05-12 13:03:23',1),(968,6,'bool','A','2023-05-12 13:03:23',1),(969,6,'by','A','2023-05-12 13:03:23',1),(970,6,'call','A','2023-05-12 13:03:23',1),(971,6,'cap','A','2023-05-12 13:03:23',1),(972,6,'char','A','2023-05-12 13:03:23',1),(973,6,'chars','A','2023-05-12 13:03:23',1),(974,6,'co','A','2023-05-12 13:03:23',1),(975,6,'const','A','2023-05-12 13:03:23',1),(976,6,'create','A','2023-05-12 13:03:23',1),(977,6,'destroy','A','2023-05-12 13:03:23',1),(978,6,'do','A','2023-05-12 13:03:23',1),(979,6,'downto','A','2023-05-12 13:03:23',1),(980,6,'else','A','2023-05-12 13:03:23',1),(981,6,'end','A','2023-05-12 13:03:23',1),(982,6,'enum','A','2023-05-12 13:03:23',1),(983,6,'exit','A','2023-05-12 13:03:23',1),(984,6,'extend','A','2023-05-12 13:03:23',1),(985,6,'external','A','2023-05-12 13:03:23',1),(986,6,'fa','A','2023-05-12 13:03:24',1),(987,6,'false','A','2023-05-12 13:03:24',1),(988,6,'fi','A','2023-05-12 13:03:24',1),(989,6,'file','A','2023-05-12 13:03:24',1),(990,6,'final','A','2023-05-12 13:03:24',1),(991,6,'forward','A','2023-05-12 13:03:24',1),(992,6,'global','A','2023-05-12 13:03:24',1),(993,6,'high','A','2023-05-12 13:03:24',1),(994,6,'if','A','2023-05-12 13:03:24',1),(995,6,'import','A','2023-05-12 13:03:24',1),(996,6,'in','A','2023-05-12 13:03:24',1),(997,6,'int','A','2023-05-12 13:03:24',1),(998,6,'low','A','2023-05-12 13:03:24',1),(999,6,'mod','A','2023-05-12 13:03:24',1),(1000,6,'new','A','2023-05-12 13:03:24',1),(1001,6,'next','A','2023-05-12 13:03:24',1),(1002,6,'ni','A','2023-05-12 13:03:24',1),(1003,6,'noop','A','2023-05-12 13:03:24',1),(1004,6,'not','A','2023-05-12 13:03:24',1),(1005,6,'null','A','2023-05-12 13:03:24',1),(1006,6,'oc','A','2023-05-12 13:03:24',1),(1007,6,'od','A','2023-05-12 13:03:24',1),(1008,6,'on','A','2023-05-12 13:03:24',1),(1009,6,'op','A','2023-05-12 13:03:24',1),(1010,6,'optype','A','2023-05-12 13:03:24',1),(1011,6,'or','A','2023-05-12 13:03:24',1),(1012,6,'proc','A','2023-05-12 13:03:24',1),(1013,6,'procedure','A','2023-05-12 13:03:24',1),(1014,6,'process','A','2023-05-12 13:03:24',1),(1015,6,'ptr','A','2023-05-12 13:03:24',1),(1016,6,'real','A','2023-05-12 13:03:24',1),(1017,6,'rec','A','2023-05-12 13:03:24',1),(1018,6,'receive','A','2023-05-12 13:03:24',1),(1019,6,'ref','A','2023-05-12 13:03:25',1),(1020,6,'reply','A','2023-05-12 13:03:25',1),(1021,6,'res','A','2023-05-12 13:03:25',1),(1022,6,'resource','A','2023-05-12 13:03:25',1),(1023,6,'return','A','2023-05-12 13:03:25',1),(1024,6,'returns','A','2023-05-12 13:03:25',1),(1025,6,'sem','A','2023-05-12 13:03:25',1),(1026,6,'send','A','2023-05-12 13:03:25',1),(1027,6,'separate','A','2023-05-12 13:03:25',1),(1028,6,'skip','A','2023-05-12 13:03:25',1),(1029,6,'st','A','2023-05-12 13:03:25',1),(1030,6,'stderr','A','2023-05-12 13:03:25',1),(1031,6,'stdin','A','2023-05-12 13:03:25',1),(1032,6,'stdout','A','2023-05-12 13:03:25',1),(1033,6,'stop','A','2023-05-12 13:03:25',1),(1034,6,'string','A','2023-05-12 13:03:25',1),(1035,6,'to','A','2023-05-12 13:03:25',1),(1036,6,'true','A','2023-05-12 13:03:25',1),(1037,6,'type','A','2023-05-12 13:03:25',1),(1038,6,'union','A','2023-05-12 13:03:25',1),(1039,6,'val','A','2023-05-12 13:03:25',1),(1040,6,'var','A','2023-05-12 13:03:25',1),(1041,6,'vm','A','2023-05-12 13:03:25',1),(1042,6,'xor','A','2023-05-12 13:03:25',1);
/*!40000 ALTER TABLE `word` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `wordlist`
--

DROP TABLE IF EXISTS `wordlist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wordlist` (
  `wordlistid` mediumint unsigned NOT NULL AUTO_INCREMENT,
  `wordlistname` varchar(24) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `updated` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `uid` int unsigned NOT NULL,
  PRIMARY KEY (`wordlistid`),
  KEY `uid` (`uid`),
  CONSTRAINT `wordlist_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `wordlist`
--

LOCK TABLES `wordlist` WRITE;
/*!40000 ALTER TABLE `wordlist` DISABLE KEYS */;
INSERT INTO `wordlist` VALUES (1,'JS','2023-05-12 13:01:43',1),(2,'PHP','2023-05-12 13:01:43',1),(3,'HTML','2023-05-12 13:01:43',1),(4,'Plain Text','2023-05-12 13:01:43',1),(5,'Java','2023-05-12 13:01:43',1),(6,'SR','2023-05-12 13:01:43',1),(7,'SQL','2023-05-12 13:01:43',1);
/*!40000 ALTER TABLE `wordlist` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `highscore_quiz_time`
--

/*!50001 DROP VIEW IF EXISTS `highscore_quiz_time`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `highscore_quiz_time` AS select `userAnswer`.`cid` AS `cid`,`userAnswer`.`quiz` AS `quiz`,`userAnswer`.`uid` AS `uid`,`userAnswer`.`grade` AS `grade`,`userAnswer`.`score` AS `score` from `userAnswer` order by `userAnswer`.`score` limit 10 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

--
-- Final view structure for view `studentresultCourse`
--

/*!50001 DROP VIEW IF EXISTS `studentresultCourse`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb3 */;
/*!50001 SET character_set_results     = utf8mb3 */;
/*!50001 SET collation_connection      = utf8mb3_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `studentresultCourse` AS select `partresult`.`uid` AS `username`,`partresult`.`cid` AS `cid`,`partresult`.`hp` AS `hp` from (`partresult` join `subparts` on(((`partresult`.`partname` = `subparts`.`partname`) and (`subparts`.`cid` = `partresult`.`cid`) and (`subparts`.`parthp` = `partresult`.`hp`)))) where (`partresult`.`grade` <> 'u') */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-05-12 13:07:12
