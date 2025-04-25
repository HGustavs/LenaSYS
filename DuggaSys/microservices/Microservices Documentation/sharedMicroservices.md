# sharedMicroservices Documentation

# getUid_ms.php

## Description
Retrieves the user's UID (user ID) from the session. If a user is not logged in, guest ID is returned instead.
Also logs events into serviceLogEntries-table.

## Input Parameters

- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseId
   - Type: String
   - Description: Course ID

- Parameter: $courseVersion
   - Type: String
   - Description: Course version

- Parameter: $exampleName
   - Type: String
   - Description: Name of the accessed example

- Parameter: $sectionName
   - Type: String
   - Description: Name of the section within the course

- Parameter: $exampleId
   - Type: String
   - Description: Unique ID for the example

- Parameter: $log_uuid
   - Type: String
   - Description: Unique identifier for logging the event

- Parameter: $log_timestamp
   - Type: String
   - Description: Timestamp for when the log event occured

## Calling Methods
- POST (from getOP-function in basic.php)

## Output Data and Format
- Output: userId
   - Type: String
   - Description: Returns the user's ID from the session, or guest ID if not logged in

## Examples of Use
-

### Microservices Used
sessions.php
basic.php


# isSuperUser_ms.php

## Description
Retrieves the user's UID (user ID) from the session. If a user is not logged in, guest ID is returned instead.
Also logs events into serviceLogEntries-table.

## Input Parameters

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $userId
   - Type: String
   - Description: The user ID, to check if it is a superuser

## Calling Methods
-

## Output Data and Format
- Output: -
   - Type: boolean
   - Description: True if the user is a superuser, false if not

## Examples of Use
-

### Microservices Used
None