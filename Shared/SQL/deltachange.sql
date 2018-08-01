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

Notice: Undefined variable: duggaVisibility in /Library/WebServer/Documents/LenaSYS_HT2017/DuggaSys/showdoc.php on line 408
Notice: Undefined variable: duggaVisibility in /Library/WebServer/Documents/LenaSYS_HT2017/DuggaSys/showdoc.php on line 408

Error retreiving userAnswers. (row 394) 0 row(s) were found. Error code: Unknown column 'timesGraded' in 'field list'

NONE!Error changing group: Table 'imperious.user_group' doesn't exist

Error retreiving userAnswers. (row 394) 0 row(s) were found. Error code: Unknown column 'timesGraded' in 'field list'
*/