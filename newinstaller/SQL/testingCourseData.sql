/*Adds testing course to databbase*/
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

/*Javascript examples*/
/*js Template 1*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7000,7001,1,7000);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4000,1885,'JS-TEST template 1',7000,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7000,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7000,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST2.js");
/*js Template 2*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7000,7002,2,7001);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4001,1885,'JS-TEST template 2',7001,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7001,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7001,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST1.js");
/*js Template 3*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7001,7003,3,7002);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4002,1885,'JS-TEST template 3',7002,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7002,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7002,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST2.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,7002,"JS-TEST box 3","Code","[viktig=1]",3,"JS-TEST1.js");
/*js Template 4*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7002,7004,4,7003);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4003,1885,'JS-TEST template 4',7003,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7003,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7003,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST2.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,7003,"JS-TEST box 3","Code","[viktig=1]",3,"JS-TEST1.js");
/*js Template 5*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7003,7005,5,7004);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4004,1885,'JS-TEST template 5',7004,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7004,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7004,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST2.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,7004,"JS-TEST box 3","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,7004,"JS-TEST box 4","Code","[viktig=1]",3,"JS-TEST2.js");
/*js Template 6*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7004,7006,6,7005);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4005,1885,'JS-TEST template 6',7005,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7005,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7005,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST2.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,7005,"JS-TEST box 3","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,7005,"JS-TEST box 4","Code","[viktig=1]",3,"JS-TEST2.js");
/*js Template 7*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7005,7007,7,7006);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4006,1885,'JS-TEST template 7',7006,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7006,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7006,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST2.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,7006,"JS-TEST box 3","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,7006,"JS-TEST box 4","Code","[viktig=1]",3,"JS-TEST2.js");
/*js Template 8*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7006,7008,8,7007);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4007,1885,'JS-TEST template 8',7007,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7007,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7007,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST2.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,7007,"JS-TEST box 3","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,7007,"JS-TEST box 4","Code","[viktig=1]",3,"JS-TEST2.js");
/*js Template 9*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7007,7009,9,7008);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4008,1885,'JS-TEST template 9',7008,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7008,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,7008,"JS-TEST box 2","Code","[viktig=1]",3,"JS-TEST2.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,7008,"JS-TEST box 3","Code","[viktig=1]",3,"JS-TEST1.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,7008,"JS-TEST box 4","Code","[viktig=1]",3,"JS-TEST2.js");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (5,7008,"JS-TEST box 5","Code","[viktig=1]",3,"JS-TEST1.js");
/*js Template 10*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'js',"JS-TEST1.js","JS-TEST1.js",1,1337,7008,7000,10,7009);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (4009,1885,'JS-TEST template 10',7009,2,1,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,7009,"JS-TEST box 1","Code","[viktig=1]",3,"JS-TEST1.js");

/*SQL-examples*/
/*SQL Template 1*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8000,8001,1,8000);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3110,1885,'SQL-TEST template 1',8000,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8000,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8000,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST2.SQL");
/*SQL Template 2*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8000,8002,2,8001);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3111,1885,'SQL-TEST template 2',8001,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8001,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8001,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST1.SQL");
/*SQL Template 3*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8001,8003,3,8002);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3112,1885,'SQL-TEST template 3',8002,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8002,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8002,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST2.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,8002,"SQL-TEST box 3","Code","[viktig=1]",3,"SQL-TEST1.SQL");
/*SQL Template 4*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8002,8004,4,8003);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3113,1885,'SQL-TEST template 4',8003,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8003,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8003,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST2.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,8003,"SQL-TEST box 3","Code","[viktig=1]",3,"SQL-TEST1.SQL");
/*SQL Template 5*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8003,8005,5,8004);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3114,1885,'SQL-TEST template 5',8004,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8004,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8004,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST2.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,8004,"SQL-TEST box 3","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,8004,"SQL-TEST box 4","Code","[viktig=1]",3,"SQL-TEST2.SQL");
/*SQL Template 6*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8004,8006,6,8005);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3115,1885,'SQL-TEST template 6',8005,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8005,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8005,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST2.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,8005,"SQL-TEST box 3","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,8005,"SQL-TEST box 4","Code","[viktig=1]",3,"SQL-TEST2.SQL");
/*SQL Template 7*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8005,8007,7,8006);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3116,1885,'SQL-TEST template 7',8006,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8006,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8006,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST2.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,8006,"SQL-TEST box 3","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,8006,"SQL-TEST box 4","Code","[viktig=1]",3,"SQL-TEST2.SQL");
/*SQL Template 8*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8006,8008,8,8007);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3117,1885,'SQL-TEST template 8',8007,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8007,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8007,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST2.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,8007,"SQL-TEST box 3","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,8007,"SQL-TEST box 4","Code","[viktig=1]",3,"SQL-TEST2.SQL");
/*SQL Template 9*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8007,8009,9,8008);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3118,1885,'SQL-TEST template 9',8008,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8008,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,8008,"SQL-TEST box 2","Code","[viktig=1]",3,"SQL-TEST2.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,8008,"SQL-TEST box 3","Code","[viktig=1]",3,"SQL-TEST1.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,8008,"SQL-TEST box 4","Code","[viktig=1]",3,"SQL-TEST2.SQL");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (5,8008,"SQL-TEST box 5","Code","[viktig=1]",3,"SQL-TEST1.SQL");
/*SQL Template 10*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'SQL',"SQL-TEST1.SQL","SQL-TEST1.SQL",1,1337,8008,8000,10,8009);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (3119,1885,'SQL-TEST template 10',8009,2,3,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,8009,"SQL-TEST box 1","Code","[viktig=1]",3,"SQL-TEST1.SQL");

/*PHP-examples*/
/*PHP Template 1*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9000,9001,1,9000);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2110,1885,'PHP-TEST template 1',9000,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9000,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9000,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 2*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9000,9002,2,9001);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2111,1885,'PHP-TEST template 2',9001,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9001,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9001,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 3*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9001,9003,3,9002);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2112,1885,'PHP-TEST template 3',9002,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9002,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9002,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,9002,"PHP-TEST box 3","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 4*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9002,9004,4,9003);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2113,1885,'PHP-TEST template 4',9003,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9003,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9003,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,9003,"PHP-TEST box 3","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 5*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9003,9005,5,9004);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2114,1885,'PHP-TEST template 5',9004,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9004,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9004,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,9004,"PHP-TEST box 3","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,9004,"PHP-TEST box 4","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 6*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9004,9006,6,9005);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2115,1885,'PHP-TEST template 6',9005,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9005,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9005,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,9005,"PHP-TEST box 3","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,9005,"PHP-TEST box 4","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 7*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9005,9007,7,9006);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2116,1885,'PHP-TEST template 7',9006,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9006,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9006,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,9006,"PHP-TEST box 3","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,9006,"PHP-TEST box 4","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 8*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9006,9008,8,9007);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2117,1885,'PHP-TEST template 8',9007,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9007,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9007,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,9007,"PHP-TEST box 3","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,9007,"PHP-TEST box 4","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 9*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9007,9009,9,9008);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2118,1885,'PHP-TEST template 9',9008,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9008,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,9008,"PHP-TEST box 2","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,9008,"PHP-TEST box 3","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,9008,"PHP-TEST box 4","Code","[viktig=1]",3,"PHP-TEST1.PHP");
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (5,9008,"PHP-TEST box 5","Code","[viktig=1]",3,"PHP-TEST1.PHP");
/*PHP Template 10*/
INSERT INTO codeexample (cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) VALUES (1885,'PHP',"PHP-TEST1.PHP","PHP-TEST1.PHP",1,1337,9008,9000,10,9009);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (2119,1885,'PHP-TEST template 10',9009,2,4,1,1,'1337',0);
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,9009,"PHP-TEST box 1","Code","[viktig=1]",3,"PHP-TEST1.PHP");