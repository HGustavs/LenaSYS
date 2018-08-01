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

/*

Notice: Undefined variable: duggaVisibility in /Library/WebServer/Documents/LenaSYS_HT2017/DuggaSys/showdoc.php on line 408
Notice: Undefined variable: duggaVisibility in /Library/WebServer/Documents/LenaSYS_HT2017/DuggaSys/showdoc.php on line 408

Error retreiving userAnswers. (row 394) 0 row(s) were found. Error code: Unknown column 'timesGraded' in 'field list'

NONE!Error changing group: Table 'imperious.user_group' doesn't exist

Error retreiving userAnswers. (row 394) 0 row(s) were found. Error code: Unknown column 'timesGraded' in 'field list'
*/