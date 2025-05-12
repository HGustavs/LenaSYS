# removeListEntries_ms

## Purpose
Marks list entries (duggas, headers, tests, etc.) as deleted (hidden) by updating their visibility status to '3'.

## Endpoint
removeListEntries_ms.php

## HTTP Method
POST

## Required Parameters
- Parameter: lid
  - Type: int
  - Description: List entry ID to be marked as deleted/hidden

- Parameter: courseid
  - Type: int
  - Description: Course ID for which the list entry belongs

- Parameter: coursevers
  - Type: int
  - Description: Course version for which the list entry belongs

## Optional Parameters
- Parameter: opt
  - Type: String
  - Description: Operation type identifier, used by the retrieveSectionedService function
  
- Parameter: log_uuid
  - Type: String
  - Description: Unique identifier for logging purposes

## Return Values
Returns a JSON object containing:
- entries: Array - Course content and list entries
- debug: String - Debug information if errors occurred
- writeaccess: Boolean - Whether the user has write access
- studentteacher: Boolean - Whether the user is a student teacher
- readaccess: Boolean - Whether the user has read access
- coursename: String - Name of the course
- coursevers: String - Course version
- coursecode: String - Course code

## Database Tables & Side Effects
- listentries: UPDATE - Sets the 'visible' field to '3' for the specified list entry (lid)

## Failure Cases
- Authentication failure: User is not logged in or isn't a superuser
- Database error: Foreign key constraint or other database errors

## Example Call
```
curl -X POST "http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/removeListEntries_ms.php" \
  -d "lid=12345&courseid=1&coursevers=45678"
```

### Example Response
```json
{
  "entries": [
    {
      "entryname": "Example Entry",
      "lid": 12345,
      "visible": 3,
      "kind": 1,
      "moment": 0,
      "gradesys": 1
    },
    ...
  ],
  "debug": "NONE!",
  "writeaccess": true,
  "studentteacher": false,
  "readaccess": true,
  "coursename": "Course Name",
  "coursevers": "45678",
  "coursecode": "TEST123"
}
```

## Author & Last Modified
No author information available in source file 