# Name of file/service
bfs_ms.php
## Description
Traverses a GitHub repository using a breadth-first search (BFS) approach to retrieve metadata or download files. The operation varies depending on the $opt parameter. It supports refreshing metadata, downloading files, or fetching the latest commit hash from a repository. Utilizes GitHub API and optionally a personal access token for extended API access.

## Input Parameters
- Parameter: $url
   - Type: string
   - Description: Url to github commit.

- Parameter: $cid
   - Type: int
   - Description: Course ID.
   
- Parameter: $opt
   - Type: string
   - Description: Options for different operations, can be: GETCOMMIT, REFRESH, DOWNLOAD

## Calling Methods
- POST
## Output Data and Format
- Output
   - Type: JSON
   - Description: If option is GETCOMMIT the script returns a the commits SHA, otherwise no return unless an error occurs in which case an error message is echoed.

## Examples of Use

```php
$latestCommit = bfs($url, $cid, "GETCOMMIT");
```
### Microservices Used
-

# Name of file/service