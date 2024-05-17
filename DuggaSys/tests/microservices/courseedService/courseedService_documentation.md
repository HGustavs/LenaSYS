NOTE: All tests can be tested by opening files in browser
NOTE: A fresh database install is required for many tests to work.

copyCourseVersion_ms_test.php
The test makes a copy of the "1337" version of the Testing-Course with the new version id of "123" which can be seen in the output.
After the test: The new version is deleted.
Evaluation: Test works as intended.

createCourseVersion_ms_test.php
The test creates a brand new version of the Testing-Course with the version id "12345" which can be seen in the output.
After the test: The new version is deleted.
Evaluation: Test works as intended.

createMOTD_ms_test.php
The test updates the settings table with a new entry, used for showing a message of the day on the main course page. The entry can be seen in the output.
After the test: the MOTD is deleted.
Evaluation: Test works as intended.

createNewCourse_ms_test.php
The test creates a new course with the coursecode "TE001S" which can be seen in the output.
After the test: The course is deleted.
Evaluation: Test works as intended.

deleteCourseMaterial_ms_test.php
The test deletes all related course material of the course with the id "9999". This can not be seen in the output.
Before the test: The entries are inserted into 19 different tables including creating the course itself.
After the test: The 19 entries are deleted again as a failsafe in case the test should fail.
Evaluation: There is no real way of seeing if the course material has been deleted or not in the output. The failsafe makes it so that it is impossible to know if the test actually did anything. If we comment out the failsafe and run the test, we can see that the test is working and deleting everything successfully. It would be a good idea to look into somehow updating the output to show that the operation worked.

retrieveCourseedVersion_ms_test.php
Tests the "retrieve" microservice that gathers the output that is returned after the courseedServices has run. The service basically returns a list of all courses and some status messages. The test compares the output with the standard output that should be retrieved when using a fresh database install.
Evaluation: Test works as intended.

updateActiceCourseversion_courseed_ms_test.php
The test updates the activeversion column of the course table for the Testing-Course to "1336", which can be seen in the output.
After the test: The active version is restored to 1337.
Evaluation: Test works as intended.

updateCourseVersion_ms_test.php
The test updates the Testing-Course's version name to HT00, which can be seen in the output.
After the test: The version name is restored to being blank.
Evaluation: The microservice can do a lot more than change a version name but these changes are not shown in the output generated in the retrieveCourseedService_ms.php service, it might be a good idea to make the service retrieve more data in the future so that we can test the full functionality of the microservice. 
Other than that, the test works as intended.