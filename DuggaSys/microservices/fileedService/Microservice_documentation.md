## Microservices created from the monolith fileedservice.php
These microservices are used on the file editor page

### deleteFileLink_ms.php
Purpose: Deleting records from the table fileLink and deleting files.
Output: Echoes JSON-encoded array returned from retrieveFileedService.php 

### updateFileLink_ms.php
Purpose: Writing to files and updating their filesize in the table fileLink.
Output: Echoes JSON-encoded array returned from retrieveFileedService.php 

### retrieveFileedService.php
Purpose: Retrieving data relevant to the service and storing it in an associative array for testing purposes.
Output: Returns an associative array.