drop database Imperiouz; 
create database Imperiouz;
use Imperiouz;
/* user contains the users of the system and related  information */

/*
DROP TABLE IF EXISTS userAnswer;
DROP TABLE IF EXISTS grades;
DROP TABLE IF EXISTS quiz;
DROP TABLE IF EXISTS eventlog;
DROP TABLE IF EXISTS listentries;
DROP TABLE IF EXISTS impwordlist;
DROP TABLE IF EXISTS wordlist;
DROP TABLE IF EXISTS playereditor_playbacks;
DROP TABLE IF EXISTS descriptionsection;
DROP TABLE IF EXISTS filelist;
DROP TABLE IF EXISTS improw;
DROP TABLE IF EXISTS user_course;
DROP TABLE IF EXISTS user_question;
DROP TABLE IF EXISTS descriptionBox;
DROP TABLE IF EXISTS codeBox;
DROP TABLE IF EXISTS box;
DROP TABLE IF EXISTS codeexample;
DROP TABLE IF EXISTS template;
DROP TABLE IF EXISTS course;
DROP TABLE IF EXISTS user;
*/
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
INSERT INTO user(username,password,newpassword,creator) values ("Tester", "$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",1,1);

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
	answer				VARCHAR(2048),
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
  grade 				tinyint(2),
  uid 					INT UNSIGNED NOT NULL,
  answer 				varchar(2000),
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
		cid					INT UNSIGNED NOT NULL,
		examplename			VARCHAR(64),
--		wordlist			VARCHAR(64),
		runlink			  	VARCHAR(64),
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
		boxid				INTEGER UNSIGNED NOT NULL,
		exampleid 			MEDIUMINT UNSIGNED NOT NULL,
		boxtitle			VARCHAR(20),
		boxcontent			VARCHAR(39),
		settings			VARCHAR(1024),
		PRIMARY KEY(boxid, exampleid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

/* Creates a subclass if it doesn't exsist when updating contents in a box. */
delimiter //
CREATE TRIGGER checkBoxContents BEFORE UPDATE ON box
FOR EACH ROW
BEGIN
     IF ((UPPER(NEW.boxcontent) LIKE "DOCUMENT") AND ((Select count(*) FROM descriptionBox WHERE exampleid=NEW.exampleid AND boxid=NEW.boxid) <>"1"))THEN       
        	INSERT INTO descriptionBox (boxid, exampleid, segment) VALUES (NEW.boxid, NEW.exampleid, "");
     END IF;
     IF ((UPPER(NEW.boxcontent) LIKE "CODE") AND ((Select count(*) FROM codeBox WHERE exampleid=NEW.exampleid AND boxid=NEW.boxid) <>"1")) THEN       
        	INSERT INTO codeBox (boxid, exampleid, filename,wordlistid) VALUES (NEW.boxid, NEW.exampleid, "", (select MIN(wordlistid) from wordlist));
     END IF;
 END;//
 delimiter ;

INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,1,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,1,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,2,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,2,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,3,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,3,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,4,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,4,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,5,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,5,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,6,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,6,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,7,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,7,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,8,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,8,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,9,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,9,"Title","Document","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (1,10,"Title","Code","[viktig=1]");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings) VALUES (2,10,"Title","Document","[viktig=1]");

CREATE TABLE codeBox(
		boxid         INTEGER UNSIGNED NOT NULL,
		exampleid     MEDIUMINT UNSIGNED NOT NULL,
		filename			VARCHAR(1024),
		ts	 					TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser				VARCHAR(64),
		wordlistid			MEDIUMINT UNSIGNED NOT NULL,

		PRIMARY KEY(boxid, exampleid),
		FOREIGN KEY (boxid, exampleid) REFERENCES box (boxid, exampleid),
		FOREIGN KEY (wordlistid) REFERENCES wordlist(wordlistid)
);

INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,1,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,2,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,3,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,4,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,5,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,6,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,7,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,8,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,9,"js1.js",1);
INSERT INTO codeBox(boxid,exampleid,filename,wordlistid) VALUES (1,10,"js1.js",1);

CREATE TABLE descriptionBox(
		boxid         INTEGER UNSIGNED NOT NULL,
		exampleid     MEDIUMINT UNSIGNED NOT NULL,
		segment				VARCHAR(64000),
		ts	 					TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser				VARCHAR(64),

		PRIMARY KEY(boxid, exampleid),
		FOREIGN KEY (boxid, exampleid) REFERENCES box (boxid, exampleid)
);

INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,1,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,2,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,3,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,4,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,5,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,6,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,7,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,8,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,9,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionBox(boxid,exampleid,segment) VALUES (2,10,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");

/* improw contains a list of the important rows for a certain example */
CREATE TABLE improw(
		impid		  		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		codeBoxid         	INTEGER UNSIGNED NOT NULL,
		exampleid    		MEDIUMINT UNSIGNED NOT NULL,				
		istart				INTEGER,
		iend				INTEGER,
		irowdesc			VARCHAR(1024),
		updated	 			TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		PRIMARY KEY(impid, exampleid, codeBoxid),
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY (codeBoxid, exampleid) REFERENCES codeBox (boxid, exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
	
INSERT INTO improw(exampleid,codeBoxid,istart,iend,uid) VALUES (3,1,16,8,1);
INSERT INTO improw(exampleid,codeBoxid,istart,iend,uid) VALUES (5,1,15,19,1);
INSERT INTO improw(exampleid,codeBoxid,istart,iend,uid) VALUES (7,1,10,12,2);

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
	PRIMARY KEY(eid),
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE playereditor_playbacks(
    id  VARCHAR(32) NOT NULL,
    type    SMALLINT(1) NOT NULL,
    path    VARCHAR(256) NOT NULL,
    PRIMARY KEY(id, type)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

update user set firstname="Toddler", lastname="Kong" where username="Toddler";
update user set firstname="Johan", lastname="Grimling" where username="Grimling";
update user set ssn="810101-5567" where username="Grimling";
update user set ssn="444444-5447" where username="Toddler";

update user set password=password("Kong") where username="Toddler";

insert into vers (cid,coursecode,vers) values(1,"DA551G","2012");
insert into vers (cid,coursecode,vers) values(1,"DA551G","2013");
insert into vers (cid,coursecode,vers) values(1,"DA551G","2014");

insert into vers (cid,coursecode,vers) values(2,"DA112G","2013");
insert into vers (cid,coursecode,vers) values(2,"DA112G","2014");


update user set superuser=1 where username="Toddler";

alter table address 