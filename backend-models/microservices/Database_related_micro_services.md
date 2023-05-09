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

 <br>
  <br>
   <br>
    <br>



---
---
## ==user==
---
---
<br>

### selectFromUser --only used by logging--
Gathers information from the table __user__. parameters used 
#### different querys paramaters and retrived information 
- uid : username 






### insertIntoTableUser --only used by addUser--
Performes inserts into the table __user__, Parameters used: 
- username
- saveemail
- firstname
- lastname
- ssn
- rnd  (uses the function standardPasswordHash to create a random password)
- className

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
---
## ==user_course==
---
---
<br>

### insertIntoTableUserCourese  --only used by addClass--

Performes an insert into the table __user_course__. Parameters needed:
- uid
- cid
- coursevers : This parameter is used for vers, avers and bvers
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
---
## ==class==
---
---
<br>

### insertIntoTableClass --only used by addClass--
Creates new class. Makes inserts into the table __class__.
Parameters added: 
- class
- responsible
- classname
- regcode
- classcode
- hp
- tempo
- hpProgress

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
---
## ==codeexample==
---
---
<br>

### selectFromCodeexample
Gathers information from the table __codeexample__.

#### different querys paramaters and retrived information
- exampleId : exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public

<br>

---
<br>


### deleteFromCodeexample --only used by deliteExample--

Removes row from table __codeexample__. Parameters needed:
- exampleid

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

#### editCodeExample
__EDITEXAMPLE__
- runlink
- examplename
- sectionname

__EDITEXAMPLE: beforeid!__
- beforeid

__EDITEXAMPLE: afterid!__
- afterid


 <br>
  <br>
   <br>
    <br>







---
---
## ==box==
---
---
<br>

### selectFromBox           --MIGHT ONLY BE USED HERE-- if so add it to settingCodeexampleTemplate
Gathers information from the table __box__.

#### different querys paramaters and retrived information 
- boxid AND exampleid : * 
<br>

---

<br>

### insertIntoTableBox             --MIGHT ONLY BE USED HERE-- if so add it to settingCodeexampleTemplate
Performes an insert into the table __box__. Parameters needed:
pre-set values are inserted in the original service.
- boxtitle: Title
- settings: [viktig=1]
- fontsize: 9
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
---
## ==impwordlist==
---
---
<br>


### insertIntoImpwordlist --only used by settingCodeexampleTemplate-- 
Performes an insert into the table __impwordlist__. Parameters needed:

#### EDITEXAMPLE
- exampleid
- word
- uid

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
---
## ==improw==
---
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

### insertIntoImprow --only used by settingCodeexampleTemplate-- 
Performes an insert into the table __impwordlist__. Parameters needed:

#### EDITEXAMPLE
- boxid
- exampleid
- istart
- iend
- uid






<br>
 <br>
  <br>
   <br>



---
---
## ==listentries==
---
---
<br>

### deliteFromListentries  --only used by deliteExample--
Removes row from table __impwordlist__. Parameters needed:
#### deliteExample
- lid

<br>

---

<br>
 <br>
  <br>
   <br>









---
## ==course== 
---
<br>
<br>


### selectFromCourse  --only used by createNewCourse--
Gathers information from the table __course__.

#### different querys paramaters and retrived information 
- no parameters : cid (orderd by cid, in DESC order, limeted to 1) 
<br>

---



---
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

#### createNewVersionOfCourse
- vers

#### updateCourseversion
#### changeActiveCourseVersion
 
- activeversion

<br>

---

<br>

<br>
 <br>
  <br> 
   <br>









---
## ==vers==
---
<br>
<br>


### insertIntoVers --only used by createNewVersionOfCourse-- 
Performes an insert into the table __vers__. Parameters needed:

#### createNewVersionOfCourse
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



### updateTableCourse  -- used by updateCourseversion--
Updates values in the table __vers__. Columns that are updated: 

#### updateCourseversion
- versname


<br>

---

