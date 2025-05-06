# sectionedService Documentation

# Name of file/service
createListEntry_ms

## Description
Adds a new list entry to a course, handling the creation of a new code example if necessary, and then retrieves the updated sectioned data for the course. List entries are duggas, headers, tests etc.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database
   
- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database

- Parameter: $sectname
   - Type: String
   - Description: Section name. Stored as varchar(64) in the database

- Parameter: $kind
   - Type: int
   - Description: Kind/type of section. Stored as int(10) in the database

- Parameter: $link
   - Type: String
   - Description: Link ID, which indicates whether to create a new code example. If 'link' is '-1', it indicates that a new code example needs to be created. Stored as varchar(200) in the database

- Parameter: $visibility
   - Type: int
   - Description: Visibility of the section. Stored as tinyint(1) in the database

- Parameter: $gradesys
   - Type: int
   - Description: Grading system. Stored as tinyint(1) in the database

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode. Stored as int(11) in the database

- Parameter: $comments
   - Type: String
   - Description: Comments for the section. Stored as varchar(512) in the database

- Parameter: $grptype
   - Type: String
   - Description: Group type. Stored as varchar(16) in the database

- Parameter: $pos
   - Type: int
   - Description: Position of the section. Stored as int(11) in the database

- Parameter: $tabs
   - Type: int
   - Description: Tabs setting. Stored as tinyiny(4) in the database

- Parameter: $userid
   - Type: int
   - Description: ID of the user. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: For logging purposes

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: The script returns a JSON object describing the updated course content, after inserting a new item (like a code example, text, or list entry) into the course.

## Examples of Use
'SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1;'

### Microservices Used
- getUid_ms
- createNewListEntry_ms
- createNewCodeExample_ms
- retrieveSectionedService_ms

---

# Name of file/service
deleteListEntries_ms

## Description
Deletes list entries from the database. List entries are duggas, headers, tests etc.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database
   
- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database

- Parameter: $sectid
   - Type: int
   - Description: Section ID. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: String
   - Description: For logging purposes

## Calling Methods
- GET

## Output Data and Format
- Output
   - Type: JSON
   - Description: The script returns a JSON object describing which listentry that should be deleted from the listentries-table.

## Examples of Use
'DELETE FROM useranswer WHERE moment=:lid'

'DELETE FROM listentries WHERE lid = :lid'

### Microservices Used
- getUid_ms
- retrieveSectionedService_ms
