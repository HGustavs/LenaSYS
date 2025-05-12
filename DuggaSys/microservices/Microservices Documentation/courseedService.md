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
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection
   
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
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists*
- Parameter: paramName
   - Type: int
   - Description: describe parameter

- Parameter: paramName
   - Type: int
   - Description: describe parameter



## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists*
- Output: outputName
   - Type: int
   - Description: describe the output

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*


# Name of file/service
retrieveAllCourseedServiceData_ms.php

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists*
- Parameter: paramName
   - Type: int
   - Description: describe parameter

- Parameter: paramName
   - Type: int
   - Description: describe parameter



## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists*
- Output: outputName
   - Type: int
   - Description: describe the output

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*


# Name of file/service
retrieveCourseedService_ms.php

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists*
- Parameter: paramName
   - Type: int
   - Description: describe parameter

- Parameter: paramName
   - Type: int
   - Description: describe parameter



## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists*
- Output: outputName
   - Type: int
   - Description: describe the output

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*


# Name of file/service
specialUpdate_ms.php

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists*
- Parameter: paramName
   - Type: int
   - Description: describe parameter

- Parameter: paramName
   - Type: int
   - Description: describe parameter



## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists*
- Output: outputName
   - Type: int
   - Description: describe the output

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*


# Name of file/service
updateActiveCourseVersion_courseed_ms.php

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists*
- Parameter: paramName
   - Type: int
   - Description: describe parameter

- Parameter: paramName
   - Type: int
   - Description: describe parameter



## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists*
- Output: outputName
   - Type: int
   - Description: describe the output

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*


# Name of file/service
updateCourse_ms.php

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists*
- Parameter: paramName
   - Type: int
   - Description: describe parameter

- Parameter: paramName
   - Type: int
   - Description: describe parameter



## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists*
- Output: outputName
   - Type: int
   - Description: describe the output

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*


# Name of file/service
updateCourseVersion_ms.php

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists*
- Parameter: paramName
   - Type: int
   - Description: describe parameter

- Parameter: paramName
   - Type: int
   - Description: describe parameter



## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists*
- Output: outputName
   - Type: int
   - Description: describe the output

- Output: outputName
   - Type: String
   - Description: describe the output

## Examples of Use
`CODE`

### Microservices Used
*Includes and microservices used*