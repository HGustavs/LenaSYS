# Potetial micro services

This document primaraly focuses on the services provided by the service-files, that does not mean that a complementary document wont be needed for functions that gather information, but we start with this.

---
## LIST OF FILES
---
- accessedservice __#finished#__
- codeviewerService __#finished#__
- contributedservice : _there is no documentation for this file_ __dont know is needed__
- contribution_loginbox_service : __dont know is needed__
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
---
## Potentaial services 
---
---
<br>
<br>

---
### logging
Uses a function in basic.php. 

---

<br>


### isSuperUser
Uses a function in Session.php. 
```
Returns superuser status of user
@param int $userId User ID of the user to look up
@return true false. True if superuser false if not
```

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





### setUserID

Checks currents sessions user ID and sets it to a variable.  

*writters personal comment, this might be to small to justify making a seperat service. 

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

---
<br>

### createNewCourse
Uses service __insertIntoCourse__ to makes _inserts_ into the table __course__.
Uses service __selectFromCourse__ to _get_ information it requires from __course__.

---

<br>

### createNewCourseVerion
Uses service __insertIntoVers__ to makes _inserts_ into the table __Vers__.
Uses the services __updateTableCourse__ to change the content of these columns:
- vers

<br>

---

<br>

### updateCourseVersion
Uses the services __updateTableVers__ to change the content of these columns:
- versname

Uses the services __updateTableCourse__ to change the content of these columns:
- activeversion

<br>

---

<br>

### changeActiveCourseVersion
Uses the services __updateTableCourse__ to change the content of these columns:
- activeversion

<br>

---

<br>


### copyCourseVersion
Uses service __insertIntoVers__ to makes _inserts_ into the table __Vers__.
<br>

Uses service __selectFromQuiz__ to _get_ information it requires from __quiz__.
Uses service __insertIntoQuiz__ to makes _inserts_ into the table __quiz__. (copys values from a row into a new insert, with new _vers_ number)
<br>

Uses service __selectFromVariant__ to _get_ information it requires from __variant__.
Uses service __insertIntoVariant__ to makes _inserts_ into the table __variant__. (copys values from a row into a new insert, with new _quizID_ number)
<br>

Uses service __selectFromCodeexample__ to _get_ information it requires from __codeexample__.
Uses service __insertIntoTableCodeexample__ to makes _inserts_ into the table __codeexample__. (copys values from a row into a new insert, with new _quizID_ number)
<br>

Uses service __selectFromBox__ to _get_ information it requires from __box__.
Uses service __insertIntoTableBox__ to makes _inserts_ into the table __box__. (copys values from a row into a new insert, with new _exampleid_ number)
<br>

Uses service __selectFromImprow__ to _get_ information it requires from __improw__.
Uses service __insertIntoTableImprow__ to makes _inserts_ into the table __improw__. (copys values from a row into a new insert, with new _exampleid_ number)
<br>

Uses service __selectFromImpwordlist__ to _get_ information it requires from __impwordlist__.
Uses service __insertIntoTableImpwordlist__ to makes _inserts_ into the table __impwordlist__. (copys values from a row into a new insert, with new _exampleid_ number)
<br>

Uses the services __updateTableListentries__ to change the content of these columns:
- moment

Uses the services __updateTableListentries__ to change the content of these columns:
- link

Uses the services __updateTableCodeexample__ to change the content of these columns:
- beforeid

Uses the services __updateTableCodeexample__ to change the content of these columns:
- afterid

Uses the services __updateTableCourse__ to change the content of these columns:
- activeversion


<br>


---


<br>


### updateCourse
Uses the services __updateTableCourse__ to change the content of these columns:
- coursename
- visibility
- coursecode
- courseGitURL

Uses service __insertIntoTableSettings__ to makes _inserts_ into the table __improw__.


### deleteCourseMaterial
Uses service __deliteFromCodexample__ to delete a row from the table __codeexample__.
Uses service __deliteFromListentries__ to delete a row from the table __listentries__.
Uses service __deliteFromQuiz__ to delete a row from the table __quiz__.
Uses service __deliteFromVers__ to delete a row from the table __vers__.
Uses service __deliteFromTableCourse__ to delete a row from the table __course__.





