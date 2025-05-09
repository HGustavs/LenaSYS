# Name of file/service
fetchOldToken_ms

## Description
Retrieves the stored GitHub authentication token for a specific course from the SQLite database. This token is used for accessing GitHub repositories that require authentication.

## Input Parameters
- Parameter: pdolite
   - Type: Object
   - Description: PDO database connection object for the SQLite database
   
- Parameter: cid
   - Type: int
   - Description: Course ID for which to retrieve the GitHub token

## Calling Methods
- Function call from other microservices

## Output Data and Format
- Output: old_token
   - Type: String
   - Description: The GitHub authentication token stored for the specified course. Returns null if no token is found or if token length is less than 1 character.

## Examples of Use
```php
$token = fetchOldToken($pdolite, $cid);
```

### Microservices Used
- None (this is a base service used by others)

--- 