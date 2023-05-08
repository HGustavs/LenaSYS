# Potetial micro services

This document primaraly focuses on the services provided by the service-files, that does not mean that a complementary document wont be needed for functions that gather information, but we start with this.

---
## LIST OF FILES
---
- accessedservice __#finished#__
- codeviewerService
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

### updateCodeexample --MIGHT ONLY BE USED HERE-- if so add it to settingCodeexampleTemplate

Updates values in the table __codeexample__. Columns that are updated: 
- templateno
- exampleid
- cid
- cvers
---

### selectFromBox           --MIGHT ONLY BE USED HERE-- if so add it to settingCodeexampleTemplate
Gathers information from the table __box__.

#### different querys paramaters and retrived information 
- boxid AND exampleid : * 
---

### insertTableBox             --MIGHT ONLY BE USED HERE-- if so add it to settingCodeexampleTemplate
Performes an insert into the table __box__. Parameters needed:
pre-set values are inserted in the original service.
- boxtitle: Title
- settings: [viktig=1]
- fontsize: 9
---

### updateTableBox --MIGHT ONLY BE USED HERE-- if so add it to settingCodeexampleTemplate
Updates values in the table __box__. Columns that are updated: 
- boxcontent
- filename
- wordlistid
---

### settingCodeexampleTemplate
Updates the template for the code boxes in LenaSYS.

Uses service __updateCodeexample__ to set templateid recived from input, that value is also placed in the variable __templateNumber__. 
The number of boxes created depends on on the value of _templateNumber_. 
The contents of all boxes are gatherd with the service __selectFromBox__.
Depending on if a box with the set id exists or not an insert into the table __box__, using service __insertTableBox__, or an update, using __updateTableBox__, is performed. 