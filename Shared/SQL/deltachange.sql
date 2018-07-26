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

