/* Associated with issue #9859 */
ALTER TABLE userAnswer ADD COLUMN hash VARCHAR(8);
ALTER TABLE userAnswer ADD COLUMN password VARCHAR(7);
