# resultedService Documentation
This is the documentation for the microservices getUserAnswer_ms.php and retrieveResultedService_ms.php. 

### getUserAnswer_ms.php
The getUserAnswer microservice handles the process of fetching user answers and data regarding duggor. First user permissions are checked. Next data regarding duggas are fetched from the database as well as duggaFilterOptions. The fetched data is then processed and filtered using the duggaFilterOptions with nested foreach loops. The filtered data is then structured as an array by calling the function retrieveResultedService_ms.php which is then returned at the end. 

### retrieveResultedService_ms.php
The retireveResultedService microservice structures an array by accepting the two parameters $tableInfo and $duggaFilterOptions, which contain the data fetched from the database in getUserAnswer_ms.php. The array is then returned to the calling service getuserAnswer_ms.php. 