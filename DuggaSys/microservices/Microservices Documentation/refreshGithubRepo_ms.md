# Name of file/service
refreshGithubRepo_ms

## Description
Updates the metadata and files from a GitHub repository if there's been a new commit. This service checks if a repository can be refreshed, compares the current commit with the latest one, and downloads updated files if necessary.

## Input Parameters
- Parameter: action
   - Type: String
   - Description: Action to perform, must be 'refreshGithubRepo' to trigger the refresh
   
- Parameter: cid
   - Type: int
   - Description: Course ID for which to refresh the repository
   
- Parameter: user
   - Type: int
   - Description: User access level (1 for superuser, other for regular users)

## Calling Methods
- POST

## Output Data and Format
- Output: Status message
   - Type: String
   - Description: One of the following messages:
     - "No repo" if no repository is found for the course
     - "The course has been updated, files have been downloaded!" if new commits are found and files are updated
     - "The course is already up to date!" if the repository is current
     - "Too soon since last update, please wait." if the refresh is blocked by cooldown

## Examples of Use
```php
// Via POST request
// POST parameters: action='refreshGithubRepo', cid, user
```

### Microservices Used
- clearGitFiles_ms - Clears old file records before updating
- refreshCheck_ms - Checks if the repository can be refreshed based on cooldown periods
- bfs function (from gitfetchService.php) - Fetches commit information and downloads files

--- 