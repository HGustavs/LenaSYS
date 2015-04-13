drop database imperious;
create database imperious;
use imperious;

/* user contains the users of the system and related  information */
CREATE TABLE user(
		uid					INT UNSIGNED NOT NULL AUTO_INCREMENT,
		username		VARCHAR(80) NOT NULL UNIQUE,
		firstname		VARCHAR(50) NULL,
		lastname		VARCHAR(50) NULL,
		ssn				VARCHAR(20) NULL unique,
		password		VARCHAR(225) NOT NULL,
		lastupdated		TIMESTAMP,
		addedtime  		TIMESTAMP,
		lastvisit		TIMESTAMP,
		newpassword		TINYINT(1) NULL,
		creator			INT UNSIGNED NULL,
		superuser		TINYINT(1) NULL,
		email			VARCHAR(256) DEFAULT NULL,
		class 			VARCHAR(10) DEFAULT NULL REFERENCES class (class),
		totHp			int(3),
		PRIMARY KEY(uid)

) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO user(username,password,newpassword,creator,superuser) values ("Grimling","$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m",0,1,1);
INSERT INTO user(username,password,newpassword,creator) values ("Toddler","$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",0,1);
INSERT INTO user(username,password,newpassword,creator,ssn) values ("Tester", "$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",1,1,"111111-1111");

/* users/students for UMV testing */

insert into user(username, password,firstname,lastname,ssn,email,class) values('a13asrd','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','assad','rduk','111111-1112','a13asrd@his.se','WEBUG13');
insert into user(username, password,firstname,lastname,ssn,email,class) values('a13durp','*0F1088E511EC11B8EF2BBDE830E08E9F959843C4','hurp','durp','111111-1113','a13durp@his.se','WEBUG13');


/** 
 * Course table contains the most essential information relating to study courses in the database.
 */
CREATE TABLE course(
		cid					INT UNSIGNED NOT NULL AUTO_INCREMENT,
		coursecode			VARCHAR(45) NULL UNIQUE,
		coursename			VARCHAR(80) NULL,
		created				DATETIME,
		creator				INT UNSIGNED NOT NULL,
		visibility			TINYINT UNSIGNED NOT NULL DEFAULT 0,
		updated				TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
		activeversion 		VARCHAR(8),
		activeedversion 	VARCHAR(8),
		capacity			int(3) not null,
		hp					decimal(2,1) not null,
		CONSTRAINT pk_course PRIMARY KEY(cid),
		CONSTRAINT fk_course_joins_user FOREIGN KEY (creator) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO course(coursecode,coursename,created,creator,visibility,hp) values ("DV12G","Webbprogrammering",NOW(),1,1,7.5);
INSERT INTO course(coursecode,coursename,created,creator,visibility,hp) values ("DV13G","Futhark",NOW(),1,0,7.5);
INSERT INTO course(coursecode,coursename,created,creator,visibility,hp) values ("IT1405","USEREXPERIENCE",NOW(),1,0,7.5);
INSERT INTO course(coursecode,coursename,created,creator,visibility,hp) values ("IT1431","IT-org",NOW(),1,0,7.5);
INSERT INTO course(coursecode,coursename,created,creator,visibility,hp) values ("DA4324","C++ grund prog",NOW(),1,0,7.5);
/** 
 * This table represents a many-to-many relation between users and courses. That is,
 * a tuple in this table joins a user with a course.
 */
CREATE TABLE user_course(
		uid				INT UNSIGNED NOT NULL,
		cid				INT UNSIGNED NOT NULL, 
		result 			varchar(5),
		modified 		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		creator 		INTEGER,
		access			VARCHAR(10) NOT NULL,
		period			int(1) not null,
		CONSTRAINT 		pk_user_course PRIMARY KEY(uid, cid),
		CONSTRAINT 		user_course_joins_user FOREIGN KEY (uid)REFERENCES user (uid) ON DELETE CASCADE ON UPDATE CASCADE,
		CONSTRAINT 		user_course_joins_course FOREIGN KEY (cid) REFERENCES course (cid) ON DELETE CASCADE ON UPDATE CASCADE
);

/* test data */
/* a13asrd couirses */
insert into user_course(uid,cid,result,access,period) values(4,1,5,'R',1);
insert into user_course(uid,cid,result,access,period) values(4,3,5,'R',2);
insert into user_course(uid,cid,result,access,period) values(4,4,5,'R',3);
insert into user_course(uid,cid,result,access,period) values(4,5,5,'R',4);

/* a13durp couirses */
insert into user_course(uid,cid,result,access,period) values(5,1,7,'R',1);
insert into user_course(uid,cid,result,access,period) values(5,3,7,'R',2);
insert into user_course(uid,cid,result,access,period) values(5,4,7,'R',3);
insert into user_course(uid,cid,result,access,period) values(5,5,7,'R',4);



CREATE TABLE listentries (
	lid 			INT UNSIGNED NOT NULL AUTO_INCREMENT,
	cid 			INT UNSIGNED NOT NULL,
	entryname 		VARCHAR(64),
	link 			VARCHAR(200),
	kind 			INT unsigned,
	pos 			INT,
	creator 		INT unsigned not null,
	ts				TIMESTAMP default CURRENT_TIMESTAMP ON UPDATE current_timestamp,
	code_id 		MEDIUMINT unsigned null default null,
	visible 		TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
	vers			VARCHAR(8),
	moment			INT UNSIGNED,
	gradesystem 	TINYINT(1),
	CONSTRAINT 		pk_listentries PRIMARY KEY(lid),
	
/*	FOREIGN KEY(code_id) REFERENCES codeexample(exampleid) ON UPDATE NO ACTION ON DELETE SET NULL, */
	CONSTRAINT fk_listentries_joins_user FOREIGN KEY(creator) REFERENCES user(uid) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY(cid) REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
	
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
	id				INT(11) NOT NULL AUTO_INCREMENT,
	cid 			INTEGER UNSIGNED NOT NULL,
	autograde 		TINYINT(1) NOT NULL DEFAULT 0, /* bool */
	gradesystem 	TINYINT(1) NOT NULL DEFAULT 2, /* 1:U-G-VG & 2:U-G & 3:U-3-5 */
	qname 			VARCHAR(255) NOT NULL DEFAULT '',
	quizFile 		VARCHAR(255) NOT NULL DEFAULT 'default',
	qrelease 		DATETIME,
	deadline 		DATETIME,
	modified 		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	creator 		INTEGER,
		
	CONSTRAINT 		pk_quiz PRIMARY KEY (id),
	CONSTRAINT 		fk_quiz_joins_course FOREIGN KEY (cid) REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/** 
 * A quiz tuple has a one-to-many relation with a tuple from thea variant table.
 * An entry in the variant table is used to add questions to quiz tests. 
 */
CREATE TABLE variant(
  vid				INT(11) NOT NULL AUTO_INCREMENT,
	quizID			INT(11),
	param			VARCHAR(2048),
	variantanswer	VARCHAR(2048),
	modified 		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	creator 		INTEGER,
	CONSTRAINT 		pk_variant PRIMARY KEY 	(vid),
	CONSTRAINT 		fk_variant_joins_quiz FOREIGN KEY (quizID) REFERENCES quiz(id) ON UPDATE CASCADE ON DELETE CASCADE
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
  CONSTRAINT pk_useranswer PRIMARY KEY 	(aid),
  CONSTRAINT fk_useranswer_joins_course FOREIGN KEY (cid) REFERENCES course (cid),
  CONSTRAINT fk_useranswer_joins_user FOREIGN KEY (uid) REFERENCES user(uid),
  CONSTRAINT fk_useranswer_joins_quiz FOREIGN KEY (quiz) REFERENCES quiz(id),
  CONSTRAINT fk_useranswer_joins_listentries FOREIGN KEY (moment) REFERENCES listentries(lid),
  CONSTRAINT fk_useranswer_joins_variant FOREIGN KEY (variant) REFERENCES variant(vid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE vers(
		cid					  INT UNSIGNED NOT NULL AUTO_INCREMENT,
		vers				  VARCHAR(8) NOT NULL,
		versname		  VARCHAR(45) NOT NULL,
		coursecode	  VARCHAR(45) NOT NULL,
		coursename	  VARCHAR(45) NOT NULL,
		coursenamealt	VARCHAR(45) NOT NULL,
		CONSTRAINT fk_vers_joins_course FOREIGN KEY (cid) REFERENCES course(cid),		
		CONSTRAINT pk_vers PRIMARY KEY(cid,coursecode,vers)
);

insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","8212","HT 2012");
insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","8111","HT 2013");
insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","7844","HT 2014");

CREATE TABLE fileLink(
	fileid				INT(11) NOT NULL AUTO_INCREMENT,
	filename			VARCHAR(128) NOT NULL,
	kind					INTEGER,	
	cid						INT UNSIGNED NOT NULL,
	CONSTRAINT pk_filelink PRIMARY KEY (fileid),
	CONSTRAINT fk_filelink_joins_course FOREIGN KEY (cid) REFERENCES course (cid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/** 
 * An entry in this table allow file locations to be related to specific courses. 
 * For example, if an instructor wants to give students a link to a file that 
 * they should be able to download from the course page.
 */
CREATE TABLE template(
		templateid			INTEGER UNSIGNED NOT NULL,
		stylesheet 			VARCHAR(39) NOT NULL,
		numbox				INTEGER NOT NULL,
		CONSTRAINT pk_template PRIMARY KEY(templateid, stylesheet)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

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
		CONSTRAINT pk_codeexample PRIMARY KEY(exampleid),
		CONSTRAINT fk_codeexample_joins_course FOREIGN KEY (cid) REFERENCES course (cid),
		CONSTRAINT fk_codeexample_joins_user FOREIGN KEY (uid) REFERENCES user (uid),
		CONSTRAINT fk_codeexample_joins_template FOREIGN KEY (templateid) REFERENCES template (templateid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

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
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid) values (1,"HTMLex2","HTML","html2.html",2,2013,1,12,13);
 
/* improw contains a list of the important rows for a certain example */
CREATE TABLE wordlist(
		wordlistid		  	MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,		
		wordlistname 		VARCHAR(24),
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT UNSIGNED NOT NULL,
		CONSTRAINT pk_wordlist PRIMARY KEY(wordlistid),
		CONSTRAINT pk_wordlist_joins_user FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;
	
INSERT INTO wordlist(wordlistname,uid) VALUES ("JS",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("PHP",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("HTML",1);

/**
 * Delete and update all foreign keys before deleting a wordlist 
 */
delimiter //
CREATE TRIGGER checkwordlists BEFORE DELETE ON wordlist
FOR EACH ROW
BEGIN
	 DELETE FROM word WHERE wordlistid = OLD.wordlistid;    
     IF ((Select count(*) FROM box WHERE wordlistid=OLD.wordlistid)>"0")THEN   
     		UPDATE box SET wordlistid = (SELECT MIN(wordlistid) FROM wordlist WHERE wordlistid != OLD.wordlistid) WHERE wordlistid=OLD.wordlistid;
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
		CONSTRAINT pk_word PRIMARY KEY(wordid, wordlistid),
		CONSTRAINT fk_word_joins_user FOREIGN KEY (uid) REFERENCES user (uid),
		CONSTRAINT fk_word_joins_wordlist FOREIGN KEY(wordlistid) REFERENCES wordlist(wordlistid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

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
		CONSTRAINT pk_box PRIMARY KEY(boxid, exampleid),
		CONSTRAINT fk_box_joins_codeexample FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename) VALUES (1,1,"Title","Code","[viktig=1]","js1.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,segment) VALUES (2,1,"Title","Document","[viktig=1]","<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid) VALUES (1,12,"TitleA","Code","[viktig=1]","html1.html",1);
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,segment,wordlistid) VALUES (2,12,"TitleB","Document","[viktig=1]","<title>page title</title>",1);

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
		CONSTRAINT pk_improw PRIMARY KEY(impid, exampleid, boxid),
		CONSTRAINT fk_improw_joins_user FOREIGN KEY (uid) REFERENCES user (uid),
		CONSTRAINT fk_improw_joins_box FOREIGN KEY (boxid, exampleid) REFERENCES box (boxid, exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;
	
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
		CONSTRAINT pk_impwordlist PRIMARY KEY(wordid),
		CONSTRAINT fk_impwordlist_joins_codeexample FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
		CONSTRAINT fk_impwordlist_joins_user FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

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
	CONSTRAINT pk_eventlog PRIMARY KEY(eid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE playereditor_playbacks(
    id  VARCHAR(32) NOT NULL,
    type    SMALLINT(1) NOT NULL,
    path    VARCHAR(256) NOT NULL,
    CONSTRAINT pk_playereditor_playbacks PRIMARY KEY(id, type)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/**
 * This table seems to be intended to store program courses. It does not seem
 * to have any relation to the rest of the database and kind of stands out oddly.
 
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
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;
*/


CREATE TABLE class (
    class 		varchar(10) DEFAULT NULL,
	classname 	varchar(100) DEFAULT NULL,
    regcode 	int(8) DEFAULT NULL,
	classcode 	varchar(8) DEFAULT NULL,
    hp 			decimal(3,1) DEFAULT NULL,
	tempo 		int(3) DEFAULT NULL,
	responsible varchar(20) DEFAULT NULL,
	hpProgress 	decimal(3,1),
    PRIMARY KEY (class)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

INSERT INTO class(class,classname,regcode,classcode,hp,tempo,responsible) VALUES ('WEBUG13','elite',23432,'WEBUG',180,100,'Brohede');
INSERT INTO class(class,classname,regcode,classcode,hp,tempo,responsible) VALUES ('TEST13','test',44444,'TEST',180,100,'tester');
/**
 * this table stores the different subparts of each course. 
 */ 
CREATE TABLE subparts(
	partname 	varchar(50),
	cid 		INT UNSIGNED NOT NULL,
	parthp 		decimal(2,1) DEFAULT NULL,
	difGrade 	varchar(10),
	PRIMARY KEY (partname,cid),
	FOREIGN KEY (cid) REFERENCES course (cid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('hemtenta2',1,1,'u345');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('hemtenta',2,2,'u345');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('hemtenta',1,2,'u345');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('projektuppgift',2,3,'ug');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('projektuppgift',3,5,'u345');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('hemtenta',3,2,'u345');

/**
 * this table for many to mny between user and subparts. 
 */ 
CREATE TABLE partresult (
    cid 		INT UNSIGNED NOT NULL,
	uid			INT UNSIGNED NOT NULL,
	partname	varchar(50),
	grade 		varchar(2) DEFAULT NULL,
	PRIMARY KEY(partname, cid, uid),
	FOREIGN KEY (partname,cid) REFERENCES subparts (partname,cid),
	FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

INSERT INTO partresult(cid,uid,partname,grade) VALUES (1,1,'hemtenta2',4);
INSERT INTO partresult(cid,uid,partname,grade) VALUES (2,1,'hemtenta',3);
INSERT INTO partresult(cid,uid,partname,grade) VALUES (1,2,'hemtenta','u');
INSERT INTO partresult(cid,uid,partname,grade) VALUES (2,2,'projektuppgift','g');
INSERT INTO partresult(cid,uid,partname,grade) VALUES (3,3,'hemtenta',5);
INSERT INTO partresult(cid,uid,partname,grade) VALUES (3,3,'projektuppgift',5);
INSERT INTO partresult(cid,uid,partname,grade) VALUES (1,3,'hemtenta2',4);
INSERT INTO partresult(cid,uid,partname,grade) VALUES (1,3,'hemtenta',3);

/**
 * this table many to many relation between class and course. 
 */ 

CREATE TABLE programcourse (
    class 		varchar(10) DEFAULT NULL,
	cid 		INT UNSIGNED NOT NULL,
	period 		int(1) not null,
	term 		char(5) not null,
	PRIMARY KEY(cid, class),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (class) REFERENCES class (class)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

INSERT INTO programcourse(class,cid) VALUES ('WEBUG13',1);INSERT INTO programcourse(class,cid) VALUES ('WEBUG13',2);INSERT INTO programcourse(class,cid) VALUES ('WEBUG13',3);INSERT INTO programcourse(class,cid) VALUES ('WEBUG13',5);

/**
 * This table seems to be intended to store student results from program courses.
 */ 
CREATE TABLE studentresultat (
    sid 		mediumint(9) NOT NULL AUTO_INCREMENT,
    pnr 		varchar(11) DEFAULT NULL,
    anmkod 		varchar(6) DEFAULT NULL,
    kurskod 	varchar(6) NOT NULL,
    termin 		varchar(5) DEFAULT NULL,
    resultat 	decimal(3,1) DEFAULT NULL,
    avbrott 	date DEFAULT NULL,
    PRIMARY KEY (sid),
    KEY anmkod (anmkod),
    KEY pnr (pnr),
    KEY kurskod (kurskod)

	
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;
/*
INSERT INTO programkurs VALUES (45,'WEBUG12h','DA135G','Datakommunikation - Introduktion G1N 7,5 hp','87524',5,NULL,'20132'),(46,'WEBUG12h','SD140G','Studieteknik G1N 1,5 hp','85621',4,NULL,'20122'),(47,'WEBUG12h','DA147G','Grundläggande programmering med C++ G1N 7,5 hp','87520',5,NULL,'20122'),(48,'WEBUG12h','IT116G','Informationssäkerhet - Introduktion G1N 7,5 hp','87510',5,NULL,'20142'),(49,'WEBUG12h','DA133G','Webbutveckling - datorgrafik G1N 7,5 hp','87518',4,NULL,'20122'),(50,'WEBUG12h','DA121G','Datorns grunder G1N 7,5 hp','87514',4,NULL,'20122'),(51,'WEBUG12h','DA330G','Webbprogrammering G1F 7,5 hp','87547',5,NULL,'20132'),(52,'WEBUG12h','DA523G','Webbteknologi - forskning och utveckling G2F 7,5 hp','87568',5,NULL,'20142'),(53,'WEBUG12h','DA524G','Webbutveckling - content management och drift G2F 7,5 hp','87569',4,NULL,'20142'),(54,'WEBUG12h','DA322G','Operativsystem G1F 7,5 hp','87531',4,NULL,'20142'),(55,'WEBUG12h','IS130G','IT i organisationer - Introduktion G1N 7,5 hp','88317',4,NULL,'20132'),(56,'WEBUG12h','IS317G','Databaskonstruktion G1F 7,5 hp','88344',4,NULL,'20132'),(57,'WEBUG12h','KB111G','Interaktion, design och användbarhet I G1N 7,5 hp','88417',5,NULL,'20122'),(58,'WEBUG12h','DA348G','Objektorienterad programmering G1F 7,5 hp','97543',1,NULL,'20131'),(59,'WEBUG12h','MA113G','Algebra och logik G1N 7,5 hp','93612',1,NULL,'20141'),(60,'WEBUG12h','DA338G','Projekt i webbutveckling G1F 15 hp','97545',2,NULL,'20141'),(61,'WEBUG12h','DA345G','Examensarbete i datalogi med inriktning mot webbutveckling G2E 30 hp','97560',1,NULL,'20151'),(62,'WEBUG12h','DV123G','Webbutveckling - webbplatsdesign G1N 7,5 hp','97703',1,NULL,'20131'),(63,'WEBUG12h','DV313G','Webbutveckling - XML API G1F 7,5 hp','97737',2,NULL,'20131'),(64,'WEBUG12h','DV318G','Programvaruutveckling - programvaruprojekt G1F 15 hp','97744',2,NULL,'20141'),(65,'WEBUG12h','DV316G','Programvaruutveckling G1F 7,5 hp','97745',1,NULL,'20141'),(66,'WEBUG12h','IS114G','Databassystem G1N 7,5 hp','98324',2,NULL,'20131'),(67,'WEBUG13h','DA147G','Grundläggande programmering med C++ G1N 7,5 hp','87501',5,NULL,'20132');
INSERT INTO studentresultat VALUES (1,'111111-1111',NULL,'IT111G','H14',5.0,NULL),(2,'111111-1111',NULL,'IT115G','H14',7.5,NULL),(3,'111111-1111',NULL,'IT118G','H14',7.5,NULL),(4,'111111-1111',NULL,'IT120G','H14',0.0,NULL),(5,'111111-1111',NULL,'IT108G','V15',0.0,NULL),(6,'111111-1111',NULL,'IT121G','V15',0.0,NULL),(7,'111111-1111',NULL,'IT308G','V15',0.0,NULL);

*/

/**
	This view eases the process of determining how many hp a student with a specific uid
	in a specific course cid has finished. See the example below.

	Example, get total hp finished by user with uid 2 in course with cid 1:
		SQL code: select hp from studentresult where user = 2 and course_id = 1;
*/
create view studentresult as
	select user.uid as user, user_course.cid as course_id, sum(subparts.parthp) as hp from subparts  
		inner join partresult on partresult.partname = subparts.partname
		inner join user_course on user_course.cid = subparts.cid
		inner join user on user.uid = partresult.uid and user.uid = user_course.uid and user_course.uid = partresult.uid
			and partresult.grade != 'u'
			group by user.uid;

/* updatesd info in user table */

update user set firstname="Toddler", lastname="Kong" where username="Toddler";
update user set firstname="Johan", lastname="Grimling" where username="Grimling";
update user set ssn="810101-5567" where username="Grimling";
update user set ssn="444444-5447" where username="Toddler";
update user set password=password("Kong") where username="Toddler";
update user set password=password("Banan") where username="Tester";
update user set superuser=1 where username="Toddler";

/*Code for testing Code Viewer


 Create a number of examples, linked from one to five
 Example 1 should have no template and therefore the select template dialog should be shown
 http://localhost/Toddler/CodeViewer/EditorV50.php?exampleid=1&courseid=1&cvers=2013
 Example 2 has template 1 (no template dialog should be shown but rather an error message if not administrator) and it should show a code file on the left pane and a description pane on the right pane
 http://localhost/Toddler/CodeViewer/EditorV50.php?exampleid=2&courseid=1&cvers=2013 */

INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid) values (1,"Xample Code","Events 1","Runlink1.html",1,2013,"2");
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid) values (1,"Xample Code","Events 1","Runlink2.html",1,2013,"3","1",1);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid) values (1,"Xample Code","Events 2","Runlink3.html",1,2013,"4","2");
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid) values (1,"Xample Code","Callback 2","Dulf.html",1,2013,"5","3",1);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid) values (1,"Xample Code","Callback 3","",2,2013,1);

/*
 Boxes for example 2 (Boxes are created automatically when selecting template) 
 Note: if we have box rows but no template the template assignment will give an error message, it is thus important that there are corresponding templates
*/
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid) VALUES (1,2,"TitleA","Code","[viktig=1]","js1.js",1);
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,segment,wordlistid) VALUES (2,2,"TitleB","Document","[viktig=1]","<b>Events 1</b>This is elem the first section of the event description<b>More</b>This is more text",1);
/*
 In example 2 rows 3-5 and 8-1 are highlighted
*/
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (2,1,3,5,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (2,1,8,11,1);
/*
 Important words to be highlighted in example 1 and 2
*/

INSERT INTO impwordlist(exampleid,word,uid) values (1,"event",1);
INSERT INTO impwordlist(exampleid,word,uid) values (1,"elem",1);
INSERT INTO impwordlist(exampleid,word,uid) values (1,"pageY",2);
INSERT INTO impwordlist(exampleid,word,uid) values (2,"event",1);
INSERT INTO impwordlist(exampleid,word,uid) values (2,"elem",1);
INSERT INTO impwordlist(exampleid,word,uid) values (2,"pageY",2);


/*
 Wordlists from three typical languages
*/
INSERT INTO wordlist(wordlistname,uid) VALUES ("JS",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("PHP",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("HTML",1);
/*
 Words in wordlist 1,2 and 3
*/
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

/* solves the null problmen in codeviewer*/
UPDATE codeexample
SET sectionname='Example1' , afterid='2' , beforeid='1'
WHERE exampleid='1';

UPDATE codeexample
SET sectionname='Example2' , afterid='3' , beforeid='1'
WHERE exampleid='2';

UPDATE codeexample
SET sectionname='Example3' , afterid='4' , beforeid='2'
WHERE exampleid='3';

UPDATE codeexample
SET sectionname='Example4' , afterid='5' , beforeid='3'
WHERE exampleid='4';

UPDATE codeexample
SET sectionname='Example5' , afterid='6' , beforeid='4'
WHERE exampleid='5';

UPDATE codeexample
SET sectionname='Example6' , afterid='7' , beforeid='5'
WHERE exampleid='6';

UPDATE codeexample
SET sectionname='Example7' , afterid='8' , beforeid='6'
WHERE exampleid='7';

UPDATE codeexample
SET sectionname='Example8' , afterid='9' , beforeid='7'
WHERE exampleid='8';

UPDATE codeexample
SET sectionname='Example9' , afterid='10' , beforeid='8'
WHERE exampleid='9';

UPDATE codeexample
SET sectionname='Example10' , afterid='11', beforeid='9'
WHERE exampleid='10';

UPDATE codeexample
SET sectionname='Example11' , beforeid='10' , afterid='12'
WHERE exampleid='11';


UPDATE codeexample
SET sectionname='HTMLex1',	templateid='1', uid='1', beforeid='11', afterid='13', runlink='html1.html'
WHERE exampleid='12';

UPDATE box
SET	segment='<b>HTML Helloworld</b>', boxcontent='Document', filename=null
WHERE exampleid='12' and boxid='2' ;

UPDATE codeexample
SET beforeid='12', afterid='13'
WHERE exampleid='13';

