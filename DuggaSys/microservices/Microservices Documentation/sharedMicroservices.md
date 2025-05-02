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

# createNewCodeExample_ms.php

## Description
Creates a new code example in the ‘codeexample’ table and logs the event of creating a new code example. 
It retrieves the user ID and username, inserts a new entry into the table, generates a link for the new entry, and logs the event. Then returns the link to the newly created code example as the output.

## Input Parameters
- Parameter: $pdo
   - Type: Database object
   - Description: Database connection 

- Parameter: $exampleid
   - Type: mediumint
   - Description: Example ID (optional), used to name the example section incrementally

- Parameter: $courseid
   - Type: int
   - Description: Course ID that the example belongs to

- Parameter: $coursevers
   - Type: int
   - Description: Course version

- Parameter: $sectname
   - Type: varchar
   - Description: Name of section that the code example will belong to

- Parameter: $link
   - Type: varchar
   - Description: Reference link, updated later with the new example ID. Used to store the ID of the new code example

- Parameter: $log_uuid
   - Type: int
   - Description: Logs the event

- Parameter: $templateNumber
   - Type: int
   - Description: Template number/ID for the code example, defaults to 0

## Calling Methods
- 

## Output Data and Format
- Output: debug	
   - Type: String
   - Description: Displays either “Error updating entries” or “NONE!”

- Output: link
   - Type: String
   - Description: Displays the ID of the newly inserted code example in the database

# getUid_ms.php

## Description
Retrieves the user's UID (user ID) from the session. If a user is not logged in, guest ID is returned instead.
Also logs events into serviceLogEntries-table.

## Input Parameters

- Parameter: $opt
   - Type: ?
   - Description: Operation type

- Parameter: $courseId
   - Type: int
   - Description: Course ID

- Parameter: $courseVersion
   - Type: varchar
   - Description: Course version

- Parameter: $exampleName
   - Type: varchar
   - Description: Name of the accessed example

- Parameter: $sectionName
   - Type: varchar
   - Description: Name of the section within the course

- Parameter: $exampleId
   - Type: int
   - Description: Unique ID for the example

- Parameter: $log_uuid
   - Type: char
   - Description: Unique identifier for logging the event

- Parameter: $log_timestamp
   - Type: int
   - Description: Timestamp for when the log event occured

## Calling Methods
- POST (from getOP-function in basic.php)

## Output Data and Format
- Output: userId
   - Type: int
   - Description: Returns the user's ID from the session, or guest ID if not logged in


## Examples of Use
-

### Microservices Used
getUID_ms.php
retrieveUsername_ms.php

# createNewListEntry_ms.php

## Description
Inserts a new entry into the ‘listentries’ table in the database, fetches the username of the user who created the entry of the current user and logs the event. Actions and events logged in the system need to be associated with a user.

## Input Parameters
sessions.php
basic.php


# isSuperUser_ms.php

## Description
Checks if a user is a superuser. Used to control access permission.

## Input Parameters

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $userid
   - Type: int
   - Description: Username associated with the uid (user ID)

- Parameter: $cid
   - Type: int
   - Description: Course ID to which the list entry belongs to

- Parameter: $coursesvers
   - Type: varchar
   - Description: Course version

- Parameter: $userid
   - Type: int
   - Description: User ID of who created the entry

- Parameter: $entryname
   - Type: varchar
   - Description: Name of the entry

- Parameter: $link
   - Type: varchar
   - Description: URL associated with the list entry (?)

- Parameter: $kind
   - Type: int
   - Description: Type/kind of list entry

- Parameter: $comment
   - Type: varchar
   - Description: Comment about list entry

- Parameter: $visible
   - Type: tinyint
   - Description: Visibility

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode

- Parameter: $pos
   - Type: int
   - Description: Position, moves one increment up each time an entry is created to make space for new entries

- Parameter: $gradesys
   - Type: int
   - Description: Grading system. Used for entries with kind 4.

- Parameter: $tabs
   - Type: tinyint
   - Description: Tabs setting. Used for all entry-types, except for kind 4.

- Parameter: $grptype
   - Type: varchar
   - Description: Group kind/type for the entry. If it is UNK/grptype is not used, username of the user who created the entry is logged instead.

- Parameter: $userId
   - Type: int
   - Description: The user ID, to check if it is a superuser

## Calling Methods
-

## Output Data and Format
- Output: $username
   - Type: varchar
- Output: $debug
   - Type: String
   - Description: 
- Output: -
   - Type: boolean
   - Description: True if the user is a superuser, false if not

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
retrieveUsername_ms.php
None

# retrieveUsername_ms.php

## Description
Retrieves the username of a specific user ID. Username is only fetched if a user is logged in.

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
   - Description: Specifies the action. Here it is "password", for changing the password.

- Parameter: $newPassword
   - Type: tinyint
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
getUid_ms.php
