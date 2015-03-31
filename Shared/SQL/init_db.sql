drop database imperious;
create database imperious;
use imperious;
/* user contains the users of the system and related  information */

CREATE TABLE user(
		uid					INT UNSIGNED NOT NULL AUTO_INCREMENT,
		username		VARCHAR(80) NOT NULL UNIQUE,
		firstname		VARCHAR(50) NULL,
		lastname		VARCHAR(50) NULL,
		ssn					VARCHAR(20) NULL,
		password		VARCHAR(225) NOT NULL,
		lastupdated	TIMESTAMP,
		addedtime   TIMESTAMP,
		lastvisit		TIMESTAMP,
		newpassword	TINYINT(1) NULL,
		creator			INT UNSIGNED NULL,
		superuser		TINYINT(1) NULL,
		PRIMARY KEY(uid)		
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO user(username,password,newpassword,creator,superuser) values ("Grimling","$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m",0,1,1);
INSERT INTO user(username,password,newpassword,creator) values ("Toddler","$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",0,1);
INSERT INTO user(username,password,newpassword,creator,ssn) values ("Tester", "$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",1,1,"111111-1111");

/* Course contains a list of the course names for each course in the database */
CREATE TABLE course(
		cid								INT UNSIGNED NOT NULL AUTO_INCREMENT,
		coursecode				VARCHAR(45) NULL UNIQUE,
		coursename				VARCHAR(80) NULL,
		created						DATETIME,
		creator						INT UNSIGNED NOT NULL,
		visibility				TINYINT UNSIGNED NOT NULL DEFAULT 0,
		updated						TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
		activeversion 		VARCHAR(8),
		activeedversion 	VARCHAR(8),
		PRIMARY KEY(cid),
		FOREIGN KEY (creator) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO course(coursecode,coursename,created,creator,visibility) values ("DV12G","Webbprogrammering",NOW(),1,1);
INSERT INTO course(coursecode,coursename,created,creator,visibility) values ("DV13G","Futhark",NOW(),1,0);

/* User access to the application*/
CREATE TABLE user_course(
		uid				INT UNSIGNED NOT NULL,
		cid				INT UNSIGNED NOT NULL, 
		modified 	TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		creator 	INTEGER,
		access		VARCHAR(10) NOT NULL,
		
		PRIMARY KEY(uid, cid),
		FOREIGN KEY (uid)REFERENCES user (uid) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY (cid) REFERENCES course (cid) ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO user_course(uid,cid,access) values (1,1,"W");
INSERT INTO user_course(uid,cid,access) values (2,1,"R");
INSERT INTO user_course(uid,cid,access) values (1,2,"R");

CREATE TABLE listentries (
	lid 					INT UNSIGNED NOT NULL AUTO_INCREMENT,
	cid 					INT UNSIGNED NOT NULL,
	entryname 		VARCHAR(64),
	link 					VARCHAR(200),
	kind 					INT unsigned,
	pos 					INT,
	creator 			INT unsigned not null,
	ts						TIMESTAMP default CURRENT_TIMESTAMP ON UPDATE current_timestamp,
	code_id 			MEDIUMINT unsigned null default null,
	visible 			TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
	vers					VARCHAR(8),
  moment				INT UNSIGNED,
  gradesystem 	TINYINT(1),
	PRIMARY KEY(lid),
	
/*	FOREIGN KEY(code_id) REFERENCES codeexample(exampleid) ON UPDATE NO ACTION ON DELETE SET NULL, */
	FOREIGN KEY(creator) REFERENCES user(uid) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY(cid) REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
	
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

INSERT INTO listentries (cid, entryname, link, kind, pos, creator, visible) VALUES(1, "Etapp 1", NULL, 0, 0, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, creator, visible) VALUES(1, "Kodexempel", NULL, 1, 1, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Basic HTML", "../CodeViewer/EditorV30.php?exampleid=1&courseid=1", 2, 2, 1, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Basic CSS", "../CodeViewer/EditorV30.php?exampleid=2&courseid=1", 2, 3, 2, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Basic JS", "../CodeViewer/EditorV30.php?exampleid=3&courseid=1", 2, 4, 3, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, creator, visible) VALUES(1, "Avancerade Kodexempel", NULL, 1, 5, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Advanced HTML", "../CodeViewer/EditorV30.php?exampleid=4&courseid=1", 2, 6, 4, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Advanced CSS", "../CodeViewer/EditorV30.php?exampleid=5&courseid=1", 2, 7, 5, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Advanced JS", "../CodeViewer/EditorV30.php?exampleid=6&courseid=1", 2, 8, 6, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, creator, visible) VALUES(1, "Expert Kodexempel", NULL, 1, 9, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Expert HTML", "../CodeViewer/EditorV30.php?exampleid=7&courseid=1", 2, 10, 7, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Expert CSS", "../CodeViewer/EditorV30.php?exampleid=8&courseid=1", 2, 11, 8, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Expert JS", "../CodeViewer/EditorV30.php?exampleid=9&courseid=1", 2, 12, 9, 1, 1);

/* Quiz tables */
CREATE TABLE quiz (
  id						INT(11) NOT NULL AUTO_INCREMENT,
  cid 					INTEGER UNSIGNED NOT NULL,
  autograde 		TINYINT(1) NOT NULL DEFAULT 0, /* bool */
  gradesystem 	TINYINT(1) NOT NULL DEFAULT 2, /* 1:U-G-VG & 2:U-G & 3:U-3-5 */
  qname 				VARCHAR(255) NOT NULL DEFAULT '',
  quizFile 			VARCHAR(255) NOT NULL DEFAULT 'default',
  qrelease 			DATETIME,
  deadline 			DATETIME,
	modified 			TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	creator 			INTEGER,
		
  PRIMARY KEY 	(id),
  FOREIGN KEY		(cid) REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE variant(
  vid						INT(11) NOT NULL AUTO_INCREMENT,
	quizID				INT(11),
	param					VARCHAR(2048),
	variantanswer	VARCHAR(2048),
	modified 			TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	creator 			INTEGER,
  PRIMARY KEY 	(vid),
  FOREIGN KEY 	(quizID) REFERENCES quiz(id) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE userAnswer (
  aid						INT(11) NOT NULL AUTO_INCREMENT,
 	cid						INT UNSIGNED NOT NULL, 
  quiz 					INT(11),
  variant				INT,
  moment				INT UNSIGNED NOT NULL,
  grade 				TINYINT(2),
  uid 					INT UNSIGNED NOT NULL,
  useranswer		varchar(2048),
  submitted 		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  marked				TIMESTAMP NULL,
	vers					VARCHAR(8),
	creator 			INTEGER,
  PRIMARY KEY 	(aid),
	FOREIGN KEY   (cid) REFERENCES course (cid),
  FOREIGN KEY		(uid) REFERENCES user(uid),
  FOREIGN KEY 	(quiz) REFERENCES quiz(id),
  FOREIGN KEY 	(moment) REFERENCES listentries(lid),
	FOREIGN KEY  	(variant) REFERENCES variant(vid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE vers(
		cid					  INT UNSIGNED NOT NULL AUTO_INCREMENT,
		vers				  VARCHAR(8) NOT NULL,
		versname		  VARCHAR(45) NOT NULL,
		coursecode	  VARCHAR(45) NOT NULL,
		coursename	  VARCHAR(45) NOT NULL,
		coursenamealt	VARCHAR(45) NOT NULL,
		FOREIGN KEY (cid) REFERENCES course(cid),		
		PRIMARY KEY(cid,coursecode,vers)
);

insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","8212","HT 2012");
insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","8111","HT 2013");
insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","7844","HT 2014");

CREATE TABLE fileLink(
	fileid				INT(11) NOT NULL AUTO_INCREMENT,
	filename			VARCHAR(128) NOT NULL,
	kind					INTEGER,	
	cid						INT UNSIGNED NOT NULL,
	PRIMARY KEY (fileid),
	FOREIGN KEY (cid) REFERENCES course (cid)
);


/* Section contains a list of the course sections for a version of a course in the database */
/* Version of sections and examples corresponds roughly to year or semester that the course was given. */

/* template with information about a certain template */
CREATE TABLE template(
		templateid			INTEGER UNSIGNED NOT NULL,
		stylesheet 			VARCHAR(39) NOT NULL,
		numbox				INTEGER NOT NULL,
		PRIMARY KEY(templateid, stylesheet)
)CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO template (templateid, stylesheet, numbox) VALUES (0, "template0.css",0);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (1,"template1.css",2);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (2,"template2.css",2);
INSERT INTO template(templateid,stylesheet,numbox) VALUES (3,"template3.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (4,"template4.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (5,"template5.css",4);

/* Code Example contains a list of the code examples for a version of a course in the database 
 Version of sections and examples corresponds roughly to year or semester that the course was given. */

CREATE TABLE codeexample(
		exampleid			MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		cid					  INT UNSIGNED NOT NULL,
		examplename		VARCHAR(64),
		sectionname		VARCHAR(64),
		beforeid			INTEGER,
		afterid				INTEGER,
		runlink			  VARCHAR(64),
		cversion			INTEGER,
		public 				tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		templateid			INT UNSIGNED NOT NULL DEFAULT '0',
		PRIMARY KEY(exampleid),
		FOREIGN KEY (cid) REFERENCES course (cid),
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY (templateid) REFERENCES template (templateid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO codeexample(cid,examplename,runlink,uid,cversion) values (1,"Events 1","",1,2013);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion) values (1,"Events 1","",1,2013);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion) values (1,"Events 2","",1,2013);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion) values (1,"Callback 1","Culf.html",1,2013);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion,templateid) values (1,"Callback 2","Dulf.html",1,2013,1);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion,templateid) values (1,"Callback 3","",2,2013,1);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion,templateid) values (1,"Callback 4","Fulf.html",2,2013,1);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion,templateid) values (1,"Design 1","Gulf.html",2,2013,1);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion) values (1,"Design 2","Hulf.html",2,2013);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion) values (1,"Design 3","Iulf.html",1,2013);
INSERT INTO codeexample(cid,examplename,runlink,uid,cversion) values (1,"Design 4","Julf.html",1,2013);
 
/* improw contains a list of the important rows for a certain example */
CREATE TABLE wordlist(
		wordlistid		  	MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,		
		wordlistname 		VARCHAR(24),
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		PRIMARY KEY(wordlistid),
		FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
	
INSERT INTO wordlist(wordlistname,uid) VALUES ("JS",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("PHP",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("HTML",1);

/* Delete and update all foreign keys before deleting a wordlist */
delimiter //
CREATE TRIGGER checkwordlists BEFORE DELETE ON wordlist
FOR EACH ROW
BEGIN
	 DELETE FROM word WHERE wordlistid = OLD.wordlistid;    
     IF ((Select count(*) FROM codeBox WHERE wordlistid=OLD.wordlistid)>"0")THEN   
     		UPDATE codeBox SET wordlistid = (SELECT MIN(wordlistid) FROM wordlist WHERE wordlistid != OLD.wordlistid) WHERE wordlistid=OLD.wordlistid;
     END IF;
 END;//
 delimiter ;

CREATE TABLE word(
		wordid		  		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		wordlistid			MEDIUMINT UNSIGNED NOT NULL,			
		word 				VARCHAR(64),
		label				VARCHAR(256),
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		PRIMARY KEY(wordid, wordlistid),
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY(wordlistid) REFERENCES wordlist(wordlistid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"for","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"function","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"if","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"var","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,"echo","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,"function","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,"if","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,"else","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"onclick","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"onload","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"class","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"id","D",1);

/* boxes with information in a certain example */
CREATE TABLE box(
		boxid					INTEGER UNSIGNED NOT NULL,
		exampleid 		MEDIUMINT UNSIGNED NOT NULL,
		boxtitle			VARCHAR(20),
		boxcontent		VARCHAR(64),
		filename			VARCHAR(64),
		settings			VARCHAR(1024),
		wordlistid		MEDIUMINT UNSIGNED,
		segment				TEXT,
		PRIMARY KEY(boxid, exampleid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename) VALUES (1,1,"Title","Code","[viktig=1]","js1.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,segment) VALUES (2,1,"Title","Document","[viktig=1]","<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");

/* improw contains a list of the important rows for a certain example */
CREATE TABLE improw(
		impid		  		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		boxid         	INTEGER UNSIGNED NOT NULL,
		exampleid    		MEDIUMINT UNSIGNED NOT NULL,				
		istart				INTEGER,
		iend				INTEGER,
		irowdesc			VARCHAR(1024),
		updated	 			TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		PRIMARY KEY(impid, exampleid, boxid),
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY (boxid, exampleid) REFERENCES box (boxid, exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
	
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (1,1,3,5,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (1,1,8,11,1);

/* Wordlist contains a list of important words for a certain code example */
CREATE TABLE impwordlist(
		wordid		  	MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		exampleid		MEDIUMINT UNSIGNED NOT NULL,
		word 			VARCHAR(64),
		label		VARCHAR(256),
		UPDATED 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid				INTEGER UNSIGNED NOT NULL,
		PRIMARY KEY(wordid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
		FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO impwordlist(exampleid,word,uid) values (3,"event",1);
INSERT INTO impwordlist(exampleid,word,uid) values (3,"elem",1);
INSERT INTO impwordlist(exampleid,word,uid) values (3,"pageY",2);

CREATE TABLE eventlog(
	eid 				BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	type 				TINYINT DEFAULT 0,
	ts 					TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	address 		VARCHAR(45),
	raddress 		VARCHAR(45),
	user 				VARCHAR(128),
	eventtext 	TEXT NOT NULL,
	PRIMARY KEY(eid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE playereditor_playbacks(
    id  VARCHAR(32) NOT NULL,
    type    SMALLINT(1) NOT NULL,
    path    VARCHAR(256) NOT NULL,
    PRIMARY KEY(id, type)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

CREATE TABLE programkurs (
  pkid int(11) NOT NULL AUTO_INCREMENT,
  kull varchar(8) DEFAULT NULL,
  kurskod varchar(6) DEFAULT NULL,
  kursnamn varchar(100) DEFAULT NULL,
  anmkod varchar(8) DEFAULT NULL,
  period mediumint(9) DEFAULT NULL,
  platser int(11) DEFAULT NULL,
  termin varchar(45) DEFAULT NULL,
  PRIMARY KEY (pkid)
) ENGINE=InnoDB AUTO_INCREMENT=168 DEFAULT CHARSET=latin1;

CREATE TABLE studentresultat (
  sid mediumint(9) NOT NULL AUTO_INCREMENT,
  pnr varchar(11) DEFAULT NULL,
  anmkod varchar(6) DEFAULT NULL,
  kurskod varchar(6) NOT NULL,
  termin varchar(5) DEFAULT NULL,
  resultat decimal(3,1) DEFAULT NULL,
  avbrott date DEFAULT NULL,
  PRIMARY KEY (sid, anmkod, pnr, kurskod),
  CONSTRAINT studentresultat_ibfk_1 FOREIGN KEY (anmkod) REFERENCES programkurs (anmkod),
  CONSTRAINT studentresultat_ibfk_2 FOREIGN KEY (pnr) REFERENCES user (ssn),
  CONSTRAINT studentresultat_ibfk_3 FOREIGN KEY (kurskod) REFERENCES programkurs (kurskod)
) ENGINE=InnoDB AUTO_INCREMENT=1869 DEFAULT CHARSET=utf8;

INSERT INTO programkurs VALUES (45,'WEBUG12h','DA135G','Datakommunikation - Introduktion G1N 7,5 hp','87524',5,NULL,'20132'),(46,'WEBUG12h','SD140G','Studieteknik G1N 1,5 hp','85621',4,NULL,'20122'),(47,'WEBUG12h','DA147G','Grundläggande programmering med C++ G1N 7,5 hp','87520',5,NULL,'20122'),(48,'WEBUG12h','IT116G','Informationssäkerhet - Introduktion G1N 7,5 hp','87510',5,NULL,'20142'),(49,'WEBUG12h','DA133G','Webbutveckling - datorgrafik G1N 7,5 hp','87518',4,NULL,'20122'),(50,'WEBUG12h','DA121G','Datorns grunder G1N 7,5 hp','87514',4,NULL,'20122'),(51,'WEBUG12h','DA330G','Webbprogrammering G1F 7,5 hp','87547',5,NULL,'20132'),(52,'WEBUG12h','DA523G','Webbteknologi - forskning och utveckling G2F 7,5 hp','87568',5,NULL,'20142'),(53,'WEBUG12h','DA524G','Webbutveckling - content management och drift G2F 7,5 hp','87569',4,NULL,'20142'),(54,'WEBUG12h','DA322G','Operativsystem G1F 7,5 hp','87531',4,NULL,'20142'),(55,'WEBUG12h','IS130G','IT i organisationer - Introduktion G1N 7,5 hp','88317',4,NULL,'20132'),(56,'WEBUG12h','IS317G','Databaskonstruktion G1F 7,5 hp','88344',4,NULL,'20132'),(57,'WEBUG12h','KB111G','Interaktion, design och användbarhet I G1N 7,5 hp','88417',5,NULL,'20122'),(58,'WEBUG12h','DA348G','Objektorienterad programmering G1F 7,5 hp','97543',1,NULL,'20131'),(59,'WEBUG12h','MA113G','Algebra och logik G1N 7,5 hp','93612',1,NULL,'20141'),(60,'WEBUG12h','DA338G','Projekt i webbutveckling G1F 15 hp','97545',2,NULL,'20141'),(61,'WEBUG12h','DA345G','Examensarbete i datalogi med inriktning mot webbutveckling G2E 30 hp','97560',1,NULL,'20151'),(62,'WEBUG12h','DV123G','Webbutveckling - webbplatsdesign G1N 7,5 hp','97703',1,NULL,'20131'),(63,'WEBUG12h','DV313G','Webbutveckling - XML API G1F 7,5 hp','97737',2,NULL,'20131'),(64,'WEBUG12h','DV318G','Programvaruutveckling - programvaruprojekt G1F 15 hp','97744',2,NULL,'20141'),(65,'WEBUG12h','DV316G','Programvaruutveckling G1F 7,5 hp','97745',1,NULL,'20141'),(66,'WEBUG12h','IS114G','Databassystem G1N 7,5 hp','98324',2,NULL,'20131'),(67,'WEBUG13h','DA147G','Grundläggande programmering med C++ G1N 7,5 hp','87501',5,NULL,'20132');
INSERT INTO studentresultat VALUES (1,'111111-1111',NULL,'IT111G','H14',5.0,NULL),(2,'111111-1111',NULL,'IT115G','H14',7.5,NULL),(3,'111111-1111',NULL,'IT118G','H14',7.5,NULL),(4,'111111-1111',NULL,'IT120G','H14',0.0,NULL),(5,'111111-1111',NULL,'IT108G','V15',0.0,NULL),(6,'111111-1111',NULL,'IT121G','V15',0.0,NULL),(7,'111111-1111',NULL,'IT308G','V15',0.0,NULL);


update user set firstname="Toddler", lastname="Kong" where username="Toddler";
update user set firstname="Johan", lastname="Grimling" where username="Grimling";
update user set ssn="810101-5567" where username="Grimling";
update user set ssn="444444-5447" where username="Toddler";
update user set password=password("Kong") where username="Toddler";
update user set superuser=1 where username="Toddler";

