# Name of file/service
retrieveProfileService_ms

## Description
This service takes in parameters and packages them nicely as an array.

## Input Parameters
*Parameters will be described in lists*
- Parameter: debug
   - Type: string
   - Description: Debug message 

- Parameter: success
   - Type: bool
   - Description: success parameter

- Parameter: status
   - Type: string
   - Description: status parameter

## Calling Methods
- TBD

## Output Data and Format
- Output: array
   - Type: array
   - Description: returns the input data

## Examples of Use
`$array = retrieveProfileService($debug,$success,$status);`

### Microservices Used
updateSecurityQuestion_ms
updateUserPassword_ms
