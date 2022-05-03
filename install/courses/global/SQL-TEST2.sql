INSERT INTO course (cid,coursecode,coursename,created,creator,visibility,activeversion,hp) VALUES (1885,'G1337','Testing-Course',NOW(),1,1,'45656','1');
INSERT INTO coursekeys (cid,urlkey,coursename, activeversion) VALUES (1885, 'testing', 'Testing-Course', 45656); 

INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (1,1885,'HTML-Code:',1,1,1,1,1,'45656',0);

INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (6,1885,'JavaScript-Code:',1,1,6,1,1,'45656',0);

INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (11,1885,'PHP-Code:',1,1,11,1,1,'45656',0);

INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (16,1885,'Tests:',3,1,16,1,1,'45656',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (17,1885,'ExampleTest',5,3,17,1,1,'45656',0);

INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (18,1885,'Group Activities:',7,1,18,1,1,'45656',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (19,1885,'ExampleActivity',4,6,19,1,1,'45656',0);
																												

INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (20,1885,'Links:',4,1,20,1,1,'45656',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (21,1885,'Example link',4,5,21,1,1,'45656',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (22,1885,'Other:',5,1,22,1,1,'45656',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (23,1885,'TEST MESSAGE!!',5,7,23,1,1,'45656',0);
INSERT INTO listentries (lid,cid,entryname,link,kind,pos,creator,visible,vers,rowcolor) VALUES (24,1885,'Moment Test',5,4,24,1,1,'45656',0);

INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("HTML-TEST1.html",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("HTML-TEST2.html",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("HTML-TEST3.html",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("HTML-TEST4.html",2,1885,0);
INSERT INTO fileLink (filename,kind,cid,isGlobal) VALUES ("SQL-TEST1.sql",2,1885,0);

