# duggaedService Documentation

# Name of file/service  
createDuggaVariant_ms.php

## Description  
Creates a new variant for a dugga and inserts it into the `variant` table in the database.  
Requires the user to be logged in and have either teacher, write, or superuser access to the specified course.  
Returns updated dugga information by calling `retrieveDuggaedService_ms.php`.

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type, must be 'ADDVARI'

- Parameter: $qid  
  - Type: int  
  - Description: ID of the dugga/quiz this variant belongs to

- Parameter: $disabled  
  - Type: int  
  - Description: Indicates whether the variant is disabled (0 = active, 1 = disabled)

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
-

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php  

---

# Name of file/service  
createDugga_ms.php

## Description  
Creates a new dugga (quiz) by inserting a new row into the `quiz` table.  
Only accessible to users with write, teacher, or superuser permissions for the specified course.  
Returns the updated dugga data by calling `retrieveDuggaedService_ms.php`.

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type, must be 'SAVDUGGA'

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
  - Description: Whether the dugga should be auto-graded (1 = yes, 0 = no)

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
  - Description: General deadline for the dugga (format: YYYY-MM-DD or NULL)

- Parameter: $qstart  
  - Type: string (nullable)  
  - Description: Start time/date of the dugga (format: YYYY-MM-DD or NULL)

- Parameter: $release  
  - Type: string (nullable)  
  - Description: Release time/date for the dugga (format: YYYY-MM-DD or NULL)

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
  - Description: Error message or debug info in case of permission or SQL errors

## Examples of Use  
`createDugga_ms.php?opt=SAVDUGGA&cid=101&coursevers=3&nme=TestDugga&autograde=1&gradesys=2&template=dugga1&jsondeadline={}&deadline=2025-06-01&qstart=2025-05-15&release=2025-05-10&log__uuid=abc-123`

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php

---

# Name of file/service  
deleteDuggaVariant_ms.php

## Description  
Deletes a dugga variant from the `variant` table, along with any associated answers from the `userAnswer` table.  
Requires the user to be logged in and have write, teacher, or superuser permissions for the specified course.  
Returns updated dugga data by calling `retrieveDuggaedService_ms.php`.

## Input Parameters  
- Parameter: $opt  
  - Type: string  
  - Description: Operation type, must be 'DELVARI'

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
`deleteDuggaVariant_ms.php?opt=DELVARI&vid=55&cid=123&log__uuid=abc123&coursevers=2`

### Microservices Used  
- getUid_ms.php  
- retrieveDuggaedService_ms.php  
- sessions.php  
- basic.php  