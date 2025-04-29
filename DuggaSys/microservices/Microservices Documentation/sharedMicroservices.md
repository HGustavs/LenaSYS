# sharedMicroservices Documentation

# logUserEvent_ms.php

## Description
Creates a new user-event entry and adds it to the database 'log_db'. Helps maintain records of user action, for logging purposes.

## Input Parameters
- Parameter: uid
   - Type: int
   - Description: Unique user ID of the user who triggered an event

- Parameter: username
   - Type: varchar
   - Description: Username associated with the uid (user ID)

- Parameter: eventType
   - Type: int
   - Description: The type of event triggered by the user

- Parameter: description
   - Type: varchar
   - Description: Text explaining the event

- Parameter: userAgent
   - Type: text
   - Description: Not an input parameter. The device and browser used by the user, retrieved automatically.

- Parameter: remoteAddress
   - Type: varchar
   - Description: Not an input parameter. The IP address of the user's device, retrieved automatically.

## Calling Methods
-

## Output Data and Format
None

## Examples of Use
`CODE`

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