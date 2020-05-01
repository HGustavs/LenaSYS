/* START duggasys demo-course data START */
/* The separate file makes it easier for someone new to understand how to add more */

/* Create a course */
INSERT INTO course (cid,coursecode,coursename,created,creator,visibility,activeversion,hp) VALUES (1894,'G420','Demo-Course',NOW(),1894,1,'52432','100');

/* Create a version of course */
INSERT INTO vers (cid,coursecode,coursename,coursenamealt,vers,versname,startdate,enddate,motd) VALUES (1894,'G420','Demo-Course','Chaos Theory - Conspiracy 64k Demo','52432','ST20','2020-05-01 00:00:00','2020-06:30 00:00:00','Demo Course 2020 - All current duggas');

/* Create Quizes for course */
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (13,1894,1,2,'3D Dugga','3d-dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (14,1894,1,2,'BIT Dugga','bit-dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (15,1894,1,2,'Boxmodell','boxmodell','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (16,1894,1,2,'Clipping Maskin Dugga','clipping_masking_dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (17,1894,1,2,'Color Dugga','color-dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (18,1894,1,2,'Contribution','contribution','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (19,1894,1,2,'Curve Dugga','curve-dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (20,1894,1,2,'Daily Minutes','daily-minutes','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (21,1894,1,2,'Diagram Dugga','diagram_dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (22,1894,1,2,'Dugga 1','dugga1','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (23,1894,1,2,'Dugga 2','dugga2','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (24,1894,1,2,'Dugga 3','dugga3','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (25,1894,1,2,'Dugga 4','dugga4','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (26,1894,1,2,'Dugga 5','dugga5','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (27,1894,1,2,'Dugga 6','dugga6','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (28,1894,1,2,'Feedback Dugga','feedback_dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (29,1894,1,2,'Generic Dugga File Receive','generic_dugga_file_receive','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (30,1894,1,2,'Group Assignment','group-assignment','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (31,1894,1,2,'HTML CSS Dugga','html_css_dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (32,1894,1,2,'HTML CSS Dugga Light','html_css_dugga_light','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (33,1894,1,2,'Kryss','kryss','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (34,1894,1,2,'Placeholder Dugga','placeholder_dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (35,1894,1,2,'Shapes Dugga','shapes-dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (36,1894,1,2,'Transforms Dugga','transforms-dugga','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");
INSERT INTO quiz (id,cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,modified,creator,vers) VALUES (37,1894,1,2,'XMLAPI Report','XMLAPI_report1','2020-05-01 00:00:00','2020-06:30 00:00:00',NOW(),1894, "52432");

/* List quizes in course */
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Tillgängliga Duggor','',4,0,1,1,'52432',3001,2,0,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'3D Dugga','13',3,1,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'BIT Dugga','14',3,2,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Boxmodell','15',3,3,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Clipping Maskin Dugga','16',3,4,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Color Dugga','17',3,5,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Contribution','18',3,6,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Curve Dugga','19',3,7,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Daily Minutes','20',3,8,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Diagram Dugga','21',3,9,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Dugga 1','22',3,10,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Dugga 2','23',3,11,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Dugga 3','24',3,12,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Dugga 4','25',3,13,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Dugga 5','26',3,14,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Dugga 6','27',3,15,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Feedback Dugga','28',3,16,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Generic Dugga File Receive','29',3,17,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Group Assignment','30',3,18,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'HTML CSS Dugga','31',3,19,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'HTML CSS Dugga Light','32',3,20,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Kryss','33',3,21,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Placeholder Dugga','34',3,22,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Shapes Dugga','35',3,23,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'Transforms Dugga','36',3,24,1,1,'52432',3001,2,1,0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,moment,gradesystem,highscoremode,rowcolor) VALUES (3001,2,'XMLAPI Report','37',3,25,1,1,'52432',3001,2,1,0);