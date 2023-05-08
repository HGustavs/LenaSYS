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


---





---
## ==user==
---
---

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
#### password
- password 

---









---
## ==user_course==
---
---

### insertIntoTableUserCourese  --only used by addClass--

Performes an insert into the table __user_course__. Parameters needed:
- uid
- cid
- coursevers : This parameter is used for vers, avers and bvers
---


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
--- 










---
## ==class==
---
---

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

---

### selectFromClass 
Gathers information from the table __class__. parameters used 
#### different querys paramaters and retrived information 
- className : class 

---








---
## ==codeexample==
---
---


### selectFromCodeexample
Gathers information from the table __codeexample__.

#### different querys paramaters and retrived information
- exampleId : exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public
---



### deleteFromCodeexample --only used by deliteExample--

Removes row from table __codeexample__. Parameters needed:
- exampleid

---




### updateCodeexample 

Updates values in the table __codeexample__. Columns that are updated: 
#### settingCodeexampleTemplate
__SETTEMPL__
- templateno
- exampleid
- cid
- cvers

#### editCodeExample
__EDITEXAMPLE__
- runlink
- examplename
- sectionname

__EDITEXAMPLE: beforeid!__
- beforeid

__EDITEXAMPLE: afterid!__
- afterid


---












---
## ==box==
---
---

### selectFromBox           --MIGHT ONLY BE USED HERE-- if so add it to settingCodeexampleTemplate
Gathers information from the table __box__.

#### different querys paramaters and retrived information 
- boxid AND exampleid : * 
---

### insertIntoTableBox             --MIGHT ONLY BE USED HERE-- if so add it to settingCodeexampleTemplate
Performes an insert into the table __box__. Parameters needed:
pre-set values are inserted in the original service.
- boxtitle: Title
- settings: [viktig=1]
- fontsize: 9
---

### deleteFromTableBox -- only used by deliteExample--
Removes row from table __box__. Parameters needed:
- exampleid

---

### updateTableBox 
Updates values in the table __box__. Columns that are updated: 

#### settingCodeexampleTemplate
- boxcontent
- filename
- wordlistid

#### EDITCONTENT
- boxtitle
- boxcontent
- filename
- fontsize
- wordlistid

#### editCodeBoxTitle
- boxtitle

---








---
## ==impwordlist==
---

---



### insertIntoImpwordlist --only used by settingCodeexampleTemplate-- 
Performes an insert into the table __impwordlist__. Parameters needed:

#### EDITEXAMPLE
- exampleid
- word
- uid

---




### deleteFromTableImpwordlist
Removes row from table __impwordlist__. Parameters needed:

#### EDITEXAMPLE
- exampleid
- word

#### deliteExample
- exampleid
---












---
## ==improw==
---

---
### deleteFromTableImprow
Removes row from table __improw__. Parameters needed:

### editContentOfCodeExample
- boxid
- exampleid
- istart
- iend

#### deliteExample
- exampleid

--- 



### insertIntoImprow --only used by settingCodeexampleTemplate-- 
Performes an insert into the table __impwordlist__. Parameters needed:

#### EDITEXAMPLE
- boxid
- exampleid
- istart
- iend
- uid

---










---
## ==listentries==
---
---


### deliteFromListentries  --only used by deliteExample--
Removes row from table __impwordlist__. Parameters needed:
#### deliteExample
- lid

---
