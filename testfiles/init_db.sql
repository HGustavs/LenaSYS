
/* user contains the users of the system and related information */

CREATE TABLE user(
		uid					INT UNSIGNED NOT NULL AUTO_INCREMENT,
		username			VARCHAR(80) NOT NULL UNIQUE,
		firstname			VARCHAR(50) NULL,
		lastname			VARCHAR(50) NULL,
		ssn					VARCHAR(20) NULL UNIQUE,
		password			VARCHAR(225) NOT NULL,
		lastupdated			TIMESTAMP,
		addedtime  			DATETIME,
		lastvisit			DATETIME,
		newpassword			TINYINT(1) NULL,
		creator				INT UNSIGNED NULL,
		superuser			TINYINT(1) NULL,
		email				VARCHAR(256) DEFAULT NULL,
		class 				VARCHAR(10) DEFAULT NULL REFERENCES class (class),
		totalHp				decimal(4,1),
		securityquestion	VARCHAR(256) DEFAULT NULL,
		securityquestionanswer	VARCHAR(256) DEFAULT NULL,
		requestedpasswordchange	TINYINT(1) UNSIGNED NOT NULL DEFAULT 0,

		PRIMARY KEY(uid)

) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO user(username,password,newpassword,creator,superuser) values ("Grimling","$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m",0,1,1);
INSERT INTO user(username,password,newpassword,creator) values ("Toddler","$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",0,1); /* Password is Kong */
INSERT INTO user(username,password,newpassword,creator,ssn) values ("Tester", "$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",1,1,"111111-1111"); /* Password is Kong */


/**
 * Course table contains the most essential information relating to study courses in the database.
 */

/* alter table course alter column hp add default 7.5; */

CREATE TABLE course(
		cid							INT UNSIGNED NOT NULL AUTO_INCREMENT,
		coursecode			VARCHAR(45) NULL UNIQUE,
		coursename			VARCHAR(80) NULL,
		created					DATETIME,
		creator					INT UNSIGNED NOT NULL,
		visibility			TINYINT UNSIGNED NOT NULL DEFAULT 0,
		updated					TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		activeversion		VARCHAR(8),
		activeedversion VARCHAR(8),
		capacity				INT(5),
		hp							DECIMAL(4,1) NOT NULL DEFAULT 7.5,
		courseHttpPage	VARCHAR(2000),
		PRIMARY KEY(cid),
		FOREIGN KEY (creator) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;
