--
-- SQL delta changes VT 2019
-- These changes should only be applied to systems which have not been 
-- initialised with the updated init_db.sql file.
-- 

-- 2019-04-30 introduce column used to track when a grade was last exported
alter table userAnswer add column gradeLastExported timestamp null default null;
