/*
2Do SQL - logUserLogins istf logFailed och LogSuccess 

Tables_in_quizsystem

AssignedQuizzes
AssignedQuizzesAnswerLog
Course
QSystemUser
Quiz
QuizVariant
QuizVariantObject
Student
StudentCourseRegistration
logFailedUserLogins
logSuccessfulUserLogins
*/

/* Student USER! */

USE quizsystem;

GRANT SELECT ON AssignedQuizzes TO 'lasse'@'localhost';
GRANT SELECT ON Course TO 'lasse'@'localhost';
GRANT SELECT ON Quiz TO 'lasse'@'localhost';
GRANT SELECT ON QuizVariant TO 'lasse'@'localhost';
GRANT SELECT ON QuizVariantObject TO 'lasse'@'localhost';
GRANT SELECT ON Student TO 'lasse'@'localhost';
GRANT SELECT ON StudentCourseRegistration TO 'lasse'@'localhost';

GRANT UPDATE ON AssignedQuizzes TO 'lasse'@'localhost';
GRANT UPDATE ON AssignedQuizzesAnswerLog TO 'lasse'@'localhost';
GRANT UPDATE ON Student TO 'lasse'@'localhost';

GRANT INSERT ON AssignedQuizzes TO 'lasse'@'localhost';
GRANT INSERT ON AssignedQuizzesAnswerLog TO 'lasse'@'localhost';
GRANT INSERT ON userLoginsLog TO 'lasse'@'localhost';

/* Management system USER! */

GRANT SELECT ON AssignedQuizzes TO 'vigdis'@'localhost';
GRANT SELECT ON Course TO 'vigdis'@'localhost';
GRANT SELECT ON QSystemUser TO 'vigdis'@'localhost';
GRANT SELECT ON Quiz TO 'vigdis'@'localhost';
GRANT SELECT ON QuizVariant TO 'vigdis'@'localhost';
GRANT SELECT ON QuizVariantObject TO 'vigdis'@'localhost';
GRANT SELECT ON Student TO 'vigdis'@'localhost';
GRANT SELECT ON StudentCourseRegistration TO 'vigdis'@'localhost';
GRANT SELECT ON userLoginsLog TO 'vigdis'@'localhost';
	
GRANT INSERT ON AssignedQuizzes TO 'vigdis'@'localhost';
GRANT INSERT ON Course TO 'vigdis'@'localhost';
GRANT INSERT ON QSystemUser TO 'vigdis'@'localhost';
GRANT INSERT ON Quiz TO 'vigdis'@'localhost';
GRANT INSERT ON QuizVariant TO 'vigdis'@'localhost';
GRANT INSERT ON QuizVariantObject TO 'vigdis'@'localhost';
GRANT INSERT ON Student TO 'vigdis'@'localhost';
GRANT INSERT ON StudentCourseRegistration TO 'vigdis'@'localhost';
GRANT INSERT ON userLoginsLog TO 'vigdis'@'localhost';

GRANT UPDATE ON AssignedQuizzes TO 'vigdis'@'localhost';
GRANT UPDATE ON Course TO 'vigdis'@'localhost';
GRANT UPDATE ON QSystemUser TO 'vigdis'@'localhost';
GRANT UPDATE ON Quiz TO 'vigdis'@'localhost';
GRANT UPDATE ON QuizVariant TO 'vigdis'@'localhost';
GRANT UPDATE ON QuizVariantObject TO 'vigdis'@'localhost';
GRANT UPDATE ON Student TO 'vigdis'@'localhost';
GRANT UPDATE ON StudentCourseRegistration TO 'vigdis'@'localhost';
GRANT UPDATE ON userLoginsLog TO 'vigdis'@'localhost';
