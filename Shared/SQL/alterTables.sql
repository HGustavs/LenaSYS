/* Associated with issue #9859 */
ALTER TABLE userAnswer ADD COLUMN hash VARCHAR(8) DEFAULT NULL;
ALTER TABLE userAnswer ADD COLUMN password VARCHAR(8) DEFAULT NULL;

/* Associated with issue #10208 */
ALTER TABLE submission ADD COLUMN hash VARCHAR(8) DEFAULT NULL;

/* Associated with issue #10166 */
DROP TABLE userAnswer;
CREATE TABLE userAnswer (
	aid						INT(11) NOT NULL AUTO_INCREMENT,
	cid						INT UNSIGNED NOT NULL,
	quiz 					INT(11),
	variant					INT,
	moment					INT UNSIGNED NOT NULL,
	grade 					TINYINT(2),
	uid 					INT,
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
	seen_status             TINYINT(1) NOT NULL DEFAULT 0,
	hash					VARCHAR(8),
	password				VARCHAR(8),
	PRIMARY KEY (aid),
	FOREIGN KEY (cid) REFERENCES course (cid),
	FOREIGN KEY (quiz) REFERENCES quiz(id),
	FOREIGN KEY (moment) REFERENCES listentries(lid),
	FOREIGN KEY (variant) REFERENCES variant(vid)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* Associated with issue #10662 */
DELIMITER //
CREATE TRIGGER delete_group BEFORE DELETE ON userAnswer
FOR EACH ROW
BEGIN
DELETE FROM groupdugga
    WHERE OLD.hash = groupdugga.hash;
END //
DELIMITER ;

/* Associated with issue #10776 */
ALTER TABLE userAnswer ADD COLUMN timesSubmitted INT(5);

/* Associated with issue #10980 */
ALTER TABLE userAnswer ADD COLUMN timesAccessed INT(5);

/* Associated with issue #10980 */
ALTER TABLE userAnswer ADD COLUMN timesAccessed INT(5);

/* Associated with issue #11113 */
-- ALTER TABLE userAnswer ADD last_Time_techer_visited TIMESTAMP NULL DEFAULT NULL AFTER timesGraded;
