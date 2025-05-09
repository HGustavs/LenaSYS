# Name of file/service
getCourseID_ms

## Description
Retrieves the course ID associated with a given GitHub URL from the MySQL database. If a match is found, it then calls the insertIntoSQLite_ms microservice to store the repository information in the SQLite database.

## Input Parameters
- Parameter: githubURL
   - Type: String
   - Description: The GitHub repository URL associated with a course

## Calling Methods
- Function call from other microservices

## Output Data and Format
- Output: cid
   - Type: int
   - Description: The course ID associated with the GitHub URL (not directly returned but used for SQLite insertion)
   
- Output: Status message
   - Type: String
   - Description: Outputs "No matches in database!" if no course is found for the provided GitHub URL

## Examples of Use
```php
getCourseID("https://github.com/username/repository");
```

### Microservices Used
- insertIntoSQLite_ms (called via cURL to insert the course data into SQLite)

--- 