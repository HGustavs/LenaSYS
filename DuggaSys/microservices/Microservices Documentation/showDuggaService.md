# Name of file/service
processDuggaFile_ms.php

## Description
Retrieves and processes all submission files from the 'submission' table (i.e. submitted PDF, ZIP files) related to a specific dugga for a given course and version. 

## Input Parameters
- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $duggaid
   - Type: int
   - Description: Dugga ID. Stored as int(11) in the database

- Parameter: $duggainfo
   - Type: String
   - Description: Dugga release date and time. Stored as datetime in the database

- Parameter: $moment
   - Type: int
   - Description: Submission segment/moment. Stored as int(11) in the database

## Calling Methods
-

## Output Data and Format
- Output: $subid
   - Type: int
   - Description: Submission ID. Stored as mediumint(8) in the database

- Output: $vers
   - Type: String
   - Description: Submission version. Stored as varchar(8) in the database

- Output: $did
   - Type: int
   - Description: Dugga ID. Stored as int(11) in the database

- Output: $fieldnme
   - Type: String
   - Description: Field name. Stored as varchar(64) in the database

- Output: $filename
   - Type: String
   - Description: Submitted file name. Stored as varchar(128) in the database

- Output: $filepath
   - Type: String
   - Description: Path to submitted file. Stored as varchar(256) in the database

- Output: $extension
   - Type: String
   - Description: Submitted file extension/type (ZIP, PDF, etc.). Stored as varchar(32) in the database

- Output: $mime
   - Type: String
   - Description: Submitted file's MIME type. Stored as varchar(64) in the database

- Output: $updtime
   - Type: String
   - Description: Time the submission was last updated. Stored as timestamp in the database

- Output: $kind
   - Type: int
   - Description: Kind/type of file. Stored as int(11) in the database

- Output: $seq
   - Type: int
   - Description: Sequence number. Stored as int(11) in the database

- Output: $segment
   - Type: int
   - Description: File segment. Stored as int(11) in the database

- Output: $content
   - Type: ?
   - Description: File content. Will either be unknown, contain the file content (if kind = 3) or the file URL (if kind = 2)

- Output: $feedback
   - Type: ?
   - Description: Feedback for a specific file

- Output: $username
   - Type: String
   - Description: Username. Stored as varchar(80) in the database

- Output: $zipdr
   - Type: ?
   - Description: List of file names

## Examples of Use
`SELECT subid,vers,did,fieldnme,filename,extension (...) from submission WHERE segment=:moment ORDER BY subid,fieldnme,updtime asc`

### Microservices Used
None

---

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
   - Description: Highscore mode for a dugga. Stored as int(11) in the database

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

# Name of file/service
getShowDugga_ms.php

## Description
Calls retrieveShowDuggaService_ms.php to fetch and return specific dugga-data from the database, serving as a direct link between client requests and the database. 

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

- Parameter: $duggaid
   - Type: int
   - Description: Dugga ID. Stored as int(11) in the database

- Parameter: $moment
   - Type: int
   - Description: Submission segment/moment. Stored as int(11) in the database

- Parameter: $segment
   - Type: int
   - Description: Submission segment/moment. Stored as int(11) in the database

- Parameter: $answer
   - Type: String
   - Description: Answer for a dugga. Stored as text in the database

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode for a dugga (quiz). Stored as int(11) in the database

- Parameter: $setanswer
   - Type: String
   - Description: Chosen answer for a dugga. Stored as text in the database

- Parameter: $showall
   - Type: boolean
   - Description: Whether a submission should be shown or not. True or false. True by default

- Parameter: $contactable
   - Type: ?
   - Description: ?

- Parameter: $rating
   - Type: int
   - Description: Dugga score. Stored as int(10) in the database

- Parameter: $entryname
   - Type: String
   - Description: List entry name. Stored as varchar(64) in the database

- Parameter: $hash
   - Type: int
   - Description: Identifier. Stored as varchar(8) in the database

- Parameter: $hashpwd
   - Type: String
   - Description: Hash identifier password. Stored as varchar(8) in the database

- Parameter: $password
   - Type: String
   - Description: Password. Stored as varchar(255) in the database

- Parameter: $AUtoken
   - Type: ?
   - Description: Authentication token

- Parameter: $variantvalue
   - Type: ?
   - Description: ?

- Parameter: $duggatitle
   - Type: String
   - Description: List entry name. Stored as varchar(64) in the database

## Calling Methods
- GET
- POST

## Output Data and Format
- Output: $array
   - Type: JSON
   - Description: The return array from retrieveShowDuggaService_ms, through calling the function retrieveShowDuggaService. Values for parameters are inserted in getShowDugga_ms and passed to the function.

## Examples of Use
-

### Microservices Used
- retrieveShowDuggaService_ms.php

---

# Name of file/service
loadDugga_ms.php

## Description
Retrieves submitted user responses from a dugga, based on specific identifiers such as a hash value or moment identifier.

## Input Parameters
- Parameter: $hash
   - Type: String
   - Description: Unique user answer identifier. Stored as varchar(8) in the database

- Parameter: $moment
   - Type: int
   - Description: Unique user answer identifier for a specific moment. Stored as int(10) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: $variant
   - Type: int
   - Description: Variant ID. Stored as int(11) in the database

- Output: $answer
   - Type: String
   - Description: User's dugga answer. Stored as varchar(30) in the database

- Output: $variantanswer
   - Type: int
   - Description: DUgga variant answer, decoded. Stored as varchar(8126) in the database

- Output: $param
   - Type: String
   - Description: Parameter/question associated with the dugga variant. Stored as varchar(8126) in the database

- Output: $newcourseid
   - Type: int
   - Description: Course ID associated with the dugga. Stored as int(10) in the database

- Output: $newcoursevers
   - Type: String
   - Description: Course version associated with the dugga. Stored as varchar(8) in the database

- Output: $newduggaid
   - Type: int
   - Description: Unique identifier for the dugga. Stored as int(11) in the database

## Examples of Use
`SELECT vid,variant.variantanswer AS variantanswer,useranswer,param,cid,vers,quiz FROM userAnswer LEFT JOIN variant ON userAnswer.variant=variant.vid WHERE hash=:hash`

### Microservices Used
- retrieveShowDuggaService_ms.php
---

# Name of file/service
saveDugga_ms.php

## Description
Handles saving user submissions for a specific dugga. Allows a user to make save multiple dugga answers befor final submission (updating and/or inserting new user answers, and selecting data from the 'userAnswer' table).  The user can update their answer multiple times as needed, and the system manages these updates until an approved grade is received, which then blocks further submissions for that specific dugga.
Calls retrieveShowDuggaService_ms.php to fetch detailed dugga-related data and returns it in JSON format.

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

- Parameter: $duggaid
   - Type: int
   - Description: Dugga ID. Stored as int(11) in the database

- Parameter: $moment
   - Type: int
   - Description: Submission segment/moment. Stored as int(11) in the database

- Parameter: $segment
   - Type: int
   - Description: Submission segment/moment. Stored as int(11) in the database

- Parameter: $answer
   - Type: String
   - Description: Answer for a dugga. Stored as text in the database

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode for a dugga (quiz). Stored as int(11) in the database

- Parameter: $setanswer
   - Type: String
   - Description: Chosen answer for a dugga. Stored as text in the database

- Parameter: $showall
   - Type: boolean
   - Description: Whether a submission should be shown or not. True or false. True by default

- Parameter: $contactable
   - Type: ?
   - Description: ?

- Parameter: $rating
   - Type: int
   - Description: Dugga score. Stored as int(10) in the database

- Parameter: $entryname
   - Type: String
   - Description: List entry name. Stored as varchar(64) in the database

- Parameter: $hash
   - Type: int
   - Description: Identifier. Stored as varchar(8) in the database

- Parameter: $hashpwd
   - Type: String
   - Description: Hash identifier password. Stored as varchar(8) in the database

- Parameter: $password
   - Type: String
   - Description: Password. Stored as varchar(255) in the database

- Parameter: $AUtoken
   - Type: ?
   - Description: Authentication token

- Parameter: $variantvalue
   - Type: ?
   - Description: ?

- Parameter: $duggatitle
   - Type: String
   - Description: List entry name. Stored as varchar(64) in the database

## Calling Methods
- POST

## Output Data and Format
- Output: $array
   - Type: JSON
   - Description: The return array from retrieveShowDuggaService_ms, through calling the function retrieveShowDuggaService. Values for parameters are inserted in saveDugga_ms and passed to the function.

## Examples of Use
`UPDATE userAnswer SET submitted=NOW(), useranswer=:useranswer, timesSubmitted=timesSubmitted+1 WHERE hash=:hash AND password=:hashpwd`

### Microservices Used
- retrieveShowDuggaService_ms.php

---

# Name of file/service
updateActiveUsers_ms.php

## Description
Retrieves information a specific dugga, and tracks and manages active users working on a group dugga/assignment.
Checks whether a specific group identifier (hash) already exists in the 'groupdugga' table. If not, it inserts the initial user token. If the group already exists, it updates the number of active users. 
Calls retrieveShowDuggaService_ms.php to fetch detailed dugga-related data and returns it in JSON format.

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

- Parameter: $duggaid
   - Type: int
   - Description: Dugga ID. Stored as int(11) in the database

- Parameter: $moment
   - Type: int
   - Description: Submission segment/moment. Stored as int(11) in the database

- Parameter: $segment
   - Type: int
   - Description: Submission segment/moment. Stored as int(11) in the database

- Parameter: $answer
   - Type: String
   - Description: Answer for a dugga. Stored as text in the database

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode for a dugga (quiz). Stored as int(11) in the database

- Parameter: $setanswer
   - Type: String
   - Description: Chosen answer for a dugga. Stored as text in the database

- Parameter: $showall
   - Type: boolean
   - Description: Whether a submission should be shown or not. True or false. True by default

- Parameter: $contactable
   - Type: ?
   - Description: ?

- Parameter: $rating
   - Type: int
   - Description: Dugga score. Stored as int(10) in the database

- Parameter: $entryname
   - Type: String
   - Description: List entry name. Stored as varchar(64) in the database

- Parameter: $hash
   - Type: int
   - Description: Identifier. Stored as varchar(8) in the database

- Parameter: $hashpwd
   - Type: String
   - Description: Hash identifier password. Stored as varchar(8) in the database

- Parameter: $password
   - Type: String
   - Description: Password. Stored as varchar(255) in the database

- Parameter: $AUtoken
   - Type: ?
   - Description: Authentication token

- Parameter: $variantvalue
   - Type: ?
   - Description: ?

- Parameter: $duggatitle
   - Type: String
   - Description: List entry name. Stored as varchar(64) in the database

## Calling Methods
- GET
- POST

## Output Data and Format
- Output: $array
   - Type: JSON
   - Description: The return array from retrieveShowDuggaService_ms, through calling the function retrieveShowDuggaService. Values for parameters are inserted in updateActiveUsers_ms and passed to the function.

## Examples of Use
`UPDATE groupdugga SET active_users=:AUtoken WHERE hash=:hash`

### Microservices Used
- retrieveShowDuggaService_ms.php

---
