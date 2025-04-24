# sharedMicroservices Documentation

# createNewCodeExample_ms.php

## Description
This service creates a new code example in the ‘codeexample’ table in the database and logs the event (the event of creating a new code example). 
It retrieves the user ID (getUid_ms.php) and username (retrieveUsername_ms.php), inserts a new entry into the 'codeexample' table, generates a link for the new entry, and logs the event. The microservice then returns the link to the newly created code example as the output.

## Input Parameters
- Parameter: $pdo
   - Type: Database object
   - Database connection (PDO)

- Parameter: $exampleid
   - Type: int
   - Description: Example ID (optional), used to name the example section incrementally

- Parameter: $courseid
   - Type: int
   - Description: Course ID that the example belongs to

- Parameter: $coursevers
   - Type: int
   - Description: Course version

- Parameter: $sectname
   - Type: String
   - Description: Name of section that the code example will belong to

- Parameter: $link
   - Type: String
   - Description: Reference link, updated later with the new example ID. Used to store the ID of the new code example

- Parameter: $log_uuid
   - Type: int
   - Description: Logs the event

- Parameter: $templateNumber
   - Type: int
   - Description: Template number/ID for the code example, defaults to 0

## Calling Methods
- 

## Output Data and Format
- Output: debug	
   - Type: String
   - Description: Displays either “Error updating entries” or “NONE!”

- Output: link
   - Type: String
   - Description: Displays the ID of the newly inserted code example in the database

## Examples of Use
-

### Microservices Used
- getUID_ms.php retrieves user ID, to log who has created a new code example
- retrieveUsername_ms.php retrieves the username of the user ID, to log who has created a new code example


# createNewListEntry_ms.php

## Description
Inserts a new entry into the ‘listentries’ table in the database, fetches the username of the user who created the entry of the current user (through retrieveUsername_ms.php) and logs the event. Actions and events logged in the system need to be associated with a user.

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $cid
   - Type: int
   - Description: Course ID to which the list entry belongs to

- Parameter: $coursesvers
   - Type: int
   - Description: Course version

- Parameter: $userid
   - Type: int
   - Description: User ID of who created the entry

- Parameter: $entryname
   - Type: String (?)
   - Description: Name of the entry

- Parameter: $link
   - Type: String (?)
   - Description: URL associated with the list entry (?)

- Parameter: $kind
   - Type: int
   - Description: Type/kind of list entry

- Parameter: $comment
   - Type: int
   - Description: Comment about list entry

- Parameter: $visible
   - Type: int
   - Description: Visibility

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode

- Parameter: $pos
   - Type: int
   - Description: Position, moves one increment up each time an entry is created to make space for new entries

- Parameter: $gradesys
   - Type: int
   - Description: Grading system. Used for entries with kind 4.

- Parameter: $tabs
   - Type: int
   - Description: Tabs setting. Used for all entry-types, except for kind 4.

- Parameter: $grptype
   - Type: int
   - Description: Group kind/type for the entry. If it is UNK/grptype is not used, username of the user who created the entry is logged instead.

## Calling Methods
- POST

## Output Data and Format
- Output: $debug
   - Type: String
   - Description: 

## Examples of Use
-

### Microservices Used
- retrieveUsername_ms.php as an include_once
- basic.php 