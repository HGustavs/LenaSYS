# Name of file/service
deleteCodeExample_ms.php

## Description
Deletes a code example and its related data from the 'improw', 'box', 'impwordlist', 'codeexample' and 'listentries' tables if the user has the appropriate permissions- Then it retrieves all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice.

## Input Parameters
- Parameter: $exampleId
   - Type: int
   - Description: Example ID. Stored as mediumint(8) in the database

- Parameter: $courseId
   - Type: int
   - Description: Course ID associated with the code example. Stored as int(10) in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $boxId
   - Type: int
   - Description: Box ID. Stored as int(10) in the database

- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int(10) in the database

- Parameter: $lid
   - Type: int
   - Description: List entry ID. Stored as int(10) in the database                  


## Calling Methods
- POST

## Output Data and Format
- Output: $debug
   - Type: string
   - Description: Error messages if any operation fails

- Output: $data
   - Type: JSON
   - Description: Contains data related to the deleted code example

## Examples of Use
`DELETE FROM codeexample WHERE exampleid=:exampleid;`

### Microservices Used
- getUid_ms.php
- retrieveCodeviewerService_ms.php

---

# Name of file/service
editBoxTitle_ms.php

## Description
Updates a box title of a code example in the 'box' table when a user with appropriate permissions edits it, and then retrieves all updated data from the database (through retrieveCodeviewerService_ms.php) as the output for the microservice.

## Input Parameters
- Parameter: $exampleId
   - Type: int
   - Description: Example ID. Stored as mediumint(8) in the database

- Parameter: $boxId
   - Type: int
   - Description: Box ID. Stored as int(10) in the database

- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $courseId
   - Type: int
   - Description: Course ID associated with the code example. Stored as int(10) in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $boxTitle
   - Type: string
   - Description: Box Title. Stored as varchar(20) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int(10) in the database

## Calling Methods
- POST

## Output Data and Format
- Output: $data
   - Type: JSON
   - Description: contains data of the code example related to the updated box title

## Examples of Use
`UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;`

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
   - Type: int
   - Description: Example ID. Stored as mediumint(8) in the database

- Parameter: $courseId
   - Type: int
   - Description: Course ID associated with the code example. Stored as int(10) in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version associated with the code example. Stored as varchar(8) in the database

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
   - Type: int
   - Description: Before ID. Stored as int(11) in the database

- Parameter: $afterId
   - Type: int
   - Description: After ID. Stored as int(11) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int(10) in the database                        

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
   - Type: int
   - Description: Course ID associated with the code example. Stored as int(10) in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version associated with the code example. Stored as varchar(8) in the database

- Parameter: $exampleId
   - Type: int
   - Description: Example ID. Stored as mediumint(8) in the database

- Parameter: $boxId
   - Type: int
   - Description: Box ID. Stored as int(10) in the database

- Parameter: $boxTitle
   - Type: string
   - Description: Box Title. Stored as varchar(20) in the database

- Parameter: $boxContent
   - Type: string
   - Description: Box content. Stored as varchar(64) in the database

- Parameter: $wordlist
   - Type: string
   - Description: Word list. Stored as mediumint(8) in the database

- Parameter: $filename
   - Type: string
   - Description: Name of the file related to the code example. Stored as varchar(256) in the database

- Parameter: $fontsize
   - Type: int
   - Description: Font size of the code example. Stored as int(11) in the database

- Parameter: $addedRows
   - Type: int
   - Description: The rows added to the content of code example. Stored as int(11) in the database

- Parameter: $removedRows
   - Type: string
   - Description: The rows removed from the content of code example. Stored as int(11) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int(10) in the database                                 

## Calling Methods
- POST

## Output Data and Format
- Output: $data
   - Type: JSON
   - Description: Contains data associated with the updated content of a code example

## Examples of Use
` UPDATE box SET boxtitle=:boxtitle, boxcontent=:boxcontent, filename=:filename, fontsize=:fontsize, wordlistid=:wordlist WHERE boxid=:boxid AND exampleid=:exampleid; `

### Microservices Used
- getUid_ms.php
- retrieveCodeviewerService_ms.php

---

# Name of file/service
retrieveCodeviewerService_ms.php

## Description
Retrieves updated data from the 'codeexample' table and stores it in an array. The file outputs information about a specific code example in a course, including details, related examples, important lines, words, file directories, and user access levels. It makes sure only authorized users can view and change this information. It also logs the service event.

## Input Parameters
- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int(10) in the database

- Parameter: $exampleId
   - Type: int
   - Description: Example ID. Stored as mediumint(8) in the database

- Parameter: $courseId
   - Type: int
   - Description: Course ID associated with the code example. Stored as int(10) in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $sectionName
   - Type: string
   - Description: Name of the section of the code example. Stored as varchar(64) in the database

- Parameter: $exampleName
   - Type: string
   - Description: Name of the code example. Stored as varchar(64) in the database

- Parameter: $playlink
   - Type: string
   - Description: Runlink for opening demo in code example. Stored as varchar(256) in the database

- Parameter: $log_uuid
   - Type: string
   - Description: Logs UUID for the event                     

## Calling Methods
- function call


## Output Data and Format
- Output: $array
   - Type: JSON
   - Description: Contains data associated with a code example

## Examples of Use
`SELECT exampleid, sectionname, examplename, beforeid, afterid FROM codeexample WHERE cid = :cid AND cversion = :cvers ORDER BY sectionname, examplename;`

### Microservices Used
- 

---

# Name of file/service
updateCodeExampleTemplate_ms.php

## Description
Used when you create a new code example for a course and choose a template to display that code. The microservice selects the selected template and retrieves a CSS-file containing the template to display on the page.

## Input Parameters
- Parameter: $userid
   - Type: int
   - Description: User ID. Stored as int(10) in the database

- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $templateNumber
   - Type: int
   - Description: Template ID. Stored as int(10) in the database

- Parameter: $exampleId
   - Type: int
   - Description: Example ID. Stored as mediumint(8) in the database

- Parameter: $courseId
   - Type: int
   - Description: Course ID associated with the code example. Stored as int(10) in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database            

## Calling Methods
- function call

## Output Data and Format
- 

## Examples of Use
`UPDATE codeexample SET templateid = :templateno WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;`

### Microservices Used
- getUid_ms.php
