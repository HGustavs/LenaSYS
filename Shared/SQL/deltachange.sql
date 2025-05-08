/* Increased size of parameters and answers for dugga variants */
ALTER TABLE variant MODIFY param VARCHAR(8256);
ALTER TABLE variant MODIFY variantanswer VARCHAR(8256);

/*New columns for fileLink */
ALTER TABLE fileLink ADD COLUMN filesiz INT;
ALTER TABLE fileLink ADD COLUMN uploaddate DATETIME;
ALTER TABLE fileLink ADD COLUMN vers VARCHAR(8);

/* Add groups table to system */


/* Add groupID to listentries e.g. listentry participates in groupid */
ALTER TABLE listentries add column groupID INT DEFAULT NULL;
ALTER TABLE listentries add column groupKind VARCHAR(16) DEFAULT NULL;
/*
Unknown column 'jsondeadline' in 'field list'
*/
ALTER TABLE quiz add column jsondeadline VARCHAR(2048);

/* Adding groups column for user in course */
ALTER TABLE user_course add column groups varchar(256);
alter table user_course add column examiner integer;

/* Usergroup and user_usergroup relation */

CREATE TABLE groups (
  groupID INTEGER unsigned NOT NULL AUTO_INCREMENT,
  groupKind VARCHAR(4) NOT NULL,
	groupVal VARCHAR(8) NOT NULL,
	groupInt INTEGER NOT NULL,
  PRIMARY KEY (groupID)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;

INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("No","1",1);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("No","2",2);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("No","3",3);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("No","4",4);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("No","5",5);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("No","6",6);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("No","7",7);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("No","8",8);

INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Le","A",1);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Le","B",2);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Le","C",3);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Le","D",4);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Le","E",5);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Le","F",6);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Le","G",7);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Le","H",8);

INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Vi","I",1);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Vi","II",2);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Vi","III",3);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Vi","IV",4);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Vi","V",5);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Vi","VI",6);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Vi","VII",7);
INSERT INTO groups(groupKind,groupVal,groupInt) VALUES ("Vi","VIII",8);


/*
Error reading user entriesUnknown column 'requestedpasswordchange' in 'field list'
*/
ALTER TABLE `user` ADD COLUMN securityquestion VARCHAR(256) DEFAULT NULL;
ALTER TABLE `user` ADD COLUMN requestedpasswordchange	TINYINT(1) UNSIGNED NOT NULL DEFAULT 0;

/*
Error retreiving userAnswers. (row 394) 0 row(s) were found. Error code: Unknown column 'timesGraded' in 'field list'
*/
ALTER TABLE userAnswer ADD COLUMN timesGraded INTEGER NOT NULL DEFAULT 0;

/*
Error retreiving userAnswers. (row 394) 0 row(s) were found. Error code: Unknown column 'gradeExpire' in 'field list'
*/
ALTER TABLE userAnswer ADD COLUMN gradeExpire TIMESTAMP NULL DEFAULT NULL;

ALTER TABLE groups MODIFY groupKind VARCHAR(16);
ALTER TABLE listentries MODIFY groupKind VARCHAR(16);
UPDATE groups SET groupKind="Number" WHERE groupKind="No";
UPDATE groups SET groupKind="Letter" WHERE groupKind="Le";
UPDATE groups SET groupKind="Roman" WHERE groupKind="VI";

/* #6259 Add update column to vers table */
ALTER TABLE vers ADD COLUMN updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

/* #2463 Adding group column to quiz table */
ALTER TABLE quiz add column `group` TINYINT(1) DEFAULT 0;

/* Merged from strutt.sql */
ALTER TABLE user_course ALTER COLUMN result SET DEFAULT 0.0;
ALTER TABLE user_course ALTER COLUMN period SET DEFAULT 1;
ALTER TABLE user_course ALTER COLUMN term SET DEFAULT 1;

ALTER TABLE codeexample MODIFY runlink VARCHAR(256);
ALTER TABLE listentries ADD COLUMN groupKind VARCHAR(16) DEFAULT NULL;
