# Name of file/service
insertIntoSQLite_ms

## Description
Inserts or updates GitHub repository information in the SQLite database. This service extracts the repository name from the URL, gets the latest commit hash, and stores all data in the gitRepos table. After updating the database, it refreshes the file information.

## Input Parameters
- Parameter: githubURL
   - Type: String
   - Description: The GitHub repository URL to store in the database
   
- Parameter: cid
   - Type: int
   - Description: Course ID associated with the repository
   
- Parameter: token
   - Type: String
   - Description: GitHub authentication token (optional, will fetch old token if not provided)

## Calling Methods
- POST

## Output Data and Format
- Output: lastCommit
   - Type: String
   - Description: The commit hash of the latest commit in the repository
   
- Output: Status messages
   - Type: String
   - Description: Error messages if the database update fails, including SQL error information

## Examples of Use
```php
// Via POST request
// POST parameters: githubURL, cid, token
```

### Microservices Used
- bfs function (from gitfetchService.php) - Used to fetch commit information and refresh repository data
- fetchOldToken (if no token is provided)

--- 