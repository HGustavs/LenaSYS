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
- sessions.php  
- basic.php  


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
- sessions.php  
- basic.php  