# Name of file/service
changeActiveCourseVersion_courseed_ms.php

## Description
Changes the active course version by updating the activeversion column in the 'course' table.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $versid
   - Type: String
   - Description: ID of the course version to be updated or created. Stored as varchar(8) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: array
   - Type: JSON
   - Description: Updated course info from retrieveCourseedService.

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`UPDATE course SET activeversion=:vers WHERE cid=:cid`

### Microservices Used
- getUid_ms
- retrieveCourseedService_ms

---

# Name of file/service
copyCourseVersion_ms.php

## Description
Copies an existing course version with all related things like quizzes, variants, code examples, listentries, quiz answers.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used. Stored as int(10) in the database

- Parameter: $coursename
   - Type: String
   - Description: The name of the course. Stored as varchar(80) in the database

- Parameter: $versid
   - Type: String
   - Description: ID of the course version to be updated or created. Stored as varchar(8) in the database

- Parameter: $versname
   - Type: String
   - Description: Name for the version. Stored as varchar(45) in the database

- Parameter: $coursenamealt
   - Type: String
   - Description: An alternative name for the course. Stored as varchar(45) in the database

- Parameter: $coursecode
   - Type: String
   - Description: Course code. Stored as varchar(45) in the database

- Parameter: $copycourse
   - Type: String
   - Description: Version ID of the table to copy from. Stored as varchar(8) in the database

- Parameter: $startdate
   - Type: String
   - Description: Start date of the course version. Stored as datetime in the database

- Parameter: $enddate
   - Type: String
   - Description: End date of the course version. Stored as datetime in the database

- Parameter: $makeactive
   - Type: int
   - Description: When set to 3, this activates the new version. Stored as varchar(8) in the database

- Parameter: $motd
   - Type: String
   - Description: Message of the day displayed. Stored as varchar(50) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: New course version data

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`INSERT INTO vers (...) SELECT ... FROM vers WHERE cid=:cid AND vers=:copycourse;`

### Microservices Used
- getUid_ms 
- retrieveUsername_ms
- retrieveCourseedService_ms
- createNewListEntry_ms
- createNewCodeExample_ms

---

# Name of file/service
createCourseVersion_ms.php

## Description
Creates a new version of an existing course by inserting a new row into the 'vers' table.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used. Stored as int(10) in the database

- Parameter: $coursecode
   - Type: String
   - Description: Course code. Stored as varchar(45) in the database

- Parameter: $coursename
   - Type: String
   - Description: The name of the course. Stored as varchar(80) in the database

- Parameter: $coursenamealt
   - Type: String
   - Description: An alternative name for the course. Stored as varchar(45) in the database

- Parameter: $versname
   - Type: String
   - Description: Name for the version. Stored as varchar(45) in the database

- Parameter: $versid
   - Type: String
   - Description: ID of the course version to be updated or created. Stored as varchar(8) in the database

- Parameter: $motd
   - Type: String
   - Description: Message of the day. Stored as varchar(50) in the database

- Parameter: $startdate
   - Type: String
   - Description: Start date of the course version. Stored as datetime in the database

- Parameter: $enddate
   - Type: String
   - Description: End date of the course version. Stored as datetime in the database

- Parameter: $makeactive
   - Type: int
   - Description: When set to 3, this activates the new version. Stored as varchar(8) in the database

- Parameter: $userid
   - Type: int
   - Description: Retrieved via getUid(), used for authorization. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Debug message via retrieveCourseedService

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`INSERT INTO settings (motd,readonly) VALUES (:motd, :readonly);`

### Microservices Used
- getUid_ms
- retrieveCourseedService_ms

---

# Name of file/service
createMOTD_ms.php

## Description
This microservice is called upon when the message of the day is changed of the page associated with the specified courseed.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Specifies the operation type

- Parameter: $motd
   - Type: String
   - Description: Message of the day. Stored as varchar(50) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization. Stored as int(10) in the database

- Parameter: $readonly
   - Type: int
   - Description: Indicates if the system should be in read-only mode, read-only flag
   
## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: JSON object with updated MOTD information

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`INSERT INTO settings (motd,readonly) VALUES (:motd, :readonly);`

### Microservices Used
- getUid_ms
- retrieveCourseedService_ms

---

# Name of file/service
createNewCourse_ms.php

## Description
Creates a new course in the 'course' table and logs the event.

## Input Parameters
- Parameter: $coursecode
   - Type: String
   - Description: Course code. Stored as varchar(45) in the database

- Parameter: $coursename
   - Type: String
   - Description: The name of the course. Stored as varchar(80) in the database

- Parameter: $courseGitURL  
   - Type: String
   - Description: The URL to the Git repository associated with the course. Stored as varchar(1024) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Including LastCourseCreated and all course data

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`INSERT INTO course (coursecode,coursename,visibility,creator, hp, courseGitURL) VALUES(:coursecode,:coursename,0,:usrid, 7.5, :courseGitURL)`

### Microservices Used
- getUid_ms
- retrieveUsername_ms
- retrieveCourseedService_ms

---

# Name of file/service
deleteCourseMaterial_ms.php

## Description
Deletes all course-related data from all tables related to courses, for courses with visibility set to 3.

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection
   
## Calling Methods
None

## Output Data and Format
- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`DELETE vers FROM course,vers WHERE course.visibility=:deleted AND vers.cid = course.cid;`

### Microservices Used
None

---

# Name of file/service
getCourseed_ms.php

## Description
This microservice can be called to simply get the contents returned by retrieveCourseedService_ms.php.

## Input Parameters
- Parameter: $userid
   - Type: int
   - Description: Retrieves the user ID of the currently logged-in user. Stored as int(10) in the database

## Calling Methods
None

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data from retrieveCourseedService

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php

---

# Name of file/service
retrieveAllCourseedServiceData_ms.php

## Description
This microservice can be called to simply get the contents returned by retrieveCourseedService_ms.php.

## Input Parameters
- Parameter: $userid
   - Type: int
   - Description: Retrieves the user ID of the currently logged-in user. Stored as int(10) in the database

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

## Calling Methods
None

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`echo callMicroservicePOST("courseedService/retrieveCourseedService_ms.php", $dataToSend, true);`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php

---

# Name of file/service
retrieveCourseedService_ms.php

## Description
Retrieve information, gathers and returns all course-related data. It also triggers cleanup of deleted courses via an internal cURL call.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used. Stored as int(10) in the database

- Parameter: $coursename
   - Type: String
   - Description: The name of the course. Stored as varchar(80) in the database

- Parameter: $visibility
   - Type: int
   - Description: Visibility of the section. Stored as tinyint(1) in the database

- Parameter: $versid
   - Type: String
   - Description: ID of the course version to be updated or created. Stored as varchar(8) in the database

- Parameter: $courseGitURL  
   - Type: String  
   - Description: The URL to the Git repository associated with the course. Stored as varchar(1024) in the database

- Parameter: $log_uuid
   - Type: int
   - Description: ID of currently logged-in user

- Parameter: $LastCourseCreated
   - Type: int
   - Description: Passed externally to indicate if a new course was just added

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`$curl = curl_init($actual_path . "../Shared/deleteCourseMaterial_ms.php");`

### Microservices Used
- getUid_ms.php
- deleteCourseMaterial_ms.php

---

# Name of file/service
specialUpdate_ms.php

## Description
This microservice allows superusers to update the Git URL of a course in the 'course' table.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used. Stored as int(10) in the database

- Parameter: $courseGitURL  
   - Type: string
   - Description: The URL to the Git repository associated with the course. Stored as varchar(1024) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: $object
   - Type: JSON
   - Description: Returns the full course-related data

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php

---

# Name of file/service
updateActiveCourseVersion_courseed_ms.php

## Description
The microservice changeActiveVersion_ms.php takes an existing course and updates the content of the activeversion column.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $versid
   - Type: String
   - Description: ID of the course version to be updated or created. Stored as varchar(8) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: describe the output

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`UPDATE course SET activeversion=:vers WHERE cid=:cid");`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php

---
# Name of file/service
updateCourse_ms.php

## Description
Allows a superuser to update general course data including the name, visibility, course code, and associated Git URL.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used. Stored as int(10) in the database

- Parameter: $coursename
   - Type: String
   - Description: The name of the course. Stored as varchar(80) in the database

- Parameter: $visibility
   - Type: int
   - Description: Visibility of the section. Stored as tinyint(1) in the database

- Parameter: $coursecode
   - Type: String
   - Description: Course code. Stored as varchar(45) in the database

- Parameter: $courseGitURL  
   - Type: String
   - Description: The URL to the Git repository associated with the course. Stored as varchar(1024) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns course information, list, versions, MOTD and readonly flag

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- retrieveUsername_ms.php
- curlService.php

---

# Name of file/service
updateCourseVersion_ms.php

## Description
Updates information about a specific course version in the 'vers' table of the database.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used. Stored as int(10) in the database

- Parameter: $courseid
   - Type: int
   - Description: The name of the course. Stored as int(10) in the database

- Parameter: $versid
   - Type: String
   - Description: ID of the course version to be updated or created. Stored as varchar(8) in the database

- Parameter: $versname
   - Type: String
   - Description: Name for the version. Stored as varchar(45) in the database

- Parameter: $coursenamealt
   - Type: String
   - Description: An alternative name for the course. Stored as varchar(45) in the database

- Parameter: $coursecode
   - Type: String
   - Description: Course code. Stored as varchar(45) in the database

- Parameter: $coursename
   - Type: String
   - Description: The name of the course. Stored as varchar(80) in the database

- Parameter: $copycourse
   - Type: String
   - Description: Version ID of the course to copy from. Stored as varchar(8) in the database

- Parameter: $startdate
   - Type: String
   - Description: Start date of the course version. Stored as datetime in the database

- Parameter: $enddate
   - Type: String
   - Description: End date of the course version. Stored as datetime in the database

- Parameter: $makeactive
   - Type: int
   - Description: When set to 3, this activates the new version. Stored as varchar(8) in the database

- Parameter: $motd
   - Type: String
   - Description: Message of the day displayed. Stored as varchar(50) in the database

- Parameter: $log_uuid
   - Type: int
   - Description: ID of currently logged-in user

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Updated course and version data, MOTD and readonly flags

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`UPDATE vers SET motd=:motd,versname=:versname,startdate=:startdate,enddate=:enddate WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- retrieveUsername_ms.php
- setAsActiveCourse_ms.php
- curlService.php
