use quizsystem;
/*
drop table userLoginsLog;
*/

﻿CREATE TABLE userLoginsLog(
    id INTEGER AUTO_INCREMENT,
    loginName VARCHAR(16),
    userAgent VARCHAR(1024), /*$_SERVER['HTTP_USER_AGENT']*/
    userIP VARCHAR(20), /*$_SERVER['REMOTE_ADDR']*/
    DateTime TIMESTAMP,
	success VARCHAR(25),
	courseName VARCHAR(100),
	courseOccasion VARCHAR(25),
    quizNr INTEGER,
    PRIMARY KEY(id)
) ENGINE=INNODB CHARACTER SET utf8 COLLATE utf8_swedish_ci;
