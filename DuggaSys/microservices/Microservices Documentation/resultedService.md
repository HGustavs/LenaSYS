# Name of file/service
getUserAnswer_ms.php

## Description
Retrieves submission data for a given course and version and fills it with data from listentries, it is then forwarded to retrieveResultedService för final formatting

## Input Parameters
- Parameter: $opt
   - Type: String
   - Description: Operation type

- Parameter: $courseid
   - Type: int
   - Description: Course ID. Stored as int(10) in the database
   
- Parameter: $coursevers
   - Type: int
   - Description: Course version. Stored as int(11) in the database


## Calling Methods
- GET

## Output Data and Format
- Output: $JSON response
   - Type: JSON-string
   - Description: Sends this array $tableSubmissionInfo with the following parameters
        	'duggaName' => $duggaName,
        	'hash' => $row['hash'],
        	'password' => $row['password'],
        	'teacher_visited' => $row['last_Time_techer_visited'],
        	'submitted' => $row['submitted'],
			'timesSubmitted' => $row['timesSubmitted'],
			'timesAccessed' => $row['timesAccessed'],
			'subCourse' => $subCourse,
			'link' => "UNK"
        also sends the array duggaFilteringOptions containing the parameters: entryname, kind, lid, moment.
    	


## Examples of Use
-

### Microservices Used
- sharedMicroservices/getUid_ms
- retrieveResultedService_ms -------> Via POST


---