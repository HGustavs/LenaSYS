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





### UpdateUserAndUsercourse
Uses service __updateTableUser__ to update one of these columns in the table __user__, at a time:
- firstname
- lastname
- ssn
- username
- class
- password 

Uses service __updateTableUser__ to update one of these columns in the table __user_course__ at a time:
- examiner
- vers
- access
- group

---






### addClass
Uses service __insertIntoClass__ to makes _inserts_ into the table __class__.

---



### changeUserPassword
Uses service __updateTableUser__ to _update_ the column "_password_" in the table __user__. 

---



### addUser
Uses service __selectFromClass__ to _get_ information it requires from __class__.
Uses service __insertIntoTableUserCourese__ to _insert_ into the table __user__.

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