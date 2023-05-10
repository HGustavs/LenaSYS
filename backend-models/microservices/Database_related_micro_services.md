# Database related micro services

---
## LIST OF TABLES ACCESSED
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

 <br>
  <br>
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

<br>

---

<br>

### updateTableUser 

Updates values in the table __user__ in the database, columns that are updated.
#### UpdateUserInformation: firstname
- firstname
#### UpdateUserInformation: lastname
- lastname
#### UpdateUserInformation: ssn
- ssn
#### UpdateUserInformation: username
- username
#### UpdateUserInformation: class
- class
#### UpdateUserAndUsercourse: password
#### changeUserPassword
- password 

<br>
 <br>
  <br>
   <br>




---

## ------------------------------------- ==user_course== ----------------------------------------
---

### selectFromUserCourse --USED ONLY BY getCourseGroupsAndMembers--
Gathers information from the table __user_course__. parameters used 
#### different querys paramaters and retrived information 

#### getCourseGroupsAndMembers
- cid __AND__ vers  : user.uid, user.username, user.email, user_course.groups __FROM__ user, user_course

<br>

---

<br>

### insertIntoTableUserCourese  --only used by addClass--

Performes an insert into the table __user_course__. Parameters needed:
- uid
- cid
- coursevers : This parameter is used for vers, avers and bvers

<br>

---

<br>

### updateTableUserCourse --only used by UpdateUserAndUsercourse--

Update values in the table __user_course__, columns that are updated.
#### updateUserCourse: examiner
- examiner
#### updateUserCourse: vers
- vers
#### updateUserCourse: access
- access
#### updateUserCourse: group
- group


 <br>
  <br>
   <br>
    <br>




--- 
## ---------------------------------------------- ==class== -----------------------------------------
---
<br>

### insertIntoTableClass --only used by addClass--
Creates new class. Makes inserts into the table __class__. Parameters added: 

#### addClass
- class
- responsible


<br>

---

<br>

### selectFromClass 
Gathers information from the table __class__. parameters used 
#### different querys paramaters and retrived information 
- className : class 


 <br>
  <br>
   <br>
    <br>




---
## --------------------------------- ==codeexample== ---------------------------------------------
---
<br>

### selectFromCodeexample
Gathers information from the table __codeexample__.

#### different querys paramaters and retrived information
- exampleId : exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public
- cid AND cversion : *

<br>

---

<br>

### insertIntoTableCodeexample             --ONLY USED BY copyCourseVersion-- 
Performes an insert into the table __codeexample__. Parameters needed:

#### copyCourseVersion
- exampleid:   Copys all values from a table row where id has this value. 
- cversion: gives the new copy a new _cversion_ value.

<br>

---

<br>


### deleteFromTableCodeexample 

Removes row from table __codeexample__. Parameters needed:

#### deliteExample
- exampleid
<br>

#### deleteCourseMaterial
Where course.visibility = Delited
AND codeexample.cid = course.cid

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

<br>

#### editCodeExample:
__EDITEXAMPLE__
- runlink
- examplename
- sectionname

__EDITEXAMPLE: beforeid!__
- beforeid

__EDITEXAMPLE: afterid!__
- afterid


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
- exampleid : * 

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

#### copyCourseVersion
- boxid:        Copys all values from a table row where id has this
- exampleid:    and this value.
- exampleid:    gives the new copy a new quizID value. (this must be a differet value then exampleid used for the search.)

<br>

---

<br>

### deleteFromTableBox -- only used by deliteExample--
Removes row from table __box__. Parameters needed:
- exampleid

<br>

---

<br>

### updateTableBox 
Updates values in the table __box__. Columns that are updated: 

#### settingCodeexampleTemplate
- boxcontent
- filename
- wordlistid

<br>

#### EDITCONTENT
- boxtitle
- boxcontent
- filename
- fontsize
- wordlistid

<br>

#### editCodeBoxTitle
- boxtitle



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

<br>

---

<br>

### insertIntoImpwordlist  
Performes an insert into the table __impwordlist__. Parameters needed:

#### settingCodeexampleTemplate
- exampleid
- word
- uid

<br>

#### copyCourseVersion
- exampleid:    Copys all values from a table row where id has this 
- wordid:       and this value  
- exampleid: gives the new copy a new exampleid value (not the same used in the search).

<br>

---

<br>

### deleteFromTableImpwordlist
Removes row from table __impwordlist__. Parameters needed:

#### EDITEXAMPLE
- exampleid
- word

#### deliteExample
- exampleid


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
<br>

#### copyCourseVersion
- exampleid:    Copys all values from a table row where id has this  
- impid:        this and 
- boxid:        this value.
- boxid: gives the new copy a new boxid value (not the same used in the search).

<br>

---

<br>

### deleteFromTableImprow
Removes row from table __improw__. Parameters needed:

### editContentOfCodeExample
- boxid
- exampleid
- istart
- iend

#### deliteExample
- exampleid

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


### selectFromlistentries  --only used by copyCourseVersion--
Gathers information from the table __listentries__.

#### different querys paramaters and retrived information 
- vers : * 

<br>

---

<br>

### insertIntolistentries  --ONLY USED BY copyCourseVersion--
Performes an insert into the table __listentries__. Parameters needed:


#### copyCourseVersion
- lid:    Copys all values from a table row where id has this value.  
- vers: gives the new copy a new _vers_ value.

<br>

---

<br>

### deliteFromListentries 
Removes row from table __impwordlist__. Parameters needed:

#### deliteExample
- lid
<br>

#### deleteCourseMaterial
Where course.visibility = Delited
AND listentries.cid = course.cid



<br>

---

<br>

### updateTableListentries --ONLY USED BY copyCourseVersion--

Updates values in the table __listentries__. Columns that are updated: 
<br>

#### copyCourseVersion: moment
- moment 
#### copyCourseVersion: moment
- link

<br>




<br>
 <br>
  <br>
   <br>









---
## --------------------------------------------- ==course== -----------------------------------------
---
<br>
<br>


### selectFromCourse  --only used by createNewCourse--
Gathers information from the table __course__.

#### different querys paramaters and retrived information 
- no parameters : cid (orderd by cid, in DESC order, limeted to 1) 

<br>

---

<br>

### insertIntoCourse --only used by createNewCourse-- 
Performes an insert into the table __course__. Parameters needed:

#### createNewCourse
- usrid
- coursecode
- coursename
- courseGitURL   

<br>

---

<br>

### updateTableCourse 
Updates values in the table __Course__. Columns that are updated: 

#### createNewCourseVersion
- vers
<br>

#### updateCourseversion
#### changeActiveCourseVersion
#### copyCourseVersion 
- activeversion

<br>

#### copyCourseVersion
- coursename
- visibility
- coursecode
- courseGitURL

<br>

---

<br>



### deliteFromCourse  --USED ONLY BY deleteCourseMaterial--
Removes row from table __course__. Parameters needed:

#### deleteCourseMaterial: 
__codeexample__
Where course.visibility = Delited
AND codeexample.cid = course.cid
<br>

__listentries__
course.visibility = Delited
AND listentries.cid = course.cid

__quiz__ 
Where course.visibility = Delited
AND quiz.cid = course.cid

__vers__ 
Where course.visibility = Delited
AND vers.cid = course.cid

__visibility__
- visibility


<br>

<br>
 <br>
  <br> 
   <br>









---
## ----------------------------------------- ==vers== -----------------------------------------
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
- motd
- startdate
- enddate

<br>

---

<br>


## deliteFromVers  --USED ONLY BY deleteCourseMaterial--
Removes row from table __vers__. Parameters needed:

#### deleteCourseMaterial: 
Where course.visibility = Delited
AND vers.cid = course.cid

<br>

---

<br>

### updateTableCourse  -- used by updateCourseversion--
Updates values in the table __vers__. Columns that are updated: 

#### updateCourseversion
- versname


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


### selectFromQuiz  --only used by copyCourseVersion--
Gathers information from the table __quiz__.

#### different querys paramaters and retrived information 
- cid : *

<br>

---

<br>

### insertIntoQuiz  
Performes an insert into the table __quiz__. Parameters needed:

#### copyCourseVersion
- id:   Copys all values from a table row where id has this value. 
- vers: gives the new copy a new vers value.
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

<br>

---

<br>

### updateTableQuiz  -- used by createOrUpdateDugga--
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

<br>

---

<br>

### deliteFromTableQuiz  
Removes row from table __quiz__. Parameters needed:

#### deleteCourseMaterial: 
Where course.visibility = Delited
AND quiz.cid = course.cid
<br>

#### deleteDugga
- id 

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

<br>

---

<br>

### insertIntoVariant  
Performes an insert into the table __Variant__. Parameters needed:

#### copyCourseVersion
- vid:   Copys all values from a table row where id has this value. 
- quizID: gives the new copy a new quizID value.
<br>

#### createDuggaVariant
- quizID
- creator
- disabled
- param 
- variantanswer



<br>

---

<br>


### updateTableVariant  -- used by addDuggaVariant--
Updates values in the table __quiz__. Columns that are updated: 

#### addDuggaVariant
- disabled
- param
- variantanswer


<br>

---

<br>


### deliteFromTableVariant  -- ONLY USED BY deleteDuggaVariant-- 
Removes row from table __variant__. Parameters needed:

#### deliteExample
- vid

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

<br>

---

<br>





---
## --------------------------------------- ==userAnswer== -------------------------------------
---


<br>

### selectFromUserAnswer --USED ONLY BY highscoreservice--
Gathers information from the table __userAnswer__. parameters used 
#### different querys paramaters and retrived information 

#### highscoreservice
__Return 10 Highest Scores__
The query specified below selects only scores associated with users that have returned a dugga with a passing grade

__SELECT__ username, score __FROM__ userAnswer, user __where__ userAnswer.grade > 1 __AND__ userAnswer.quiz = _quiz_ __AND__ userAnswer.moment = _moment_ __ORDER BY__ score __ASC LIMIT__ 10;
- quiz
- moment


### deliteFromTableUserAswar  -- ONLY USED BY deleteDuggaVariant-- 
Removes row from table __userAnswer__. Parameters needed:

#### deliteExample
- variant

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
- __FROM__ fileLink, box __WHERE__ box.filename = fileLink.filename __AND__ (fileLink.kind = 2 __OR__ fileLink.kind = 3) __AND__ fileLink.fileid=:fid ;


<br>

---

<br>


### updateTableFileLink  -- used by updataFileLink--
Updates values in the table __fileLink__. Columns that are updated: 

#### updataFileLink: 
There exist thee different versions of this update with the same column update, but with different _WHERE_ cases.
__WHERE__ kind __AND__ filename;
__WHERE__ cid __AND__ kind __AND__ filename;
__WHERE__ vers __AND__ cid __AND__ kind __AND__ filename;
- filesize


<br>

---

<br>


### deliteFromTableFileLink  -- ONLY USED BY deleteFile-- 
Removes row from table __fileLink__. Parameters needed:

#### deliteExample
- fileid






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