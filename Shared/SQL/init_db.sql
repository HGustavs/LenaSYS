DROP DATABASE IF EXISTS Imperious;
CREATE DATABASE Imperious;
USE Imperious;

/* Appuser contains the us 	ers of the system and the corresponding permissions*/
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

INSERT INTO user(username,password,creator,superuser) values ("Grimling","Atintegulsno",1,1);
INSERT INTO user(username,password,creator) values ("Toddler","Kong",1);


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
		exampleid			MEDIUMINT NOT NULL AUTO_INCREMENT,
		cid					INT NOT NULL,
		sectionid			MEDIUMINT NOT NULL,
		examplename			VARCHAR(64),
		wordlist			VARCHAR(64),
		runlink			  	VARCHAR(64),
		pos					INTEGER,
		cversion			INTEGER,
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT NOT NULL,
		PRIMARY KEY(exampleid),
		FOREIGN KEY (cid) REFERENCES cource (cid),
		FOREIGN KEY (sectionid) REFERENCES section (sectionid),
		FOREIGN KEY (uid) REFERENCES user (uid)
		
	
);

INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="Javascript"),"Events 1","JS","",0,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="Javascript"),"Events 2","JS","",1,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="Javascript"),"Callback 1","GLSL","Culf.html",2,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="Javascript"),"Callback 2","GLSL","Dulf.html",3,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="Javascript"),"Callback 3","GLSL","",4,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="Javascript"),"Callback 4","JS","Fulf.html",5,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="HTML5"),"Design 1","GLSL","Gulf.html",0,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="HTML5"),"Design 2","JS","Hulf.html",1,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="HTML5"),"Design 3","JS","Iulf.html",2,"Creationscript",2013);
INSERT INTO codeexample(courseid,sectionid,examplename,wordlist,runlink,pos,uid,cversion) values (1,(select sectionid from section where courseid= 1 and sectionname="HTML5"),"Design 4","JS","Julf.html",3,"Creationscript",2013);


/* boxes with information in a certain example */
CREATE TABLE box(
		boxid				INTEGER NOT NULL AUTO_INCREMENT,
		exampleid 			INTEGER NOT NULL,
		boxcontent			VARCHAR(39),
		descid				INT DEFAULT '0',
		fileid				MEDIUMINT  DEFAULT '0',					
		settings			VARCHAR(1024),
		PRIMARY KEY(boxid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
		FOREIGN KEY (descid) REFERENCES descriptionsection (descid),
		FOREIGN KEY (fileid) references filelist (fileid)
);

INSERT INTO box(exampleid,boxcontent,descid,fileid,settings) VALUES (1,"Document",1,1,"[viktig=1]");
INSERT INTO box(exampleid,boxcontent,descid,fileid,settings) VALUES (1,"Document",1,2,"[viktig=1]");
INSERT INTO box(exampleid,boxcontent,descid,fileid,settings) VALUES (1,"Document",1,3,"[viktig=1]");


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
		impid		  		MEDIUMINT NOT NULL AUTO_INCREMENT,
		exampleid 			INTEGER NOT NULL,
		istart				INTEGER,
		iend				INTEGER,
		irowdesc			VARCHAR(1024),
		updated	 			TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT NOT NULL,
		PRIMARY KEY(impid),
		FOREIGN KEY (uid) REFERENCES user (uid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid)
);
	
INSERT INTO improw(exampleid,istart,iend,uid) VALUES (3,6,8,1);
INSERT INTO improw(exampleid,istart,iend,uid) VALUES (5,15,19,1);
INSERT INTO improw(exampleid,istart,iend,uid) VALUES (7,10,12,2);


/*filelist contains a list of shortcuts to files */
CREATE TABLE filelist(
		fileid		  		MEDIUMINT NOT NULL AUTO_INCREMENT,
		exampleid			INTEGER NOT NULL,
		filename			VARCHAR(1024),
		pos					INTEGER,
		updated	 			TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT NOT NULL,
		PRIMARY KEY(fileid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
		FOREIGN KEY (uid) REFERENCES user (uid)
);
	
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (1,"js1.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (2,"js2.js",1,1);
INSERT INTO filelist(exampleid,filename,pos,uid) VALUES (3,"js3.js",1,2);


CREATE TABLE descriptionsection(
		descid		  		MEDIUMINT NOT NULL AUTO_INCREMENT,
		exampleid			INTEGER NOT NULL,
		segment				VARCHAR(64000),
		updated	 			TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INTEGER NOT NULL,
		PRIMARY KEY(descid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
		FOREIGN KEY (uid) REFERENCES user (uid)
);
	
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (1,"<b>Events 1</b>This is the first section of the description<b>More</b>This is more text",1,1);
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (2,"<b>Events 2</b>This is the seond section of the description<b>Even More</b>This is even more text",1,1);
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (3,"<b>Callback 1</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (4,"<b>Callback 2 S2</b>This is the seond section of the description<b>Even More</b>This is even more text",1,1);
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (5,"<b>Callback 3</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (6,"<b>Callback 4</b>This is the seond section of the description<b>Even More</b>This is even more text",1,2);
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (7,"<b>Design 1</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (8,"<b>Design 2</b>This is the seond section of the description<b>Even More</b>This is even more text",1,2);
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (9,"<b>Design 3</b>This is the first section of the description<b>More</b>This is more text",1,2);
INSERT INTO descriptionsection(exampleid,segment,uid) VALUES (10,"<b>Design 4</b>This is the seond section of the description<b>Even More</b>This is even more text",1,2);

/* Wordlist contains a list of keywords for a certain programming language or file type */

CREATE TABLE wordlist(
		wordid		  		MEDIUMINT NOT NULL AUTO_INCREMENT,
		wordlist			VARCHAR(64),
		word 				VARCHAR(64),
		description			VARCHAR(256),
		updated 			TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid					INT NOT NULL,
		PRIMARY KEY(wordid),
		FOREIGN KEY (uid) REFERENCES user (uid)
);

INSERT INTO wordlist(wordlist,word,uid) VALUES ("JS","for",1);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("JS","if",1);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("JS","var",1);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("JS","function",2);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("GLSL","vec3",2);
INSERT INTO wordlist(wordlist,word,uid) VALUES ("GLSL","dot",2);

/* Wordlist contains a list of important words for a certain code example */

CREATE TABLE impwordlist(
		wordid		  	MEDIUMINT NOT NULL AUTO_INCREMENT,
		exampleid		INTEGER NOT NULL,
		word 			VARCHAR(64),
		description		VARCHAR(256),
		UPDATED 		TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		uid				INTEGER NOT NULL,
		PRIMARY KEY(wordid),
		FOREIGN KEY (exampleid) REFERENCES codeexample (exampleid),
		FOREIGN KEY (uid) REFERENCES user (uid)
);

INSERT INTO impwordlist(exampleid,word,uid) values (3,"event",1);
INSERT INTO impwordlist(exampleid,word,uid) values (3,"elem",1);
INSERT INTO impwordlist(exampleid,word,uid) values (3,"pageY",2);

