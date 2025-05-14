# Name of file/service
retrieveShowDuggaService_ms.php

## Description
Retrieves and processes a specific dugga for a given course and course version.
Returns the data as an array, containing information about the dugga and its submissions.

## Input Parameters
- Parameter: $moment
   - Type: int
   - Description: ID of a list entry. Stored as int(10) in the database

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $hash
   - Type: String
   - Description: User answer identifier. Stored as varchar(8) in the database

- Parameter: $hashpwd
   - Type: String
   - Description: User answer password. Stored as varchar(8) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $duggaid
   - Type: int
   - Description: Dugga (quiz) ID. Stored as int(10) in the database

- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $group
   - Type: int
   - Description: Group. Stored as int(10) in the database

- Parameter: $score
   - Type: int
   - Description: Answer score. Stored as int(10) in the database

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode for a dugga (quiz). Stored as int(11) in the database

- Parameter: $grade
   - Type: int
   - Description: Users' grade. Stored as tinyint(2) in the database

- Parameter: $submitted
   - Type: String
   - Description: The time an answer was submitted. Stored as timestamp in the database

- Parameter: $duggainfo
   - Type: String
   - Description: Dugga deadline. Stored as datetime in the database

- Parameter: $marked
   - Type: String
   - Description: The time a dugga has been marked. Stored as datetime in the database

- Parameter: $userfeedback
   - Type: String
   - Description: Users' feedback. Stored as text in the database

- Parameter: $feedbackquestion
   - Type: String
   - Description: Feedback question to answer. Stored as varchar(512) in the database

- Parameter: $files
   - Type: String
   - Description: Quiz files. Stored as varchar(255) in the database

- Parameter: $savedvariant
   - Type: String
   - Description: ID of saved variant. Stored as varchar(8) in the database

- Parameter: $ishashindb
   - Type: String
   - Description: Saved variant identifier. Stored as varchar(8) in the database

- Parameter: $variantsize
   - Type: ?
   - Description: ?

- Parameter: $variantvalue
   - Type: ?
   - Description: ?

- Parameter: $password
   - Type: String
   - Description: Password for user answer. Stored as varchar(8) in the database

- Parameter: $hashvariant
   - Type: String
   - Description: Variant identifier. Stored as varchar(8) in the database

- Parameter: $isFileSubmitted
   - Type: boolean
   - Description: If a file has been submitted or not. Boolean - true or false

- Parameter: $variants
   - Type: ?
   - Description: ?

- Parameter: $active
   - Type: String
   - Description: Whether a course or course version is active or not. Stored as varchar(8) in the database

## Calling Methods
- GET
- POST

## Output Data and Format
- Output: $param
   - Type: String
   - Description: Dugga variant parameter. Stored as varchar(8126) in the database

- Output: $answer
   - Type: String
   - Description: User answer for dugga. Stored as text in the database

- Output: $danswer
   - Type: String
   - Description: Correct dugga answer. Stored as text in the database

- Output: $score
   - Type: int
   - Description: Answer score. Stored as int(10) in the database

- Output: $highscoremode
   - Type: int
   - Description: Highscore mode for a dugga (quiz). Stored as int(11) in the database

- Output: $grade
   - Type: int
   - Description: Users' grade. Stored as tinyint(2) in the database

- Output: $submitted
   - Type: String
   - Description: The time an answer was submitted. Stored as timestamp in the database

- Output: $marked
   - Type: String
   - Description: The time a dugga has been marked. Stored as datetime in the database

- Output: $duggainfo[deadline]
   - Type: String
   - Description: Dugga deadline. Stored as datetime in the database

- Output: $duggainfo[qrelease]
   - Type: String
   - Description: Dugga release date and time. Stored as datetime in the database

- Parameter: $files
   - Type: String
   - Description: Quiz files. Stored as varchar(255) in the database

- Output: $userfeedback
   - Type: String
   - Description: Users' feedback. Stored as text in the database

- Output: $feedbackquestion
   - Type: String
   - Description: Feedback question to answer. Stored as varchar(512) in the database

- Output: $savedvariant
   - Type: String
   - Description: ID of saved variant. Stored as varchar(8) in the database

- Output: $ishashindb
   - Type: String
   - Description: Saved variant identifier. Stored as varchar(8) in the database

- Output: $variantsize
   - Type: ?
   - Description: ?

- Output: $variantvalue
   - Type: ?
   - Description: ?

- Output: $password
   - Type: String
   - Description: Password for user answer. Stored as varchar(8) in the database

- Output: $hashvariant
   - Type: String
   - Description: Variant identifier. Stored as varchar(8) in the database

- Output: $isFileSubmitted
   - Type: boolean
   - Description: If a file has been submitted or not

- Output: $isTeacher
   - Type: boolean
   - Description: If a user is a teacher or not. True for both teachers and superusers

- Output: $variants
   - Type: ?
   - Description: ?

- Output: $duggaTitle
   - Type: String
   - Description: List entry name. Stored as varchar(64) in the database

- Parameter: $hash
   - Type: String
   - Description: User answer identifier. Stored as varchar(8) in the database

- Parameter: $hashpwd
   - Type: String
   - Description: User answer password. Stored as varchar(8) in the database

- Output: $opt
   - Type: String
   - Description: Operation type

- Output: $link
   - Type: String
   - Description: Link to list entry. Stored as varchar(200) in the database

- Output: $active
   - Type: int
   - Description: Active users. Stored as int(3) in the database

## Examples of Use
-

### Microservices Used
- processDuggaFile_ms.php

---

