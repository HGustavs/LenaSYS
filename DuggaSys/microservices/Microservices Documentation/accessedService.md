# Name of file/service
addClass_ms.php

## Description
Allows a superuser to add/insert a new class (course) to the 'class' table. Takes data for a new class (course) in JSON format.
Retrieves all updated data as the output, through retrieveAccessedService_ms.php.
Logs the event and performs authentication.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type, must be 'ADDCLASS' here

- Parameter: $newclass
   - Type: JSON-array
   - Description: Array that epresents the new class to be added (contains class, responsible, classname, regcode, classcode, hp, tempo, hpProgress)

- Parameter: $class
   - Type: String
   - Description: Unique name of the class. Stored as varchar(10) in the database

- Parameter: $responsible
   - Type: int
   - Description: Stored as int(10) in the database

- Parameter: $classname
   - Type: String
   - Description: Classname. Stored as varchar(100) in the database

- Parameter: $regcode
   - Type: int
   - Description: Registration code for the class. Stored as int(8) in the database 

- Parameter: $classcode
   - Type: String
   - Description: Classcode. Stored as varchar(8) in the database

- Parameter: $hp
   - Type: String
   - Description: HP - högskolepoäng. Stored as decimal(10, 1) in the database

- Parameter: $tempo
   - Type: int
   - Description: Tempo of the course as percentage. Stored as int(3) in the database

- Parameter: $hpProgress
   - Type: String
   - Description: HP (högskolepoäng) progress. Stored as decimal(3, 1) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging purposes

## Calling Methods
- POST

## Output Data and Format
- Output: $array
   - Type: JSON-array
   - Description: Contains information about the result of the operation

- Output: $debug
   - Type: String
   - Description: Error message if the user is not a superuser, the $opt is not 'ADDCLASS' or not able to create the class/course

## Examples of Use
`INSERT INTO class (class, responsible, classname (...) ) VALUES(:class, :responsible, :classname (...) );"`

### Microservices Used
- getUid_ms.php
- retrieveAccessedService_ms.php

---

# Name of file/service
addUser_ms.php

## Description
Adding or updating user records and enrollments in specific courses.
Checks if a user exists based on the username, creates a new user if it not and connects them to a course.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type, must be 'ADDUSR' (add user) here

- Parameter: $cid
   - Type: int
   - Description: Course ID for the course to add the student to. Stored as int(10) in the database

- Parameter: $newusers
   - Type: JSON-array
   - Description: Represents the new user to be added (contains username, saveemail, firstname, lastname, ssn, rnd, classname)

- Parameter: $username
   - Type: String
   - Description: Username, derived from the user's email address. Stored as varchar(80) in the database

- Parameter: $saveemail
   - Type: String
   - Description: User's email address, index 3 in $newusers array ($user[3]). Stored as varchar(256) in the database

- Parameter: $firstname
   - Type: String
   - Description: User's firstname, index 1 in $newusers array ($user[1]). Stored as varchar(50) in the database

- Parameter: $lastname
   - Type: String
   - Description: User's lastname, index 2 in $newusers array ($user[2]). Stored as varchar(50) in the database

- Parameter: $ssn
   - Type: String
   - Description: User's social security number, index 0 in $newusers array ($user[0]). Stored as varchar(20) in the database

- Parameter: $rnd
   - Type: String
   - Description: Randomly generated password. Stored as varchar(225) in the database

- Parameter: $classname
   - Type: String
   - Description: Name of class, index 4 in $newusers array ($user[4]). Stored as varchar(100) in the database

- Parameter: $coursevers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging purposes

## Calling Methods
- GET

## Output Data and Format
- Output: $array
   - Type: JSON-array
   - Description: Contains information about the result of the operation

- Output: $debug
   - Type: String
   - Description: Message is displayed if an error occurs

## Examples of Use
`INSERT INTO class (class, responsible) VALUES(:className,1);`

### Microservices Used
- getUid_ms.php
- retrieveAccessedService_ms.php;

---

# name of file/service
getAccessedService_ms.php

## Description
Calls retrieveAccessedService_ms.php to fetch and return data. 

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation option

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging purposes

## Calling Methods
- POST

## Output Data and Format
- Output: $array
   - Type: JSON-array
   - Description: String containing data for a user in a specific course, along with logging information

## Examples of Use
-

### Microservices Used
- getUid_ms.php
- retrieveAccessedService_ms.php

---

# name of file/service
retrieveAccessedService_ms.php

## Description
Retrieves user data, teachers, classes, groups, courses and submission related to a specific course. 
Displays the data as an array.
The data is only retrieved for users who have specific access.

## Input Parameters
- Parameter: $pdo
   - Type: String
   - Description: Database connection

- Parameter: $debug
   - Type: String
   - Description: To log or return debug information in case of errors during the operations

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int(10) in the database

- Parameter: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging purposes

- Parameter: $opt
   - Type: String
   - Description: Operation option

- Parameter: $newusers
   - Type: String
   - Description: String of newly added users

## Calling Methods
-

## Output Data and Format
- Output: $entries
   - Type: array
   - Description: Array of data for all users in a course, JSON-encoded. Contains username, ssn, firstname, lastname, class, modified, examiner, vers, access, groups and requestedpasswordchange

- Output: $debug
   - Type: String
   - Description: Information in case of errors during operations

- Output: $teachers
   - Type: array
   - Description: Array of teachers with access to the specific course. Contains firstname, lastname and uid

- Output: $classes
   - Type: array
   - Description: Array of all classes from the 'class' table. Contains class, responsible, classname, regcode, classcode, hp, tempo and hpProgress

- Output: $courses
   - Type: array
   - Description: Array containing all versions of the specific course. Contains cid, coursecode, vers, versname, coursename, coursenamealt, startdate and enddate

- Output: $groups
   - Type: array
   - Description: Array of all groups. Contains groupval, groupkind and groupint

- Output: $queryResult
   - Type: array
   - Description: Placeholder variable, unused and set to "NONE!"

- Output: $examiners
   - Type: array
   - Description: Array of users with "w" access to the course, which are examiners. Contains uid and username

- Output: $submissions
   - Type: array
   - Description: Array of user submissions in old courses. Contains cid, uid, vers and versname

- Output: $access
   - Type: boolean
   - Description: Whether a user has access or not to view the course data

- Output: $username
   - Type: String
   - Description: Username. Stored as varchar(80) in the database

- Output: $ssn
   - Type: String
   - Description: Social security number. Stored as varchar(20) in the database

- Output: $firstname
   - Type: String
   - Description: User's firstname. Stored as varchar(50) in the database

- Output: $lastname
   - Type: String
   - Description: User's lastname. Stored as varchar(50) in the database

- Output: $class
   - Type: String
   - Description: Class (program). Stored as varchar(10) in the database

- Output: $modified
   - Type: String
   - Description: Last modified. Stored as timestamp in the database

- Output: $examiner
   - Type: int
   - Description: Specific courseexaminor. Stored as int(11) in the database

- Output: $access
   - Type: String
   - Description: Access to change/view data or not. Stored as varchar(10) in the database

- Output: $groups
   - Type: String
   - Description: Group. Stored as varchar(256) in the database

- Output: $requestedpasswordchange
   - Type: int
   - Description: Stored as tinyint(1) in the database

- Output: $uid
   - Type: int
   - Description: User ID. Stored as int(10) in the database

- Output: $responsible
   - Type: int
   - Description: Who is responsible of the class. Stored as int(10) in the database

- Output: $classname
   - Type: String
   - Description: Class' name. Stored as varchar(100) in the database

- Output: $regcode
   - Type: int
   - Description: Registration number. Stored as int(8) in the database

- Output: $classcode
   - Type: String
   - Description: Class (program) code. Stored as varchar(8) in the database

- Output: $hp
   - Type: String
   - Description: HP (högskolepoäng). Stored as decimal(10, 1) in the database

- Output: $tempo
   - Type: int
   - Description: Class tempo/speed. Stored as int(3) in the database

- Output: $hpProgress
   - Type: String
   - Description: HP (högskolepoäng) progress. Stored as decimal(3, 1) in the database

- Output: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Output: $coursecode
   - Type: String
   - Description: Course code. Stored as varchar(45) in the database

- Output: $vers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Output: $versname
   - Type: String
   - Description: Course version name. Stored as varchar(45) in the database

- Output: $coursename
   - Type: String
   - Description: Course name. Stored as varchar(80) in the database

- Output: $coursenamealt
   - Type: String
   - Description: Course name alternative. Stored as varchar(45) in the database

- Output: $startdate
   - Type: String
   - Description: Course's start date. Stored as datetime in the database

- Output: $enddate
   - Type: String
   - Description: Course's end date. Course's start date. Stored as datetime in the database

- Output: $groupval
   - Type: String
   - Description: Stored as varchar(8) in the database

- Output: $groupkind
   - Type: String
   - Description: Stored as varchar(4) in the database

- Output: $groupint
   - Type: int
   - Description: Stored as int(11) in the database

## Examples of Use
`SELECT user_course.uid FROM user_course WHERE user_course.access = 'W' GROUP by user_course.uid;`

### Microservices Used
- getUid_ms.php
- retrieveUsername_ms.php

---

# Name of file/service
updateUser_ms.php

## Description
Handles updating user's properties in the 'user' table. Can be only be done by superusers.

- Parameter: $prop
   - Type: String
   - Description: Which property to update

- Parameter: $courseid
   - Type: String
   - Description: Course id. Stored as int(10) in the database

- Parameter: $uid
   - Type: int
   - Description: User ID. Stored as int(10) in the database

- Parameter: $firstname
   - Type: String
   - Description: Firstname. Stored as varchar(50) in the database

- Parameter: $lastname
   - Type: String
   - Description: Lastname. Stored as varchar(50) in the database

- Parameter: $ssn
   - Type: String
   - Description: Social security number. Stored as varchar(20) in the database

- Parameter: $user_name
   - Type: String
   - Description: Username. Stored as varchar(80) in the database

- Parameter: $classname
   - Type: String
   - Description: Class (program) name. Stored as varchar(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging purposes

## Calling Methods
- POST

## Output Data and Format
- Output: $debug
   - Type: String
   - Description: Displays message if there are errors in operations

- Output: $array
   - Type: JSON
   - Description: Shows logging of the operation and what has been updated


## Examples of Use
`UPDATE user SET firstname=:firstname WHERE uid=:uid;`

### Microservices Used
- retrieveAccessedService_ms.php
- getUid_ms.php

---

# Name of file/service
updateUserCourse_ms.php

## Description
Updates properties for a specific user in the 'user_course' table. Can only be done by superusers or users with specific access.

## Input Parameters
- Parameter: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $prop
   - Type: String
   - Description: Which roperty to update

- Parameter: $groups
   - Type: String
   - Description: Group a user is part of. Stored as varchar(256) in the database

- Parameter: $vers
   - Type: String
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $access
   - Type: String
   - Description: Level of access a user has. Stored as varchar(10) in the database

## Calling Methods
- POST

## Output Data and Format
- Output: $debug
   - Type: String
   - Description: Displays message if there are errors in operations

## Examples of Use
`UPDATE user_course SET examiner=:examiner WHERE uid=:uid AND cid=:cid;`

### Microservices Used
- getUid_ms.php

