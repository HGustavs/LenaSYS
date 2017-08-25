/* Increased size of parameters and answers for dugga variants */
ALTER TABLE variant MODIFY params VARCHAR(8256);
ALTER TABLE variant MODIFY danswer VARCHAR(8256);