# reorderListEntries_ms

## Purpose
Updates the position and moment values of list entries to change their display order in the course.

## Endpoint
reorderListEntries_ms.php

## HTTP Method
POST

## Required Parameters
- Parameter: courseid
  - Type: int
  - Description: Course ID for which the list entries belong
  
- Parameter: coursevers
  - Type: int
  - Description: Course version for which the list entries belong
  
- Parameter: order
  - Type: String
  - Description: Comma-separated list of position, ID, and moment values in the format "pos1XXid1XXmoment1,pos2XXid2XXmoment2,..."

## Optional Parameters
- Parameter: opt
  - Type: String
  - Description: Operation type identifier, must be "REORDER" for the reordering functionality to work
  
- Parameter: pos
  - Type: int
  - Description: Position value (overridden by the order parameter)
  
- Parameter: moment
  - Type: int
  - Description: Moment value (overridden by the order parameter)
  
- Parameter: lid
  - Type: int
  - Description: List entry ID (overridden by the order parameter)
  
- Parameter: log_uuid
  - Type: String
  - Description: Unique identifier for logging purposes

## Return Values
Returns a JSON object containing:
- entries: Array - Updated course content and list entries with new positions
- debug: String - Debug information if errors occurred
- writeaccess: Boolean - Whether the user has write access
- studentteacher: Boolean - Whether the user is a student teacher
- readaccess: Boolean - Whether the user has read access
- coursename: String - Name of the course
- coursevers: String - Course version
- coursecode: String - Course code

## Database Tables & Side Effects
- listentries: UPDATE - Updates the 'pos' and 'moment' fields for multiple list entries based on the provided order string

## Failure Cases
- Database error: Failed to update entries, error message will be in the debug field

## Example Call
```
curl -X POST "http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/reorderListEntries_ms.php" \
  -d "courseid=1&coursevers=45678&opt=REORDER&order=1XX12345XX0,2XX67890XX0"
```

### Example Response
```json
{
  "entries": [
    {
      "entryname": "First Entry",
      "lid": 12345,
      "visible": 1,
      "kind": 1,
      "moment": 0,
      "pos": 1,
      "gradesys": 1
    },
    {
      "entryname": "Second Entry",
      "lid": 67890,
      "visible": 1,
      "kind": 1,
      "moment": 0,
      "pos": 2,
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