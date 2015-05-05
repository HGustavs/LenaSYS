
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
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'PHP Example 2',"PHP Startup","PHP_Ex2.php",1,2013,'2','1',1,2);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'PHP Example 3',"PHP Variables","PHP_Ex3.php",1,2013,'2','1',1,3);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'JavaScript Example 1',"Events, DOM access and console.log","JavaScript_Ex1.html",1,2013,'2','1',3,4);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'JavaScript Example 2',"Adding and removing elements in the DOM","JavaScript_Ex2.html",1,2013,'2','1',4,5);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'JavaScript Example 3',"Validating form data","JavaScript_Ex3.html",1,2013,'2','1',3,6);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 1',"Basic canvas graphics","HTML_Ex1.html",1,2013,'2','1',6,7);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 2',"Canvas Gradients and Transformations","HTML_Ex2.html",1,2013,'2','1',2,8);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 3',"Animation and drawing images","HTML_Ex3.html",1,2013,'2','1',2,9);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 4',"Shadows","HTML_Ex4.html",1,2013,'2','1',2,10);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 5',"Reading mouse coordinates","HTML_Ex5.html",1,2013,'2','1',1,11);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 6',"2D Tile Map and Mouse Coordinates","HTML_Ex6.html",1,2013,'2','1',1,12);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 7',"Isometric Tile Map and Mouse Coordinates","HTML_Ex7.html",1,2013,'2','1',1,13);
INSERT INTO codeexample(cid,sectionname,examplename,runlink,uid,cversion,afterid,beforeid,templateid,exampleid) values (1,'HTML5 Example 8',"Cookies","HTML_Ex8.html",1,2013,'2','1',5,14);
 
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
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (1,2,"PHP_Ex1.php","Code","[viktig=1]",2,"PHP_Ex1.php");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,1,"Description","Document","[viktig=1]",4,"PHP_Ex2.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (2,2,"PHP_Ex2.php","Code","[viktig=1]",2,"PHP_Ex2.php");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,1,"Description","Document","[viktig=1]",4,"PHP_Ex3.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (3,2,"PHP_Ex3.php","Code","[viktig=1]",2,"PHP_Ex3.php");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,1,"Description","Document","[viktig=1]",4,"JavaScript_Ex1.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,2,"JavaScript_Ex1.html","Code","[viktig=1]",3,"JavaScript_Ex1.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (4,3,"JavaScript_Ex1.js","Code","[viktig=1]",1,"JavaScript_Ex1.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (5,1,"JavaScript_Ex2.html","Code","[viktig=1]",3,"JavaScript_Ex2.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (5,2,"JavaScript_Ex2.js","Code","[viktig=1]",1,"JavaScript_Ex2.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (5,3,"Description","Document","[viktig=1]",4,"JavaScript_Ex2.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (6,1,"Description","Document","[viktig=1]",4,"JavaScript_Ex3.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (6,2,"JavaScript_Ex3.html","Code","[viktig=1]",3,"JavaScript_Ex3.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (6,3,"JavaScript_Ex3.js","Code","[viktig=1]",1,"JavaScript_Ex3.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (7,1,"Description","Document","[viktig=1]",4,"HTML_Ex1.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (7,2,"HTML_Ex1.html","Code","[viktig=1]",3,"HTML_Ex1.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (7,3,"HTML_Ex1.css","Code","[viktig=1]",4,"HTML_Ex1.css");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (7,4,"HTML_Ex1.js","Code","[viktig=1]",1,"HTML_Ex1.js");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (8,1,"Description","Document","[viktig=1]",4,"HTML_Ex2.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (8,2,"HTML_Ex2.html","Code","[viktig=1]",3,"HTML_Ex2.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (9,1,"Description","Document","[viktig=1]",4,"HTML_Ex3.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (9,2,"HTML_Ex3.html","Code","[viktig=1]",3,"HTML_Ex3.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (10,1,"Description","Document","[viktig=1]",4,"HTML_Ex4.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (10,2,"HTML_Ex4.html","Code","[viktig=1]",3,"HTML_Ex4.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (11,1,"Description","Document","[viktig=1]",4,"HTML_Ex5.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (11,2,"HTML_Ex5.html","Code","[viktig=1]",3,"HTML_Ex5.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (12,1,"Description","Document","[viktig=1]",4,"HTML_Ex6.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (12,2,"HTML_Ex6.html","Code","[viktig=1]",3,"HTML_Ex6.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (13,1,"Description","Document","[viktig=1]",4,"HTML_Ex7.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (13,2,"HTML_Ex7.html","Code","[viktig=1]",3,"HTML_Ex7.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (14,1,"Description","Document","[viktig=1]",4,"HTML_Ex8.txt");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (14,2,"HTML_Ex8.html","Code","[viktig=1]",3,"HTML_Ex8.html");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (14,3,"HTML_Ex8.css","Code","[viktig=1]",4,"HTML_Ex8.css");
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,wordlistid,filename) VALUES (14,4,"HTML_Ex8.js","Code","[viktig=1]",1,"HTML_Ex8.js");

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
INSERT INTO impwordlist(exampleid,word,uid) values (8,"scale(",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"createLinearGradient",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"save()",1);
INSERT INTO impwordlist(exampleid,word,uid) values (8,"translate(",1);
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
