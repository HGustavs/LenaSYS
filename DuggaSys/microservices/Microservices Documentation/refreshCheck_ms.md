# Name of file/service
refreshCheck_ms

## Description
Checks if a course repository can be refreshed based on cooldown periods. Different cooldown periods are applied for superusers (short cooldown) and regular users (long cooldown). This service prevents too frequent updates of repositories.

## Input Parameters
- Parameter: cid
   - Type: int
   - Description: Course ID to check for refresh eligibility
   
- Parameter: user
   - Type: int
   - Description: User access level (1 for superuser, other for regular users)

## Calling Methods
- Function call from other microservices

## Output Data and Format
- Output: Status
   - Type: boolean
   - Description: Returns true if the repository can be refreshed, false otherwise
   
- Output: Message
   - Type: String
   - Description: If refresh is not possible, outputs "Too soon since last update, please wait."

## Examples of Use
```php
if (refreshCheck($cid, $userLevel)) {
    // Proceed with refresh
}
```

### Microservices Used
- newUpdateTime_ms - Used to update the course's last update timestamp if refresh is allowed

--- 