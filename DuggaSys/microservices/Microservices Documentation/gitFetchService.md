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
downloadToWebServer_ms.php
## Description
Downloads a file from a given GitHub `download_url` and stores it in the appropriate directory under the course folder on the web server. Logs errors if file retrieval or writing fails.
## Input Parameters
- Parameter: $cid
  - Type: int
  - Description: Course ID used to determine the local directory path.
- Parameter: $item
  - Type: array
  - Description: Associative array containing file metadata. Expected keys: `name`, `path`, and `download_url`.
## Calling Methods
-function call
## Output Data and Format
No output unless error, in which case error message is logged.
## Examples of Use
```php
downloadToWebserver($cid, $item);
```
### Microservices Used
-

# Name of file/service
getGithubUrl_ms.php
## Description
Takes a normal repository github url and makes it into a url to the API of that repository.
## Input Parameters
- Parameter: $url
   - Type: string
   - Description: Url to github repository.

## Calling Methods
-function call
## Output Data and Format
- Output
   - Type: string
   - Description: The translated url now pointing to the api of the repository located at the given url.
## Examples of Use

```php
$url = getGitHubURLCommit($url);
$url = getGitHubURL($url);
```

### Microservices Used
-

# Name of file/service
getIndexFile_ms.php
## Description
Fetches and returns the contents of an index.txt file from a given GitHub repository API URL.
## Input Parameters
- Parameter: $url
   - Type: string
   - Description: Url to github repository API.
## Calling Methods
-function call
## Output Data and Format
- Output
   - Type: string array on success, false on failure
   - Description: returns the contents of the file as a string array with each entry in the array being a line in the file.
## Examples of Use
```php
$filesToIgnore = getIndexFile($url);
```
### Microservices Used
-

# Name of file/service
insertToFileLInk_ms.php
## Description
Inserts a file record into the `fileLink` database table if it doesn't already exist for the specified course. Used to register course-local files with associated metadata like name, path, and size.
## Input Parameters
- Parameter: $cid
  - Type: int
  - Description: Course ID to associate the file with.
- Parameter: $item
  - Type: array
  - Description: Associative array containing file metadata with keys name, path, and size.
## Calling Methods
-function call
## Output Data and Format
-
## Examples of Use
```php
insertToFileLink($cid, $item);
```
### Microservices Used
-

# Name of file/service
insertToMetadata_ms.php
## Description
Inserts file metadata into the `gitFiles` table of the `metadata2.db` SQLite database. Stores information such as file name, type, path, and GitHub URLs.
## Input Parameters
## Input Parameters
- Parameter: $cid
  - Type: int
  - Description: Course ID to associate the file metadata with.
- Parameter: $item
  - Type: array
  - Description: Associative array containing file metadata. Expected keys: `name`, `type`, `url`, `download_url`, `sha`, `path`.
## Calling Methods
-function call
## Output Data and Format
-
## Examples of Use
```php
insertToMetaData($cid, $item);
```
### Microservices Used
-