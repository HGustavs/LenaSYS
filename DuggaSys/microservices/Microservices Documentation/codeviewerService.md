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
example_ms (replace this line with the name of the microservice)

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists. "Type" is either String or int, but add the specific type in "Description". The specific types can be found in the tables in the database (http://localhost/phpmyadmin/). Switch out varchar/int in the example below, with the correct type.*
- Parameter: paramName
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: paramName
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

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

# Name of file/service
example_ms (replace this line with the name of the microservice)

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists. "Type" is either String or int, but add the specific type in "Description". The specific types can be found in the tables in the database (http://localhost/phpmyadmin/). Switch out varchar/int in the example below, with the correct type.*
- Parameter: paramName
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: paramName
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

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