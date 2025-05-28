# Name of file/service
createNewCodeExample_ms.php
 
## Description
Creates a new code example in the 'codeexample' table and logs the event of creating a new code example. 
It retrieves the user ID and username, inserts a new entry into the table, generates a link for the new entry, and logs the event. Then returns the link to the newly created code example as the output.

## Input Parameters
- Parameter: $pdo
   - Type: Database object
   - Description: Database connection 

- Parameter: $exampleid
   - Type: int
   - Description: Example ID (optional), used to name the example section incrementally. Stored as mediumint(8) in the database

- Parameter: $courseid
   - Type: int
   - Description: Course ID that the example belongs to. Stored as int(10) in the database

- Parameter: $coursevers
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $sectname
   - Type: string
   - Description: Name of section that the code example will belong to. Stored as varchar(64) in the database

- Parameter: $link
   - Type: string
   - Description: Reference link, updated later with the new example ID. Used to store the ID of the new code example. Stored as varchar(256) in the database

- Parameter: $log_uuid
   - Type: string
   - Description: Logs the event

- Parameter: $templateNumber
   - Type: int
   - Description: Template number/ID for the code example, defaults to 0. Stored as int(10) in the database

## Calling Methods
-

## Output Data and Format
- Output: $debug	
   - Type: string
   - Description: Displays either “Error updating entries” or “NONE!”

- Output: $link
   - Type: string
   - Description: Displays the ID of the newly inserted code example in the database

## Examples of Use
`INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion,templateid) values (:cid,:ename,:sname,1,:cversion, :templateid)`

### Microservices Used
- getUID_ms.php
- retrieveUsername_ms.php

---

# Name of file/service
createNewListEntry_ms.php

## Description
Inserts a new entry into the 'listentries' table in the database, fetches the username of the user who created the entry of the current user and logs the event. Actions and events logged in the system need to be associated with a user.

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $cid
   - Type: int
   - Description: Course ID to which the list entry belongs to. Stored as int(10) in the database

- Parameter: $coursesvers
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $userid
   - Type: int
   - Description: User ID of who created the entry. Stored as int(10) in the database

- Parameter: $entryname
   - Type: string
   - Description: Name of the entry. Stored as varchar(64) in the database

- Parameter: $link
   - Type: string
   - Description: URL associated with the list entry. Stored as varchar(200) in the database

- Parameter: $kind
   - Type: int
   - Description: Type/kind of list entry. Stored as int(10) in the database

- Parameter: $comment
   - Type: string
   - Description: Comment about list entry. Stored as varchar(512) in the database

- Parameter: $visible
   - Type: int
   - Description: Visibility. Stored as tinyint(1) in the database

- Parameter: $highscoremode
   - Type: int
   - Description: Highscore mode. Stored as int(1) in the database

- Parameter: $pos
   - Type: int
   - Description: Position, moves one increment up each time an entry is created to make space for new entries. Stored as int(11) in the database

- Parameter: $gradesys
   - Type: int
   - Description: Grading system. Used for entries with kind 4. Stored as tinyint(1) in the database

- Parameter: $tabs
   - Type: int
   - Description: Tabs setting. Used for all entry-types, except for kind 4. Stored as tinyint(4) in the database

- Parameter: $grptype
   - Type: string
   - Description: Group kind/type for the entry. If it is UNK/grptype is not used, username of the user who created the entry is logged instead. Stored as varchar(4) in the database

## Calling Methods
-

## Output Data and Format
- Output: $debug
   - Type: string
   - Description: Displays message if entries could not be updated

## Examples of Use
`INSERT INTO listentries (cid, vers, entryname, link, kind, pos, (...)) VALUES(:cid, :cvs, :entryname, :link, :kind, :pos, (...))`

### Microservices Used
retrieveUsername_ms.php

---

# Name of file/service
getUid_ms.php

## Description
Retrieves the user's UID (user ID) from the session. If a user is not logged in, guest ID is returned instead.
Also logs events into serviceLogEntries-table.

## Input Parameters

- Parameter: $opt
   - Type: string
   - Description: Operation type

- Parameter: $courseId
   - Type: int
   - Description: Course ID. Stored as int(10) in the database

- Parameter: $courseVersion
   - Type: string
   - Description: Course version. Stored as varchar(8) in the database

- Parameter: $exampleName
   - Type: string
   - Description: Name of the accessed example. Stored as varchar(64) in the database

- Parameter: $sectionName
   - Type: string
   - Description: Name of the section within the course. Stored as varchar(64) in the database

- Parameter: $exampleId
   - Type: int
   - Description: Unique ID for the example. Stored as mediumint(8) in the database

- Parameter: $log_uuid
   - Type: string
   - Description: Unique identifier for logging the event

- Parameter: $log_timestamp
   - Type: string
   - Description: Timestamp for when the log event occured

## Calling Methods
- POST

## Output Data and Format
- Output: $userId
   - Type: int
   - Description: Returns the user's ID from the session, or guest ID if not logged in. Stored as int(10) in the database

## Examples of Use
-

### Microservices Used
None

---

# Name of file/service
isSuperUser_ms.php

## Description
Checks if a user is a superuser. Used to control access permission.

## Input Parameters

- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $userId
   - Type: int
   - Description: The user ID, to check if it is a superuser. Stored as int(10) in the database

## Calling Methods
-

## Output Data and Format
- Output: -
   - Type: boolean
   - Description: True if the user is a superuser, false if not

## Examples of Use
`SELECT count(uid) AS count FROM user WHERE uid=:1 AND superuser=1`

### Microservices Used
None

---

# Name of file/service
logUserEvent_ms.php

## Description
Creates a new user-event entry and adds it to the database 'log_db'. Helps maintain records of user action, for logging purposes.

## Input Parameters
- Parameter: $uid
   - Type: int
   - Description: Unique user ID of the user who triggered an event. Stored as int(10) in the database

- Parameter: $username
   - Type: string
   - Description: Username associated with the uid (user ID). Stored as varchar(80) in the database

- Parameter: $eventType
   - Type: int
   - Description: The type of event triggered by the user

- Parameter: $description
   - Type: string
   - Description: Text explaining the event

- Parameter: $userAgent
   - Type: string
   - Description: Not an input parameter. The device and browser used by the user, retrieved automatically.

- Parameter: $remoteAddress
   - Type: string
   - Description: Not an input parameter. The IP address of the user's device, retrieved automatically.

## Calling Methods
-

## Output Data and Format
None

## Examples of Use
`INSERT INTO userLogEntries (uid, username, eventType, description, userAgent, remoteAddress) VALUES (:uid, :username, :eventType, :description, :userAgent, :remoteAddress)`

### Microservices Used
None

---

# Name of file/service
retrieveUsername_ms.php

## Description
Retrieves the username of a specific user ID. Username is only fetched if a user is logged in.

## Input Parameters
- Parameter: $pdo
   - Type: PDO
   - Description: Database connection

- Parameter: $userid
   - Type: int
   - Description: Username associated with the uid (user ID). Stored as int(10) in the database

## Calling Methods
-

## Output Data and Format
- Output: $username
   - Type: string
   - Description: Username. Stored as varchar(80) in the database

## Examples of Use
`SELECT username FROM user WHERE uid = :uid`

### Microservices Used
- getUid_ms.php

---

# Name of file/service
setAsActiveCourse_ms.php

## Description
Used to set a specific version of a course as the active version, by updating the 'course' table. 

## Input Parameters
- Parameter: $cid
   - Type: int
   - Description: Unique course ID, to specify which course should be set as active. Stored as int(10) in the database

- Parameter: $versid
   - Type: string
   - Description: The version ID that should be set as the active course version. Stored as varchar(8) in the database

## Calling Methods
- POST

## Output Data and Format
None. Only notifies if the update is successful or not.

## Examples of Use
`UPDATE course SET activeversion=:vers WHERE cid=:cid`

### Microservices Used
None

---

# Name of file/service
updateSecurityQuestion_ms.php

## Description
Handles password changes, as well as challenge questions and answers. Only permitted if the current password is entered correctly.
Changes of security questions are not permitted for superusers or teachers.

## Input Parameters
- Parameter: $password
   - Type: string
   - Description: The current password of the user. Used for verification purposes. Stored as varchar(225) in the database

- Parameter: $question
   - Type: string
   - Description: The new security challenge question to be set. Stored as varchar(256) in the database

- Parameter: $answer
   - Type: string
   - Description: The answer to the new security challenge question. Stored in hashed form. Stored as varchar(256) in the database

- Parameter: $action
   - Type: ?
   - Description: Which type of action to be performed. In this case, it is "challenge"

- Parameter: $log_uuid
   - Type: string
   - Description: Unique identifier, used to log the event

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
   - Type: string
   - Description: Contains error message if something went wrong.

## Examples of Use
`UPDATE user SET securityquestion=:SQ, securityquestionanswer=:answer WHERE uid=:userid`

### Microservices Used
- getUid_ms.php

---

# Name of file/service
updateUserPassword_ms.php

## Description
Handles changes to passwords for users who are logged in. Password is changed by verifying the current password. If it is entered correctly, the user is allowed to change the password, which is then updated in the 'user' table.
Teachers and superusers are not allowed to change passwords.

## Input Parameters
- Parameter: $password
   - Type: string
   - Description: The user's current password, entered to verify the user. Stored as varchar(225) in the database

- Parameter: $action
   - Type: ?
   - Description: Specifies the action. Here it is "password", for changing the password

- Parameter: $newPassword
   - Type: int
   - Description: The new password the user wants to change to. Stored as tinyint(1) in the database

- Parameter: $log_uuid
   - Type: string
   - Description: Unique identifier, used to log the event

## Calling Methods
- POST

## Output Data and Format
- Output: $success
   - Type: boolean
   - Description: Informs whether the operation was successful or not

- Output: $status
   - Type: string
   - Description: Describes to result status. Either "teacher", "wrong password" or empty

- Output: $debug
   - Type: string
   - Description: Displays error message is something went wrong

## Examples of Use
`UPDATE user SET password=:PW WHERE uid=:userid`

### Microservices Used
- getUid_ms.php
