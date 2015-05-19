
/* use script like this to insert testdata. Do not have inserts in the script to create the database..*/

use imperious;

/* START duggasys test data START */
/* Insert test users */
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (1010, 'c92cober', 'Conny',  'Berg Czarnecki', '19920404-4522', password('password'), '1', 'c92cober@student.his.se');
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (2020, 'a87antal', 'Ann-Marie',  'Tallström', '19871116-7384', password('password'), '1', 'a87antal@student.his.se');
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (3030, 'a72ashal', 'Åsa',  'Hällsjö', '19721224-5582', password('password'), '1', 'a72ashal@student.his.se');
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (4040, 'a92albri', 'Alex', 'Bridgeman', '19920404-0404', password('password'), '1', 'a92albri@student.his.se');
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (5050, 'e93evkos', 'Eva', 'Koskinen', '19930505-0505', password('password'), '1', 'e93evkos@student.his.se');
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (6060, 's94sveri', 'Sven', 'Eriksson', '19940606-0606', password('password'), '1', 's94sveri@student.his.se');
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (7070, 's92sveri', 'Sven', 'Eriksson', '19920707-0707', password('password'), '1', 's92sveri@student.his.se');
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (8080, 'k90kakli', 'Karl', 'Klint', '19900808-0808', password('password'), '1', 'k90kakli@student.his.se');
INSERT INTO user (uid, username, firstname, lastname, ssn, password, creator, email) VALUES (9090, 's91stcar', 'Stina', 'Carlsson', '19910909-0909', password('password'), '1', 's91stcar@student.his.se');

/* Insert courses */
INSERT INTO course(cid,coursecode,coursename,created,creator,visibility,activeversion,hp) values (1, 'DV12G', 'Webbprogrammering', NOW(), 1, 1, '45656', '7.5');
INSERT INTO course(cid,coursecode,coursename,created,creator,visibility,activeversion,hp) values (2, 'IT118G', 'Webbutveckling - datorgrafik', NOW(), 1, 1, '97732', '7.5');

/* Insert versions of courses (The column vers should be the same as "anmälningskod", number with 5 digts) */
INSERT INTO vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1, 'DV12G', 'Webbprogrammering', 'UNK', '45656', 'HT15');
INSERT INTO vers (cid,coursecode,coursename,coursenamealt,vers,versname) values('2', 'IT118G', 'Webbutveckling - datorgrafik', 'UNK', '97732', 'HT15');
INSERT INTO vers (cid,coursecode,coursename,coursenamealt,vers,versname) values('2', 'IT118G', 'Webbutveckling - datorgrafik', 'UNK', '97731', 'HT14');

/* Insert tests */
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (1, 2, 1, 2, 'Bitdugga1', 'dugga1', '2015-02-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (2, 2, 1, 2, 'Bitdugga2', 'dugga1', '2015-03-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (3, 2, 1, 2, 'colordugga1', 'dugga2', '2015-04-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (4, 2, 1, 2, 'colordugga2', 'dugga2', '2015-04-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (5, 2, 1, 2, 'linjedugga1', 'dugga3', '2015-02-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (6, 2, 1, 2, 'linjedugga2', 'dugga3', '2015-03-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (7, 2, 1, 2, 'dugga1', 'dugga4', '2015-02-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (8, 2, 1, 2, 'dugga2', 'dugga4', '2015-03-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);
INSERT INTO quiz (id, cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, modified, creator) VALUES (9, 2, 1, 2, 'Quiz', 'kryss', '2015-02-01 00:00:00', '2015-12-31 00:00:00', NOW(), 2);

/* Insert variants of tests */
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (1, 1, '{*tal*:*2*}', '{*danswer*:*00000010 0 2*}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (2, 1, '{*tal*:*5*}', '{*danswer*:*00000101 0 5*}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (3, 1, '{*tal*:*10*}', '{*danswer*:*00002 0 A*}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (4, 2, '{*tal*:*25*}', '{*danswer*:*00011001 1 9*}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (5, 2, '{*tal*:*87*}', '{*danswer*:*02111 5 7*}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (6, 2, '{*tal*:*192*}', '{*danswer*:*11000000 C 0*}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (7, 3, '{*color*:*red*,*colorname*:*Röd*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (8, 3, '{*color*:*white*,*colorname*:*Vit*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (9, 3, '{*color*:*black*,*colorname*:*Svart*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (10, 4, '{*color*:*blue*,*colorname*:*Blå*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (11, 4, '{*color*:*purple*,*colorname*:*Lila*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (12, 4, '{*color*:*teal*,*colorname*:*Turkos (Teal)*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (13, 5, '{*linje*:*10,30,19 20 40 20 50 30 50,81 65 50*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (14, 6, '{*linje*:*10,30,81 10 20,81 65 10,63 20 30 75 35,19 30 60 75 70 50 35,19 100 10 85 95 45 50,19 40 40 50 40 15 55,63 10 60 10 50,81 20 30*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (15, 7, '{*variant*:*40 13 7 20 0*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (16, 8, '{*variant*:*26 38 33 43 17 5 23 26 30 40 0 17 5 13 22 1 27 11 7 17 22 2 27 26 16 8 13 22 2 27 15 10 19 23 0*}', '{Variant}', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (17, 9, '{question*One byte is equivalent to how many bits?: A*4: B*8: C*16: D*32}', 'B', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (18, 9, '{question*RGB and CMYK are abbreviations for what?: A*Red, Green, Blue and Cyan Magenta, Yellow, Key (black): B*Red, Grey, Black and Cyclone, Magenta, Yellow, Kayo: C*Randy´s Green Brick and Cactus Magnolia Yronema Kalmia}', 'A', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (19, 9, '{question*Which of these are examples of actual shaders?: A*B32shader, 554shader: B*Context shaders, Shadow shaders and Block shaders: C*Vertex shaders, Pixel shaders and Geometry shaders}', 'C', NOW(), 2);
INSERT INTO variant (vid, quizID, param, variantanswer, modified, creator) VALUES (20, 9, '{question*Points, lines and curves are examples of geometrical...: A*Primitives: B*Substitutes: C*Formations: D*Partitions}', 'A', NOW(), 2);


/* Insert items on coursepage */
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1001, 1, 'PHP examples', 'UNK', 1, 1, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1002, 1, 'PHP Example 1', 1, 2, 2, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1003, 1, 'PHP Example 2', 2, 2, 3, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1004, 1, 'PHP Example 3', 3, 2, 4, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1005, 1, 'Javascript examples', 'UNK', 1, 5, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1006, 1, 'JavaScript Example 1', 4, 2, 6, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1007, 1, 'JavaScript Example 2', 5, 2, 7, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1008, 1, 'JavaScript Example 3', 6, 2, 8, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1009, 1, 'HTML5 examples', 'UNK', 1, 9, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1010, 1, 'HTML5 Example 1', 7, 2, 10, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1011, 1, 'HTML5 Example 2', 8, 2, 11, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1012, 1, 'HTML5 Example 3', 9, 2, 12, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1013, 1, 'HTML5 Example 4', 10, 2, 13, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1014, 1, 'HTML5 Example 5', 11, 2, 14, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1015, 1, 'HTML5 Example 6', 12, 2, 15, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1016, 1, 'HTML5 Example 7', 13, 2, 16, 1, 1,'45656');
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers) VALUES(1017, 1, 'HTML5 Example 8', 14, 2, 17, 1, 1,'45656');

INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2001, 2, 'Biträkningsduggor 1HP', '', 4, 0, 1, 1, '97732', 2001, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2002, 2, 'Biträkningsdugga 1', '1', 3, 1, 1, 1, '97732', 2001, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2003, 2, 'Biträkningsdugga 2', '2', 3, 2, 1, 1, '97732', 2001, 0, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2004, 2, 'Färgduggor 1HP', '', 4, 3, 1, 1, '97732', 2004, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2005, 2, 'Färgdugga 1', '3', 3, 4, 1, 1, '97732', 2004, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2006, 2, 'Färgdugga 2', '4', 3, 5, 1, 1, '97732', 2004, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2007, 2, 'Geometri 2HP', '', 4, 6, 1, 1, '97732', 2007, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2008, 2, 'Linjedugga 1', '5', 3, 7, 1, 1, '97732', 2007, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2009, 2, 'Linjedugga 2', '6', 3, 8, 1, 1, '97732', 2007, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2010, 2, 'Transformationer 3,5HP', '', 4, 9, 1, 1, '97732', 2010, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2011, 2, 'Transformationsdugga 1', '7', 3, 10, 1, 1, '97732', 2010, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2012, 2, 'Transformationsdugga 2', '8', 3, 11, 1, 1, '97732', 2010, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2013, 2, 'Frågeduggor 1HP', '', 4, 12, 1, 1, '97732', 2013, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2014, 2, 'Frågedugga 1', '9', 3, 13, 1, 1, '97732', 2013, 2, 0);


INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2015, 2, 'Bit count test 1HP', '', 4, 0, 1, 1, '97731', 2015, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2016, 2, 'Bit count test 1', '1', 3, 1, 1, 1, '97731', 2015, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2017, 2, 'Bit count test 2', '2', 3, 2, 1, 1, '97731', 2015, 0, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2018, 2, 'Color test 1HP', '', 4, 3, 1, 1, '97731', 2018, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2019, 2, 'Hex color test 1', '3', 3, 4, 1, 1, '97731', 2018, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2020, 2, 'Hex color test 2', '4', 3, 5, 1, 1, '97731', 2018, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2021, 2, 'Geometry 2HP', '', 4, 6, 1, 1, '97731', 2021, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2022, 2, 'Geometry test 1', '5', 3, 7, 1, 1, '97731', 2021, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2023, 2, 'Geometry test 2', '6', 3, 8, 1, 1, '97731', 2021, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2024, 2, 'Transforms 3,5HP', '', 4, 9, 1, 1, '97731', 2024, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2025, 2, 'Transforms test 1', '7', 3, 10, 1, 1, '97731', 2024, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2026, 2, 'Transforms test 2', '8', 3, 11, 1, 1, '97731', 2024, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2027, 2, 'Quizzes 1HP', '', 4, 12, 1, 1, '97731', 2027, 2, 0);
INSERT INTO listentries (lid, cid, entryname, link, kind, pos, creator, visible, vers, moment, gradesystem, highscoremode) VALUES (2028, 2, 'Quiz 1', '9', 3, 13, 1, 1, '97731', 2027, 2, 0);


/* Insert access for users */
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (1010, 1, '0.0', 1, 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (2020, 1, '0.0', 1, 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (3030, 1, '0.0', 1, 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (4040, 1, '0.0', 1, 'R', 0, '');

INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (1010, 2, '0.0', '1', 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (2020, 2, '0.0', '1', 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (3030, 2, '0.0', '1', 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (4040, 2, '0.0', '1', 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (5050, 2, '0.0', '1', 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (6060, 2, '0.0', '1', 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (7070, 2, '0.0', '1', 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (8080, 2, '0.0', '1', 'R', 0, '');
INSERT INTO user_course (uid, cid, result, creator, access, period, term) VALUES (9090, 2, '0.0', '1', 'R', 0, '');
/* END duggasys test data END */

/* START codeviewver test data START */
/* Templates for codeexamples */

INSERT INTO template(templateid, stylesheet, numbox) VALUES (0, "template0.css",0);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (1,"template1.css",2);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (2,"template2.css",2);
INSERT INTO template(templateid,stylesheet,numbox) VALUES (3,"template3.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (4,"template4.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (5,"template5.css",4);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (6,"template6.css",4);

/* Codeexamples */

INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'PHP Example 1',"PHP Startup","PHP_Ex1.php",1,2013,'2','1',1,1);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'PHP Example 2',"PHP Startup","PHP_Ex2.php",1,2013,'3','1',1,2);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'PHP Example 3',"PHP Variables","PHP_Ex3.php",1,2013,'4','2',1,3);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'JavaScript Example 1',"Events, DOM access and console.log","JavaScript_Ex1.html",1,2013,'5','3',3,4);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'JavaScript Example 2',"Adding and removing elements in the DOM","JavaScript_Ex2.html",1,2013,'6','4',4,5);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'JavaScript Example 3',"Validating form data","JavaScript_Ex3.html",1,2013,'7','5',3,6);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 1',"Basic canvas graphics","HTML_Ex1.html",1,2013,'8','6',6,7);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 2',"Canvas Gradients and Transformations","HTML_Ex2.html",1,2013,'9','7',2,8);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 3',"Animation and drawing images","HTML_Ex3.html",1,2013,'10','8',2,9);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 4',"Shadows","HTML_Ex4.html",1,2013,'11','9',2,10);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 5',"Reading mouse coordinates","HTML_Ex5.html",1,2013,'12','10',1,11);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 6',"2D Tile Map and Mouse Coordinates","HTML_Ex6.html",1,2013,'13','11',1,12);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 7',"Isometric Tile Map and Mouse Coordinates","HTML_Ex7.html",1,2013,'14','12',1,13);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 8',"Cookies","HTML_Ex8.html",1,2013,'14','13',5,14);
 
/* Programming languages that decide highlighting */
 
INSERT INTO wordlist(wordlistname,uid) VALUES ("JS",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("PHP",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("HTML",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("Plain Text",1);
 
/* Wordlist for different programming languages */

INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"for","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"function","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"if","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (1,"var","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,"echo","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,"function","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,"if","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (2,"else","D",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"onclick","A",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"onload","B",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"class","C",1);
INSERT INTO word(wordlistid, word,label,uid) VALUES (3,"id","D",1);

/* Boxes for codeexamples */

INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,1,"Description","Document","[viktig=1]",4,"PHP_Ex1.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,1,"PHP_Ex1.php","Code","[viktig=1]",2,"PHP_Ex1.php");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,2,"Description","Document","[viktig=1]",4,"PHP_Ex2.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,2,"PHP_Ex2.php","Code","[viktig=1]",2,"PHP_Ex2.php");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,3,"Description","Document","[viktig=1]",4,"PHP_Ex3.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,3,"PHP_Ex3.php","Code","[viktig=1]",2,"PHP_Ex3.php");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,4,"Description","Document","[viktig=1]",4,"JavaScript_Ex1.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,4,"JavaScript_Ex1.html","Code","[viktig=1]",3,"JavaScript_Ex1.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,4,"JavaScript_Ex1.js","Code","[viktig=1]",1,"JavaScript_Ex1.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,5,"JavaScript_Ex2.html","Code","[viktig=1]",3,"JavaScript_Ex2.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,5,"JavaScript_Ex2.js","Code","[viktig=1]",1,"JavaScript_Ex2.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,5,"Description","Document","[viktig=1]",4,"JavaScript_Ex2.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6,"Description","Document","[viktig=1]",4,"JavaScript_Ex3.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6,"JavaScript_Ex3.html","Code","[viktig=1]",3,"JavaScript_Ex3.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,6,"JavaScript_Ex3.js","Code","[viktig=1]",1,"JavaScript_Ex3.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7,"Description","Document","[viktig=1]",4,"HTML_Ex1.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7,"HTML_Ex1.html","Code","[viktig=1]",3,"HTML_Ex1.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,7,"HTML_Ex1.css","Code","[viktig=1]",4,"HTML_Ex1.css");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,7,"HTML_Ex1.js","Code","[viktig=1]",1,"HTML_Ex1.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8,"Description","Document","[viktig=1]",4,"HTML_Ex2.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8,"HTML_Ex2.html","Code","[viktig=1]",3,"HTML_Ex2.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9,"Description","Document","[viktig=1]",4,"HTML_Ex3.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9,"HTML_Ex3.html","Code","[viktig=1]",3,"HTML_Ex3.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,10,"Description","Document","[viktig=1]",4,"HTML_Ex4.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,10,"HTML_Ex4.html","Code","[viktig=1]",3,"HTML_Ex4.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,11,"Description","Document","[viktig=1]",4,"HTML_Ex5.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,11,"HTML_Ex5.html","Code","[viktig=1]",3,"HTML_Ex5.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,12,"Description","Document","[viktig=1]",4,"HTML_Ex6.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,12,"HTML_Ex6.html","Code","[viktig=1]",3,"HTML_Ex6.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,13,"Description","Document","[viktig=1]",4,"HTML_Ex7.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,13,"HTML_Ex7.html","Code","[viktig=1]",3,"HTML_Ex7.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,14,"Description","Document","[viktig=1]",4,"HTML_Ex8.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,14,"HTML_Ex8.html","Code","[viktig=1]",3,"HTML_Ex8.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,14,"HTML_Ex8.css","Code","[viktig=1]",4,"HTML_Ex8.css");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,14,"HTML_Ex8.js","Code","[viktig=1]",1,"HTML_Ex8.js");

/* Important rows */
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (1,2,4,9,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (2,2,3,5,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (2,2,11,13,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (3,2,10,12,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (3,2,15,15,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (3,2,21,21,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (3,2,24,24,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (4,2,7,8,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (4,3,2,21,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (4,3,24,29,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (5,2,1,19,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (5,2,21,30,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (5,2,32,34,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (6,3,1,5,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (6,3,7,11,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (6,3,13,16,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (6,3,18,21,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (6,3,23,29,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (6,3,31,34,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (6,3,36,47,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (6,3,49,55,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (7,4,6,7,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (7,4,11,12,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (7,4,15,17,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (7,4,20,25,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (7,4,28,33,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (7,4,36,37,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (8,2,20,30,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (8,2,41,41,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (8,2,44,48,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (8,2,84,89,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (8,2,92,97,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (8,2,100,105,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (8,2,108,114,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (8,2,116,116,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (9,2,21,38,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (9,2,43,47,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (9,2,50,57,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (9,2,62,71,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (9,2,79,79,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (10,2,89,93,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (10,2,96,110,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (10,2,112,114,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (11,2,14,16,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (11,2,20,28,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (11,2,31,42,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (11,2,45,51,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (11,2,54,65,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (12,2,11,15,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (12,2,36,52,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (12,2,55,70,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (12,2,80,84,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (12,2,96,98,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (13,2,11,15,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (13,2,32,41,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (13,2,46,62,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (13,2,65,80,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (13,2,90,94,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (13,2,106,108,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (14,4,4,19,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (14,4,22,30,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (14,4,33,37,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (14,4,40,52,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (14,4,55,59,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (14,4,62,64,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (14,4,67,70,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (14,4,73,73,1);

/* Important words */

INSERT INTO impwordlist(exampleid,word,uid) values (1,"echo",1);
INSERT INTO impwordlist(exampleid,word,uid) values (1,"Hello!",1);
INSERT INTO impwordlist(exampleid,word,uid) values (2,"Hello!",1);
INSERT INTO impwordlist(exampleid,word,uid) values (4,"onclick",1);
INSERT INTO impwordlist(exampleid,word,uid) values (4,"onload",1);
INSERT INTO impwordlist(exampleid,word,uid) values (4,"initializeEvents",1);
INSERT INTO impwordlist(exampleid,word,uid) values (4,"console.log",1);
INSERT INTO impwordlist(exampleid,word,uid) values (4,"changeBackground",1);
INSERT INTO impwordlist(exampleid,word,uid) values (5,"createElement",1);
INSERT INTO impwordlist(exampleid,word,uid) values (5,"innerHTML",1);
INSERT INTO impwordlist(exampleid,word,uid) values (5,"appendChild",1);
INSERT INTO impwordlist(exampleid,word,uid) values (5,"appendNode",1);
INSERT INTO impwordlist(exampleid,word,uid) values (5,"appendChild",1);
INSERT INTO impwordlist(exampleid,word,uid) values (5,"insertBefore",1);
INSERT INTO impwordlist(exampleid,word,uid) values (5,"parentNode",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"value",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"isNaN",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"className",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"options",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"selectedIndex",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"length",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"onclick",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"onload",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"onchange",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"onkeyup",1);
INSERT INTO impwordlist(exampleid,word,uid) values (6,"onblur",1);
INSERT INTO impwordlist(exampleid,word,uid) values (7,"canvas",1);
INSERT INTO impwordlist(exampleid,word,uid) values (7,"fillRect",1);
INSERT INTO impwordlist(exampleid,word,uid) values (7,"getContext",1);
INSERT INTO impwordlist(exampleid,word,uid) values (7,"strokeStyle",1);
INSERT INTO impwordlist(exampleid,word,uid) values (7,"strokeRect",1);
INSERT INTO impwordlist(exampleid,word,uid) values (7,"fillStyle",1);
INSERT INTO impwordlist(exampleid,word,uid) values (7,"fillText",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"beginPath",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"createLinearGradient",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"save()",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"rotate",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"restore()",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"closePath",1);
INSERT INTO impwordlist(exampleid,word,uid) values (9,"new Image()",1);
INSERT INTO impwordlist(exampleid,word,uid) values (9,"src",1);
INSERT INTO impwordlist(exampleid,word,uid) values (9,"drawImage",1);
INSERT INTO impwordlist(exampleid,word,uid) values (10,"shadowColor",1);
INSERT INTO impwordlist(exampleid,word,uid) values (10,"shadowOffsetX",1);
INSERT INTO impwordlist(exampleid,word,uid) values (10,"shadowOffsetY",1);
INSERT INTO impwordlist(exampleid,word,uid) values (10,"shadowBlur",1);
/* END codeviewver test data END */

-- START UMV test data START --

-- Users -- 
INSERT INTO user(uid,username, password,firstname,lastname,ssn,email,creator,superuser) values(100,'stei','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Joe','Steinhauer','340101-0101','joe.steinhauer@his.se', 0, 1);
INSERT INTO user(uid,username, password,firstname,lastname,ssn,email,creator,superuser) values(101,'brom','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Marcus','Brohede','340101-1232','marcus.brohede@his.se', 0, 1);

-- CLass --
INSERT INTO class(class,classname,regcode,classcode,hp,tempo,responsible) VALUES ('DVSUG13h','theGreat',199191,'DVSUG',180,100,100);
INSERT INTO class(class,classname,regcode,classcode,hp,tempo,responsible) VALUES ('WEBUG13h','theBEST',199292,'WEBUG',180,100,101);
INSERT INTO class(class,classname,regcode,classcode,hp,tempo,responsible) VALUES ('WEBUG14h','theDEST',199393,'WEBUG',180,100,101);

-- Courses --
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (300, "DA121G","Datorns Grunder",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (301, "DA124G","Programmeringsmetodik",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (302, "DA122G","Datakommunikation",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (303, "IT1435","USEREXPERIENCE",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (304, "DAD3G","Statistik för datavetare",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (305, "DA14G","Objektorienterad programmering",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (306, "DHITG","Maskinnäraprogrammering",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (307, "IS135G","Databassystem",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (308, "MA161G","Diskret matematik",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (309, "DA322G","Operativsystem",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (310, "IT325G","Parallella processer",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (311, "DA327G","Mjukvarukomponenter i C++",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (312, "IT326G","Distribuerade system",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (313, "IT301G","Software engineering",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (314, "DV318G","Programvaruutveckling programvaruprojekt",NOW(),1,0,15);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (315, "IS317G","Databaskonstruktion",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (316, "DA321G","Programvarutestning",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (317, "DV517G","Systemutveckling-forskning och utveckling",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (318, "DA346G","Algoritmer och datastrukturer",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (319, "DV516G","Examensarbete i Datavetenskap",NOW(),1,0,30);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (320, "IT503G","IT i orginisationer - vetenskap och profession",NOW(),1,0,30);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (321, "DA133G","Webbutveckling - datorgrafik",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (322, "KB126G","Introduktion till User Experience design",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (323, "DA147G","Grundläggande programmering med C++",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (324, "DV124G","Webbutveckling - Webbplatsdesign",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (325, "IS134G","Databassystem",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (326, "DV313G","Webbutveckling - XML API",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (327, "DV314G","IT i orginisation - Introduktion",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (328, "IS324G","Databaskonstruktionen",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (329, "IT119G","Datakommunikation - Introduktion",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (330, "DA330G","Webbprogrammering",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (331, "MA113G","Algebra och logik ",NOW(),1,0,7.5);
INSERT INTO course(cid, coursecode,coursename,created,creator,visibility,hp) values (332, "DA131G","Informationssäkerhet - introduktion",NOW(),1,0,7.5);



-- course and class-- 
-- DVSUG --
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',300);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',301);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',302);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',303);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',304);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',305);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',306);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',307);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',308);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',309);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',310);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',311);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',312);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',313);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',314);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',315);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',316);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',317);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',318);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',319);
INSERT INTO programcourse(class,cid) VALUES ('DVSUG13h',320);

-- WEBUG --
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',300);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',305); 
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',313);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',314);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',321);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',322);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',323);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',324);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',325);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',326);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',327);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',328);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',329);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',330);
INSERT INTO programcourse(class,cid) VALUES ('WEBUG13h',331);


-- course requirements --
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(309,305,"DA14G","DA322G");
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(309,307,"IS135G","DA322G");
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(319,305,"DA14G","DV516G");
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(319,306,"DHITG","DV516G");
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(319,307,"IS135G","DV516G");
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(319,308,"MA161G","DV516G");
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(319,309,"DA322G","DV516G");
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(319,310,"IT325G","DV516G");
INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(319,311,"DA327G","DV516G");

INSERT INTO course_req(cid,req_cid,reg_coursecode,coursecode) values(305,309,"DA322G","DA14G");

-- DVSUG -- 
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(200,'a13andka','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Anders','Karlsson','910202-3434','a13andka@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(201,'a13sveth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Sven','Torbjörnsson','890502-2344','a13sveth@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(202,'a13saeth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Sven','Torbjörnsson','890502-2445','a13saeth@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(203,'a13sbeth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Sten','Torbjörnsson','890502-2674','a13sbeth@student.his.se','DVSUG13h');			
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(204,'c13sneth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Syen','Torbjörnsson','890502-2944','a13sneth@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(205,'b13sceth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Suen','Torbjörnsson','890502-2389','a13sceth@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(206,'a13steth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Rddn','Torbjörnsson','890702-1389','a13steth@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(207,'b13syeth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Suen','Torbjörnsson','790202-2389','a13syeth@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(208,'a13eyeth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Eyde','Torbjörnsson','790222-2489','a13syeth@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(209,'a13eydth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','tuen','Torbjörnsson','730202-2379','a13syeth@student.his.se','DVSUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(210,'c13dddth','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','tuen','Torbjörnsson','781202-2389','a13syeth@student.his.se','DVSUG13h');

-- WEBUG -- 
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(211,'c13aaath','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Tuen','Torbjörnsson','781902-3381','a13syeth@student.his.se','WEBUG13h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(212,'c13timan','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Tim','Andersson','901202-2399','c13timan@student.his.se','WEBUG14h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(213,'a13siman','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Simon','Andersson','931202-2489','a13siman@student.his.se','WEBUG14h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(214,'a13henan','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Henrik','Andersson','891202-3489','a13henan@student.his.se','WEBUG14h');
insert into user(uid,username, password,firstname,lastname,ssn,email,class) values(215,'a13jacan','*15E4521DE818D9E7B318250FE7DCDA0419FA84AE','Jacob','Andersson Svensson','751202-2389','a13jacan@student.his.se','WEBUG14h');

-- Course with user --

insert into user_course(uid,cid,result,access,period,term) values(200,300,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(200,301,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(200,302,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(200,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(200,304,0,'R',2,'VT-14');
insert into user_course(uid,cid,result,access,period,term) values(200,305,0,'R',2,'VT-14');
insert into user_course(uid,cid,result,access,period,term) values(200,306,0,'R',2,'VT-14');
insert into user_course(uid,cid,result,access,period,term) values(200,307,0,'R',2,'VT-14');
insert into user_course(uid,cid,result,access,period,term) values(200,308,0,'R',3,'HT-14');
insert into user_course(uid,cid,result,access,period,term) values(200,309,0,'R',3,'HT-14');
insert into user_course(uid,cid,result,access,period,term) values(200,310,0,'R',3,'HT-14');
insert into user_course(uid,cid,result,access,period,term) values(200,311,0,'R',3,'HT-14');
insert into user_course(uid,cid,result,access,period,term) values(200,312,0,'R',4,'VT-15');
insert into user_course(uid,cid,result,access,period,term) values(200,313,0,'R',4,'VT-15');
insert into user_course(uid,cid,result,access,period,term) values(200,314,0,'R',4,'VT-15');


insert into user_course(uid,cid,result,access,period,term) values(201,300,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(201,301,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(201,302,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(201,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(201,304,0,'R',2,'VT-14');
insert into user_course(uid,cid,result,access,period,term) values(201,305,0,'R',2,'VT-14');
insert into user_course(uid,cid,result,access,period,term) values(201,306,0,'R',2,'VT-14');
insert into user_course(uid,cid,result,access,period,term) values(201,307,0,'R',2,'VT-14');
insert into user_course(uid,cid,result,access,period,term) values(201,308,0,'R',3,'HT-14');
insert into user_course(uid,cid,result,access,period,term) values(201,309,0,'R',3,'HT-14');
insert into user_course(uid,cid,result,access,period,term) values(201,310,0,'R',3,'HT-14');
insert into user_course(uid,cid,result,access,period,term) values(201,311,0,'R',3,'HT-14');
insert into user_course(uid,cid,result,access,period,term) values(201,312,0,'R',4,'VT-15');
insert into user_course(uid,cid,result,access,period,term) values(201,313,0,'R',4,'VT-15');
insert into user_course(uid,cid,result,access,period,term) values(201,314,0,'R',4,'VT-15');
insert into user_course(uid,cid,result,access,period,term) values(201,315,0,'R',4,'VT-15');
insert into user_course(uid,cid,result,access,period,term) values(201,316,0,'R',4,'HT-15');
insert into user_course(uid,cid,result,access,period,term) values(201,317,0,'R',4,'HT-15');
insert into user_course(uid,cid,result,access,period,term) values(201,318,0,'R',4,'HT-15');
insert into user_course(uid,cid,result,access,period,term) values(201,319,0,'R',4,'HT-15');
insert into user_course(uid,cid,result,access,period,term) values(201,320,0,'R',4,'VT-16');


insert into user_course(uid,cid,result,access,period,term) values(202,300,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(202,301,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(202,302,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(202,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(202,304,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(202,305,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(202,306,0,'R',1,'HT-13');


insert into user_course(uid,cid,result,access,period,term) values(203,300,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(203,301,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(203,302,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(203,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(203,304,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(203,305,0,'R',1,'HT-13');


insert into user_course(uid,cid,result,access,period,term) values(204,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(205,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(206,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(207,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(208,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(209,303,0,'R',1,'HT-13');
insert into user_course(uid,cid,result,access,period,term) values(210,303,0,'R',1,'HT-13');




-- Examination/subparts --

INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',300,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',301,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',302,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',303,5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('inlämning1',303,2.5,'u-3');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',304,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',305,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',306,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',307,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',308,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',309,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',310,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',311,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',312,5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',313,5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('inlämning',313,2.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',314,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',315,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',316,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',317,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',318,7.5,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',319,30,'u-3-4-5');
INSERT INTO subparts(partname,cid,parthp,difgrade) VALUES ('salstentamen',320,30,'u-3-4-5');

-- Student results/Credits --

INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (300,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (301,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (302,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (304,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (305,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (306,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (307,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (308,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (309,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (310,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (311,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (312,200,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (313,200,'salstentamen','u', 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (314,200,'salstentamen',5, 12);

INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (300,201,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (301,201,'salstentamen',4, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (302,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,201,'salstentamen',3, 5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,201,'inlämning1','u', 2.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (304,201,'salstentamen','u', 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (305,201,'salstentamen','u', 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (306,201,'salstentamen','u', 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (307,201,'salstentamen','u', 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (308,201,'salstentamen','u', 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (309,201,'salstentamen','u', 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (310,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (311,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (312,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (313,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (314,201,'salstentamen',3, 12);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (315,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (316,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (317,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (318,201,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (319,201,'salstentamen',3, 30);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (320,201,'salstentamen',3, 30);

INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (300,202,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (301,202,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (302,202,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,202,'inlämning1',4,2.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (304,202,'salstentamen',4,7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (305,202,'salstentamen',4,7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (306,202,'salstentamen','u',7.5);

INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (300,203,'salstentamen',3, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (301,203,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (302,203,'salstentamen',5, 7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,203,'inlämning1',4,2.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (304,203,'salstentamen','u',7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (305,203,'salstentamen',4,7.5);

INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,204,'salstentamen',5,7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,205,'salstentamen','u',7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,206,'salstentamen',3,7.5);
INSERT INTO partresult(cid,uid,partname,grade, hp) VALUES (303,207,'salstentamen',4,7.5);

-- END UMV test data END --
