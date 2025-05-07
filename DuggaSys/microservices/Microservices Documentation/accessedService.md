# Name of file/service
addClass_ms.php

## Description
Allows a superuser to add/insert a new class (course) to the 'class' table. Takes data for a new class (course) in JSON format.
Retrieves all updated data as the output, through retrieveAccessedService_ms.php.
Logs the event and performs authentication.

## Input Parameters
- Parameter: $opt
   - Type: ?
   - Description: Operation type, must be 'ADDCLASS' here

- Parameter: $newclass
   - Type: JSON-array?
   - Description: Represents the new class to be added (contains class, responsible, classname, regcode, classcode, hp, tempo, hpProgress)

- Parameter: $class
   - Type: varchar
   - Description: Unique name of the class

- Parameter: $responsible
   - Type: int
   - Description: -

- Parameter: $classname
   - Type: varchar
   - Description: Classname

- Parameter: $regcode
   - Type: int
   - Description: Registration code for the class 

- Parameter: $classcode
   - Type: varchar
   - Description: Classcode

- Parameter: $hp
   - Type: decimal
   - Description: HP - högskolepoäng

- Parameter: $tempo
   - Type: int
   - Description: Tempo of the course as percentage

- Parameter: $hpProgress
   - Type: decimal
   - Description: HP (högskolepoäng) progress

- Parameter: $log_uuid
   - Type: int
   - Description: Unique identifier for logging purposes

## Calling Methods
- POST

## Output Data and Format
- Output: array
   - Type: JSON
   - Description: Contains information about the result of the operation

- Output: debug
   - Type: String
   - Description: Error message if the user is not a superuser, the $opt is not 'ADDCLASS' or not able to create the class/course

## Examples of Use
-

### Microservices Used
- getUid_ms.php
- retrieveAccessedService_ms.php


# Name of file/service
addUser_ms.php

## Description
Adding or updating user records and enrollments in specific courses.
Checks if a user exists based on the username, creates a new user if it not and connects them to a course.

## Input Parameters
- Parameter: $opt
   - Type: ?
   - Description: Operation type, must be 'ADDUSR' (add user) here

- Parameter: $cid
   - Type: int
   - Description: Course ID for the course to add the student to

- Parameter: $newusers
   - Type: JSON-array
   - Description: Represents the new user to be added (contains username, saveemail, firstname, lastname, ssn, rnd, classname)

- Parameter: $username
   - Type: varchar
   - Description: Username, derived from the user's email address

- Parameter: $saveemail
   - Type: varchar
   - Description: User's email address, index 3 in $newusers array ($user[3])

- Parameter: $firstname
   - Type: varchar
   - Description: User's firstname, index 1 in $newusers array ($user[1])

- Parameter: $lastname
   - Type: varchar
   - Description: User's lastname, index 2 in $newusers array ($user[2])

- Parameter: $ssn
   - Type: varchar
   - Description: User's social security number, index 0 in $newusers array ($user[0])

- Parameter: $rnd
   - Type: varchar
   - Description: Randomly generated password

- Parameter: $classname
   - Type: varchar
   - Description: Name of class, index 4 in $newusers array ($user[4])

- Parameter: $coursevers
   - Type: varchar
   - Description: Course version

- Parameter: $log_uuid
   - Type: int
   - Description: Unique identifier for logging purposes

## Calling Methods
- GET

## Output Data and Format
- Output: array
   - Type: JSON
   - Description: Contains information about the result of the operation

- Output: debug
   - Type: String
   - Description: Message is displayed if an error occurs

## Examples of Use
-

### Microservices Used
- getUid_ms.php
- retrieveAccessedService_ms.php;
- 

# Name of file/service
getAccessedService_ms.php

## Description
Calls retrieveAccessedService_ms.php to fetch and return data. 

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation option

- Parameter: $courseid
   - Type: int
   - Description: Course ID

- Parameter: $log_uuid
   - Type: varchar
   - Description: Unique identifier for logging purposes

## Calling Methods
- POST

## Output Data and Format
- Output: array
   - Type: JSON
   - Description: String containing data for a user in a specific course, along with logging information

## Examples of Use
-

### Microservices Used
- getUid_ms.php
- retrieveAccessedService_ms.php


# Name of file/service
retrieveAccessedService_ms.php

## Description
Retrieves user data, teachers, classes, groups, courses and submission related to a specific course. 
Displays the data as an array.
The data is only retrieved for users who have specific access.

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $debug
   - Type: String
   - Description: To log or return debug information in case of errors during the operations

- Parameter: $userid
   - Type: int
   - Description: User ID

- Parameter: $cid
   - Type: int
   - Description: Course ID

- Parameter: $log_uuid
   - Type: varchar
   - Description: Unique identifier for logging purposes

- Parameter: $opt
   - Type: String
   - Description: Operation option. Optional

- Parameter: $newusers
   - Type: String
   - Description: String of newly added users. Optional

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
   - Type: varchar
   - Description: Username

- Output: $ssn
   - Type: varchar
   - Description: Social security number

- Output: $firstname
   - Type: varchar
   - Description: User's firstname

- Output: $lastname
   - Type: varchar
   - Description: User's lastname

- Output: $class
   - Type: varchar
   - Description: Class (program)

- Output: $modified
   - Type: timestamp
   - Description: Last modified

- Output: $examiner
   - Type: int
   - Description: Specific courseexaminor

- Output: $access
   - Type: varchar
   - Description: Access to change/view data or not

- Output: $groups
   - Type: varchar
   - Description: Group

- Output: $requestedpasswordchange
   - Type: tinyint
   - Description: ?

- Output: $uid
   - Type: varchar
   - Description: User ID

- Output: $responsible
   - Type: int
   - Description: Who is responsible of the class

- Output: $classname
   - Type: varchar
   - Description: Class' name

- Output: $regcode
   - Type: int
   - Description: Registration number

- Output: $classcode
   - Type: varchar
   - Description: Class (program) code

- Output: $hp
   - Type: decimal
   - Description: HP (högskolepoäng)

- Output: $tempo
   - Type: int
   - Description: Class tempo/speed 

- Output: $hpProgress
   - Type: decimal
   - Description: HP (högskolepoäng) progress

- Output: $cid
   - Type: int
   - Description: Course ID

- Output: $coursecode
   - Type: varchar
   - Description: Course code

- Output: $vers
   - Type: varchar
   - Description: Course version

- Output: $versname
   - Type: int
   - Description: Course version name

- Output: $coursename
   - Type: varchar
   - Description: Course name

- Output: $coursenamealt
   - Type: varchar
   - Description: Course name alternative

- Output: $startdate
   - Type: datetime
   - Description: Course's start date

- Output: $enddate
   - Type: datetime
   - Description: Course's end date

- Output: $groupval
   - Type: varchar
   - Description: ?

- Output: $groupkind
   - Type: datetime
   - Description: Group kind/type

- Output: $groupint
   - Type: int
   - Description: ?

## Examples of Use
-

### Microservices Used
None


# Name of file/service
updateUser_ms.php

## Description
Handles updating user's properties in the 'user' table. Can be only be done by superusers.

- Parameter: $prop
   - Type: String
   - Description: Property to update

- Parameter: $courseid
   - Type: String
   - Description: describe parameter

- Parameter: $uid
   - Type: int
   - Description: User ID

- Parameter: $firstname
   - Type: String
   - Description: Firstname

- Parameter: $lastname
   - Type: String
   - Description: Lastname

- Parameter: $ssn
   - Type: String
   - Description: Social security number

- Parameter: $user_name
   - Type: String
   - Description: Username

- Parameter: $classname
   - Type: String
   - Description: Class (program) name

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
-

### Microservices Used
- retrieveAccessedService_ms.php

# Name of file/service
updateUserCourse_ms.php

## Description
Updates properties for a specific user in the 'user_course' table. Can only be done by superusers or users with specific access.

## Input Parameters
- Parameter: $courseid
   - Type: int
   - Description: Course ID

- Parameter: $prop
   - Type: String
   - Description: Property to update

- Parameter: $group
   - Type: String
   - Description: Group

- Parameter: $vers
   - Type: String
   - Description: Course version

- Parameter: $access
   - Type: String
   - Description: Level of access a user has

## Calling Methods
- POST

## Output Data and Format
- Output: $debug
   - Type: String
   - Description: Displays message if there are errors in operations

## Examples of Use
-

### Microservices Used
- getUid_ms.php
