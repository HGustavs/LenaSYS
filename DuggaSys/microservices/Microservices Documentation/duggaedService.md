# duggaedService Documentation

# Name of file/service  
createDuggaVariant_ms.php

## Description  
Creates a new variant for a dugga and inserts it into the 'variant' table in the database.  
Requires the user to be logged in and have either teacher, write, or superuser access to the specified course.  
Returns updated dugga information by calling retrieveDuggaedService_ms.php.

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type, must be 'ADDVARI'

- Parameter: $qid  
  - Type: int  
  - Description: ID of the dugga this variant belongs to. Stored as int(11) in the database

- Parameter: $disabled  
  - Type: int  
  - Description: Indicates whether the variant is disabled. Stored as tinyint(1) in the database

- Parameter: $parameter  
  - Type: string  
  - Description: Parameter string that defines the variant configuration. Stored as varchar(8126) in the database

- Parameter: $variantanswer  
  - Type: string  
  - Description: The correct answer or solution for the variant. Stored as int(8126) in the database

- Parameter: $cid  
  - Type: int  
  - Description: Course ID for access control. Stored as int(10) in the database

- Parameter: $log_uuid  
  - Type: string  
  - Description: Unique identifier for logging/debugging purposes

- Parameter: $coursevers  
  - Type: string
  - Description: Version of the course used in data retrieval. Stored as varchar(8) in the database

## Calling Methods  
- GET

## Output Data and Format  
- Output: $array  
  - Type: JSON  
  - Description: Contains updated dugga variant data as returned by retrieveDuggaedService_ms.php

- Output: $debug  
  - Type: string  
  - Description: Error message if something goes wrong during the operation

## Examples of Use  
`INSERT INTO variant(quizID, creator, disabled, param, variantanswer) VALUES (...);`

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php  

---

# Name of file/service  
createDugga_ms.php

## Description  
Creates a new dugga by inserting a new row into the 'quiz' table.  
Only accessible to users with write, teacher, or superuser permissions for the specified course.  

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type

- Parameter: $cid  
  - Type: int  
  - Description: Course ID the dugga is associated with. Stored as int(10) in the database

- Parameter: $coursevers  
  - Type: string  
  - Description: Version of the course. Stored as varchar(8) in the database

- Parameter: $nme  
  - Type: string  
  - Description: Name/title of the dugga. Stored as varchar(255) in the database

- Parameter: $autograde  
  - Type: int  
  - Description: Whether the dugga should be auto-graded. Stored as tinyint(1) in the database

- Parameter: $gradesys  
  - Type: int  
  - Description: Grading system ID used for the dugga. Stored as tinyint(1) in the database

- Parameter: $template  
  - Type: string  
  - Description: Template file used for the dugga. Stored as varchar(255) in the database

- Parameter: $jsondeadline  
  - Type: string  
  - Description: JSON string specifying individual deadlines (optional)

- Parameter: $deadline  
  - Type: string (nullable)  
  - Description: General deadline for the dugga. Stored as datetime in the database 

- Parameter: $qstart  
  - Type: string (nullable)  
  - Description: Start time/date of the dugga. Stored as datetime in the database

- Parameter: $release  
  - Type: string (nullable)  
  - Description: Release time/date for the dugga. Stored as datetime in the database

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

## Calling Methods  
- GET

## Output Data and Format  
- Output: $array  
  - Type: JSON  
  - Description: Contains updated dugga data or error/debug information

- Output: $debug  
  - Type: string  
  - Description: Error message or debug info 

## Examples of Use  
`INSERT INTO quiz(cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, creator, vers, qstart, jsondeadline, 'group') VALUES (...);`

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php

---

# Name of file/service  
deleteDuggaVariant_ms.php

## Description  
Deletes a dugga variant from the 'variant' table, along with any associated answers from the 'userAnswer' table.  
Requires the user to be logged in and have write, teacher, or superuser permissions for the specified course.  

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type

- Parameter: $vid  
  - Type: int  
  - Description: ID of the variant to be deleted. Stored as int(11) in the database

- Parameter: $cid  
  - Type: int  
  - Description: Course ID used for access control. Stored as int(10) in the database

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $coursevers  
  - Type: string 
  - Description: Version of the course used in logging and data retrieval. Stored as varchar(8) in the database

## Calling Methods  
- GET

## Output Data and Format  
- Output: $array  
  - Type: JSON  
  - Description: Contains updated dugga data as returned by retrieveDuggaedService_ms.php

- Output: $debug  
  - Type: string  
  - Description: Error message if deletion of variant or userAnswer fails

## Examples of Use  
`DELETE FROM userAnswer WHERE variant=?; DELETE FROM variant WHERE vid=?;`

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php  

---

# Name of file/service  
deleteDugga_ms.php

## Description  
Deletes a dugga from the 'quiz' table, and also removes all related user answers from the 'userAnswer' table.  
The user must be logged in and have either write, teacher, or superuser access to the course.  

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type

- Parameter: $qid  
  - Type: int  
  - Description: ID of the dugga to be deleted. Stored as int(11) in the database

- Parameter: $cid  
  - Type: int  
  - Description: Course ID used for access control. Stored as int(10) in the database

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $coursevers  
  - Type: string  
  - Description: Version of the course used in logging and data retrieval. Stored as varchar(8) in the database

## Calling Methods  
- GET

## Output Data and Format  
- Output: $array  
  - Type: JSON  
  - Description: Contains updated dugga data as returned by retrieveDuggaedService_ms.php

- Output: $debug  
  - Type: string  
  - Description: Error message if quiz or user answers could not be deleted

## Examples of Use  
`DELETE FROM userAnswer WHERE quiz=?; DELETE FROM quiz WHERE id=?;`

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php  

---

# Name of file/service  
retrieveDuggaedService_ms.php

## Description  
Retrieves all duggas for a specific course and course version.
Also loads available dugga templates from the filesystem.  
Returns structured data including quiz details, variant configurations, course information, and debug information.

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation mode 

- Parameter: $qid  
  - Type: int  
  - Description: ID of a specific quiz. Stored as int(11) in the database

- Parameter: $vid  
  - Type: int  
  - Description: ID of a specific variant. Stored as int(11) in the database

- Parameter: $parameter  
  - Type: string  
  - Description: Variant parameter string. Stored as varchar(8126) in the database

- Parameter: $variantanswer  
  - Type: string  
  - Description: Variant answer. Stored as varchar(8126) in the database

- Parameter: $disabled  
  - Type: int  
  - Description: Disabled status of variant. Stored as tinyint(1) in the database

- Parameter: $nme  
  - Type: string  
  - Description: Name of the quiz. Stored as varchar(255) in the database

- Parameter: $cid  
  - Type: int  
  - Description: Course ID for selecting duggas and verifying access. Stored as int(10) in the database

- Parameter: $coursevers  
  - Type: string
  - Description: Course version for filtering quiz entries. Stored as varchar(8) in the database

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for service event logging

- Parameter: $userid  
  - Type: int  
  - Description: ID of the user requesting data. Stored as int(10) in the database

## Calling Methods  
None

## Output Data and Format  
- Output: $entries  
  - Type: JSON-array 
  - Description: List of duggas and their variants for the course

- Output: $debug  
  - Type: string  
  - Description: Debug information about errors during data retrieval

- Output: $writeaccess  
  - Type: boolean  
  - Description: Indicates whether the user has permission to modify the content

- Output: $files  
  - Type: array  
  - Description: List of available dugga template filenames

- Output: $duggaPages  
  - Type: array  
  - Description: Map of dugga template names to their file contents

- Output: $coursecode  
  - Type: int
  - Description: Course code of the selected course. Stored as int(10) in the database

- Output: $coursename  
  - Type: string  
  - Description: Course name of the selected course. Stored as varchar(80) in the database

## Examples of Use  
`SELECT * FROM quiz WHERE cid=? AND vers=?;`

### Microservices Used  
None

---

# Name of file/service  
updateDuggaVariant_ms.php

## Description  
Updates an existing variant in the 'variant' table by modifying its parameter, answer, and disabled status.  

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type

- Parameter: $vid  
  - Type: int  
  - Description: ID of the variant to update. Stored as int(10) in the database

- Parameter: $parameter  
  - Type: string  
  - Description: New parameter string for the variant. Stored as varchar(8126) in the database

- Parameter: $variantanswer  
  - Type: string  
  - Description: New answer string for the variant. Stored as varchar(8126) in the database

- Parameter: $disabled  
  - Type: int  
  - Description: Disabled status of the variant. Stored as tinyint(1) in the database

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $cid  
  - Type: int  
  - Description: Course ID used in data retrieval and access control. Stored as int(10) in the database

- Parameter: $coursevers  
  - Type: string
  - Description: Course version used in data retrieval. Stored as varchar(8) in the database

## Calling Methods  
- GET

## Output Data and Format  
- Output: $array  
  - Type: JSON  
  - Description: Contains updated dugga data as returned by retrieveDuggaedService_ms.php

- Output: $debug  
  - Type: string  
  - Description: Error message if the variant update fails

## Examples of Use  
`UPDATE variant SET disabled=?, param=?, variantanswer=? WHERE vid=?;`

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php   

---

# Name of file/service  
updateDugga_ms.php

## Description  
Updates an existing dugga in the 'quiz' table by modifying its metadata including name, grading system, template, deadlines, and group assignment flag.  

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type

- Parameter: $qid  
  - Type: int  
  - Description: ID of the dugga to update. Stored as int(11) in the database

- Parameter: $uid  
  - Type: int  
  - Description: ID of the user performing the update. Stored as int(10) in the database

- Parameter: $nme  
  - Type: string  
  - Description: Updated name/title of the dugga. Stored as varchar(255) in the database

- Parameter: $autograde  
  - Type: int  
  - Description: Whether the dugga should be auto-graded. Stored as tinyint(1) in the database

- Parameter: $gradesys  
  - Type: int  
  - Description: Grading system ID to apply. Stored as tinyint(1) in the database

- Parameter: $template  
  - Type: string  
  - Description: Updated template filename or type. Stored as varchar(255) in the database

- Parameter: $qstart  
  - Type: string (nullable)  
  - Description: Start date/time for the dugga. Stored as datetime in the database

- Parameter: $deadline  
  - Type: string (nullable)  
  - Description: Deadline for the dugga. Stored as datetime in the database

- Parameter: $release  
  - Type: string (nullable)  
  - Description: Release date/time. Stored as datetime in the database

- Parameter: $jsondeadline  
  - Type: string  
  - Description: JSON string containing additional per-student or per-group deadlines. Stored as varchar(2048) in the database

- Parameter: $log_uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $cid  
  - Type: int  
  - Description: Course ID used in data retrieval and access control. Stored as int(10) in the database

- Parameter: $coursevers  
  - Type: string
  - Description: Course version used in data retrieval. Stored as varchar(8) in the database

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Contains updated dugga data as returned by retrieveDuggaedService_ms.php

- Output: debug  
  - Type: string  
  - Description: Error message if dugga update fails

## Examples of Use  
`UPDATE quiz SET qname=?, autograde=?, gradesystem=?, quizFile=?, qstart=?, deadline=?, qrelease=?, jsondeadline=?, 'group'=? WHERE id=?;`

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php 
