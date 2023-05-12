# Database related micro services

---
## LIST OF TABLES ACCESSED mySQL
---

---
- user
- user_course
- class
- codeexample
- box
- impwordlist
- improw
- listentries
- course
- vers
- quiz
- variant
- settings
- userAnswer
- fileLink
- score
- group
- list
- userduggafeedback
- groupdugga
- submission

 <br>
  <br>
   <br>
    <br>

---
## LIST OF TABLES ACCESSED SQLite
---

---
- gitFiles

 <br>
  <br>
   <br>
    <br>



=========================================================
---
## --------------------------------------------- ==_SQLite_== -----------------------------------------
=========================================================
---
<br>
<br>

---
## ------------------------------------------- ==gitFiles== --------------------------------------------
---
<br>

### selectFromTablegitFiles 
Gathers information from the table __gitFiles__. parameters used 
#### different querys paramaters and retrived information 
- cid __AND__ fileName : downloadURL 
```sql
SELECT downloadURL FROM gitFiles WHERE cid=".$cid." AND fileName=".$file.";
```
<br>

---

<br>

 <br>
  <br>
   <br>
    <br>
    
=========================================================
---
## --------------------------------------------- ==_mySQL_== -----------------------------------------
=========================================================
---
<br>
<br>


---
## --------------------------------------------- ==user== ---------------------------------------------
---
<br>

### selectFromUser 
Gathers information from the table __user__. parameters used 
#### different querys paramaters and retrived information 
- uid : username 
- uid : password
```sql
SELECT password FROM user WHERE uid=:userid LIMIT 1;
```
<br>


### insertIntoTableUser --only used by addUser--
Performes inserts into the table __user__, Parameters used: 
- username
- email
- firstname
- lastname
- ssn
- password  (uses the function standardPasswordHash to create a random password)
- class
```sql
INSERT INTO user (username, email, firstname, lastname, ssn, password,addedtime, class) VALUES(:username,:email,:firstname,:lastname,:ssn,:password,now(),:className);
```

<br>

---

<br>

### updateTableUser 

Updates values in the table __user__ in the database, columns that are updated.
#### UpdateUserInformation:
__firstname__ 
- firstname
```sql
UPDATE user SET firstname=:firstname WHERE uid=:uid;
```
__lastname__
- lastname
```sql
UPDATE user SET lastname=:lastname WHERE uid=:uid;
```
__ssn__
- ssn
```sql
UPDATE user SET ssn=:ssn WHERE uid=:uid;
```
__username__
- username
```sql
UPDATE user SET username=:username WHERE uid=:uid;
```
__class__
- class
```sql
UPDATE user SET class=:class WHERE uid=:uid;
```
#### updateUserPassword
- password 
```sql
UPDATE user SET password=:PW WHERE uid=:userid
```
```sql
UPDATE user set password=:pwd, requestedpasswordchange=0 where uid=:uid;
```
#### changeProfileValues:
__securityquestion__ 
- securityquestion
- securityquestionanswer
```sql
UPDATE user SET securityquestion=:SQ, securityquestionanswer=:answer WHERE uid=:userid
```
<br>
 <br>
  <br>
   <br>




---

## ------------------------------------- ==user_course== ----------------------------------------
---

### selectFromTableUserCourse --USED ONLY BY getCourseGroupsAndMembers--
Gathers information from the table __user_course__. parameters used 
#### different querys paramaters and retrived information 
<br>

#### getCourseGroupsAndMembers
- cid __AND__ vers  : user.uid, user.username, user.email, user_course.groups __FROM__ user, user_course
```sql
SELECT user.uid,user.username,user.email,user_course.groups FROM user,user_course WHERE user.uid=user_course.uid AND cid=:cid AND vers=:vers
```

- uid __AND__ access=W : access
```sql
SELECT access FROM user_course WHERE uid=:userid AND access='W' LIMIT 1;
```
<br>

---

<br>

### insertIntoTableUserCourese  --only used by addClass--

Performes an insert into the table __user_course__. Parameters needed:
- uid
- cid
- coursevers : This parameter is used for :vers, :avers and :bvers
```sql
INSERT INTO user_course (uid, cid, access,vers,vershistory) VALUES(:uid, :cid,'R',:vers,'') ON DUPLICATE KEY UPDATE vers=:avers, vershistory=CONCAT(vershistory, CONCAT(:bvers,','))
```

<br>

---

<br>

### updateTableUserCourse --only used by UpdateUserAndUsercourse--

Update values in the table __user_course__, columns that are updated.
#### updateUserCourse: examiner
- examiner
```sql
UPDATE user_course SET examiner=:examiner WHERE uid=:uid AND cid=:cid;
```
#### updateUserCourse: vers
- vers
```sql
UPDATE user_course SET vers=:vers WHERE uid=:uid AND cid=:cid;
```
#### updateUserCourse: access
- access
```sql
UPDATE user_course SET access=:access WHERE uid=:uid AND cid=:cid;
```
#### updateUserCourse: group
- group
```sql
UPDATE user_course SET `groups`=:groups WHERE uid=:uid AND cid=:cid;
```


 <br>
  <br>
   <br>
    <br>




--- 
## ---------------------------------------------- ==class== -----------------------------------------
---
<br>



### selectFromClass 
Gathers information from the table __class__. parameters used 
#### different querys paramaters and retrived information 
- className : class 
```sql
SELECT class FROM class WHERE class=:clsnme;
```

<br>

---

<br>

### insertIntoTableClass --only used by addClass--
Creates new class. Makes inserts into the table __class__. Parameters added: 

#### addClass
- class
- responsible = 1 (static value)
```sql
INSERT INTO class (class, responsible) VALUES(:className,1);
```



 <br>
  <br>
   <br>
    <br>




---
## --------------------------------- ==codeexample== ---------------------------------------------
---
<br>

### selectFromTableCodeexample
Gathers information from the table __codeexample__.

#### different querys paramaters and retrived information
- exampleId : exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public
- cid AND cversion : *
```sql
SELECT * from codeexample WHERE cid=:cid AND cversion = :oldvers;
```
- no parameter : * 
```sql 
SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1
```
- exampleid: cid
```sql 
SELECT cid FROM codeexample WHERE exampleid=:exampleid;
```
- cid: runLink
```sql
SELECT runlink FROM codeexample WHERE cid=:cid;
```

<br>

---

<br>

### insertIntoTableCodeexample             
Performes an insert into the table __codeexample__. Parameters needed:

#### copyCourseVersion
- exampleid:   Copys all values from a table row where id has this value. 
- cversion: gives the new copy a new _cversion_ value.
```sql
INSERT INTO codeexample (cid,examplename,sectionname,beforeid,afterid,runlink,cversion,public,updated,uid,templateid) SELECT cid,examplename,sectionname,beforeid,afterid,runlink,:newvers as cversion,public,updated,uid,templateid from codeexample WHERE exampleid = :oldid;
```

<br>

#### createNewCodeexample
#### updateListentrie
#### createGithubCodeexample
- cid
- exampleid
- sectionname
- uid = 1 (static value)
- cversion
```sql
INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);
```


<br>

---

<br>


### deleteFromTableCodeexample 

Removes row from table __codeexample__. Parameters needed:

#### deliteExample
- exampleid
```sql
DELETE FROM codeexample WHERE exampleid=:exampleid;
```

<br>

#### deleteCourseMaterial
Where course.visibility = Delited
AND codeexample.cid = course.cid
```sql
DELETE codeexample FROM course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid;
```

<br>

---

<br>


### updateCodeexample 

Updates values in the table __codeexample__. Columns that are updated: 
<br>

#### settingCodeexampleTemplate
__SETTEMPL__
- templateno
- exampleid
- cid
- cvers
```sql
UPDATE codeexample SET templateid = :templateno WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;
```

<br>

#### editCodeExample:
__EDITEXAMPLE__
- runlink
- examplename
- sectionname
```sql
UPDATE codeexample SET runlink = :playlink , examplename = :examplename, sectionname = :sectionname WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;
```

__EDITEXAMPLE: beforeid!__
- beforeid
```sql
UPDATE codeexample SET beforeid = :beforeid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;
```
```sql
UPDATE codeexample SET beforeid=:newexample WHERE beforeid=:oldexample AND cversion=:updvers;
```

__EDITEXAMPLE: afterid!__
- afterid
```sql
UPDATE codeexample SET afterid = :afterid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;
```
```sql
UPDATE codeexample SET afterid=:newexample WHERE afterid=:oldexample AND cversion=:updvers;
```


#### copyCourseVersion: 
__beforeid__
- befordeid

__afterid__
- afterid

 <br>
  <br>
   <br>
    <br>







---
## ----------------------------------------- ==box== --------------------------------------------------
---
<br>

### selectFromBox           
Gathers information from the table __box__.

#### different querys paramaters and retrived information 
- boxid AND exampleid : *
```sql
SELECT * FROM box WHERE boxid = :i AND exampleid = :exampleid;
```
- exampleid : * 
```sql
SELECT * from box WHERE exampleid=:exampleid;
```
- exampleid : filename
```sql
SELECT filename FROM box WHERE exampleid=:exampleid;
```

<br>

---

<br>

#### deleteFileLink
Count rows where these conditions hold.
- __FROM__ fileLink, box __WHERE__ box.filename = fileLink.filename __AND__ (fileLink.kind = 2 __OR__ fileLink.kind = 3) __AND__ fileLink.fileid=:fid ;

<br>

---

<br>

### insertIntoTableBox             
Performes an insert into the table __box__. Parameters needed:

#### settingCodeexampleTemplate
pre-set values are inserted in the original service.
- boxtitle: Title
- settings: [viktig=1]
- fontsize: 9
<br>

```sql
INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid,fontsize) VALUES (:i,:exampleid, :boxtitle, :boxcontent, :settings, :filename, :wordlistid, :fontsize);
```

#### copyCourseVersion
- boxid:        Copys all values from a table row where id has this
- exampleid:    and this value.
- exampleid:    gives the new copy a new quizID value. (this must be a differet value then exampleid used for the search.)
```sql
INSERT INTO box (boxid,exampleid,boxtitle,boxcontent,filename,settings,wordlistid,segment,fontsize) SELECT boxid,:newexampleid as exampleid,boxtitle,boxcontent,filename,settings,wordlistid,segment,fontsize FROM box WHERE boxid=:oldboxid and exampleid=:oldexampleid;
```
<br>

---

<br>

### deleteFromTableBox -- only used by deliteExample--
Removes row from table __box__. Parameters needed:
- exampleid
```sql
DELETE FROM box WHERE exampleid=:exampleid;
```

<br>

---

<br>

### updateTableBox 
Updates values in the table __box__. Columns that are updated: 

#### settingCodeexampleTemplate
- boxcontent
- filename
- wordlistid
```sql
UPDATE box SET boxcontent = :boxcontent, filename = :filename, wordlistid = :wordlistid WHERE boxid = :i AND exampleid = :exampleid;
```
<br>

#### EDITCONTENT
- boxtitle
- boxcontent
- filename
- fontsize
- wordlistid
```sql
UPDATE box SET boxtitle=:boxtitle, boxcontent=:boxcontent, filename=:filename, fontsize=:fontsize, wordlistid=:wordlist WHERE boxid=:boxid AND exampleid=:exampleid;
```

<br>

#### editCodeBoxTitle
- boxtitle
```sql
UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;
```



<br>
 <br>
  <br>
   <br>




---
## --------------------------------------- ==impwordlist== --------------------------------------
---
<br>


### selectFromImpwordlist           
Gathers information from the table __impwordlist__.

#### different querys paramaters and retrived information 
- exampleid : * 
```sql
SELECT * FROM impwordlist WHERE exampleid=:oldexampleid;
```

<br>

---

<br>

### insertIntoImpwordlist  
Performes an insert into the table __impwordlist__. Parameters needed:

#### settingCodeexampleTemplate
- exampleid
- word
- uid
```sql
INSERT INTO impwordlist(exampleid,word,uid) VALUES (:exampleid,:word,:uid);
```

<br>

#### copyCourseVersion
- exampleid:    Copys all values from a table row where id has this 
- wordid:       and this value  
- exampleid: gives the new copy a new exampleid value (not the same used in the search).
```sql
INSERT INTO impwordlist (exampleid,word,label,updated,uid) SELECT :newexampleid as exampleid,word,label,updated,uid FROM impwordlist WHERE exampleid=:oldexampleid and wordid=:oldwordid;
```
<br>

---

<br>

### deleteFromTableImpwordlist
Removes row from table __impwordlist__. Parameters needed:

#### EDITEXAMPLE
- exampleid
- word
```sql
DELETE FROM impwordlist WHERE word=:word AND exampleid=:exampleid;
```

#### deliteExample
- exampleid
```sql
DELETE FROM impwordlist WHERE exampleid=:exampleid;
```


<br>
 <br>
  <br>
   <br>








---
## --------------------------------- ==improw== ------------------------------------------------
---



<br>

### selectFromImprow           
Gathers information from the table __improw__.

#### different querys paramaters and retrived information 
- exampleid : * 
```sql
SELECT * FROM improw WHERE exampleid=:oldexampleid;
```

<br>

---

<br>



### insertIntoImprow 
Performes an insert into the table __improw__. Parameters needed:

#### settingCodeexampleTemplate
- boxid
- exampleid
- istart
- iend
- uid
```sql
INSERT INTO improw(boxid,exampleid,istart,iend,uid) VALUES (:boxid,:exampleid,:istart,:iend,:uid);
```
<br>

#### copyCourseVersion
- exampleid:    Copys all values from a table row where id has this  
- impid:        this and 
- boxid:        this value.
- boxid: gives the new copy a new boxid value (not the same used in the search).
```sql
INSERT INTO improw (boxid,exampleid,istart,iend,irowdesc,updated,uid) SELECT boxid,:newexampleid as exampleid,istart,iend,irowdesc,updated,uid FROM improw WHERE exampleid=:oldexampleid and impid=:oldimpid and boxid=:oldboxid;
```
<br>

---

<br>

### deleteFromTableImprow
Removes row from table __improw__. Parameters needed:

### editContentOfCodeExample
- boxid
- istart
- iend
- exampleid
```sql
DELETE FROM improw WHERE boxid=:boxid AND istart=:istart AND iend=:iend AND exampleid=:exampleid;
```

#### deliteExample
- exampleid
```sql
DELETE FROM improw WHERE exampleid=:exampleid;
```

<br>

--- 

<br>




<br>
 <br>
  <br>
   <br>



---
## -------------------------------------- ==listentries== --------------------------------------------
---
<br>


### selectFromTablelistentries  
Gathers information from the table __listentries__.

#### different querys paramaters and retrived information 
- vers : * 
```sql
SELECT * from listentries WHERE vers = :oldvers;
```
- vers __AND__ cid __AND__ lid : entryname
```sql
SELECT entryname FROM listentries WHERE vers=:cversion AND cid=:cid AND (kind=1 or kind=0 or kind=4) AND (pos < (SELECT pos FROM listentries WHERE lid=:lid)) ORDER BY pos DESC LIMIT 1;
```


- cid : pos
```sql
SELECT pos FROM listentries WHERE cid=:cid ORDER BY pos DESC;
```
- visible = 3 : *
```sql
SELECT * FROM listentries WHERE visible = '3'
```
- cid __AND__ vers __AND__ kind=3 :  entryname, kind, lid, moment
```sql
SELECT entryname, kind, lid, moment FROM listentries WHERE cid=:cid AND vers=:vers AND (kind=3)
```
- lid : entryname
```sql
SELECT entryname FROM listentries WHERE lid=:moment
```

<br>

---

<br>

### insertIntolistentries  
Performes an insert into the table __listentries__. Parameters needed:


#### copyCourseVersion
- lid:    Copys all values from a table row where id has this value.  
- vers: gives the new copy a new _vers_ value.
```sql
INSERT INTO listentries (cid,entryname,link,kind,pos,creator,ts,code_id,visible,vers,moment,gradesystem,highscoremode) SELECT cid,entryname,link,kind,pos,creator,ts,code_id,visible,:gubbe AS vers,moment,gradesystem,highscoremode from listentries WHERE lid = :olid;
```

<br>

#### createNewListentrie
#### createGithubCodeexample
- cid
- vers
- entryname
- link
- kind
- pos
- visibility
- creator 
- comment
- gradesys
- highscoremode
- groupKind
```sql
INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) 
VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind)
```

<br>

---

<br>

### deliteFromListentries 
Removes row from table __listentries__. Parameters needed:

#### deliteExample
#### deleteListentries
- lid
```sql
DELETE FROM listentries WHERE lid=:lid;
```

<br>

#### deleteCourseMaterial
Where course.visibility = Delited
AND listentries.cid = course.cid
```sql
DELETE listentries FROM course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid;
```


<br>

---

<br>

### updateTableListentries 

Updates values in the table __listentries__. Columns that are updated: 
<br>

#### copyCourseVersion: moment
- moment 
```sql
UPDATE listentries SET moment=:nyttmoment WHERE moment=:oldmoment AND vers=:updvers;
```
<br>

#### copyCourseVersion: link
- link
```sql
UPDATE listentries SET link=:newquiz WHERE link=:oldquiz AND vers=:updvers;
```
```sql
UPDATE listentries SET link=:newexample WHERE link=:oldexample AND vers=:updvers;
```
<br>

#### removeListentries   (sets value to deleted, but does not remove from database)
- visible = 3 (this is a fixed value change)
```sql
UPDATE listentries SET visible = '3' WHERE lid=:lid");
```
<br>

#### reorderListentries
- pos
- moment
```sql
UPDATE listentries set pos=:pos,moment=:moment WHERE lid=:lid;
```
<br>

#### updateListentrie
- highscoremode
- gradesystem
- moment
- entryname
- kind
- link
- visible
- comments
- groupKind
- feedbackenabled
- feedbackquestion
```sql
UPDATE listentries set highscoremode=:highscoremode, gradesystem=:gradesys, moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,comments=:comments,groupKind=:groupkind, feedbackenabled=:feedbackenabled, feedbackquestion=:feedbackquestion WHERE lid=:lid;
```
<br>

#### setVisibleListentrie
- visible (0 = Hidden, 1 = Public)
```sql
UPDATE listentries SET visible=:visible WHERE lid=:lid
```

<br>

#### updateListentriesGradesystem
- gradesystem
```sql
UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;
```


<br>
 <br>
  <br>
   <br>









---
## --------------------------------------------- ==course== -----------------------------------------
---
<br>
<br>


### selectFromCourse 
Gathers information from the table __course__.

#### different querys paramaters and retrived information 
- no parameters : cid (orderd by cid, in DESC order, limeted to 1) 
```sql
SELECT cid FROM course ORDER BY cid DESC LIMIT 1
```
- cid : activeversion
```sql
SELECT activeversion FROM course WHERE cid=:cid
```
<br>

---

<br>

### insertIntoCourse --only used by createNewCourse-- 
Performes an insert into the table __course__. Parameters needed:

#### createNewCourse
- coursecode
- coursename
- visibility = 0 (set value)
- creator
- hp = 7.5 (set value)
- courseGitURL   
```sql
INSERT INTO course (coursecode,coursename,visibility,creator, hp, courseGitURL) VALUES(:coursecode,:coursename,0,:usrid, 7.5, :courseGitURL)
```

<br>

---

<br>

### updateTableCourse 
Updates values in the table __Course__. Columns that are updated: 
<br>

#### createNewCourseVersion
#### setActiveCourseversion
- activeversion
```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid
```
<br>

#### copyCourseVersion
- coursename
- visibility
- coursecode
- courseGitURL
```sql
UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;
```

<br>

---

<br>

### deliteFromCourse  --USED ONLY BY deleteCourseMaterial--
Removes row from table __course__. Parameters needed:

#### deleteCourseMaterial: 
__visibility__
- visibility
```sql
DELETE course FROM course WHERE visibility=:deleted;
```


<br>

<br>
 <br>
  <br> 
   <br>









---
## ----------------------------------------- ==vers== -----------------------------------------
---
<br>

### selectFromTableVers
Gathers information from the table __vers__.

#### different querys paramaters and retrived information 
- cid : vers
```sql
SELECT vers FROM vers WHERE cid=:cid;
```

<br>

---

<br>


### insertIntoVers  
Performes an insert into the table __vers__. Parameters needed:

#### createNewVersionOfCourse
#### copyCourseVersion
- cid
- coursecode
- vers
- versname
- coursename
- coursenamealt
- startdate
- enddate
- motd
```sql
INSERT INTO vers(cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd) values(:cid,:coursecode,:vers,:versname,:coursename,:coursenamealt,:startdate,:enddate,:motd);
```

<br>

---

<br>


## deliteFromVers  --USED ONLY BY deleteCourseMaterial--
Removes row from table __vers__. Parameters needed:

#### deleteCourseMaterial: 
Where course.visibility = Delited
AND vers.cid = course.cid
```sql
DELETE vers FROM course,vers WHERE course.visibility=:deleted AND vers.cid = course.cid;
```

<br>

---

<br>

### updateTableCourse 
Updates values in the table __vers__. Columns that are updated: 

#### updateCourseVersion_courseed
- versname
```sql
UPDATE vers SET versname=:versname WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;
```
<br>

#### updateCourseVersion__sectioned
__MOTD__
- motd
```sql
UPDATE vers SET motd=:motd WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;
```
<br>

__Name, start/end date__
- versname
- startdate
- enddate
```sql
UPDATE vers SET versname=:versname,startdate=:startdate,enddate=:enddate WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;
```
<br>

---






<br>
 <br>
  <br>
   <br>


---
## ----------------------------------------- ==quiz== -------------------------------------------
---

<br>
<br>


### selectFromQuiz 
Gathers information from the table __quiz__.

#### different querys paramaters and retrived information 

- cid : *
- quiz.id __AND__ vid __AND__ cid:  quiz.*, variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param,l.entryname AS dugga_title
```sql
SELECT quiz.*, variant.vid AS vid,IF(useranswer is NULL,'UNK',useranswer) AS useranswer,variantanswer,param,l.entryname AS dugga_title FROM quiz LEFT JOIN variant ON quiz.id=variant.quizID LEFT JOIN userAnswer ON userAnswer.variant=variant.vid AND hash=:hash AND password=:hashpwd LEFT JOIN (select cid,link,entryname from listentries) as l ON l.cid=l.cid AND l.link=quiz.id WHERE quiz.id=:did AND vid=:variant AND l.cid=:cid LIMIT 1;
```

<br>

---

<br>

### insertIntoQuiz  
Performes an insert into the table __quiz__. Parameters needed:

#### copyCourseVersion
- id:   Copys all values from a table row where id has this value. 
- vers: gives the new copy a new vers value.
```sql
INSERT INTO quiz (cid,autograde,gradesystem,qname,quizFile,qrelease,relativedeadline,modified,creator,vers) SELECT cid,autograde,gradesystem,qname,quizFile,qrelease,relativedeadline,modified,creator,:newvers as vers from quiz WHERE id = :oldid;
```

<br>

#### createOrUpdateDugga
- cid
- creator  (this is the user id)
- vers 
- qname
- autograde
- gradesystem
- quizFile (this is the template used)
- jsondeadline
- group
- qrelease (the release date)
- deadline
- qstart (start date)
```sql
INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) VALUES (:cid,:autograde,:gradesys,:qname,:template,:release,:deadline,:uid,:coursevers,:qstart,:jsondeadline,:group)
```

<br>

---

<br>

### updateTableQuiz  
Updates values in the table __quiz__. Columns that are updated: 

#### createOrUpdateDugga
- qname
- autograde
- gradesystem
- quizFile (template)
- qstart (start date)
- deadline
- qrelease (release date)
- jsondeadline
- group
```sql
UPDATE quiz SET qname=:qname,autograde=:autograde,gradesystem=:gradesys,quizFile=:template,qstart=:qstart,deadline=:deadline,qrelease=:release,jsondeadline=:jsondeadline,`group`=:group WHERE id=:qid;
```
<br>

#### updateQuizDeadline
- deadline
- relativedeadline
```sql
UPDATE quiz SET deadline=:deadline, relativedeadline=:relativedeadline WHERE id=:link
```
<br>

#### updateListentriesGradesystem
- gradesystem
```sql
UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;
```
<br>

---

<br>

### deliteFromTableQuiz  
Removes row from table __quiz__. Parameters needed:

#### deleteCourseMaterial: 
Where course.visibility = Delited
AND quiz.cid = course.cid
```sql
DELETE quiz FROM course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid;
```
<br>

#### deleteDugga
- id 
```
DELETE FROM quiz WHERE id=:qid
```

--- 


<br>
 <br>
  <br>
   <br>









---
## ------------------------------------ ==variant== ----------------------------------------------------
---

<br>
<br>

### selectFromVariant  --only used by copyCourseVersion-- 
Gathers information from the table __variant__.

#### different querys paramaters and retrived information 
- quizID : *
```sql
SELECT * from variant WHERE quizID=:quizid;
```

<br>

---

<br>

### insertIntoVariant  
Performes an insert into the table __Variant__. Parameters needed:

#### copyCourseVersion
- vid:   Copys all values from a table row where id has this value. 
- quizID: gives the new copy a new quizID value.
```sql
INSERT INTO variant (quizID,param,variantanswer,modified,creator,disabled) SELECT :newquizid as quizID,param,variantanswer,modified,creator,disabled FROM variant WHERE vid = :oldvid;

```
<br>

#### createDuggaVariant
- quizID
- creator
- disabled
- param 
- variantanswer
```sql
INSERT INTO variant(quizID,creator,disabled,param,variantanswer) VALUES (:qid,:uid,:disabled,:param,:variantanswer)
```


<br>

---

<br>


### updateTableVariant  -- used by addDuggaVariant--
Updates values in the table __quiz__. Columns that are updated: 

#### addDuggaVariant
- disabled
- param
- variantanswer
```sql
UPDATE variant SET disabled=:disabled,param=:param,variantanswer=:variantanswer WHERE vid=:vid
```

<br>

---

<br>


### deliteFromTableVariant  -- ONLY USED BY deleteDuggaVariant-- 
Removes row from table __variant__. Parameters needed:

#### deliteExample
- vid
```sql
DELETE FROM variant WHERE vid=:vid;
```

<br>


<be>
 <be>
  <be>
   <be>









---
## ------------------------------------------- ==settings== -----------------------------------
---


<br>

### insertIntoTableSettings  --only used by createMOTD-- 
Performes an insert into the table __settings__. Parameters needed:

#### createMOTD
- mot 
- readonly
```sql
INSERT INTO settings (motd,readonly) VALUES (:motd, :readonly);
```

<br>

---

<br>





---
## --------------------------------------- ==userAnswer== -------------------------------------
---


<br>

### selectFromUserAnswer
Gathers information from the table __userAnswer__. parameters used 
#### different querys paramaters and retrived information 

#### highscoreservice
__Return 10 Highest Scores__
The query specified below selects only scores associated with users that have returned a dugga with a passing grade
- quiz
- moment
```sql
SELECT username, score FROM userAnswer, user where userAnswer.grade > 1 AND userAnswer.quiz = :did AND userAnswer.moment = :lid ORDER BY score ASC LIMIT 10;
```
__Return Specific Score__
- quiz
- moment
```sql
SELECT username, score FROM userAnswer, user where userAnswer.quiz = :did AND userAnswer.moment = :lid LIMIT 1;
```
<br>


#### getUserAnswar
- cid __AND__ vers : hash, password, submitted, timesSubmitted, timesAccessed, moment,last_Time_techer_visited
```sql
SELECT hash, password, submitted, timesSubmitted, timesAccessed, moment,last_Time_techer_visited FROM userAnswer WHERE cid=:cid AND vers=:vers
```
<br>

#### submitDugga
- hash: password,timesSubmitted,timesAccessed,grade
```sql
SELECT password,timesSubmitted,timesAccessed,grade from userAnswer WHERE hash=:hash;
```
<br>

#### loadDugga
- hash: vid,variant.variantanswer __AS__ variantanswer,useranswer,param,cid,vers,quiz 
```sql
SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash
```
- moment: vid,variant.variantanswer __AS__ variantanswer,useranswer,param,cid,vers,quiz 
```sql
SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE moment=:moment
```

<br>

---

<br>

### insertIntoTableUserAnswer  --only used by submitDugga-- 
Performes an insert into the table __userAnswer__. Parameters needed:

#### createMOTD
- cid
- quiz
- moment
- vers
- variant
- hash
- password
- timesSubmitted = 1 (preset value)
- timesAccessed = 1 (preset value)
- useranswer
```sql
INSERT INTO userAnswer(cid,quiz,moment,vers,variant,hash,password,timesSubmitted,timesAccessed,useranswer,submitted) VALUES(:cid,:did,:moment,:coursevers,:variant,:hash,:password,1,1,:useranswer,now());
```
<br>

---

<br>

### updateTableUserAnswer -- ONLY USED BY submitDugga-- 
Updates values in the table __userAnswer__. Columns that are updated: 

#### submitDugga
- useranswer
- timesSubmitted
```sql
UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timesSubmitted=timesSubmitted+1 WHERE hash=:hash AND password=:hashpwd;
```


<br>

---

<br>

### deliteFromTableUserAnswer  -- ONLY USED BY deleteDuggaVariant-- 
Removes row from table __userAnswer__. Parameters needed:

#### deliteExample
- variant
```sql
DELETE FROM userAnswer WHERE variant=:vid;
```

<br>

---

<br>

<br>
 <br> 
  <br>
   <br>





---
## ----------------------------------- ==fileLink== -----------------------------------------------
---
<br>

### selectFromFileLink   
Gathers information from the table __fileLink__.

#### different querys paramaters and retrived information 

#### deleteFileLink
Count rows where these conditions hold.
```sql
SELECT COUNT(*) counted FROM fileLink, box WHERE box.filename = fileLink.filename AND (fileLink.kind = 2 OR fileLink.kind = 3) AND fileLink.fileid=:fid ;
```

<br>

---

<br>


### updateTableFileLink  -- used by updataFileLink--
Updates values in the table __fileLink__. Columns that are updated: 

#### updataFileLink: 
There exist thee different versions of this update with the same column update, but with different _WHERE_ cases.
- filesize
```sql
UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE kind=:kindid AND filename=:filename;
```
```sql
UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE cid=:cid AND kind=:kindid AND filename=:filename;
```
```sql
UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE vers=:vers AND cid=:cid AND kind=:kindid AND filename=:filename;
```


<br>

---

<br>


### deliteFromTableFileLink  -- ONLY USED BY deleteFile-- 
Removes row from table __fileLink__. Parameters needed:

#### deliteExample
- fileid
```sql
DELETE FROM fileLink WHERE fileid=:fid
```






<br>

---
## -------------------------- ==score== -------------------------------------------------------
---

<br>
<br>


### selectFromTableScore   
Gathers information from the table __Score__.

#### highscoreservice
__Return 10 Highest Scores__
The query specified below selects only scores associated with users that have returned a dugga with a passing grade

__SELECT__ username, score __FROM__ userAnswer, user __where__ userAnswer.grade > 1 __AND__ userAnswer.quiz = _quiz_ __AND__ userAnswer.moment = _moment_ __ORDER BY__ score __ASC LIMIT__ 10;
- quiz
- moment
<br>

__Return specific score__
__SELECT__ username, score __FROM__ userAnswer, user __where__ userAnswer.quiz = _quiz_ __AND__ userAnswer.moment = _moment_ __LIMIT__ 1;
- quiz
- moment









<br>

---
## -------------------------- ==group== -------------------------------------------------------
---

<br>
<br>

### selectFromTableGroup  --only used by getGroupValues-- 
Gathers information from the table __group__.

#### different querys paramaters and retrived information 
- no parameters : groupKind, groupVal
```sql
SELECT groupKind,groupVal FROM `groups`
```









<br>

---
## -------------------------- ==list== -------------------------------------------------------
---

<br>
<br>

### insertIntoTableList  --only used by updateListentrie-- 
Performes an insert into the table __list__. Parameters needed:

#### updateListentrie
- listnr = 23415 (this is preset in the code)
- lid
- responsible =  Christina Sjogren (this is preset in the code)
- cid
```sql
INSERT INTO list(listnr,listeriesid,responsible,course) values('23415',:lid,'Christina Sjogren',:cid);
```






<br>

---
## -------------------------- ==userduggafeedback== -------------------------------------------------------
---

<br>
<br>

### selectFromTableuserduggafeedback  
Gathers information from the table __userduggafeedback__.

#### different querys paramaters and retrived information 
- lid __AND__ cid : *
```sql
SELECT * FROM userduggafeedback WHERE lid=:lid AND cid=:cid
```
- lid __AND__ cid : avrage score
```sql
SELECT AVG(score) FROM userduggafeedback WHERE lid=:lid AND cid=:cid"
```





<br>

---
## -------------------------- ==groupdugga== -------------------------------------------------------
---

<br>
<br>

### selectFromTableGroupdugga 
Gathers information from the table __groupdugga__.

#### different querys paramaters and retrived information 
- hash : active_users
```sql
SELECT active_users FROM groupdugga WHERE hash=:hash
```

<br>

---

<br>

### insertIntoTableGroupdugga  --only used by updateActiveUsers-- 
Performes an insert into the table __groupdugga__. Parameters needed:

#### updateActiveUsers
- hash 
- active_users

```sql
INSERT INTO groupdugga(hash,active_users) VALUES(:hash,:AUtoken);
```

<br>

---

<br>

### updateTableGroupdugga  -- used by updateActiveUsers--
Updates values in the table __groupdugga__. Columns that are updated: 

#### updateActiveUsers
- active_users
```sql
UPDATE groupdugga SET active_users=:AUtoken WHERE hash=:hash;
```






<br>

---
## -------------------------- ==submission== -------------------------------------------------------
---

<br>
<br>

## selectFromTableSubmission 
Gathers information from the table __submission__.

#### different querys paramaters and retrived information
#### processDuggaFile 
- hash : subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash
```sql
SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE hash=:hash ORDER BY subid,fieldnme,updtime asc;
```
- segment : subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash
```sql
SELECT subid,vers,did,fieldnme,filename,extension,mime,updtime,kind,filepath,seq,segment,hash from submission WHERE segment=:moment ORDER BY subid,fieldnme,updtime asc;
```