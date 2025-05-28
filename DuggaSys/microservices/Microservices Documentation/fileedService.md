# Name of file/service
deleteFileLink_ms

## Description
This microservice detects files in a course that are not in use and deletes them based on that fact.
Can only be performed for/by users with permission.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Output: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $kind
   - Type: int(10)
   - Description: Kind/type of section. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $userid
   - Type: int
   - Description: ID of the user. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: string
   - Description: For logging purposes

- Parameter: $filename
   - Type: string
   - Description: Name of the file. Stored as varchar(128) in the database

- Parameter: $fid
   - Type: int
   - Description: ID of the file. Stored as int(11) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: $retrieveArray
   - Type: JSON o
   - Description: The JSON encoded response following the delete operation based on its success and/or any error messages that follows

## Examples of Use
- 

### Microservices Used
- sharedMicroservices/getUid_ms.php
- retrieveFileedService_ms.php ---> Inlcude has been replaced with curlService call

---

# Name of file/service
getFileedService_ms

## Description
This microservice retrieves all filelinks.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Output: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $userid
   - Type: int
   - Description: ID of the user. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: string
   - Description: For logging purposes.

- Parameter: $fid
   - Type: int
   - Description: ID of the file. Stored as int(11) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: retrieveArray
   - Type: JSON object
   - Description: The microservice will create and return an array containing $courseid, $coursevers, $fid, $opt, $log_uuid and $kind    

## Examples of Use
-

### Microservices Used
- sharedMicroservices/getUid_ms.php
- retrieveFileedService_ms.php ---> Inlcude has been replaced with curlService call
- curlService.php

---

# Name of file/service
retrieveFileedService_ms

## Description
This microservice retrieves information for all filelinks as an array. 

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Output: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $userid
   - Type: int
   - Description: ID of the user. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes

- Parameter: $fid
   - Type: int
   - Description: ID of the file. Stored as int(11) in the database

- Parameter: $kind
   - Type: int
   - Description: Kind/type of section. Stored as int(11) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: $retrieveArray
   - Type: JSON object
   - Description: The microservice will create and return an array containing $courseid, $coursevers, $fid, $opt, $log_uuid and $kind 

## Examples of Use
-

### Microservices Used
- sharedMicroservices/getUid_ms.php

---

# Name of file/service
updateFileLink_ms

## Description
Microservice that writes to files and updates their filesize in fileLink

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Output: $cid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $userid
   - Type: int
   - Description: ID of the user. Stored as int(10) in the database

- Parameter: $log_uuid
   - Type: string
   - Description: For logging purposes

- Parameter: $kind
   - Type: int
   - Description: Kind/type of section. Stored as int(11) in the database

- Parameter: $contents
   - Type: Presumably varchar
   - Description: Most likely the contents of the file

- Parameter: $filename
   - Type: string
   - Description: Name of the file. Stored as varchar(128) in the database

## Calling Methods
- GET

## Output Data and Format
- Output: $retrieveArray
   - Type: JSON object
   - Description: The JSON‐encoded response returned by retrieveFileedService, reflects the outcome of the save operation—indicating success or failure, any informational or error messages, and the updated file-link metadata.


## Examples of Use
- 

### Microservices Used
- sharedMicroservices/getUid_ms.php
- retrieveFileedService_ms.php ---> Inlcude has been replaced with curlService call
- curlService.php
