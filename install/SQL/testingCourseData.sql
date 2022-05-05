/*Adds testing course to databbase*/
INSERT INTO course (cid,coursecode,coursename,created,creator,visibility,activeversion,hp) VALUES (1885,'G1337','Testing-Course',NOW(),1,1,'1337','1');
INSERT INTO vers (cid,coursecode,coursename,coursenamealt,vers,versname,startdate,enddate,motd) VALUES (1885,'G1337','Testing-Course','Course for testing codeviewer','1337','','2020-05-01 00:00:00','2020-06:30 00:00:00','Code examples shows both templateid and boxid!');
INSERT INTO coursekeys (cid,urlkey,coursename, activeversion) VALUES (1885, 'testing', 'Testing-Course', 1337); 

/*Adding headings for structure*/
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (1,1885,'JavaScript-Code:',1,1,1,1,1,'1337',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2,1885,'HTML-Code:',1,1,2,1,1,'1337',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4,1885,'SQL-CODE:',1,1,3,1,1,'1337',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5,1885,'PHP-CODE:',1,1,4,1,1,'1337',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (6,1885,'Other:',1,1,5,1,1,'1337',0);

/*Links local files to Testing-Course*/
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("HTML-TEST1.html",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("HTML-TEST2.html",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("HTML-TEST3.html",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("HTML-TEST4.html",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("SQL-TEST1.sql",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("SQL-TEST2.sql",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("JS-TEST1.js",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("JS-TEST2.js",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("PHP-TEST1.php",2,1885,0);
																											
/*HTML examples*/
/*Html Template 1*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6000,6001,1,6000);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5000,1885,'Html-test template 1',6000,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6000,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6000,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
/*Html Template 2*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6000,6002,2,6001);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5001,1885,'Html-test template 2',6001,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6001,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6001,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
/*Html Template 3*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6001,6003,3,6002);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5002,1885,'Html-test template 3',6002,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6002,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6002,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,6002,"Html-test box 3","Code","[viktig=1]",3,"HTML-TEST3.html");
/*Html Template 4*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6002,6004,4,6003);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5003,1885,'Html-test template 4',6003,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6003,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6003,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,6003,"Html-test box 3","Code","[viktig=1]",3,"HTML-TEST3.html");
/*Html Template 5*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6003,6005,5,6004);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5004,1885,'Html-test template 5',6004,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6004,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6004,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,6004,"Html-test box 3","Code","[viktig=1]",3,"HTML-TEST3.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,6004,"Html-test box 4","Code","[viktig=1]",3,"HTML-TEST4.html");
/*Html Template 6*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6004,6006,6,6005);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5005,1885,'Html-test template 6',6005,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6005,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6005,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,6005,"Html-test box 3","Code","[viktig=1]",3,"HTML-TEST3.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,6005,"Html-test box 4","Code","[viktig=1]",3,"HTML-TEST4.html");
/*Html Template 7*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6005,6007,7,6006);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5006,1885,'Html-test template 7',6006,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6006,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6006,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,6006,"Html-test box 3","Code","[viktig=1]",3,"HTML-TEST3.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,6006,"Html-test box 4","Code","[viktig=1]",3,"HTML-TEST4.html");
/*Html Template 8*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6006,6008,8,6007);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5007,1885,'Html-test template 8',6007,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6007,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6007,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,6007,"Html-test box 3","Code","[viktig=1]",3,"HTML-TEST3.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,6007,"Html-test box 4","Code","[viktig=1]",3,"HTML-TEST4.html");
/*Html Template 9*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6007,6009,9,6008);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5008,1885,'Html-test template 9',6008,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6008,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,6008,"Html-test box 2","Code","[viktig=1]",3,"HTML-TEST2.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,6008,"Html-test box 3","Code","[viktig=1]",3,"HTML-TEST3.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,6008,"Html-test box 4","Code","[viktig=1]",3,"HTML-TEST4.html");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (5,6008,"Html-test box 5","Code","[viktig=1]",3,"HTML-TEST1.html");
/*Html Template 10*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'html',"HTML-TEST1.html","HTML-TEST1.html",1,1337,6008,6000,10,6009);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (5009,1885,'Html-test template 10',6009,2,2,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,6009,"Html-test box 1","Code","[viktig=1]",3,"HTML-TEST1.html");







