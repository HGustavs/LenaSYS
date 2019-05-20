CREATE TABLE user(
	uid						INT UNSIGNED NOT NULL AUTO_INCREMENT,
	username				VARCHAR(80) NOT NULL UNIQUE,
	firstname				VARCHAR(50) NULL,
	lastname				VARCHAR(50) NULL,
	ssn						VARCHAR(20) NULL UNIQUE,
	password				VARCHAR(225) NOT NULL,
	lastupdated				TIMESTAMP,
	addedtime  				DATETIME,
	lastvisit				DATETIME,
	newpassword				TINYINT(1) NULL,
	creator					INT UNSIGNED NULL,
	superuser				TINYINT(1) NULL,
	email					VARCHAR(256) DEFAULT NULL,
	class 					VARCHAR(10) DEFAULT NULL REFERENCES class (class),
	totalHp					decimal(4,1),
	securityquestion		VARCHAR(256) DEFAULT NULL,
	securityquestionanswer	VARCHAR(256) DEFAULT NULL,
	requestedpasswordchange	TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
	PRIMARY KEY (uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

INSERT INTO user(username,password,newpassword,creator,superuser) values ("Grimling","$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m",0,1,1);
INSERT INTO user(username,password,newpassword,creator) values ("Toddler","$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",0,1); /* Password is Kong */
INSERT INTO user(username,password,newpassword,creator,ssn) values ("Tester", "$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",1,1,"111111-1111"); /* Password is Kong */


/**
 * Course table contains the most essential information relating to study courses in the database.
 */

/* alter table course alter column hp add default 7.5; */

CREATE TABLE course(
	cid						INT UNSIGNED NOT NULL AUTO_INCREMENT,
	coursecode				VARCHAR(45) NULL UNIQUE,
	coursename				VARCHAR(80) NULL,
	created					DATETIME,
	creator					INT UNSIGNED NOT NULL,
	visibility				TINYINT UNSIGNED NOT NULL DEFAULT 0,
	updated					TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	activeversion			VARCHAR(8),
	activeedversion 		VARCHAR(8),
	capacity				INT(5),
	hp						DECIMAL(4,1) NOT NULL DEFAULT 7.5,
	courseHttpPage			VARCHAR(2000),
	PRIMARY KEY (cid),
	FOREIGN KEY (creator) REFERENCES user (uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/* This table represents a many-to-many relation between courses, to illustrate pre-requirements for courses. */
CREATE TABLE course_req(
	cid						INT UNSIGNED NOT NULL,
	req_cid					INT UNSIGNED NOT NULL,
	PRIMARY KEY (cid, req_cid),
	FOREIGN KEY (cid) REFERENCES course(cid),
	FOREIGN KEY (req_cid) REFERENCES course(cid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

/**
 * This table represents a many-to-many relation between users and courses. That is,
 * a tuple in this table joins a user with a course.
 */
CREATE TABLE user_course(
	uid						INT UNSIGNED NOT NULL,
	cid						INT UNSIGNED NOT NULL,
	result 					DECIMAL(2,1) DEFAULT 0.0,
	modified 				TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	creator 				INTEGER,
	access					VARCHAR(10) NOT NULL,
	period					INTEGER DEFAULT 1,
	term					CHAR(5) DEFAULT "VT16",
	vers					VARCHAR(8),
	vershistory				TEXT,
	`groups` 				varchar(256),
	examiner 				integer UNSIGNED,
	teacher					VARCHAR(30),
	PRIMARY KEY (uid, cid),
	FOREIGN KEY (uid) REFERENCES user (uid),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (examiner) REFERENCES user (uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE listentries (
	lid 					INT UNSIGNED NOT NULL AUTO_INCREMENT,
	cid 					INT UNSIGNED NOT NULL,
	entryname 				VARCHAR(64),
	link 					VARCHAR(200),
	kind 					INT unsigned,
	pos 					INT,
	creator 				INT unsigned NOT NULL,
	ts						TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE current_timestamp,
	code_id 				MEDIUMINT unsigned NULL DEFAULT NULL,
	visible 				TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
	vers					VARCHAR(8),
	comments				VARCHAR(512),
	moment					INT UNSIGNED,
	gradesystem 			TINYINT(1),
	highscoremode			INT DEFAULT 0,
	rowcolor				TINYINT(1),
	groupID					INT DEFAULT NULL,
	groupKind 				VARCHAR(16) DEFAULT NULL,
    PRIMARY KEY (lid),
	FOREIGN KEY (creator) REFERENCES user(uid) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY(cid)REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* Quiz tables */
CREATE TABLE quiz (
	id						INT(11) NOT NULL AUTO_INCREMENT,
	cid 					INTEGER UNSIGNED NOT NULL,
	autograde 				TINYINT(1) NOT NULL DEFAULT 0, /* bool */
	gradesystem 			TINYINT(1) NOT NULL DEFAULT 2, /* 1:U-G-VG & 2:U-G & 3:U-3-5 */
	qname 					VARCHAR(255) NOT NULL DEFAULT '',
	quizFile 				VARCHAR(255) NOT NULL DEFAULT 'default',
	qrelease 				DATETIME,
	deadline 				DATETIME,
	modified 				TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	creator 				INTEGER,
	vers					VARCHAR(8),
    qstart					DATE,
	jsondeadline			VARCHAR(2048),
	`group` 				TINYINT(1) DEFAULT 0,
	PRIMARY KEY (id),
	FOREIGN KEY (cid) REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/**
 * A quiz tuple has a one-to-many relation with a tuple from thea variant table.
 * An entry in the variant table is used to add questions to quiz tests.
 */
CREATE TABLE variant(
	vid						INT(11) NOT NULL AUTO_INCREMENT,
	quizID					INT(11),
	param					VARCHAR(8126),
	variantanswer			VARCHAR(8126),
	modified 				TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	creator 				INTEGER,
	disabled				TINYINT(1) DEFAULT 0,
	PRIMARY KEY 	(vid),
	FOREIGN KEY (quizID) REFERENCES quiz(id) ON UPDATE CASCADE ON DELETE CASCADE
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE userAnswer (
	aid						INT(11) NOT NULL AUTO_INCREMENT,
	cid						INT UNSIGNED NOT NULL,
	quiz 					INT(11),
	variant					INT,
	moment					INT UNSIGNED NOT NULL,
	grade 					TINYINT(2),
	uid 					INT UNSIGNED NOT NULL,
	useranswer				TEXT,
	submitted 				TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        -- timestamp when last graded/marked
	marked					TIMESTAMP NULL,
	vers					VARCHAR(8),
	creator 				INTEGER,
	score					INT DEFAULT NULL,
	timeUsed 				INT(11) DEFAULT NULL,
	totalTimeUsed 			INT(11) DEFAULT '0',
	stepsUsed 				INT(11) DEFAULT NULL,
	totalStepsUsed			INT(11) DEFAULT '0',
	feedback 				TEXT,
	timesGraded				INT(11) NOT NULL DEFAULT '0',
	gradeExpire 			TIMESTAMP NULL DEFAULT NULL,
        -- used in conjunction with `marked` to determine if a grade has been changed since it was last exported
        gradeLastExported   timestamp null default null,
	PRIMARY KEY (aid),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (uid) REFERENCES user(uid),
	FOREIGN KEY (quiz) REFERENCES quiz(id),
	FOREIGN KEY (moment) REFERENCES listentries(lid),
	FOREIGN KEY (variant) REFERENCES variant(vid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/**
 * This view pulls the top 10 fastest quiz finishing students and lists them
 */
DROP VIEW IF EXISTS highscore_quiz_time;
CREATE VIEW highscore_quiz_time AS
	SELECT userAnswer.cid, userAnswer.quiz, userAnswer.uid, userAnswer.grade, userAnswer.score
		FROM userAnswer ORDER BY userAnswer.score ASC LIMIT 10;

/* Fix for database coursename: alter table vers alter column coursename VARCHAR(80); */

CREATE TABLE vers(
	cid						INT UNSIGNED NOT NULL AUTO_INCREMENT,
	vers					VARCHAR(8),
	versname				VARCHAR(45) NOT NULL,
	coursecode				VARCHAR(45) NOT NULL,
	coursename				VARCHAR(80) NOT NULL,
	coursenamealt			VARCHAR(45) NOT NULL,
	startdate     			DATETIME,
	enddate       			DATETIME,
	updated					TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (cid) REFERENCES course(cid),
	PRIMARY KEY (cid,vers)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE fileLink(
	fileid					INT(11) NOT NULL AUTO_INCREMENT,
	filename				VARCHAR(128) NOT NULL,
	kind					INTEGER,
	cid						INT UNSIGNED NOT NULL,
	isGlobal				BOOLEAN DEFAULT 0,
	filesize				INT(11) NOT NULL DEFAULT 0,
	uploaddate				DATETIME NOT NULL DEFAULT NOW(),
    filesiz 				INT,
    vers 					VARCHAR(8),
	PRIMARY KEY (fileid),
	FOREIGN KEY (cid) REFERENCES course (cid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/**
 * An entry in this table allow file locations to be related to specific courses.
 * For example, if an instructor wants to give students a link to a file that
 * they should be able to download from the course page.
 */
CREATE TABLE template(
	templateid				INTEGER UNSIGNED NOT NULL,
	stylesheet 				VARCHAR(39) NOT NULL,
	numbox					INTEGER NOT NULL,
	PRIMARY KEY(templateid, stylesheet)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;


/* Code Example contains a list of the code examples for a version of a course in the database
 Version of sections and examples corresponds roughly to year or semester that the course was given. */

CREATE TABLE codeexample(
	exampleid				MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	cid						INT UNSIGNED NOT NULL,
	examplename				VARCHAR(64),
	sectionname				VARCHAR(64),
	beforeid				INTEGER,
	afterid					INTEGER,
	runlink		 			VARCHAR(256),
	cversion				INTEGER,
	public 					TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
	updated 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid						INT UNSIGNED NOT NULL,
	templateid				INT UNSIGNED NOT NULL DEFAULT '0',
	PRIMARY KEY (exampleid),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (uid) REFERENCES user (uid),
	FOREIGN KEY (templateid) REFERENCES template (templateid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* Table structure for sequence, holding the sequence order of a specific example sequence */
CREATE TABLE sequence (
	seqid 					INT(10) unsigned NOT NULL,
	cid 					INT(10) unsigned NOT NULL,
	exampleseq 				text NOT NULL,
	PRIMARY KEY (cid,seqid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* improw contains a list of the important rows for a certain example */
CREATE TABLE wordlist(
	wordlistid				MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	wordlistname			VARCHAR(24),
	updated 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid						INT UNSIGNED NOT NULL,
	PRIMARY KEY (wordlistid),
	FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/**
 * Delete and update all foreign keys before deleting a wordlist
 */
DELIMITER //
CREATE TRIGGER checkwordlists BEFORE DELETE ON wordlist
FOR EACH ROW
BEGIN
	 DELETE FROM word WHERE wordlistid = OLD.wordlistid;
		 IF ((SELECT count(*) FROM box WHERE wordlistid=OLD.wordlistid)>"0")THEN
		 		UPDATE box SET wordlistid = (SELECT MIN(wordlistid) FROM wordlist WHERE wordlistid != OLD.wordlistid) WHERE wordlistid=OLD.wordlistid;
		 END IF;
 END;//
 DELIMITER ;

CREATE TABLE word(
	wordid					MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	wordlistid				MEDIUMINT UNSIGNED NOT NULL,
	word 					VARCHAR(64),
	label					VARCHAR(256),
	updated 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid						INT UNSIGNED NOT NULL,
	PRIMARY KEY (wordid, wordlistid),
	FOREIGN KEY (uid) REFERENCES user (uid),
	FOREIGN KEY (wordlistid) REFERENCES wordlist(wordlistid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* boxes with information in a certain example */
CREATE TABLE box(
	boxid					INTEGER UNSIGNED NOT NULL,
	exampleid 				MEDIUMINT UNSIGNED NOT NULL,
	boxtitle				VARCHAR(20),
	boxcontent				VARCHAR(64),
	filename				VARCHAR(256),
	settings				VARCHAR(1024),
	wordlistid				MEDIUMINT UNSIGNED,
	segment					TEXT,
	fontsize				INT NOT NULL DEFAULT '9',
	PRIMARY KEY (boxid, exampleid),
	FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* improw contains a list of the important rows for a certain example */
CREATE TABLE improw(
	impid					MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	boxid					INTEGER UNSIGNED NOT NULL,
	exampleid				MEDIUMINT UNSIGNED NOT NULL,
	istart					INTEGER,
	iend					INTEGER,
	irowdesc				VARCHAR(1024),
	updated					TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid						INT UNSIGNED NOT NULL,
	PRIMARY KEY (impid, exampleid, boxid),
	FOREIGN KEY (uid) REFERENCES user (uid),
	FOREIGN KEY (boxid, exampleid) REFERENCES box (boxid, exampleid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* Wordlist contains a list of important words for a certain code example */
CREATE TABLE impwordlist(
	wordid					MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	exampleid				MEDIUMINT UNSIGNED NOT NULL,
	word 					VARCHAR(64),
	label					VARCHAR(256),
	UPDATED 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	uid						INTEGER UNSIGNED NOT NULL,
	PRIMARY KEY (wordid),
	FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
	FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE submission(
	subid					MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT,
	uid						INTEGER,
	cid						INTEGER,
	vers					VARCHAR(8),
	did						INTEGER,
	seq						INTEGER,
	fieldnme				VARCHAR(64),
	filepath				VARCHAR(256),
	filename				VARCHAR(128),
	extension				VARCHAR(32),
	mime					VARCHAR(64),
	kind					INTEGER,
	segment					INTEGER,
	updtime					TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	PRIMARY KEY (subid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE eventlog(
	eid 					BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
	type 					TINYINT DEFAULT 0,
	ts 						TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	address 				VARCHAR(45),
	raddress 				VARCHAR(45),
	user 					VARCHAR(128),
	eventtext				TEXT NOT NULL,
	PRIMARY KEY (eid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE playereditor_playbacks(
	id						VARCHAR(32) NOT NULL,
	type					SMALLINT(1) NOT NULL,
	path	 				VARCHAR(256) NOT NULL,
	PRIMARY KEY (id, type)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE class (
	class 					VARCHAR(10) NOT NULL,
	responsible				INT UNSIGNED NOT null,
	classname 				VARCHAR(100) DEFAULT NULL,
	regcode 				INT(8) DEFAULT NULL,
	classcode 				VARCHAR(8) DEFAULT NULL,
	hp 						DECIMAL(10,1) DEFAULT NULL,
	tempo 					INT(3) DEFAULT NULL,
	hpProgress 	DECIMAL(3,1),
	PRIMARY KEY (class,responsible),
	FOREIGN KEY (responsible) REFERENCES user (uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/**
 * this table stores the different subparts of each course.
 */
CREATE TABLE subparts(
	partname				VARCHAR(50),
	cid 					INT UNSIGNED NOT NULL,
	parthp 					DECIMAL(3,1) DEFAULT NULL,
	difgrade				VARCHAR(10),
	PRIMARY KEY (partname,cid),
	FOREIGN KEY (cid) REFERENCES course (cid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/**
 * this table is weak reslation to user and partcourse.
 */
CREATE TABLE partresult (
    cid 					INT UNSIGNED NOT NULL,
	uid						INT UNSIGNED NOT NULL,
	partname				VARCHAR(50),
	grade 					VARCHAR(1) DEFAULT NULL,
	hp						DECIMAL(3,1) REFERENCES subparts (parthp),
	PRIMARY KEY (partname, cid, uid),
	FOREIGN KEY (partname,cid) REFERENCES subparts (partname,cid),
	FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/**
 * this table many to many relation between class and course.
 */
CREATE TABLE programcourse (
	class 					VARCHAR(10) NOT NULL,
	cid 					INT UNSIGNED NOT NULL,
	period 					INT(1) ,
	term 					VARCHAR(10),
	PRIMARY KEY (cid, class),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (class) REFERENCES class (class)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/**
 * This table seems to be intended to store student results from program courses.
 */
CREATE TABLE studentresultat (
	sid 					MEDIUMINT(9) NOT NULL AUTO_INCREMENT,
	pnr 					VARCHAR(11) DEFAULT NULL,
	anmkod 					VARCHAR(6) DEFAULT NULL,
	kurskod 				VARCHAR(6) NOT NULL,
	termin 					VARCHAR(5) DEFAULT NULL,
	resultat 				DECIMAL(3,1) DEFAULT NULL,
	avbrott 				DATE DEFAULT NULL,
	PRIMARY KEY (sid),
	KEY anmkod (anmkod),
	KEY pnr (pnr),
	KEY kurskod (kurskod)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/*
This table is used by the duggasys system to generate certificates.

Todo: This table has a number of references, such as to course, list etc., this implementation does not
create foreign key constraints for those references so it will need to be revisited and refactored later.
*/
CREATE TABLE list (
	listnr 					INT,
	listeriesid 			INT,
	provdatum 				DATE,
	responsible 			VARCHAR(40),
	responsibledate 		DATE,
	course 					INT,
	listid 					INT AUTO_INCREMENT,
	PRIMARY KEY (listid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=INNODB;

/* This table holds configuration for the entire LenaSYS server */
CREATE TABLE settings (
  sid int(11) NOT NULL AUTO_INCREMENT,
  motd varchar(4096) DEFAULT NULL,
  readonly tinyint(4) DEFAULT '0',
  PRIMARY KEY (`sid`)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=INNODB;


CREATE TABLE user_push_registration (
	id						INT NOT NULL AUTO_INCREMENT,
	uid 					INT UNSIGNED NOT NULL,
	endpoint				VARCHAR(500) NOT NULL,
	added					TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	keyAuth					VARCHAR(50) NOT NULL,
	keyValue				VARCHAR(100) NOT NULL,
	lastSent				DATE DEFAULT NULL,
	daysOfUnsent			INT NOT NULL DEFAULT '0',
	PRIMARY KEY	(id),
	KEY (endpoint),
	FOREIGN KEY (uid) REFERENCES user(uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* Usergroup and user_usergroup relation */
CREATE TABLE `groups` (
    groupID INTEGER unsigned NOT NULL AUTO_INCREMENT,
    groupKind VARCHAR(4) NOT NULL,
    groupVal VARCHAR(8) NOT NULL,
    groupInt INTEGER NOT NULL,
    PRIMARY KEY (groupID)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("No","1",1);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("No","2",2);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("No","3",3);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("No","4",4);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("No","5",5);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("No","6",6);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("No","7",7);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("No","8",8);

INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Le","A",1);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Le","B",2);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Le","C",3);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Le","D",4);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Le","E",5);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Le","F",6);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Le","G",7);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Le","H",8);

INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Vi","I",1);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Vi","II",2);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Vi","III",3);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Vi","IV",4);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Vi","V",5);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Vi","VI",6);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Vi","VII",7);
INSERT INTO `groups`(groupKind,groupVal,groupInt) VALUES ("Vi","VIII",8);

CREATE TABLE user_group (
  groupID int(10) unsigned NOT NULL,
  userID int(10) unsigned NOT NULL,
  KEY groupID (groupID),
  KEY userID (userID),
  CONSTRAINT user_group_ibfk_1 FOREIGN KEY (groupID) REFERENCES `groups` (groupID),
  CONSTRAINT user_group_ibfk_2 FOREIGN KEY (userID) REFERENCES user (uid)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

/*table used for checking participation. i.e participation is 0 = not participated, 1 = participated.*/
CREATE TABLE user_participant (
  id						INT NOT NULL AUTO_INCREMENT,
  uid						INT UNSIGNED NOT NULL,
  lid 						INT UNSIGNED NOT NULL,
  participation 			TINYINT(1) UNSIGNED,
  comments      			VARCHAR(512),
  PRIMARY KEY (id),
  FOREIGN KEY (lid) REFERENCES listentries (lid),
  FOREIGN KEY (uid) REFERENCES user (uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;


/* Opponents table used to save opponents for seminars */
CREATE TABLE opponents (
	presenter				INT UNSIGNED NOT NULL,
	lid 					INT UNSIGNED NOT NULL,
	opponent1				INT UNSIGNED DEFAULT NULL,
	opponent2				INT UNSIGNED DEFAULT NULL,
	PRIMARY KEY (presenter, lid),
	FOREIGN KEY (presenter) REFERENCES user(uid),
	FOREIGN KEY (lid) REFERENCES listentries(lid),
	FOREIGN KEY (opponent1) REFERENCES user(uid),
	FOREIGN KEY (opponent2) REFERENCES user(uid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

CREATE TABLE options (
	label					varchar(128),
  	value					char(1),
  PRIMARY Key (label)
);


/* Timesheet table used for timesheet duggas */
CREATE TABLE timesheet(
	tid 					INT UNSIGNED NOT NULL AUTO_INCREMENT,
	uid						INT UNSIGNED NOT NULL,
	cid						INT UNSIGNED NOT NULL,
	vers					VARCHAR(8) NOT NULL,
	did						INT(11) NOT NULL,
	moment				INT UNSIGNED NOT NULL,
	day						DATE NOT NULL,
	week					TINYINT,
	type					VARCHAR(20),
	reference			VARCHAR(10),
	comment				TEXT,
	PRIMARY KEY (tid),
	FOREIGN KEY (uid) REFERENCES user(uid),
	FOREIGN KEY (cid) REFERENCES course(cid),
	FOREIGN KEY (did) REFERENCES quiz(id),
	FOREIGN KEY (moment) REFERENCES listentries(lid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/*
	This view eases the process of determining how many hp a student with a specific uid
	in a specific course cid has finished. See the example below.

	Example, get total hp finished by user with uid 2 in course with cid 1:
		SQL code: select hp from studentresult where user = 2 and course_id = 1;
*/

CREATE VIEW studentresultCourse AS
	SELECT partresult.uid AS username, partresult.cid, partresult.hp FROM partresult
	INNER JOIN subparts ON partresult.partname = subparts.partname
		AND subparts.cid = partresult.cid
		AND subparts.parthp = partresult.hp
	WHERE partresult.grade != 'u';

/* updatesd info in user table */
UPDATE user SET firstname="Toddler", lastname="Kong" WHERE username="Toddler";
UPDATE user SET firstname="Johan", lastname="Grimling" WHERE username="Grimling";
UPDATE user SET ssn="810101-5567" WHERE username="Grimling";
UPDATE user SET ssn="444444-5447" WHERE username="Toddler";
UPDATE user SET superuser=1 WHERE username="Toddler";

/* Templates for codeexamples */

INSERT INTO template(templateid, stylesheet, numbox) VALUES (0, "template0.css",0);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (1,"template1.css",2);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (2,"template2.css",2);
INSERT INTO template(templateid,stylesheet,numbox) VALUES (3,"template3.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (4,"template4.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (5,"template5.css",4);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (6,"template6.css",4);
INSERT INTO template (templateid,stylesheet,numbox) VALUES (7,"template7.css",4);
INSERT INTO template (templateid,stylesheet,numbox) VALUES (8,"template8.css",3);
INSERT INTO template (templateid,stylesheet,numbox) VALUES (9,"template9.css",5);
INSERT INTO template (templateid,stylesheet,numbox) VALUES (10,"template10.css",1);

/* Programming languages that decide highlighting */

INSERT INTO wordlist(wordlistname,uid) VALUES ("JS",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("PHP",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("HTML",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("Plain Text",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("Java",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("SR",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("SQL",1);

/* Wordlist for different programming languages */

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
