# duggaedService Documentation

# Name of file/service  
createDuggaVariant_ms.php

## Description  
Creates a new variant for a dugga and inserts it into the 'variant'` table in the database.  
Requires the user to be logged in and have either teacher, write, or superuser access to the specified course.  
Returns updated dugga information by calling 'retrieveDuggaedService_ms.php'.

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type, must be 'ADDVARI'

- Parameter: $qid  
  - Type: int  
  - Description: ID of the dugga this variant belongs to

- Parameter: $disabled  
  - Type: int  
  - Description: Indicates whether the variant is disabled 

- Parameter: $parameter  
  - Type: string  
  - Description: Parameter string that defines the variant configuration

- Parameter: $variantanswer  
  - Type: string  
  - Description: The correct answer or solution for the variant

- Parameter: $cid  
  - Type: int  
  - Description: Course ID for access control

- Parameter: $log__uuid  
  - Type: string  
  - Description: Unique identifier for logging/debugging purposes

- Parameter: $coursevers  
  - Type: int  
  - Description: Version of the course used in data retrieval

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Contains updated dugga variant data as returned by retrieveDuggaedService_ms.php

- Output: debug  
  - Type: string  
  - Description: Error message if something goes wrong during the operation

## Examples of Use  
'INSERT INTO variant(quizID, creator, disabled, param, variantanswer) VALUES (...);'

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
  - Description: Course ID the dugga is associated with

- Parameter: $coursevers  
  - Type: int  
  - Description: Version of the course

- Parameter: $nme  
  - Type: string  
  - Description: Name/title of the dugga

- Parameter: $autograde  
  - Type: int  
  - Description: Whether the dugga should be auto-graded 

- Parameter: $gradesys  
  - Type: int  
  - Description: Grading system ID used for the dugga

- Parameter: $template  
  - Type: string  
  - Description: Template file used for the dugga

- Parameter: $jsondeadline  
  - Type: string  
  - Description: JSON string specifying individual deadlines (optional)

- Parameter: $deadline  
  - Type: string (nullable)  
  - Description: General deadline for the dugga 

- Parameter: $qstart  
  - Type: string (nullable)  
  - Description: Start time/date of the dugga 

- Parameter: $release  
  - Type: string (nullable)  
  - Description: Release time/date for the dugga 

- Parameter: $log__uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Contains updated dugga data or error/debug information

- Output: debug  
  - Type: string  
  - Description: Error message or debug info 

## Examples of Use  
'INSERT INTO quiz(cid, autograde, gradesystem, qname, quizFile, qrelease, deadline, creator, vers, qstart, jsondeadline, 'group') VALUES (...);'

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
  - Description: ID of the variant to be deleted

- Parameter: $cid  
  - Type: int  
  - Description: Course ID used for access control

- Parameter: $log__uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $coursevers  
  - Type: int  
  - Description: Version of the course used in logging and data retrieval

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Contains updated dugga data as returned by retrieveDuggaedService_ms.php

- Output: debug  
  - Type: string  
  - Description: Error message if deletion of variant or userAnswer fails

## Examples of Use  
'DELETE FROM userAnswer WHERE variant=?; DELETE FROM variant WHERE vid=?;'

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
  - Description: ID of the dugga to be deleted

- Parameter: $cid  
  - Type: int  
  - Description: Course ID used for access control

- Parameter: $log__uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $coursevers  
  - Type: int  
  - Description: Version of the course used in logging and data retrieval

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Contains updated dugga data as returned by retrieveDuggaedService_ms.php

- Output: debug  
  - Type: string  
  - Description: Error message if quiz or user answers could not be deleted

## Examples of Use  
'DELETE FROM userAnswer WHERE quiz=?; DELETE FROM quiz WHERE id=?;'

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
  - Description: ID of a specific quiz 

- Parameter: $vid  
  - Type: int  
  - Description: ID of a specific variant 

- Parameter: $parameter  
  - Type: string  
  - Description: Variant parameter string 

- Parameter: $variantanswer  
  - Type: string  
  - Description: Variant answer

- Parameter: $disabled  
  - Type: int  
  - Description: Disabled status of variant

- Parameter: $nme  
  - Type: string  
  - Description: Name of the quiz

- Parameter: $cid  
  - Type: int  
  - Description: Course ID for selecting duggas and verifying access

- Parameter: $coursevers  
  - Type: int  
  - Description: Course version for filtering quiz entries

- Parameter: $log__uuid  
  - Type: string  
  - Description: UUID used for service event logging

- Parameter: $userid  
  - Type: int  
  - Description: ID of the user requesting data 

## Calling Methods  
- Internally called via function from other microservices  
- No direct HTTP endpoint

## Output Data and Format  
- Output: entries  
  - Type: array (JSON)  
  - Description: List of duggas and their variants for the course

- Output: debug  
  - Type: string  
  - Description: Debug information about errors during data retrieval

- Output: writeaccess  
  - Type: boolean  
  - Description: Indicates whether the user has permission to modify the content

- Output: files  
  - Type: array  
  - Description: List of available dugga template filenames

- Output: duggaPages  
  - Type: array  
  - Description: Map of dugga template names to their file contents

- Output: coursecode  
  - Type: string  
  - Description: Course code of the selected course

- Output: coursename  
  - Type: string  
  - Description: Course name of the selected course

## Examples of Use  
'SELECT * FROM quiz WHERE cid=? AND vers=?;'

### Microservices Used  
- basic.php  
- sessions.php  

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
  - Description: ID of the variant to update

- Parameter: $parameter  
  - Type: string  
  - Description: New parameter string for the variant

- Parameter: $variantanswer  
  - Type: string  
  - Description: New answer string for the variant

- Parameter: $disabled  
  - Type: int  
  - Description: Disabled status of the variant

- Parameter: $log__uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $cid  
  - Type: int  
  - Description: Course ID used in data retrieval and access control

- Parameter: $coursevers  
  - Type: int  
  - Description: Course version used in data retrieval

## Calling Methods  
- GET

## Output Data and Format  
- Output: array  
  - Type: JSON  
  - Description: Contains updated dugga data as returned by retrieveDuggaedService_ms.php

- Output: debug  
  - Type: string  
  - Description: Error message if the variant update fails

## Examples of Use  
'UPDATE variant SET disabled=?, param=?, variantanswer=? WHERE vid=?;'

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php  

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
  - Description: ID of the dugga to update

- Parameter: $uid  
  - Type: int  
  - Description: ID of the user performing the update 

- Parameter: $nme  
  - Type: string  
  - Description: Updated name/title of the dugga

- Parameter: $autograde  
  - Type: int  
  - Description: Whether the dugga should be auto-graded

- Parameter: $gradesys  
  - Type: int  
  - Description: Grading system ID to apply

- Parameter: $template  
  - Type: string  
  - Description: Updated template filename or type

- Parameter: $qstart  
  - Type: string (nullable)  
  - Description: Start date/time for the dugga

- Parameter: $deadline  
  - Type: string (nullable)  
  - Description: Deadline for the dugga

- Parameter: $release  
  - Type: string (nullable)  
  - Description: Release date/time

- Parameter: $jsondeadline  
  - Type: string  
  - Description: JSON string containing additional per-student or per-group deadlines

- Parameter: $log__uuid  
  - Type: string  
  - Description: UUID used for logging/debugging purposes

- Parameter: $cid  
  - Type: int  
  - Description: Course ID used in data retrieval and access control

- Parameter: $coursevers  
  - Type: int  
  - Description: Course version used in data retrieval

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
'UPDATE quiz SET qname=?, autograde=?, gradesystem=?, quizFile=?, qstart=?, deadline=?, qrelease=?, jsondeadline=?, 'group'=? WHERE id=?;'

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php  