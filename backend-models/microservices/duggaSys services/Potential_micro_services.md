# POTENTIAL MICROSERVICES
This document primarily focuses on the services provided by the monolithc service files and which microservies can obtained thorugh these files. However, a complementary document may be required for functions that gather information.

# BACKGROUND
A monolithic architecture means that the application is built as a single unified codebase, which can sometimes make it difficult to scale or maintain. Microservices, on the other hand, are smaller, modular services that can operate independently yet still interact with each other. That is what we are aiming for.

# UPDATES
The naming convention for the microservices to be created was established by the group in 2023. The 2024 group found this naming convention somewhat confusing and has therefore decided that the new naming convention for microservices should be based on CRUD:

CRUD stands for the four basic operations for managing data in applications and databases: Create, Read, Update, Delete.

- Create:

    Purpose: To create or add new records in a database.
    Methods:
    In a web application or API: Use the POST request to send data to be created.
    In SQL databases: Use the 'INSERT' command to add new rows to a table.

- Read:

    Purpose: To fetch or read data from a database. This can include retrieving a specific record or a list of records based on certain criteria.
    Methods:
    In web applications or APIs: Use the GET request to request data.
    In SQL databases: Use the 'SELECT' command to retrieve data from one or more tables.

- Update:

    Purpose: To update existing records in a database with new or modified data.
    Methods:
    In web applications or APIs: Use PUT or PATCH requests to send updates.
    In SQL databases: Use the 'UPDATE' command to change data in existing rows.

- Delete:

    Purpose: To delete records from a database.
    Methods:
    In web applications or APIs: Use the DELETE request to remove data.
    In SQL databases: Use the 'DELETE' command to remove rows from a table.


---
# LIST OF ORIGINAL SERVICE FILES
---
- accessedservice.php __==finished==__
- codeviewerService.php __==finished==__
- contributedservice.php : _there is no documentation for this file_ __dont know is needed__
- contribution_loginbox_service.php : __dont know if needed__
- courseedservice.php  __==finished==__
- diagramservice.php  __WORK PAUSED in this service will continue when the service is fixed__
- duggaedservice.php __==finished==__
- fileedservice.php __==finished==__
- highscoreservice.php __==finished==__
- sectionedservice.php __==finished==__
- profileservice.php __==finished==__
- resultedservice.php __==finished==__
- showDuggaservice.php __==finished==__ 
<br>
<br>


---
# LIST OF POTENTIAL SERVICES
---

- logging_ms.php
- getUid_ms.php __==finished==__ New filename: "readUid_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- isSuperUser_ms.php
- hasAccess_ms.php
- setUserID_ms.php
- setActiveCourseversion_ms.php
- updateUserPassword_ms.php
- createNewCodeExample_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createNewListentrie_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD
- createNewVersionOfCourse_ms.php
- setAsActiveCourse_ms.php __==finished==__ New filename: "updateActiveCourse_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- UpdateUser_ms.php
- updateUsercourse_ms.php
- addClass_ms.php
- changeUserPassword_accessed_ms.php
- addUser_ms.php
- settingCodeexampleTemplate_ms.php
- editCodeExample_ms.php
- editContentOfCodeExample_ms.php
- editBoxTitle_ms.php __==finished==__ New filename: "updateBoxTitle_ms.php" according to new nameconvention based on CRUD.
- deliteExample_ms.php
- createNewCourse_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createCourseVersion_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateCourseVersion_courseed_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- changeActiveCourseVersion_courseed_ms.php __==finished==__ New filename: "updateActiveCourseVersion_courseed_ms.php" according to new nameconvention based on CRUD.
- copyCourseVersion_ms.php
- updateCourse_ms.php
- createMOTD_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- deleteCourseMaterial_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createDugga_ms.php
- UpdateDugga_ms.php
- deleteDugga_ms.php
- createDuggaVariant_ms.php
- updateDuggaVariant_ms.php
- deleteDuggaVariant_ms.php
- deleteFileLink_ms.php
- updataFileLink_ms.php
- highscoreservice_ms.php
- getGroupValues_ms.php __==finished==__ New filename: "readGroupValues_ms.php" according to new nameconvention based on CRUD.
- getCourseGroupsAndMembers_ms.php __==finished==__ New filename: "readCourseGroupsAndMembers_ms.php" according to new nameconvention based on CRUD.
- deleteListentries_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- removeListentries_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- createListentrie_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- reorderListentries_ms.php __==finished==__ New filename: "updateOrder_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- updateListentrie_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- updateListentriesTabs_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- updateQuizDeadline_ms.php
- updateListentriesGradesystem_ms.php
- updateCourseVersion_sectioned_ms.php
- changeActiveCourseVersion_sectioned_ms.php __==finished==__ New filename: "updateActiveCourseVersion_sectioned_ms.php" according to new nameconvention based on CRUD.
- setVisibleListentrie_ms.php
- getCourseVersions_ms.php
- getGitReference_ms.php
- createGithubCodeexample_ms.php
- getUserDuggaFeedback_ms.php
- getDeletedListentries_ms.php __==finished==__ New filename: "readRemovedListentries_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- changeProfileValues_ms.php
- getUserAnswar_ms.php
- updateActiveUsers_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD despite the mixed functions of the ms.
- processDuggaFile_ms.php
- submitDugga_ms.php
- loadDugga_ms.php __==finished==__ New filename: "readSubmittedDugga_ms.php" according to new nameconvention based on CRUD.
- retrieveCourseedService_ms.php __==finished==__ New filename: "readCourseedService_ms.php" according to new nameconvention based on CRUD.
- retrieveSectionedService_ms.php __==finished==__ New filename: "readSectionedService_ms.php" according to new nameconvention based on CRUD.

---
---
# Potential microservices 
---
---
<br>

---
## ----------------------------- _shared_microservices_ -----------------------------
---

<br>

### logging
Uses a function in basic.php. 

<br>

---

<br>

### readUid_ms.php
readUid_ms.php is primarily used for handling user identification and logging service events.

__Session Control:__ Checks if there is a user ID (uid) present in the current session. If an ID exists, it is used; otherwise, the user ID is set to "guest", indicating that the user is not logged in.

__Logging:__ Utilizes the information gathered to log a service event in the __serviceLogEntries__ table using the logServiceEvent function (defined in basic.php).

__Return of User ID:__ The function returns the user ID, which is either the actual user ID from the session or "guest".

__Conclusion:__ The purpose of the code is to ensure accurate identification and logging of users and their actions within the system.

<br>

---

<br>

### isSuperUser
Uses a function in Session.php. 
```
Returns superuser status of user
@param int $userId User ID of the user to look up
@return true false. True if superuser false if not
```

<br>

---

<br>

### hasAccess

This function is currently housed in session.php and might therefore not be something that should be transitioned to a micro service..

```
Check if a specified user ID has the requested access on a specified course

@param int __$userId__ User ID of the user to look up
@param int $courseId ID of the course to look up access for
@param string $access_type A single letter denoting read or write access (r and w respectively)
@return bool Returns true if the user has the requested access on the course and false if they don't.
```

<br>

---

<br>

### setUserID

Checks currents sessions user ID and sets it to a variable.  

*writters personal comment, this might be to small to justify making a seperat service. 

<br>

---

<br>

### setActiveCourseversion
__USED BY__
- updateCourseVersion__sectioned
- changeActiveCourseVersion_courseed
- updateCourseVersion_courseed
- copyCourseVersion
<br>

Uses the services __updateTableCourse__ to change the content of these columns:
- activeversion

<br>

---

<br>

### updateUserPassword
__USED BY__
- changeUserPassword_accessed
- changeProfileValues
<br>

Uses the services __updateTableUser__ to change the content of these columns:
- password

<br>

---

<br>

### createNewCodeExample_ms.php
_SELECT_ operation on the table __'user'__ to retrieve the value from the column:
- username

- The 'uid' value in the __'user'__ table matches the value bound to :uid.

```sql
SELECT username FROM user WHERE uid = :uid;
```


_SELECT_ operation on the table __'codeexample'__ to retrieve all columns:

- Retrieves all data fields from the __'codeexample'__ table for the last (most recent) entry based on the exampleid in descending order.

```sql
SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1;
```


_INSERT_ operation on the table __'codeexample'__ to create new rows with values for the columns:
- cid
- examplename
- sectionname
- uid = 1 (static value)
- cversion

```sql
INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);
```


_INSERT_ operation on the table __'listentries'__ to create new rows with values for the columns:
- cid
- vers
- entryname
- link
- kind
- pos
- visible
- creator
- comments
- gradesystem
- highscoremode
- groupKind

```sql
INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind);
```

<br>

---

<br>

### createNewListentrie_ms.php
_SELECT_ operation on the table __'user'__ to retrieve the value from the column:
- username

- The 'uid' value in the 'user' table matches the value bound to :uid.

```sql
SELECT username FROM user WHERE uid = :uid;
```


_INSERT_ operation on the table __'listentries'__ to create new rows with values for the columns:
- cid
- vers
- entryname
- link
- kind
- pos
- visible
- creator
- comments
- gradesystem
- highscoremode
- groupKind

```sql
INSERT INTO listentries (cid, vers, entryname, link, kind, pos, visible, creator, comments, gradesystem, highscoremode, groupKind) VALUES(:cid, :cvs, :entryname, :link, :kind, :pos, :visible, :usrid, :comment, :gradesys, :highscoremode, :groupkind);
```

<br>

---

<br>

### createNewVersionOfCourse
__USED BY__
- createCourseVersion
- copyCourseVersion
<br>

Uses the services __insertIntoTableVers__ to _insert_ into the table __vers__.
- cid
- coursecode
- vers
- versname
- coursename
- coursenamealt
- startdate
- enddate
- motd

<br>

---

<br>

### updateActiveCourse_ms.php
updateActiveCourse_ms.php code is designed to handle the activation of a specific course version by updating the database table __'course'__ based on user input.

_UPDATE_ operation on the table __'course'__ to modify rows where:

- The 'cid' value in the __'course'__ table matches the value bound to :cid.

Set the value for the column:
- activeversion to :vers

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid
```

<br>
<br>

---
## ----------------------------- _accessedService_ -----------------------------
---

<br>
<br>

### UpdateUser
Uses service __updateTableUser__ to update one of these columns in the table __user__, at a time:
- firstname

Uses service __updateTableUser__ to update one of these columns in the table __user__, at a time:
- lastname

Uses service __updateTableUser__ to update one of these columns in the table __user__, at a time:
- ssn

Uses service __updateTableUser__ to update one of these columns in the table __user__, at a time:
- username

Uses service __updateTableUser__ to update one of these columns in the table __user__, at a time:
- class

Uses service __updateTableUser__ to update one of these columns in the table __user__, at a time:
- password 

<br>

---

<br>

### updateUsercourse
Uses service __updateTableUser__ to update one of these columns in the table __user_course__ at a time:
- examiner

Uses service __updateTableUser__ to update one of these columns in the table __user_course__, at a time:
- vers

Uses service __updateTableUser__ to update one of these columns in the table __user_course__, at a time:
- access

Uses service __updateTableUser__ to update one of these columns in the table __user_course__, at a time:
- group

<br>

---

<br>

### addClass

Uses service __insertIntoTableClass__ to makes _inserts_ into the table __class__.

<br>

---

<br>

### changeUserPassword_accessed
Uses service __updateUserPassword__ to _update_ the column "_password_" in the table __user__. 

<br>

---

<br>

### addUser
Uses service __selectFromTableClass__ to _get_ information it requires from __class__.
Uses service __insertIntoTableclass__ to _insert_ into the table __class__.
<br>

Uses service __insertIntoTableUser__ to _insert_ into the table __user__.
Uses service __insertIntoTableUserCourse__ to _insert_ into the table __user_course__.

<br>
<br>

---
## ----------------------------- _codeviewerService_ -----------------------------
---

<br>
<br>

### settingCodeexampleTemplate
Updates the template for the code boxes in LenaSYS.

Uses service __updateTableCodeexample__ to set templateid recived from input, that value is also placed in the variable __templateNumber__. 
The number of boxes created depends on on the value of _templateNumber_. 
The contents of all boxes are gatherd with the service __selectFromTableBox__.
Depending on if a box with the set id exists or not an insert into the table __box__, using service __insertIntoTableBox__, or an update, using __updateTableBox__, is performed. 

<br>

---

<br>

### editCodeExample
This service uses __updateTableCodeexample__ to update values in table __codeexample__:
- runlink
- examplename
- sectionname
- beforeid
- afterid

Aswell as __insertIntoTableImpwordlist__ or __deliteFromTableImpwordlist__ to add or remove a row in table __impwordlist__.

<br>

---

<br>

### editContentOfCodeExample
Uses the services __updateTableBox__ to change the content of these columns:
- boxtitle
- boxcontent
- filename
- fontsize
- wordlistid

Aswell as __insertIntoTableImprow__ or __deleteFromTableImpwordlist__ to add or remove a row in table __improw__.

<br>

---

<br>

### updateBoxTitle_ms.php 
_UPDATE_ operation on the table __'box'__ to update the value of the column:
- boxtitle

```sql
UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;
```

<br>

---

<br>

### deliteExample
Uses service __deleteFromTableBox__ to delete a row from the table __Box__.
Uses service __deleteFromTableImprow__ to delete a row from the tabe __improw__.
Uses service __deleteFromTableImpwordlist__ to delete a row from the tabe __impwordlist__.
Uses service __deleteFromTableCodeexample__ to delete a row from the tabe __Codeexample__.
Uses service __deleteFromTableListentries__ to delete a row from the tabe __listentries__.

<br>
<br>

---
## ----------------------------- _courseedService_ -----------------------------
---

<br>
<br>

### createNewCourse_ms.php
_INSERT_ operation on the table __'course'__ to create new rows in the colums:
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

### createCourseVersion_ms.php
_INSERT_ operation on the table __'vers'__ to create new rows in the colums:
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

_UPDATE_ operation on the table __'course'__ to update the value of the column:
- activeversion

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid   
```

<br>

---

<br>

### updateCourseVersion_courseed_ms.php
_UPDATE_ operation on the table __'course'__ to update the value of these columns:
- coursename
- visibility
- coursecode
- courseGitURL

```sql
UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;
```

_SELECT_ operation on the table __'user'__ to get the value of the column:
- username

```sql
   SELECT username FROM user WHERE uid = :uid
```

<br>

---

<br>

### updateActiveCourseVersion_courseed_ms.php
_UPDATE_ operation on the table __'course'__ to update the value of the column:
- activeversion

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid
```

<br>

---

<br>

### copyCourseVersion
Uses service __createNewVersionOfCourse__ to makes _inserts_ into the table __Vers__.
<br>

Uses service __selectFromTableQuiz__ to _get_ information it requires from __quiz__.
Uses service __insertIntoTableQuiz__ to makes _inserts_ into the table __quiz__. (copys values from a row into a new insert, with new _vers_ number)
<br>

Uses service __selectFromTableVariant__ to _get_ information it requires from __variant__.
Uses service __insertIntoTableVariant__ to makes _inserts_ into the table __variant__. (copys values from a row into a new insert, with new _quizID_ number)
<br>

Uses service __selectFromTableCodeexample__ to _get_ information it requires from __codeexample__.
Uses service __insertIntoTableCodeexample__ to makes _inserts_ into the table __codeexample__. (copys values from a row into a new insert, with new _quizID_ number)
<br>

Uses service __selectFromTableBox__ to _get_ information it requires from __box__.
Uses service __insertIntoTableBox__ to makes _inserts_ into the table __box__. (copys values from a row into a new insert, with new _exampleid_ number)
<br>

Uses service __selectFromTableImprow__ to _get_ information it requires from __improw__.
Uses service __insertIntoTableImprow__ to makes _inserts_ into the table __improw__. (copys values from a row into a new insert, with new _exampleid_ number)
<br>

Uses service __selectFromTableImpwordlist__ to _get_ information it requires from __impwordlist__.
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

Uses the services __setAsActiveCourse__ to change the content of these columns:
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

<br>

---

<br>

### createMOTD_ms.php
_INSERT_ operation on the table __'settings'__ to create new rows in the colums:
- mot 
- readonly

```sql
INSERT INTO settings (motd,readonly) VALUES (:motd, :readonly);
```

<br>

---

<br>

### deleteCourseMaterial_ms.php
_DELETE_ operation on the table __'partresult'__ to delete rows where:

- The 'cid' value in the __'partresult'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the  __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE partresult FROM course,partresult WHERE course.visibility=:deleted AND partresult.cid = course.cid;
```


_DELETE_ operation on the table __'subparts'__ to delete rows where:

- The 'cid' value in the __'subparts'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted

```sql
DELETE subparts FROM course,subparts WHERE course.visibility=:deleted AND subparts.cid = course.cid;
```


_DELETE_ operation on the table __'improw'__ to delete rows where:

- The 'boxid' value in the __'improw'__ table matches the 'boxid' value in the __'box'__ table, and the 'exampleid' value in the __'box'__ table matches the 'exampleid' value in __'codeexample'__ table, and the 'cid' value in the __'codeexample'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE improw FROM improw,box,course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND codeexample.exampleid = box.exampleid AND box.boxid = improw.boxid;
```


_DELETE_ operation on the table __'box'__ to delete rows where:

- The 'exampleid' value in the __'box'__ table matches the 'exampleid' value in the __'codeexample'__ table, and the 'cid' value in the __'codeexample'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE box FROM box,course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND codeexample.exampleid=box.exampleid;
```


_DELETE_ operation on the table __'impwordlist'__ to delete rows where:

- The 'exampleid' value in the __'impwordlist'__ table matches the 'exampleid' value in the __'codeexample'__ table, and the 'cid' value in the __'codeexample'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE impwordlist FROM impwordlist,course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid AND codeexample.exampleid=impwordlist.exampleid;
```


_DELETE_ operation on the table __'codeexample'__ to delete rows where:

- The 'cid' value in the __'codeexample'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE codeexample FROM course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid;
```


_DELETE_ operation on the table __'user_participant'__ to delete rows where:

- The 'lid' value in the __'user_participant'__ table matches the 'lid' value in the __'listentries'__ table, and the 'cid' value in the __'listentries'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE user_participant FROM user_participant,course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid AND listentries.lid = user_participant.lid;
```


_DELETE_ operation on the table __'userAnswer'__ to delete rows where:

- The 'cid' value in the __'userAnswer'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE userAnswer FROM course,userAnswer WHERE course.visibility=:deleted AND userAnswer.cid = course.cid;
```


_DELETE_ operation on the table __'listentries'__ to delete rows where:

- The 'cid' value in the __'listentries'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE listentries FROM course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid;
```


_DELETE_ operation on the table __'timesheet'__ to delete rows where:

- The 'cid' value in the __'timesheet'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE timesheet FROM course,timesheet WHERE course.visibility=:deleted AND timesheet.cid = course.cid;
```


_DELETE_ operation on the table __'variant'__ to delete rows where:

- The 'quizID' value in the __'variant'__ table matches the 'id' value in the __'quiz'__ table, and the 'cid' value in the __'quiz'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE variant FROM variant,course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid AND quiz.id = variant.quizID;
```


_DELETE_ operation on the table __'quiz'__ to delete rows where:

- The 'cid' value in the __'quiz'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE quiz FROM course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid;
```


_DELETE_ operation on the table __'vers'__ to delete rows where:

- The 'cid' value in the __'vers'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE vers FROM course,vers WHERE course.visibility=:deleted AND vers.cid = course.cid;
```


_DELETE_ operation on the table __'fileLink'__ to delete rows where:

- The 'cid' value in the __'fileLink'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE fileLink FROM course,fileLink WHERE course.visibility=:deleted AND fileLink.cid = course.cid;
```


_DELETE_ operation on the table __'programcourse'__ to delete rows where:

- The 'cid' value in the __'programcourse'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE programcourse FROM course,programcourse WHERE course.visibility=:deleted AND programcourse.cid = course.cid;
```


_DELETE_ operation on the table __'user_course'__ to delete rows where:

- The 'cid' value in the __'user_course'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE user_course FROM course,user_course WHERE course.visibility=:deleted AND user_course.cid = course.cid
```


_DELETE_ operation on the table __'course_req'__ to delete rows where:

- The 'cid' value in the __'course_req'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE course_req FROM course,course_req WHERE course.visibility=:deleted AND course_req.cid = course.cid;
```


_DELETE_ operation on the table __'coursekeys'__ to delete rows where:

- The 'cid' value in the __'coursekeys'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE coursekeys FROM course,coursekeys WHERE course.visibility=:deleted AND coursekeys.cid = course.cid;
```


_DELETE_ operation on the table __'course'__ to delete rows where:

- The 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE course FROM course WHERE visibility=:deleted;
```

<br>

---

<br>

### readCourseedService_ms.php
_SELECT_ operation on the table __'user_course'__ to retrieve values from the column:
- cid

```sql
SELECT cid FROM user_course WHERE uid=:uid
```


_SELECT_ operation on the table __'user_course'__ to retrieve values from the columns:
- cid
- access

```sql
SELECT cid,access FROM user_course WHERE uid=:uid;
```


_DELETE_ operation on the table __'codeexample'__ to remove rows where:

- The 'cid' value in the __'codeexample'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE codeexample FROM course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid;
```


_DELETE_ operation on the table __'listentries'__ to remove rows where:

- The 'cid' value in the __'listentries'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE listentries FROM course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid;
```


_DELETE_ operation on the table __'quiz'__ to remove rows where:

- The 'cid' value in the __'quiz'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE quiz FROM course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid;
```


_DELETE_ operation on the table __'vers'__ to remove rows where:

- The 'cid' value in the __'vers'__ table matches the 'cid' value in the __'course'__ table, and the 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.

```sql
DELETE vers FROM course,vers WHERE course.visibility=:deleted AND vers.cid = course.cid;
```


_DELETE_ operation on the table __'course'__ to remove rows where:

- The 'visibility' value in the __'course'__ table is equal to the value bound to :deleted.


```sql
DELETE course FROM course WHERE visibility=:deleted;
```


_SELECT_ operation on the table __'course'__ to retrieve values from the columns:
- coursename
- coursecode
- cid
- visibility
- activeversion
- activeedversion

```sql
SELECT coursename,coursecode,cid,visibility,activeversion,activeedversion FROM course ORDER BY coursename;
```


_SELECT_ operation on the table __'vers'__ to retrieve values from the columns:
- cid
- coursecode
- vers
- versname
- coursename
- coursenamealt

```sql
SELECT cid,coursecode,vers,versname,coursename,coursenamealt FROM vers;
```


_SELECT_ operation on the table __'settings'__ to retrieve values from the columns:
- motd
- readonly
- sql

```sql
SELECT motd,readonly FROM settings;
```


<br>
<br>

---
## ----------------------------- _duggaedService_ -----------------------------
---

<br>
<br>

### createDugga
Uses service __insertIntoTableQuiz__ to makes _inserts_ into the table __quiz__. 

<br>

---

<br>

### UpdateDugga

Uses the services __updateTableQuiz__ to change the content of these columns:
- coursename
- visibility
- coursecode
- courseGitURL
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

### deleteDugga
Uses service __deliteFromTableQuiz__ to delete a row from the table __quiz__.

<br>

---

<br>

### createDuggaVariant
Uses service __insertIntoTablVariant__ to makes _inserts_ into the table __Variant__.

<br>

---

<br>

### updateDuggaVariant 
Uses the services __updateTableVariant__ to change the content of these columns:
- disabled
- param
- variantanswer

<br>

---

<br>

### deleteDuggaVariant
Uses service __deliteFromTableUserAnswer__ to delete a row from the table __userAnswer__.
Uses service __deliteFromTableVariant__ to delete a row from the table __variant__.

<br>
<br>

---
## ----------------------------- _fileedService_ -----------------------------
---

<br>
<br>

### deleteFileLink
Count rows where these conditions hold. This will indicate if the file is in used.

- __FROM__ fileLink, box __WHERE__ box.filename = fileLink.filename __AND__ (fileLink.kind = 2 __OR__ fileLink.kind = 3) __AND__ fileLink.fileid=:fid ;
<br>

If not in use, then service __deliteFromTableFileLink__ is used to delete a row from the table __fileLink__.

This service contains two seperat instanses of the above mentiond code, placed in an if and else statment. 

<br>

---

<br>

### updataFileLink
Uses the services __updateTableFileLink__ to change the content of these columns:
- filesize
There exist tree different versions of this update, with different _WHERE_ cases.
__WHERE__ kind __AND__ filename;
__WHERE__ cid __AND__ kind __AND__ filename;
__WHERE__ vers __AND__ cid __AND__ kind __AND__ filename;

<br>
<br>

---
## ----------------------------- _highscoreService_ -----------------------------
---

<br>
(writers comment: i belive this service is small enough as is)

### highscoreservice
Return max ten passed scores.
Uses service __selectFromTableScore__ to _get_ information it requires from __Score__ and __userAnswer__. 
<br>

Return score for a specific test.
Uses service __selectFromTableScore__ to _get_ information it requires from __Score__ and __userAnswer__. 

<br>
<br>

---
## ----------------------------- _sectionedService_ -----------------------------
---

<br>
<br>

### readGroupValues_ms.php
_SELECT_ operation on the table __'groups'__ to retrieve values from the columns:
- groupKind
- groupVal


```sql
SELECT groupKind,groupVal FROM groups;
```

<br>

---

<br>

### readCourseGroupsAndMembers_ms.php
_SELECT_ operation on the tables __'user'__ and __'user_course'__ to retrieve values from the columns:
- uid
- username
- firstname
- lastname
- email
- groups


```sql
SELECT user.uid,user.username,user.firstname,user.lastname,user.email,user_course.groups FROM user,user_course WHERE user.uid=user_course.uid and user_course.cid=:cid AND user_course.vers=:vers;
```

<br>

---

<br>

### deleteListentries_ms.php
Listentries are duggas, headers, tests etc. This microservice DELETES listentries from the database. Should not be confused with the microservice removeListentries (that changes to visible value of the listentrie to "hide" it. This will enable restoring deleted items).

_DELETE_ operation on the table __'useranswer'__ to remove rows where:

- The 'moment' value in the __'useranswer'__ table matches the value bound to :lid.

```sql
DELETE FROM useranswer WHERE moment=:lid
```


_DELETE_ operation on the table __'listentries'__ to remove rows where:

- The 'lid' value in the __'listentries'__ table matches the value bound to :lid.

```sql
DELETE FROM listentries WHERE lid = :lid
```

<br>

---

<br>

### removeListentries_ms.php (hides the listentrie, no delete it)
Listentries are duggas, headers, tests etc. This microservice will change the visibility of a listentry to "deleted" instead of deleting the item from the database entirely. This will enable restoring deleted items. It "hides" the listentries. Should not be confused with the microservice deleteListentries (that actually deletes the listentrie from the database). 

_UPDATE_ operation on the table __'listentries'__ to update rows where:

- The 'lid' value in the __'listentries'__ table matches the value bound to :lid.
- Set: The 'visible' value in the 'listentries' table to '3'.

<br>

---

<br>

### createListentrie_ms.php
_SELECT_ operation on the table __'settings'__ to retrieve values from the columns:
- motd
- readonly

```sql
SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1;
```


_INSERT_ operation on the table __'codeexample'__ to create new rows in the columns:
- cid
- examplename
- sectionname
- uid (set to 1)
- cversion

```sql
INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);
```


_INSERT_ operation on the table __'listentries'__ to create new rows in the columns:
- cid
- vers
- entryname
- link
- kind
- pos
- visible
- creator
- comments
- gradesystem
- highscoremode
- groupKind

```sql
INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind)
```

<br>

---

<br>

### updateOrder_ms.php
Updates the order of the listentries of a course. Not to be confused with updateListentrie_ms.php.
_UPDATE_ operation on the table __'listentries'__ to modify rows where:

- The 'lid' value in the __'listentries'__ table matches the value bound to :lid.
- Set: The 'pos' value in the __'listentries'__ table to the value bound to :pos, and the 'moment' value to the value bound to :moment.

```sql
UPDATE listentries set pos=:pos,moment=:moment WHERE lid=:lid;
```

<br>

---

<br>

### updateListentrie_ms.php
_SELECT_ operation on the table __'listentries'__ to retrieve the value from the column:
- entryname

```sql
SELECT entryname FROM listentries WHERE vers=:cversion AND cid=:cid AND (kind=1 or kind=0 or kind=4) AND (pos < (SELECT pos FROM listentries WHERE lid=:lid)) ORDER BY pos DESC LIMIT 1;
```


_INSERT_ operation on the table __'codeexample'__ to create new rows with values for the columns:
- cid
- examplename
- sectionname
- uid
- cversion

```sql
INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);
```


_UPDATE_ operation on the table __'listentries'__ to modify rows with updated values for the columns:
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

- The 'lid' value in the 'listentries' table matches the value bound to :lid

```sql
UPDATE listentries set highscoremode=:highscoremode, gradesystem=:gradesys, moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,comments=:comments,groupKind=:groupkind, feedbackenabled=:feedbackenabled, feedbackquestion=:feedbackquestion WHERE lid=:lid;
```


_INSERT_ operation on the table __'list'__ to create new rows with values for the columns:
- listnr
- listeriesid
- responsible
- course

```sql
INSERT INTO list(listnr,listeriesid,responsible,course) values('23415',:lid,'Christina Sjogren',:cid);
```

<br>

---

<br>

### updateQuizDeadline
Uses the services __updateTableQuiz__ to change the content of these columns:
- deadline
- relativedeadline

<br>

---

<br>

### updateListentriesTabs_ms.php
_UPDATE_ operation on the table __'listentries'__ to modify rows with updated values for the column:
- gradesystem

- The 'lid' value in the 'listentries' table matches the value bound to :lid.

```sql
UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;
```

<br>

---

<br>

### updateCourseVersion_sectioned
Uses the services __updateTableVers__ to change the content of these columns:
- motd

Uses the services __updateTableVers__ to change the content of these columns:
- versname
- startdate
- enddate

Uses the services __setActiveCourseVersion__ to change the content of these columns:
- activeversion

<br>

---

<br>

### updateActiveCourseVersion_sectioned_ms.php     
_UPDATE_ operation on the table __'course'__ to update the value of the column:
- activeversion

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid
```

<br>

---

<br>

### setVisibleListentrie
(writers comment: These both do the same thing, i would sugest combining them and use if cases instead.)
<br>

#### changeVisibleHidden
Uses the services __updateTableListentries__ to change the content of these columns:
- visible
#### changeVisiblePublic
Uses the services __updateTableListentries__ to change the content of these columns:
- visible

<br>

---

<br>

### getCourseVersions
Uses service __selectFromTableVers__ to _get_ information it requires from __vers__.

<br>

---

<br>

### getGitReference (this is a TEMP name, dont really know what the point of this "service" is yet )
This service creates an array containing values from the column downloadeURL in the database found here "../../githubMetadata/metadata2.db"
Uses service __selectFromTableBox__ to _get_ information it requires from __box__.
Uses service __selectFromTableCodeexample__ to _get_ information it requires from __codeexample__.
Uses service __selectFromTableGitFiles__ to _get_ information it requires from __gitFiles__.

<br>

---

<br>

### createGithubCodeexample
Uses service __selectFromTableCodeexample__ to _get_ information it requires from __codeexample__.
Uses service __selectFromTableCourse__ to _get_ information it requires from __course__.
Uses service __selectFromTableListentries__ to _get_ information it requires from __listentries__.
<br>

Uses service __createNewCodeexample__ to makes _inserts_ into the table __codeexample__.
Uses service __createNewListentrie__ to makes _inserts_ into the table __listentries__.

<br>

---

<br>

### getUserDuggaFeedback
<br>

Retrives all information
Uses service __selectFromTableUserduggafeedback__ to _get_ information it requires from __userduggafeedback__.
<br>

Retrives the average score
Uses service __selectFromTableUserduggafeedback__ to _get_ information it requires from __userduggafeedback__.

<br>

---

<br>

### readRemovedListentries_ms.php
Listentries are duggas, headers, tests etc. This microservice retrieves all removed (but not deleted) listentries from the database. This microservice is close related to the removeListentries_ms.php that changes the visibility of a listentry to "deleted" (3) instead of deleting the item from the database entirely. This will enable restoring deleted items, and that is exactly what readRemovedListentris_ms.php does.

_SELECT_ operation on the table __'listentries'__ to retrieve all columns where:

- The 'visible' value in the __'listentries'__ table is set to '3'.

```sql
SELECT * FROM listentries WHERE visible = '3'
```

<br>

---

<br>

### readSectionedService_ms.php
_SELECT_ operation on the table __'user'__ to retrieve values from the column:
- username

```sql
SELECT username FROM user WHERE uid = :uid;
```


_SELECT_ operation on the table __'course'__ to retrieve values from the column:
- visibility

```sql
SELECT visibility FROM course WHERE cid=:cid;
```


_SELECT_ operation on the table __'quiz'__ to retrieve values from the columns:
- id
- qname
- qrelease
- deadline
- relativedeadline

```sql
SELECT id,qname,qrelease,deadline,relativedeadline FROM quiz WHERE cid=:cid AND vers=:vers ORDER BY qname;
```


_SELECT_ operation on the table __'user_course'__ to retrieve values from the column:
- groups

```sql
SELECT groups FROM user_course WHERE uid=:uid AND cid=:cid;
```


_SELECT_ operation on the table __'userAnswer'__ to retrieve values from the columns:
- moment
- quiz
- grade
- submitted (formatted as YYYY-MM-DDTHH:MM:SS)
- marked (formatted as YYYY-MM-DDTHH:MM:SS)
- useranswer

```sql
SELECT moment,quiz,grade,DATE_FORMAT(submitted, '%Y-%m-%dT%H:%i:%s') AS submitted,DATE_FORMAT(marked, '%Y-%m-%dT%H:%i:%s') AS marked,useranswer FROM userAnswer WHERE uid=:uid AND cid=:cid AND vers=:vers;
```


_SELECT_ operation on the table __'listentries'__ joined with the table __'quiz'__ to retrieve values from the columns:
- lid
- moment
- entryname
- pos
- kind
- link
- visible
- code_id
- gradesystem (from both listentries and aliased as tabs)
- highscoremode
- deadline
- relativedeadline
- qrelease
- comments
- qstart
- jsondeadline
- groupKind
- ts
- feedbackenabled
- feedbackquestion

```sql
SELECT lid,moment,entryname,pos,kind,link,visible,code_id,listentries.gradesystem,highscoremode,deadline,relativedeadline,qrelease,comments, qstart, jsondeadline, groupKind, 
ts, listentries.gradesystem as tabs, feedbackenabled, feedbackquestion FROM listentries LEFT OUTER JOIN quiz ON listentries.link=quiz.id WHERE listentries.cid=:cid and listentries.vers=:coursevers ORDER BY pos;
```


_SELECT_ operation on the table __'course'__ to retrieve values from the columns:
- coursename
- coursecode

```sql
SELECT coursename, coursecode FROM course WHERE cid=:cid LIMIT 1;
```


_SELECT_ operation on the table __'vers'__ to retrieve values from the columns:
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
SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate,motd FROM vers;
```


_SELECT_ operation on the table __'vers'__ to retrieve values from the columns:
- cid
- coursecode
- vers
- versname
- coursename
- coursenamealt
- startdate
- enddate

```sql
SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate FROM vers;
```


_SELECT_ operation on the table __'fileLink'__ to retrieve values from the columns:
- fileid
- filename
- kind

```sql
SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid AND kind=1 ORDER BY filename;
```


_SELECT_ operation on the table __'fileLink'__ to retrieve values from the columns:
- fileid
- filename
- kind

```sql
SELECT fileid,filename,kind FROM fileLink WHERE (cid=:cid AND kind>1) or isGlobal='1' ORDER BY kind,filename;
```



_SELECT_ operation on the table __'codeexample'__ to retrieve values from the columns:
- exampleid
- cid
- examplename
- sectionname
- runlink
- cversion

```sql
SELECT exampleid, cid, examplename, sectionname, runlink, cversion FROM codeexample WHERE cid=:cid ORDER BY examplename;
```


_SELECT_ operation on the table __'vers'__ to retrieve values from the columns:
- startdate
- enddate

```sql
SELECT startdate,enddate FROM vers WHERE cid=:cid AND vers=:vers LIMIT 1;
```


_SELECT_ operation on the table __'userduggafeedback'__ to retrieve all columns where:

- The 'lid' value in the __'userduggafeedback'__ table matches the value bound to :lid.
- The 'cid' value in the __'userduggafeedback'__ table matches the value bound to :cid.

```sql
SELECT * FROM userduggafeedback WHERE lid=:lid AND cid=:cid;
```


_SELECT_ operation on the table __'userduggafeedback'__ to retrieve the average value from the column:
- score

```sql
SELECT AVG(score) FROM userduggafeedback WHERE lid=:lid AND cid=:cid
```


_SELECT_ operation on the table __'listentries'_ to retrieve all columns where:

- The 'visible' value in the __'listentries'__ table is set to '3'

```sql
SELECT * FROM listentries WHERE visible = '3'
```

<br>
<br>

---
## ----------------------------- _profileService_ -----------------------------
---

<br>
<br>

profileService - handles password changes and challenge question

### changeProfileValues    
(writter comment: i think this service is small enough as is )
<br>

Uses service __selectFromTableUser__ to _get_ information it requires from __user__.
Uses service __selectFromTableUser_course__ to _get_ information it requires from __user_course__.
<br>

Statements below are methods for _changeProfileValues_ and not services.

#### updateSecurityQuestion
Uses service __selectFromTableUser__ to _get_ information it requires from __user__.

#### updatePassword
Uses service __updateUserPassword__ to _get_ information it requires from __user__.

<br>
<br>

---
## ----------------------------- _resultedService_ -----------------------------
---

<br>
<br>

### getUserAnswar  
(writers comment: this service is small enough as is)
<br>

Uses service __selectFromTableUserAnswar__ to _get_ information it requires from __userAnswer__.
Uses service __selectFromTableListentries__ to _get_ information it requires from __Listentries__.

<br>
<br>

---
## ----------------------------- _showDuggaService_ -----------------------------
---

<br>
<br>

### updateActiveUsers_ms.php
updateActiveUsers_ms.php checks if there are already active users recorded for a given hash and either inserts a new record or updates the existing count of active users.

_SELECT_ operation on the table __'groupdugga'__ to retrieve the value from the column:
- active_users

- The 'hash' value in the __'groupdugga'__ table matches the value bound to :hash.

```sql
SELECT active_users FROM groupdugga WHERE hash=:hash;
```


_INSERT_ operation on the table __'groupdugga'__ to create new rows with values for the columns:
- hash
- active_users

- The 'hash' value is bound to :hash.
- The 'active_users' value is bound to :AUtoken.

```sql
INSERT INTO groupdugga(hash,active_users) VALUES(:hash,:AUtoken);
```


_UPDATE_ operation on the table __'groupdugga'__ to modify rows where:

- The 'hash' value in the __'groupdugga'__ table matches the value bound to :hash.

Set the value for the column:
- active_users to :AUtoken

```sql
UPDATE groupdugga SET active_users=:AUtoken WHERE hash=:hash;
```

<br>

---

<br>

### processDuggaFile
Search with __hash__
Uses service __selectFromTableSubmission__ to _get_ information it requires from __submission__.
<br>
If no match on _hash_, retreive all submissions
Uses service __selectFromTableSubmission__ to _get_ information it requires from __submission__.

<br>

---

<br>

### submitDugga
Get submission based on __hash__.
Uses service __selectFromTableUserAnswer__ to _get_ information it requires from __userAnswer__.
<br>

These are not services but __methods__. 
#### updateUserAnswer
Uses the services __updateTableUserAnswer__ to change the content of these columns:
- useranswer
- timesSubmitted

#### createUserAnswer
Uses service __insertIntoTableUserAnswer__ to makes _inserts_ into the table __userAnswer__.

<br>

---

<br>

### readSubmittedDugga_ms.php
readSubmittedDugga_ms.php retrieves submitted user responses (submitted duggas) from a database based on specific identifiers such as a hash value or a moment identifier.

_SELECT_ operation on the tables __'userAnswer'__ and __'variant'__ to retrieve values from the columns:
- vid
- variantanswer
- useranswer
- param
- cid
- vers
- quiz

- The 'hash' value in the __'userAnswer'__ table matches the value bound to :hash.


If the hash didn't work then retrive all answers for that moment:

_SELECT_ operation on the tables __'userAnswer'__ and __'variant'__ to retrieve values from the columns:
- vid
- variantanswer
- useranswer
- param
- cid
- vers
- quiz

- The 'moment' value in the __'userAnswer'__ table matches the value bound to :moment.

<br>

---

<br>