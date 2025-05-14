# Name of file/service
deleteFileLink_ms

## Description
This microservice detects files that are not in use and deletes them based on that fact.

## Input Parameters
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
- Output: JSON response
   - Type: JSON object
   - Description: The json encoded response following the delete operation based on its success and/or any error messages that follows


## Examples of Use
- 

### Microservices Used
- sharedMicroservices/getUid_ms.php
- retrieveFileedService_ms.php ---> Inlcude has been replaced with curlService call
- DuggaSys/microservices/curlService.php

---

# Name of file/service
getFiledService_ms

## Description
This microservice gets all filelinks.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Output: $cid
   - Type: int
   - Description: Course ID

- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $userid
   - Type: int(10)
   - Description: ID of the user.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

- Parameter: $fid
   - Type: int
   - Description: ID of the file.

## Calling Methods
- GET


## Output Data and Format
- Output: retrieveArray
   - Type: JSON object
   - Description: The microservice will create and return an array with the following fields     
        - "courseid=" . urlencode($courseid)
        - "&coursevers=" . urlencode($coursevers) 
        - "&fid=" . urlencode($fid) 
        - "&opt=" . urlencode($opt)
        - "&log_uuid=" . urlencode($log_uuid) 
        - "&kind=" . urlencode($kind)


## Examples of Use
- 

### Microservices Used
- sharedMicroservices/getUid_ms.php
- retrieveFileedService_ms.php ---> Inlcude has been replaced with curlService call
- DuggaSys/microservices/curlService.php

---

# Name of file/service
retrieveFileedService_ms

## Description
This microservice gets information for all filelinks.

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Output: $cid
   - Type: int
   - Description: Course ID

- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $userid
   - Type: int(10)
   - Description: ID of the user.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

- Parameter: $fid
   - Type: int
   - Description: ID of the file.

- Parameter: $kind
   - Type: int(10)
   - Description: Kind/type of section.

## Calling Methods
- GET


## Output Data and Format
- Output: retrieveArray
   - Type: JSON object
   - Description: The microservice will create and return an array with the following fields     
        - "courseid=" . urlencode($courseid)
        - "&coursevers=" . urlencode($coursevers) 
        - "&fid=" . urlencode($fid) 
        - "&opt=" . urlencode($opt)
        - "&log_uuid=" . urlencode($log_uuid) 
        - "&kind=" . urlencode($kind)


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
   - Description: Course ID

- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version.

- Parameter: $userid
   - Type: int(10)
   - Description: ID of the user.

- Parameter: $log_uuid
   - Type: char
   - Description: For logging purposes.

- Parameter: $kind
   - Type: int(10)
   - Description: Kind/type of section.

- Parameter: $contents
   - Type: Presumably varchar
   - Description: Most likely the contents of the file.

- Parameter: $filename
   - Type: varchar
   - Description: Name of the file.

## Calling Methods
- GET


## Output Data and Format
- Output: retrieveArray
   - Type: JSON object
   - Description: The JSON‐encoded response returned by retrieveFileedService, reflects the outcome of the save operation—indicating success or failure, any informational or error messages, and the updated file-link metadata.


## Examples of Use
- 

### Microservices Used
- sharedMicroservices/getUid_ms.php
- retrieveFileedService_ms.php ---> Inlcude has been replaced with curlService call
- DuggaSys/microservices/curlService.php