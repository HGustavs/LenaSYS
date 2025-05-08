# sectionedService Documentation

# createListEntry_ms

## Description
Adds a new list entry to a course, handling the creation of a new code example if necessary, and then retrieves the updated sectioned data for the course. List entries are duggas, headers, tests etc.

## Input Parameters

- Parameter: $opt
   - Type: ?
   - Description: Operation type.

- Parameter: $courseid
   - Type: int(10)
   - Description: Course ID.
   
- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $sectname
   - Type: varchar(64)
   - Description: Section name.

- Parameter: $kind
   - Type: int(10)
   - Description: Kind/type of section. 

- Parameter: $link
   - Type: varchar(200)
   - Description: Link ID, which indicates whether to create a new code example. If 'link' is '-1', it indicates that a new code example needs to be created.

- Parameter: $visibility
   - Type: tinyint(1)
   - Description: Visibility of the section.

- Parameter: $gradesys
   - Type: tinyint(1)
   - Description: Grading system.

- Parameter: $highscoremode
   - Type: int(11)
   - Description: Highscore mode.

- Parameter: $comments
   - Type: varchar(512)
   - Description: Comments for the section.

- Parameter: $grptype
   - Type: varchar(16)
   - Description: Group type.

- Parameter: $pos
   - Type: int(11)
   - Description: Position of the section.

- Parameter: $tabs
   - Type: tinyint(4)
   - Description: Tabs setting.

- Parameter: $userid
   - Type: int(10)
   - Description: ID of the user.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

## Calling Methods

- GET (getOP)

## Output Data and Format

- Output
   - Type: JSON
   - Description: The script returns a JSON object describing the updated course content, after inserting a new item (like a code example, text, or list entry) into the course.

## Examples of Use

'SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1;'

### Microservices Used

getUid_ms
createNewListEntry_ms
createNewCodeExample_ms
retrieveSectionedService_ms

---

# deleteListEntries_ms

## Description
Deletes list entries from the database. List entries are duggas, headers, tests etc.

## Input Parameters

$sectid = getOP('lid');

- Parameter: $opt
   - Type: ?
   - Description: Operation type.

- Parameter: $courseid
   - Type: int(10)
   - Description: Course ID.
   
- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $sectid
   - Type: int(10)
   - Description: Section ID.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

## Calling Methods

- GET (getOP)

## Output Data and Format

- Output
   - Type: JSON
   - Description: The script returns a JSON object describing which listentry that should be deleted from the listentries-table.

## Examples of Use

'DELETE FROM useranswer WHERE moment=:lid'

'DELETE FROM listentries WHERE lid = :lid'

### Microservices Used

getUid_ms
retrieveSectionedService_ms

---

# Name of file/service  
getDeletedListEntries_ms

## Description
Retrieves all list entries with visibility set to 3 (i.e., marked as deleted) from the 'listentries' table. Used to show items that were previously deleted from the course structure.

## Input Parameters

- Parameter: $opt  
  - Type: string  
  - Description: Operation type (used for logging/debugging).

- Parameter: $courseid  
  - Type: int(10)  
  - Description: Course ID.

- Parameter: $coursevers  
  - Type: int(11)  
  - Description: Course version.

- Parameter: $versid  
  - Type: int(11)  
  - Description: Version ID (not used in logic directly).

- Parameter: $log_uuid  
  - Type: char  
  - Description: UUID used for logging.

## Calling Methods

- GET (getOP)

## Output Data and Format

- Output  
  - Type: JSON  
  - Description: The full sectioned course data, including entries marked as deleted.

## Examples of Use

'SELECT * FROM listentries WHERE visible = '3''

### Microservices Used

- getUid_ms  
- retrieveSectionedService_ms

---

# Name of file/service  
getGroupValues_ms

## Description
Retrieves all available group kinds and their values from the 'groups' table. Used to display group options when interacting with group-related features in a course.

## Input Parameters

- Parameter: $courseid  
  - Type: int(10)  
  - Description: Course ID.

- Parameter: $coursevers  
  - Type: int(11)  
  - Description: Course version.

- Parameter: $versid  
  - Type: int(11)  
  - Description: Version ID (unused in logic).

- Parameter: $log_uuid  
  - Type: char  
  - Description: UUID used for logging.

- Parameter: $opt  
  - Type: string  
  - Description: Operation type (used for logging/debugging).

## Calling Methods

- GET (getOP)

## Output Data and Format

- Output  
  - Type: JSON  
  - Description: The full sectioned course data including group values grouped by kind.

## Examples of Use

'SELECT groupKind, groupVal FROM groups'

### Microservices Used

- getUid_ms  
- retrieveSectionedService_ms