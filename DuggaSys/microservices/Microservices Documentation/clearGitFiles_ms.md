# Name of file/service
clearGitFiles_ms

## Description
Clears the gitFiles table in SQLite database when a course has been updated with a new GitHub repository. This function is used by other GitHub microservices to remove old file records before adding new ones.

## Input Parameters
- Parameter: cid
   - Type: int
   - Description: Course ID that identifies which course's files to clear from the database

## Calling Methods
- Function call from other microservices

## Output Data and Format
- Output: None (void function)
   - Type: None
   - Description: The function performs a database operation without returning data. Success/error messages are echoed if errors occur.

## Examples of Use
```php
clearGitFiles($cid);
```

### Microservices Used
- None (this is a base service used by others)

--- 