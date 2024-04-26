# MICROSERVICES
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
- contributedservice.php : _there is no documentation for this file_ __unclear if needed__
- contribution_loginbox_service.php : __unclear if needed__
- courseedservice.php  __==finished==__
- diagramservice.php  __WORK PAUSED in this service will continue when the service is fixed__
- duggaedservice.php __==finished==__
- fileedservice.php __==finished==__
- gitcommitService.php 
- highscoreservice.php __==finished==__
- sectionedservice.php __==finished==__
- profileservice.php __==finished==__
- resultedservice.php __==finished==__
- showDuggaservice.php __==finished==__ 

---
# LIST OF MICROSERVICES
---

# OBSERVE

Please note that the microservices marked __"UNFINISHED"__ in this documentation have remained __unchanged since the group in 2023__. These microservices __still rely__ on the services described in the Database_related_micro_services.md. Once all the microservices are implemented, the Database_related_micro_services.md will become obsolete and therefore will be deleted. The microservices marked __"finished"__ include complete documentation about the queries in this document.

Also note that __no renaming of microservices__ will take place until all microservices are implemented. 

<br>

Here is how you search in the document:

Example: 

"Shared microservices:

-retrieveUsername_ms.php __==finished==__ New filename: "readUsername_ms.php" according to the new naming convention based on CRUD."

_retrieveUsername_ms.php_ is the old name. _readUsername_ms.php_ is the new filename that the file will be renamed to later. When searching for a file in the document, look for the new file name. The queries handled by _retrieveUsername_ms.php_ will be found in the section for _Shared microservices_, under _readUsername_ms.php_.
The old name remains listed under "LIST OF MICROSERVICES" so that we can keep track of them until we switch to the new names.

<br>

Shared microservices:

- logUserEvent_ms.php __==finished==__ The existing name should be retained based on the actual function of the microservice, even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice.
- logServiceEvent_ms.php __==UNFINISHED==__
- getUid_ms.php __==finished==__ New filename: "readUid_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- retrieveUsername_ms.php __==finished==__ New filename: "readUsername_ms.php" according to new nameconvention based on CRUD.
- isSuperUser_ms.php __==UNFINISHED==__
- hasAccess_ms.php __==UNFINISHED==__
- setActiveCourseversion_ms.php __==UNFINISHED==__
- createNewCodeExample_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createNewListentrie_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD
- createNewVersionOfCourse_ms.php __==UNFINISHED==__
- setAsActiveCourse_ms.php __==finished==__ New filename: "updateActiveCourse_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.

<br>

Accessed Service:

- updateUser_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateUserCourse_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- addClass_ms.php __==finished==__ New filename: "createClass_ms.php" according to new nameconvention based on CRUD.
- changeUserPassword_accessed_ms.php __==UNFINISHED==__ 
- addUser_ms.php __==finished==__ New filename: "createUser_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.

<br>

Codeviewer Service:

- settingCodeexampleTemplate_ms.php __==UNFINISHED==__
- editCodeExample_ms.php __==finished==__ New filename: "updateCodeExample_ms.php" according to new nameconvention based on CRUD.
- editContentOfCodeExample_ms.php __==finished==__ New filename: "updateContentOfCodeExample_ms.php" according to new nameconvention based on CRUD and the main function of the ms.
- editBoxTitle_ms.php __==finished==__ New filename: "updateBoxTitle_ms.php" according to new nameconvention based on CRUD.
- deleteCodeExample_ms.php __==finished==__ New filename: "deleteCodeExample_ms.php" according to new nameconvention based on CRUD.

<br>

Courseed Service:

- createNewCourse_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createCourseVersion_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateCourseVersion_courseed_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- changeActiveCourseVersion_courseed_ms.php __==finished==__ New filename: "updateActiveCourseVersion_courseed_ms.php" according to new nameconvention based on CRUD.
- copyCourseVersion_ms.php __==UNFINISHED==__
- updateCourse_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createMOTD_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- deleteCourseMaterial_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- retrieveCourseedService_ms.php __==finished==__ New filename: "readCourseedService_ms.php" according to new nameconvention based on CRUD.

<br>

Duggaed Service:

- createDugga_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateDugga_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- deleteDugga_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createDuggaVariant_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateDuggaVariant_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- deleteDuggaVariant_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.

<br>

Fileed Service:

- deleteFileLink_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- updateFileLink_ms.php __==UNFINISHED==__

<br>

gitcommit Service:

- clearGitFiles_ms.php __==UNFINISHED==__
- updateGithubRepo_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD. 
- refreshGithubRepo_ms.php __==finished==__ The existing name should be retained based on the actual function of the microservice, even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice. The fact that "updateGithubRepo_ms.php" already exists is also a factor in this decision.  
- fetchOldToken_ms.php __==UNFINISHED==__
- insertIntoSQLite_ms.php __==UNFINISHED==__
- newUpdateTime_ms.php __==UNFINISHED==__
- refreshCheck_ms.php __==UNFINISHED==__

<br>

Highscore Service:

- highscoreservice_ms.php __==UNFINISHED==__

<br>

Sectioned Service:

- getGroupValues_ms.php __==finished==__ New filename: "readGroupValues_ms.php" according to new nameconvention based on CRUD.
- getCourseGroupsAndMembers_ms.php __==finished==__ New filename: "readCourseGroupsAndMembers_ms.php" according to new nameconvention based on CRUD.
- deleteListentries_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- removeListentries_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- createListentrie_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- reorderListentries_ms.php __==finished==__ New filename: "updateOrder_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- updateListentrie_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- updateListentriesTabs_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- updateListentriesGradesystem_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- setVisibleListentrie_ms.php __==finished==__ New filename: "updateVisibleListentrie_ms.php" according to new nameconvention based on CRUD
- getDeletedListentries_ms.php __==finished==__ New filename: "readRemovedListentries_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- updateQuizDeadline_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateCourseVersion_sectioned_ms.php __==UNFINISHED==__
- changeActiveCourseVersion_sectioned_ms.php __==finished==__ New filename: "updateActiveCourseVersion_sectioned_ms.php" according to new nameconvention based on CRUD.
- getCourseVersions_ms.php __==UNFINISHED==__
- getGitReference_ms.php __==UNFINISHED==__
- getUserDuggaFeedback_ms.php __==finished==__ New filename: "readUserDuggaFeedback_ms.php" according to new nameconvention based on CRUD.
- retrieveSectionedService_ms.php __==finished==__ New filename: "readSectionedService_ms.php" according to new nameconvention based on CRUD.

<br>

Profile Service:

- updateSecurityQuestion_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateUserPassword_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.

<br>

Resulted Service:

- getUserAnswer_ms.php __==finished==__ New filename: "readUserAnswer_ms.php" according to new nameconvention based on CRUD.

<br>

Show Dugga Service:

- updateActiveUsers_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD despite the mixed functions of the ms.
- processDuggaFile_ms.php __==finished==__ New filename: "processSubmittedDugga_ms.php", even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice. 
- saveDugga_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this particular case, a more general name is preferable as it better describes the microservice's function.
- loadDugga_ms.php __==finished==__ New filename: "readSubmittedDugga_ms.php" according to new nameconvention based on CRUD.

<br>

---
---
# Microservices 
---
---
<br>

---
## ----------------------------- _shared_microservices_ -----------------------------
---

<br>

### logUserEvent_ms.php
Creates a new userbased event in the log.db database (not MYSQL).

__Querys used in this microservice:__

_INSERT_ operation on the table __'userLogEntries'__ to add a new row with values for the following columns:
- uid
- username
- eventType
- description
- userAgent
- remoteAddress

```sql
INSERT INTO userLogEntries (uid, username, eventType, description, userAgent, remoteAddress) VALUES (:uid, :username, :eventType, :description, :userAgent, :remoteAddress);
```

<br>

---

<br>

### logServiceEvent_ms.php
Creates a new service event in the log.db database (not MYSQL). The timestamp used is an integer containing the number of milliseconds since 1970-01-01 00:00 (default javascript date format).

__Querys used in this microservice:__

_INSERT_ operation on the table __'serviceLogEntries'__ to add a new row with values for the following columns:
- uuid
- eventType
- service
- timestamp
- userAgent
- operatingSystem
- browser
- userid
- info
- referer
- IP

```sql
INSERT INTO serviceLogEntries (uuid, eventType, service, timestamp, userAgent, operatingSystem, browser, userid, info, referer, IP) VALUES (:uuid, :eventType, :service, :timestamp, :userAgent, :operatingSystem, :browser, :userid, :info, :referer, :IP);
```

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

### readUsername_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'user'__ to retrieve the value of the column:
- username

```sql
SELECT username FROM user WHERE uid = :uid;
```

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

### createNewCodeExample_ms.php

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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
__updateActiveCourse_ms.php__ code is designed to handle the activation of a specific course version by updating the database table __'course'__ based on user input.

__Querys used in this microservice:__

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

### updateUser_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'user'__ to update the value of the column:
- firstname

```sql
UPDATE user SET firstname=:firstname WHERE uid=:uid;
```


_UPDATE_ operation on the table __'user'__ to update the value of the column:
- lastname

```sql
UPDATE user SET lastname=:lastname WHERE uid=:uid;
```


_UPDATE_ operation on the table __'user'__ to update the value of the column:
- ssn

```sql
UPDATE user SET ssn=:ssn WHERE uid=:uid;
```


_UPDATE_ operation on the table __'user'__ to update the value of the column:
- username

```sql
UPDATE user SET username=:username WHERE uid=:uid;
```


_UPDATE_ operation on the table __'user'__ to update the value of the column:
- class

```sql
UPDATE user SET class=:class WHERE uid=:uid;
```

<br>

---

<br>

### updateUserCourse_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'user_course'__ to update the value of the column:
- examiner

```sql
UPDATE user_course SET examiner=:examiner WHERE uid=:uid AND cid=:cid;
```


_UPDATE_ operation on the table __'user_course'__ to update the value of the column:
- vers

```sql
UPDATE user_course SET vers=:vers WHERE uid=:uid AND cid=:cid;
```


_UPDATE_ operation on the table __'user_course'__ to update the value of the column:
- access

```sql
UPDATE user_course SET access=:access WHERE uid=:uid AND cid=:cid;
```


_UPDATE_ operation on the table __'user_course'__ to update the value of the column:
- groups

```sql
UPDATE user_course SET groups=:groups WHERE uid=:uid AND cid=:cid;
```

<br>

---

<br>

### createClass_ms.php

__Querys used in this microservice:__

_INSERT_ operation on the table __'class'__ to insert values into the following columns:
- class
- responsible
- classname
- regcode
- classcode
- hp
- tempo
- hpProgress

```sql
INSERT INTO class (class, responsible, classname, regcode, classcode, hp, tempo, hpProgress) VALUES(:class, :responsible, :classname, :regcode, :classcode, :hp, :tempo, :hpProgress);
```

<br>

---

<br>

### changeUserPassword_accessed
Uses service __updateUserPassword__ to _update_ the column "_password_" in the table __user__. 

<br>

---

<br>

### createUser_ms.php
__createUser_ms.php__ handles adding or updating user records and their enrollments in specific courses. The microservice checks if a user exists based on their username, creates new users if they don't exist, and then links them to courses in the database. If users already exist, it updates their course enrollment details. So this microservice is not a pure "create" operation but it is the main function.

__Querys used in this microservice:__

_SELECT_ operation on the table __'user'__ to retrieve the value of the column:
- uid

```sql
SELECT uid FROM user WHERE username=:username;
```


_SELECT_ operation on the table __'class'__ to retrieve the value of the column:
- class

```sql
SELECT class FROM class WHERE class = :clsnme;
```


_INSERT_ operation into the table __'class'__ to add a new row with values for the following columns:
- class
- responsible

```sql
INSERT INTO class (class, responsible) VALUES (:className, 1);
```


_INSERT_ operation into the table __'user'__ to add a new row with values for the following columns:
- username
- email
- firstname
- lastname
- ssn
- password
- addedtime
- class

```sql
INSERT INTO user (username, email, firstname, lastname, ssn, password, addedtime, class) VALUES (:username, :email, :firstname, :lastname, :ssn, :password, NOW(), :className);
```


_INSERT_ operation into the table __'user_course'__ to add a new row or update an existing row with values for the following columns:
- uid
- cid
- access
- term
- creator
- vers
- vershistory

- The operation adds a new row with specified values. If a row with the same primary key already exists (triggered by a duplicate key error), it updates the `vers` field to `:avers` and appends `:bvers` to the existing `vershistory`, separated by a comma.

```sql
INSERT INTO user_course (uid, cid, access, term, creator, vers, vershistory) VALUES (:uid, :cid, 'R', :term, :creator, :vers, '')
ON DUPLICATE KEY UPDATE vers=:avers, vershistory=CONCAT(vershistory, CONCAT(:bvers, ','))
```

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

### updateCodeExample_ms.php
__updateCodeExample_ms.php__ handles updates of code examples.

__Querys used in this microservice:__

_UPDATE_ operation on the table __'codeexample'__ to update the values of the columns:
- runlink
- examplename
- sectionname

- The 'exampleid' value in the __'codeexample'__ table matches the value bound to :exampleid,
- The 'cid' value in the __'codeexample'__ table matches the value bound to :cid, and
- The 'cversion' value in the 'codeexample' table matches the value bound to :cvers.

```sql
UPDATE codeexample SET runlink = :playlink , examplename = :examplename, sectionname = :sectionname WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;
```


_UPDATE_ operation on the table __'codeexample'__ to update the value of the column:
- beforeid

- The 'exampleid' value in the __'codeexample'__ table matches the value bound to :exampleid,
- The 'cid' value in the __'codeexample'__ table matches the value bound to :cid, and
- The 'cversion' value in the __'codeexample'__ table matches the value bound to :cvers.

```sql
UPDATE codeexample SET beforeid = :beforeid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;
```


_UPDATE_ operation on the table ___'codeexample'__ to update the value of the column:
- afterid

- The 'exampleid' value in the __'codeexample'__ table matches the value bound to :exampleid,
- The 'cid' value in the __'codeexample'__ table matches the value bound to :cid, and
- The 'cversion' value in the __'codeexample'__ table matches the value bound to :cvers.

```sql
UPDATE codeexample SET afterid = :afterid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;
```


_INSERT_ operation on the table __'impwordlist'__ to create new rows with values for the columns:
- exampleid
- word
- uid

```sql
INSERT INTO impwordlist(exampleid,word,uid) VALUES (:exampleid,:word,:uid);
```


_DELETE_ operation on the table __'impwordlist'__ to delete rows where:

- The 'word' value in the 'impwordlist' table matches the value bound to :word,
- The 'exampleid' value in the 'impwordlist' table matches the value bound to :exampleid.

```sql
DELETE FROM impwordlist WHERE word=:word AND exampleid=:exampleid;
```

<br>

---

<br>

### updateContentOfCodeExample_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'box'__ to update the values of the columns:
- boxtitle
- boxcontent
- filename
- fontsize
- wordlistid

```sql
UPDATE box SET boxtitle=:boxtitle, boxcontent=:boxcontent, filename=:filename, fontsize=:fontsize, wordlistid=:wordlist WHERE boxid=:boxid AND exampleid=:exampleid;
```


_INSERT_ operation into the table __'improw'__ to add a new row with values for the following columns:
- boxid
- exampleid
- istart
- iend
- uid

```sql
INSERT INTO improw (boxid, exampleid, istart, iend, uid) VALUES (:boxid, :exampleid, :istart, :iend, :uid);
```


_DELETE_ operation on the table __'improw'__ to remove rows where the following conditions are met:
- boxid
- istart
- iend
- exampleid

```sql
DELETE FROM improw WHERE boxid=:boxid AND istart=:istart AND iend=:iend AND exampleid=:exampleid;
```

<br>

---

<br>

### updateBoxTitle_ms.php 

__Querys used in this microservice:__

_UPDATE_ operation on the table __'box'__ to update the value of the column:
- boxtitle

```sql
UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;
```

<br>

---

<br>

### deleteCodeExample_ms.php

__Querys used in this microservice:__

_DELETE_ operation on the table __'improw'__ to remove rows where:

- The 'exampleid' value in the __'improw'__ table matches the value bound to :exampleid.

```sql
DELETE FROM improw WHERE exampleid=:exampleid;
```


_DELETE_ operation on the table __'box'__ to remove rows where:

- The 'exampleid' value in the __'box'__ table matches the value bound to :exampleid.

```sql
DELETE FROM box WHERE exampleid=:exampleid;
```


_DELETE_ operation on the table __'impwordlist'__ to remove rows where:

- The 'exampleid' value in the __'impwordlist'__ table matches the value bound to :exampleid.

```sql
DELETE FROM impwordlist WHERE exampleid=:exampleid;
```


_DELETE_ operation on the table __'codeexample'__ to remove rows where:

- The 'exampleid' value in the __'codeexample'__ table matches the value bound to :exampleid.

```sql
DELETE FROM codeexample WHERE exampleid=:exampleid;
```


_DELETE_ operation on the table __'listentries'__ to remove rows where:

- The 'lid' value in the __'listentries'__ table matches the value bound to :lid.

```sql
DELETE FROM listentries WHERE lid=:lid;
```

<br>
<br>

---
## ----------------------------- _courseedService_ -----------------------------
---

<br>
<br>

### createNewCourse_ms.php

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

### updateCourse_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'user'__ to retrieve the value of the column:
- username

```sql
SELECT username FROM user WHERE uid = :uid;
```


_UPDATE_ operation on the table __'course'__ to update values of the columns:
- coursename
- visibility
- coursecode
- courseGitURL

- The 'cid' value in the __'course'__ table matches the value bound to :cid.

```sql
UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;
```

<br>

---

<br>

### createMOTD_ms.php

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

### createDugga_ms.php

__Querys used in this microservice:__

_INSERT_ operation on the table __'quiz'__ to create new rows with values for the columns:
- cid
- autograde
- gradesystem
- qname
- quizFile
- qrelease
- deadline
- creator
- vers
- qstart
- jsondeadline
- group

```sql
INSERT INTO quiz(cid,autograde,gradesystem,qname,quizFile,qrelease,deadline,creator,vers,qstart,jsondeadline,`group`) VALUES (:cid,:autograde,:gradesys,:qname,:template,:release,:deadline,:uid,:coursevers,:qstart,:jsondeadline,:group);
```

<br>

---

<br>

### updateDugga_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'quiz'__ to update the values of the columns:
- qname
- autograde
- gradesystem
- quizFile
- qstart
- deadline
- qrelease
- jsondeadline
- group

```sql
UPDATE quiz SET qname=:qname, autograde=:autograde, gradesystem=:gradesys, quizFile=:template, qstart=:qstart, deadline=:deadline, qrelease=:release, jsondeadline=:jsondeadline, `group`=:group WHERE id=:qid;
```

<br>

---

<br>

### deleteDugga_ms.php

__Querys used in this microservice:__

_DELETE_ operation on the table __'useranswer'__ to remove rows where the column:
- quiz
matches a specific value (`:qid`).

```sql
DELETE FROM useranswer WHERE quiz=:qid;
```


_DELETE_ operation on the table __'quiz'__ to remove rows where the column:
- id
matches a specific value (`:qid`).

```sql
DELETE FROM quiz WHERE id=:qid;
```

<br>

---

<br>

### createDuggaVariant_ms.php

__Querys used in this microservice:__

_INSERT_ operation into the table __'variant'__ to add a new row with values for the following columns:
- quizID
- creator
- disabled
- param
- variantanswer

```sql
INSERT INTO variant(quizID, creator, disabled, param, variantanswer) VALUES (:qid, :uid, :disabled, :param, :variantanswer);
```

<br>

---

<br>

### updateDuggaVariant_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'variant'__ to update the value of the columns:
- disabled
- param
- variantanswer

```sql
UPDATE variant SET disabled=:disabled,param=:param,variantanswer=:variantanswer WHERE vid=:vid;
```

<br>

---

<br>

### deleteDuggaVariant_ms.php

__Querys used in this microservice:__

_DELETE_ operation on the table __'userAnswer'__ to remove rows where the column:
- variant

- The value in the 'variant' column matches the value specified by :vid

```sql
DELETE FROM userAnswer WHERE variant=:vid;
```


_DELETE_ operation on the table __'variant'__ to remove rows where the column:
- vid

- The value in the 'vid' column matches the value specified by :vid.

```sql
DELETE FROM variant WHERE vid=:vid;
```

<br>
<br>

---
## ----------------------------- _fileedService_ -----------------------------
---

<br>
<br>

### deleteFileLink_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'fileLink'__ that retrieves the value of the column:
- path

```sql
SELECT path from fileLink WHERE fileid = :fid;
```


_SELECT_ operation on the tables __'fileLink'__ and __'box'__ that calculates the total count of records:

- The condition is met where the filename in box matches the filename in fileLink.
- Additionally, the kind in fileLink must be either 2 or 3.
- The fileid in fileLink matches a specific ID provided by the user (denoted as :fid).

This query serves to count the number of matching records between the two tables under the specified conditions, providing a total count where these criteria are met.

```sql
SELECT COUNT(*) counted FROM fileLink, box WHERE box.filename = fileLink.filename AND (fileLink.kind = 2 OR fileLink.kind = 3) AND fileLink.fileid=:fid ;
```


_DELETE_ operation on the table __'fileLink'__ that removes records:

- Where the fileid matches a specific ID provided by the user (denoted as :fid).

```sql
DELETE FROM fileLink WHERE fileid=:fid;
```

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
## ----------------------------- _gitCommitService_ -----------------------------
---

<br>
<br>

### clearGitFiles_ms.php

<br>

---

<br>

### updateGithubRepo_ms.php
Update github repo in course updates the repo url and commit in SQLlite DB.

__Querys used in this microservice:__

_UPDATE_ operation on the table __'gitRepos'__ to update the values of the columns:
- repoURL
- lastCommit

```sql
UPDATE gitRepos SET repoURL = :repoURL, lastCommit = :lastCommit WHERE cid = :cid;
```

<br>

---

<br>

### refreshGithubRepo_ms.php
Updates the metadata from the github repo if there's been a new commit.

Please note, _refreshCheck_ and _newUpdateTime_ will later become their own microservices but are included in this microservice for now to ensure functionality. 

__Querys used in this microservice:__

__- refreshGithubRepo: Updates the metadata from the github repo if there's been a new commit:__

_DELETE_ operation on the table __'gitFiles'__ to remove rows where the column:
- cid

matches a specific value (`:cid`).

```sql
DELETE FROM gitFiles WHERE cid = :cid;
```


_SELECT_ operation on the table __'gitRepos'__ to retrieve the values of the columns:
- lastCommit
- repoURL

```sql
SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid;
```


_UPDATE_ operation on the table __'gitRepos'__ to update the value of the column:
- lastCommit

```sql
UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid;
```


__- refreshCheck: Decide how often the data can be updated, and if it can be updated again:__

_SELECT_ operation on the table __'course'__ to retrieve the value of the column:
- updated

```sql
SELECT updated FROM course WHERE cid = :cid;
```


__- newUpdateTime: Updates the MySQL database to save the latest update time:__

_UPDATE_ operation on the table __'course'__ to update the value of the column:
- updated

```sql
UPDATE course SET updated = :parsedTime WHERE cid = :cid;
```

<br>

---

<br>

### fetchOldToken_ms.php

<br>

---

<br>

### insertIntoSQLite_ms.php

<br>

---
<br>


### newUpdateTime_ms.php

<br>

---
<br>


### refreshCheck_ms.php

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

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

### removeListentries_ms.php (hides the listentrie, not deleting it)
Listentries are duggas, headers, tests etc. This microservice will change the visibility of a listentry to "deleted" instead of deleting the item from the database entirely. This will enable restoring deleted items. It "hides" the listentries. Should not be confused with the microservice deleteListentries (that actually deletes the listentrie from the database). 

__Querys used in this microservice:__

_UPDATE_ operation on the table __'listentries'__ to update rows where:

- The 'lid' value in the __'listentries'__ table matches the value bound to :lid.
- Set: The 'visible' value in the 'listentries' table to '3'.

<br>

---

<br>

### createListentrie_ms.php

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

__Querys used in this microservice:__

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

### updateListentriesTabs_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'listentries'__ to modify rows with updated values for the column:
- gradesystem

- The 'lid' value in the 'listentries' table matches the value bound to :lid.

```sql
UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;
```

<br>

---

<br>

### updateListentriesGradesystem_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'listentries'__ to update the value of the column:
- gradesystem

```sql
UPDATE listentries SET gradesystem=:gradesys WHERE lid=:lid;
```

<br>

---

<br>

### updateVisibleListentrie_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'listentries'__ to update the value of the column:
- visibility (0 = Hidden, 1 = Public)

```sql
UPDATE listentries SET visibility = :listentryId;
```

<br>

---

<br>

### updateQuizDeadline_ms.php
updateQuizDeadline_ms.php updates the deadline for a quiz (also referred to as a dugga).

__Querys used in this microservice:__

_UPDATE_ operation on the table __'quiz'__ to update the values of the columns:
- deadline
- relativedeadline

```sql
UPDATE quiz SET deadline=:deadline, relativedeadline=:relativedeadline WHERE id=:link;
```

<br>

---

<br>

### readRemovedListentries_ms.php
Listentries are duggas, headers, tests etc. This microservice retrieves all removed (but not deleted) listentries from the database. __readRemovedListentries_ms.php__ is close related to the __removeListentries_ms.php__ that changes the visibility of a listentry to "deleted" (3) instead of deleting the item from the database entirely. This will enable restoring deleted items, and that is exactly what __readRemovedListentris_ms.php__ does.

__Querys used in this microservice:__

_SELECT_ operation on the table __'listentries'__ to retrieve all columns where:

- The 'visible' value in the __'listentries'__ table is set to '3'.

```sql
SELECT * FROM listentries WHERE visible = '3'
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

__Querys used in this microservice:__

_UPDATE_ operation on the table __'course'__ to update the value of the column:
- activeversion

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid
```

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

### readUserDuggaFeedback_ms.php
__readUserDuggaFeedback_ms.php__ retrieves feedback from users for a specific dugga and calculates the average score for that particular dugga.

__Querys used in this microservice:__

_SELECT_ operation on the table __'userduggafeedback'__ to select all columns where:

- The 'lid' value matches the bound value for :lid.
- The 'cid' value matches the bound value for :cid.

```sql
SELECT * FROM userduggafeedback WHERE lid=:lid AND cid=:cid;
```


_SELECT_ operation on the table __'userduggafeedback'__ to calculate the average of the 'score' column, aliased as 'avgScore', where:

- The 'lid' value matches the bound value for :lid.
- The 'cid' value matches the bound value for :cid.

```sql
SELECT AVG(score) AS avgScore FROM userduggafeedback WHERE lid=:lid AND cid=:cid;
```

<br>

---

<br>

### readSectionedService_ms.php

__Querys used in this microservice:__

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

ProfileService handles password changes and challenge questions. To access these functions, the user clicks on their profile when logged in.

#### updateSecurityQuestion_ms.php
__updateSecurityQuestion_ms.php__ handles the updating of security questions for users. Changes to security questions are permitted only for non-superuser/non-teacher users and only if the correct password is entered.

__Querys used in this microservice:__

_SELECT_ operation on the table __'user'__ to retrieve the value of the column:
- password

```sql
SELECT password FROM user WHERE uid = :userid LIMIT 1;
```


_SELECT_ operation on the table __'user_course'__ to retrieve the value of the column:
- access

```sql
SELECT access FROM user_course WHERE uid = :userid AND access = 'W' LIMIT 1;
```


_UPDATE_ operation on the table __'user'__ to update the values of the columns:
- securityquestion
- securityquestionanswer

```sql
UPDATE user SET securityquestion=:SQ, securityquestionanswer=:answer WHERE uid=:userid;
```

<br>

---

<br>

#### updateUserPassword_ms.php
__updateUserPassword_ms.php__ validates the user's password against what is stored in the database to ensure user authentication. If the user passes the password check and does not have a teacher or superuser role, the password will be updated.

__Querys used in this microservice:__

_SELECT_ operation on the table __'user'__ to retrieve the value of the column:
- password

```sql
SELECT password FROM user WHERE uid = :userid LIMIT 1;
```

_SELECT_ operation on the table __'user_course'__ to retrieve the value of the column:
- access

```sql
SELECT access FROM user_course WHERE uid = :userid AND access = 'W' LIMIT 1;
```

_UPDATE_ operation on the table __'user'__ to update the values of the columns:
- securityquestion
- securityquestionanswer

```sql
UPDATE user SET securityquestion=:SQ, securityquestionanswer=:answer WHERE uid=:userid;
```

_UPDATE_ operation on the table __'user'__ to update the value of the column:
- password

```sql
UPDATE user SET password=:PW WHERE uid=:userid;
```

<br>
<br>

---
## ----------------------------- _resultedService_ -----------------------------
---

<br>
<br>

### readUserAnswer_ms.php
__readUserAnswer_ms.php__ manages and presents information about submitted duggor.

__Querys used in this microservice:__

_SELECT_ operation on the table __'userAnswer'__ to retrieve the columns:
- hash
- password
- submitted
- timesSubmitted
- timesAccessed
- moment
- last_Time_techer_visited

- The 'cid' value in the __'userAnswer'__ table matches the value bound to :cid.
- The 'vers' value in the __'userAnswer'__ table matches the value bound to :vers.

```sql
SELECT hash, password, submitted, timesSubmitted, timesAccessed, moment,last_Time_techer_visited FROM userAnswer WHERE cid=:cid AND vers=:vers;
```


_SELECT_ operation on the table __'listentries'__ to retrieve the columns:
- entryname
- kind
- lid
- moment

- The 'cid' value in the __'listentries'__ table matches the value bound to :cid.
- The 'vers' value in the __'listentries'__ table matches the value bound to :vers.
- The 'kind' value in the __'listentries'__ table is equal to 3.

```sql
SELECT entryname, kind, lid, moment FROM listentries WHERE cid=:cid AND vers=:vers AND (kind=3);
```

<br>
<br>

---
## ----------------------------- _showDuggaService_ -----------------------------
---

<br>
<br>

### updateActiveUsers_ms.php
__updateActiveUsers_ms.php__ checks if there are already active users recorded for a given hash and either inserts a new record or updates the existing count of active users.

__Querys used in this microservice:__

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

### processDuggaFile_ms.php
__processDuggaFile_ms.php__ processes files within a dugga i.e. submitted PDF, ZIP files.

__Querys used in this microservice:__

_SELECT_ operation on the table __'submission'__ to retrieve the following columns for records that match a specific condition:
- subid
- vers
- did
- fieldnme
- filename
- extension
- mime
- updtime
- kind
- filepath
- seq
- segment
- hash

- The value in the 'hash' column must match the specified `:hash`. The results are ordered by 'subid', 'fieldnme', and 'updtime' in ascending order.

```sql
SELECT subid, vers, did, fieldnme, filename, extension, mime, updtime, kind, filepath, seq, segment, hash 
FROM submission 
WHERE hash = :hash 
ORDER BY subid, fieldnme, updtime ASC;
```


_SELECT_ operation on the table __'submission'__ to retrieve the following columns for records that meet a specific condition:
- subid
- vers
- did
- fieldnme
- filename
- extension
- mime
- updtime
- kind
- filepath
- seq
- segment
- hash

- The value in the 'segment' column matches the specified `:moment`. The results should be ordered by 'subid', 'fieldnme', and 'updtime' in ascending order.

```sql
SELECT subid, vers, did, fieldnme, filename, extension, mime, updtime, kind, filepath, seq, segment, hash 
FROM submission 
WHERE segment = :moment 
ORDER BY subid, fieldnme, updtime ASC;
```

<br>

---

<br>

### saveDugga_ms.php
__saveDugga_ms.php__ allows the user to make multiple saves of dugga answers before final submission. The user can update their answer multiple times as needed, and the system manages these updates until an approved grade is received, which then blocks further submissions for that specific dugga.

__Querys used in this microservice:__

_SELECT_ operation on the table __'userAnswer'__ to retrieve values from the columns:
- password
- timesSubmitted
- timesAccessed
- grade

- The 'hash' value in the __'userAnswer'__ table matches the value bound to :hash.

```sql
SELECT password,timesSubmitted,timesAccessed,grade from userAnswer WHERE hash=:hash;
```


_UPDATE_ operation on the table __'userAnswer'__ to modify rows where:

- The 'hash' value in the __'userAnswer'__ table matches the value bound to :hash, and
- The 'password' value in the 'userAnswer' table matches the value bound to :hashpwd.

Set the values for the columns:
- submitted to the current date and time (NOW()),
- useranswer to the value bound to :useranswer,
- Increment the timesSubmitted by 1.

```sql
UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timesSubmitted=timesSubmitted+1 WHERE hash=:hash AND password=:hashpwd;
```


_INSERT_ operation on the table __'userAnswer'__ to create new rows with values for the columns:
- cid
- quiz
- moment
- vers
- variant
- hash
- password
- timesSubmitted (initialized to 1)
- timesAccessed (initialized to 1)
- useranswer
- submitted (set to the current date and time, NOW())

```sql
INSERT INTO userAnswer(cid,quiz,moment,vers,variant,hash,password,timesSubmitted,timesAccessed,useranswer,submitted) VALUES(:cid,:did,:moment,:coursevers,:variant,:hash,:password,1,1,:useranswer,now());
```

<br>

---

<br>

### readSubmittedDugga_ms.php
__readSubmittedDugga_ms.php__ retrieves submitted user responses (submitted duggas) from a database based on specific identifiers such as a hash value or a moment identifier.

__Querys used in this microservice:__

_SELECT_ operation on the tables __'userAnswer'__ and __'variant'__ to retrieve values from the columns:
- vid
- variantanswer
- useranswer
- param
- cid
- vers
- quiz

- The 'hash' value in the __'userAnswer'__ table matches the value bound to :hash.

<br>

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