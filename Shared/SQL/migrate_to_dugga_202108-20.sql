ALTER TABLE listentries ADD COLUMN feedbackenabled TINYINT(1) UNSIGNED NOT NULL DEFAULT 0;
ALTER TABLE listentries ADD COLUMN feedbackquestion VARCHAR(512);

ALTER TABLE userAnswer ADD COLUMN hash CHAR(8);
ALTER TABLE userAnswer ADD COLUMN password CHAR(8);
ALTER TABLE userAnswer ADD COLUMN timesSubmitted INT(5);
ALTER TABLE userAnswer ADD COLUMN timesAccessed INT(5);

/* Allow submissions without userid */
ALTER TABLE userAnswer DROP FOREIGN KEY fk_useranswer_joins_user;
DROP INDEX fk_useranswer_joins_user ON userAnswer;
ALTER TABLE userAnswer MODIFY COLUMN uid INTEGER UNSIGNED DEFAULT NULL;
ALTER TABLE userAnswer ADD CONSTRAINT fk_useranswer_joins_user FOREIGN KEY (uid) REFERENCES user(uid) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE submission ADD COLUMN hash CHAR(8);