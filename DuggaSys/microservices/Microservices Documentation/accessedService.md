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
getUid_ms.php
retrieveAccessedService_ms.php


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
getUid_ms.php
retrieveAccessedService_ms.php";