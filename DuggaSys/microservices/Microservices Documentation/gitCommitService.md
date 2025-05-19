# Name of file/service
clearGitFiles_ms.php

## Description
Connects to the SQLite database and clears all entries from the 'gitFiles' table for a specified course ID. Also handles any errors that occur during the process.

## Input Parameters
- Parameter: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

## Calling Methods
None

## Output Data and Format
- Output: $error
   - Type: String
   - Description: Prints "Error updating file entries" if the operation is unsuccessful

## Examples of Use
-

### Microservices Used
None

---

# Name of file/service
fetchOldToken_ms.php

## Description
Retrieves the GitHub token for a specific course ID from the 'gitRepos' table, and returns the token if it exists and is valid; otherwise, it returns null.

## Input Parameters
- Parameter: $pdolite
   - Type: PDO
   - Description: Database connection

- Parameter: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

## Calling Methods
None

## Output Data and Format
- Output: $old_token
   - Type: ?
   - Description: GitToken

- Output: null
   - Type: null
   - Description: Returns null if the git token does not exist or is invalid

## Examples of Use
-

### Microservices Used
None

---