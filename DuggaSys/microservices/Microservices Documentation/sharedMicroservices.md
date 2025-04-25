# sharedMicroservices Documentation

# createNewCodeExample_ms

## Description
This function is used to create new code examples to be used in courses. It inserts a new row into the codeexample table and logs the event.

## Input Parameters

- Parameter: $exampleid
   - Type: mediumint(8)
   - Description: Unique ID of the example

- Parameter: $courseid
   - Type: int(10)
   - Description: ID of the course to which the code example belongs

- Parameter: $coursevers
   - Type: int(11)
   - Description: Course version

- Parameter: $sectname
   - Type: varchar(64)
   - Description: Name of the section where the example will appear

- Parameter: $link
   - Type: varchar(256)
   - Description: Unused input; will be overwritten with the inserted example ID

- Parameter: $log_uuid
   - Type: int(10)
   - Description: UUID for logging purposes

- Parameter: $templateNumber
   - Type: int(10)
   - Description: Hard coded to 0

## Calling Methods

- POST

## Output Data and Format

- Output: debug 
   - Type: string
   - Description: Debug information. If there's an SQL error, the error message is returned; otherwise "NONE!".

- Output: link
   - Type: int
   - Description: The ID (exampleid) of the newly created example, returned from '$pdo->lastInsertId()'.

## Examples of Use
'createNewCodeExample($pdo, $exampleid, $courseid, $coursevers, $sectname, $link, $log_uuid, $templateNumber=0)'

### Microservices Used
- getUid_ms
- retrieveUsername_ms
