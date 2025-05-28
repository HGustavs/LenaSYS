# Name of file/service
getUserAnswer_ms.php

## Description
Retrieves submission data for a given course and version and fills it with data from 'listentries' table.
The data is forwarded to retrieveResultedService for final formatting.

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


## Calling Methods
- GET

## Output Data and Format
- Output: $tableInfo
   - Type: JSON-string
   - Description: Array of parametervalues. Contains $duggaName, $hash, $password, $last_Time_teacher_visited, $submitted, $timesSubmitted, $timesAccessed, $subCourse, link

- Output: $duggaName
   - Type: string
   - Description: Dugga name. Stored as varchar(64) in the database

- Output: $hash
   - Type: string
   - Description: Unique submission-hash. Stored as varchar(8) in the database

- Output: $password
   - Type: string
   - Description: Password for submissions. Stored as varchar(8) in the database

- Output: $last_Time_teacher_visited
   - Type: string
   - Description: When the teacher last visited the user submission. Stored as timestamp in the database

- Output: $submitted
   - Type: string
   - Description: When the dugga answers/submissions were submitted. Stored as timestamp in the database

- Output: $timesSubmitted
   - Type: int
   - Description: How many times an answer has been submitted. Stored as int(5) in the database

- Output: $timesAccessed
   - Type: int
   - Description: How many times a user submission has been accessed/visited. Stored as int(5) in the database

- Output: $subCourse
   - Type: string
   - Description: UNK

- Output: link
   - Type: string
   - Description: UNK    

## Examples of Use
-

### Microservices Used
- getUid_ms
- retrieveResultedService_ms -------> Via POST

---

# Name of file/service
retrieveResultedService_ms.php

## Description
Accepts pre-assembled data and filter options and returns them in JSON  

## Input Parameters
- Parameter: $tableinfo
   - Type: Array
   - Description: JSON encoded array of submission objects. Contains $duggaName, $hash, $password, $last_Time_teacher_visited, $submitted, $timesSubmitted, $timesAccessed, $subCourse, link

- Output: $duggaName
   - Type: string
   - Description: Dugga name. Stored as varchar(64) in the database

- Output: $hash
   - Type: string
   - Description: Unique submission-hash. Stored as varchar(8) in the database

- Output: $password
   - Type: string
   - Description: Password for submissions. Stored as varchar(8) in the database

- Output: $last_Time_teacher_visited
   - Type: string
   - Description: When the teacher last visited the user submission. Stored as timestamp in the database

- Output: $submitted
   - Type: string
   - Description: When the dugga answers/submissions were submitted. Stored as timestamp in the database

- Output: $timesSubmitted
   - Type: int
   - Description: How many times an answer has been submitted. Stored as int(5) in the database

- Output: $timesAccessed
   - Type: int
   - Description: How many times a user submission has been accessed/visited. Stored as int(5) in the database

- Output: $subCourse
   - Type: string
   - Description: UNK

- Parameter: $duggaFilterOptions
   - Type: Array
   - Description: JSON encoded array of filtering options
   
## Calling Methods
- POST

## Output Data and Format
- Output: HTTP response
   - Type: JSON-object
   - Description: The same array of submission objects received in POST

## Examples of Use
-

### Microservices Used
None
