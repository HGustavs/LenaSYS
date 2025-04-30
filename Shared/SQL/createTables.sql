/* Associated with issue #10312 */
CREATE TABLE groupdugga (
	 hash VARCHAR(8),
     active_users INT(3) UNSIGNED,
     PRIMARY KEY(hash)
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;

/* Table for filenames in courses and duggor associated with issue #16987 */
CREATE TABLE duggaFiles(
	filename				VARCHAR(100) NOT NULL UNIQUE,
	quizID                  INT(11) NOT NULL,
	course_id				INT(10) NOT NULL
	PRIMARY KEY (filename)
) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;