/* Associated with issue #10312 */
CREATE TABLE groupdugga (
	 hash VARCHAR(8),
     active_users INT(3) UNSIGNED,
     PRIMARY KEY(hash)
)CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci ENGINE=InnoDB;