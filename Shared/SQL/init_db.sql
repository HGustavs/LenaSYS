drop database Imperious;
create database Imperious;
use Imperious;
/* user contains the users of the system and related  information */

DROP TABLE IF EXISTS `userAnswer`;
DROP TABLE IF EXISTS `grades`;
DROP TABLE IF EXISTS `quiz`;
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
CREATE TABLE user(
		uid				INT UNSIGNED NOT NULL AUTO_INCREMENT,
		username		VARCHAR(80) NOT NULL UNIQUE,
		firstname		VARCHAR(50) NULL,
		lastname		VARCHAR(50) NULL,
		ssn				VARCHAR(20) NULL,
		password		VARCHAR(225) NOT NULL,
		lastupdated		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		newpassword		TINYINT(1) NULL,
		creator			INT UNSIGNED NULL,
		superuser		TINYINT(1) NULL,
		PRIMARY KEY(uid)		
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO user(username,password,newpassword,creator,superuser) values ("Grimling","$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m",0,1,1);
INSERT INTO user(username,password,newpassword,creator) values ("Toddler","$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",0,1);
INSERT INTO user(username,password,newpassword,creator) values ("Tester", "$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",1,1);

CREATE TABLE user_question (
	qid			INT UNSIGNED NOT NULL AUTO_INCREMENT,
	question	TEXT,
	answer		TEXT,
	owner		INT UNSIGNED NOT NULL,
	PRIMARY KEY(qid, owner),
	INDEX `owner_index` (owner),
	FOREIGN KEY(owner) REFERENCES user(uid)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO user_question (question, answer, owner) VALUES("What is the color of night?", "Sanguine, my brother.", 1);

/* Course contains a list of the course names for each course in the database */
CREATE TABLE course(
		cid				INT UNSIGNED NOT NULL AUTO_INCREMENT,
		coursecode		VARCHAR(45) NULL UNIQUE,
		coursename		VARCHAR(80) NULL,
		created			DATETIME,
		creator			INT UNSIGNED NOT NULL,
		visibility		TINYINT UNSIGNED NOT NULL DEFAULT 0,
		updated			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
		PRIMARY KEY(cid),
		FOREIGN KEY (creator) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO course(coursecode,coursename,created,creator,visibility) values ("DV12G","Webbprogrammering",NOW(),1,1);
INSERT INTO course(coursecode,coursename,created,creator,visibility) values ("DV13G","Futhark",NOW(),1,0);

/* User access to the application*/
CREATE TABLE user_course(
		uid				INT UNSIGNED NOT NULL,
		cid				INT UNSIGNED NOT NULL, 
		access			VARCHAR(10) NOT NULL,
		PRIMARY KEY(uid, cid),
		FOREIGN KEY (uid)REFERENCES user (uid)
			ON DELETE CASCADE
			ON UPDATE CASCADE,
		FOREIGN KEY (cid) REFERENCES course (cid)
			ON DELETE CASCADE
			ON UPDATE CASCADE
		
);

INSERT INTO user_course(uid,cid,access) values (1,1,"W");
INSERT INTO user_course(uid,cid,access) values (2,2,"W");

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
		wordlist			VARCHAR(64),
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

INSERT INTO codeexample(exampleid,cid,examplename,wordlist,runlink,uid,cversion) values (0,1,"Events 1","JS","",1,2013);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion) values (1,"Events 1","JS","",1,2013);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion) values (1,"Events 2","JS","",1,2013);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion) values (1,"Callback 1","GLSL","Culf.html",1,2013);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion,templateid) values (1,"Callback 2","GLSL","Dulf.html",1,2013,1);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion,templateid) values (1,"Callback 3","GLSL","",2,2013,1);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion,templateid) values (1,"Callback 4","JS","Fulf.html",2,2013,1);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion,templateid) values (1,"Design 1","GLSL","Gulf.html",2,2013,1);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion) values (1,"Design 2","JS","Hulf.html",2,2013);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion) values (1,"Design 3","JS","Iulf.html",1,2013);
INSERT INTO codeexample(cid,examplename,wordlist,runlink,uid,cversion) values (1,"Design 4","JS","Julf.html",1,2013);
 


/*filelist contains a list of shortcuts to files
CREATE TABLE filelist(
		fileid		  		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		exampleid			MEDIUMINT UNSIGNED NOT NULL,
		filename			VARCHAR(1024),
		pos					INTEGER UNSIGNED,
		updated	 			TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		PRIMARY KEY(fileid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
		FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO filelist(fileid,uid,exampleid) VALUES (0,1,0);	
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (1,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (2,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (3,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (4,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (5,"js1.js",1,2);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (6,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (7,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (8,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (9,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (10,"js1.js",1,1);*/


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
        	INSERT INTO codeBox (boxid, exampleid, filename) VALUES (NEW.boxid, NEW.exampleid, "");
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

		PRIMARY KEY(boxid, exampleid),
		FOREIGN KEY (boxid, exampleid) REFERENCES box (boxid, exampleid)
);

INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,1,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,2,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,3,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,4,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,5,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,6,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,7,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,8,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,9,"js1.js");
INSERT INTO codeBox(boxid,exampleid,filename) VALUES (1,10,"js1.js");







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






/* TRIGGER IF WE WANT &nbsp; AND <br> TO BE REPLACED AUTOMATICALLY
delimiter //
CREATE TRIGGER nbsp_br_desc_check BEFORE UPDATE ON descriptionsection
FOR EACH ROW
BEGIN
     IF NEW.segment LIKE "%&nbsp;%" THEN
         SET NEW.segment = replace(NEW.segment, "&nbsp;", " ");
     END IF;
     IF NEW.segment LIKE "%<br>%" THEN
         SET NEW.segment = replace(NEW.segment, "<br>", "\n");
     END IF;
 END;//
 delimiter ;
*/




/* Wordlist contains a list of keywords for a certain programming language or file type */
CREATE TABLE wordlist(
		wordid		  		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		wordlist			VARCHAR(64),
		word 				VARCHAR(64),
		label			VARCHAR(256),
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		PRIMARY KEY(wordid),
		FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO wordlist(wordlist,word,label,uid) VALUES ("JS","for","A",1);
INSERT INTO wordlist(wordlist,word,label,uid) VALUES ("JS","if","B",1);
INSERT INTO wordlist(wordlist,word,label,uid) VALUES ("JS","var","C",1);
INSERT INTO wordlist(wordlist,word,label,uid) VALUES ("JS","function","D",2);
INSERT INTO wordlist(wordlist,word,label,uid) VALUES ("GLSL","vec3","A",2);
INSERT INTO wordlist(wordlist,word,label,uid) VALUES ("GLSL","dot","B",2);

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

CREATE TABLE listentries (
	lid int UNSIGNED NOT NULL AUTO_INCREMENT,
	cid int UNSIGNED NOT NULL,
	entryname varchar(64),
	link varchar(200),
	kind int unsigned,
	pos int,
	creator int unsigned not null,
	ts timestamp default CURRENT_TIMESTAMP ON UPDATE current_timestamp,
	code_id mediumint unsigned null default null,
	visible tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY(lid),
	FOREIGN KEY(code_id)
		REFERENCES codeexample(exampleid)
		ON UPDATE NO ACTION
		ON DELETE SET NULL,
	FOREIGN KEY(creator)
		REFERENCES user(uid)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
	FOREIGN KEY(cid)
		REFERENCES course(cid)
		ON DELETE CASCADE
		ON UPDATE CASCADE
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

CREATE TABLE eventlog(
	eid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	type TINYINT DEFAULT 0,
	ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	address VARCHAR(45) NOT NULL,
	user INT UNSIGNED NULL,
	eventtext TEXT NOT NULL,
	PRIMARY KEY(eid),
	FOREIGN KEY(user)
		REFERENCES user(uid)
		ON UPDATE CASCADE
		ON DELETE NO ACTION
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* Quiz tables */
CREATE TABLE `quiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cid` int UNSIGNED NOT NULL,
  `autograde` tinyint(1) NOT NULL DEFAULT 0, /* bool */
  `gradesystem` tinyint(1) NOT NULL DEFAULT 2, /* 1:U-G-VG & 2:U-G & 3:U-3-5 */
  `answer` varchar(2000) NOT NULL DEFAULT '',
  `parameter` varchar(2000) NOT NULL DEFAULT '',
  `name` varchar(255) NOT NULL DEFAULT '',
  `quizFile` varchar(255) NOT NULL DEFAULT 'default.js',
  `release` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `deadline` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  FOREIGN KEY(`cid`)
		REFERENCES course(cid)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE `userAnswer` (
  `quizID` int(11) NOT NULL,
  /*`variantID` int(11) NOT NULL,*/
  /*`version` int(11) NOT NULL,*/
  `grade` tinyint(2) NOT NULL,
  `uid` INT UNSIGNED NOT NULL,
  `answer` varchar(2000) NOT NULL,
  `submitted` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`quizID`,`uid`),
  FOREIGN KEY(uid) 
  		REFERENCES user(uid)
		ON UPDATE CASCADE,
  FOREIGN KEY (quizID) 
  		REFERENCES quiz(id)
		ON UPDATE CASCADE
		ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;


CREATE TABLE playereditor_playbacks(
    id  VARCHAR(32) NOT NULL,
    type    SMALLINT(1) NOT NULL,
    path    VARCHAR(256) NOT NULL,
    PRIMARY KEY(id, type)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
