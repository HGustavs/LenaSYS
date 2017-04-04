USE Imperious;

CREATE TABLE tmplistentries (
	lid 					INT UNSIGNED NOT NULL AUTO_INCREMENT,
	cid 					INT UNSIGNED NOT NULL,
	entryname 		VARCHAR(64),
	link 					VARCHAR(200),
	kind 					INT UNSIGNED,
	pos 					INT,
	creator 			INT UNSIGNED NOT NULL,
	ts						TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE current_timestamp,
	code_id 			MEDIUMINT UNSIGNED NULL DEFAULT NULL,
	visible 			TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,
	vers					VARCHAR(8),
	moment				INT UNSIGNED,
	gradesystem 	TINYINT(1),
	highscoremode	INT DEFAULT 0,
	PRIMARY KEY(lid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB;
