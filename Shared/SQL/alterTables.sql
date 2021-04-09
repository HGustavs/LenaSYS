/* Associated with issue #9859 */
ALTER TABLE userAnswer ADD COLUMN hash VARCHAR(8) DEFAULT NULL;
ALTER TABLE userAnswer ADD COLUMN password VARCHAR(7) DEFAULT NULL;
