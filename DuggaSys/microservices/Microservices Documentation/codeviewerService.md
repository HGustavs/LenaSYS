# Name of file/service
deleteCodeExample_ms.php

## Description
Deletes a code example and its related data from the database if the user has the appropriate permissions, and then retrieves all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice.

## Input Parameters
- Parameter: $exampleId
   - Type: string
   - Description: Example ID. Stored as mediumint in the database

- Parameter: $courseId
   - Type: string
   - Description: Course ID associated with the code example. Stored as int in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version. Stored as int in the database

- Parameter: $boxId
   - Type: string
   - Description: Box ID. Stored as int in the database

- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int in the database

- Parameter: $lid
   - Type: string
   - Description: List entry ID. Stored as int in the database                  



## Calling Methods
- POST

## Output Data and Format
- Output: debug
   - Type: string
   - Description: Error messages if any operation fails

- Output: $data
   - Type: JSON
   - Description: contains data related to the deleted code example

## Examples of Use
'DELETE FROM codeexample WHERE exampleid=:exampleid;'

### Microservices Used
- getUid_ms.php
- retrieveCodeviewerService_ms.php

---

# Name of file/service
editBoxTitle_ms.php

## Description
Updates a box title of a code example when a user with appropriate permissions edits it, and then retrieves all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice.

## Input Parameters
- Parameter: $exampleId
   - Type: string
   - Description: Example ID. Stored as mediumint in the database

- Parameter: $boxId
   - Type: string
   - Description: Box ID. Stored as int in the database

- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $courseId
   - Type: string
   - Description: Course ID associated with the code example. Stored as int in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version. Stored as int in the database

- Parameter: $boxTitle
   - Type: string
   - Description: Box Title. Stored as varchar(20) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int in the database



## Calling Methods
- POST

## Output Data and Format
- Output: $data
   - Type: JSON
   - Description: contains data of the code example related to the updated box title

## Examples of Use
‘UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;’

### Microservices Used
- getUid_ms.php
- retrieveCodeviewerService_ms.php

---