# filedServices Documentation

# Name of file/service
deleteFileLink_ms

## Description
This microservice detects files that are not in use and deletes them based on that fact.

## Input Parameters
*Parameters will be described in lists*
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Output: $cid
   - Type: int
   - Description: Course ID

- Parameter: $kind
   - Type: int(10)
   - Description: Kind/type of section.

- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $userid
   - Type: int(10)
   - Description: ID of the user.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

- Parameter: $filename
   - Type: varchar
   - Description: Name of the file.

- Parameter: $fid
   - Type: int
   - Description: ID of the file.

## Calling Methods
- GET


## Output Data and Format
*Output Data will be described in lists*
- Output: JSON response
   - Type: JSON object
   - Description: The json encoded response following the delete operation based on its success and/or any error messages that follows


## Examples of Use
- 

### Microservices Used
- sharedMicroservices/getUid_ms.php
- retrieveFileedService_ms.php
- DuggaSys/microservices/curlService.php
