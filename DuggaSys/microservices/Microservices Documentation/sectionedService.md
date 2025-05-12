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