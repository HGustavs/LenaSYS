Example of template for the documentation:

# Name of file/service
example_ms (replace this line with the name of the microservice)

## Description
*Description of what the service do and its function in the system.*

## Input Parameters
*Parameters will be described in lists. "Type" is either String or int, but add the specific type in "Description". The specific types can be found in the tables in the database (http://localhost/phpmyadmin/). Switch out varchar/int in the example below, with the correct type.*
- Parameter: paramName
   - Type: String
   - Description: Describe parameter. Stored as *varchar(256)* in the database

- Parameter: paramName
   - Type: int
   - Description: Describe parameter. Stored as *int(11)* in the database

## Calling Methods
- GET
- POST
- etc.

## Output Data and Format
*Output Data will be described in lists. "Type" is either String or int, but add the specific type in "Description". The specific types can be found in the tables in the database (http://localhost/phpmyadmin/). Switch out varchar/tinyint in the example below, with the correct type.*
- Output: outputName
   - Type: int
   - Description: Describe the output. Stored as *tinyint(2)* in the database

- Output: outputName
   - Type: String
   - Description: Describe the output. Stored as *varchar(30)* in the database

## Examples of Use
`CODE`

### Microservices Used
- *Includes and microservices used*

---

*Add the dashes above between each documentation.*