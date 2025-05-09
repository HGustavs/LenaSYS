# Name of file/service
newUpdateTime_ms

## Description
Updates the MySQL database with the latest update timestamp for a course. This service is used to track when course repositories were last refreshed from GitHub.

## Input Parameters
- Parameter: pdo
   - Type: Object
   - Description: PDO database connection object for the MySQL database
   
- Parameter: currentTime
   - Type: int
   - Description: Current time as a UNIX timestamp, which will be converted to a datetime format
   
- Parameter: cid
   - Type: int
   - Description: Course ID for which to update the timestamp

## Calling Methods
- Function call from other microservices

## Output Data and Format
- Output: None (void function)
   - Type: None
   - Description: The function performs a database update operation without returning data

## Examples of Use
```php
newUpdateTime($pdo, time(), $cid);
```

### Microservices Used
- None (this is a base service used by others)

--- 