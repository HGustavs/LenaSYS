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
- contribution_loginbox_service.php: __WORK PAUSED due to the current non-functional state of this service__
- contributionservice.php: __WORK PAUSED due to the current non-functional state of this service__
- courseedservice.php __==finished==__
- diagramservice.php __WORK PAUSED for development of microservices. Will continue when the service is fixed (group 1 is working on this)__
- duggaedservice.php __==finished==__
- fileedservice.php __==finished==__
- gitcommitService.php __WORK PAUSED for development of microservices and/or tests. Will continue when the service is fixed (group 3 is working on this)__
- gitfetchService.php __WORK PAUSED for development of microservices and/or tests. Will continue when the service is fixed (group 3 is working on this)__
- highscoreservice.php __==finished==__
- profileservice.php __==finished==__
- resultedservice.php __==finished==__
- sectionedservice.php __==finished==__
- showDuggaService.php __==finished==__

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

__Shared microservices:__

- getUid_ms.php __==finished==__ New filename: "readUid_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- retrieveUsername_ms.php __==finished==__ New filename: "readUsername_ms.php" according to new nameconvention based on CRUD.
- setActiveCourseversion_ms.php __==UNFINISHED==__
- createNewCodeExample_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createNewListentry_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD
- createNewVersionOfCourse_ms.php __==UNFINISHED==__
- setAsActiveCourse_ms.php __==finished==__ New filename: "updateActiveCourse_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.

<br>

__Accessed Service:__

- updateUser_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateUserCourse_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- addClass_ms.php __==finished==__ New filename: "createClass_ms.php" according to new nameconvention based on CRUD.
- addUser_ms.php __==finished==__ New filename: "createUser_ms.php" according to new nameconvention based on CRUD and the actual function of the ms.
- retrieveAccessedService_ms.php __==finished==__ (But not tested, and therefore not implemented at the end of each microservice in the accessedService folder) Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function. 

__Note, all microservices related to accessservice.php have been created. As for working tests for these microservices, the work has been paused since accessedservice.php lacks an implemented frontend that allows the development of working tests. Tests cannot be created until the retrieveAccessedService_ms.php is tested, and for that, frontend functionality is needed. Group 3 is working on the frontend solution.__ 

<br>

__Codeviewer Service:__

- updateCodeExampleTemplate_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD. 
- editCodeExample_ms.php __==finished==__ New filename: "updateCodeExample_ms.php" according to new nameconvention based on CRUD.
- editContentOfExample_ms.php __==finished==__ New filename: "updateContentOfExample_ms.php" according to new nameconvention based on CRUD and the main function of the ms.
- editBoxTitle_ms.php __==finished==__ New filename: "updateBoxTitle_ms.php" according to new nameconvention based on CRUD.
- deleteCodeExample_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- retrieveCodeViewerService_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function. 

<br>

__Contribution Loginbox Service:__

- There is a functional requirements document regarding this service. There is mention of a "contribution page", which is assumed to be a contribution dugga. It is unclear exactly what this page is supposed to be, but the page is related to GitHub connectivity, which suggests it is supposed to be a page showing the different commits contributed by students to a project.

Given the current non-functional state of this service and the lack of clarity regarding the intentions of its creators, it does not seem advisable to transition it into microservices at this time. Nevertheless, it is evident that considerable time and consideration have been invested in this service, as well as in the other files pertaining to the contribution page, thus it would not be prudent to delete it. 

Based on this information, we are pausing the development of microservices for this service file.

Functional requirements document:
https://github.com/HGustavs/LenaSYS/blob/master/backend-models/functional-requirements/FRD_contribution_loginbox_service.md

<br>

__Contribution Service:__

- Based on the information given for the status of the Contribution Loginbox Service information, we are pausing the development of microservices for this service file.

<br>

__Courseed Service:__

- createNewCourse_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createCourseVersion_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateCourseVersion_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateActiveCourseVersion_courseed_ms.php __==finished==__ Previously named: "changeActiveCourseVersion_courseed_ms.php" 
- copyCourseVersion_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.
- updateCourse_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createMOTD_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- deleteCourseMaterial_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- retrieveCourseedService_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.

<br>

__Diagram Service:__

- _WORK PAUSED for development of microservices. Will continue when the service is fixed (group 1 is working on this)_

<br>

__Duggaed Service:__

- createDugga_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateDugga_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- deleteDugga_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- createDuggaVariant_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateDuggaVariant_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- deleteDuggaVariant_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- retrieveDuggaedService_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.


<br>

__Fileed Service:__

- deleteFileLink_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- updateFileLink_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- retrieveFileedService_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.

<br>

__Gitcommit Service:__

- getCourseID __==finished==__ New filename: "readCourseID_ms.php" according to new nameconvention based on CRUD.
- clearGitFiles_ms.php __==finished==__ New filename: "deleteGitFiles_ms.php" according to new nameconvention based on CRUD.  
- updateGithubRepo_ms.php __==UNFINISHED==__
- refreshGithubRepo_ms.php __==finished==__ The existing name should be retained based on the actual function of the microservice, even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice. The fact that "updateGithubRepo_ms.php" already exists is also a factor in this decision.  
- fetchOldToken_ms.php __==finished==__ New filename: "readGitToken_ms.php" according to new nameconvention based on CRUD.
- insertIntoSQLite_ms.php __==finished==__  New filename: "syncGitRepo_ms.php", even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice.
- newUpdateTime_ms.php __==finished==__ New filename: "updateTime_ms.php" according to new nameconvention based on CRUD.
- refreshCheck_ms.php __==finished==__ New filename: "updateThrottle_ms.php", vague connection to CRUD, more based on what the actual function of the code is.

__Observe, this microservices needs to be checked again to make sure they are working once group 3 has fixed the servicefile.__

<br>

__Gitfetch Service:__

- getGitHubURL_ms.php __==finished==__ New filename: "getGitHubAPIUrl_ms.php", even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice.
- getGitHubURLCommit_ms.php __==UNFINISHED==__ 
- insertToFileLink_ms.php __==finished==__ New filename: "createFileLinkEntry_ms.php" according to new nameconvention based on CRUD.
- insertToMetaData_ms.php __==finished==__ New filename: "createGitFilesMetadata_ms.php" according to new nameconvention based on CRUD.
- downloadToWebServer_ms.php __==finished==__ Should keep existing filename even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice.
- getIndexFile_ms.php __==finished==__ New filename: "readIndexFile_ms.php" according to new nameconvention based on CRUD. 
- bfs_ms.php __==finished==__ Should keep existing filename even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice.

This service does not include a _retrieveGitFetchService_ms.php_ because each function within _gitfetchService.php_ is used internally (not called from JavaScript) to retrieve or handle data concerning GitHub repositories that are linked. No general data is returned each time _gitfetchService.php_ is executed. Each function performs a distinct task and returns a specific type of data. Therefore, a retrieve microservice would be unnecessary.

__Observe, this microservices needs to be checked again to make sure they are working once group 3 has fixed the servicefile.__

<br>

__Highscore Service:__

- highscoreservice_ms.php __==finished==__ New filename: "readHighscore_ms.php" according to new nameconvention based on CRUD.
- retrieveHighscoreService_ms.php __==finished==__ Should keep existing filename even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice.

<br>

__Profile Service:__

- updateSecurityQuestion_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateUserPassword_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- retrieveProfileService_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.

<br>

__Resulted Service:__

- getUserAnswer_ms.php __==finished==__ New filename: "readUserAnswer_ms.php" according to new nameconvention based on CRUD.
- retrieveResultedService_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.

<br>

__Sectioned Service:__

- getGroupValues_ms.php __==finished==__ New filename: "readGroupValues_ms.php" according to new nameconvention based on CRUD.
- readCourseGroupsAndMembers_ms.php __==finished==__ Previously named: "getCourseGroupsAndMembers_ms.php".
- deleteListentries_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- removeListentries_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- createListentry_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateListEntryOrder_ms.php __==finished==__ Previously named: "reorderListEntries_ms.php".
- updateListentries_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- updateListentriesTabs_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD and the actual function of the ms.
- updateListentriesGradesystem_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateVisibleListentries_ms.php __==finished==__ Previously named: "setVisibleListentries_ms.php". 
- updateQuizDeadline_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateCourseVersion_sectioned_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- updateActiveCourseVersion_sectioned_ms.php __==finished==__ Previously named: "changeActiveCourseVersion_sectioned_ms.php".
- readCourseVersions_ms.php __==finished==__ Previously named: "getCourseVersions_ms.php". 
- getGitReference_ms.php __==UNFINISHED==__  
- readUserDuggaFeedback_ms.php __==finished==__ Previously named: "getUserDuggaFeedback_ms.php".
- createGithubCodeExample_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- getListEntries_ms.php __==finished==__ New filename: "readListEntries_ms.php" according to new nameconvention based on CRUD.
- retrieveSectionedService_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.


<br>

__Show Dugga Service:__

- updateActiveUsers_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD despite the mixed functions of the ms.
- processDuggaFile_ms.php __==finished==__ New filename: "processSubmittedDugga_ms.php", even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice. 
- saveDugga_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this particular case, a more general name is preferable as it better describes the microservice's function better.
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

### readUid_ms.php
__readUid_ms.php__ is primarily used for handling user identification and logging service events.

__Include original service files:__ sessions.php, basic.php, coursesyspw.php

__Session control:__ Checks if there is a user ID (uid) present in the current session. If an ID exists, it is used; otherwise, the user ID is set to "guest", indicating that the user is not logged in.

__Logging:__ Utilizes the information gathered to log a service event in the __serviceLogEntries__ table using the logServiceEvent function (defined in basic.php).

__Return of user ID:__ The function returns the user ID, which is either the actual user ID from the session or "guest".

__Conclusion:__ The purpose of the code is to ensure accurate identification and logging of users and their actions within the system.

<br>

---

<br>

### readUsername_ms.php
__readUsername_ms.php__ is used to retrieve a username from a specific userid (uid). 

__Include microservice:__ getUid_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'user'__ to retrieve the value of the column:
- username

```sql
SELECT username FROM user WHERE uid = :uid;
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
__Include microservice:__ getUid_ms.php, retrieveUsername_ms.php

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

### createNewListentry_ms.php
__Include microservice:__ retrieveUsername_ms.php

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
__updateActiveCourse_ms.php__ sets which version ID should be active for a specific course ID.

__Include original service files:__ basic.php

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
## ----------------------------- _accessedservice_ -----------------------------
---

<br>
<br>

### updateUser_ms.php
__Include original service files:__ sessions.php
__Include microservice:__ getUid_ms.php

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
__Include original service files:__ sessions.php
__Include microservice:__ getUid_ms.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php

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

### createUser_ms.php
__createUser_ms.php__ handles adding or updating user records and their enrollments in specific courses. The microservice checks if a user exists based on their username, creates new users if they don't exist, and then links them to courses in the database. If users already exist, it updates their course enrollment details. So this microservice is not a pure "create" operation but it is the main function.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php

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

---

<br>

### retrieveAccessedService_ms.php
__Include original service files:__ basic.php
__Include microservice:__ retrieveUsername_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the tables __user__ and __user_course__ to retrieve user details and calculate how many minutes ago each user was added:
- uid (as uid)
- username
- firstname
- lastname
- ssn
- access
- class
- modified
- vers
- requestedpasswordchange
- examiner
- groups
- TIME_TO_SEC(TIMEDIFF(now(), addedtime)) / 60 AS newly (Calculates the time difference between the current time and the addedtime value, converts this difference from seconds to minutes, and aliases it as value newly)

Condition:
- Filters records where cid value in __user_course__ table matches a specified value (placeholder :cid).
- Only selects values where the uid values in both tables match.

```sql
SELECT user.uid as uid,username,firstname,lastname,ssn,access,class,modified,vers,requestedpasswordchange,examiner,groups, TIME_TO_SEC(TIMEDIFF(now(),addedtime))/60 AS newly FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid;
```


_SELECT_ operation on the table __user_course__ to retrieve unique user IDs where access level is 'W':
- uid

- The operation retrieves uid value from the __user_course__ table for entries where the access level is equal to 'W'.
- It groups the results by uid value to ensure each user ID is listed only once, effectively filtering out duplicates and providing a list of unique users with 'W' access.

```sql
SELECT user_course.uid FROM user_course WHERE user_course.access = 'W' GROUP BY user_course.uid;
```


_SELECT_ operation on the table __'class'__ to retrieve all entries from the column:
- class

```sql
SELECT class FROM class;
```


_SELECT_ operation on the table __'groups'__ to retrieve values from the columns:
- groupval
- groupkind
- groupint

- The results are ordered first by the 'groupkind' column and then by the 'groupint' column.

```sql
SELECT groupval, groupkind, groupint FROM `groups` ORDER BY groupkind, groupint;
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

- The results are filtered to include only those entries where the 'cid' value matches a specified value (`:cid`), which is passed as a parameter to the query.

```sql
SELECT cid, coursecode, vers, versname, coursename, coursenamealt, startdate, enddate FROM vers WHERE cid=:cid;
```


_SELECT_ operation on the tables __'course'__, __'userAnswer'__, and __'vers'__ to retrieve values from the columns:
- cid (from 'course')
- uid (from 'userAnswer')
- vers (from 'vers')
- versname (from 'vers')

```sql
SELECT course.cid, uid, vers.vers, versname FROM course, userAnswer, vers WHERE course.cid=:cid AND course.cid=userAnswer.cid AND vers.vers=userAnswer.vers AND userAnswer.vers!=activeversion;
```
 
- The 'course.cid=:cid' ensures results are for a specific course ID.
- The 'course.cid=userAnswer.cid' joins the __'course'__ and __'userAnswer'__ tables on the course ID.
- The 'vers.vers=userAnswer.vers' joins the __vers__ and __userAnswer__ tables on the version number.
- The 'userAnswer.vers!=activeversion' filters out entries where the user's answer version is the current active version.

<br>
<br>

---
## ----------------------------- _codeviewerService_ -----------------------------
---

<br>
<br>

### updateCodeExampleTemplate_ms.php
__updateCodeExampleTemplate_ms.php__ is used on DuggaSys when you create a new code example for a course and chose a template to display that code. The microservice selects the selected template and retrieves a CSS-file containing the template to display on the page. The code for displaying different CSS-files can be found in codeviewerService.php and dugga.js.

__Include original service files:__ sessions.php, basic.php
__Include microservices:__ getUid_ms.php

__Querys used in this microservice:__


_UPDATE_ operation on the table __'codeexample'__ to update the value of the column:
- templateid

- Filters the records to update only those entries where the example ID ('exampleid'), course ID ('cid'), and course version ('cversion') match the specified parameters.

```sql
UPDATE codeexample SET templateid = :templateno WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;
```


_SELECT_ operation on the table __'box'__ to retrieve all columns:

- Filters the results to include only the records where the box ID ('boxid') matches the specified ':i' and the example ID ('exampleid') matches the specified ':exampleid'.

```sql
SELECT * FROM box WHERE boxid = :i AND exampleid = :exampleid;
```


_UPDATE_ operation on the table __'box'__ to update the values of the columns:
- boxcontent
- filename
- wordlistid

- Update is applied specifically to the box with the specified box ID (':i') and example ID (':exampleid'). 

```sql
UPDATE box SET boxcontent = :boxcontent, filename = :filename, wordlistid = :wordlistid WHERE boxid = :i AND exampleid = :exampleid;
```


_INSERT_ operation into the table __'box'__ to add a new row with values for the following columns:
- boxid
- exampleid
- boxtitle
- boxcontent
- settings
- filename
- wordlistid
- fontsize

```sql
INSERT INTO box(boxid, exampleid, boxtitle, boxcontent, settings, filename, wordlistid, fontsize) VALUES (:i, :exampleid, :boxtitle, :boxcontent, :settings, :filename, :wordlistid, :fontsize);
```

<br>

---

<br>

### updateCodeExample_ms.php
__updateCodeExample_ms.php__ handles updates of code examples.

__Include original service files:__ sessions.php, basic.php

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

### updateContentOfExample_ms.php
__Include original service files:__ sessions.php, basic.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php 

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php

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


### retrieveCodeViewerService_ms.php
__Include original service files:__ sessions.php, basic.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'codeexample'__ to retrieve values from the columns:
- exampleid
- sectionname
- examplename
- runlink
- cid
- cversion
- beforeid
- afterid
- public

```sql
SELECT exampleid, sectionname, examplename, runlink, cid, cversion, beforeid, afterid, public FROM codeexample WHERE exampleid = :exampleid;
```


_SELECT_ operation on the table __'codeexample'__ to retrieve values from the columns:
- exampleid
- examplename
- sectionname
- runlink
- public
- templateid (from the joined __'template'__ table, aliased as templateid)
- stylesheet (from the joined __'template'__ table)
- numbox (from the joined 'template' table)

Here are the conditions for the SQL query:

- The query joins the __'codeexample'__ table with the __'template'__ table based on matching 'templateid' values.
- The results are filtered by:
    -'exampleid = :exampleid' to make sure the data matches a certain example, and 'cid = :courseID' to limit the data to a specific course ID.

```sql
SELECT exampleid, examplename, sectionname, runlink, public, template.templateid AS templateid, stylesheet, numbox FROM codeexample LEFT OUTER JOIN template ON template templateid = codeexample.templateid WHERE exampleid = :exampleid AND cid = :courseID;
```


_SELECT_ operation on the table __'codeexample'__ to retrieve data:
- exampleid
- sectionname
- examplename
- beforeid
- afterid

- 'cid' matches the specified course ID.
- 'cversion' matches the specified course version.
- Results are sorted by 'sectionname' and 'examplename'.

```sql
SELECT exampleid, sectionname, examplename, beforeid, afterid FROM codeexample WHERE cid = :cid AND cversion = :cvers ORDER BY sectionname, examplename;
```


_SELECT_ operation on the table __'improw'__ to retrieve data:
- boxid
- istart
- iend

- The 'exampleid' matches the specified value provided by the parameter ':exampleid'. The results are then ordered by the 'istart' column.

```sql
SELECT boxid, istart, iend FROM improw WHERE exampleid = :exampleid ORDER BY istart;
```


_SELECT_ operation on the table __'word'__ to retrieve data:
- wordlistid
- word
- label

- Sorts the results by the 'wordlistid' column.

```sql
SELECT wordlistid, word, label FROM word ORDER BY wordlistid;
```


_SELECT_ operation on the table __'wordlist'__ to retrieve data:
- wordlistid
- wordlistname

- Sorts the results by the 'wordlistid' column.

```sql
SELECT wordlistid, wordlistname FROM wordlist ORDER BY wordlistid;
```


_SELECT_ operation on the table __'impwordlist'__ to retrieve data:
- word
- label

- The 'exampleid' matches the specified value provided by the parameter ':exampleid'. The results are then sorted alphabetically by the 'word' column.

```sql
SELECT word, label FROM impwordlist WHERE exampleid = :exampleid ORDER BY word;
```


_SELECT_ operation on the table __'fileLink'__ to retrieve data:
- fileid
- filename
- kind

- The 'cid' matches the specified value provided by the parameter ':cid'. The results are then sorted first by 'kind' in ascending order and then by 'filename' in ascending order.

```sql
SELECT fileid, filename, kind FROM fileLink WHERE cid = :cid ORDER BY kind, filename;
```


_SELECT_ operation on the table __'box'__ to retrieve data:
- boxid
- boxcontent
- boxtitle
- filename
- wordlistid
- segment
- fontsize

- The 'exampleid' matches the specified value provided by the parameter ':exampleid'. The results are then sorted in ascending order based on the 'boxid' column.

```sql
SELECT boxid, boxcontent, boxtitle, filename, wordlistid, segment, fontsize FROM box WHERE exampleid = :exampleid ORDER BY boxid;
```


_SELECT_ operation on the table __'fileLink'__ to retrieve data:
- filename
- path
- kind

- Where either the 'cid' matches the specified value provided by the parameter ':cid' or 'isGlobal' is '1', and where the filename matches the specified value provided by the parameter ':fname' (case-insensitive comparison). The results are ordered by 'kind' in descending order, and only the first row is returned.

```sql
SELECT filename, path, kind FROM fileLink WHERE (cid = :cid OR isGlobal = '1') AND UPPER(filename) = UPPER(:fname) ORDER BY kind DESC LIMIT 1;
```

<br>
<br>

---
## ----------------------------- _contribution_loginbox_service_ -----------------------------
---

<br>
<br>

_WORK PAUSED given the current non-functional state of this service._

<br>
<br>

---
## ----------------------------- _contributedservice_ -----------------------------
---

<br>
<br>

_WORK PAUSED given the current non-functional state of this service._

<br>
<br>

---
## ----------------------------- _courseedservice_ -----------------------------
---

<br>
<br>

### createNewCourse_ms.php
__Include original service files:__ sessions.php
__Include microservice:__ getUid_ms.php, retrieveUsername_ms.php, retrieveCourseedService_ms.php

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
__createCourseVersion_ms.php__ creates a new version of an existing course.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveUsername_ms.php, retrieveCourseedService_ms.php

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

### updateCourseVersion_ms.php
__Include original service files:__ sessions.php, basic.php, coursesyspw.php
__Include microservice:__ retrieveUsername_ms.php, retrieveCourseedService_ms.php

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
__updateActiveCourseVersion_courseed_ms.php__ takes an existing course and changes content of the activeversion column.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ __Include microservice:__ getUid_ms.php, retrieveCourseedService_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'course'__ to update the value of the column:
- activeversion

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid
```

<br>

---

<br>

### copyCourseVersion_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservices:__ getUid_ms.php, retrieveUsername_ms.php, retrieveCourseedService_ms.php, createNewListEntry_ms.php, createNewCodeExample_ms.php

__Querys used in this microservice:__

_INSERT_ operation on the table __'vers'__ to add a new row with values for the following columns:
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
INSERT INTO vers(cid, coursecode, vers, versname, coursename, coursenamealt, startdate, enddate, motd) VALUES (:cid, :coursecode, :vers, :versname, :coursename, :coursenamealt, :startdate, :enddate, :motd);
```


_SELECT_ operation on the table __'quiz'__ to retrieve all columns:

- Filters the results to include only those quiz records where the course ID ('cid') matches the specified ':cid' and the version ('vers') matches the specified ':oldvers'.

```sql
SELECT * FROM quiz WHERE cid=:cid AND vers = :oldvers;
```


_INSERT_ operation on the table __'quiz'__ to add a new row with values for the following columns based on a selected record:
- cid
- autograde
- gradesystem
- qname
- quizFile
- qrelease
- deadline
- relativedeadline
- modified
- creator
- vers

- Values for the new row are copied from an existing quiz record identified by ID ':oldid', with adjustments made to some values: release date (':qrel'), deadline (':deadl'), and version (':newvers').

```sql
INSERT INTO quiz (cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, relativedeadline, modified, creator, vers) 
SELECT cid, autograde, gradesystem, qname, quizFile, :qrel AS qrelease, :deadl AS deadline, relativedeadline, modified, creator, :newvers AS vers 
FROM quiz WHERE id = :oldid;
```


_SELECT_ operation on the table __'variant'__ to retrieve all columns:

- Filters the results to include only those variants where the 'quizID' matches the specified ':quizid'.

```sql
SELECT * FROM variant WHERE quizID=:quizid;
```


_INSERT_ operation into the table __'variant'__ to add a new row with values for the following columns based on a selected record:
- quizID
- param
- variantanswer
- modified
- creator
- disabled

- Where the values for the new row are copied from an existing variant record identified by ID ':oldvid'. The new entry will use the quiz ID ':newquizid'. 

```sql
INSERT INTO variant (quizID, param, variantanswer, modified, creator, disabled) SELECT :newquizid AS quizID, param, variantanswer, modified, creator, disabled FROM variant  WHERE vid = :oldvid;
```


_SELECT_ operation on the table __'codeexample'__ to retrieve all columns:

- Filters the results to include only those records where the course ID matches the specified ':cid' and the course version matches ':oldvers'. 

```sql
SELECT * FROM codeexample WHERE cid=:cid AND cversion = :oldvers;
```


_INSERT_ operation on the table __'codeexample'__ to add a new row with values for the following columns based on a selected record:
- cid
- examplename
- sectionname
- beforeid
- afterid
- runlink
- cversion
- public
- updated
- uid
- templateid

- The values for the new row are copied from an existing code example record identified by ID ':oldid'. The new entry will use the course version ':newvers'.

```sql
INSERT INTO codeexample (cid, examplename, sectionname, beforeid, afterid, runlink, cversion, public, updated, uid, templateid) SELECT cid, examplename, sectionname, beforeid, afterid, runlink, :newvers AS cversion, public, updated, uid, templateid FROM codeexample WHERE exampleid = :oldid;
```


_SELECT_ operation on the table __'box'__ to retrieve all columns:

- Filters the results to include only those records where the example ID matches the specified ':exampleid'.

```sql
SELECT * FROM box WHERE exampleid=:exampleid;
```


_INSERT_ operation on the table __'box'__ to add a new row with values for the following columns based on a selected record:
- boxid
- exampleid
- boxtitle
- boxcontent
- filename
- settings
- wordlistid
- segment
- fontsize

- Values for the new row are copied from a box identified by box ID (':oldboxid)' and example ID (':oldexampleid'). The new entry are using a new example ID ':newexampleid'.

```sql
INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, segment, fontsize) SELECT boxid, :newexampleid AS exampleid, boxtitle, boxcontent, filename, settings, wordlistid, segment, fontsize FROM box WHERE boxid = :oldboxid AND exampleid = :oldexampleid;
```


_SELECT_ operation on the table __'improw'__ to retrieve all columns:

- Filters the results to include only those records where the example ID matches the specified ':oldexampleid'.

```sql
SELECT * FROM improw WHERE exampleid=:oldexampleid;
```


_INSERT_ operation on the table __'improw'__ to add a new row with values for the following columns based on a selected record:
- boxid
- exampleid
- istart
- iend
- irowdesc
- updated
- uid

- The values for the new row are copied from an existing 'improw' record and identified by: example ID (':oldexampleid'), impid (':oldimpid'), and box ID (:oldboxid'). The new entry will use the new example ID ':newexampleid'. 

```sql
INSERT INTO improw (boxid, exampleid, istart, iend, irowdesc, updated, uid) SELECT boxid, :newexampleid AS exampleid, istart, iend, irowdesc, updated, uid
FROM improw WHERE exampleid = :oldexampleid AND impid = :oldimpid AND boxid = :oldboxid;
```


_SELECT_ operation on the table __'impwordlist'__ to retrieve all columns:

- Filters the results to include only those records where the example ID matches the specified ':oldexampleid'. 

```sql
SELECT * FROM impwordlist WHERE exampleid=:oldexampleid;
```


_INSERT_ operation into the table __'impwordlist'__ to add a new row with values for the following columns based on a selected record:
- exampleid
- word
- label
- updated
- uid

- The values for the new row are copied from an existing 'impwordlist' record identified by example ID ':oldexampleid' and word ID ':oldwordid'. The new entry will use the new example ID ':newexampleid'.

```sql
INSERT INTO impwordlist (exampleid, word, label, updated, uid) SELECT :newexampleid AS exampleid, word, label, updated, uid FROM impwordlist WHERE exampleid = :oldexampleid AND wordid = :oldwordid;
```


_SELECT_ operation on the table __'listentries'__ to retrieve all columns:

- Filters the results to include only those records where the version identifier ('vers') matches the specified ':oldvers'. 

```sql
SELECT * FROM listentries WHERE vers = :oldvers;
```


_INSERT_ operation on the table __'listentries'__ to add a new row with values for the following columns based on a selected record:
- cid
- entryname
- link
- kind
- pos
- creator
- ts (timestamp)
- code_id
- visible
- vers
- moment
- gradesystem
- highscoremode

- The values for the new row are copied from an existing 'listentries' record identified by list ID (':olid'). The new entry will use the version identifier ':gubbe'.

```sql
INSERT INTO listentries (cid, entryname, link, kind, pos, creator, ts, code_id, visible, vers, moment, gradesystem, highscoremode) SELECT cid, entryname, link, kind, pos, creator, ts, code_id, visible, :gubbe AS vers, moment, gradesystem, highscoremode FROM listentries WHERE lid = :olid;
```


_UPDATE_ operation on the table __'listentries'__ to update the value of the column:
- moment

- The update only affects the 'listentries' records where 'moment' matches the specified ':oldmoment' and the version matches ':updvers'. 

```sql
UPDATE listentries SET moment=:nyttmoment WHERE moment=:oldmoment AND vers=:updvers;
```


_UPDATE_ operation on the table __'listentries'__ to update the value of the column:
- link

- The update only affects the 'listentries' records where 'link' matches the specified ':oldquiz' and the version matches ':updvers'. 

```sql
UPDATE listentries SET link=:newquiz WHERE link=:oldquiz AND vers=:updvers;
```


_UPDATE_ operation on the table __'listentries'__ to update the value of the column:
- link

- The update only affects 'listentries' records where 'link' is equal to ':oldexample' and the version equals ':updvers'. 

```sql
UPDATE listentries SET link=:newexample WHERE link=:oldexample AND vers=:updvers;
```


_UPDATE_ operation on the table __'codeexample'__ to update the value of the column:
- beforeid

- The update only affects 'codeexample' records where the 'beforeid' matches ':oldexample' and the course version matches ':updvers'. 

```sql
UPDATE codeexample SET beforeid=:newexample WHERE beforeid=:oldexample AND cversion=:updvers;
```


_UPDATE_ operation on the table __'codeexample'__ to update the value of the column:
- afterid

- The update only affects 'codeexample' records where 'afterid' matches ':oldexample' and the course version matches ':updvers'.

```sql
UPDATE codeexample SET afterid=:newexample WHERE afterid=:oldexample AND cversion=:updvers;
``` 


_SELECT_ operation on the table __'userAnswer'__ to retrieve all columns:

- Filters the results to include only those records where the version ('vers') matches the specified ':oldvers'. 

```sql
SELECT * FROM userAnswer WHERE vers = :oldvers;
```


_INSERT_ operation on the table __'userAnswer'__ to add a new row with values for the following columns based on a selected record:
- cid
- quiz
- variant
- moment
- grade
- uid
- useranswer
- submitted
- marked
- vers
- creator
- score

- The values for the new row are copied from an existing 'userAnswer' record identified by ID (':olaid'). The new entry will use the new version identifier (':man').

```sql
INSERT INTO userAnswer (cid, quiz, variant, moment, grade, uid, useranswer, submitted, marked, vers, creator, score) SELECT cid, quiz, variant, moment, grade, uid, useranswer, submitted, marked, :man AS vers, creator, score FROM userAnswer WHERE aid = :olaid;
```


_UPDATE_ operation on the table __'userAnswer'__ to update the value of the column:
- moment

- The update only affects the 'userAnswer' records where 'moment' matches the specified ':oldmoment' and the version matches ':updvers'. 

```sql
UPDATE userAnswer SET moment=:nyttmoment WHERE moment=:oldmoment AND vers=:updvers;
```


_UPDATE_ operation on the table __'userAnswer'__ to update the value of the column:
- quiz

- The update only applies to 'userAnswer' records where the 'quiz' identifier matches the specified ':oldquiz' and the version matches ':updvers'. 

```sql
UPDATE userAnswer SET quiz=:newquiz WHERE quiz=:oldquiz AND vers=:updvers;
```


_UPDATE_ operation on the table __'course'__ to update the value of the column:
- activeversion

- The update only affects the 'course' record where the course ID ('cid') matches the specified ':cid'. 

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid;
```

<br>

---

<br>

### updateCourse_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ retrieveUsername_ms.php, retrieveCourseedService_ms.php

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
__createMOTD_ms.php__ is called upon when the message of the day is changed in the page associated with courseed.
The user must be a super user to be able to do this!

__Include original service files:__ sessions.php
__Include microservice:__ getUid_ms.php, retrieveCourseedService_ms.php


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
__deleteCourseMaterial_ms.php__ deletes all courses and course material where visibility is 3.

__Include original service files:__ sessions.php
__Include microservice:__ retrieveCourseedService_ms.php

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

### retrieveCourseedService_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php

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


This microservice gathers information and organizes it into an array that shows details about courses, their versions, access rights, and other settings. It checks who can see and use different parts of the system, removes courses that are no longer needed, and reports any problems it finds. 

- __LastCourseCreated__ - When the last course was created.

- __Entries__- List of courses. Including: course ID ('cid'), course name ('coursename'), course code ('coursecode'), visibility status ('visibility'), and active versions. It also indicates whether a user is registered for each course. 

- __Versions__- Information about the different versions of the courses available. Inncluding: course version identifier ('vers'), version name ('versname'), and associated course names ('coursename' and 'coursenamealt'). 

- __Debug__ - Debugging information. If anything goes wrong during the database operations. For example, it may include details of database errors captured when an SQL query fails to execute correctly.

- __WriteAccess__ - Whether the user has write access ('ha) or not, important for determining if the user can modify course information.

- __MOTD (Message of the Day)__ - Displays notices or updates like general information, specific details relevant to daily operations or critical alerts.

- __Readonly__- Whether the system is currently in a readonly mode not or. This affects how users can interact with the system's features and data.


<br>
<br>

---
## ----------------------------- _diagramservice_ -----------------------------
---

<br>
<br>

_WORK PAUSED for development of microservices. Will continue when the service is fixed (group 1 is working on this)_

<br>
<br>

---
## ----------------------------- _duggaedservice_ -----------------------------
---

<br>
<br>

### createDugga_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveDuggaedService_ms.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ retrieveDuggaedService_ms.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveDuggaedService_ms.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveDuggaedService_ms.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveDuggaedService_ms.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveDuggaedService_ms.php

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

---

<br>

### retrieveDuggaedService_ms.php
__Include original service files:__ sessions.php, basic.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'course'__ to retrieve values from the columns:
- coursename
- coursecode
- cid

- Only shows details for the specified course ID (':cid').
- Returns only the first matching record to ensure a single result is shown.

```sql
SELECT coursename, coursecode, cid FROM course WHERE cid=:cid LIMIT 1;
```


_SELECT_ operation on the table __'quiz'__ to retrieve values from the columns:
- id
- cid
- autograde
- gradesystem
- qname
- quizFile
- qstart
- deadline
- qrelease
- modified
- vers
- jsondeadline

- Filters results for quizzes specific to a given course ID (':cid') and course version (':coursevers').
- Sorts the results by the quiz ID to ensure they are listed in ascending order. 

```sql
SELECT id, cid, autograde, gradesystem, qname, quizFile, qstart, deadline, qrelease, modified, vers, jsondeadline FROM quiz WHERE cid=:cid AND vers=:coursevers ORDER BY id;
```


_SELECT_ operation on the table __'variant'__ to retrieve values from the columns:
- vid
- quizID
- param
- variantanswer
- modified
- disabled

- Filters results to only include values that belong to a specific quiz ID (:qid').
- Sorts the results by the variant ID in ascending order.

```sql
SELECT vid, quizID, param, variantanswer, modified, disabled FROM variant WHERE quizID=:qid ORDER BY vid;
```

<br>
<br>

---
## ----------------------------- _fileedservice_ -----------------------------
---

<br>
<br>

### deleteFileLink_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveFileedService_ms.php

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

### updateFileLink_ms.php
__updateFileLink_ms.php__ handles writing to files and updates filesize in fileLink.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveUsername_ms.php, retrieveFileedService_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'fileLink'__ to update the value of the columns:
- filesize
- uploaddate (set to the current date and time)

```sql
UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE kind=:kindid AND filename=:filename;
```


_UPDATE_ operation on the table __'fileLink'__ to update the values of the columns:
- filesize
- uploaddate (set to the current date and time)

```sql
UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE cid=:cid AND kind=:kindid AND filename=:filename;
```


_UPDATE_ operation on the table __'fileLink'__ to update the values of the columns:
- filesize
- uploaddate (set to the current time)

```sql
UPDATE fileLink SET filesize=:filesize, uploaddate=NOW() WHERE vers=:vers AND cid=:cid AND kind=:kindid AND filename=:filename;
```


<br>

---

<br>

### retrieveFileedService_ms.php
__Include original service files:__ basic.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'fileLink'__ to retrieve all columns:

- Filters the results to include entries where:
  - The 'kind' is 2, or
  - The 'cid' matches the specified course ID (':cid') and 'vers' is not set (null), or
  - The 'cid' matches the specified course ID (':cid') and 'vers' matches the specified version (':vers').
  - Sorts the results first by the 'kind' column and then by 'filename'.

```sql
SELECT * FROM fileLink WHERE kind=2 OR (cid=:cid AND vers is null) OR (cid=:cid AND vers=:vers) ORDER BY kind, filename;
```

<br>
<br>

---
## ----------------------------- _gitCommitService_ -----------------------------
---

<br>
<br>

### readCourseID_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ insertIntoSQLite_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'course'__ to retrieve the value of the column:
- cid

```sql
SELECT cid FROM course WHERE courseGitURL = :githubURL;
```

<br>

### deleteGitFiles_ms.php
__deleteGitFiles_ms.php__ clear the gitFiles table in SQLite db when a course has been updated with a new github repo.

__Include original service files:__ sessions.php, basic.php

_DELETE_ operation on the table __'gitFiles'__ to remove records where:
- 'cid' matches the specified course ID (':cid').

```sql
DELETE FROM gitFiles WHERE cid = :cid;
```

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

__Include original service files:__ sessions.php, basic.php, gitfetchService.php
__Include microservice:__ refreshCheck_ms.php, clearGitFiles_ms.php

__Querys used in this microservice:__

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

<br>

---

<br>

### readGitToken_ms.php
__Includes neither original service files nor microservices.__

__Querys used in this microservice:__ 


_SELECT_ operation on the table __'gitRepos'__ to retrieve the value of the column:
- gitToken

```sql
SELECT gitToken FROM gitRepos WHERE cid=:cid;
```

<br>

---

<br>

### syncGitRepo_ms.php
__Include original service files:__ sessions.php, basic.php, gitfetchService.php

__Querys used in this microservice:__

_INSERT OR REPLACE_ operation on the table __'gitRepos'__. It inserts a new record or replaces an existing record into the following columns:
- cid
- repoName
- repoURL
- lastCommit
- gitToken

- The operation ensures that if a record already exists with the same primary key ('cid'), it is replaced with the new values; otherwise, a new record is created.

```sql
INSERT OR REPLACE INTO gitRepos (cid, repoName, repoURL, lastCommit, gitToken) VALUES (:cid, :repoName, :repoURL, :lastCommit, :gitToken)
```

<br>

---
<br>


### updateTime_ms.php
__updateTime_ms.php__ updates the MySQL database to save the latest update time.

__Includes neither original service files nor microservices.__

__Querys used in this microservice:__

_UPDATE_ operation on the table __'course'__ to update the value of the column:
- updated

```sql
UPDATE course SET updated=:parsedTime WHERE cid=:cid;
```

<br>

---
<br>


### updateThrottle_ms.php
__updateThrottle_ms-php__ checks if database updates for a course are allowed by comparing the last update time against predefined intervals and user privileges. It enforces cooldowns using session variables to prevent too frequent updates. Superusers are granted shorter update intervals.

__Include original service files:__ sessions.php, basic.php
__Include microservices:__ newUpdateTime_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'course'__ to retrieve the value of the column:
- updated

```sql
SELECT updated FROM course WHERE cid = :cid;
```


<br>
<br>

---
## ----------------------------- _gitfetchService_ -----------------------------
---

<br>
<br>

### getGitHubAPIUrl_ms.php
__getGitHubAPIUrl_ms.php__ transforms a standard GitHub repository URL into an API URL format. This function extracts the username and repository name from the provided URL, and constructs an API URL that targets the repository's contents.

__Include original service files:__ sessions.php, basic.php

__API URL Construction:__ It builds a new URL using GitHub's API format to access repository contents.

__Return of API URL:__ The function outputs a GitHub API URL, suitable for API requests to access repository files.

__Conclusion:__ The function simplifies accessing GitHub repository data through API calls by generating correct API URLs.

<br>

---

<br>

### getGitHubURLCommit_ms.php

_WORK PAUSED for development of this microservice. Will continue when the service is fixed (group 3 is working on this)._

<br>

---

<br>

### createFileLinkEntry_ms.php
__createFileLinkEntry_ms.php__ checks if a file with the same details already exists in the database and, if not, it inserts a new record with those details.

__Include original service files:__ sessions.php, basic.php, gitfetchService.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'fileLink'__ to count the number of entries where:
- `cid` matches `:cid`
- `filename` matches `:filename`
- `kind` matches `:kindid`
- `path` matches `:filePath`

```sql
SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=:kindid AND path=:filePath;
```


_INSERT_ operation on the table __'fileLink'__ to insert values into the columns:
- filename
- path
- kind
- cid
- filesize

```sql
INSERT INTO fileLink(filename, path, kind, cid, filesize) VALUES(:filename, :filePath, :kindid, :cid, :filesize)
```

<br>

---

<br>

### createGitFilesMetadata_ms.php
__createGitFilesMetadata_ms.php__ inserts data into metadata2.db (SQLite, not MYSQL)

__Include original service files:__ sessions.php, basic.php

__Querys used in this microservice:__

_INSERT_ operation on the table __'gitFiles'__ to add new entries with values for the columns:
- cid
- fileName
- fileType
- fileURL
- downloadURL
- fileSHA
- filePath

```sql
INSERT INTO gitFiles (cid, fileName, fileType, fileURL, downloadURL, fileSHA, filePath) VALUES (:cid, :fileName, :fileType, :fileURL, :downloadURL, :fileSHA, :filePath)
```

<br>

---

<br>

### downloadToWebServer_ms.php
__Include original service files:__ sessions.php, basic.php, gitfetchService.php

__Querys used in this microservice:__

Includes no querys.

__Function operation:__ Fetches the contents of a file from a remote URL and then saves it to a specified path on the server. Creates necessary directories if they do not exist and writes the file data to the local system.

__Result handling:__ Errors in retrieving or saving the file are logged in __gitErrorLog.txt__-log file, including details of the failure and relevant URLs or paths.

__Purpose:__ This function automates the updating and storage of files from GitHub repositories to a web server.

<br>

---

<br>

### readIndexFile_ms.php
__readIndexFile_ms.php__ retrieves the contents of an index file from a specific URL. It appends `/index.txt` to the URL, uses cURL to make a request, and processes the response.

__Includes neither original service files nor microservices.__

__Function operation:__ It constructs a URL for an index file, sends a request using cURL, and checks the response code.

__Result handling:__ If the server responds with a 200 OK status, it reads and returns the contents of the file. If not, it returns false.

__Purpose:__ The function is designed to fetch and read an index file from a remote location, simplifying data retrieval from external servers.

<br>

---

<br>

### bfs_ms.php
BFS (breadth-first search) 

__Function operation:__ The function navigates through a GitHub repository using a Breadth-First Search (BFS) approach.

__GitHub API requests:__ It constructs API URLs and sends requests to GitHub's API, optionally including a token for authentication.

__Data dandling:__ The function processes the API responses, extracting file and directory information.

__File and directory processing:__ Files are stored in a database and may be downloaded, while directories are further explored.

__Error handling:__ Errors, like connection failures or invalid responses, are logged for debugging.

__Conclusion:__ bfs_ms.php manages repository traversal, file handling, and error logging for GitHub repositories.

__Includes neither original service files nor microservices.__

__Querys used in this microservice:__

_SELECT_ operation on the table __'gitRepos'__ to retrieve the value of the column:
- gitToken

```sql
SELECT gitToken FROM gitRepos WHERE cid=:cid
```

<b>
<br>

---
## ----------------------------- _highscoreservice_ -----------------------------
---

<br>

### readHighscore_ms.php
__readHighscore_ms.php__ is managing user sessions, handling errors, fetching highscores (through 'retrieveHighscoreService_ms.php'), and communicating these results back to the client.

__Include original service files:__ sessions.php, basic.php
__Include microservices:__ retrieveHighscoreService_ms.php 

__Includes neither original service files nor microservices.__


__Session management:__ Checks if a user is logged in by checking the user's ID in the session. If no user ID is found, it defaults to "1", indicating that the user is not logged in. This is used for determining which user's scores to retrieve or verify if the user has permission to see highscores. 

__Debugging:__ Initially set to "NONE!". Sshow any errors or important notes about how the database operations went. 

__Calling 'retrieveHighscoreService_ms.php':__ This function handles the actual retrieval of scores. 'readHighscore_ms.php' passes necessary parameters ($pdo, $duggaid, $variant, $debug) to 'retrieveHighscoreService_ms.php', which then queries the database and fetches the scores.

__Results:__ After fetching the scores, the result is formated into an array and then encoded into JSON. It´s then sen back to the client. The JSON data includes the highscores and relevant debugging information.

<br>

---

<br>

### retrieveHighscoreService_ms.php
__readHighscore_ms.php__ retrieves highscore lists based on user results and provides specific feedback to logged-in users about their ranking.

__Include original service files:__ sessions.php, basic.php


__Highscores:__ Collects the best scores from users who have successfully passed a section of a quiz. It pulls these scores from a database and lists each user's name along with their score for the specific quiz and section.

__User:__ Checks if the score of the person currently logged in is among the top scores. If it is, their position is noted in the list. If not, the function runs another query to find and report that user’s own score separately.

__Debug:__ Provides details about any problems encountered during the services operation. This could include error messages from failed SQL queries. 


__Querys used in this microservice:__

 _SELECT_ operation on the tables __'userAnswer'__ and __'user'__ to retrieve the columns:
- username
- score

- Filters records where the 'grade' column in 'userAnswer' is greater than 1.
- Filters records where the 'quiz' column in 'userAnswer' matches (':did') and the 'moment' column matches (':lid').
- Results are ordered by the 'score' in ascending order.
- Limits the results to the top 10 records based on the ascending order of 'score'.

__Note, the query only selects scores associated with users that have returned a dugga with a passing grade (i.e. 1).__

```sql
SELECT username, score FROM userAnswer, user WHERE userAnswer.grade > 1 AND userAnswer.quiz = :did AND userAnswer.moment = :lid ORDER BY score ASC LIMIT 10;
```


_SELECT_ operation on the tables __'userAnswer'__ and __'user'__ to retrieve the columns:
- username
- score

- Filters records where the 'quiz' column in the table 'userAnswer' matches (':did') and the 'moment' column matches (':lid').
- The query limits the results to just one record.

```sql
SELECT username, score FROM userAnswer, user WHERE userAnswer.quiz = :did AND userAnswer.moment = :lid LIMIT 1;
```

<br>
<br>

---
## ----------------------------- _profileservice_ -----------------------------
---

<br>
<br>

ProfileService handles password changes and challenge questions. To access these functions, the user clicks on their profile when logged in.

#### updateSecurityQuestion_ms.php
__updateSecurityQuestion_ms.php__ handles the updating of security questions for users. Changes to security questions are permitted only for non-superuser/non-teacher users and only if the correct password is entered.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveProfileService_ms.php

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

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveProfileService_ms.php

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

---

<br>

### retrieveProfileService_ms.php

__Includes neither original service files nor microservices.__

__Querys used in this microservice:__

Includes no querys.


The __retrieveProfileService_ms.php__ returns an array containing three key values (information about):

- __success__ - ('true' or 'false') indicating whether the user's request to update the password or security question was successful or not. 'true' means the update was successful, and 'false' means it failed for some reason.

- __status__ - Indicating the user's status or the outcome of the operation. Possible values include:
   - "teacher" - The user is a teacher or superuser and is not allowed to change their password or security question.
   - "wrongpassword" - The provided password does not match the one in the database.
   - An empty string ('""') if no specific statuses occur during the process.

- __debug__ - Debugging information. If anything goes wrong during the database operations. For example, it may include details of database errors captured when an SQL query fails to execute correctly.

The microservice provide direct feedback from the server about the result of the requested operation (either changing the password or security question).

<br>
<br>

---
## ----------------------------- _resultedservice_ -----------------------------
---

<br>
<br>

### readUserAnswer_ms.php
__readUserAnswer_ms.php__ manages and presents information about submitted duggor.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveResultedService_ms.php

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

---

<br>

### retrieveResultedService_ms.php
__Includes neither original service files nor microservices.__

__retrieveResultedService_ms.php__ returns an array containing two key values (information about):

- tableInfo - An array containing information about each student submission related to a specific course version. For each submission found in the database, the following information is stored in this array:
   - __duggaName__ - The name of the assignment associated with the data.
   - __hash__ - A unique hash value for the collection.
   - __password__ - The password associated with the collection.
   - __teacher_visited__ - The last time a teacher visited the collection.
   - __submitted__ - Whether the assignment has been submitted.
   - __timesSubmitted__ - The number of times the assignment has been submitted.
   - __timesAccessed__ - The number of times the assignment has been accessed.
   - __subCourse__ - The name of the sub-course, if applicable.
   - __link__ - 

- duggaFilterOptions - An array of filter options used to organize and filter the submissions based on different criterias.
   - __entryname__ - The name of the entry.
   - __kind__ - The type of entry.
   - __lid__ - Link ID.
   - __moment__ - 

The microservice provides feedback about submissions and associated metadata for a course.

<br>
<br>

---
## ----------------------------- _sectionedservice_ -----------------------------
---

<br>
<br>

### readGroupValues_ms.php
__readGroupValues_ms.php__ is called upon when a group is clicked on.

__Include original service files:__ sessions.php
__Include microservices:__ getUid_ms.php, retrieveSectionedService_ms.php

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
__readCourseGroupsAndMembers_ms.php__ returns a list of group member related to the provided course id and course version.

__Include original service files:__ sessions.php, basic.php, coursesyspw.php
__Include microservice:__ retrieveSectionedService_ms.php

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
Listentries are duggas, headers, tests etc. __deleteListentries_ms.php__ DELETES listentries from the database. Should not be confused with the microservice removeListentries (that changes to visible value of the listentrie to "hide" it. This will enable restoring deleted items).

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

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

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'listentries'__ to update rows where:

- The 'lid' value in the __'listentries'__ table matches the value bound to :lid.
- Set: The 'visible' value in the 'listentries' table to '3'.

<br>

---

<br>

### createListentry_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveUsername_ms.php, createNewListentry_ms.php, createNewCodeExample_ms.php, retrieveSectionedService_ms.php

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

### updateListEntryOrder_ms.php
Updates the order of the listentries of a course. Not to be confused with __updateListentrie_ms.php__.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

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

### updateListentries_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

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
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'listentries'__ to update the value of the column:
- gradesystem

```sql
UPDATE listentries SET gradesystem=:gradesys WHERE lid=:lid;
```

<br>

---

<br>

### updateVisibleListentries_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

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
__updateQuizDeadline_ms.php__ updates the deadline for a quiz (also referred to as a dugga).

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ retrieveSectionedService_ms.php

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

### updateCourseVersion_sectioned_ms.php
__updateCourseVersion_sectioned_ms.php__ is used for editing a course version. The user must either have write permissions, be a superuser, or be a teacher.

__Include original service files:__ sessions.php, basic.php
__Include microservices:__ getUid_ms.php, retrieveUsername_ms.php, setAsActiveCourse_ms.php, retrieveSectionedService_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'vers'__ to update the values of the columns:
- versname
- startdate
- enddate
- motd

- Where the course ID ('cid'), course code ('coursecode'), and version number ('vers') match the specified parameters. 

```sql
UPDATE vers SET versname=:versname, startdate=:startdate, enddate=:enddate, motd=:motd WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;
```

<br>

---

<br>

### updateActiveCourseVersion_sectioned_ms.php
__updateActiveCourseVersion_sectioned_ms.php__ updates the active version of a course.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ retrieveSectionedService_ms.php

__Querys used in this microservice:__

_UPDATE_ operation on the table __'course'__ to update the value of the column:
- activeversion

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid
```

<br>

---

<br>

### readCourseVersions_ms.php
__readCourseVersions_ms.php__ fetches all course versions.

__Include original service files:__ sessions.php
__Include microservice:__ getUid_ms.php

__Querys used in this microservice:__

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
SELECT cid, coursecode, vers, versname, coursename, coursenamealt, startdate, enddate, motd FROM vers;
```

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

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ retrieveSectionedService_ms.php

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

### createGithubCodeExample_ms.php
__createGithubCodeExample_ms.php__ creates new code examples if they are not already stored in the database and updates existing code examples if they are.

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, createNewCodeExample_ms.php, createNewListEntry_ms.php, retrieveSectionedService_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'listentries'__ to retrieve the values of the columns:
- cid
- githubDir
- vers

- Selects rows where the column 'lid' matches the provided value ':lid'.

```sql
SELECT cid, githubDir, vers FROM listentries WHERE lid=:lid;
```


_SELECT_ operation on the table __'codeexample'__ to retrieve the value of the column:
- count (the number of rows that match the conditions)

- Selects rows where the column 'cid' matches the provided value ':cid'.
- And the column 'examplename' matches the provided value ':examplename'.
- And the column 'cversion' matches the provided value ':vers'.

```sql
SELECT COUNT(*) AS count FROM codeexample WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;
```


_SELECT_ operation on the table __'listentries'__ to retrieve the value of the column:
- pos

- Selects rows where the column 'cid' matches the provided value ':cid'.
- Orders the results by the column 'pos' in descending order.

```sql
SELECT pos FROM listentries WHERE cid=:cid ORDER BY pos DESC;
```


_SELECT_ operation on the table __'codeexample'__ to retrieve the value of the column:
- LatestExID (the maximum value of 'exampleid')

```sql
SELECT MAX(exampleid) as LatestExID FROM codeexample;
```


_INSERT_ operation on the table __'box'__ to insert values into the columns:
- boxid
- exampleid
- boxtitle
- boxcontent
- filename
- settings
- wordlistid
- fontsize

```sql
INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, :settings, :wordlistid, :fontsize);
```


_SELECT_ operation on the table __'codeexample'__ to retrieve the value of the column:
- exampleid (renamed as 'eid')

- Selects rows where the column 'cid' matches the provided value ':cid'.
- And the column 'examplename' matches the provided value ':examplename'.
- And the column 'cversion' matches the provided value ':vers'.

```sql
SELECT exampleid AS eid FROM codeexample WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;
```


_SELECT_ operation on the table __'box'__ to retrieve the value of the column:
- boxCount (the number of rows that match the condition)

- Selects rows where the column 'exampleid' matches the provided value 'eid'.

```sql
SELECT COUNT(*) AS boxCount FROM box WHERE exampleid=:eid;
```


_SELECT_ operation on the table __'gitFiles'__ to retrieve the values of all columns:

- Selects rows where the column 'cid' matches the provided value ':cid'.
- And the column 'fileName' matches the provided pattern ':fileName'.

```sql
SELECT * FROM gitFiles WHERE cid = :cid AND fileName LIKE :fileName;
```


_UPDATE_ operation on the table __'listentries'__ to update the value of the column:
- visible

- Updates rows where the column 'cid' matches the provided value ':cid'.
- And the column 'vers' matches the provided value ':cvs'.
- And the column 'entryname' matches the provided value ':entryname'.

```sql
UPDATE listentries SET visible=:visible WHERE cid=:cid AND vers=:cvs AND entryname=:entryname;
```


_SELECT_ operation on the table __'box'__ to retrieve the value of the column:
- filename

- Selects rows where the column 'exampleid' matches the provided value ':eid'.

```sql
SELECT filename FROM box WHERE exampleid = :eid;
```


_SELECT_ operation on the table __'box'__ to retrieve the value of the column:
- boxid (renamed as 'bid')

- Selects rows where the column 'exampleid' matches the provided value ':eid'.
- And the column 'filename' matches the provided value ':boxName'.

```sql
SELECT boxid AS bid FROM box WHERE exampleid = :eid AND filename = :boxName;
```


_DELETE_ operation on the table __'box'__ to delete rows where the conditions are met.

- Deletes rows where the column 'exampleid' matches the provided value ':eid'.
- And the column 'filename' matches the provided value ':boxName'.

```sql
DELETE FROM box WHERE exampleid = :eid AND filename = :boxName;
```


_UPDATE_ operation on the table __'box'__ to update the value of the column:
- boxid

- Updates rows where the column 'exampleid' matches the provided value ':eid'.
- And the column 'boxid' matches the provided value ':oldBoxID'.

```sql
UPDATE box SET boxid=:newBoxID WHERE exampleid = :eid AND boxid=:oldBoxID;
```


_UPDATE_ operation on the table __'codeexample'__ to update the value of the column:
- templateid

- Updates rows where the column 'exampleid' matches the provided value ':eid'.

```sql
UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;
```



_SELECT_ operation on the table __'box'__ to retrieve the value of the column:
- filename

- Selects rows where the column 'exampleid' matches the provided value ':eid'.

```sql
SELECT filename FROM box WHERE exampleid = :eid;
```


_SELECT_ operation on the table __'box'__ to retrieve the maximum value of the column:
- boxid

- Selects rows where the column 'exampleid' matches the provided value ':eid'.

```sql
SELECT MAX(boxid) FROM box WHERE exampleid = :eid;
```


_INSERT_ operation on the table __'box'__ to insert values into the columns:
- boxid
- exampleid
- boxtitle
- boxcontent
- filename
- settings
- wordlistid
- fontsize

```sql
INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, :settings, :wordlistid, :fontsize);
```


_UPDATE_ operation on the table __'codeexample'__ to update the value of the column:
- templateid

- Updates rows where the column 'exampleid' matches the provided value ':eid'.

```sql
UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;
```

<br>

---

<br>

### readListEntries_ms.php
__Include original service files:__ sessions.php, basic.php
__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

__Includes neither original service files nor microservices.__


- __List entries:__ An array containing __all__ list entries for the specified course version (__coursevers__) and course ID (__courseid__).

- __JSON format:__ The retrieved data from 'retrieveSectionedService_ms.php' is returned in a JSON format.

- __Debugging:__ Includes debugging information (__debug__) if there are any issues during the retrieval process.

Parameters passed to 'retrieveSectionedService_ms.php':

- __debug__ - Starts as "NONE!" to collect any debug info.
- __opt__ - Operation option from the request.
- __pdo__ - PDO database connection.
- __uid__ - ID of the logged-in user.
- __courseid__ - Course ID to get list entries for.
- __coursevers__ - Course version to get list entries for.
- __log_uuid__ - Unique ID to track the request.

<br>

---

<br>

### retrieveSectionedService_ms.php

__Include original service files:__ sessions.php, basic.php
__Include microservice:__ readCourseVersions_ms.php

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


The microservice gathers and organizes information into an array that provides details about courses, their versions, quizzes, user interactions, and permissions settings. It supports the interface by delivering information needed to correctly display and manage course content and student interactions. It´s basically gathering and sharing information about courses with users, making sure it fits what they are allowed to see and do.

- __Entries__ - Lists courses with details such as course ID ('cid'), course name ('coursename'), course code ('coursecode'), and visibility status. It also indicates whether a user is registered for each course and provides information on active versions.

- __Versions__- Includes information on the different versions of the courses available, identification details for each version of a course such as ('vers'), version names ('versname'), and associated course names ('coursename' and 'coursenamealt').

-__Quizzes and assignments__ - Information about quizzes and assignments for each course version, including names, release dates, deadlines, and relative deadlines.

- __User-specific data__ - Personalized data such as group memberships, submitted assignments, grades, and feedback on user performance.

- __Permissions__ - Checks and confirms user permissions to ensure appropriate access to course information based on the user's role.

- __Supporting resources__ - Manages links to extra resources and code examples that add to the course material.

- __Debugging__ - Logs of any issues encountered during the execution of the function.


<br>
<br>

---
## ----------------------------- _showDuggaservice_ -----------------------------
---

<br>
<br>

### updateActiveUsers_ms.php
__updateActiveUsers_ms.php__ checks if there are already active users recorded for a given hash and either inserts a new record or updates the existing count of active users.

__Include original service files:__ sessions.php, basic.php

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

### processSubmittedDugga_ms.php
__processSubmittedDugga_ms.php__ processes files within a dugga i.e. submitted PDF, ZIP files.

__Includes neither original service files nor microservices.__

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

__Include original service files:__ sessions.php, basic.php

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

__Include original service files:__ sessions.php, basic.php

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