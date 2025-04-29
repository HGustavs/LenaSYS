# sharedMicroservices Documentation

# setAsActiveCourse_ms.php

## Description
Used to set a specific version of a course as the active version, by updating the 'course' table. 

## Input Parameters
- Parameter: $cid
   - Type: int
   - Description: Unique course ID, to specify which course should be set as active.

- Parameter: $versid
   - Type: varchar
   - Description: The version ID that should be set as the active course version.

## Calling Methods
- POST

## Output Data and Format
None. Only notifies if the update is successful or not.

## Examples of Use
-

### Microservices Used
None


# updateSecurityQuestion_ms.php

## Description
Handles password changes, as well as challenge questions and answers. Only permitted if the current password is entered correctly.
Changes of security questions are not permitted for superusers or teachers.

## Input Parameters
- Parameter: $password
   - Type: varchar
   - Description: The current password of the user. Used for verification purposes.

- Parameter: $question
   - Type: varchar
   - Description: The new security challenge question to be set.

- Parameter: $answer
   - Type: varchar
   - Description: The answer to the new security challenge question. Stored in hashed form.

- Parameter: $action
   - Type: ?
   - Description: Which type of action to be performed. In this case, it is "challenge".

- Parameter: $log_uuid
   - Type: char
   - Description: Unique identifier, used to log the event.

## Calling Methods
- POST

## Output Data and Format
- Output: $success
   - Type: boolean
   - Description: Informs whether the operation was successful.

- Output: $status
   - Type: ?
   - Description: Describes the result. Either "teacher", "wrongpassword" or empty.

- Output: $debug
   - Type: ?
   - Description: Contains error message if something went wrong.

## Examples of Use
-

### Microservices Used
getUid_ms.php