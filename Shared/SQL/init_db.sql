DROP DATABASE IF EXISTS Imperious;
CREATE DATABASE Imperious;
USE Imperious;

/* user contains the users of the system and related  information */
CREATE TABLE user(
		uid				INT UNSIGNED NOT NULL AUTO_INCREMENT,
		username		VARCHAR(80) NOT NULL UNIQUE, 
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
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY (cid) REFERENCES course (cid)
		
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
INSERT INTO template(templateid,stylesheet, numbox) VALUES (2,"template1.css",2);
INSERT INTO template(templateid,stylesheet,numbox) VALUES (3,"template1.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (4,"template2.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (5,"template2.css",4);

/* Code Example contains a list of the code examples for a version of a course in the database */
/* Version of sections and examples corresponds roughly to year or semester that the course was given. */
CREATE TABLE codeexample(
		exampleid			MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		cid					INT UNSIGNED NOT NULL,
		examplename			VARCHAR(64),
		wordlist			VARCHAR(64),
		runlink			  	VARCHAR(64),
		cversion			INTEGER,
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		templateid			INT UNSIGNED NOT NULL DEFAULT '0',
		PRIMARY KEY(exampleid),
		FOREIGN KEY (cid) REFERENCES course (cid),
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY (templateid) REFERENCES template (templateid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

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
 

/* improw contains a list of the important rows for a certain example */
CREATE TABLE improw(
		impid		  		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		exampleid 			MEDIUMINT UNSIGNED NOT NULL,
		istart				INTEGER,
		iend				INTEGER,
		irowdesc			VARCHAR(1024),
		updated	 			TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		PRIMARY KEY(impid),
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
	
INSERT INTO improw(exampleid,istart,iend,uid) VALUES (3,6,8,1);
INSERT INTO improw(exampleid,istart,iend,uid) VALUES (5,15,19,1);
INSERT INTO improw(exampleid,istart,iend,uid) VALUES (7,10,12,2);


/*filelist contains a list of shortcuts to files */
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
	
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (1,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (2,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (3,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (4,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (5,"js1.js",1,2);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (6,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (7,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (8,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (9,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (10,"js1.js",1,1);


CREATE TABLE descriptionsection(
		exampleno			INTEGER,
		segment				VARCHAR(64000),
		pos						INTEGER,
		ts	 					TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser				VARCHAR(64),
		descno		  		MEDIUMINT NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(descno)		
);
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
	
INSERT INTO descriptionsection(exampleno,segment) VALUES (1,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (2,"<b>Events 2</b>This is the seond section of the description<b>Even More</b>This is even more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (3,"<b>Callback 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (4,"<b>Callback 2 S2</b>This is the seond section of the description<b>Even More</b>This is even more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (5,"<b>Callback 3</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (6,"<b>Callback 4</b>This is the seond section of the description<b>Even More</b>This is even more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (7,"<b>Design 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (8,"<b>Design 2</b>This is the seond section of the description<b>Even More</b>This is even more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (9,"<b>Design 3</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO descriptionsection(exampleno,segment) VALUES (10,"<b>Design 4</b>This is the seond section of the description<b>Even More</b>This is even more text");


/* boxes with information in a certain example */
CREATE TABLE box(
		boxid				INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
		exampleid 			MEDIUMINT UNSIGNED NOT NULL,
		boxcontent			VARCHAR(39),
		descid				MEDIUMINT UNSIGNED DEFAULT '0',
		fileid				MEDIUMINT UNSIGNED DEFAULT '0',					
		settings			VARCHAR(1024),
		PRIMARY KEY(boxid, exampleid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
		FOREIGN KEY (fileid) references filelist (fileid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO box(exampleid,boxcontent,descid,fileid,settings) VALUES (1,"Document",1,1,"[viktig=1]");
INSERT INTO box(exampleid,boxcontent,descid,fileid,settings) VALUES (1,"Document",1,2,"[viktig=1]");
INSERT INTO box(exampleid,boxcontent,descid,fileid,settings) VALUES (1,"Document",1,3,"[viktig=1]");


/* Wordlist contains a list of keywords for a certain programming language or file type */
CREATE TABLE wordlist(
		wordid		  		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		wordlist			VARCHAR(64),
		word 				VARCHAR(64),
		description			VARCHAR(256),
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		PRIMARY KEY(wordid),
		FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO wordlist(wordlist,word,uid) VALUES ("JS","for",1);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("JS","if",1);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("JS","var",1);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("JS","function",2);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("GLSL","vec3",2);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("GLSL","dot",2);

/* Wordlist contains a list of important words for a certain code example */
CREATE TABLE impwordlist(
		wordid		  	MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
		exampleid		MEDIUMINT UNSIGNED NOT NULL,
		word 			VARCHAR(64),
		description		VARCHAR(256),
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

DROP TABLE IF EXISTS eventlog;
CREATE TABLE eventlog(
	eid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	type ENUM('notice', 'warning', 'fatal', 'loginerr') DEFAULT 'notice',
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

DROP TABLE IF EXISTS `quiz`;
CREATE TABLE `quiz` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courseID` int(11) NOT NULL,
  `autograde` tinyint(1) NOT NULL, /* bool */
  `gradesystem` tinyint(1) NOT NULL, /* U-G-VG & U-G & U-3-5 */
  `answer` varchar(2000) NOT NULL,
  `name` varchar(255) NOT NULL,
  `release` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  `deadline` datetime NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

DROP TABLE IF EXISTS `grades`;
CREATE TABLE `grades` (
  `gradeID` int(11) NOT NULL,
  `grade` varchar(5) NOT NULL,
  PRIMARY KEY (`gradeID`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
INSERT INTO grades(gradeID, grade) VALUES(1, "U");
INSERT INTO grades(gradeID, grade) VALUES(2, "G");
INSERT INTO grades(gradeID, grade) VALUES(3, "VG");
INSERT INTO grades(gradeID, grade) VALUES(4, "3");
INSERT INTO grades(gradeID, grade) VALUES(5, "4");
INSERT INTO grades(gradeID, grade) VALUES(6, "5");

DROP TABLE IF EXISTS `userAnswer`;
CREATE TABLE `userAnswer` (
  `testID` int(11) NOT NULL,
  /*`variantID` int(11) NOT NULL,*/
  /*`version` int(11) NOT NULL,*/
  `grade` tinyint(2) NOT NULL,
  `uid` int(11) NOT NULL,
  `answer` varchar(2000) NOT NULL,
  `submitted` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00' ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`testID`,`uid`)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;
