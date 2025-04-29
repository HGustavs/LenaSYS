# sharedMicroservices Documentation

# createNewCodeExample_ms.php

## Description
Creates a new code example in the ‘codeexample’ table and logs the event of creating a new code example. 
It retrieves the user ID and username, inserts a new entry into the table, generates a link for the new entry, and logs the event. Then returns the link to the newly created code example as the output.

## Input Parameters
- Parameter: $pdo
   - Type: Database object
   - Description: Database connection 

- Parameter: $exampleid
   - Type: mediumint
   - Description: Example ID (optional), used to name the example section incrementally

- Parameter: $courseid
   - Type: int
   - Description: Course ID that the example belongs to

- Parameter: $coursevers
   - Type: int
   - Description: Course version

- Parameter: $sectname
   - Type: varchar
   - Description: Name of section that the code example will belong to

- Parameter: $link
   - Type: varchar
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
getUID_ms.php
retrieveUsername_ms.php


# createNewListEntry_ms.php

## Description
Inserts a new entry into the ‘listentries’ table in the database, fetches the username of the user who created the entry of the current user and logs the event. Actions and events logged in the system need to be associated with a user.

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $cid
   - Type: int
   - Description: Course ID to which the list entry belongs to

- Parameter: $coursesvers
   - Type: varchar
   - Description: Course version

- Parameter: $userid
   - Type: int
   - Description: User ID of who created the entry

- Parameter: $entryname
   - Type: varchar
   - Description: Name of the entry

- Parameter: $link
   - Type: varchar
   - Description: URL associated with the list entry (?)

- Parameter: $kind
   - Type: int
   - Description: Type/kind of list entry

- Parameter: $comment
   - Type: varchar
   - Description: Comment about list entry

- Parameter: $visible
   - Type: tinyint
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
   - Type: tinyiny
   - Description: Tabs setting. Used for all entry-types, except for kind 4.

- Parameter: $grptype
   - Type: varchar
   - Description: Group kind/type for the entry. If it is UNK/grptype is not used, username of the user who created the entry is logged instead.

## Calling Methods
-

## Output Data and Format
- Output: $debug
   - Type: String
   - Description: 

## Examples of Use
-

### Microservices Used
retrieveUsername_ms.php