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

# Name of file/service
getCourseID_ms.php

## Description
Responsible for retrieving the course ID from a database based on a given GitHub URL. Looks up a course ID in a database based on the given GitHub URL, formats the URL for the query, retrieves the course ID if available, and adds the information to the SQLite database if a match is found, through insertIntoSQLite_ms.php.

## Input Parameters
- Parameter: $githubURL
   - Type: String
   - Description: GitHub URL. Stored as varchar(1024) in the database

## Calling Methods
None

## Output Data and Format
None

## Examples of Use
-

### Microservices Used
None

---

# Name of file/service
insertIntoSQLite_ms.php

## Description
Updates the SQLite database with the latest details about a GitHub repository for a specific course, including the most recent commit and token. It makes sure the database record is either updated or inserted and refreshes the repository information if needed.

## Input Parameters
- Parameter: $githubURL
   - Type: String
   - Description: GitHub URL. Stored as varchar(1024) in the database

- Parameter: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $token
   - Type: ?
   - Description: GitToken

## Calling Methods
- POST

## Output Data and Format
- Output: $lastCommit
   - Type: 
   - Description: The most recent commit hash, received through the 'bfs()' function in 'bfs_ms.php' microservice

- Output: $error
   - Type: String
   - Description: Error message if operation fails

- Output: bfs($url, $cid, "REFRESH")
   - Type:
   - Description: Updates the database with the latest details, through the 'bfs()' function in 'bfs_ms.php' microservice

## Examples of Use
-

### Microservices Used
None

---

# Name of file/service
newUpdateTime_ms.php

## Description
Updates the MySQL database to save the latest update time

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $currentTime
   - Type: String
   - Description: UNIX timestamp of the latest update, converted into datetime. Originally stored as timestamp in the database

- Parameter: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

## Calling Methods
- Function call

## Output Data and Format
None

## Examples of Use
-

### Microservices Used
None

---

# Name of file/service
refreshCheck_ms.php

## Description
Checks if enough time has passed since the last update of a course to allow a new Git repository fetch, by comparing the current timestamp with the last stored update time.
Cooldown time is based on user permissions. Short deadline (300 seconds) is used for superusers, and long deadline (600 seconds) is used for other users.

## Input Parameters
- Parameter: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $user
   - Type: int
   - Description: Whether a user is a superuser or not. 1 = superuser, 0 = regular user. Stored as tinyint(1) in the database

## Calling Methods
- Function call

## Output Data and Format
- Output: boolean
   - Type: boolean
   - Description: True if a user is a superuser, false if a user is not a superuser. Prints "Too soon since last update, please wait." if the cooldown time has not passed

## Examples of Use
-

### Microservices Used
- newUpdateTime_ms.php

---

# Name of file/service
refreshGithubRepo_ms.php

## Description
Refreshes the metadata from a GitHub repository for a course when there's a new commit, updates the local SQLite database and downloads the latest files if necessary.

## Input Parameters
- Parameter: $action
   - Type: String
   - Description: Specifies the action taken. Used here to trigger the refresh 

- Parameter: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $user
   - Type: int
   - Description: Whether a user is a superuser or not. 1 = superuser, 0 = regular user. Stored as tinyint(1) in the database

## Calling Methods
- POST

## Output Data and Format
- Output: (String message)
   - Type: String
   - Description: Messages that display the outcome of the refresh

## Examples of Use
`CODE`

### Microservices Used
- gitfetchService.php
- refreshCheck_ms.php
- clearGitFiles_ms.php

---

