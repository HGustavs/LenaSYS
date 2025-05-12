# Name of file/service
highscoreservice_ms.php

## Description
Entry point for highscore-related operations. Accepts a request and delegates to specific internal services based on the opt parameter.

## Input Parameters
- Parameter: opt
   - Type: String
   - Description: Option or operation type passed in request

- Parameter: courseid
   - Type: int
   - Description: ID of the course. Stored as int(10) in the database
   
- Parameter: coursename
    - Type: String
    - Description: Name of the course. Stored as varchar(80) in the database

- Parameter: coursevers
   - Type: String
   - Description: Version of the course. Stored as varchar(8) in the database

- Parameter: did
   - Type: int
   - Description: Dugga ID (quiz). Stored as int(11) in the database

- Parameter: lid
   - Type: int
   - Description: ID of the course. Stored as int(11) in the database
   
- Parameter: moment
    - Type: String
    - Description: Identifier for the specific learning moment. Stored as int(10) in the database

- Parameter: hash
   - Type: String
   - Description: Optional hash value used for verification. Stored as varchar(8) in the database

- Parameter: log_uuid
   - Type: String
   - Description: UUID used for logging events.

## Calling Methods
- GET
- POST

## Output Data and Format
- Output: debug
   - Type: String
   - Description: Debug output or error message

## Examples of Use
-

### Microservices Used
- sessions.php
- basic.php

---

# Name of file/service
retrieveHighscoreService_ms.php

## Description
Retrieves the top 10 high scores for a given dugga and moment. Only includes scores with passing grades. Also returns the current user's score if available.

## Input Parameters
- Parameter: did
   - Type: int
   - Description: Dugga ID (quiz). Stored as int(11) in the database

- Parameter: lid
   - Type: int
   - Description: ID of the course. Stored as int(11) in the database

## Calling Methods
- GET
- POST

## Output Data and Format
- Output: debug
   - Type: String
   - Description: Debug output or error message

- Output: highscores
   - Type: Array
   - Description: List of top 10 users with passing grades. Each entry includes: username: varchar(80), score: int(11).

- Output: user
   - Type: Array or Object
   - Description: The user's score, if not already in the highscore list.

## Examples of Use
-

### Microservices Used
- sessions.php
- basic.php
