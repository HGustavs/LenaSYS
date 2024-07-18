# MICROSERVICES
This document primarily focuses on the services provided by the monolithc service files and which microservies can obtained thorugh these files. 

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

- accessedservice.php __WORK PAUSED for development of microservices and/or tests. Will continue when the service is fixed (group 3 is working on this)__
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
- getAcessedService_ms.php __==finished==__ New filename: "retrieveAllAcessedServiceData_ms.php", even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.  

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
- retrieveAllCourseedServiceData_ms.php __==finished==__ Previously named: "getCourseed_ms.php".
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
- getFileedService_ms.php __==finished==__ New filename: "retrieveAllFileedServiceData_ms.php", even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.

<br>

__Gitcommit Service:__

- getCourseID __==finished==__ New filename: "readCourseID_ms.php" according to new nameconvention based on CRUD.
- clearGitFiles_ms.php __==finished==__ New filename: "deleteGitFiles_ms.php" according to new nameconvention based on CRUD.  
- refreshGithubRepo_ms.php __==finished==__ New filename: "updateGithubRepo_ms.php" according to new nameconvention based on CRUD and the actual function of the microservice.
- fetchOldToken_ms.php __==finished==__ New filename: "readGitToken_ms.php" according to new nameconvention based on CRUD.
- insertIntoSQLite_ms.php __==finished==__  New filename: "syncGitRepoMetadata_ms.php", even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice.
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


- readGroupValues_ms.php __==finished==__ Previously named: "getGroupValues_ms.php".
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
- updateActiveCourseVersion_sectioned_ms.php __==finished==__ Previously named: "changeActiveCourseVersion_sectioned_ms.php".
- readCourseVersions_ms.php __==finished==__ Previously named: "getCourseVersions_ms.php". 
- getGitReference_ms.php __==UNFINISHED==__  
- readUserDuggaFeedback_ms.php __==finished==__ Previously named: "getUserDuggaFeedback_ms.php".
- createGithubCodeExample_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD.
- getListEntries_ms.php __==finished==__ New filename: "retrieveAllSectionedServiceData_ms.php" according to new nameconvention based on CRUD.
- retrieveAllCourseVersions_ms.php __==finished==__ New filename: "readAllCourseVersions_ms.php" according to new nameconvention based on CRUD.
- retrieveSectionedService_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.
- getListEntries_ms.php __==finished==__ New filename: "retrieveAllSectionedServiceData_ms.php" according to new nameconvention based on CRUD.

<br>

__Show Dugga Service:__

- updateActiveUsers_ms.php __==finished==__ Should keep existing name according to new nameconvention based on CRUD despite the mixed functions of the ms.
- processDuggaFile_ms.php __==finished==__ New filename: "processSubmittedDugga_ms.php", even though it is not aligned with CRUD. In this case, a more general name better describes the function of the microservice. 
- saveDugga_ms.php __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this particular case, a more general name is preferable as it better describes the microservice's function better.
- loadDugga_ms.php __==finished==__ New filename: "readSubmittedDugga_ms.php" according to new nameconvention based on CRUD.
- retrieveShowDuggaService_ms.php  __==finished==__ Should keep existing name even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.
- getShowDugga_ms.php __==finished==__ New filename: "retrieveAllShowDuggaServiceData_ms.php", even though it is not aligned with CRUD. In this case, a more general name is preferable as it better describes the microservice's function.

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
__readUid_ms.php__ retrieves the user ID (uid) from the session or assigning a guest ID if the user is not logged in. The function also logs an event with details about the request. The microservice ensures correct identification and logging of users and their actions in the system. 

__Include original service files:__ sessions.php, basic.php

- __Session check:__ Checks if there is a user ID (uid) in the current session. If there is an ID, it uses it. If not, it sets the user ID to "guest", meaning the user is not logged in.

- __Parameters:__ Retrieves various parameters from the request using getOP:
    
    - opt
    - courseId
    - courseVersion
    - exampleName
    - sectionName
    -  exampleId
    - log_uuid
    - log_timestamp

- __Logging:__ Collects information and logs a service event in the __'serviceLogEntries'__ table by using the __'logServiceEvent'__ function (defined in basic.php). It logs details like the operation type, course ID, course version, example name, section name, example ID, and timestamp.

- __Return user ID:__ The microservice returns the user ID, which will be either the actual user ID from the session or "guest".

<br>

---

<br>

### readUsername_ms.php
__readUsername_ms.php__ retrieves and returns the username associated with the current user ID as output. This ensures accurate identification of the logged-in user.

__Include microservice:__ getUid_ms.php


__Session check:__ Checks if the user is logged in by calling the 'getUid' function (getUid_ms.php). This function retrieves the user ID (uid) from the current session or assigns "guest" if no user ID is found.

__Query:__ Executes a SQL query to fetch the username associated with the retrieved user ID ('uid'). 

__Username retrieval:__ If the user is logged in, fetches the username from the query result and stores it in the '$username' variable.

__Return username:__ The function returns the fetched username.


__Querys used in this microservice:__

_SELECT_ operation on the table __'user'__ to retrieve the value of the column:
- username

```sql
SELECT username FROM user WHERE uid = :uid;
```

<br>

---

<br>

### createNewCodeExample_ms.php
__createNewCodeExample_ms.php__ creates a new code example in the database and logs the event. It retrieves the user ID (getUid_ms.php) and username (retrieveUsername_ms.php), inserts a new entry into the __'codeexample'__ table, generates a link for the new entry, and logs the event. The microservice then returns the link to the newly created code example as the output.

__Include microservice:__ getUid_ms.php, retrieveUsername_ms.php

- __Parameters:__ FRetrieves parameters from the request:
    
    - $pdo: Database connection object (PDO).
    - $exampleid: Example ID (optional).
    - $courseid: Course ID.
    - $coursevers: Course version.
    - $sectname: Section name.
    - $link: Reference link, updated later with the new example ID.
    - $log_uuid: Log UUID for the event.
    - $templateNumber: Template number, defaults to 0.

- __Create section name:__ If '$exampleid' is provided, create a new section name by adding 1 to the '$exampleid' and appending it to the section name. If no '$exampleid' is provided, use the given section name as is.

- __Insert new code example:__ Prepares and executes an SQL statement to insert a new code example into the 'codeexample' table:
    
    - Binds parameters: course ID, course version, example name, section name, and template ID.
    - Executes the query and captures any error messages in the 'debug' variable.
    - Retrieves the last inserted ID from the database to use as the link reference.

- __Retrieve user ID:__ Calls 'getUid()' (getUid_ms.php) to retrieve the user ID.

- __Retrieve username:__ Calls 'retrieveUsername($pdo)' (retrieveUsername_ms.php) to get the username.

- __Log user event:__ Logs the user event using 'logUserEvent()' with the retrieved user ID, username, event type ('SectionItems'), and section name.

- __Return:__ Returns an array containing the debug message and the new link ID.


__Querys used in this microservice:__

_INSERT_ operation on the table __'codeexample'__ to insert values into the columns:
- cid
- examplename
- sectionname
- uid
- cversion
- templateid

```sql
INSERT INTO codeexample(cid, examplename, sectionname, uid, cversion, templateid) VALUES (:cid, :ename, :sname, 1, :cversion, :templateid);
```

<br>

---

<br>

### createNewListentry_ms.php
__createNewListentry_ms.php__ inserts a new entry into the __'listentries'__ table in the database, fetches the username of the current user (through retrieveUsername_ms.php) and logs the event. The username is necessary because actions and events logged in the system need to be associated with a user.

__Include microservice:__ retrieveUsername_ms.php

- __Parameters:__  
    
    - cid: Course ID.
    - coursevers: Course version.
    - userid: User ID.
    - entryname: Entry name.
    - link: Link ID.
    - kind: Type of entry.
    - comment: Comments.
    - visible: Visibility status.
    - highscoremode: Highscore mode.
    - pos: Position.
    - gradesys: Grading system.
    - tabs: Tabs setting.
    - grptype: Group type.

- __Insert new list entry:__
    
    - Prepares and executes an SQL query to insert a new entry into the __'listentries'__ table.
    - Binds parameters for course ID, course version, user ID, entry name, link, kind, comment, visibility, highscore mode, position, grading system, tabs setting, and group type.
        
        - Conditionally binds 'gradesys' based on the 'kind' value.
        - Sets 'groupkind' to 'null' if 'grptype' is "UNK".
        - Logs the user event using the 'logUserEvent' function (defined in basic.php).

- __Return:__ Returns a debug message indicating the outcome of the operation.


__Querys used in this microservice:__

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
__updateActiveCourse_ms.php__ set a specific version of a course as the active version by updating the 'activeversion' value int the __'course'__ table in the database
If there is an error, the function returns the error message as a JSON-encoded string as output. 

__Include original service files:__ basic.php

- __Parameters:__

  - $pdo: PDO object for database connection.
  - $cid: Course ID.
  - $versid: Version ID to be set as active.

- __Update active course version:__ 

    - Prepares an SQL query to update the __'course'__ table, setting the 'activeversion' value. 
    - Binds the provided parameters to the SQL query:
        
        ':cid' is bound to '$cid'.
        ':vers' is bound to '$versid'.
    
    - Executes the SQL query to update the active version of the course.
    - If the query execution fails, captures and logs the error message and returns it as a JSON-encoded string.


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
__updateUser_ms.php__ handles adding new users to a course.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'user'__ to retrieve the column:
- uid 

- Where the 'username' matches the given value

```sql
SELECT uid FROM user WHERE username=:username
   ```


_SELECT_ operation on the table __'class'__ to check if a class exists by retrieving the column: 
- class

- Where the 'class' matches the given value

```sql
SELECT class FROM class WHERE class=:clsnme;
```


_INSERT_ operation on the table __'class'__ to add a new class:
- className
- responsible (set to 1)

```sql
INSERT INTO class (class, responsible) VALUES(:className,1);
```


_INSERT_ operation on the table __'user'__ to add a new user:
- username
- email 
- firstname
- lastname 
- ssn
- password
- addedtime
- class

```sql
INSERT INTO user (username, email, firstname, lastname, ssn, password, addedtime, class) VALUES(:username, :email, :firstname, :lastname, :ssn, :password, now(), :className);
```


_INSERT_ operation on the table __'user_course'__ to add a new course registration for a user or update the existing registration:
- uid
- cid
- access 
- term
- creator
- vers
- vershistory

- If a record already exists, it updates 'vers' and appends the new 'vers' to 'vershistory'.

```sql
INSERT INTO user_course (uid, cid, access, term, creator, vers, vershistory) VALUES(:uid, :cid, 'R', :term, :creator, :vers, '') ON DUPLICATE KEY UPDATE vers=:avers, vershistory=CONCAT(vershistory, CONCAT(:bvers, ','))
```

<br>

---

<br>

### updateUserCourse_ms.php
__updateUserCourse_ms.php__ checks if a user has the necessary permissions to update information in a course. If they have permissin the microervice performs updates in the __user_course__ table. 

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
__createClass_ms.php__ This microservice is responsible for adding a new class to the database, and then retrieving all updated data from the database (through retrieveAccessedService_ms.php) as the output for the microservice. See __retrieveAccessedService_ms.php__ for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveAccessedService_ms.php

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

- The operation adds a new row with specified values. If a row with the same primary key already exists (triggered by a duplicate key error), it updates the 'vers' field to ':avers' and appends ':bvers' to the existing 'vershistory', separated by a comma.

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


__retrieveAccessedService_ms.php__ is responsible for retrieving updated data from the database in the format of an array. The array contains information about:

- __entries__ - A list of user entries in the course, including their username, SSN, first name, last name, class, modification time, examiner, version, access level, groups, and whether they have requested a password change recently.

- __teachers:__ A list of teachers for the course, including their names and user IDs.

- __classes:__ A list of all classes, including their class name, responsible person, registration code, class code, HP, tempo, and HP progress.

- __groups:__ A list of groups, including group values, group kinds, and group integers.

- __courses:__ A list of courses with their course ID, course code, version, version name, course name, alternative course name, start date, and end date.

- __submissions:__ A list of user submissions in old versions of the course, including course ID, user ID, version, and version name.

- __queryResult:__ Indicates the result of the database queries, initially set to 'NONE!'.

- __examiners:__ A list of examiners for the course.

- __access:__ A boolean value indicating whether the user has access to the service or not.

- __debug:__ Debugging information, including any errors encountered during the database operations.

__retrieveAccessedService_ms.php__ provides information about the users, teachers, classes, groups, courses, and submissions related to a specific course. It also ensures that only authorized users can access this information. It also logs the service event.


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

- The results are filtered to include only those entries where the 'cid' value matches a specified value (':cid'), which is passed as a parameter to the query.

```sql
SELECT cid, coursecode, vers, versname, coursename, coursenamealt, startdate, enddate FROM vers WHERE cid=:cid;
```


_SELECT_ operation on the tables __'course'__, __'userAnswer'__, and __'vers'__ to retrieve values from the columns:
- cid (from 'course')
- uid (from 'userAnswer')
- vers (from 'vers')
- versname (from 'vers')

- The 'course.cid=:cid' ensures results are for a specific course ID.
- The 'course.cid=userAnswer.cid' joins the __'course'__ and __'userAnswer'__ tables on the course ID.
- The 'vers.vers=userAnswer.vers' joins the __vers__ and __userAnswer__ tables on the version number.
- The 'userAnswer.vers!=activeversion' filters out entries where the user's answer version is the current active version.

```sql
SELECT course.cid, uid, vers.vers, versname FROM course, userAnswer, vers WHERE course.cid=:cid AND course.cid=userAnswer.cid AND vers.vers=userAnswer.vers AND userAnswer.vers!=activeversion;
```

<br>

---

<br>

### retrieveAllAcessedServiceData_ms.php
__retrieveAllAcessedServiceData_ms.php__ calls __retrieveAccessedService_ms.php__ to fetch and return data from the database, serving as a direct link between client requests and the database. __retrieveAllAcessedServiceData_ms.php__ does not handle any querys. The microservice is useful for situations when __retrieveAccessedService_ms.php__ needs to be called independently, rather than as a follow-up operation in another microservice.

The microservice retrieves and outputs service data for a user in a specific course by calling the 'retrieveAccessedService_ms.php' and returning the result as a JSON-encoded string.

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
__updateCodeExample_ms.php__ handles updates of code examples, and then retrieving all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice. See __retrieveCodeviewerService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservices:__ getUid_ms.php, retrieveCodeviewerService_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'codeexample'__ to retrieve the values of the columns:
- exampleid
- sectionname
- examplename
- runlink
- cid
- cversion
- beforeid
- afterid
- public

- Where exampleid matches the specifed value ':exampleid'.

```sql
SELECT exampleid, sectionname, examplename, runlink, cid, cversion, beforeid, afterid, public FROM codeexample WHERE exampleid = :exampleid;
```


_UPDATE_ operation on the table __'codeexample'__ to update the values of the columns:
- runlink
- examplename
- sectionname

- The 'exampleid' value in the __'codeexample'__ table matches the value bound to :exampleid,
- The 'cid' value in the __'codeexample'__ table matches the value bound to :cid, and
- The 'cversion' value in the __'codeexample'__ table matches the value bound to :cvers.

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

- The 'word' value in the __'impwordlist'__ table matches the value bound to :word,
- The 'exampleid' value in the __'impwordlist'__ table matches the value bound to :exampleid.

```sql
DELETE FROM impwordlist WHERE word=:word AND exampleid=:exampleid;
```

<br>

---

<br>

### updateContentOfExample_ms.php
__updateContentOfExample_ms.php__ updates the content of a box that includes a certain code example and then retrieving all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice. See __retrieveCodeviewerService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservices:__ getUid_ms.php, retrieveCodeviewerService_ms.php

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
__updateBoxTitle_ms.php__ updates the title of a specific box if the user has the appropriate permissions, and then retrieving all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice. See __retrieveCodeviewerService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservices:__ getUid_ms.php, retrieveCodeviewerService_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'codeexample'__ to retrieve the values of the columns:
- exampleid
- sectionname
- examplename
- runlink
- cid
- cversion
- beforeid
- afterid
- public

- Where exampleid macthes the specified 'exampleid'.

```sql
SELECT exampleid, sectionname, examplename, runlink, cid, cversion, beforeid, afterid, public FROM codeexample WHERE exampleid = :exampleid;
```


_UPDATE_ operation on the table __'box'__ to update the value of the column:
- boxtitle

```sql
UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;
```

<br>

---

<br>

### deleteCodeExample_ms.php
 __deleteCodeExample_ms.php__ deletes a code example and its related data from the database if the user has the appropriate permissions, and then retrieving all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice. See __retrieveCodeviewerService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservices:__ getUid_ms.php, retrieveCodeviewerService_ms.php

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

---

<br>

### retrieveCodeViewerService_ms.php

__Include original service files:__ sessions.php, basic.php

__retrieveCodeviewerService_ms.php__ is responsible for retrieving updated data from the database in the format of an array. The array contains information about:

- __opt:__ The operation option provided by the user.

- __before:__ A list of code examples that precede the current example, including their example IDs, section names, example names, and the IDs of the examples before and after them.

- __after:__ A list of code examples that follow the current example, including their example IDs, section names, example names, and the IDs of the examples before and after them.

- __templateid:__ The ID of the template used for the code example.

- __stylesheet:__ The stylesheet associated with the code example.

- __numbox:__ The number of boxes associated with the code example.

- __box:__ A list of boxes related to the code example, including box ID, content type, content, wordlist ID, title, filename, font size, file path, and file kind.

- __improws:__ A list of important rows in the code example, each containing box ID, start index, and end index.

- __impwords:__ A list of important words associated with the code example.

- __directory:__ Directories of files categorized for different views (code view, document view, preview view), each containing file ID and filename.

- __examplename:__ The name of the code example.

- __sectionname__ The name of the section where the code example is located.

- __playlink:__ The link to run the code example.

- __exampleno:__ Unique identifier of the code example.

- __words:__ A list of words associated with wordlists, each containing wordlist ID, word, and label.

- __wordlists:__ A list of wordlists, each containing wordlist ID and name.

- __writeaccess:__ Indicates the access level of the user, either write ('w') or read ('s').

- __debug:__ Debugging information. If any errors are encountered during the database operations.

- __beforeafter:__ A combined list of all before and after examples.

- __public:__ Indicates whether the code example is public or not.

- __courseid:__ The ID of the course associated with the code example.

- __courseversion:__ The version of the course associated with the code example.


__retrieveCodeviewerService_ms.php__ gives information about a specific code example in a course, including details, related examples, important lines, words, file directories, and user access levels. It makes sure only authorized users can view and change this information. It also logs the service event.


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

- The query joins the __'codeexample'__ table with the __'template'__ table based on matching 'templateid' values.
- The results are filtered by:
    -'exampleid = :exampleid' to make sure the data matches a certain example, and 'cid = :courseID' to limit the data to a specific course ID.

```sql
SELECT exampleid, examplename, sectionname, runlink, public, template.templateid AS templateid, stylesheet, numbox FROM codeexample LEFT OUTER JOIN template ON template templateid = codeexample.templateid WHERE exampleid = :exampleid AND cid = :courseID;
```


_SELECT_ operation on the table __'improw'__ to retrieve data:
- boxid
- istart
- iend

- The 'exampleid' matches the specified value provided by the parameter ':exampleid'. The results are then ordered by the 'istart' column.

```sql
SELECT boxid, istart, iend FROM improw WHERE exampleid = :exampleid ORDER BY istart;
```


_SELECT_ operation on the table __'impwordlist'__ to retrieve data:
- word
- label

- The 'exampleid' matches the specified value provided by the parameter ':exampleid'. The results are then sorted alphabetically by the 'word' column.

```sql
SELECT word, label FROM impwordlist WHERE exampleid = :exampleid ORDER BY word;
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


_SELECT_ operation on the table __'fileLink'__ to retrieve data:
- fileid
- filename
- kind

- The 'cid' matches the specified value provided by the parameter ':cid'. The results are then sorted first by 'kind' in ascending order and then by 'filename' in ascending order.

```sql
SELECT fileid, filename, kind FROM fileLink WHERE cid = :cid ORDER BY kind, filename;
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
__createNewCourse_ms.php__ checks the user's login and permissions, creates a new course in the database if the user is a superuser, retrieves the ID of the most recently created course, and then retrieving all updated data from the database (through retrieveCourseedService_ms.php) as the output for the microservice. See __retrieveCourseedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

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


_SELECT_ operation on the table __'course'__ to retrieve the value of the column:
- cid

```sql
SELECT cid FROM course ORDER BY cid DESC LIMIT 1;
```

<br>

---

<br>

### createCourseVersion_ms.php
__createCourseVersion_ms.php__ checks the user's login and permissions, creates a new course version (new version of an existing course) in the database if the user is a superuser, retrieves the latest course version's ID. The microservice also retrieves all updated data from the database (through retrieveCourseedService_ms.php) as the output for the microservice. See __retrieveCourseedService_ms.php__  for more information.

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
__updateCourseVersion_ms.php__ checks the user's login and permissions, updates a course version in the database if the user is a superuser, and makes the new version active if specified. The microserive then retrieves all updated data from the database (through retrieveCourseedService_ms.php) as the output for the microservice. See __retrieveCourseedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveUsername_ms.php, retrieveCourseedService_ms.php

__Querys used in this microservice:__


_UPDATE_ operation on the table __'vers'__ to update the values of the columns:
- motd
- versname
- startdate
- enddate

```sql
UPDATE vers SET motd=:motd, versname=:versname, startdate=:startdate, enddate=:enddate WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;
```


_UPDATE_ operation on the table __'course'__ to update the value of the column:
- activeversion

```sql
UPDATE course SET activeversion=:vers WHERE cid=:cid;
```

<br>

---

<br>

### updateActiveCourseVersion_courseed_ms.php
__updateActiveCourseVersion_courseed_ms.php__ checks the user's login and permissions, updates the active course version in the database if the user is a superuser. The microserive then retrieves all updated data from the database (through retrieveCourseedService_ms.php) as the output for the microservice. See __retrieveCourseedService_ms.php__  for more information.
 

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
__copyCourseVersion_ms.php__ checks the user's login and permissions, copies a course version in the database by duplicating the course's quizzes, variants, code examples, and other related parts, updates links, and makes the new version active if needed. The microserive then retrieves all updated data from the database (through retrieveCourseedService_ms.php) as the output for the microservice. See __retrieveCourseedService_ms.php__  for more information.

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
__updateCourse_ms.php__ checks the user's login and permissions, updates the course information in the database if the user is a superuser, and logs the changes. The microserive then retrieves all updated data from the database (through retrieveCourseedService_ms.php) as the output for the microservice. See __retrieveCourseedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ retrieveUsername_ms.php, retrieveCourseedService_ms.php

__Querys used in this microservice:__

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
__createMOTD_ms.php__ checks the user's login and permissions, updates the message of the day (MOTD) in the database if the user is a superuser. The microserive then retrieves all updated data from the database (through retrieveCourseedService_ms.php) as the output for the microservice. See __retrieveCourseedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

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
__deleteCourseMaterial_ms.php__ code deletes all courses and associated materials that have been marked as deleted (visibility = 3) from the database. The microserive then retrieves all updated data from the database (through retrieveCourseedService_ms.php) as the output for the microservice. See __retrieveCourseedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

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


_DELETE_ operation on the table __'course_req'__ to delete rows where:
- req_cid
- visibility

-The req_cid in 'course_req' matches the cid in 'course' and course.visibility is equal to :deleted.

```sql
DELETE course_req FROM course,course_req WHERE course.visibility=:deleted AND course_req.req_cid = course.cid;
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

__Include microservice:__ getUid_ms.php, deleteCourseMaterial_ms.php


__retrieveCourseedService_ms.php__ retrieves all updated data related to courses from the database and returns it in an array format. The array contains information about:

- __entries__ - A list of courses the user has access to, including course ID, course name, course code, visibility, active version, active ed version, and whether the user is registered for the course. Visibility can be:
  - 0: Hidden
  - 1: Public
  - 2: Login required
  - 3: Deleted

- __versions__ - A list of all course versions, including course ID, course code, version, version name, course name, and alternative course name.

- __motd__ - The message of the day and its readonly status from the settings table.

- __debug__ - Debugging information. Includes any errors that was encountered during the database operations.

- __writeaccess__ - A boolean value indicating whether the user has write access to the service.

- __LastCourseCreated__ - Information about the last course created, if applicable.

__retrieveCourseedService_ms.php__ also checks the user's login status and permissions, and if the user is a superuser, it deletes course materials marked as deleted. Additionally, it logs the start and end of the service event.


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

---

<br>

### retrieveAllCourseedServiceData_ms.php

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveCourseedService_ms.php

__retrieveAllCourseedServiceData_ms.php__ calls __retrieveCourseedService_ms.php__ to fetch and return data from the database, serving as a direct link between client requests and the database. retrieveCourseedService_ms.php does not handle any queries. The microservice is useful for situations when __retrieveCourseedService_ms.php__ needs to be called independently, rather than as a follow-up operation in another microservice.

The microservice retrieves and outputs course data for a user by calling the __retrieveCourseedService_ms.php__ and returning the result as a JSON-encoded string.Additionally, it checks if the user is logged in and determines if the user is a superuser.

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
__createDugga_ms.php__ is responsible for creating a new quiz (dugga) in a course. It also determines if the quiz is a group assignment based on the template. This can only be done if the user is logged in and has the required permissions (write access or is a superuser). The microserive then retrieves all updated data from the database (through retrieveDuggaedService_ms.php) as the output for the microservice. See __retrieveDuggaedService_ms.php__  for more information.

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
__updateDugga_ms.php__ updates an existing quiz (dugga) in the database. It also determines if the quiz is a group assignment based on the template. The microserive then retrieves all updated data from the database (through retrieveDuggaedService_ms.php) as the output for the microservice. See __retrieveDuggaedService_ms.php__  for more information.

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
__deleteDugga_ms.php__ deletes a specific quiz and its associated user answers from the database if the user has the necessary permissions. The microserive then retrieves all updated data from the database (through retrieveDuggaedService_ms.php) as the output for the microservice. See __retrieveDuggaedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveDuggaedService_ms.php

__Querys used in this microservice:__

_DELETE_ operation on the table __'useranswer'__ to remove rows where the column:
- quiz (matches a specific value (':qid')).

```sql
DELETE FROM useranswer WHERE quiz=:qid;
```


_DELETE_ operation on the table __'quiz'__ to remove rows where the column:
- id (matches a specific value (':qid')).

```sql
DELETE FROM quiz WHERE id=:qid;
```

<br>

---

<br>

### createDuggaVariant_ms.php
__createDuggaVariant_ms.php__ handles the creation of a new variant for a specific dugga (quiz), including checking the user's permissions and updating the database accordingly. The microserive then retrieves all updated data from the database (through retrieveDuggaedService_ms.php) as the output for the microservice. See __retrieveDuggaedService_ms.php__  for more information.

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
handles updating a specific variant for a existing dugga, including executing the update in the database. The microserive then retrieves all updated data from the database (through retrieveDuggaedService_ms.php) as the output for the microservice. See __retrieveDuggaedService_ms.php__  for more information.

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
__deleteDuggaVariant_ms.php__ handles the deletion of a specific dugga variant, including checking the user's permissions, deleting related user answers, and updating the database accordingly. The microserive then retrieves all updated data from the database (through retrieveDuggaedService_ms.php) as the output for the microservice. See __retrieveDuggaedService_ms.php__  for more information.

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


__retrieveDuggaedService_ms.php__ is responsible for retrieving updated data from the database in the format of an array. The array contains information about:

- __entries__: A list of quizzes in the course, including their variants, quiz ID, version, course ID, quiz name, autograde status, grade system, quiz file, start time, deadline, release time, last modified time, group information, relative deadline, JSON deadline, and creator.

- __files__: A list of template files available for the duggas (quizzes), with the file extensions removed. These templates are HTML files located in a specific director (../../templates). The microservice checks this directory, identifies the HTML files, and then includes their names (without the .html extension) in the list.

- __duggaPages__: An associative array (where each element is a pair consisting of a key and a value) where each key is the name of a template file (without the .html ending), and each value is the content of that template file.

- __coursecode__: The course code retrieved from the database.

- __coursename__: The course name retrieved from the database.

- __writeaccess__: A boolean value indicating whether the user has write access to the service or not.

- __debug__: Debugging information. Includes any errors encountered during the database operations.

__retrieveDuggaedService_ms.php__ provides information about the quizzes, variants, and templates related to a specific course. It also ensures that only authorized users can access this information. It also logs the service event.



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
 manages the deletion of files from a course, ensuring that the user has the necessary permissions, checking if the file is in use, and then removing both the database entry and the physical file from the server if the necessary conditions are met. The microserive then retrieves all updated data from the database (through retrieveFileedService_ms.php) as the output for the microservice. See __retrieveFileedService_ms.php__  for more information.

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
__updateFileLink_ms.php__ updates the content of a specific file in the course, ensures the user has the necessary permissions, and updates the file size information in the database. The microserive then retrieves all updated data from the database (through retrieveFileedService_ms.php) as the output for the microservice. See __retrieveFileedService_ms.php__  for more information.


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

__retrieveFileedService_ms.php__ is responsible for retrieving updated data from the database in the format of an array. The array contains information about:

- __entries__ - A list of files related to a course, including details such as the filename, file extension, file kind, file size, upload date, file path, and permissions for editing and deleting the file.

- __gfiles__ - A list of global template files available in the system (LenaSys), not tied to any specific course.

- __lfiles:__ - A list of local files specific to the current course.

- __access:__ - A boolean value indicating whether the user has access to the service or not.

- __studentteacher:__ - Information about whether the user is a student or a teacher.

- __superuser:__ - A boolean value indicating whether the user is a superuser.

- __waccess:__ - A boolean value indicating whether the user has write access to the course.

- __supervisor:__ - A boolean value indicating whether the user is a supervisor.

- __debug:__ - Debugging information. Includes any errors encountered during the database operations.


__retrieveFileedService_ms.php__ provides detailed information about files in a course, making sure access is properly controlled and actions are logged. 

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

---

<br>

### retrieveAllFileedServiceData_ms.php

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveFileedService_ms.php

__retrieveAllFileedServiceData_ms.phpp__ calls __retrieveFileedService_ms.php__ to fetch and return data from the database, serving as a direct link between client requests and the database. retrieveCourseedService_ms.php does not handle any queries. The microservice is useful for situations when __retrieveFileedService_ms.php__ needs to be called independently, rather than as a follow-up operation in another microservice.

The microservice retrieves and outputs course data for a user by calling the __retrieveFileedService_ms.php__ and returning the result as a JSON-encoded string. 

<br>

---
## ----------------------------- _gitCommitService_ -----------------------------
---

<br>
<br>

### readCourseID_ms.php
__readCourseID_ms.php__ is responsible for retrieving the course ID from a database based on a provided GitHub URL. The microservice looks up a course ID in a database based on a provided GitHub URL, formats the URL for the query, retrieves the course ID if available, and adds the information to the SQLite database if a match is found (through insertIntoSQLite_ms.php).

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
__deleteGitFiles_ms.php__ connects to the SQLite database and clears all entries from the __gitFiles__ table for a specified course ID. It also handles any errors that occur during the process.

__Include original service files:__ sessions.php, basic.php

__Querys used in this microservice:__

_DELETE_ operation on the table __'gitFiles'__ to remove records where:
- 'cid' matches the specified course ID (':cid').

```sql
DELETE FROM gitFiles WHERE cid = :cid;
```

<br>

---

<br>

### updateGithubRepo_ms.php
__updateGithubRepo_ms.php__ refreshes the metadata from a GitHub repository for a course when there's a new commit, updating the local SQLite database and downloading the latest files if necessary.

__Include original service files:__ sessions.php, basic.php, gitfetchService.php

__Include microservice:__ refreshCheck_ms.php, clearGitFiles_ms.php

__Querys used in this microservice:__


_SELECT_ operation on the table __'gitRepos'__ to retrieve the values of the columns:
- lastCommit
- repoURL

- Filter results after where the 'cid' in the __'gitRepos'__ table matches the value bound to ':cid'.

```sql
SELECT lastCommit, repoURL FROM gitRepos WHERE cid = :cid;
```


_UPDATE_ operation on the table __'gitRepos'__ to update the value of the column:
- lastCommit

- Filter results after where the 'cid' in the __'gitRepos'__ table matches the value bound to ':cid'.

```sql
UPDATE gitRepos SET lastCommit = :latestCommit WHERE cid = :cid;
```

<br>

---

<br>


### readGitToken_ms.php
__readGitToken_ms.php__ retrieves the GitHub token for a specific course ID from the database, and returns the token if it exists and is valid; otherwise, it returns null.

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

### syncGitRepoMetadata_ms.php
__syncGitRepoMetadata_ms.php__ updates the SQLite database with the latest details about a GitHub repository for a specific course, including the most recent commit and token. It makes sure the database record is either updated or inserted and refreshes the repository information if needed.

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
__updateTime_ms.php__ updates the 'updated' value of a course in the MySQL database with the current time.

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
__updateThrottle_ms-php__ ensures that the GitHub repository information for a course is only refreshed if enough time has passed since the last update. This is based on user permissions and set cooldown times. If the user has superuser priviliges short deadline is used. If the user is not a superuser, the long deadline is used.

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
__getGitHubAPIUrl_ms.php__ transforms the standard GitHub repository URL into an API URL format. This function extracts the username and repository name from the provided URL, and constructs an API URL for accessing the repository contents.

__Include original service files:__ sessions.php, basic.php

__Includes neither original service files nor microservices.__

__getGitHubAPIUrl_ms.php__ takes a GitHub repository URL as input. It splits the URL into parts using the / character, gets the username (third part) and repository name (fourth part) from the split URL, builds a new URL in the format for GitHub's API to access repository contents, and returns the new API URL. The microservice simplifies accessing GitHub repository data through API calls by generating correct API URLs.

<br>

---

<br>

### getGitHubURLCommit_ms.php

_WORK PAUSED for development of this microservice. Will continue when the service is fixed (group 3 is working on this)._

<br>


### retrieveGitCommitservice_ms.php

The retrieveGitCommitService_ms microservice fetches and displays the list of Git commits from a repository on the server. It first checks if the shell_exec function is available to execute system commands. If available, it runs a Git command to retrieve the commit hash and message, sanitizes the output, and then displays the commit information. This service is useful for developers needing quick access to commit history directly from the server without using the Git client. To use it, include and call the function in your PHP script, ensuring Git is installed and shell_exec is enabled.

---

<br>

### createFileLinkEntry_ms.php
__createFileLinkEntry_ms.php__  adds file information to the __'fileLink'__ table in the database if the file does not already exist for the given course. It checks for duplicates before inserting and handles any errors that occur during the process.

__Include original service files:__ sessions.php, basic.php, gitfetchService.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'fileLink'__ to count the number of entries where:
- 'cid' matches ':cid'
- 'filename' matches ':filename'
- 'kind' matches ':kindid'
- 'path' matches ':filePath'

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
__createGitFilesMetadata_ms.php__ adds file information to the __'gitFiles'__ table in an SQLite database (metadata2.db), making sure the file details are saved correctly for the given course.

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
__downloadToWebServer_ms.php__ downloads files from GitHub to the web server, creates directories as needed, and logs any errors that occur during the process.

__Include original service files:__ sessions.php, basic.php, gitfetchService.php

__Includes neither original service files nor microservices.__

__Operation:__ The microservice fetches the contents of a file from a remote URL and saves it to a specified path on the server. It creates the needed directories if they do not exist and writes the file data to the server.

__Result handling:__ Errors in retrieving or saving the file are logged in the __gitErrorLog.txt__ log file. Includes details of the failure and relevant URLs or paths.

<br>

---

<br>

### readIndexFile_ms.php
__readIndexFile_ms.php__ gets the contents of an index.txt file from a remote URL using cURL and returns its contents as an array of lines. __readIndexFile_ms.php__  is designed to fetch and read an index file from a remote location, simplifying data retrieval from external servers. 

__Includes neither original service files nor microservices.__

__Operation:__ Constructs a URL for an index.txt file, sends a request using cURL, and checks the response code.

__Result handling:__ If the server responds with a 200 OK status (if successful), reads and returns the contents of the file as an array of lines (splits them into lines). If not, returns false.

<br>

---

<br>

### bfs_ms.php
__bfs_ms.php__ fetches data from a GitHub repository using a given URL and performs different tasks (GETCOMMIT, REFRESH, or DOWNLOAD) on the data it gets. It uses Breadth-First Search (BFS) to explore the directory structure of the repository.

The microservice performs these tasks based on the operation:

- __GETCOMMIT__: Gets the latest commit from the repository.
- __REFRESH__: Updates the information about the files in the repository.
- __DOWNLOAD__: Downloads the files to the server and updates the information and links for these files.

__Includes neither original service files nor microservices.__

__Operation:__ The function goes through a GitHub repository using a Breadth-First Search (BFS) method.

__GitHub API requests__: It creates API URLs and sends requests to GitHub's API, optionally using a token for login.

__Data handling:__ The function processes the API responses, getting file and directory information.

__File and directory processing:__ Files are saved in a database and can be downloaded, while directories are checked further.


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
__readHighscore_ms.php__ retrieves highscore lists based on user results and provides specific feedback to logged-in users about their ranking, logs the service event, and then retrieving all updated data from the database (through retrieveHighscoreService_ms.php) as the output for the microservice. See __retrievehighscoreService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservices:__ retrieveHighscoreService_ms.php 


__Session management:__ Checks if a user is logged in by checking the user's ID in the session. If no user ID is found, it defaults to "1", indicating that the user is not logged in. This is used for determining which user's scores to retrieve or verify if the user has permission to see highscores. 

__Debugging:__ Initially set to "NONE!". Sshow any errors or important notes about how the database operations went. 

__Calling 'retrieveHighscoreService_ms.php':__ This function handles the actual retrieval of scores. 'readHighscore_ms.php' passes necessary parameters ($pdo, $duggaid, $variant, $debug) to 'retrieveHighscoreService_ms.php', which then queries the database and fetches the scores.

__Results:__ After fetching the scores, the result is formated into an array and then encoded into JSON. It´s then sen back to the client. The JSON data includes the highscores and relevant debugging information.

<br>

---

<br>

### retrieveHighscoreService_ms.php
__retrieveHighscoreService_ms.php__ retrieves highscore data for a specific dugga and variant from the database, checks the logged-in user's score, and returns the data as a structured array.

__Include original service files:__ sessions.php, basic.php


__retrieveHighscoreService_ms.php__ is responsible for retrieving highscore data from the database in the format of an array. The array contains information about:

- __highscores__: A list of high scores for a specific dugga and variant, including usernames and scores of users who passed the dugga.
- __user__: Information about the logged-in user, if they have a score for the specified dugga and variant.
- __debug__: Debugging information. Includes any errors encountered during the database operations.

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
__updateSecurityQuestion_ms.php__ handles the updating of a user's challenge question and answer. Changes of security questions are permitted only for non-superuser/non-teacher users and only if the correct password is entered. The operation is then logged. The microserive then retrieves all updated data from the database (through retrieveProfileService_ms.php) as the output for the microservice. See __retrieveProfileService_ms.php__  for more information.

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
__updateUserPassword_ms.php__ validates the user's password against what is stored in the database to ensure user authentication. If the user passes the password check and does not have a teacher or superuser role, the password will be updated. The operation is then logged. The microserive then retrieves all updated data from the database (through retrieveProfileService_ms.php) as the output for the microservice. See __retrieveProfileService_ms.php__  for more information.

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


__retrieveProfileService_ms.php__ is responsible for returning the result of a profile update operation in the format of an array. The array contains information about:

- __success__: A boolean value indicating whether the operation was successful or not.

- __status__: A string describing the current status of the operation, such as if the user is a teacher or if there was a password mismatch. Possible values include:
   - "teacher" - The user is a teacher or superuser and is not allowed to change their password or security question.
   - "wrongpassword" - The provided password does not match the one in the database.
   - An empty string ('""') if no specific statuses occur during the process.

- __debug__: Debugging information. Includes any errors encountered during the operation.

__retrieveProfileService_ms.php__ provides feedback about the success of a profile update operation (either changing the password or security question), and logs any debug information. This function returns an array that summarizes the outcome of the operation.

<br>
<br>

---
## ----------------------------- _resultedservice_ -----------------------------
---

<br>
<br>

### readUserAnswer_ms.php
__readUserAnswer_ms.php__ manages and presents information about submitted duggor. The microservice checks if the user has the right permissions, retreives the submission and filter data from the database. After processing the data, it formats it for display in a table and returns it in an organized way. The microservice retrieves all updated data from the database (through retrieveResultedService_ms.php) as the output for the microservice. See __retrieveResultedService_ms.php__ for more information.


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


__retrieveResultedService_ms.php__ is responsible for returning organized data about submissions for a specific course version in the format of an array. The array contains information about:

- __tableInfo__: A list of submission details, including the dugga name, submission hash, password, submission status, number of times submitted and accessed, teacher visit times, and subcourse information, and additional link.

- __duggaFilterOptions__: A list of filter options for the duggas, including entry names, kinds, list IDs, and moments (moment or time of entry).

__retrieveResultedService_ms.php__ provides organized submission data and filter options related to a specific course version, ensuring that the data is properly structured.

<br>
<br>

---
## ----------------------------- _sectionedservice_ -----------------------------
---

<br>
<br>

### readGroupValues_ms.php
__readGroupValues_ms.php__ retrieves group values and related data when a group is clicked on. The function organizes the data and returns it in a structured format. 

__Include original service files:__ sessions.php

__Include microservices:__ getUid_ms.php, retrieveSectionedService_ms.php


- __Session:__ Connects to the database, and starts the session.

- __Parameters:__ Gets parameters like 'uid', 'courseid', 'versid', 'log_uuid', 'opt', and 'coursevers' from the request.

- __Check login and run query:__ Checks if the user is logged in. If they are, the query runs. The query retrieves group values from the __'groups'__ table and organizes them into an array.

- __retrieveSectionedService:__ Calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) to get additional data needed for the response.  

- __Combine and return:__ Combines the group values with the additional data (fetched through retrieveSectionedService function) and returns the result as a JSON-encoded string as the output of the miroservice.


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
__readCourseGroupsAndMembers_ms.php__ retrieves and returns a list of group members related to a specified course ID and course version.

__Include original service files:__ sessions.php, basic.php, coursesyspw.php

__Include microservice:__ retrieveSectionedService_ms.php

- __Session:__ Connects to the database and starts the session.

- __Parameters:__ Fetches parameters such as 'opt', 'courseid', 'coursevers, 'log_uuid', and 'showgrp' from the request.

- __Session and access check:__ Checks if the user is logged in with. If the user is logged in the function retrieves the user ID from the session (if available), otherwise sets it to "guest". Checks the user's access rights (read, student teacher, write) for the specified course.

- __Retrieve group:__ If the 'opt' parameter equals "GRP":
    
    - Runs a query to fetch user details and their group memberships for the specified course ID and version.
    - Filters users based on the specified group ('showgrp').
    - Collects and sorts the group member information.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) to get additional data needed for the response.  

- __Combine and return:__ Combines the group member data with the additional data (fetched through retrieveSectionedService function) and returns the result as a JSON-encoded string as the output of the miroservice.


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
Listentries are duggas, headers, tests etc. __deleteListentries_ms.php__ DELETES listentries from the database. Should not be confused with the microservice removeListentries (that changes to visible value of the listentrie to "hide" it. This will enable restoring deleted items). The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php


- __Session:__ Connects to the database and starts the session.

- __Parameters:__ Fetches the following parameters from the request:
    
    - 'courseid': Course ID.
    - 'coursevers': Course version.
    - 'log_uuid': Log UUID.
    - 'opt': Operation type.
    - 'sectid': Section ID to be deleted.

- __Get User ID:__ Calls 'etUid()' to retrieve the user ID from the session.

- __User and SuperUser check:__ Calls 'checklogin()' to verify if the user is logged in.
  
    If the user is a superuser:
    - Deletes related entries from the __'useranswer'__ table using the section ID ('sectid').
    - Deletes the section entry from the __'listentries'__ table using the section ID ('sectid').
    - Handles errors related to foreign key constraints during deletion.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) to fetch the updated data after the deletion operation.

- __Return:__ Combines the deletion debug information and the updated data. Returns the result as a JSON-encoded string as the output of the microservice.


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
Listentries are duggas, headers, tests etc. This microservice will change the visibility of a listentry to "deleted" instead of deleting the item from the database entirely. This will enable restoring deleted items. It "hides" the listentries. Should not be confused with the microservice __deleteListentries_ms.php__ (that actually deletes the listentrie from the database). The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php


- __Session:__ Connects to the database and starts the session.

- __Parameters:__ Fetches the following parameters from the request:

    - 'courseid': Course ID.
    - 'coursevers': Course version.
    - 'log_uuid': Log UUID.
    - 'opt': Operation type.
    - 'sectid': Section ID to be updated.

- __Check login:__ Calls 'checklogin()' to verify if the user is logged in. If the user is logged in, the function retrieves the user ID from the session (`$_SESSION['uid']`). If the user ID is not set in the session, assigns "UNK" as the user ID.

- __Update visibility:__ Checks if the logged-in user is a superuser using 'isSuperUser(getUid())'. If the user is a superuser, a query to update the visibility of the section in the __'listentries'__ table is run (sets 'visible' to '3' for the given section ID 'sectid'). Handles potential errors, including foreign key constraint violations.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) to fetch updated data after the visibility update operation.

- __Return:__ Combines the debug information and the updated data. Returns the result as a JSON-encoded string as the output of the microservice.


__Querys used in this microservice:__

_UPDATE_ operation on the table __'listentries'__ to update the value of the column:
- visible

- Filters the rows to where the 'lid' in the __'listentries'__ table matches the value bound to ':lid'.

```sql
UPDATE listentries SET visible = '3' WHERE lid = :lid;
```


<br>

---

<br>

### createListentry_ms.php
__createListentry_ms.php__ adds a new section entry to a course, handling the creation of a new code example if necessary, and then retrieves the updated sectioned data for the course. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.


__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveUsername_ms.php, createNewListentry_ms.php, createNewCodeExample_ms.php, retrieveSectionedService_ms.php

- __Session:__ Connects to the database and starts the session.

- __Parameters:__ Fetches parameters from the request:

    - 'opt': Operation type.
    - 'courseid': Course ID.
    - 'coursevers': Course version.
    - 'sectname': Section name.
    - 'kind': Kind/type of section.
    - 'link': Link ID, which indicates whether to create a new code example.
    - 'visibility': Visibility of the section.
    - 'gradesys': Grading system.
    - 'highscoremode': Highscore mode.
    - 'comments': Comments for the section.
    - 'grptype': Group type.
    - 'pos': Position of the section.
    - 'tabs': Tabs setting.
    - 'log_uuid': Log UUID.

- __Retrieve user ID:__ Calls 'getUid()' (getUid_ms.php) to retrieve the user ID.

- __Insert new code example:__ If 'link' is '-1', it indicates that a new code example needs to be created:
    
    - Fetches the latest code example ID from the __codeexample__ table in the database
    - Calls 'createNewCodeExample()' (createNewCodeExample_ms.php) to create a new code example, updating the 'link' variable accordingly.

- __Create new list entry:__ Calls 'createNewListEntry()' (createNewListentry_ms.php) with the provided parameters and the updated 'link' to create a new list entry for the course.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) to fetch the updated sectioned data for the course.

- __Return:__ Returns the result as a JSON-encoded string as the output of the microservice.


__Querys used in this microservice:__

_SELECT_ operation on the table __'settings'__ to retrieve values from the columns:
- motd
- readonly

```sql
SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1;
```

<br>

---

<br>

### updateListEntryOrder_ms.php
__updateListEntryOrder_ms.php__ handles the reordering of list entries of a course based on user input. Not to be confused with __updateListentrie_ms.php__. This is done by updating the 'pos' and 'moment' columns of the __'listentries'__ table based on input parameters. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php


- __Session:__ Starts the session to manage user data and establishes a connection to the database using 'pdoConnect()'.

- __Parameter:__ Retrieves parameters from the request such as 'courseid', 'coursevers', 'pos', 'moment', 'order', 'lid', 'opt', and 'log_uuid'.

- __Retrieve user ID:__ Calls 'getUid()' (getUid_ms.php) to retrieve the user ID.

- __Update list entries:__

    - Check 'opt' parameter: If the 'opt' parameter is "REORDER", it processes the reordering of list entries.
    - Query: Prepares an SQL query to update the 'pos' and 'moment' columns in the __'listentries'__ table based on the 'lid'.
    - Parse 'order' parameter: Splits the 'order' parameter by commas to get individual order items. Each item is further split by "XX" to get position, list entry ID, and moment.

- __Execute query:__ Binds the parameters ('lid', 'pos', 'moment') to the query and executes it for each entry. If an error occurs, it sets the 'debug' variable to an error message.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) to get the updated data.

- __Return:__ Returns the result as a JSON-encoded string as the output of the microservice.


__Querys used in this microservice:__

_UPDATE_ operation on the table __'listentries'__ to update the values of the columns:
- pos
- moment

Filters the rows to where the 'lid' in the __'listentries'__ table matches the value bound to ':lid'.

```sql
UPDATE listentries SET pos = :pos, moment = :moment WHERE lid = :lid;
```

<br>

---

<br>

### updateListentries_ms.php
__updateListentries_ms.php__ updates or add new course sections in the listentries table. It handles both updates of existing sections and the creation of new code examples if needed. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php


- __Session:__ Starts the session and establishes a connection to the database using 'pdoConnect()'.

- __Parameters:__ Retrieves parameters from the request:

    -  'courseid'
    -  'coursevers'
    -  'sectid'
    -  'sectname'
    -  'comments' 
    -  'highscoremode'
    -  'feedbackenabled'
    -  'feedbackquestion'
    -  'link'
    -  'kind'
    -  'moment'
    -  'visibility'
    -  'grptype'
    -  'tabs'
    -  'gradesys'
    -  'userid'
    -  'log_uuid'

- __Insert new code example:__ If 'link' is '-1', it inserts a new code example into the __'codeexample'__ table. It retrieves the last section name before the current position, assigns it to the new code example, and updates the 'link' variable with the new example ID.

- __Update list entries:__
    
    - Updates the __'listentries'__ table with the specified parameters: 'highscoremode', 'gradesys', 'moment', 'sectname', 'kind', 'link', 'visibility', 'comments', 'grptype', 'feedbackenabled', and 'feedbackquestion'.
    - Handles specific parameter binding for 'gradesys' and 'tabs' based on the entrys 'kind'.

- __Insert into list:__ If 'kind' is '4', it inserts a new entry into the __'list'__ table, linking the section with a course and a responsible person (the person assigned to the specific list entry within the course).

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) fetch the updated section data.

- __Return:__ Returns the result as a JSON-encoded string as the output of the microservice.


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
__updateListentriesTabs_ms.php__ update the 'tabs' column in the __'listentries'__ table for a specified section if the user is a superuser. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php


- __Session:__ Connects to the database and starts the session using 'pdoConnect()' and 'session_start()'.

- __Parameters:__ Retrieves various parameters from the request:

    - 'opt'
    - 'sectid'
    - 'tabs' 
    - 'courseid'
    - 'coursevers'
    - 'log_uuid' 
    - 'userid'

- __Check login:__ Checks if the user is logged in by using the 'checklogin()' function.

- __Superuser check and update tabs:__ If the user is a superuser and the 'opt' parameter is "UPDATETABS", it prepares and executes a query to update the 'tabs' column for the specified section ('lid') in the __'listentries'__ table. If the update fails, it sets the debug message with error details.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) fetch the updated section data.

- __Return:__ Returns the result as a JSON-encoded string as the output of the microservice.


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
__updateListentriesGradesystem_ms.php__ updates the grading system for a course section if the user is a superuser. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.


__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php


- __Session:__ Connects to the database and starts the session using 'pdoConnect()' and 'session_start()'.

- __Parameters:__ Retrieves various parameters from the request: 'sectid', 'gradesys', 'courseid', 'coursevers', 'log_uuid', and 'opt.

__Check login:__ Checks if the user is logged in and retrieves the user ID using 'getUid()'.

__Superuser check and update grade gystem:__ If the user is a superuser, the function runs an SQL query to update the 'gradesystem' column for the specified section ('lid') in the 'listentries' table. If the update fails, sets a debug message with error details.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) fetch the updated section data.

- __Return:__ Returns the result as a JSON-encoded string as the output of the microservice.


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
updates the visibility of a specific list entry in a course section. This operation can only be performed by a superuser. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

- __Session:__ Connects to the database and starts the session using 'pdoConnect()' and 'session_start()'.

- __Parameters:__ retrieves parameters from the request: 'lid' (list entry ID), 'visible' (visibility status), 'courseid', 'coursevers', 'log_uuid' and 'opt'.

- __Check login and permissions:__ Checks if the user is logged in and checks if the user is a superuser using 'getUid()'.

- __Update visibility:__ If the user has the necessary permissions, the function runs an SQL query to update the 'visible' column for the specified list entry ('lid') in the __'listentries'__ table. If the update fails, sets a debug message with error details.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) fetch the updated section data.

- __Return:__ Returns the result as a JSON-encoded string as the output of the microservice.


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
__updateQuizDeadline_ms.php__ update the deadline for a dugga (quiz) in a course if the user is authorized to do so. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ retrieveSectionedService_ms.php


- __Session:__ Connects to the database and starts the session using 'pdoConnect()' and 'session_start()'.

- __Parameters:__ retrieves parameters from the request: 'opt' (operation), 'courseid', 'link', 'coursevers', 'log_uuid', 'deadline', and 'relativedeadline'.

- __Session and permissions check:__ Calls 'checklogin()' to verify if the user is logged in. If logged in, the function retrieves the user ID ('uid') and checks the user's access levels (read, write, student/teacher). If not logged in, sets the user ID to "guest".

- __Update deadline:__ If the operation ('opt') is "UPDATEDEADLINE":
     
     - Prepares an SQL query to update the 'deadline' and 'relativedeadline' for the specified quiz ('link') and binds the parameters to the query.
     - Executes the query and sets a debug message if there's an error.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) fetch the updated section data.

- __Return:__ Returns the result as a JSON-encoded string as the output of the microservice.


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

### updateActiveCourseVersion_sectioned_ms.php
__updateActiveCourseVersion_sectioned_ms.php__ updates the active version of a course. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.


__Include original service files:__ sessions.php, basic.php

__Include microservice:__ retrieveSectionedService_ms.php


- __Session:__ Connects to the database and starts the session using 'pdoConnect()' and 'session_start()'.

- __Parameters:__ retrieves parameters from the request: 'courseid', 'coursevers', 'versid', 'log_uuid' and 'opt'.

- __Identifyes user:__ Checks if the user is logged in and sets the user ID ('uid'). If not logged in, sets the user ID to "guest".

- __Permission check:__ Checks if the user is a superuser using 'isSuperUser()'. Checks if the user is logged in and has write access or is a superuser ('ha'). If the user has the required permissions ('ha' or 'studentTeacher'), the update can begin.

- __Update active version:__
   
   - Prepares an SQL query to update the 'activeversion' field for the specified course ('courseid') to the new version ('versid').
   - Binds the parameters 'courseid' and 'versid' to the query.
   - Executes the query and sets a debug message if there's an error.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) fetch the updated section data. Adds the updated 'coursevers' to the returned data.

- __Return:__ Returns the result as a JSON-encoded string as the output of the microservice.


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
__readCourseVersions_ms.php__ retrieves all course versions from the database (__'vers'__ table) and handles any errors that may occur during the process.

__Include original service files:__ sessions.php

__Include microservice:__ getUid_ms.php

- __Session:__ Connects to the database and starts the session using 'pdoConnect()' and 'session_start()'.

- __Fetch corurse versions:__ 

     - Creates an empty array '$versions' to hold the results.
     - Tries to execute a prepared SQL query to select all columns from the 'vers' table.
     - If the query executes successfully, all retrieved results is stored in the '$versions' array.
     - If an error occurs during the query execution, the function logs the error message and returns an empty array.
   
- __Return:__ Returns the array '$versions' containing all course versions retrieved from the database.

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
__readUserDuggaFeedback_ms.php__ is responsible for fetching user feedback for a specific dugga (quiz) moment and calculating the average feedback score. The microservice retrieves feedback entries and the average score for the feedback related to a specific course and moment. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ retrieveSectionedService_ms.php


- __Session:__ Connects to the database and starts the session using 'pdoConnect()' and 'session_start()'.

- __Identifyes user:__ Checks if the user is logged in using 'checklogin()'.  If not logged in, sets the user ID ('$userid') to "guest". If logged in, retrieves the user ID from the session.
 
- __Parameters:__ retrieves parameters from the request: 'opt', 'courseid', 'moment', 'versid', 'log_uuid' and 'coursevers'.

- __Fetch user feedback and average score:__ If the operation ('opt') is "GETUF":

     - Prepares and executes an SQL query to fetch all entries from the __'userduggafeedback'__ table where 'lid' and 'cid' match the provided course ID and moment.
     - If the query executes successfully, it will iterate over the results and adds each feedback entry to the '$userfeedback' array.
     - Prepares and executes another SQL query to calculate the average score from the __'userduggafeedback'__ table for the specified course ID and moment.
     - If the query executes successfully, stores the average score in '$avgfeedbackscore'.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) fetch the additional data. Also adds the retrieved user feedback and average feedback score to the returned data.

- __Return:__ Returns the combined data as a JSON-encoded string as the output of the microservice.


__Querys used in this microservice:__

_SELECT_ operation on the table __'userduggafeedback'__ to select all columns where:

-  Filters the result to rows where the 'lid' value matches the specified value for ':lid'.
-  Filters the result to rows where the 'cid' value matches the specified value for :'cid'.

```sql
SELECT * FROM userduggafeedback WHERE lid=:lid AND cid=:cid;
```


_SELECT_ operation on the table __'userduggafeedback'__ to calculate the average of the 'score' column, aliased as 'avgScore', where:

- Filters the result to rows where the 'lid' value matches the specified value for ':lid'.
- Filters the result to rows where the 'cid' value matches the specified value for :cid.

```sql
SELECT AVG(score) AS avgScore FROM userduggafeedback WHERE lid=:lid AND cid=:cid;
```

<br>

---

<br>

### createGithubCodeExample_ms.php
__createGithubCodeExample_ms.php__ creating or updating code examples based on GitHub files available in the GitHub directory for a specific course and course version. The microserive retrieves all updated data from the database (through retrieveSectionedService_ms.php) as the output for the microservice. See __retrieveSectionedService_ms.php__ for more information.


__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, createNewCodeExample_ms.php, createNewListEntry_ms.php, retrieveSectionedService_ms.php



- __Parameters:__ Retrieves parameters from the request (e.g., 'opt', 'courseid', 'coursevers', 'kind', 'link', 'gradesys', 'highscoremode', 'pos', 'lid', 'log_uuid').

- __Session:__ Connects to the database and starts the session.

- __Processing the request:__ - If the operation ('opt') is "CREGITEX":
     
     - Retrieves course ID, GitHub directory, and course version from the __'listentries'__ table based on 'lid'.
     - Seraching in the GitHub directory for files and groups them based on their names.
     - Iterates over the grouped files and retrieves the correct example name.
     - Checks if a code example already exists for the given course ID, example name, and course version.
     
     - If no code example exists, creates a new code example:
       
       - Retrieves the last position in 'listentries' to place the new code example at the bottom.
       - Determines the appropriate template based on the number of files.
       - Creates the new code example and adds the associated files as boxes.
       - Adds the new code example to the __'listentries'__ table.
     
     - If a code example already exists, updates the existing code example by:
       - Checking if the code example should be hidden, removing or adding boxes as necessary.
       - Updating the template ID based on the number of files.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) fetch updated data from the database. 

- __Return:__ Returns the combined data as a JSON-encoded string as the output of the microservice.


__Querys used in this microservice:__

_SELECT_ operation on the table __'listentries'__ to retrieve the values of the columns:
- cid
- githubDir
- vers

```sql
SELECT cid, githubDir, vers FROM listentries WHERE lid=:lid;
```


_SELECT_ operation on the table __'codeexample'__ to retrieve the value of the column:
- count (the number of rows that match the conditions)

```sql
SELECT COUNT(*) AS count FROM codeexample WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;
```


_SELECT_ operation on the table __'listentries'__ to retrieve the value of the column:
- pos

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

```sql
SELECT exampleid AS eid FROM codeexample WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;
```


_SELECT_ operation on the table __'box'__ to retrieve the value of the column:
- boxCount (the number of rows that match the condition)

```sql
SELECT COUNT(*) AS boxCount FROM box WHERE exampleid=:eid;
```


_SELECT_ operation on the table __'gitFiles'__ to retrieve the values of all columns:

```sql
SELECT * FROM gitFiles WHERE cid = :cid AND fileName LIKE :fileName;
```


_UPDATE_ operation on the table __'listentries'__ to update the value of the column:**
- visible

```sql
UPDATE listentries SET visible=:visible WHERE cid=:cid AND vers=:cvs AND entryname=:entryname;
 ```


_SELECT_ operation on the table __'box'__ to retrieve the value of the column:
- filename

```sql
SELECT filename FROM box WHERE exampleid = :eid;
 ```


_SELECT_ operation on the table __'box'__ to retrieve the value of the column:
- boxid (renamed as 'bid')

```sql
SELECT boxid AS bid FROM box WHERE exampleid = :eid AND filename = :boxName;
```


_DELETE_ operation on the table __'box'__ to delete rows where the conditions are met:

 ```sql
DELETE FROM box WHERE exampleid = :eid AND filename = :boxName;
```


_UPDATE_ operation on the table __'box'__ to update the value of the column:
- boxid

```sql
UPDATE box SET boxid=:newBoxID WHERE exampleid = :eid AND boxid=:oldBoxID;
```


_UPDATE_ operation on the table __'codeexample'__ to update the value of the column:
- templateid

```sql
UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;
```

  

_SELECT_ operation on the table __'box'__ to retrieve the value of the column:
- filename

```sql
SELECT filename FROM box WHERE exampleid = :eid;
 ```


_SELECT_ operation on the table __'box'__ to retrieve the maximum value of the column:
- boxid

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

```sql
UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;
```

<br>

---

<br>

### readAllCourseVersions_ms.php
__readAllCourseVersions_ms.php__ retrieves all versions for a specific course and calculates the total number of groups based on these versions. 


__Include original service files:__ sessions.php, basic.php

__Include microservice:__ retrieveSectionedService_ms.php


- __Session:__ Establishes a database connection ('pdoConnect()'), and 'session_start()' initializes the session.

- __Parameters:__ Retrieves parameters from the request using the 'getOP' function: 'opt', 'courseid' and 'coursevers'.

- __Fetch course versions:__ If the 'coursevers' parameter is not "null", the function fetches the course versions:
   
   - A query is prepared and executed on the __'vers'__ table to fetch all versions of the specified course ('cid').
   - The retrieved results is stored in an array ($courseversions).
   - The total number of groups is calculated by multiplying the number of course versions by 24.

- __Error:__ If the query execution fails, it captures the error information and sets a debug message with the error details.

- __retrieveSectionedService:__ calls 'retrieveSectionedService' function (retrieveSectionedService_ms.php) to get additional data needed for the response. The calculated total number of groups is added to the data array.  

- __Combine and return:__ Combines the group member data with the additional data (fetched through retrieveSectionedService function) and returns the result as a JSON-encoded string as the output of the miroservice.

__Return:__ The combined data, including the total number of groups and any debug information, is encoded as a JSON string and returned as the response.


__Querys used in this microservice:__

_SELECT_ operation on the table __'vers'__ to retrieve the values of the column:
- vers

- Selects rows where the column __cid__ matches the provided value ':cid'.

```sql
SELECT vers FROM vers WHERE cid=:cid
```

<br>

---

<br>

### retrieveSectionedService_ms.php

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ readCourseVersions_ms.php


__retrieveSectionedService_ms.php__ is responsible for retrieving all updated data from the database in the format of an array. It´s basically gathering and sharing information about courses with users, making sure it fits what they are allowed to see and do. The array contains information about:

- __entries__ - A list of course entries, including their ID, moment, entry name, position, kind, link, visibility, code ID, grading system, highscore mode, deadline, relative deadline, release date, comments, start time, JSON deadline, group kind, timestamp, tabs, feedback enabled, and feedback question.

- __results:__ A list of user results for duggas, including the moment, grade, submission time, marking time, and user answer.

- __duggor:__ A list of duggas for the course, including their ID, name, release date, deadline, and relative deadline.

- __versions:__ A list of course versions, including course ID, course code, version, version name, course name, alternative course name, start date, and end date.

- __links:__ A list of file links associated with the course, including file ID and filename.

- __codeexamples:__ A list of code examples for the course, including example ID, course ID, example name, section name, run link, and course version.

- __unmarked:__ The number of unmarked submissions for the course.

- __startdate:__ The start date of the course version.

- __enddate:__ The end date of the course version.

- __groups:__ A list of groups the user belongs to within the course.

- __grpmembershp:__ The group membership details for the user.

- __grplst:__ A list of group members.

- __userfeedback:__ Feedback provided by users.

- __feedbackquestion:__ The feedback question associated with the quizzes.

- __avgfeedbackscore:__ The average feedback score.

- __coursename:__ The name of the course.

- __coursecode:__ The code of the course.

- __readaccess:__ A boolean value indicating whether the user has read access to the course.

- __writeaccess:__ A boolean value indicating whether the user has write access to the course.

- __studentteacher:__ A boolean value indicating whether the user has student teacher access.

- __debug:__ Debugging information. Includes any errors encountered during the database operations.

__retrieveSectionedService_ms.php__ provides information about the course entries, user results, quizzes, versions, links, code examples, and feedback related to a specific course. Ensuring that only authorized users can access this information. The service event is then logged.


__Querys used in this microservice:__

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


_SELECT_ operation on the table __'listentries'__ with a _LEFT OUTER JOIN_ on the table __'quiz'__ to retrieve the values of the columns:
- lid
- moment
- entryname
- pos
- kind
- link
- visible
- code_id
- listentries.gradesystem
- highscoremode
- deadline
- relativedeadline
- qrelease
- comments
- qstart
- jsondeadline
- groupKind
- ts
- tabs
- feedbackenabled
- feedbackquestion

- Where the 'cid' in the __'listentries'__ table matches the value specified to ':cid'.
- Where the 'vers' in the __'listentries'__ table matches the value specified to ':coursevers'.

- Results ordered by the 'pos' column in ascending order.

```sql
SELECT lid, moment, entryname, pos, kind, link, visible, code_id, listentries.gradesystem, highscoremode, deadline, relativedeadline, qrelease, comments, qstart,jsondeadline, 
groupKind, ts, tabs, feedbackenabled, feedbackquestion FROM listentries LEFT OUTER JOIN quiz ON listentries.link = quiz.id WHERE listentries.cid = :cid AND listentries.vers = :coursevers ORDER BY pos;
```


_SELECT_ operation on the table __'course'__ to retrieve values from the columns:
- coursename
- coursecode

```sql
SELECT coursename, coursecode FROM course WHERE cid=:cid LIMIT 1;
```


_SELECT_ operation on the table __'fileLink'__ to retrieve the values of the columns:
- fileid
- filename
- kind

```sql
SELECT fileid, filename, kind FROM fileLink WHERE cid = :cid AND kind = 1 ORDER BY filename;
```


_SELECT_ operation on the table __'fileLink'__ to retrieve values from the columns:
- fileid
- filename
- kind

```sql
SELECT fileid,filename,kind FROM fileLink WHERE (cid=:cid AND kind>1) or isGlobal='1' ORDER BY kind,filename;
```


_SELECT_ operation on the table __'userAnswer'__ to count the number of rows where the conditions are met:

- Where the 'cid' in the __'userAnswer'__ table matches the value bound to ':cid'.
- Either:
  - The 'grade' is '1' and the 'submitted' date is later than the 'marked' date.
  - Or, the 'submitted' date is not null, the 'useranswer' is not null, and the 'grade' is null.

```sql
SELECT COUNT(*) AS unmarked FROM userAnswer WHERE cid = :cid AND ((grade = 1 AND submitted > marked) OR (submitted IS NOT NULL AND useranswer IS NOT NULL AND grade IS NULL));
```


_SELECT_ operation on the table __'vers'__ to retrieve values from the columns:
- startdate
- enddate

```sql
SELECT startdate,enddate FROM vers WHERE cid=:cid AND vers=:vers LIMIT 1;
```


_SELECT_ operation on the table __'fileLink'__ to retrieve values from the columns:
- fileid
- filename
- kind

```sql
SELECT fileid,filename,kind FROM fileLink WHERE cid=:cid AND kind=1 ORDER BY filename;
```


_SELECT_ operation on the table __'vers'__ to retrieve the values of the columns:
- startdate
- enddate

```sql
SELECT startdate, enddate FROM vers WHERE cid = :cid AND vers = :vers LIMIT 1;
```

<br>

---

<br>

### __retrieveAllSectionedServiceData_ms.php__
__retrieveAllSectionedServiceData_ms.php__ calls __retrieveSectionedService_ms.php__ to fetch and return data from the database, serving as a direct link between client requests and the database. The microservice is useful for situations when __retrieveSectionedService_ms.php__ needs to be called independently, rather than as a follow-up operation in another microservice.

The microservice retrieves all list entries for a specific course and version by calling the 'retrieveSectionedService_ms.php' and returning the result as a JSON-encoded string.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ getUid_ms.php, retrieveSectionedService_ms.php

<br>
<br>

---
## ----------------------------- _showDuggaservice_ -----------------------------
---

<br>
<br>

### updateActiveUsers_ms.php
__updateActiveUsers_ms.php__ retrieves information about a specific dugga and manages the number of active users working on group tasks for the dugga, and then retrieving all updated data from the database (through retrieveShowDuggaService_ms.php) as the output for the microservice. See __retrieveShowDuggaService_ms.php__  for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ retrieveShowDuggaService_ms.php


- __Session:__ Connects to the database and starts the session using 'pdoConnect()' and 'session_start()' and then retrieves necessary parameters like 'opt', 'courseid', 'coursevers', 'duggaid', 'moment', 'hash', and so on.

- __Handles active users:__ Checks the number of active users for a specific hash in the __'groupdugga'__ table. If no active users are found, it inserts a new record with the hash and active user token. If active users are found, it updates the record with the new total of active users.

- __Retrieve dugga information:__ Initializes variables and arrays to store dugga information, like 'duggainfo', 'variants', and 'files'. The microservice then calls the 'retrieveShowDuggaService' function with the necessary parameters to get information about the dugga.

- __Return dugga information:__ The microservice returns the retrieved information as JSON, which includes details about the dugga, active users, and other relevant data.


__Querys used in this microservice:__

_SELECT_ operation on the table __'groupdugga'__ to retrieve the value of the column:
- active_users

- Where the 'hash' in the __'groupdugga'__ table matches the value bound to ':hash'.

```sql
SELECT active_users FROM groupdugga WHERE hash=:hash;
```


_INSERT_ operation on the table __'groupdugga'__ to insert values into the columns:
- hash
- active_users

```sql
INSERT INTO groupdugga(hash, active_users) VALUES(:hash, :AUtoken);
```


_UPDATE_ operation on the table __'groupdugga'__ to update the value of the column:
- active_users

- Where the 'hash' in the __'groupdugga'__ table matches the value bound to ':hash'.

```sql
UPDATE groupdugga SET active_users=:AUtoken WHERE hash=:hash;
```

<br>

---

<br>

### processSubmittedDugga_ms.php
__processSubmittedDugga_ms.php__ retrieves and processes all submission files (i.e. submitted PDF, ZIP files) related to a specific dugga for a given course and version. 

__Includes neither original service files nor microservices.__


- __Session check:__ Checks if submission details (hash, password, variant) are stored in the session for the specific course, version, dugga, and moment. If they are, they are used to retrieve submissions. 

- __Retrieve submissions:__ Runs a query to find all submissions with the stored hash. If nothing is found and the user is a superuser, retrieves all submissions for the given moment.

- __Process each submission:__ For each retrieved submission:
    
    - Sets up variables for content and feedback.
    - Checks if the file exists and reads its contents.
    - Prepares an array with collected details about the submission.

- __Organize submissions:__ Puts all processed submissions into an array, grouped by their segment.

- __Return results:__ If there are no submissions, returns an empty object. Otherwise, the function returns an array of organized submissions as output.


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

- The value in the 'hash' column must match the specified ':hash'. The results are ordered by 'subid', 'fieldnme', and 'updtime' in ascending order.

```sql
SELECT subid, vers, did, fieldnme, filename, extension, mime, updtime, kind, filepath, seq, segment, hash FROM submission WHERE hash = :hash ORDER BY subid, fieldnme, updtime ASC;
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

- The value in the 'segment' column matches the specified ':moment'. The results should be ordered by 'subid', 'fieldnme', and 'updtime' in ascending order.

```sql
SELECT subid, vers, did, fieldnme, filename, extension, mime, updtime, kind, filepath, seq, segment, hash FROM submission WHERE segment = :moment ORDER BY subid, fieldnme, updtime ASC;
```

<br>

---

<br>

### saveDugga_ms.php
__saveDugga_ms.php__ handles the saving of user submissions for a specific dugga. Allows the user to make multiple saves of dugga answers before final submission (updating user answers, inserting new user answers, and selecting data from the __'userAnswer'__ table.). The user can update their answer multiple times as needed, and the system manages these updates until an approved grade is received, which then blocks further submissions for that specific dugga. The microserive retrieves all updated data from the database (through retrieveShowDuggaService_ms.php) as the output for the microservice. See __retrieveShowDuggaService_ms.php__ for more information.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ retrieveShowDuggaService_ms.php

- __Session check:__ Checks if the user is logged in and retrieves submission details (hash, password, variant) from the session or POST data for the specified course, version, dugga, and moment.

- __Logging:__ Logs the start of the service event with details about the operation.

- __Retrieve submissions (if existing):__ Queries the database for existing submissions matching the stored hash.
  
- __Update or insert submission:__ 
    
    - If a submission exists and the hash and password match, updates the user answer.
    - If no submission exists or the hash/password do not match, inserts a new user answer.
    - If the user is a superuser and no submissions are found, retrieves all submissions for the given moment.
  
- __Return results:__ Calls 'retrieveShowDuggaService' function (retrieveProfileService_ms.php) to fetch and return information about the dugga (inlcuding submissions) from the database, in a JSON format.

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

__Session:__ Connects to the database and starts a session. Retrieves user ID (uid), login name, firstname and lastname, defaulting to "student" if not logged in.

__Parameters:__ Gets the 'hash' and 'moment' parameters from the request.

__Queries:__ Queries the database to get user answers using the provided hash. If no data is found with the hash, the function retrieves answers for the specified moment instead. Retrieves relevant data (variant, answer, variant answer, parameters, course ID, course version, and dugga ID) from the query results as output.

__Include original service files:__ sessions.php, basic.php

__Include microservice:__ retrieveShowDuggaService_ms.php

__Querys used in this microservice:__

_SELECT_ operation on the table __'userAnswer'__ with a _LEFT JOIN_ on the table __'variant'__ to retrieve the values of the columns:
- vid
- variantanswer (from variant table)
- useranswer
- param
- cid
- vers
- quiz

- Where the 'hash' in the __'userAnswer'__ table matches the value bound to ':hash'.

```sql
SELECT vid, variant.variantanswer AS variantanswer, useranswer, param, cid, vers, quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant = variant.vid WHERE hash = :hash;
```

<br>

If the hash didn't work then retrive all answers for that moment:

_SELECT_ operation on the table __'userAnswer'__ with a _LEFT JOIN_ on the table __'variant'__ to retrieve the values of the columns:
- vid
- variantanswer (from the __variant__ table)
- variantanswer (from the __userAnswer__ table)
- useranswer
- param
- cid
- vers
- quiz

- Where the 'moment' in the __'userAnswer'__ table matches the value bound to ':moment'.

```sql
SELECT vid, variant.variantanswer AS variantanswer, useranswer, param, cid, vers, quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant = variant.vid WHERE moment = :moment;
```

<br>

---

<br>

### retrieveShowDuggaService_ms.php

__Include original service files:__ basic.php

__Include microservice:__ processDuggaFile_ms.php, loadDugga_ms.php


__retrieveShowDuggaService_ms.php__ is responsible for retrieving and processing information about a specific dugga for a given course and version. The function returns the data in the format of an array, containing information about the dugga and its submissions.

- __Session check:__ Checks if the user is logged in by retrieving session information. If a user ID is found, the function retrieves user details. If not, the user ID is set to "guest".

- __Role check:__ The function checks the user's role and then sets a variable ('flag') to indicate whether the user has the permissions of a superuser or a teacher.

- __Retrieve dugga information for superusers:__ If the user is a superuser, the function retrieves dugga information based on the hash. If successful, it processes the dugga files. Otherwise, it sets default values and a debug message.

- __Retrieve dugga information for guests:__ If the user is not a superuser, it checks for a valid hash and password combination to retrieve the dugga information. If successful, it processes the dugga files. Otherwise, it sets default values and a debug message.

- __Retreive dugga infromation for guests (session-based):__ If no hash and password are provided, it retrieves the dugga information from session variables. If successful, it processes the dugga files. Otherwise, it sets default values and a debug message.

- __Data:__ Collects all relevant information, including debug messages, parameters, answers, scores, grades, submission details, user feedback, and whether the user is a teacher. It formats this data into an array.

- __Return results:__ The function returns the collected data as JSON, including information about the dugga, its submissions, and additional metadata.

__retrieveShowDuggaService_ms.php__ provides information about a specific dugga, including user submissions and other related data. It makes sure that only authorized users can access the information.

__Querys used in this microservice:__

_SELECT_ operation on the table __'quiz'__ with _LEFT JOINs_ on the tables __'variant'__, __'userAnswer'__, and a subquery from __'listentries'__ to retrieve the columns:
- quiz (all columns)
- variantanswer (from the __variant__ table)
- vid (from the __variant__ table)
- useranswer (default value 'UNK' if NULL)
- param
- dugga_title (from the subquery of listentries)

- Filters the results to where the 'quiz.id' matches the specified ':did'
- And the 'vid' matches the specified ':variant'
- And the 'l.cid' matches the specified ':cid'.

Conditions for the JOIN statements:
- The 'userAnswer' table is joined on 'userAnswer.variant = variant.vid' and 'hash = :hash' and 'password = :hashpwd'.
- The subquery 'l' is filtered to ensure 'l.link = quiz.id' and 'l.cid = l.cid'.

```sql
SELECT quiz.*, variant.variantanswer, variant.vid AS vid, IF(useranswer IS NULL, 'UNK', useranswer) AS useranswer, variantanswer, param, l.entryname AS dugga_title FROM quiz  LEFT JOIN variant ON quiz.id = variant.quizID LEFT JOIN userAnswer ON userAnswer.variant = variant.vid AND hash = :hash AND password = :hashpwd LEFT JOIN (SELECT cid, link, entryname FROM listentries) AS l ON l.cid = l.cid AND l.link = quiz.id WHERE quiz.id = :did AND vid = :variant AND l.cid = :cid LIMIT 1;
```



_SELECT_ operation on the table __'quiz'__ with _LEFT JOINs_ on the tables __'variant'__, __'userAnswer'__, and a subquery from __'listentries'__ to retrieve the columns:
- quiz (all columns)
- vid (from the __variant__ table)
- useranswer (default value 'UNK' if NULL)
- variantanswer
- param
- dugga_title (from the subquery of listentries)

- Filters the results to where the 'quiz.id' matches the the specified ':did'
- And the 'vid' matches the specified ':variant'
- And the 'l.cid' matches the specified ':cid'.

Conditions for the JOIN statements:
- The 'serAnswer' table is joined on 'userAnswer.variant = variant.vid' and 'hash = :hash' and 'password = :hashpwd'.
- The subquery 'l' is joined on the condition 'l.cid = l.cid' and 'l.link = quiz.id'.

```sql
SELECT quiz.*, variant.vid AS vid, IF(useranswer IS NULL, 'UNK', useranswer) AS useranswer, variantanswer, param, l.entryname AS dugga_title FROM quiz LEFT JOIN variant ON quiz.id = variant.quizID LEFT JOIN userAnswer ON userAnswer.variant = variant.vid AND hash = :hash AND password = :hashpwd LEFT JOIN (SELECT cid, link, entryname FROM listentries) AS l ON l.cid = l.cid AND l.link = quiz.id WHERE quiz.id = :did AND vid = :variant AND l.cid = :cid LIMIT 1;
```


_SELECT_ operation on the table __'userAnswer'__ with a _LEFT JOIN_ on the table __'variant'__ to retrieve the values of the columns:
- vid
- variantanswer (from the __variant__ table)
- useranswer
- param
- cid
- vers
- quiz

- Filters the results to where the 'hash' in the __'userAnswer'__ table matches the specified ':hash'
- And the 'password' in the __'userAnswer'__ table matches the specified ':hashpwd'.

```sql
SELECT vid, variant.variantanswer AS variantanswer, useranswer, param, cid, vers, quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant = variant.vid WHERE hash = :hash AND password = :hashpwd;
```

<br>

---

<br>

### retrieveAllShowDuggaServiceData_ms.php

__retrieveAllShowDuggaServiceData_ms.php__ calls __retrieveShowDuggaService_ms.php__ to fetch and return data from the database, serving as a direct link between client requests and the database. __retrieveAllShowDuggaServiceData_ms.php__ does not handle any queries. The microservice is useful for situations when __retrieveShowDuggaService_ms.php__ needs to be called independently, rather than as a follow-up operation in another microservice.

The microservice retrieves and sends back service data for a user in a specific course by calling __'retrieveShowDuggaService_ms.php'__ and returning the result as a JSON-encoded string.
