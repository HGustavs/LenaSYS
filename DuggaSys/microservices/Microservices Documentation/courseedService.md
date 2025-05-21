# Name of file/service
changeActiveCourseVersion_courseed_ms.php

## Description
Changes the active course version by updating the activeversion column in the course table.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID

- Parameter: $versid
   - Type: varchar
   - Description: ID of the course version to be updated or created

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
`CODE`

### Microservices Used
- getUid_ms
- retrieveCourseedService_ms

---
# Name of file/service
copyCourseVersion_ms.php

## Description
Copies an existing course version with all related things like, quizzes, variants, code examples, etc..

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used

- Parameter: $coursename
   - Type: varchar
   - Description: The name of the course

- Parameter: $versid
   - Type: varchar
   - Description: ID of the course version to be updated or created

- Parameter: $versname
   - Type: varchar
   - Description: Name for the version

- Parameter: $coursenamealt
   - Type: varchar
   - Description: An alternative name for the course

- Parameter: $coursecode
   - Type: varchar
   - Description: Course code

- Parameter: $copycourse
   - Type: varchar
   - Description: Version ID of the course to copy from

- Parameter: $startdate
   - Type: datetime
   - Description: Start date of the course version

- Parameter: $enddate
   - Type: datetime
   - Description: End date of the course version

- Parameter: $makeactive
   - Type: int
   - Description: When set to 3, this activates the new version

- Parameter: $motd
   - Type: varchar
   - Description: Message of the day displayed

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization

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
`CODE`

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
creates a new version of an existing course by inserting a new row into the vers table.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used

- Parameter: $coursecode
   - Type: varchar
   - Description: Course code

- Parameter: $coursename
   - Type: varchar
   - Description: The name of the course

- Parameter: $coursenamealt
   - Type: varchar
   - Description: An alternative name for the course

- Parameter: $versname
   - Type: varchar
   - Description: Name for the version

- Parameter: $versid
   - Type: varchar
   - Description: ID of the course version to be updated or created

- Parameter: $motd
   - Type: varchar
   - Description: Message of the day

- Parameter: $startdate
   - Type: datetime
   - Description: Start date of the course version

- Parameter: $enddate
   - Type: datetime
   - Description: End date of the course version

- Parameter: $makeactive
   - Type: int
   - Description: When set to 3, this activates the new version

- Parameter: $userid
   - Type: int
   - Description: Retrieved via getUid(), used for authorization

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
`CODE`

### Microservices Used
- getUid_ms
- retrieveCourseedService_ms

---
# Name of file/service
createMOTD_ms.php

## Description
This micro service is called upon when the message of the day is changed in the page associated with courseed.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $motd
   - Type: varchar
   - Description: Message of the day

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization

- Parameter: $readonly
   - Type: tinyint
   - Description: Indicates if the system should be in read-only mode
   
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
`CODE`

### Microservices Used
- getUid_ms
- retrieveCourseedService_ms

---
# Name of file/service
createNewCourse_ms.php

## Description
Creates a new course in the course table and logs the event

## Input Parameters
- Parameter: $coursecode
   - Type: varchar
   - Description: Course code

- Parameter: $coursename
   - Type: varchar
   - Description: The name of the course

- Parameter: $courseGitURL  
   - Type: varchar  
   - Description: The URL to the Git repository associated with the course

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization

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
`CODE`

### Microservices Used
- getUid_ms
- retrieveUsername_ms
- retrieveCourseedService_ms

---
# Name of file/service
deleteCourseMaterial_ms.php

## Description
Deletes all course-related data for courses with visibility=3

## Input Parameters

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection
   
## Calling Methods
- 

## Output Data and Format
- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`CODE`

### Microservices Used
- 

---
# Name of file/service
getCourseed_ms.php

## Description
This microservice can be called to simply get the contents return by retrieveCourseedService_ms.php

## Input Parameters

- Parameter: $userid
   - Type: int
   - Description: Retrieves the user ID of the currently logged-in user

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

## Calling Methods
- 

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data from retrieveCourseedService

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php

---
# Name of file/service
retrieveAllCourseedServiceData_ms.php

## Description
This microservice can be called to simply get the contents return by retrieveCourseedService_ms.php

## Input Parameters

- Parameter: $userid
   - Type: int
   - Description: Retrieves the user ID of the currently logged-in user

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

## Calling Methods
- 

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data

- Output: $debug
  - Type: string
  - Description: Error messages if operation fails

## Examples of Use
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php

---
# Name of file/service
retrieveCourseedService_ms.php

## Description
Retrieve Information, gathers and returns all course-related data. It also triggers cleanup of deleted courses via an internal cURL call

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used

- Parameter: $coursename
   - Type: varchar
   - Description: The name of the course

- Parameter: $visibility
   - Type: tinyint
   - Description: Visibility of the section

- Parameter: $versid
   - Type: varchar
   - Description: ID of the course version to be updated or created

- Parameter: $courseGitURL  
   - Type: varchar  
   - Description: The URL to the Git repository associated with the course

- Parameter: $log_uuid
   - Type: int
   - Description: ID of currently logged-in user

- Parameter: $LastCourseCreated
   - Type: int
   - Description: Passed externally to indicate if a new course was just added

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization

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
`CODE`

### Microservices Used
- getUid_ms.php
- deleteCourseMaterial_ms.php

---
# Name of file/service
specialUpdate_ms.php

## Description
This microservice allows superusers to update the Git URL of a course in the course table.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used

- Parameter: $courseGitURL  
   - Type: varchar  
   - Description: The URL to the Git repository associated with the course

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization

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
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php


---
# Name of file/service
updateActiveCourseVersion_courseed_ms.php

## Description
The microservice changeActiveVersion_ms.php takes an existing course and changes content of the activeversion column.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID

- Parameter: $versid
   - Type: varchar
   - Description: ID of the course version to be updated or created

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization

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
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php

---
# Name of file/service
updateCourse_ms.php

## Description
This microservice allows a superuser to update general course data including the name, visibility, course code, and associated Git URL 

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used

- Parameter: $coursename
   - Type: varchar
   - Description: The name of the course

- Parameter: $visibility
   - Type: tinyint
   - Description: Visibility of the section

- Parameter: $coursecode
   - Type: varchar
   - Description: Course code

- Parameter: $courseGitURL  
   - Type: varchar  
   - Description: The URL to the Git repository associated with the course

- Parameter: $userid
   - Type: int
   - Description: User ID, used for authorization

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
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- retrieveUsername_ms.php
- curlService.php

---
# Name of file/service
updateCourseVersion_ms.php

## Description
This microservice is used to update information about a specific course version in the vers table of the database

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Specifies the operation type

- Parameter: $cid
   - Type: int
   - Description: Course ID used to identify which course is being used

- Parameter: $courseid
   - Type: varchar
   - Description: The name of the course

- Parameter: $versid
   - Type: varchar
   - Description: ID of the course version to be updated or created

- Parameter: $versname
   - Type: varchar
   - Description: Name for the version

- Parameter: $coursenamealt
   - Type: varchar
   - Description: An alternative name for the course

- Parameter: $coursecode
   - Type: varchar
   - Description: Course code

- Parameter: $coursename
   - Type: varchar
   - Description: The name of the course

- Parameter: $copycourse
   - Type: varchar
   - Description: Version ID of the course to copy from

- Parameter: $startdate
   - Type: datetime
   - Description: Start date of the course version

- Parameter: $enddate
   - Type: datetime
   - Description: End date of the course version

- Parameter: $makeactive
   - Type: int
   - Description: When set to 3, this activates the new version

- Parameter: $motd
   - Type: varchar
   - Description: Message of the day displayed

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
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- retrieveUsername_ms.php
- setAsActiveCourse_ms.php
- curlService.php