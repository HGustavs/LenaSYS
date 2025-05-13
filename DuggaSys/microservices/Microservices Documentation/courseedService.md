# Name of file/service
changeActiveCourseVersion_courseed_ms.php

## Description
Changes the active course version by updating the activeversion column in the course table.

## Input Parameters
- Parameter: $opt
   - Type: ?
   - Description:

- Parameter: $cid
   - Type: int
   - Description: Course ID

- Parameter: $vers
   - Type: varchar
   - Description: New version ID

## Calling Methods
- GET

## Output Data and Format
- Output: array
   - Type: JSON
   - Description: Updated course info from retrieveCourseedService.

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
getUid_ms
retrieveCourseedService_ms


# Name of file/service
copyCourseVersion_ms.php

## Description
Copies an existing course version with all related things like, quizzes, variants, code examples, etc..

## Input Parameters
- Parameter: $opt
   - Type: ?
   - Description: Specifies the operation type, 'CPYVRS' ?

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
   - Description: The course code

- Parameter: $copycourse
   - Type: ?
   - Description: Version ID of the course to copy from

- Parameter: $startdate
   - Type: datetime
   - Description: Start date of the course version

- Parameter: $enddate
   - Type: datetime
   - Description: End date of the course version

- Parameter: $makeactive
   - Type: ? (int)
   - Description: When set to 3, this activates the new version

- Parameter: $motd
   - Type: varchar
   - Description: Message of the day displayed

- Parameter: $userid
   - Type: int
   - Description: ID of currently logged-in user

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: New course version data

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
- getUid_ms 
- retrieveUsername_ms
- retrieveCourseedService_ms
- createNewListEntry_ms
- createNewCodeExample_ms

# Name of file/service
createCourseVersion_ms.php

## Description
creates a new version of an existing course by inserting a new row into the vers table.

## Input Parameters
- Parameter: $opt
   - Type: ?
   - Description: Specifies the operation type, 'ADDVRS' ?

- Parameter: $cid
   - Type: int
   - Description: Course ID.

- Parameter: $coursecode
   - Type: varchar
   - Description: Course code

- Parameter: $coursename
   - Type: varchar
   - Description: Full course name

- Parameter: $coursenamealt
   - Type: varchar
   - Description: An alternative name for the course

- Parameter: $versname
   - Type: varchar
   - Description: Name for the version

- Parameter: $versid
   - Type: int
   - Description: Unique version ID

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
   - Type: ? (int)
   - Description: When set to 3, this activates the new version

- Parameter: $debug
   - Type: string
   - Description: describe parameter

- Parameter: $ha
   - Type: ?
   - Description: ?

- Parameter: $isSuperUserVar
   - Type: ?
   - Description: ?
   
- Parameter: $userid
   - Type: int
   - Description: Retrieved via getUid(), used for authorization

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Debug message via retrieveCourseedService

## Examples of Use
`CODE`

### Microservices Used
- getUid_ms
- retrieveCourseedService_ms


# Name of file/service
createMOTD_ms.php

## Description
This micro service is called upon when the message of the day is changed in the page associated with courseed.

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection
   
- Parameter: $opt
   - Type: ?
   - Description: Specifies the operation type, 'ADDVRS' ?

- Parameter: $motd
   - Type: varchar
   - Description: Message of the day

- Parameter: $makeactive
   - Type: ? (int)
   - Description: When set to 3, this activates the new version

- Parameter: $userid
   - Type: int
   - Description: Retrieved via getUid(), used for authorization

- Parameter: $debug
   - Type: string
   - Description: Used to store debugging or error messages

- Parameter: $readonly
   - Type: tinyint
   - Description: Indicates if the system should be in read-only mode

- Parameter: $isSuperUserVar
   - Type: ?
   - Description: ?

- Parameter: $ha
   - Type: ?
   - Description: ?
   
## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: JSON object with updated MOTD information

## Examples of Use
`CODE`

### Microservices Used
- getUid_ms
- retrieveCourseedService_ms


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
   - Description: Full course name
   
- Parameter: $courseGitURL
   - Type: int
   - Description: describe parameter

- Parameter: $debug
   - Type: string
   - Description: Used to store debugging or error messages

- Parameter: $isSuperUserVar
   - Type: ?
   - Description: ?

- Parameter: $ha
   - Type: ?
   - Description: ?

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Including LastCourseCreated and all course data

## Examples of Use
`CODE`

### Microservices Used
- getUid_ms
- retrieveUsername_ms
- retrieveCourseedService_ms


# Name of file/service
deleteCourseMaterial_ms.php

## Description
Deletes all course-related data for courses with visibility=3

## Input Parameters
NO INPUT PARAMETERS

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $delete
   - Type: int
   - Description:?

- Parameter: $debug
   - Type: string
   - Description: Used to log error messages if any of the deletion queries fail
   
## Calling Methods
- 

## Output Data and Format
- 

## Examples of Use
`CODE`

### Microservices Used
- 


# Name of file/service
getCourseed_ms.php

## Description
This microservice can be called to simply get the contents return by retrieveCourseedService_ms.php

## Input Parameters
NO INPUT PARAMETERS

- Parameter: $userid
   - Type: int
   - Description: Retrieves the user ID of the currently logged-in user

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $debug
   - Type: string
   - Description: Used to store debugging or error messages

- Parameter: $isSuperUserVar
   - Type: ?
   - Description: ?

- Parameter: $ha
   - Type: ?
   - Description: ?

## Calling Methods
- 

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data from retrieveCourseedService

## Examples of Use
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- basic.php
- sessions.php

# Name of file/service
retrieveAllCourseedServiceData_ms.php

## Description
This microservice can be called to simply get the contents return by retrieveCourseedService_ms.php

## Input Parameters
NO INPUT PARAMETERS

- Parameter: $userid
   - Type: int
   - Description: Retrieves the user ID of the currently logged-in user

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $debug
   - Type: string
   - Description: Used to store debugging or error messages

- Parameter: $isSuperUserVar
   - Type: bool
   - Description: Indicates whether the logged-in user is a superuser

- Parameter: $ha
   - Type: ?
   - Description: ?

## Calling Methods
- 

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data

## Examples of Use
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- basic.php
- sessions.php


# Name of file/service
retrieveCourseedService_ms.php

## Description
Retrieve Information, gathers and returns all course-related data. It also triggers cleanup of deleted courses via an internal cURL call

## Input Parameters
- Parameter: $opt
   - Type: int
   - Description: describe parameter

- Parameter: $cid
   - Type: int
   - Description: Course ID.

- Parameter: $coursename
   - Type: varchar
   - Description: Full course name

- Parameter: $visibility
   - Type: int
   - Description: describe parameter

- Parameter: $versid
   - Type: int
   - Description: describe parameter

- Parameter: $courseGitURL
   - Type: int
   - Description: describe parameter

- Parameter: $log_uuid
   - Type: int
   - Description: describe parameter

- Parameter: $LastCourseCreated
   - Type: int
   - Description: Passed externally to indicate if a new course was just added

- Parameter: $ha
   - Type: bool
   - Description: Write access flag

- Parameter: $isSuperUserVar 
   - Type: bool
   - Description: Indicates if the user is a superuser

## Calling Methods
- 

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data

## Examples of Use
`CODE`

### Microservices Used
- getUid_ms.php
- logServiceEvent()
- deleteCourseMaterial_ms.php
- basic.php, sessions.php


# Name of file/service
specialUpdate_ms.php

## Description
This microservice allows superusers to update the Git URL of a course in the course table.

## Input Parameters
- Parameter: $opt
   - Type: int
   - Description: describe parameter

- Parameter: $cid
   - Type: int
   - Description: describe parameter

- Parameter: $courseGitURL
   - Type: int
   - Description: describe parameter

- Parameter: $userid
   - Type: int
   - Description: describe parameter

- Parameter: $debug
   - Type: int
   - Description: describe parameter

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns the full course-related data

## Examples of Use
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- basic.php s
- essions.php


# Name of file/service
updateActiveCourseVersion_courseed_ms.php

## Description
The microservice changeActiveVersion_ms.php takes an existing course and changes content of the activeversion column.

## Input Parameters
- Parameter: $opt
   - Type: int
   - Description: describe parameter

- Parameter: $courseid
   - Type: int
   - Description: describe parameter

- Parameter: $versid
   - Type: int
   - Description: describe parameter

- Parameter: $debug
   - Type: int
   - Description: describe parameter

- Parameter: $userid
   - Type: int
   - Description: describe parameter

- Parameter: $ha
   - Type: int
   - Description: describe parameter

- Parameter: $isSuperUserVar
   - Type: int
   - Description: describe parameter

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- basic.php 
- sessions.php


# Name of file/service
updateCourse_ms.php

## Description
This microservice allows a superuser to update general course data including the name, visibility, course code, and associated Git URL 

## Input Parameters
- Parameter: $opt
   - Type: int
   - Description: 'UPDATE'

- Parameter: $cid
   - Type: int
   - Description: describe parameter

- Parameter: $coursename
   - Type: int
   - Description: describe parameter

- Parameter: $visibility
   - Type: int
   - Description: describe parameter

- Parameter: $coursecode
   - Type: int
   - Description: describe parameter

- Parameter: $courseGitURL
   - Type: int
   - Description: describe parameter

- Parameter: $userid
   - Type: int
   - Description: describe parameter

- Parameter: $ha
   - Type: int
   - Description: describe parameter

- Parameter: $itsSuperUserVar
   - Type: int
   - Description: describe parameter

- Parameter: $debug
   - Type: int
   - Description: describe parameter

## Calling Methods
- GET

## Output Data and Format
- Output: object
   - Type: JSON
   - Description: Returns course information, list, versions, MOTD and readonly flag

## Examples of Use
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- retrieveUsername_ms.php
- basic.php
- sessions.php
- curlService.php


# Name of file/service
updateCourseVersion_ms.php

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
- Parameter: $opt
   - Type: ?
   - Description: Specifies the operation type, 'CPYVRS' ?

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
   - Description: The course code

- Parameter: $coursename
   - Type: int
   - Description: describe parameter

- Parameter: $copycourse
   - Type: ?
   - Description: Version ID of the course to copy from

- Parameter: $startdate
   - Type: datetime
   - Description: Start date of the course version

- Parameter: $enddate
   - Type: datetime
   - Description: End date of the course version

- Parameter: $makeactive
   - Type: ? (int)
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

## Examples of Use
`CODE`

### Microservices Used
- retrieveCourseedService_ms.php
- getUid_ms.php
- retrieveUsername_ms.php
- setAsActiveCourse_ms.php
- basic.php
- sessions.php
- curlService.php