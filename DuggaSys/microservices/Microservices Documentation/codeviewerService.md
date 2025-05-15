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

# Name of file/service
editCodeExample_ms.php

## Description
Handles updates of code examples, and then retrieving all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $exampleId
   - Type: string
   - Description: Example ID. Stored as mediumint in the database

- Parameter: $courseId
   - Type: string
   - Description: Course ID associated with the code example. Stored as int in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version associated with the code example. Stored as int in the database

- Parameter: $playlink
   - Type: string
   - Description: Play link for opening demo in code example. Stored as varchar(256) in the database

- Parameter: $exampleName
   - Type: string
   - Description: Name of the code example. Stored as varchar(64) in the database

- Parameter: $sectionName
   - Type: string
   - Description: Name of the section of the code example. Stored as varchar(64) in the database

- Parameter: $beforeId
   - Type: string
   - Description: Before ID. Stored as int in the database

- Parameter: $afterId
   - Type: string
   - Description: After ID. Stored as int in the database

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int in the database                        

## Calling Methods
- POST

## Output Data and Format
- Output: $data
   - Type: JSON
   - Description: Contains data associated with the updated code example

## Examples of Use
`UPDATE codeexample SET runlink = :playlink , examplename = :examplename, sectionname = :sectionname WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;`

### Microservices Used
- retrieveCodeviewerService_ms.php
- getUid_ms.php

---

# Name of file/service
editContentOfExample_ms.php

## Description
Updates the content of a box associated with a certain code example, and then retrieving all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice.

## Input Parameters
- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $courseId
   - Type: string
   - Description: Course ID associated with the code example. Stored as int in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version associated with the code example. Stored as int in the database

- Parameter: $exampleId
   - Type: string
   - Description: Example ID. Stored as mediumint in the database

- Parameter: $boxId
   - Type: string
   - Description: Box ID. Stored as int in the database

- Parameter: $boxTitle
   - Type: string
   - Description: Box Title. Stored as varchar(20) in the database

- Parameter: $boxContent
   - Type: string
   - Description: Box content. Stored as varchar(64) in the database

- Parameter: $wordlist
   - Type: string
   - Description: Word list. Stored as mediumint in the database

- Parameter: $filename
   - Type: string
   - Description: Name of the file related to the code example. Stored as varchar(256) in the database

- Parameter: $fontsize
   - Type: string
   - Description: Font size of the code example. Stored as int in the database

- Parameter: $addedRows
   - Type: string
   - Description: The rows added to the content of code example. Stored in several fields in the improw table in the database

- Parameter: $removedRows
   - Type: string
   - Description: The rows removed from the content of code example. Stored in several fields in the improw table in the database

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int in the database                                 

## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists. "Type" is either String or int, but add the specific type in "Description". The specific types can be found in the tables in the database (http://localhost/phpmyadmin/). Switch out varchar/tinyint in the example below, with the correct type.*
- Output: outputName
   - Type: int
   - Description: Describe the output. Stored as *tinyint(2)* in the database

- Output: outputName
   - Type: String
   - Description: Describe the output. Stored as *varchar(30)* in the database

## Examples of Use
`CODE`

### Microservices Used
- *Includes and microservices used*

---