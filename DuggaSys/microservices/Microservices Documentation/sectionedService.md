{{ ... }}
---
# Name of file/service
retrieveAllCourseVersions_ms

## Description
Retrieves all course versions for a particular course and calculates the number of groups, then delegates to `retrieveSectionedService_ms` to fetch sectioned course data.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database. Use "null" to fetch all versions.

## Calling Methods
- GET

## Output Data and Format
- Output: JSON object
   - Type: JSON
   - Description: JSON-encoded sectioned course data as returned by `retrieveSectionedService_ms.php`

## Examples of Use
-

### Microservices Used
- retrieveSectionedService_ms

---
# Name of file/service
retrieveSectionedService_ms

## Description
Retrieves sectioned information for a specific course and version, including quizzes, list entries, file links, code examples, unmarked submissions, course dates, group memberships, feedback, and related resources. Performs access control checks and logs a service event.

## Input Parameters
- Parameter: $debug
   - Type: String
   - Description: Debug string for internal logging.

- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $userid
   - Type: int
   - Description: User ID for permission and access checks. Stored as int(10) in the database

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging events

## Calling Methods
- GET

## Output Data and Format
- Output: entries
   - Type: array
   - Description: List of list entries (duggas, headers, etc.)

- Output: duggor
   - Type: array
   - Description: Information about quizzes including release and deadlines

- Output: results
   - Type: array
   - Description: Submission results for quizzes, including moment, grade, submitted, marked, useranswer

- Output: links
   - Type: array
   - Description: File links for the course, grouped by type

- Output: codeexamples
   - Type: array
   - Description: Available code examples for the course

- Output: unmarked
   - Type: int
   - Description: Number of unmarked submissions for the course version

- Output: startdate
   - Type: String
   - Description: Version start date (datetime)

- Output: enddate
   - Type: String
   - Description: Version end date (datetime)

- Output: groups
   - Type: array
   - Description: Retrieved group data for the user

- Output: grpmembershp
   - Type: String
   - Description: Group membership string for the user

- Output: grplst
   - Type: array
   - Description: List of available groups

- Output: userfeedback
   - Type: array
   - Description: Feedback entries for the course

- Output: feedbackquestion
   - Type: array
   - Description: Feedback questions for the course

- Output: avgfeedbackscore
   - Type: array
   - Description: Average feedback scores for users

- Output: writeaccess
   - Type: boolean
   - Description: Indicates if the user has write access

- Output: studentteacher
   - Type: boolean
   - Description: Indicates if the user is a studentteacher

- Output: readaccess
   - Type: boolean
   - Description: Indicates if the user has read access

- Output: coursename
   - Type: String
   - Description: Name of the course

- Output: coursecode
   - Type: String
   - Description: Course code

- Output: coursevers
   - Type: String
   - Description: Course version

- Output: courseid
   - Type: int
   - Description: Course ID

- Output: versions
   - Type: array
   - Description: List of course versions from `readCourseVersions_ms.php`

- Output: debug
   - Type: String
   - Description: Debug message if any errors occurred during execution

## Examples of Use
- Called by other microservices such as `retrieveAllCourseVersions_ms`

### Microservices Used
- sessions.php
- basic.php
- readCourseVersions_ms.php
- callMicroserviceGET (for reading course versions)
