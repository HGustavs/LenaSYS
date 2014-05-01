DROP DATABASE IF EXISTS Imperious;
CREATE DATABASE Imperious;
USE Imperious;

/* user contains the users of the system and related  information */
CREATE TABLE user(
		uid				INT NOT NULL AUTO_INCREMENT,
		username		VARCHAR(80) NOT NULL UNIQUE, 
		ssn				VARCHAR(20) NULL,
		password		VARCHAR(225) NOT NULL,
		lastupdated		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		newpassword		TINYINT(1) NULL,
		creator			INT NULL,
		superuser		TINYINT(1) NULL,
		PRIMARY KEY(uid)		
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO user(username,password,newpassword,creator,superuser) values ("Grimling","$2y$12$stG4CWU//NCdnbAQi.KTHO2V0UVDVi89Lx5ShDvIh/d8.J4vO8o8m",0,1,1);
INSERT INTO user(username,password,newpassword,creator) values ("Toddler","$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",0,1);
INSERT INTO user(username,password,newpassword,creator) values ("Tester", "$2y$12$IHb86c8/PFyI5fa9r8B0But7rugtGKtogyp/2X0OuB3GJl9l0iJ.q",1,1);

CREATE TABLE user_question (
	qid			INT NOT NULL AUTO_INCREMENT,
	question	TEXT,
	answer		TEXT,
	owner		INT NOT NULL,
	PRIMARY KEY(qid, owner),
	INDEX `owner_index` (owner),
	FOREIGN KEY(owner) REFERENCES user(uid)
		ON DELETE CASCADE
		ON UPDATE CASCADE
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO user_question (question, answer, owner) VALUES("What is the color of night?", "Sanguine, my brother.", 1);

/* Course contains a list of the course names for each course in the database */
CREATE TABLE course(
		cid				INT NOT NULL AUTO_INCREMENT,
		coursecode		VARCHAR(45) NULL,
		coursename		VARCHAR(80) NULL,
		created			DATETIME,
		creator			INT NOT NULL,
		updated			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, 
		PRIMARY KEY(cid),
		FOREIGN KEY (creator) REFERENCES user (uid)
) CHARACTER SET utf8 COLLATE utf8_unicode_ci;

INSERT INTO course(coursecode,coursename,created,creator) values ("DV12G","Webbprogrammering",NOW(),1);
INSERT INTO course(coursecode,coursename,created,creator) values ("DV13G","Futhark",NOW(),1);


/* User access to the application*/
CREATE TABLE user_course(
		uid				INT NOT NULL,
		cid				INT NOT NULL, 
		access			VARCHAR(10) NOT NULL,
		PRIMARY KEY(uid, cid),
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY (cid) REFERENCES course (cid)
		
);

INSERT INTO user_course(uid,cid,access) values (1,1,"W");
INSERT INTO user_course(uid,cid,access) values (2,2,"W");

/* Section contains a list of the course sections for a version of a course in the database */
/* Version of sections and examples corresponds roughly to year or semester that the course was given. */

CREATE TABLE section(
		sectionno				 MEDIUMINT NOT NULL AUTO_INCREMENT,
		coursename			 VARCHAR(64),
		sectionname			 VARCHAR(64),
		sectionpos			 INTEGER,
		kind						 INTEGER,
		ts 							 TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		cversion				 INTEGER,
		appuser					 VARCHAR(64),
		PRIMARY KEY(sectionno)		
);

INSERT INTO section(coursename,sectionname,kind,cversion,sectionpos,appuser) values ("Webbprogrammering","Code Examples",2,2013,0,"Creationscript");
INSERT INTO section(coursename,sectionname,kind,cversion,sectionpos,appuser) values ("Webbprogrammering","Javascript",1,2013,1,"Creationscript");
INSERT INTO section(coursename,sectionname,kind,cversion,sectionpos,appuser) values ("Webbprogrammering","HTML5",1,2013,2,"Creationscript");


/* Code Example contains a list of the code examples for a version of a course in the database */
/* Version of sections and examples corresponds roughly to year or semester that the course was given. */

CREATE TABLE codeexample(
		exampleno		  MEDIUMINT NOT NULL AUTO_INCREMENT,
		coursename 		VARCHAR(64),
		sectionno		  MEDIUMINT,
		examplename		VARCHAR(64),
		wordlist			VARCHAR(64),
		runlink			  VARCHAR(64),
		pos						INTEGER,
		cversion			INTEGER,
		ts 						TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser						VARCHAR(64),
		PRIMARY KEY(exampleno)		
);

INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="Javascript"),"Events 1","JS","",0,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="Javascript"),"Events 2","JS","",1,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="Javascript"),"Callback 1","GLSL","Culf.html",2,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="Javascript"),"Callback 2","GLSL","Dulf.html",3,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="Javascript"),"Callback 3","GLSL","",4,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="Javascript"),"Callback 4","JS","Fulf.html",5,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="HTML5"),"Design 1","GLSL","Gulf.html",0,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="HTML5"),"Design 2","JS","Hulf.html",1,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="HTML5"),"Design 3","JS","Iulf.html",2,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionno,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering",(select sectionno from section where coursename="Webbprogrammering" and sectionname="HTML5"),"Design 4","JS","Julf.html",3,"Creationscript",2013);


/* boxes with information in a certain example */
CREATE TABLE box(
		boxid				INTEGER NOT NULL AUTO_INCREMENT,
		exampleno 			INTEGER NOT NULL,
		boxcontent			VARCHAR(39),
		descno				INT DEFAULT '0',
		fileno				MEDIUMINT  DEFAULT '0',					
		settings			VARCHAR(1024),
		PRIMARY KEY(boxid)		
);

INSERT INTO box(exampleno,boxcontent,descno,fileno,settings) VALUES (1,"Document",1,1,"[viktig=1]");
INSERT INTO box(exampleno,boxcontent,descno,fileno,settings) VALUES (1,"Document",1,2,"[viktig=1]");
INSERT INTO box(exampleno,boxcontent,descno,fileno,settings) VALUES (1,"Document",1,3,"[viktig=1]");


/* template with information about a certain template */
CREATE TABLE template(
		templateid			INTEGER NOT NULL,
		stylesheet 			VARCHAR(39) NOT NULL,
		boxid				INTEGER NOT NULL,	
		PRIMARY KEY(templateid, stylesheet, boxid)		
);

INSERT INTO template(templateid,stylesheet,boxid) VALUES (1,"template1.css",1);
INSERT INTO template(templateid,stylesheet,boxid) VALUES (1,"template1.css",2);
INSERT INTO template(templateid,stylesheet,boxid) VALUES (1,"template1.css",3);
INSERT INTO template(templateid,stylesheet,boxid) VALUES (2,"template2.css",4);
INSERT INTO template(templateid,stylesheet,boxid) VALUES (2,"template2.css",5);


/* improw contains a list of the important rows for a certain example */

CREATE TABLE improw(
		exampleno 		INTEGER,
		istart				INTEGER,
		iend					INTEGER,
		irowdesc			VARCHAR(1024),
		ts	 					TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser				VARCHAR(64),
		impno		  MEDIUMINT NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(impno)		
);
	
INSERT INTO improw(exampleno,istart,iend,appuser) VALUES (3,6,8,"Creationscript");
INSERT INTO improw(exampleno,istart,iend,appuser) VALUES (3,15,19,"Creationscript");
INSERT INTO improw(exampleno,istart,iend,appuser) VALUES (3,10,12,"Creationscript");

CREATE TABLE filelist(
		exampleno			INTEGER,
		fileno		  	MEDIUMINT NOT NULL AUTO_INCREMENT,
		filename			VARCHAR(1024),
		pos						INTEGER,
		ts	 					TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser				VARCHAR(64),
		PRIMARY KEY(fileno)		
);
	
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (1,"js1.js",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (2,"",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (3,"",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (4,"",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (5,"",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (6,"",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (7,"",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (8,"",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (9,"",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (10,"",1,"Creationscript");


CREATE TABLE descriptionsection(
		exampleno			INTEGER,
		segment				VARCHAR(64000),
		pos						INTEGER,
		ts	 					TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser				VARCHAR(64),
		descno		  		MEDIUMINT NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(descno)		
);
/* TRIGGER IF WE WANT &nbsp; AND <br> TO BE REPLACED AUTOMATICALLY
delimiter //
CREATE TRIGGER nbsp_br_desc_check BEFORE UPDATE ON descriptionsection
FOR EACH ROW
BEGIN
     IF NEW.segment LIKE "%&nbsp;%" THEN
         SET NEW.segment = replace(NEW.segment, "&nbsp;", " ");
     END IF;
     IF NEW.segment LIKE "%<br>%" THEN
         SET NEW.segment = replace(NEW.segment, "<br>", "\n");
     END IF;
 END;//
 delimiter ;
*/	
	
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (1,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (2,"<b>Events 2</b>This is the seond section of the description<b>Even More</b>This is even more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (3,"<b>Callback 1</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (4,"<b>Callback 2 S2</b>This is the seond section of the description<b>Even More</b>This is even more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (5,"<b>Callback 3</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (6,"<b>Callback 4</b>This is the seond section of the description<b>Even More</b>This is even more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (7,"<b>Design 1</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (8,"<b>Design 2</b>This is the seond section of the description<b>Even More</b>This is even more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (9,"<b>Design 3</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (10,"<b>Design 4</b>This is the seond section of the description<b>Even More</b>This is even more text",1,"Creationscript");

/* Wordlist contains a list of keywords for a certain programming language or file type */

CREATE TABLE wordlist(
		wordno		  	MEDIUMINT NOT NULL AUTO_INCREMENT,
		wordlist			VARCHAR(64),
		word 					VARCHAR(64),
		description		VARCHAR(256),
		ts 						TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser						VARCHAR(64),
		PRIMARY KEY(wordno)				
);

INSERT INTO wordlist(wordlist,word,appuser) VALUES ("JS","for","Creationscript");
INSERT INTO wordlist(wordlist,word,appuser) VALUES ("JS","if","Creationscript");
INSERT INTO wordlist(wordlist,word,appuser) VALUES ("JS","var","Creationscript");
INSERT INTO wordlist(wordlist,word,appuser) VALUES ("JS","function","Creationscript");
INSERT INTO wordlist(wordlist,word,appuser) VALUES ("GLSL","vec3","Creationscript");
INSERT INTO wordlist(wordlist,word,appuser) VALUES ("GLSL","dot","Creationscript");

/* Wordlist contains a list of important words for a certain code example */

CREATE TABLE impwordlist(
		wordno		  	MEDIUMINT NOT NULL AUTO_INCREMENT,
		exampleno			INTEGER,
		word 					VARCHAR(64),
		description		VARCHAR(256),
		ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser						VARCHAR(64),
		PRIMARY KEY(wordno)				
);

INSERT INTO impwordlist(exampleno,word,appuser) values (3,"event","Creationscript");
INSERT INTO impwordlist(exampleno,word,appuser) values (3,"elem","Creationscript");
INSERT INTO impwordlist(exampleno,word,appuser) values (3,"pageY","Creationscript");

