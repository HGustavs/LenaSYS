CREATE TABLE lenasys_user(
	uid						SERIAL,
	username				VARCHAR(80) NOT NULL UNIQUE,
	firstname				VARCHAR(50) NULL,
	lastname				VARCHAR(50) NULL,
	ssn						VARCHAR(20) NULL UNIQUE,
	password				VARCHAR(225) NOT NULL,
	lastupdated				TIMESTAMP,
	addedtime  				TIMESTAMP WITHOUT TIME ZONE,
	lastvisit				TIMESTAMP WITHOUT TIME ZONE,
	newpassword				SMALLINT NULL,
	creator					INT  NULL,
	superuser				SMALLINT NULL,
	email					VARCHAR(256) DEFAULT NULL,
	class 					VARCHAR(10) DEFAULT NULL,
	totalHp					NUMERIC(4, 1),
	securityquestion		VARCHAR(256) DEFAULT NULL,
	securityquestionanswer	VARCHAR(256) DEFAULT NULL,
	requestedpasswordchange	SMALLINT NOT NULL DEFAULT 0,
	PRIMARY KEY (uid)
);

-- class 					VARCHAR(10) DEFAULT NULL  REFERENCES class (class), */
-- add references at end */
-- https://stackoverflow.com/questions/35103606/postgresql-error-relation-products-does-not-exist */

INSERT INTO lenasys_user(username, password, newpassword, creator, superuser) values ('Grimling','$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m', 0, 1, 1);
INSERT INTO lenasys_user(username,password,newpassword,creator) values ('Toddler','$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q',0,1); 
INSERT INTO lenasys_user(username,password,newpassword,creator,ssn) values ('Tester', '$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q',1,1,'111111-1111'); 

-- Password is Kong  */
-- Password is Kong  */
-- Course table contains the most essential information relating to study courses in the database. */


-- alter table course alter column hp add default 7.5; */ 

CREATE TABLE course(
	cid						SERIAL UNIQUE,
	coursecode				VARCHAR(45) NULL UNIQUE,
	coursename				VARCHAR(80) NULL,
	created					TIMESTAMP WITHOUT TIME ZONE,
	creator					INT NOT NULL,
	visibility				SMALLINT  NOT NULL DEFAULT 0,
	updated					TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	activeversion			VARCHAR(8),
	activeedversion 		VARCHAR(8),
	capacity				INT, -- (5)*/
	hp						NUMERIC(4,1) NOT NULL DEFAULT 7.5,
	courseHttpPage			VARCHAR(2000),
	PRIMARY KEY (cid),
	FOREIGN KEY (creator) REFERENCES lenasys_user (uid)
);

-- This table represents a many-to-many relation between courses, to illustrate pre-requirements for courses. */
CREATE TABLE course_req(
	cid						INT NOT NULL,
	req_cid					INT NOT NULL,
	PRIMARY KEY (cid, req_cid),
	FOREIGN KEY (cid) REFERENCES course(cid),
	FOREIGN KEY (req_cid) REFERENCES course(cid)
);


 -- This table represents a many-to-many relation between users and courses. That is, */
 -- tuple in this table joins a lenasys_user with a course. */
 
CREATE TABLE user_course(
	uid						INT  NOT NULL,
	cid						INT  NOT NULL,
	result 					NUMERIC(2,1) DEFAULT 0.0,
	modified 				TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ON UPDATE CURRENT_TIMESTAMP */
	creator 				INTEGER,
	access					VARCHAR(10) NOT NULL,
	period					INTEGER DEFAULT 1,
	term					CHAR(5) DEFAULT 'VT16',
	vers					VARCHAR(8),
	vershistory				TEXT,
	groups 					varchar(256),
	examiner 				integer,
	teacher					VARCHAR(30),
	passed 					INT  NOT NULL DEFAULT 0,
    failed 					INT  NOT NULL DEFAULT 0,
    pending 				INT  NOT NULL DEFAULT 0,
	PRIMARY KEY (uid, cid),
	FOREIGN KEY (uid) REFERENCES lenasys_user (uid),
	FOREIGN KEY (cid) REFERENCES course (cid)
);

CREATE TABLE listentries (
	lid 					SERIAL,
	cid 					INT  NOT NULL,
	entryname 				VARCHAR(64),
	link 					VARCHAR(200),
	kind 					INT ,
	pos 					INT,
	creator 				INT  NOT NULL,
	ts						TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- ON UPDATE current_timestamp, */
	code_id 				INTEGER  NULL DEFAULT NULL,
	visible 				SMALLINT  NOT NULL DEFAULT 0,
	vers					VARCHAR(8),
	comments				VARCHAR(512),
	moment					INT ,
	gradesystem 			SMALLINT,
	highscoremode			INT DEFAULT 0,
	rowcolor				SMALLINT,
	groupID					INT DEFAULT NULL,
	groupKind 				VARCHAR(16) DEFAULT NULL,
	tabs					SMALLINT,
	feedbackenabled			SMALLINT  NOT NULL DEFAULT 0,
	feedbackquestion		VARCHAR(512),
    PRIMARY KEY (lid),
	FOREIGN KEY (creator) REFERENCES lenasys_user(uid) ON DELETE NO ACTION ON UPDATE NO ACTION, FOREIGN KEY(cid)REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Quiz tables */
CREATE TABLE quiz (
	id						SERIAL,
	cid 					INTEGER  NOT NULL,
	autograde 				SMALLINT NOT NULL DEFAULT 0, -- bool */
	gradesystem 			SMALLINT NOT NULL DEFAULT 0, -- 1:U-G-VG & 2:U-G & 3:U-3-5 */
	qname 					VARCHAR(255) NOT NULL DEFAULT '',
	quizFile 				VARCHAR(255) NOT NULL DEFAULT 'default',
	qrelease 				TIMESTAMP WITHOUT TIME ZONE,
	deadline 				TIMESTAMP WITHOUT TIME ZONE,
	modified 				TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ON UPDATE CURRENT_TIMESTAMP, */
	creator 				INTEGER,
	vers					VARCHAR(8),
    qstart					DATE,
	jsondeadline			VARCHAR(2048),
	"group"					SMALLINT NOT NULL DEFAULT 0,
	PRIMARY KEY (id),
	FOREIGN KEY (cid) REFERENCES course(cid) ON DELETE CASCADE ON UPDATE CASCADE
);


 -- A quiz tuple has a one-to-many relation with a tuple from thea variant table. */
 -- An entry in the variant table is used to add questions to quiz tests. */

CREATE TABLE variant(
	vid						SERIAL,
	quizID					INT, -- (11)*/
	param					VARCHAR(8126),
	variantanswer			VARCHAR(8126),
	modified 				TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, -- ON UPDATE CURRENT_TIMESTAMP, */
	creator 				INTEGER,
	disabled				SMALLINT DEFAULT 0,
	PRIMARY KEY 			(vid),
	FOREIGN KEY (quizID) REFERENCES quiz(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE userAnswer (
	aid						SERIAL,
	cid						INT  NOT NULL,
	quiz 					INT, -- (11)*/
	variant					INT,
	moment					INT  NOT NULL,
	grade 					SMALLINT, -- (2)*/
	uid 					INT  NOT NULL,
	useranswer				TEXT,
	submitted 				TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        -- timestamp when last graded/marked */
	marked					TIMESTAMP NULL,
	vers					VARCHAR(8),
	creator 				INTEGER,
	score					INT DEFAULT NULL,
	timeUsed 				INT DEFAULT NULL, -- (11)*/
	totalTimeUsed 			INT DEFAULT '0', -- (11)*/
	stepsUsed 				INT DEFAULT NULL, -- (11)*/
	totalStepsUsed			INT DEFAULT '0', -- (11)*/
	feedback 				TEXT,
	timesGraded				INT NOT NULL DEFAULT '0', -- (11)*/
	gradeExpire 			TIMESTAMP NULL DEFAULT NULL,
        -- used in conjunction with `marked` to determine if a grade has been changed since it was last exported */
        gradeLastExported   timestamp null default null,
	PRIMARY KEY (aid),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (uid) REFERENCES lenasys_user(uid),
	FOREIGN KEY (quiz) REFERENCES quiz(id),
	FOREIGN KEY (moment) REFERENCES listentries(lid),
	FOREIGN KEY (variant) REFERENCES variant(vid)
);


-- This view pulls the top 10 fastest quiz finishing students and lists them */

DROP VIEW IF EXISTS highscore_quiz_time;
CREATE VIEW highscore_quiz_time AS
	SELECT userAnswer.cid, userAnswer.quiz, userAnswer.uid, userAnswer.grade, userAnswer.score
		FROM userAnswer ORDER BY userAnswer.score ASC LIMIT 10;

-- Fix for database coursename: alter table vers alter column coursename VARCHAR(80); */

CREATE TABLE vers(
	cid						SERIAL,
	vers					VARCHAR(8),
	versname				VARCHAR(45) NOT NULL,
	coursecode				VARCHAR(45) NOT NULL,
	coursename				VARCHAR(80) NOT NULL,
	coursenamealt			VARCHAR(45) NOT NULL,
	startdate     			TIMESTAMP WITHOUT TIME ZONE,
	enddate       			TIMESTAMP WITHOUT TIME ZONE,
	updated					TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- ON UPDATE CURRENT_TIMESTAMP, */
	motd					VARCHAR(50),
	FOREIGN KEY (cid) REFERENCES course(cid),
	PRIMARY KEY (cid,vers)
);

CREATE TABLE fileLink(
	fileid					SERIAL,
	filename				VARCHAR(128) NOT NULL,
	kind					INTEGER,
	cid						INT  NOT NULL,
	isGlobal				BOOLEAN NOT NULL DEFAULT FALSE,
	filesize				INT NOT NULL DEFAULT 0, -- (11)*/
	uploaddate				TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    filesiz 				INT,
    vers 					VARCHAR(8),
	PRIMARY KEY (fileid),
	FOREIGN KEY (cid) REFERENCES course (cid)
);


-- An entry in this table allow file locations to be related to specific courses. */
-- For example, if an instructor wants to give students a link to a file that */
-- they should be able to download from the course page. */

CREATE TABLE template(
	templateid				INTEGER  NOT NULL UNIQUE,
	stylesheet 				VARCHAR(39) NOT NULL,
	numbox					INTEGER NOT NULL,
	PRIMARY KEY(templateid, stylesheet)
);


-- Code Example contains a list of the code examples for a version of a course in the database */
-- Version of sections and examples corresponds roughly to year or semester that the course was given.  */

CREATE TABLE codeexample(
	exampleid				SERIAL,
	cid						INT  NOT NULL,
	examplename				VARCHAR(64),
	sectionname				VARCHAR(64),
	beforeid				INTEGER,
	afterid					INTEGER,
	runlink		 			VARCHAR(256),
	cversion				INTEGER,
	public 					SMALLINT  NOT NULL DEFAULT 0,
	updated 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP , -- ON UPDATE CURRENT_TIMESTAMP, */
	uid						INT  NOT NULL,
	templateid				INTEGER  NOT NULL DEFAULT '0',
	PRIMARY KEY (exampleid),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (uid) REFERENCES lenasys_user (uid),
	FOREIGN KEY (templateid) REFERENCES template (templateid)
);

-- Table structure for sequence, holding the sequence order of a specific example sequence */
CREATE TABLE sequence (
	seqid 					INT  NOT NULL, -- (10)*/
	cid 					INT  NOT NULL, -- (10)*/
	exampleseq 				text NOT NULL,
	PRIMARY KEY (cid,seqid)
);

-- improw contains a list of the important rows for a certain example */
CREATE TABLE wordlist(
	wordlistid				SERIAL,
	wordlistname			VARCHAR(24),
	updated 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP , -- ON UPDATE CURRENT_TIMESTAMP, */
	uid						INT  NOT NULL,
	PRIMARY KEY (wordlistid),
	FOREIGN KEY (uid) REFERENCES lenasys_user (uid)
);


-- Delete and update all foreign keys before deleting a wordlist */

DELIMITER //
CREATE TRIGGER checkwordlists BEFORE DELETE ON wordlist
FOR EACH ROW
BEGIN
	 DELETE FROM word WHERE wordlistid = OLD.wordlistid;
		 IF ((SELECT count(*) FROM box WHERE wordlistid=OLD.wordlistid)>'0')THEN
		 		UPDATE box SET wordlistid = (SELECT MIN(wordlistid) FROM wordlist WHERE wordlistid != OLD.wordlistid) WHERE wordlistid=OLD.wordlistid;
		 END IF;
 END;//
 DELIMITER ;

CREATE TABLE word(
	wordid					SERIAL,
	wordlistid				INTEGER  NOT NULL,
	word 					VARCHAR(64),
	label					VARCHAR(256),
	updated 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP , -- ON UPDATE CURRENT_TIMESTAMP, */
	uid						INT  NOT NULL,
	PRIMARY KEY (wordid, wordlistid),
	FOREIGN KEY (uid) REFERENCES lenasys_user (uid),
	FOREIGN KEY (wordlistid) REFERENCES wordlist(wordlistid)
) ;

-- boxes with information in a certain example  */
CREATE TABLE box(
	boxid					INTEGER  NOT NULL,
	exampleid 				INTEGER  NOT NULL,
	boxtitle				VARCHAR(20),
	boxcontent				VARCHAR(64),
	filename				VARCHAR(256),
	settings				VARCHAR(1024),
	wordlistid				INTEGER ,
	segment					TEXT,
	fontsize				INT NOT NULL DEFAULT '9',
	PRIMARY KEY (boxid, exampleid),
	FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid)
);

-- improw contains a list of the important rows for a certain example  */
CREATE TABLE improw(
	impid					SERIAL,
	boxid					INTEGER  NOT NULL,
	exampleid				INTEGER  NOT NULL,
	istart					INTEGER,
	iend					INTEGER,
	irowdesc				VARCHAR(1024),
	updated					TIMESTAMP DEFAULT CURRENT_TIMESTAMP , -- ON UPDATE CURRENT_TIMESTAMP, */
	uid						INT  NOT NULL,
	PRIMARY KEY (impid, exampleid, boxid),
	FOREIGN KEY (uid) REFERENCES lenasys_user (uid),
	FOREIGN KEY (boxid, exampleid) REFERENCES box (boxid, exampleid)
);

-- Wordlist contains a list of important words for a certain code example */ 
CREATE TABLE impwordlist(
	wordid					SERIAL,
	exampleid				INTEGER  NOT NULL,
	word 					VARCHAR(64),
	label					VARCHAR(256),
	UPDATED 				TIMESTAMP DEFAULT CURRENT_TIMESTAMP , -- ON UPDATE CURRENT_TIMESTAMP, */
	uid						INTEGER  NOT NULL,
	PRIMARY KEY (wordid),
	FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
	FOREIGN KEY (uid) REFERENCES lenasys_user (uid)
);

CREATE TABLE submission(
	subid					SERIAL,
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
);

CREATE TABLE eventlog(
	eid 					SERIAL,
	type 					SMALLINT NOT NULL DEFAULT 0,
	ts 						TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	address 				VARCHAR(45),
	raddress 				VARCHAR(45),
	lenasys_user 			VARCHAR(128),
	eventtext				TEXT NOT NULL,
	PRIMARY KEY (eid)
);

CREATE TABLE playereditor_playbacks(
	id						VARCHAR(32) NOT NULL,
	type					SMALLINT NOT NULL,
	path	 				VARCHAR(256) NOT NULL,
	PRIMARY KEY (id, type)
);

CREATE TABLE class (
	class 					VARCHAR(10) NOT NULL UNIQUE,
	responsible				INT  NOT null,
	classname 				VARCHAR(100) DEFAULT NULL,
	regcode 				INT DEFAULT NULL, -- (8)*/
	classcode 				VARCHAR(8) DEFAULT NULL,
	hp 						NUMERIC(10,1) DEFAULT NULL,
	tempo 					INT DEFAULT NULL, -- (3)*/
	hpProgress 				NUMERIC(3,1),
	PRIMARY KEY (class,responsible),
	FOREIGN KEY (responsible) REFERENCES lenasys_user (uid)
);


-- this table stores the different subparts of each course. */

CREATE TABLE subparts(
	partname				VARCHAR(50) UNIQUE,
	cid 					INT  NOT NULL UNIQUE,
	parthp 					NUMERIC(3,1) DEFAULT NULL UNIQUE,
	difgrade				VARCHAR(10),
	PRIMARY KEY (partname,cid),
	FOREIGN KEY (cid) REFERENCES course (cid)
);


-- this table is weak reslation to lenasys_user and partcourse. */

CREATE TABLE partresult (
    cid 					INT  NOT NULL,
	uid						INT  NOT NULL,
	partname				VARCHAR(50),
	grade 					VARCHAR(1) DEFAULT NULL,
	hp						NUMERIC(3,1) REFERENCES subparts (parthp),
	PRIMARY KEY (partname, cid, uid),
	FOREIGN KEY (partname,cid) REFERENCES subparts (partname,cid),
	FOREIGN KEY (uid) REFERENCES lenasys_user (uid)
);


--this table many to many relation between class and course. */

CREATE TABLE programcourse (
	class 					VARCHAR(10) NOT NULL,
	cid 					INT  NOT NULL,
	period 					INT ,-- (1)*/
	term 					VARCHAR(10),
	PRIMARY KEY (cid, class),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (class) REFERENCES class (class)
);


-- This table seems to be intended to store student results from program courses. */

CREATE TABLE studentresultat (
	sid 					SERIAL,
	pnr 					VARCHAR(11) DEFAULT NULL,
	anmkod 					VARCHAR(6) DEFAULT NULL,
	kurskod 				VARCHAR(6) NOT NULL,
	termin 					VARCHAR(5) DEFAULT NULL,
	resultat 				NUMERIC(3,1) DEFAULT NULL,
	avbrott 				DATE DEFAULT NULL,
	PRIMARY KEY (sid)
	-- These seem to be used for compatabillity with other databases in postgres, usage here seems redundant
	--KEY anmkod (anmkod), */
	--KEY pnr (pnr), */
	--KEY kurskod (kurskod) */
);


--This table is used by the duggasys system to generate certificates. */

--Todo: This table has a number of references, such as to course, list etc., this implementation does not */
--create foreign key constraints for those references so it will need to be revisited and refactored later. */

CREATE TABLE list (
	listnr 					INT,
	listeriesid 			INT,
	provdatum 				DATE,
	responsible 			VARCHAR(40),
	responsibledate 		DATE,
	course 					INT,
	listid 					SERIAL,
	PRIMARY KEY (listid)
);
--#######################*/
--Tables work untill here*/
--#######################*/
--#######################*/

-- This table holds configuration for the entire LenaSYS server 
CREATE TABLE settings (
  	sid 					SERIAL,
  	motd 					TEXT DEFAULT NULL,
  	readonly 				SMALLINT NOT NULL DEFAULT 0 ,
  	PRIMARY KEY (sid)
);


CREATE TABLE user_push_registration (
	id						SERIAL,
	uid 					INT  NOT NULL,
	endpoint				VARCHAR(500) NOT NULL,
	added					TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	keyAuth					VARCHAR(50) NOT NULL,
	keyValue				VARCHAR(100) NOT NULL,
	lastSent				DATE DEFAULT NULL,
	daysOfUnsent			INT NOT NULL DEFAULT '0',
	PRIMARY KEY	(id),
	--KEY (endpoint), usage seems redudant, see above */ 
	FOREIGN KEY (uid) REFERENCES lenasys_user(uid)
);

-- Usergroup and user_usergroup relation */
CREATE TABLE "groups" (
    groupID SERIAL,
    groupKind VARCHAR(4) NOT NULL,
    groupVal VARCHAR(8) NOT NULL,
    groupInt INTEGER NOT NULL,
    PRIMARY KEY (groupID)
);

CREATE TABLE announcement(
    announcementid 			SERIAL,
    secondannouncementid 	INT  NOT NULL,
    uid 					INT  NOT NULL,
    recipient 				INT  NOT NULL,
    cid 					INT  NOT NULL,
    versid 					VARCHAR(8) NOT NULL,
    title 					TEXT NOT NULL,
    message 				TEXT NOT NULL,
    announceTime 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_status 			SMALLINT NOT NULL DEFAULT '1',
    edited 					VARCHAR(3) NOT NULL DEFAULT 'NO',
    PRIMARY KEY(announcementid, secondannouncementid, uid, cid, versid),
    FOREIGN KEY (uid) REFERENCES lenasys_user (uid),
    FOREIGN KEY (recipient) REFERENCES lenasys_user (uid),
    FOREIGN KEY (cid) REFERENCES course (cid)
    
);

CREATE TABLE ANNOUNCEMENTLOG(
	ID 					SERIAL,
    ANNOUNCEMENTID 		INT  NOT NULL,
    UID 				INT  NOT NULL,
    CID 				INT  NOT NULL,
    VERSID 				VARCHAR(8) NOT NULL,
    TITLE 				TEXT NOT NULL,
    MESSAGE 			TEXT NOT NULL,
    ANNOUNCETIME 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    LOGACTION 			VARCHAR(20) NOT NULL,
    PRIMARY KEY(ID)
    
);

DELIMITER //
 
CREATE TRIGGER ANNOUNCEMENTINSERTLOG AFTER INSERT ON announcement
FOR EACH ROW BEGIN 
   INSERT INTO ANNOUNCEMENTLOG(ANNOUNCEMENTID, UID, CID, VERSID, TITLE, MESSAGE, LOGACTION) 
      VALUES(NEW.announcementid, NEW.uid, NEW.cid, NEW.versid, NEW.title, NEW.message, 'INS');
END;
 
//
 
DELIMITER ;

DELIMITER //
 
CREATE TRIGGER ANNOUNCEMENTUPDATELOG AFTER INSERT ON announcement
FOR EACH ROW BEGIN 
   INSERT INTO ANNOUNCEMENTLOG(ANNOUNCEMENTID, UID, CID, VERSID, TITLE, MESSAGE, LOGACTION) 
      VALUES(OLD.announcementid, OLD.uid, OLD.cid, OLD.versid, OLD.title, OLD.message, 'UPD');
END;
 
//
 
DELIMITER ;

DELIMITER //
 
CREATE TRIGGER ANNOUNCEMENTDELETELOG BEFORE INSERT ON announcement
FOR EACH ROW BEGIN 
   INSERT INTO ANNOUNCEMENTLOG(ANNOUNCEMENTID, UID, CID, VERSID, TITLE, MESSAGE, LOGACTION) 
      VALUES(OLD.announcementid, OLD.uid, OLD.cid, OLD.versid, OLD.title, OLD.message, 'DEL');
END;
 
//
 
DELIMITER ;


INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('No','1',1);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('No','2',2);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('No','3',3);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('No','4',4);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('No','5',5);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('No','6',6);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('No','7',7);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('No','8',8);

INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Le','A',1);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Le','B',2);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Le','C',3);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Le','D',4);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Le','E',5);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Le','F',6);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Le','G',7);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Le','H',8);

INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Vi','I',1);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Vi','II',2);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Vi','III',3);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Vi','IV',4);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Vi','V',5);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Vi','VI',6);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Vi','VII',7);
INSERT INTO "groups"(groupKind,groupVal,groupInt) VALUES ('Vi','VIII',8);

CREATE TABLE user_group (
  groupID 				int  NOT NULL, -- (10)*/
  userID 				int  NOT NULL, -- (10)*/
  --KEY groupID (groupID), */
  --KEY userID (userID), */
  PRIMARY KEY(groupID,userID),
  --CONSTRAINT user_group_ibfk_1 */ 
  FOREIGN KEY (groupID) REFERENCES "groups" (groupID),
  --CONSTRAINT user_group_ibfk_2 */ 
  FOREIGN KEY (userID) REFERENCES lenasys_user (uid)
);

--table used for checking participation. i.e participation is 0 = not participated, 1 = participated. */
CREATE TABLE user_participant (
  id						SERIAL,
  uid						INT  NOT NULL,
  lid 						INT  NOT NULL,
  participation 			SMALLINT ,
  comments      			VARCHAR(512),
  PRIMARY KEY (id),
  FOREIGN KEY (lid) REFERENCES listentries (lid),
  FOREIGN KEY (uid) REFERENCES lenasys_user (uid)
);


-- Opponents table used to save opponents for seminars  */
CREATE TABLE opponents (
	presenter				INT  NOT NULL,
	lid 					INT  NOT NULL,
	opponent1				INT  DEFAULT NULL,
	opponent2				INT  DEFAULT NULL,
	PRIMARY KEY (presenter, lid),
	FOREIGN KEY (presenter) REFERENCES lenasys_user(uid),
	FOREIGN KEY (lid) REFERENCES listentries(lid),
	FOREIGN KEY (opponent1) REFERENCES lenasys_user(uid),
	FOREIGN KEY (opponent2) REFERENCES lenasys_user(uid)
);

CREATE TABLE options (
	label					varchar(128),
  	value					char(1),
  PRIMARY Key (label)
);


-- Timesheet table used for timesheet duggas  */
CREATE TABLE timesheet(
	tid 					SERIAL,
	uid						INT  NOT NULL,
	cid						INT  NOT NULL,
	vers					VARCHAR(8) NOT NULL,
	did						INT NOT NULL, -- (11)*/
	moment					INT  NOT NULL,
	day						DATE NOT NULL,
	week					SMALLINT,
	type					VARCHAR(20),
	reference				VARCHAR(10),
	comment					TEXT,
	PRIMARY KEY (tid),
	FOREIGN KEY (uid) REFERENCES lenasys_user(uid),
	FOREIGN KEY (cid) REFERENCES course(cid),
	FOREIGN KEY (did) REFERENCES quiz(id),
	FOREIGN KEY (moment) REFERENCES listentries(lid)
);

-- userDuggaFeedback table used for lenasys_user feedback on duggor  */
CREATE TABLE userduggafeedback(
	ufid 					SERIAL,
	username				VARCHAR(80) DEFAULT null,
	cid						INT  NOT NULL,
	lid						INT  NOT NULL,
	score					INT NOT NULL, -- (11)*/
	entryname				varchar(68),
	PRIMARY KEY (ufid),
	FOREIGN KEY (username) REFERENCES lenasys_user(username),
	FOREIGN KEY (cid) REFERENCES course(cid),
	FOREIGN KEY (lid) REFERENCES listentries(lid)
);


	--This view eases the process of determining how many hp a student with a specific uid */
	--in a specific course cid has finished. See the example below. */

	--Example, get total hp finished by lenasys_user with uid 2 in course with cid 1: */
		--SQL code: select hp from studentresult where lenasys_user = 2 and course_id = 1; */


CREATE VIEW studentresultCourse AS
	SELECT partresult.uid AS username, partresult.cid, partresult.hp FROM partresult
	INNER JOIN subparts ON partresult.partname = subparts.partname
		AND subparts.cid = partresult.cid
		AND subparts.parthp = partresult.hp
	WHERE partresult.grade != 'u';

-- updatesd info in lenasys_user table  */
UPDATE lenasys_user SET firstname='Toddler', lastname='Kong' WHERE username='Toddler';
UPDATE lenasys_user SET firstname='Johan', lastname='Grimling' WHERE username='Grimling';
UPDATE lenasys_user SET ssn='810101-5567' WHERE username='Grimling';
UPDATE lenasys_user SET ssn='444444-5447' WHERE username='Toddler';
UPDATE lenasys_user SET superuser=1 WHERE username='Toddler';

-- Templates for codeexamples  */

INSERT INTO template(templateid, stylesheet, numbox) VALUES (0, 'template0.css',0);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (1,'template1.css',2);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (2,'template2.css',2);
INSERT INTO template(templateid,stylesheet,numbox) VALUES (3,'template3.css',3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (4,'template4.css',3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (5,'template5.css',4);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (6,'template6.css',4);
INSERT INTO template (templateid,stylesheet,numbox) VALUES (7,'template7.css',4);
INSERT INTO template (templateid,stylesheet,numbox) VALUES (8,'template8.css',3);
INSERT INTO template (templateid,stylesheet,numbox) VALUES (9,'template9.css',5);
INSERT INTO template (templateid,stylesheet,numbox) VALUES (10,'template10.css',1);

-- Programming languages that decide highlighting  */

INSERT INTO wordlist(wordlistname,uid) VALUES ('JS',1);
INSERT INTO wordlist(wordlistname,uid) VALUES ('PHP',1);
INSERT INTO wordlist(wordlistname,uid) VALUES ('HTML',1);
INSERT INTO wordlist(wordlistname,uid) VALUES ('Plain Text',1);
INSERT INTO wordlist(wordlistname,uid) VALUES ('Java',1);
INSERT INTO wordlist(wordlistname,uid) VALUES ('SR',1);
INSERT INTO wordlist(wordlistname,uid) VALUES ('SQL',1);

-- Wordlist for different programming languages  */

INSERT INTO word(wordlistid, word,label,uid) VALUES (1,'for','A',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,'function','B',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,'if','C',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,'var','D',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,'echo','A',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,'function','B',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,'if','C',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,'else','D',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,'onclick','A',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,'onload','B',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,'class','C',1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,'id','D',1);
