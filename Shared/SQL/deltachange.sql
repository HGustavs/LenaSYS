/* Increased size of parameters and answers for dugga variants */
ALTER TABLE variant MODIFY param VARCHAR(8256);
ALTER TABLE variant MODIFY variantanswer VARCHAR(8256);

/*New columns for fileLink */
ALTER TABLE fileLink ADD COLUMN filesiz INT;
ALTER TABLE fileLink ADD COLUMN uploaddate DATETIME;
ALTER TABLE fileLink ADD COLUMN vers VARCHAR(8);
