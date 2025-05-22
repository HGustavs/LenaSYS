# Name of file/service
createListEntry_ms

## Description
Adds a new list entry to a course, handling the creation of a new code example if necessary, and then retrieves the updated sectioned data for the course. List entries are duggas, headers, tests etc.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database
   
- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database

- Parameter: $sectname
   - Type: String
   - Description: Section name. Stored as varchar(64) in the database

- Parameter: $kind
   - Type: int
   - Description: Kind/type of section. Stored as int(10) in the database

- Parameter: $link
   - Type: String
   - Description: Link ID, which indicates whether to create a new code example. If 'link' is '-1', it indicates that a new code example needs to be created. Stored as varchar(200) in the database

- Parameter: $visibility
   - Type: int
   - Description: Visibility of the section. Stored as tinyint(1) in the database

- Parameter: $gradesys
   - Type: int
   - Description: Grading system. Stored as tinyint(1) in the database

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode. Stored as int(11) in the database

- Parameter: $comments
   - Type: String
   - Description: Comments for the section. Stored as varchar(512) in the database

- Parameter: $grptype
   - Type: String
   - Description: Group type. Stored as varchar(16) in the database

- Parameter: $pos
   - Type: int
   - Description: Position of the section. Stored as int(11) in the database

- Parameter: $tabs
   - Type: int
   - Description: Tabs setting. Stored as tinyiny(4) in the database

- Parameter: $userid
   - Type: int
   - Description: ID of the user. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: For logging purposes

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: The script returns a JSON object describing the updated course content, after inserting a new item (like a code example, text, or list entry) into the course.

## Examples of Use
'SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1;'

### Microservices Used
- getUid_ms
- createNewListEntry_ms
- createNewCodeExample_ms
- retrieveSectionedService_ms

---

# Name of file/service
deleteListEntries_ms

## Description
Deletes list entries from the database. List entries are duggas, headers, tests etc.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database
   
- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database

- Parameter: $sectid
   - Type: int
   - Description: Section ID. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: For logging purposes

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: The script returns a JSON object describing which listentry that should be deleted from the listentries-table.

## Examples of Use
'DELETE FROM useranswer WHERE moment=:lid'

'DELETE FROM listentries WHERE lid = :lid'

### Microservices Used
- getUid_ms
- retrieveSectionedService_ms

---

# Name of file/service
getCourseGroupsAndMembers_ms

## Description
Returns a list of group members related to a specific course ID and course version.
Also creates and email address if a user does not have one.
Only available to users who are logged in.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier, for logging purposes

- Parameter: $showgrp
   - Type: String
   - Description: Retrieves a specific group based on the first two characters of the group name. Used as a filter to fetch the $grplst 

## Calling Methods
- GET

## Output Data and Format
- Output: $grplst
   - Type: array
   - Description: Contains $groups, $fistname, $lastname and email, for users whose group name matches the 2 caracters specified in $showgrp.

- Output: $groups
   - Type: String
   - Description: Groups that users are part of. Stored as varchar(256) in the database

- Output: $firstname
   - Type: String
   - Description: Firstname. Stored as varchar(50) in the database

- Output: $lastname
   - Type: String
   - Description: Lastname. Stored as varchar(50) in the database

- Output: $email
   - Type: String
   - Description: Email address. Stored as varchar(256) in the database

- Output: $grpmembershp
   - Type: String
   - Description: Contains a list of groups a user is part of

- Output: $debug
   - Type: String
   - Description: Displays "Failed to get group members!" if the operation failes

## Examples of Use
-

### Microservices Used
- coursesyspw.php
- retrieveSectionedService_ms.php

---

# Name of file/service
getCourseVersions_ms

## Description
Retreives all course versions from the 'vers' table.

## Input Parameters
None

## Calling Methods
- GET
- POST

## Output Data and Format
- Output: $versions
   - Type: array
   - Description: Array that includes cid, coursecode, vers, versname, coursename, coursenamealt, startdate, enddate, motd

- Output: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Output: $coursecode
   - Type: String
   - Description: Course code. Stored as varchar(45) in the database

- Output: $vers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Output: $versname
   - Type: String
   - Description: Name of the course version. Stored as varchar(45) in the database

- Output: $coursename
   - Type: String
   - Description: Course name. Stored as varchar(80) in the database

- Output: $coursenamealt
   - Type: String
   - Description: Alternative course name. Stored as varchar(45) in the database

- Output: $startdate
   - Type: String
   - Description: Start date of course version. Stored as datetime in the database

- Output: $enddate
   - Type: String
   - Description: End date of course version. Stored as datetime in the database

- Output: $motd
   - Type: String
   - Description: Message of the day for the course version. Stored as varchar(50) in the database

## Examples of Use
-

### Microservices Used
- getUid_ms.php

---

# Name of file/service
getListEntries_ms.php

## Description
Fetches all list entries from the database. List entries are duggas, headers, tests etc.

## Input Parameters

- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int(10)
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging purposes

## Calling Methods
- GET

## Output Data and Format
- Output: -
   - Type: JSON
   - Description: Returns a JSON object describing which listentry that should be fetched from the listentries-table

## Examples of Use
-

## Microservices Used
- sharedMicroservices/getUid_ms.php
- retrieveSectionedService_ms.php

---

# Name of file/service
getUserDuggaFeedback_ms.php

## Description
Fetches All data from the 'userduggafeedback' table

## Input Parameters

- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging purposes

- Parameter: $moment
   - Type: int
   - Description: The ID of a specific list entry. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: -
   - Type: JSON
   - Description: Returns the course's list entries divided into sections. If $opt is set to 'GETUF', a list of every piece of feedback individual students have given for the specific entry will be returned, along with a single int representing the average of all feedback scores.

## Examples of Use
-

## Microservices Used
sharedMicroservices/getUid_ms.php
retrieveSectionedService_ms.php

---

# Name of file/service
changeActiveCourseVersion_sectioned_ms

## Description
Updates the active version of a specific course. After the update, retrieveSectionedService_ms is called to fetch all relevant and updated data, which is then used as the output as a JSON-encoded string.

## Input Parameters
- Parameter: $courseid
   - Type: int
   - Description: Unique identifier of the course to be updated. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Current course version. Stored as varchar(8) in the database

- Parameter: $versid
   - Type: String
   - Description: The updated course version. Stored as varchar(8) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier, for logging purposes

- Parameter: $opt
   - Type: String
   - Description: Operation type

## Calling Methods
- GET
- POST

## Output Data and Format
- Output: $data
   - Type: array
   - Description: Contains all relevant and updates data after a successful update. Contains $duggor, $releases, $resulties, $entries, $links, $codeexamples, $versions, $startdate, $enddate, $grpmembershp, $userfeedback, $groups, $grplst, $feedbackquestion, $avgfeedbackscore

- Output: $duggor
   - Type: String
   - Description: Details about quizzes. Contains id, qname, release, deadline and relativedeadline from the 'quiz' table

- Output: $releases
   - Type: String
   - Description: Dates regarding quizzes. Contains release, deadline and relativedeadline from the 'quiz' table

- Output: $resulties
   - Type: String
   - Description: Results of submissions for quizzes. Contains moment, grade, submitted, marked and useranswer from the 'useranswer' table

- Output: $entries
   - Type: String
   - Description: Details about entries for quizzes. Contains entryname, lid, pos, kind, moment, link, visible, highscoremode, gradesys, groupKind, comments, tabs, feedbackenabled, feedbackquestion, ts and code_id from the 'listentries' table. As well as deadline, relativedeadline, qrelease and qstart from the 'quiz' table. Done as LEFT OUTER JOIN

- Output: $links
   - Type: String
   - Description: Information about files related to the course. Contains fieldid and fieldname from the 'filelink' table

- Output: $codeexamples
   - Type: String
   - Description: Details about code examples related to the course. Contains exampleid, cid, examplename, sectionname, runlink and cversion from the 'codeexample' table

- Output: $versions
   - Type: String
   - Description: A list of all course versions for a specific course ID

- Output: $startdate
   - Type: String
   - Description: Start date of the course version, from the 'vers' table. Stored as datetime in the database

- Output: $enddate
   - Type: String
   - Description: End date of the course version, from the 'vers' table. Stored as datetime in the database

- Output: $grpmembershp
   - Type: String
   - Description: Group memberships

- Output: $userfeedback
   - Type: array
   - Description: Stores feedback entries

- Output: $groups
   - Type: array
   - Description: Stores information related to different groups

- Output: $grplst
   - Type: array
   - Description: List of groups

- Output: $feedbackquestion
   - Type: array
   - Description: Stores feedback questions for users to answer

- Output: $avgfeedbackscore
   - Type: array
   - Description: Stores avarage feedback scores

## Examples of Use
-

### Microservices Used
- retrieveSectionedService_ms

---

# Name of file/service
createGithubCodeExample_ms

## Description
Creates and/or updates code examples based on GitHub files available in the GitHub directory for a specific course and course version.
Retrieves all updated data from the database through retrieveSectionedService_ms.php, and uses it as its output.

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $kind
   - Type: int
   - Description: List entry type. Stored as int(10) in the database

- Parameter: $link
   - Type: String
   - Description: List entry link. Stored as varchar(200) in the database

- Parameter: $gradesys
   - Type: int
   - Description: Gradesystem. Stored as tinyint(1) in the database

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode. Stored as int(11) in the database

- Parameter: $pos
   - Type: int
   - Description: Listentry position, +1 for each new listentry created. Stored as int(11) in the database

- Parameter: $lid
   - Type: int
   - Description: Listentry ID. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier, for logging purposes

- Parameter: $sectionname
   - Type: String
   - Description: Name of section. Stored as varchar(64) in the database

- Parameter: $templateNumber
   - Type: int
   - Description: Template ID. Stored as int(10) in the database

- Parameter: $exampleid ('listentries' table)
   - Type: int
   - Description: ID of code example. Stored as mediumint(8) in the database  

- Parameter: $exampleName
   - Type: String
   - Description: Name of code example. Stored as varchar(64) in the database

- Parameter: $boxid
   - Type: int
   - Description: Box ID. Stored as int(10) in the database

- Parameter: $exampleid('box' table)
   - Type: int
   - Description: Example ID. Stored as mediumint(8) in the database

- Parameter: $boxtitle
   - Type: String
   - Description: Box title, code example title. Stored as varchar(20) in the database

- Parameter: $boxcontent
   - Type: String
   - Description: Type of content (code or document) inside box. Stored as varchar(64) in the database

- Parameter: $fileName
   - Type: String
   - Description: File name. Stored as varchar(256) in the database

- Parameter: $settings
   - Type: String
   - Description: Settings for example box. Setting for important = 1. Stored as varchar(1024) in the database 

- Parameter: $wordlistid
   - Type: int
   - Description: Wordlist ID. Stored as mediumint(8) in the database

- Parameter: $fontsize
   - Type: int
   - Description: Font size, for text related to the box. Stored as int(11) in the database

- Parameter: $eid
   - Type: int
   - Description: Example ID. Stored as mediumint(8) in the database

- Parameter: $boxName
   - Type: String
   - Description: New or updated filename. Stored as varchar(256) in the database

- Parameter: $newBoxID
   - Type: New or updated box ID. Stored as int(10) in the database
   - Description: describe parameter

- Parameter: $oldBoxID
   - Type: int
   - Description: Old box ID. Stored as int(10) in the database

## Calling Methods
- GET
- POST

## Output Data and Format
- Output: $courseid 
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Output: $coursevers 
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Output: $userid 
   - Type: int
   - Description: User ID. Stored as int(10) in the database

- Output: $examplename 
   - Type: String
   - Description: Code example name. Stored as varchar(64) in the database

- Output: $link 
   - Type: String
   - Description: List entry link. Stored as varchar(200) in the database

- Output: $kind 
   - Type: int
   - Description: Type of list entry. Stored as int(10) in the database

- Output: $comment 
   - Type: String
   - Description: Comment on list entry. Stored as varchar(512) in the database

- Output: $visible 
   - Type: int
   - Description: Listentry visibility. Either visible or not. Stored as tinyint(1) in the database

- Output: $highscoremode 
   - Type: int
   - Description: Highscore mode. Stored as int(11) in the database

- Output: $pos 
   - Type: int
   - Description: Listentry position, +1 for each new listentry created. Stored as int(11) in the database 

- Output: $gradesys 
   - Type: int
   - Description: Gradesystem. Stored as tinyint(1) in the database

- Output: $tabs 
   - Type: int
   - Description: Tabs settings. Stored as tinyint(4) in the database

- Output: $groupkind 
   - Type: String
   - Description: Group type. Stored as varchar(16) in the database

## Examples of Use
-

### Microservices Used
- getUid_ms
- createNewListEntry_ms
- retrieveSectionedService_ms

--- 

# Name of file/service
setVisibleListEntries_ms

## Description
Updates listentries to be visible by parameter lid

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database
   
- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database

- Parameter: $sectid
   - Type: int
   - Description: Section ID. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: For logging purposes

- Parameter: $visible
   - Type: tinyint
   - Description: Toggle visibility

- Parameter: $vers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: JSON object returned from retrieveSectionedService_ms.php, augmented with the first element containing the debug message.

## Examples of Use


### Microservices Used
- getUid_ms
- retrieveSectionedService_ms

---

# Name of file/service
updateActiveCourseVersion_sectioned_ms

## Description
Microservice that updates the active version of a course

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database
   
- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: For logging purposes

- Parameter: $vers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: JSON object returned from retrieveSectionedService_ms.php, along with the new active course version ID and a debug message

## Examples of Use
-

### Microservices Used
- retrieveSectionedService_ms

---

# Name of file/service  
updateListEntriesTabs_ms.php

## Description  
Updates the 'tabs' value for a specific section in the 'listentries' table.  
This service is restricted to superusers.  

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type

- Parameter: $lid  
  - Type: int  
  - Description: ID of the list entry to be updated

- Parameter: $tabs  
  - Type: string  
  - Description: The new tab configuration string

- Parameter: $courseid  
  - Type: int  
  - Description: Course ID used in data retrieval

- Parameter: $coursevers  
  - Type: int  
  - Description: Version of the course used in data retrieval

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for service logging

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Data returned by 'retrieveSectionedService_ms.php', including updated section information

- Output: debug  
  - Type: string  
  - Description: Error message if the update fails

## Examples of Use  
'UPDATE listentries SET tabs=? WHERE lid=?;'

### Microservices Used  
- getUid_ms.php  
- retrieveSectionedService_ms.php  

---

# Name of file/service  
updateListEntries_ms.php

## Description  
Updates a list entry in the 'listentries' table with new section information such as name, visibility, grading system, moment, kind, and feedback configuration.  

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type

- Parameter: $lid  
  - Type: int  
  - Description: ID of the list entry to be updated

- Parameter: $sectname  
  - Type: string  
  - Description: The updated name/title of the section

- Parameter: $comments  
  - Type: string  
  - Description: Comment or description associated with the section

- Parameter: $highscoremode  
  - Type: int  
  - Description: Highscore mode setting

- Parameter: $feedback  
  - Type: int  
  - Description: Whether feedback is enabled (1) or disabled (0)

- Parameter: $feedbackquestion  
  - Type: string  
  - Description: Feedback question shown if feedback is enabled

- Parameter: $courseid  
  - Type: int  
  - Description: Course ID the section belongs to

- Parameter: $coursevers  
  - Type: int  
  - Description: Course version used for filtering sectioned entries

- Parameter: $link  
  - Type: int  
  - Description: ID of the linked code example

- Parameter: $kind  
  - Type: int  
  - Description: Type of the entry

- Parameter: $moment  
  - Type: int or string  
  - Description: ID of the associated moment, or "null" if none

- Parameter: $visibility  
  - Type: int  
  - Description: Visibility status

- Parameter: $grptype  
  - Type: string  
  - Description: Group type

- Parameter: $tabs  
  - Type: int  
  - Description: Tab configuration value

- Parameter: $gradesys  
  - Type: int  
  - Description: Grading system ID

- Parameter: $coursename  
  - Type: string  
  - Description: Name of the course

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Contains updated section data as returned by retrieveSectionedService_ms.php

- Output: debug  
  - Type: string  
  - Description: Error message if any operation fails

## Examples of Use  
'UPDATE listentries SET highscoremode=?, gradesystem=?, moment=?, entryname=?, kind=?, link=?, visible=?, comments=?, groupKind=?, feedbackenabled=?, feedbackquestion=? WHERE lid=?;'

### Microservices Used  
- getUid_ms.php  
- retrieveSectionedService_ms.php  

---

# Name of file/service
readGroupValues_ms.php

## Description
Retrieves group values and related data from a specific course when a group is clicked on in the UI. Organizes the data and returns it in a structured format.
The group and course data is then added to the $data array retrieved from retrieveSectionedService_ms.php.

## Input Parameters
- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $vers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier, for logging purposes

- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as varchar(8) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: $groups
   - Type: array
   - Description: Array containing groupKind and groupVal. Along with structured data from the function retrieveSectionedService in retrieveSectionedService_ms.php

- Output: $groupKind
   - Type: String
   - Description: Group kind. Stored as varchar(4) in the database

- Output: $groupVal
   - Type: String
   - Description: Group value. Stored as varchar(8) in the database

## Examples of Use
-

### Microservices Used
- retrieveSectionedService_ms.php
- getUid_ms.php

---

# Name of file/service
readUserDuggaFeedback_ms.php

## Description
Fetches user feedback for a specific dugga (quiz) moment within a specific course, and calculates the average feedback score. 
The feedback data is then added to the $data array retrieved from retrieveSectionedService_ms.php.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $moment
   - Type: int
   - Description: Describe parameter. Stored as int(10) in the database

- Parameter: $vers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier, for logging purposes

- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as varchar(8) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: userfeedback
   - Type: array
   - Description: Array containing individual user feedback. Contains $ufid, $username, $cid, $lid, $score and $entryname, from 'userduggafeedback' table

- Output: $ufid
   - Type: int
   - Description: User feedback ID. Stored as int(10) in the database

- Output: $username
   - Type: String
   - Description: User's username. Stored as varchar(80) in the database

- Output: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Output: $lid
   - Type: int
   - Description: List entry ID. Stored as int(10) in the database

- Output: $score
   - Type: int
   - Description: Feedback score. Stored as int(11) in the database

- Output: $entryname
   - Type: String
   - Description: Entry name. Stored as varchar(68) in the database

- Output: feedbackquestion
   - Type: String
   - Description: Feedback question for users to answer. Stored as varchar(512) in the database

- Output: avgfeedbackscore
   - Type: int
   - Description: Avarage feedback score for a specific dugga and course, calculated through SQL AVG()

## Examples of Use
-

### Microservices Used
- retrieveSectionedService_ms.php

---

# Name of file/service  
getDeletedListEntries_ms

## Description
Retrieves all list entries with visibility set to 3 (i.e., marked as deleted) from the 'listentries' table. Used to show items that were previously deleted from the course structure.

## Input Parameters

- Parameter: $opt  
  - Type: string  
  - Description: Operation type (used for logging/debugging).

- Parameter: $courseid  
  - Type: int(10)  
  - Description: Course ID.

- Parameter: $coursevers  
  - Type: int(11)  
  - Description: Course version.

- Parameter: $versid  
  - Type: int(11)  
  - Description: Version ID (not used in logic directly).

- Parameter: $log_uuid  
  - Type: char  
  - Description: UUID used for logging.

## Calling Methods

- GET (getOP)

## Output Data and Format

- Output  
  - Type: JSON  
  - Description: The full sectioned course data, including entries marked as deleted.

## Examples of Use

'SELECT * FROM listentries WHERE visible = '3''

### Microservices Used

- getUid_ms  
- retrieveSectionedService_ms

---

# Name of file/service  
getGroupValues_ms

## Description
Retrieves all available group kinds and their values from the 'groups' table. Used to display group options when interacting with group-related features in a course.

## Input Parameters

- Parameter: $courseid  
  - Type: int(10)  
  - Description: Course ID.

- Parameter: $coursevers  
  - Type: int(11)  
  - Description: Course version.

- Parameter: $versid  
  - Type: int(11)  
  - Description: Version ID (unused in logic).

- Parameter: $log_uuid  
  - Type: char  
  - Description: UUID used for logging.

- Parameter: $opt  
  - Type: string  
  - Description: Operation type (used for logging/debugging).

## Calling Methods

- GET (getOP)

## Output Data and Format

- Output  
  - Type: JSON  
  - Description: The full sectioned course data including group values grouped by kind.

## Examples of Use

'SELECT groupKind, groupVal FROM groups'

### Microservices Used

- getUid_ms  
- retrieveSectionedService_ms

---

# Name of file/service
updateCourseVersion_sectioned_ms.php

## Description
Used for editing, updating and activating course versions. Can only be done by users with access and superusers.
Retrieves all updated data from the database through retrieveCourseedService_ms.php as the output for the microservice.
Logs the operations.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursecode
   - Type: String
   - Description: Course code. Stored as varchar(45) in the database

- (Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database. UNUSED)

- Parameter: $versid
   - Type: int
   - Description: Course version ID. Stored as varchar(8) in the database

- Parameter: $motd
   - Type: String
   - Description: Message of the day for the course version. Stored as varchar(50) in the database

- Parameter: $versname
   - Type: String
   - Description: Name of course version. Stored as varchar(45) in the database

- Parameter: $startdate
   - Type: String
   - Description: Start date of the course version. Stored as datetime in the database

- Parameter: $enddate
   - Type: String
   - Description: End date of the course version. Stored as datetime in the database

- Parameter: $makeactive
   - Type: String
   - Description: Activating the course version. Stored as varchar(8) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: $retrieveArray
   - Type: array
   - Description: Array of data retrieved from retrieveSectionedService_ms.php. Includes detailed information about the courses

## Examples of Use
-

### Microservices Used
- retrieveSectionedService_ms.php
- getUid_ms.php
- curlService.php
- setAsActiveCourse_ms.php

---

# Name of file/service
updateListEntriesGradesystem_ms.php

## Description
Updates the grading system for a list entry/course section. Can only be done by superusers. 
Logs the operation.

## Input Parameters
- Parameter: $sectid
   - Type: int
   - Description: List entry ID. Stored as int(10) in the database

- Parameter: $gradesys
   - Type: int
   - Description: Grading system. Stored as tinyint(1) in the database

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier, for logging purposes

- Parameter: $opt
   - Type: String
   - Description: Operation type

## Calling Methods
- GET

## Output Data and Format
- Output: $data
   - Type: array
   - Description: Array of data retrieved from retrieveSectionedService_ms.php. Includes detailed information about the courses

## Examples of Use
-

### Microservices Used
- getUid_ms.php
- retrieveSectionedService_ms.php

---

# Name of file/service  
readCourseGroupsAndMembers_ms.php

## Description  
Returns a list of group members related to a specific course ID and course version.  
Only users with read, write, or student-teacher access to the course can retrieve this data.  
If a user does not have an email address in the database, a default one is generated based on their username.

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type

- Parameter: $courseid  
  - Type: int  
  - Description: Course ID used to filter results

- Parameter: $coursevers  
  - Type: int  
  - Description: Course version used to filter results

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for service logging

- Parameter: $showgrp  
  - Type: string  
  - Description: Two-letter group prefix to filter specific group members

## Calling Methods  
- GET

## Output Data and Format  
- Output: grplst  
  - Type: array  
  - Description: List of group members (group name, first name, last name, email)

- Output: grpmembershp  
  - Type: string  
  - Description: Group name of the logged-in user

- Output: debug  
  - Type: string  
  - Description: Error message if query fails

## Examples of Use  
SELECT user.uid, user.firstname, user.lastname, user.email, user_course.groups  
FROM user, user_course  
WHERE user.uid=user_course.uid AND user_course.cid=? AND user_course.vers=?;

### Microservices Used  
- retrieveSectionedService_ms.php  
- sessions.php  
- basic.php

---

# Name of file/service  
readCourseVersions_ms.php

## Description  
Fetches all course versions from the 'vers' table.  
Used to populate version selectors or to retrieve metadata for courses.

## Input Parameters  
None

## Calling Methods  
- GET

## Output Data and Format  
- Output: versions  
  - Type: array  
  - Description: Array of course versions including course ID, code, version number, version name, course name(s), start/end date, and MOTD

## Examples of Use  
SELECT cid, coursecode, vers, versname, coursename, coursenamealt, startdate, enddate, motd FROM vers;

### Microservices Used  
- getUid_ms.php  
- sessions.php  
- basic.php

---

# Name of file/service  
removeListEntries_ms.php

## Description
This microservice sets a list entry in the 'listentries' table as "removed" by updating its 'visible' value to 3. After the update, the function "retrieveSectionedService_ms" is called to return updated data relevant to the current course and user.

## Input Parameters
- Parameter: $courseid  
   - Type: int  
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers  
   - Type: String  
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $log_uuid  
   - Type: String  
   - Description: Used for logging.

- Parameter: $opt  
   - Type: String  
   - Description: Operation type

## Calling Methods
- GET

## Output Data and Format

- Output: $data
   - Type: JSON  
   - Description: Result from "retrieveSectionedService_ms"

## Examples of Use
-

### Microservices Used
- getUid_ms.php
- retrieveSectionedService_ms.php

---

# Name of file/service  
reorderListEntries_ms.php

## Description
This microservice reorders entries in the 'listentries' table by updating their "pos" and "moment" values based on the order data received.

## Input Parameters
- Parameter: $courseid  
   - Type: int  
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers  
   - Type: String  
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $pos
   - Type: int
   - Description: Listentry position. Stored as int(11) in the database

- Parameter: $moment  
   - Type: int  
   - Description: moment ID for the listentry. Stored as int(10) in the database

- Parameter: $order  
   - Type: String  
   - Description: String representing new order of entries

- Parameter: $lid  
   - Type: int  
   - Description: Listentry ID. Stored as int(10) in the database

- Parameter: $opt  
   - Type: String  
   - Description: Operation type, must be "REORDER" to trigger update logic

- Parameter: $log_uuid  
   - Type: String  
   - Description: Used for logging.

## Calling Methods
- GET

## Output Data and Format

- Output: $data
   - Type: JSON  
   - Description: Result from "retrieveSectionedService_ms"

## Examples of Use
-

### Microservices Used
- getUid_ms.php  
- retrieveSectionedService_ms.php

---

# Name of file/service
retrieveAllCourseVersions_ms.php

## Description
Delivers course-page JSON for one course and version.
It also counts all course versions to work out totalGroups = 24 × versions for internal debugging only—this value isn’t sent to the user.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Specifies the operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: object/array
   - Type: JSON
   - Description: Echoes the JSON array returned by retrieveSectionedService_ms.php (keys include entries, coursename, versions, results, access flags, etc.).

## Examples of Use
``` fetch("sectionedService/retrieveAllCourseVersions_ms.php?courseid=37&coursevers=30000&opt=READ")
  .then(r => r.json())
  .then(data => console.log(data.entries));
 ```

### Microservices Used
- retrieveSectionedService_ms.php

---

# Name of file/service
retrieveSectionedService_ms.php

## Description
Core read service for the “sectioned” aka “course-page”view. Given a course and a version, it collects everything the user needs to render the page.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Specifies the operation type

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int(10) in the database

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: For logging purposes

## Calling Methods
- GET

## Output Data and Format
- Output: object/array 
  - Type: JSON  
  - Description: Full data package for the course-page view (keys include entries, coursename, versions, results, access flags, etc.).

## Examples of Use
``` async function loadCourse(cid, vers) {
  const res = await fetch(
    `sectionedService/retrieveSectionedService_ms.php?courseid=${cid}&coursevers=${vers}&opt=READ`
  );
  const data = await res.json();
  renderListEntries(data.entries);
  fillVersionSelector(data.versions, data.coursevers);
}
 ```

### Microservices Used
- 

---