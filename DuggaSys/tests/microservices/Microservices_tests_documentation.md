# Documentation of microservice tests

## fileedService

### deleteFileLink_ms_test.php
Inserts a record into fileLink. If the microservice works, the record will not be in the ouput.

### updateFileLink_ms_test.php
A special solution was made. Temporary files are created which the microservice writes to and updates the filesizes of. Problems with creation or deletion of test files is printed. The fileLink records of the test-files are continously deleted after each test and the actual files are deleted after all tests have been performed. Creation of files is done through curl-requests to filereceive.php.

