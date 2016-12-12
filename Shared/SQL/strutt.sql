alter table user_course alter column result SET DEFAULT 0.0;
alter table user_course alter column period set default 1;
alter table user_course alter column term set default 1;
alter table user_course add column vershistory TEXT;
alter table user_course add column vers VARCHAR(8);