# Name of file/service
retrieveGitCommitService_ms

## Description
Retrieves Git commit history for the current repository using the shell_exec function. This service returns a formatted list of commit hashes and commit messages, providing version history information.

## Input Parameters
- None

## Calling Methods
- Direct function call (self-executing)

## Output Data and Format
- Output: Commit history
   - Type: String
   - Description: A formatted string containing commit hashes and messages in the format "%H - %s" (hash - subject)
   
- Output: Error messages
   - Type: String
   - Description: One of the following messages if execution fails:
     - "Error: shell_exec function is disabled. Retrieving Git commits requires server-side execution capabilities."
     - "Error: Failed to execute Git command."

## Examples of Use
```php
// Simply include or require the file to execute
require_once 'retrieveGitCommitService_ms.php';
```

### Microservices Used
- None (uses Git CLI commands via shell_exec)

--- 