drop database imperious;
create database imperious;
use imperious;

/* user contains the users of the system and related  information */
CREATE TABLE user(
	uid					INT UNSIGNED NOT NULL AUTO_INCREMENT,
	username			VARCHAR(80) NOT NULL UNIQUE,
	firstname			VARCHAR(50) NULL,
	lastname			VARCHAR(50) NULL,
	ssn					VARCHAR(20) NULL unique,
	password			VARCHAR(225) NOT NULL,
	lastupdated			TIMESTAMP,
	addedtime  			TIMESTAMP,
	lastvisit			TIMESTAMP,
	newpassword			TINYINT(1) NULL,
	creator				INT UNSIGNED NULL,
	superuser			TINYINT(1) NULL,
	email				VARCHAR(256) DEFAULT NULL,
	class 				VARCHAR(10) DEFAULT NULL REFERENCES class (class),
	totalHp				decimal(4,1),
	PRIMARY KEY(uid)

) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO user(username,password,newpassword,creator,superuser) values ("Grimling","$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m",0,1,1);
INSERT INTO user(username,password,newpassword,creator) values ("Toddler","$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",0,1);
INSERT INTO user(username,password,newpassword,creator,ssn) values ("Tester", "$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",1,1,"111111-1111");


/*
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
	capacity			int(5),
	hp					decimal(4,1) not null default 7.5,
	courseHttpPage		varchar(2000),
	CONSTRAINT pk_course PRIMARY KEY(cid),
	CONSTRAINT fk_course_joins_user FOREIGN KEY (creator) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

/* This table represents a many-to-many relation between courses, to illustrate pre-requirements for courses. */
CREATE TABLE course_req(
	cid				INT UNSIGNED NOT NULL,
	req_cid			INT UNSIGNED NOT NULL,
	PRIMARY KEY(cid, req_cid),
	FOREIGN KEY(cid) REFERENCES course(cid),
	FOREIGN KEY(req_cid) REFERENCES course(cid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

/* 
 * This table represents a many-to-many relation between users and courses. That is,
 * a tuple in this table joins a user with a course.
 */
CREATE TABLE user_course(
	uid				INT UNSIGNED NOT NULL,
	cid				INT UNSIGNED NOT NULL,
	result 			decimal(2,1) not null,
	modified 		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	creator 		INTEGER,
	access			VARCHAR(10) NOT NULL,
	period			int(1) not null,
	term			char(5) not null,
	CONSTRAINT pk_user_course PRIMARY KEY(uid, cid),
	CONSTRAINT user_course_joins_user FOREIGN KEY (uid)REFERENCES user (uid) ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT user_course_joins_course FOREIGN KEY (cid) REFERENCES course (cid) ON DELETE CASCADE ON UPDATE CASCADE
);

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
	highscoremode	INT DEFAULT 0,
	CONSTRAINT pk_listentries PRIMARY KEY(lid),
	
/*	FOREIGN KEY(code_id) REFERENCES codeexample(exampleid) ON UPDATE NO ACTION ON DELETE SET NULL, */
	CONSTRAINT fk_listentries_joins_user FOREIGN KEY(creator) REFERENCES user(uid) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY(cid) REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
	
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

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
		
	CONSTRAINT pk_quiz PRIMARY KEY (id),
	CONSTRAINT fk_quiz_joins_course FOREIGN KEY (cid) REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* 
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
	disabled		TINYINT(1) DEFAULT 0,
	CONSTRAINT 		pk_variant PRIMARY KEY 	(vid),
	CONSTRAINT 		fk_variant_joins_quiz FOREIGN KEY (quizID) REFERENCES quiz(id) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE userAnswer (
	aid				INT(11) NOT NULL AUTO_INCREMENT,
	cid				INT UNSIGNED NOT NULL, 
	quiz 			INT(11),
	variant			INT,
	moment			INT UNSIGNED NOT NULL,
	grade 			TINYINT(2),
	uid 			INT UNSIGNED NOT NULL,
	useranswer		varchar(2048),
	opened	 		TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	submitted		TIMESTAMP NULL,
	marked			TIMESTAMP NULL,
	vers			VARCHAR(8),
	creator 		INTEGER,
	score			INT DEFAULT NULL, 
	timeUsed int(11) DEFAULT NULL,
	totalTimeUsed int(11) DEFAULT '0',
	stepsUsed int(11) DEFAULT NULL,
	totalStepsUsed int(11) DEFAULT '0',
	CONSTRAINT pk_useranswer PRIMARY KEY 	(aid),
	CONSTRAINT fk_useranswer_joins_course FOREIGN KEY (cid) REFERENCES course (cid),
	CONSTRAINT fk_useranswer_joins_user FOREIGN KEY (uid) REFERENCES user(uid),
	CONSTRAINT fk_useranswer_joins_quiz FOREIGN KEY (quiz) REFERENCES quiz(id),
	CONSTRAINT fk_useranswer_joins_listentries FOREIGN KEY (moment) REFERENCES listentries(lid),
	CONSTRAINT fk_useranswer_joins_variant FOREIGN KEY (variant) REFERENCES variant(vid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/*
 * This view pulls the top 10 fastest quiz finishing students and lists them
 */
DROP VIEW IF EXISTS highscore_quiz_time;
CREATE VIEW highscore_quiz_time AS
	SELECT userAnswer.cid, userAnswer.quiz, userAnswer.uid, userAnswer.grade, userAnswer.score
		FROM userAnswer ORDER BY userAnswer.score ASC LIMIT 10;

CREATE TABLE vers(
	cid				INT UNSIGNED NOT NULL AUTO_INCREMENT,
	vers			VARCHAR(8) NOT NULL,
	versname		VARCHAR(45) NOT NULL,
	coursecode		VARCHAR(45) NOT NULL,
	coursename	  	VARCHAR(45) NOT NULL,
	coursenamealt	VARCHAR(45) NOT NULL,
	CONSTRAINT fk_vers_joins_course FOREIGN KEY (cid) REFERENCES course(cid),		
	CONSTRAINT pk_vers PRIMARY KEY(cid,vers)
);

CREATE TABLE fileLink(
	fileid			INT(11) NOT NULL AUTO_INCREMENT,
	filename		VARCHAR(128) NOT NULL,
	kind			INTEGER,	
	cid				INT UNSIGNED NOT NULL,
	isGlobal		BOOLEAN DEFAULT 0,
	CONSTRAINT pk_filelink PRIMARY KEY (fileid),
	CONSTRAINT fk_filelink_joins_course FOREIGN KEY (cid) REFERENCES course (cid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* 
 * An entry in this table allow file locations to be related to specific courses. 
 * For example, if an instructor wants to give students a link to a file that 
 * they should be able to download from the course page.
 */
CREATE TABLE template(
	templateid		INTEGER UNSIGNED NOT NULL,
	stylesheet 		VARCHAR(39) NOT NULL,
	numbox			INTEGER NOT NULL,
	CONSTRAINT pk_template PRIMARY KEY(templateid, stylesheet)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;


/* Code Example contains a list of the code examples for a version of a course in the database 
 Version of sections and examples corresponds roughly to year or semester that the course was given. */

CREATE TABLE codeexample(
	exampleid		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	cid				INT UNSIGNED NOT NULL,
	examplename		VARCHAR(64),
	sectionname		VARCHAR(64),
	beforeid		INTEGER,
	afterid			INTEGER,
	runlink		 	VARCHAR(64),
	cversion		INTEGER,
	public 			tinyint(1) UNSIGNED NOT NULL DEFAULT 0,
	updated 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid				INT UNSIGNED NOT NULL,
	templateid		INT UNSIGNED NOT NULL DEFAULT '0',
	CONSTRAINT pk_codeexample PRIMARY KEY(exampleid),
	CONSTRAINT fk_codeexample_joins_course FOREIGN KEY (cid) REFERENCES course (cid),
	CONSTRAINT fk_codeexample_joins_user FOREIGN KEY (uid) REFERENCES user (uid),
	CONSTRAINT fk_codeexample_joins_template FOREIGN KEY (templateid) REFERENCES template (templateid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* Table structure for sequence, holding the sequence order of a specific example sequence */
CREATE TABLE sequence (
	seqid 			int(10) unsigned NOT NULL,
  	cid 			int(10) unsigned NOT NULL,
  	exampleseq 	text NOT NULL,
  	PRIMARY KEY (cid,seqid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* improw contains a list of the important rows for a certain example */
CREATE TABLE wordlist(
	wordlistid		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,		
	wordlistname	VARCHAR(24),
	updated 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid				INT UNSIGNED NOT NULL,
	CONSTRAINT pk_wordlist PRIMARY KEY(wordlistid),
	CONSTRAINT pk_wordlist_joins_user FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* Delete and update all foreign keys before deleting a wordlist */
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
	wordid			MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	wordlistid		MEDIUMINT UNSIGNED NOT NULL,			
	word 			VARCHAR(64),
	label			VARCHAR(256),
	updated 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid				INT UNSIGNED NOT NULL,
	CONSTRAINT pk_word PRIMARY KEY(wordid, wordlistid),
	CONSTRAINT fk_word_joins_user FOREIGN KEY (uid) REFERENCES user (uid),
	CONSTRAINT fk_word_joins_wordlist FOREIGN KEY(wordlistid) REFERENCES wordlist(wordlistid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* boxes with information in a certain example */
CREATE TABLE box(
	boxid					INTEGER UNSIGNED NOT NULL,
	exampleid 		MEDIUMINT UNSIGNED NOT NULL,
	boxtitle		VARCHAR(64),
	boxcontent		VARCHAR(64),
	filename		VARCHAR(256),
	settings		VARCHAR(1024),
	wordlistid		MEDIUMINT UNSIGNED,
	segment			TEXT,
	CONSTRAINT pk_box PRIMARY KEY(boxid, exampleid),
	CONSTRAINT fk_box_joins_codeexample FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* improw contains a list of the important rows for a certain example */
CREATE TABLE improw(
	impid		  	MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	boxid         	INTEGER UNSIGNED NOT NULL,
	exampleid    	MEDIUMINT UNSIGNED NOT NULL,				
	istart			INTEGER,
	iend			INTEGER,
	irowdesc		VARCHAR(1024),
	updated	 		TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid				INT UNSIGNED NOT NULL,
	CONSTRAINT pk_improw PRIMARY KEY(impid, exampleid, boxid),
	CONSTRAINT fk_improw_joins_user FOREIGN KEY (uid) REFERENCES user (uid),
	CONSTRAINT fk_improw_joins_box FOREIGN KEY (boxid, exampleid) REFERENCES box (boxid, exampleid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/* Wordlist contains a list of important words for a certain code example */
CREATE TABLE impwordlist(
	wordid		  	MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	exampleid		MEDIUMINT UNSIGNED NOT NULL,
	word 			VARCHAR(64),
	label			VARCHAR(256),
	UPDATED 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid				INTEGER UNSIGNED NOT NULL,
	CONSTRAINT pk_impwordlist PRIMARY KEY(wordid),
	CONSTRAINT fk_impwordlist_joins_codeexample FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
	CONSTRAINT fk_impwordlist_joins_user FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE submission(
	subid	  		MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	uid				INTEGER,
	cid				INTEGER,
	vers			INTEGER,
	did			 	INTEGER,
	seq				INTEGER,
	fieldnme 		VARCHAR(64),
	filepath		VARCHAR(256),
	filename		VARCHAR(128),
	extension		VARCHAR(32),
	mime			VARCHAR(64),
	kind			INTEGER,
	updtime			TIMESTAMP,
	PRIMARY KEY(subid) 
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE eventlog(
	eid 			BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	type 			TINYINT DEFAULT 0,
	ts 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	address 		VARCHAR(45),
	raddress 		VARCHAR(45),
	user 			VARCHAR(128),
	eventtext	 	TEXT NOT NULL,
	CONSTRAINT pk_eventlog PRIMARY KEY(eid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

CREATE TABLE playereditor_playbacks(
    id 				VARCHAR(32) NOT NULL,
    type  	 		SMALLINT(1) NOT NULL,
    path   	 		VARCHAR(256) NOT NULL,
    CONSTRAINT pk_playereditor_playbacks PRIMARY KEY(id, type)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/*
 * This table seems to be intended to store program courses. It does not seem
 * to have any relation to the rest of the database and kind of stands out oddly.
 
CREATE TABLE programkurs (
    pkid 		int(11) NOT NULL AUTO_INCREMENT,
    kull 		varchar(8) DEFAULT NULL,
    kurskod 	varchar(6) DEFAULT NULL,
    kursnamn 	varchar(100) DEFAULT NULL,
    anmkod 		varchar(8) DEFAULT NULL,
    period 		mediumint(9) DEFAULT NULL,
    platser 	int(11) DEFAULT NULL,
    termin 		varchar(45) DEFAULT NULL,
    PRIMARY KEY (pkid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;
*/

CREATE TABLE class (
    class 		varchar(10) NOT NULL,
	responsible	INT UNSIGNED NOT null,
	classname 	varchar(100) DEFAULT NULL,
    regcode 	int(8) DEFAULT NULL,
	classcode 	varchar(8) DEFAULT NULL,
    hp 			decimal(10,1) DEFAULT NULL,
	tempo 		int(3) DEFAULT NULL,	
	hpProgress 	decimal(3,1),
    PRIMARY KEY (class,responsible),
	FOREIGN KEY (responsible) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/*
 * this table stores the different subparts of each course. 
 */ 
CREATE TABLE subparts(
	partname 	varchar(50),
	cid 		INT UNSIGNED NOT NULL,
	parthp 		decimal(3,1) DEFAULT NULL,
	difgrade	varchar(10),
	PRIMARY KEY (partname,cid),
	FOREIGN KEY (cid) REFERENCES course (cid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/*
 * this table is weak reslation to user and partcourse. 
 */ 
CREATE TABLE partresult (
    cid 		INT UNSIGNED NOT NULL,
	uid			INT UNSIGNED NOT NULL,
	partname	varchar(50),
	grade 		varchar(1) DEFAULT NULL,
	hp			decimal(3,1) references subparts (parthp),
	PRIMARY KEY(partname, cid, uid,grade),
	FOREIGN KEY (partname,cid) REFERENCES subparts (partname,cid),
	FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/*
 * this table many to many relation between class and course. 
 */ 
CREATE TABLE programcourse (
    class 		varchar(10) DEFAULT NULL,
	cid 		INT UNSIGNED NOT NULL,
	period 		int(1) ,
	term 		varchar(10),
	PRIMARY KEY(cid, class),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (class) REFERENCES class (class)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

/*
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
This table is used by the duggasys system to generate certificates.

Todo: This table has a number of references, such as to course, list etc., this implementation does not
create foreign key constraints for those references so it will need to be revisited and refactored later.
*/
CREATE TABLE list (
	listnr 			INT,
	listeriesid 	INT,
	provdatum 		DATE,
	responsible 	VARCHAR(40),
	responsibledate DATE,
	course 			INT,
	listid INT AUTO_INCREMENT,
	CONSTRAINT PK_list PRIMARY KEY(listid)
) CHARACTER SET UTF8 COLLATE UTF8_UNICODE_CI ENGINE=INNODB;

create table thread(
    threadid int(10) unsigned not null AUTO_INCREMENT,
    cid int(10) unsigned not null,
    uid int(10) unsigned not null,
    topic varchar(50) not null,
    datecreated timestamp null,
    lastedited timestamp not null default CURRENT_TIMESTAMP ON UPDATE current_timestamp,
    hidden tinyint(1),
    description varchar(2000) not null,
    locked tinyint(1),
	lastcommentedon timestamp null,
    primary key(threadid),
    foreign key(cid) references course(cid),
    foreign key(uid) references user(uid)
)CHARACTER SET UTF8 COLLATE UTF8_UNICODE_CI ENGINE=INNODB;

create table threadcomment(
    commentid int(10) NOT NULL AUTO_INCREMENT,
    threadid int(10) unsigned not null,
    uid int(10) unsigned not null,
    text varchar(2500) not null,
    datecreated timestamp null,
    lastedited timestamp not null default CURRENT_TIMESTAMP ON UPDATE current_timestamp,
    replyid int(10),
    type tinyint(1),
    primary key(commentid),
    foreign key(threadid) references thread(threadid) ON DELETE CASCADE,
    foreign key(uid) references user(uid),
    foreign key(replyid) references threadcomment(commentid)
)CHARACTER SET UTF8 COLLATE UTF8_UNICODE_CI ENGINE=INNODB;


create table threadaccess(
    threadid int(10) unsigned,
    uid int(10) unsigned,
    primary key(threadid, uid),
    foreign key(threadid) references thread(threadid) ON DELETE CASCADE,
    foreign key(uid) references user(uid) ON DELETE CASCADE
)CHARACTER SET UTF8 COLLATE UTF8_UNICODE_CI ENGINE=INNODB;

/*
INSERT INTO programkurs VALUES 	(45,'WEBUG12h','DA135G','Datakommunikation - Introduktion G1N 7,5 hp','87524',5,NULL,'20132'),
								(46,'WEBUG12h','SD140G','Studieteknik G1N 1,5 hp','85621',4,NULL,'20122'),
								(47,'WEBUG12h','DA147G','Grundläggande programmering med C++ G1N 7,5 hp','87520',5,NULL,'20122'),
								(48,'WEBUG12h','IT116G','Informationssäkerhet - Introduktion G1N 7,5 hp','87510',5,NULL,'20142'),
								(49,'WEBUG12h','DA133G','Webbutveckling - datorgrafik G1N 7,5 hp','87518',4,NULL,'20122'),
								(50,'WEBUG12h','DA121G','Datorns grunder G1N 7,5 hp','87514',4,NULL,'20122'),
								(51,'WEBUG12h','DA330G','Webbprogrammering G1F 7,5 hp','87547',5,NULL,'20132'),
								(52,'WEBUG12h','DA523G','Webbteknologi - forskning och utveckling G2F 7,5 hp','87568',5,NULL,'20142'),
								(53,'WEBUG12h','DA524G','Webbutveckling - content management och drift G2F 7,5 hp','87569',4,NULL,'20142'),
								(54,'WEBUG12h','DA322G','Operativsystem G1F 7,5 hp','87531',4,NULL,'20142'),
								(55,'WEBUG12h','IS130G','IT i organisationer - Introduktion G1N 7,5 hp','88317',4,NULL,'20132'),
								(56,'WEBUG12h','IS317G','Databaskonstruktion G1F 7,5 hp','88344',4,NULL,'20132'),
								(57,'WEBUG12h','KB111G','Interaktion, design och användbarhet I G1N 7,5 hp','88417',5,NULL,'20122'),
								(58,'WEBUG12h','DA348G','Objektorienterad programmering G1F 7,5 hp','97543',1,NULL,'20131'),
								(59,'WEBUG12h','MA113G','Algebra och logik G1N 7,5 hp','93612',1,NULL,'20141'),
								(60,'WEBUG12h','DA338G','Projekt i webbutveckling G1F 15 hp','97545',2,NULL,'20141'),
								(61,'WEBUG12h','DA345G','Examensarbete i datalogi med inriktning mot webbutveckling G2E 30 hp','97560',1,NULL,'20151'),
								(62,'WEBUG12h','DV123G','Webbutveckling - webbplatsdesign G1N 7,5 hp','97703',1,NULL,'20131'),
								(63,'WEBUG12h','DV313G','Webbutveckling - XML API G1F 7,5 hp','97737',2,NULL,'20131'),
								(64,'WEBUG12h','DV318G','Programvaruutveckling - programvaruprojekt G1F 15 hp','97744',2,NULL,'20141'),
								(65,'WEBUG12h','DV316G','Programvaruutveckling G1F 7,5 hp','97745',1,NULL,'20141'),
								(66,'WEBUG12h','IS114G','Databassystem G1N 7,5 hp','98324',2,NULL,'20131'),
								(67,'WEBUG13h','DA147G','Grundläggande programmering med C++ G1N 7,5 hp','87501',5,NULL,'20132');
								
INSERT INTO studentresultat VALUES	(1,'111111-1111',NULL,'IT111G','H14',5.0,NULL),
									(2,'111111-1111',NULL,'IT115G','H14',7.5,NULL),
									(3,'111111-1111',NULL,'IT118G','H14',7.5,NULL),
									(4,'111111-1111',NULL,'IT120G','H14',0.0,NULL),
									(5,'111111-1111',NULL,'IT108G','V15',0.0,NULL),
									(6,'111111-1111',NULL,'IT121G','V15',0.0,NULL),
									(7,'111111-1111',NULL,'IT308G','V15',0.0,NULL);
*/

/*
	This view eases the process of determining how many hp a student with a specific uid
	in a specific course cid has finished. See the example below.

	Example, get total hp finished by user with uid 2 in course with cid 1:
		SQL code: select hp from studentresult where user = 2 and course_id = 1;
*/

create view studentresultCourse  as
	select partresult.uid as username, partresult.cid, partresult.hp  from partresult
	inner join subparts on partresult.partname = subparts.partname 
		and subparts.cid = partresult.cid
		and subparts.parthp = partresult.hp
	where partresult.grade != 'u';

/* updatesd info in user table */
update user set firstname="Toddler", lastname="Kong" where username="Toddler";
update user set firstname="Johan", lastname="Grimling" where username="Grimling";
update user set ssn="810101-5567" where username="Grimling";
update user set ssn="444444-5447" where username="Toddler";
update user set password=password("Kong") where username="Toddler";
update user set superuser=1 where username="Toddler";

/*
 Clears the eventlog table on a weekly basis
 If this is for some reason needed - comment out. In all other cases, this should not run by default.
DELIMITER $$
CREATE EVENT weekly_eventlog_delete ON SCHEDULE EVERY 1 WEEK 
		DO
	BEGIN
	SET SQL_SAFE_UPDATES = 0;
		DELETE FROM eventlog;
	SET SQL_SAFE_UPDATES = 1;
END $$
DELIMITER ;
 */

/* Templates for codeexamples */
INSERT INTO template(templateid,stylesheet, numbox) VALUES (0,"template0.css",0);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (1,"template1.css",2);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (2,"template2.css",2);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (3,"template3.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (4,"template4.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (5,"template5.css",4);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (6,"template6.css",4);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (7,"template7.css",4);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (8,"template8.css",3);

/* Programming languages that decide highlighting */
INSERT INTO wordlist(wordlistname,uid) VALUES ("JS",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("PHP",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("HTML",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("Plain Text",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("Java",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("SQL",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("SR",1);

 
/* Wordlist for different programming languages */
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"for","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"function","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"if","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"var","D",1);

/* PHP Keywords */
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"__halt_compiler","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"abstract","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"and","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"array","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"as","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"break","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"callable","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"case","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"catch","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"class","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"clone","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"const","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"continue","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"declare","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"default","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"die","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"do","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"echo","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"else","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"elseif","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"empty","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"enddeclare","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"endfor","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"endforeach","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"endif","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"endswitch","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"endwhile","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"eval","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"exit","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"extends","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"final","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"for","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"foreach","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"function","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"global","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"goto","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"if","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"implements","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"include","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"include_once","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"instanceof","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"insteadof","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"interface","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"isset","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"list","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"namespace","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"new","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"or","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"print","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"private","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"protected","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"public","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"require","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"require_once","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"return","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"static","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"switch","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"throw","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"trait","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"try","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"unset","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"use","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"var","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"while","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (2,"xor","A",1);

/* HTML Keywords */
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"onclick","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"onload","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"class","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"id","D",1);

/* Plain Text Keywords */


/* Java Keywords */
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"abstract","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"continue","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"for","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"new","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"switch","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"assert","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"default","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"goto","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"package","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"synchronized","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"boolean","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"do","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"if","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"private","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"this","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"break","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"double","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"implements","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"protected","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"throw","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"byte","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"else","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"import","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"public","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"throws","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"case","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"enum","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"var","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"catch","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"instanceof","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"return","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"transient","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"extends","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"int","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"short","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"try","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"char","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"final","C",1); 
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"interface","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"static","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"class","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"long","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"strictfp","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"volatile","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"float","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"native","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"super","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (5,"while","A",1);

/* SQL Keywords */
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"A","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ABORT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ABS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ABSOLUTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ACCESS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ACTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ADA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ADD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ADMIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AFTER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AGGREGATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ALIAS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ALL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ALLOCATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ALSO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ALTER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ALWAYS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ANALYSE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ANALYZE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ANY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ARE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ARRAY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ASC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ASENSITIVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ASSERTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ASSIGNMENT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ASYMMETRIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ATOMIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ATTRIBUTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ATTRIBUTES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AUDIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AUTHORIZATION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AUTO_INCREMENT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AVG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"AVG_ROW_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BACKUP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BACKWARD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BEFORE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BEGIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BERNOULLI","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BETWEEN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BIGINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BINARY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BIT_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BITVAR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BLOB","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BOOL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BOOLEAN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BOTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BREADTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BREAK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BROWSE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BULK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"BY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"C","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CACHE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CALL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CALLED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CARDINALITY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CASCADE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CASCADED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CASE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CAST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CATALOG_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CEIL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CEILING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHAIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHANGE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHAR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHAR_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHARACTER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHARACTER_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHARACTER_SET_CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHARACTER_SET_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHARACTER_SET_SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHARACTERISTICS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHARACTERS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHECK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHECKED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHECKPOINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CHECKSUM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CLASS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CLASS_ORIGIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CLOB","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CLOSE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CLUSTER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CLUSTERED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COALESCE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COBOL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLLATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLLATION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLLATION_CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLLATION_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLLATION_SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLLECT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLUMN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLUMN_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COLUMNS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COMMAND_FUNCTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COMMAND_FUNCTION_CODE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COMMENT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COMMIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COMMITTED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COMPLETION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COMPRESS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COMPUTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONDITION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONDITION_NUMBER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONNECT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONNECTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONNECTION_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONSTRAINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONSTRAINT_CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONSTRAINT_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONSTRAINT_SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONSTRAINTS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONSTRUCTOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONTAINS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONTAINSTABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONTINUE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONVERSION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CONVERT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COPY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CORR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CORRESPONDING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COUNT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COVAR_POP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"COVAR_SAMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CREATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CREATEDB","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CREATEROLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CREATEUSER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CROSS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CSV","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CUBE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CUME_DIST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT_DATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT_DEFAULT_TRANSFORM_GROUP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT_PATH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT_ROLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT_TIME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT_TIMESTAMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT_TRANSFORM_GROUP_FOR_TYPE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURRENT_USER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURSOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CURSOR_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"CYCLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DATA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DATABASE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DATABASES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DATETIME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DATETIME_INTERVAL_CODE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DATETIME_INTERVAL_PRECISION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DAY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DAY_HOUR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DAY_MICROSECOND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DAY_MINUTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DAY_SECOND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DAYOFMONTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DAYOFWEEK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DAYOFYEAR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DBCC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEALLOCATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DECIMAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DECLARE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEFAULT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEFAULTS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEFERRABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEFERRED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEFINED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEFINER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEGREE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DELAY_KEY_WRITE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DELAYED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DELETE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DELIMITER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DELIMITERS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DENSE_RANK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DENY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEPTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DEREF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DERIVED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DESC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DESCRIBE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DESCRIPTOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DESTROY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DESTRUCTOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DETERMINISTIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DIAGNOSTICS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DICTIONARY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DISABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DISCONNECT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DISK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DISPATCH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DISTINCT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DISTINCTROW","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DISTRIBUTED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DIV","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DOMAIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DOUBLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DROP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DUAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DUMMY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DUMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DYNAMIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DYNAMIC_FUNCTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"DYNAMIC_FUNCTION_CODE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EACH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ELEMENT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ELSE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ELSEIF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ENABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ENCLOSED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ENCODING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ENCRYPTED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"END","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"END-EXEC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ENUM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EQUALS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ERRLVL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ESCAPE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ESCAPED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EVERY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXCEPT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXCEPTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXCLUDE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXCLUDING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXCLUSIVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXEC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXECUTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXISTING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXISTS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXPLAIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXTERNAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"EXTRACT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FALSE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FETCH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FIELDS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FILE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FILLFACTOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FILTER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FINAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FIRST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FLOAT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FLOAT4","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FLOAT8","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FLOOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FLUSH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FOLLOWING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FORCE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FOREIGN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FORTRAN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FORWARD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FOUND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FREE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FREETEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FREETEXTTABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FREEZE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FROM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FULL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FULLTEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FUNCTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"FUSION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"G","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GENERAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GENERATED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GET","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GLOBAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GOTO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GRANT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GRANTED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GRANTS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GREATEST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GROUP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"GROUPING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HANDLER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HAVING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HEADER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HEAP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HIERARCHY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HIGH_PRIORITY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HOLD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HOLDLOCK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HOST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HOSTS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HOUR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HOUR_MICROSECOND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HOUR_MINUTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"HOUR_SECOND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IDENTIFIED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IDENTITY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IDENTITY_INSERT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IDENTITYCOL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IGNORE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ILIKE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IMMEDIATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IMMUTABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IMPLEMENTATION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IMPLICIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INCLUDE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INCLUDING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INCREMENT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INDEX","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INDICATOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INFILE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INFIX","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INHERIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INHERITS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INITIAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INITIALIZE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INITIALLY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INNER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INOUT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INPUT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INSENSITIVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INSERT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INSERT_ID","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INSTANCE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INSTANTIABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INSTEAD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INT1","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INT2","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INT3","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INT4","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INT8","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INTEGER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INTERSECT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INTERSECTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INTERVAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INTO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"INVOKER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"IS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ISAM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ISNULL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ISOLATION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ITERATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"JOIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"K","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"KEY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"KEY_MEMBER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"KEY_TYPE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"KEYS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"KILL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LANCOMPILER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LANGUAGE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LARGE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LAST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LAST_INSERT_ID","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LATERAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LEADING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LEAST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LEAVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LEFT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LESS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LEVEL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LIKE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LIMIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LINENO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LINES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LISTEN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOAD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOCAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOCALTIME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOCALTIMESTAMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOCATION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOCATOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOCK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOGIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOGS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LONG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LONGBLOB","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LONGTEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOOP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOW_PRIORITY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"LOWER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"M","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MAP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MATCH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MATCHED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MAX","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MAX_ROWS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MAXEXTENTS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MAXVALUE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MEDIUMBLOB","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MEDIUMINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MEDIUMTEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MEMBER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MERGE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MESSAGE_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MESSAGE_OCTET_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MESSAGE_TEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"METHOD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MIDDLEINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MIN_ROWS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MINUS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MINUTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MINUTE_MICROSECOND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MINUTE_SECOND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MINVALUE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MLSLABEL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MOD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MODE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MODIFIES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MODIFY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MODULE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MONTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MONTHNAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MORE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MOVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MULTISET","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MUMPS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"MYISAM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NAMES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NATIONAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NATURAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NCHAR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NCLOB","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NESTING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NEW","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NO_WRITE_TO_BINLOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOAUDIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOCHECK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOCOMPRESS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOCREATEDB","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOCREATEROLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOCREATEUSER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOINHERIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOLOGIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NONCLUSTERED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NONE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NORMALIZE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NORMALIZED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOSUPERUSER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOTHING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOTIFY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOTNULL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NOWAIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NULL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NULLABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NULLIF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NULLS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NUMBER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"NUMERIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OBJECT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OCTET_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OCTETS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OFF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OFFLINE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OFFSET","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OFFSETS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OIDS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OLD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ON","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ONLINE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ONLY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPEN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPENDATASOURCE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPENQUERY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPENROWSET","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPENXML","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPERATION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPERATOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPTIMIZE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPTIONALLY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OPTIONS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ORDER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ORDERING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ORDINALITY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OTHERS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OUT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OUTER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OUTFILE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OUTPUT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OVER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OVERLAPS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OVERLAY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OVERRIDING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"OWNER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PACK_KEYS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PAD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARAMETER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARAMETER_MODE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARAMETER_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARAMETER_ORDINAL_POSITION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARAMETER_SPECIFIC_CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARAMETER_SPECIFIC_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARAMETER_SPECIFIC_SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARAMETERS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARTIAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PARTITION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PASCAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PASSword","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PATH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PCTFREE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PERCENT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PERCENT_RANK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PERCENTILE_CONT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PERCENTILE_DISC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PLACING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PLAN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PLI","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"POSITION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"POSTFIX","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"POWER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PRECEDING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PRECISION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PREFIX","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PREORDER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PREPARE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PREPARED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PRESERVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PRIMARY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PRINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PRIOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PRIVILEGES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PROC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PROCEDURAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PROCEDURE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PROCESS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PROCESSLIST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PUBLIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"PURGE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"QUOTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RAID0","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RAISERROR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RANGE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RANK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RAW","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"READ","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"READS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"READTEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RECHECK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RECONFIGURE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RECURSIVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REFERENCES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REFERENCING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGEXP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_AVGX","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_AVGY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_COUNT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_INTERCEPT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_R2","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_SLOPE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_SXX","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_SXY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REGR_SYY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REINDEX","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RELATIVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RELEASE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RELOAD","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RENAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REPEAT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REPEATABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REPLACE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REPLICATION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REQUIRE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RESET","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RESIGNAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RESOURCE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RESTART","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RESTORE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RESTRICT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RESULT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RETURN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RETURNED_CARDINALITY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RETURNED_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RETURNED_OCTET_LENGTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RETURNED_SQLSTATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RETURNS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"REVOKE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RIGHT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RLIKE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROLLBACK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROLLUP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROUTINE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROUTINE_CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROUTINE_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROUTINE_SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROW","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROW_COUNT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROW_NUMBER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROWCOUNT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROWGUIDCOL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROWID","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROWNUM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ROWS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"RULE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SAVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SAVEPOINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCALE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCHEMA_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCHEMAS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCOPE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCOPE_CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCOPE_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCOPE_SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SCROLL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SEARCH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SECOND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SECOND_MICROSECOND","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SECTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SECURITY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SELECT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SELF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SENSITIVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SEPARATOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SEQUENCE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SERIALIZABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SERVER_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SESSION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SESSION_USER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SET","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SETOF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SETS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SETUSER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SHARE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SHOW","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SHUTDOWN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SIGNAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SIMILAR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SIMPLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SIZE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SMALLINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SOME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SONAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SOURCE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SPACE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SPATIAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SPECIFIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SPECIFIC_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SPECIFICTYPE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_BIG_RESULT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_BIG_SELECTS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_BIG_TABLES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_CALC_FOUND_ROWS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_LOG_OFF","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_LOG_UPDATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_LOW_PRIORITY_UPDATES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_SELECT_LIMIT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_SMALL_RESULT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQL_WARNINGS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQLCA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQLCODE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQLERROR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQLEXCEPTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQLSTATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQLWARNING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SQRT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SSL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"START","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STARTING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STATEMENT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STATIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STATISTICS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STATUS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STDDEV_POP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STDDEV_SAMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STDIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STDOUT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STORAGE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STRAIGHT_JOIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STRICT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STRING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STRUCTURE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"STYLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SUBCLASS_ORIGIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SUBLIST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SUBMULTISET","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SUBSTRING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SUCCESSFUL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SUM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SUPERUSER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SYMMETRIC","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SYNONYM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SYSDATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SYSID","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SYSTEM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"SYSTEM_USER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TABLE_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TABLES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TABLESAMPLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TABLESPACE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TEMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TEMPLATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TEMPORARY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TERMINATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TERMINATED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TEXTSIZE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"THAN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"THEN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TIES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TIME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TIMESTAMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TIMEZONE_HOUR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TIMEZONE_MINUTE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TINYBLOB","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TINYINT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TINYTEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TOAST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TOP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TOP_LEVEL_COUNT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRAILING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRAN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRANSACTION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRANSACTION_ACTIVE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRANSACTIONS_COMMITTED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRANSACTIONS_ROLLED_BACK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRANSFORM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRANSFORMS","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRANSLATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRANSLATION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TREAT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRIGGER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRIGGER_CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRIGGER_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRIGGER_SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRIM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRUE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRUNCATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TRUSTED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TSEQUAL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"TYPE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UESCAPE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UID","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNBOUNDED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNCOMMITTED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNDER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNDO","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNENCRYPTED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNION","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNIQUE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNKNOWN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNLISTEN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNLOCK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNNAMED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNNEST","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNSIGNED","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UNTIL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UPDATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UPDATETEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UPPER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"USAGE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"USE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"USER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"USER_DEFINED_TYPE_CATALOG","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"USER_DEFINED_TYPE_CODE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"USER_DEFINED_TYPE_NAME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"USER_DEFINED_TYPE_SCHEMA","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"USING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UTC_DATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UTC_TIME","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"UTC_TIMESTAMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VACUUM","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VALID","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VALIDATE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VALIDATOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VALUE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VALUES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VAR_POP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VAR_SAMP","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VARBINARY","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VARCHAR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VARCHAR2","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VARCHARACTER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VARIABLE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VARIABLES","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VARYING","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VERBOSE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VIEW","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"VOLATILE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WAITFOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WHEN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WHENEVER","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WHERE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WHILE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WIDTH_BUCKET","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WINDOW","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WITH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WITHIN","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WITHOUT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WORK","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WRITE","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"WRITETEXT","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"X509","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"XOR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"YEAR","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"YEAR_MONTH","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ZEROFILL","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (6,"ZONE","A",1);

/* SR Keywords */
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"->","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"//","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"[]","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"P","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"V","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"af","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"and","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"any","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"begin","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"body","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"bool","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"by","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"call","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"cap","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"char","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"chars","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"co","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"const","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"create","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"destroy","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"do","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"downto","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"else","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"end","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"enum","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"exit","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"extend","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"external","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"fa","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"false","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"fi","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"file","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"final","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"forward","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"global","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"high","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"if","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"import","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"in","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"int","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"low","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"mod","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"new","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"next","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"ni","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"noop","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"not","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"null","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"oc","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"od","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"on","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"op","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"optype","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"or","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"proc","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"procedure","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"process","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"ptr","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"real","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"rec","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"receive","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"ref","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"reply","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"res","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"resource","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"return","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"returns","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"sem","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"send","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"separate","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"skip","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"st","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"stderr","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"stdin","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"stdout","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"stop","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"string","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"to","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"true","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"type","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"union","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"val","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"var","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"vm","A",1);
INSERT INTO word (wordlistid, word,label,uid) VALUES (7,"xor","A",1);
