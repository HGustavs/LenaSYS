
/* use script like this to insert testdata. Do not have inserts in the script to create the database..*/

use imperius;

/*codeviewver test data */

INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Basic HTML", "../CodeViewer/EditorV30.php?exampleid=1&courseid=1", 2, 2, 1, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Basic CSS", "../CodeViewer/EditorV30.php?exampleid=2&courseid=1", 2, 3, 2, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Basic JS", "../CodeViewer/EditorV30.php?exampleid=3&courseid=1", 2, 4, 3, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, creator, visible) VALUES(1, "Avancerade Kodexempel", NULL, 1, 5, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Advanced HTML", "../CodeViewer/EditorV30.php?exampleid=4&courseid=1", 2, 6, 4, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Advanced CSS", "../CodeViewer/EditorV30.php?exampleid=5&courseid=1", 2, 7, 5, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Advanced JS", "../CodeViewer/EditorV30.php?exampleid=6&courseid=1", 2, 8, 6, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, creator, visible) VALUES(1, "Expert Kodexempel", NULL, 1, 9, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Expert HTML", "../CodeViewer/EditorV30.php?exampleid=7&courseid=1", 2, 10, 7, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Expert CSS", "../CodeViewer/EditorV30.php?exampleid=8&courseid=1", 2, 11, 8, 1, 1);
INSERT INTO listentries (cid, entryname, link, kind, pos, code_id, creator, visible) VALUES(1, "Expert JS", "../CodeViewer/EditorV30.php?exampleid=9&courseid=1", 2, 12, 9, 1, 1);


/* more testdata in vers*/ 

insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","8212","HT 2012");
insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","8111","HT 2013");
insert into vers (cid,coursecode,coursename,coursenamealt,vers,versname) values(1,"DA551G","Distribuerade system","","7844","HT 2014");

/* testdata for codeviewer */

INSERT INTO template(templateid, stylesheet, numbox) VALUES (0, "template0.css",0);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (1,"template1.css",2);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (2,"template2.css",2);
INSERT INTO template(templateid,stylesheet,numbox) VALUES (3,"template3.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (4,"template4.css",3);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (5,"template5.css",4);
INSERT INTO template(templateid,stylesheet, numbox) VALUES (6,"template6.css",4);

/*  codeexamples*/

INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,exampleid) values (1,'Example1',"Events 1","",1,2013,'2','1',1);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,exampleid) values (1,'Example2',"Events 1","",1,2013,'3','1',2);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,exampleid) values (1,'Example3',"Events 2","",1,2013,'4','2',3);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,exampleid) values (1,'Example4',"Callback 1","Culf.html",1,2013,'5','3',4);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid,exampleid) values (1,'Example5',"Callback 2","Dulf.html",1,2013,1,'6','4',5);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid,exampleid) values (1,'Example6',"Callback 3","",2,2013,1,'7','5',6);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid,exampleid) values (1,'Example7',"Callback 4","Fulf.html",2,2013,1,'8','6',7);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid,exampleid) values (1,'Example8',"Design 1","Gulf.html",2,2013,1,'9','7',8);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,exampleid) values (1,'Example9',"Design 2","Hulf.html",2,2013,'10','8',9);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid,exampleid) values (1,'Example10',"Design 3","Iulf.html",1,2013,5,'11','9',10);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,exampleid) values (1,'Example11',"Design 4","Julf.html",1,2013,'12','10',11);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid,exampleid) values (1,'Example12',"HTML","html1.html",2,2013,1,2,1,12);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid,exampleid) values (1,'Example13',"HTML","html2.html",2,2013,1,13,11,13);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,templateid,afterid,beforeid,exampleid) values (1,'Example14',"Javascript","popup.html",2,2013,1,14,13,14);
 
/* codeexample importantwordlists */
 
INSERT INTO wordlist(wordlistname,uid) VALUES ("JS",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("PHP",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("HTML",1);
INSERT INTO wordlist(wordlistname,uid) VALUES ("Plain Text",1);
 
/* codeexample important words*/

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

/* codeviewer boxes */

INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename) VALUES (1,1,"Title","Code","[viktig=1]","js1.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,segment) VALUES (2,1,"Title","Document","[viktig=1]","<b>Events 1</b>This is the first section of the description<b>More</b>This is more text");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid) VALUES (1,12,"TitleA","Code","[viktig=1]","html1.html",1);
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,segment,wordlistid,filename) VALUES (2,12,"TitleB","Document","[viktig=1]",'<b>HTML Helloworld</b>',1,null);
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid)VALUES (1,13,"Code","Code","[viktig=1]","html2.html",1);
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,segment,wordlistid) VALUES (2,13,"Description","Document","[viktig=1]","Styling HTML with CSS",1);
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid)VALUES (1,14,"Code","Code","[viktig=1]","popup.html",1);
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,segment,wordlistid) VALUES (2,14,"Description","Document","[viktig=1]","Popup example for javascript..",1);
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename) VALUES (4,10,"Title","Code","[viktig=1]","js0 copy 2.js");

/* codeviewer */
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (1,1,3,5,1);
INSERT INTO improw(exampleid,boxid,istart,iend,uid) VALUES (1,1,8,11,1);

INSERT INTO impwordlist(exampleid,word,uid) values (3,"event",1);
INSERT INTO impwordlist(exampleid,word,uid) values (3,"elem",1);
INSERT INTO impwordlist(exampleid,word,uid) values (3,"pageY",2);
