# Name of file/service
createListEntry_ms

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
- GET

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


# REMOVE ALL ABOVE BEFORE MERGE

# Name of file/service
bfs_ms.php
## Description
Traverses a GitHub repository using a breadth-first search (BFS) approach to retrieve metadata or download files. The operation varies depending on the $opt parameter. It supports refreshing metadata, downloading files, or fetching the latest commit hash from a repository. Utilizes GitHub API and optionally a personal access token for extended API access.

## Input Parameters
- Parameter: $url
   - Type: string
   - Description: Url to github commit.

- Parameter: $cid
   - Type: int
   - Description: Course ID.
   
- Parameter: $opt
   - Type: string
   - Description: Options for different operations, can be: GETCOMMIT, REFRESH, DOWNLOAD

## Calling Methods
- POST
## Output Data and Format
- Output
   - Type: JSON
   - Description: If option is GETCOMMIT the script returns a the commits SHA, otherwise no return unless an error occurs in which case an error message is echoed.

## Examples of Use

### Microservices Used
