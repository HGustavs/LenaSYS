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
																											








