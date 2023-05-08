# Potetial micro services

This document primaraly focuses on the services provided by the service-files, that does not mean that a complementary document wont be needed for functions that gather information, but we start with this.

---
## LIST OF FILES
---
- accessedservice __#finished#__
- codeviewerService __#finished#__
- contributedservice : _there is no documentation for this file_
- contribution_loginbox_service
- courseedservice : __No document found manual research needed__  
- diagramservice
- duggaedservice
- fileedservice
- highscoreservice
- sectionedservice
- profileservice 
- resultedservice
- sectiondservice : __No document found manual research needed__  
- showDuggaservice


---
## Potentaial services 
---

### setUserID

Checks currents sessions user ID and sets it to a variable.  

*writters personal comment, this might be to small to justify making a seperat service. 

---

### hasAccess

This function is currently housed in session.php and might therefore not be something that should be transitioned to a micro service..

```
Check if a specified user ID has the requested access on a specified course

@param int __$userId__ User ID of the user to look up
@param int $courseId ID of the course to look up access for
@param string $access_type A single letter denoting read or write access (r and w respectively)
@return bool Returns true if the user has the requested access on the course and false if they don't.
```
---






### addUser
Performes inserts into the table __user__, Parameters used: 
- username
- saveemail
- firstname
- lastname
- ssn
- rnd  (uses the function standardPasswordHash to create a random password)
- className

---
### updateUserInformation

Updates values in the table __user__ in the database, columns that are updated.
- firstname
- lastname
- ssn
- username
- class
- password 

#### update password
updates the column _"password"_ should be conducted in a seperat method/function. 

---








### addUserToCourse

Performes an insert into the table __user_course__. Parameters needed:
- uid
- cid
- coursevers : This parameter is used for vers, avers and bvers



---
### updateUserCourse 

Update values in the table __user_course__, columns that are updated.
- examiner
- vers
- access
- group
--- 










### addClass
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
Gathers information from the table __class__.

#### different querys paramaters and retrived information 
- className : class 
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
- word
- exampleid

#### deliteExample
- exampleid
---



### deliteFromListentries  --only used by deliteExample--
Removes row from table __impwordlist__. Parameters needed:
#### deliteExample
- lid

---








### settingCodeexampleTemplate
Updates the template for the code boxes in LenaSYS.

Uses service __updateCodeexample__ to set templateid recived from input, that value is also placed in the variable __templateNumber__. 
The number of boxes created depends on on the value of _templateNumber_. 
The contents of all boxes are gatherd with the service __selectFromBox__.
Depending on if a box with the set id exists or not an insert into the table __box__, using service __insertIntoTableBox__, or an update, using __updateTableBox__, is performed. 

---





### editCodeExample
This service uses __updateCodeexample__ to update values in table __codeexample__:
- runlink
- examplename
- sectionname
- beforeid
- afterid

Aswell as __insertIntoImpwordlist__ or __deliteFromImpwordlist__ to add or remove a row in table __impwordlist__.

---



### insertIntoImprow
Performes an insert into the table __improw__. Parameters needed:
- boxid
- exampleid
- istart
- iend
- uid
---

### deleteFromTableImprow
Removes row from table __improw__. Parameters needed:

### editContentOfCodeExample
- boxid
- istart
- iend
- exampleid

#### deliteExample
- exampleid

--- 


### editContentOfCodeExample
Uses the services __updateTableBox__ to change the content of these columns:
- boxtitle
- boxcontent
- filename
- fontsize
- wordlistid

Aswell as __insertIntoImprow__ or __deleteFromTableImpwordlist__ to add or remove a row in table __improw__.


---
### editBoxTitle
Uses service __updateTableBox__ to change value of column: 
- boxtitle

---
### deliteExample
Uses service __deleteFromTableBox__ to delete a row from the table __Box__.
Uses service __deleteFromTableImprow__ to delete a row from the tabe __improw__.
Uses service __deleteFromTableImpwordlist__ to delete a row from the tabe __impwordlist__.
Uses service __deliteFromCodeexample__ to delete a row from the tabe __Codeexample__.
Uses service __deliteFromListentries__ to delete a row from the tabe __listentries__.