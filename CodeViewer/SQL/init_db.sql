DROP DATABASE Imperious;
CREATE DATABASE Imperious;
USE Imperious;

/* Appuser contains the users of the system and the corresponding permissions*/

CREATE TABLE appuser(
		userid			 MEDIUMINT NOT NULL AUTO_INCREMENT,
		loginname    VARCHAR(64),
		passwd			 VARCHAR(64),
		kind			   VARCHAR(1024),
		ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser						VARCHAR(64),
		PRIMARY KEY(userid)		
);

INSERT INTO appuser(loginname,passwd,kind,appuser) values ("Grimling","Atintegulsno","Webbprogrammering","Creationscript");
INSERT INTO appuser(loginname,passwd,kind,appuser) values ("Toddler","Kong","Webbprogrammering Superuser","Creationscript");

/* Course contains a list of the course names for each course in the database */

CREATE TABLE course(
		courseno				 MEDIUMINT NOT NULL AUTO_INCREMENT,
		coursename			 VARCHAR(64),
		ts TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser						VARCHAR(64),
		PRIMARY KEY(courseno)		
);

INSERT INTO course(coursename,appuser) values ("Webbprogrammering","Creationscript");
INSERT INTO course(coursename,appuser) values ("Futhark","Creationscript");

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
		sectionname		VARCHAR(64),
		examplename		VARCHAR(64),
		wordlist			VARCHAR(64),
		runlink			  VARCHAR(64),
		pos						INTEGER,
		cversion			INTEGER,
		ts 						TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser						VARCHAR(64),
		PRIMARY KEY(exampleno)		
);

INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","Javascript","Events 1","JS","",0,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","Javascript","Events 2","JS","",1,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","Javascript","Callback 1","GLSL","Culf.html",2,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","Javascript","Callback 2","GLSL","Dulf.html",3,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","Javascript","Callback 3","GLSL","",4,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","Javascript","Callback 4","JS","Fulf.html",5,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","HTML5","Design 1","GLSL","Gulf.html",0,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","HTML5","Design 2","JS","Hulf.html",1,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","HTML5","Design 3","JS","Iulf.html",2,"Creationscript",2013);
INSERT INTO codeexample(coursename,sectionname,examplename,wordlist,runlink,pos,appuser,cversion) values ("Webbprogrammering","HTML5","Design 4","JS","Julf.html",3,"Creationscript",2013);


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
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (2,"js2.js",1,"Creationscript");
INSERT INTO filelist(exampleno,filename,pos,appuser) VALUES (3,"js3.js",1,"Creationscript");

CREATE TABLE descriptionsection(
		exampleno			INTEGER,
		segment				VARCHAR(1024),
		pos						INTEGER,
		ts	 					TIMESTAMP 	DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		appuser				VARCHAR(64),
		descno		  		MEDIUMINT NOT NULL AUTO_INCREMENT,
		PRIMARY KEY(descno)		
);
	
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (3,"<b>Test Description</b>This is the first section of the description<b>More</b>This is more text",1,"Creationscript");
INSERT INTO descriptionsection(exampleno,segment,pos,appuser) VALUES (3,"<b>Test Description S2</b>This is the seond section of the description<b>Even More</b>This is even more text",2,"Creationscript");

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

