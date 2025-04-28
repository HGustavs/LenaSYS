# sharedMicroservices Documentation

# logUserEvent_ms.php

## Description
Creates a new user-event entry and adds it to the database 'log_db'. Helps maintain records of user action, for logging purposes.

## Input Parameters
- Parameter: $uid
   - Type: int
   - Description: Unique user ID of the user who triggered an event

- Parameter: $username
   - Type: varchar
   - Description: Username associated with the uid (user ID)

- Parameter: $eventType
   - Type: int
   - Description: The type of event triggered by the user

- Parameter: $description
   - Type: varchar
   - Description: Text explaining the event

- Parameter: $userAgent
   - Type: text
   - Description: Not an input parameter. The device and browser used by the user, retrieved automatically.

- Parameter: $remoteAddress
   - Type: varchar
   - Description: Not an input parameter. The IP address of the user's device, retrieved automatically.

## Calling Methods
-

## Output Data and Format
None

## Examples of Use
-

### Microservices Used
None



# retrieveUsername_ms.php

## Description
Retrieves the username of a specific user ID. Username is only fetched if a user is logged in.

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $userid
   - Type: int
   - Description: Username associated with the uid (user ID)

## Calling Methods
-

## Output Data and Format
- Output: $username
   - Type: varchar
   - Description: 

## Examples of Use
-

### Microservices Used
getUid_ms.php


# updateUserPassword_ms.php

## Description
Handles changes to passwords for users who are logged in. Password is changed by verifying the current password. If it is entered correctly, the user is allowed to change the password, which is then updated in the 'user' table.
Teachers and superusers are not allowed to change passwords.

## Input Parameters
- Parameter: $password
   - Type: varchar
   - Description: The user's current password, entered to verify the user

- Parameter: $action
   - Type: ?
   - Description: Specifies the action. Here it is "password", for chaning the password.

- Parameter: $newPassword
   - Type: varchar
   - Description: The new password the user wants to change to

- Parameter: $log_uuid
   - Type: char
   - Description: Unique identifier, used to log the event

## Calling Methods
- POST

## Output Data and Format
- Output: $success
   - Type: boolean
   - Description: Informs whether the operation was successful or not

- Output: $status
   - Type: ?
   - Description: Describes to result status. Either "teacher", "wrong password" or empty

- Output: $debug
   - Type: ?
   - Description: Displays error message is something went wrong

## Examples of Use
-

### Microservices Used
basic.php
sessions.php
getUid_ms.php