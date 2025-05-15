# sectionedService Documentation

# Name of file/service
createListEntry_ms

## Description
Adds a new list entry to a course, handling the creation of a new code example if necessary, and then retrieves the updated sectioned data for the course. List entries are duggas, headers, tests etc.

## Input Parameters
- Parameter: $opt
   - Type: ?
   - Description: Operation type.

- Parameter: $courseid
   - Type: int(10)
   - Description: Course ID.
   
- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $sectname
   - Type: varchar(64)
   - Description: Section name.

- Parameter: $kind
   - Type: int(10)
   - Description: Kind/type of section. 

- Parameter: $link
   - Type: varchar(200)
   - Description: Link ID, which indicates whether to create a new code example. If 'link' is '-1', it indicates that a new code example needs to be created.

- Parameter: $visibility
   - Type: tinyint(1)
   - Description: Visibility of the section.

- Parameter: $gradesys
   - Type: tinyint(1)
   - Description: Grading system.

- Parameter: $highscoremode
   - Type: int(11)
   - Description: Highscore mode.

- Parameter: $comments
   - Type: varchar(512)
   - Description: Comments for the section.

- Parameter: $grptype
   - Type: varchar(16)
   - Description: Group type.

- Parameter: $pos
   - Type: int(11)
   - Description: Position of the section.

- Parameter: $tabs
   - Type: tinyint(4)
   - Description: Tabs setting.

- Parameter: $userid
   - Type: int(10)
   - Description: ID of the user.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: The script returns a JSON object describing the updated course content, after inserting a new item (like a code example, text, or list entry) into the course.

## Examples of Use
'SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1;'

### Microservices Used
getUid_ms
createNewListEntry_ms
createNewCodeExample_ms
retrieveSectionedService_ms

---

# Name of file/service
deleteListEntries_ms

## Description
Deletes list entries from the database. List entries are duggas, headers, tests etc.

## Input Parameters
- Parameter: $opt
   - Type: ?
   - Description: Operation type.

- Parameter: $courseid
   - Type: int(10)
   - Description: Course ID.
   
- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $sectid
   - Type: int(10)
   - Description: Section ID.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

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
getUid_ms
retrieveSectionedService_ms


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
   - Description: Course ID

- Parameter: $coursevers
   - Type: String
   - Description: Course version

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
   - Description: Groups that users are part of

- Output: $firstname
   - Type: String
   - Description: Firstname

- Output: $lastname
   - Type: String
   - Description: Lastname

- Output: $email
   - Type: String
   - Description: Email address

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

# Name of file/service
getCourseVersion_ms

## Description
Retreives all course versions from the 'verse' table.

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
   - Description: Course ID

- Output: $coursecode
   - Type: String
   - Description: Course code

- Output: $vers
   - Type: String
   - Description: Course version

- Output: $versname
   - Type: String
   - Description: Name of the course version

- Output: $coursename
   - Type: String
   - Description: Course name

- Output: $coursenamealt
   - Type: String
   - Description: Alternative course name

- Output: $startdate
   - Type: String
   - Description: Start date of course version

- Output: $enddate
   - Type: String
   - Description: End date of course version

- Output: $motd
   - Type: String
   - Description: Message of the day for the course version

## Examples of Use
-

### Microservices Used
- getUid_ms.php

# Name of file/service
getListEntries_ms.php

## Description
Fetches all list entries from the database. List entries are duggas, headers, tests etc.

## Input Parameters

- Parameter: $opt
   - Type: string
   - Description: Retrieval options

- Parameter: $courseid
   - Type: int(10)
   - Description: Course ID.

- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: The script returns a JSON object describing which listentry that should be fetched from the listentries-table.

## Examples of Use
### Request
GET /getListEntries_ms.php?opt=all&courseid=42&coursevers=3

### Response 
[
  {
    "sectionName": "Module 1",
    "entries": [
      { "id": 101, "type": "header", "title": "Introduction" },
      { "id": 102, "type": "dugga",  "title": "Quiz 1"       }
    ]
  },
  {
    "sectionName": "Module 2",
    "entries": [
      { "id": 201, "type": "header", "title": "Advanced Topics" },
      { "id": 202, "type": "dugga",  "title": "Quiz 2"            }
    ]
  }
]

## Microservices Used
Shared/basic.php
Shared/sessions.php
sharedMicroservices/getUid_ms.php
retrieveSectionedService_ms.php

# Name of file/service
getUserDuggaFeedback_ms.php

## Description
Fetches All data from Userduggafeedback

## Input Parameters

- Parameter: $opt
   - Type: string
   - Description: Retrieval options

- Parameter: $courseid
   - Type: int(10)
   - Description: Course ID.

- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

- Parameter: $moment
   - Type: int
   - Description: The ID of a specific list entry.

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: The service will return the courses list entries divided into sections . If opt is set to GETUF the service will also return A list of evert piece of feedback individual students have given for the specific entry along with a single int representing the average of all feedback scores

## Examples of Use
### Request
GET /getUserDuggaFeedback_ms.php?opt=GETUF&courseid=42&moment=7

### Response
{
  "sections": [ /* list of course sections and entries */ ],
  "userfeedback": [
    { "username": "student1", "score": 4 },
    { "username": "student2", "score": 3 }
  ],
  "avgfeedbackscore": 3.5
}

## Microservices Used
Shared/basic.php
Shared/sessions.php
sharedMicroservices/getUid_ms.php
retrieveSectionedService_ms.php

---

# Name of file/service  
updateVisibleListEntries_ms.php

## Description  
Updates the visibility status of a list entry in the 'listentries' table.  
This microservice is restricted to superusers and is used to toggle the visibility (shown/hidden) of a section like a dugga, header, test, etc.  

## Input Parameters  
- Parameter: $lid  
  - Type: int  
  - Description: ID of the list entry whose visibility should be updated

- Parameter: $visible  
  - Type: int  
  - Description: Visibility flag (1 = visible, 0 = hidden). Stored as tinyint(1) in the database

- Parameter: $courseid  
  - Type: int  
  - Description: ID of the course containing the list entry

- Parameter: $coursevers  
  - Type: int  
  - Description: Version of the course

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $opt  
  - Type: string  
  - Description: Operation type

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Contains updated sectioned course data as returned by 'retrieveSectionedService_ms.php'

- Output: debug  
  - Type: string  
  - Description: Contains error or status message

## Examples of Use  
'UPDATE listentries SET visible = ? WHERE lid = ?;'

### Microservices Used  
- getUid_ms.php  
- retrieveSectionedService_ms.php  
- sessions.php  
- basic.php  

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
  - Description: Group name(s) of the logged-in user

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