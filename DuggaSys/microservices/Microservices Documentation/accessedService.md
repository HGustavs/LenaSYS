# accessedService documentation

# addClass_ms.php

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
   - Description: Represents the new class to be added
   - Subvalues:
      - $class (varchar)
      - $responsible (int)
      - $classname (varchar)
      - $regcode (int)
      - $classcode (varchar)
      - $hp (decimal)
      - $tempo (int)
      - $hpProgress (decimal)

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



# addUser_ms.php

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
   - Description: Users to be added, contains data to be inserted into 'user' and/or 'user_course' table?

- Parameter: $coursevers
   - Type: varchar
   - Description: describe parameter

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