# tests -> microservices -> sectionedService
====================
All of these tests build upon the structure of the test.php-file that the 2023 group made.
The test checks if the data that is inputted is sent and recieved correctly and compares it to the expected output to check if the test passed or not.

Some tests run queries before and after tests to INSERT, SELECT and DELETE data from the database that is used to run the test.


## changeActiveCourseVersion_ms_test

This tests the ms changeActiveCourseVersion

## createListEntry_ms_test

This tests the ms createListEntry


## deleteListEntries_ms_test

This tests the ms deleteListEntries


## getListEntries_ms_test

This tests the ms getListEntries


## getUserDuggaFeedback_ms_test

This tests the ms getUserDuggaFeedback


## setVisibleListentries_ms_test

This tests the ms setVisibleListentries


## updateCourseVersion_ms_test

This tests the ms updateCourseVersion

## updateListEntriesGradesystem_ms_test

This tests the ms updateListEntriesGradesystem

    Expected output: '{"entries":[{"lid":1,"gradesys":1},{"lid":4000,"gradesys":null},{"lid":4001,"gradesys":null},{"lid":4002,"gradesys":null},{"lid":4003,"gradesys":null},{"lid":4004,"gradesys":null},{"lid":4005,"gradesys":null},{"lid":4006,"gradesys":null},{"lid":4007,"gradesys":null},{"lid":4008,"gradesys":null},{"lid":4009,"gradesys":null},{"lid":2,"gradesys":null},{"lid":5000,"gradesys":null},{"lid":5001,"gradesys":null},{"lid":5002,"gradesys":null},{"lid":5003,"gradesys":null},{"lid":5004,"gradesys":null},{"lid":5005,"gradesys":null},{"lid":5006,"gradesys":null},{"lid":5007,"gradesys":null},{"lid":5008,"gradesys":null},{"lid":5009,"gradesys":null},{"lid":4,"gradesys":null},{"lid":3110,"gradesys":null},{"lid":3111,"gradesys":null},{"lid":3112,"gradesys":null},{"lid":3113,"gradesys":null},{"lid":3114,"gradesys":null},{"lid":3115,"gradesys":null},{"lid":3116,"gradesys":null},{"lid":3117,"gradesys":null},{"lid":3118,"gradesys":null},{"lid":3119,"gradesys":null},{"lid":5,"gradesys":null},{"lid":2110,"gradesys":null},{"lid":2111,"gradesys":null},{"lid":2112,"gradesys":null},{"lid":2113,"gradesys":null},{"lid":2114,"gradesys":null},{"lid":2115,"gradesys":null},{"lid":2116,"gradesys":null},{"lid":2117,"gradesys":null},{"lid":2118,"gradesys":null},{"lid":2119,"gradesys":null},{"lid":6,"gradesys":null}],"debug":"NONE!"}',

    'query-after-test-1' => "UPDATE listentries SET gradesystem = null WHERE cid = 1885 AND lid = 1;",


## updateListEntriesTabs_ms_test

This tests the ms updateListEntriesTabs

    Expected output: '{"entries":[{"lid":1,"tabs":1},{"lid":4000,"tabs":null},{"lid":4001,"tabs":null},{"lid":4002,"tabs":null},{"lid":4003,"tabs":null},{"lid":4004,"tabs":null},{"lid":4005,"tabs":null},{"lid":4006,"tabs":null},{"lid":4007,"tabs":null},{"lid":4008,"tabs":null},{"lid":4009,"tabs":null},{"lid":2,"tabs":null},{"lid":5000,"tabs":null},{"lid":5001,"tabs":null},{"lid":5002,"tabs":null},{"lid":5003,"tabs":null},{"lid":5004,"tabs":null},{"lid":5005,"tabs":null},{"lid":5006,"tabs":null},{"lid":5007,"tabs":null},{"lid":5008,"tabs":null},{"lid":5009,"tabs":null},{"lid":4,"tabs":null},{"lid":3110,"tabs":null},{"lid":3111,"tabs":null},{"lid":3112,"tabs":null},{"lid":3113,"tabs":null},{"lid":3114,"tabs":null},{"lid":3115,"tabs":null},{"lid":3116,"tabs":null},{"lid":3117,"tabs":null},{"lid":3118,"tabs":null},{"lid":3119,"tabs":null},{"lid":5,"tabs":null},{"lid":2110,"tabs":null},{"lid":2111,"tabs":null},{"lid":2112,"tabs":null},{"lid":2113,"tabs":null},{"lid":2114,"tabs":null},{"lid":2115,"tabs":null},{"lid":2116,"tabs":null},{"lid":2117,"tabs":null},{"lid":2118,"tabs":null},{"lid":2119,"tabs":null},{"lid":6,"tabs":null}],"debug":"NONE!"}',

    'query-after-test-1' => "UPDATE listentries SET tabs = null WHERE cid = 1885 AND lid = 1;",



## updateQuizDeadline_ms_test

This tests the ms updateQuizDeadline

Expected output: '{"debug":"NONE!","duggor":[{"qname":"quiz to be deleted","deadline":"2024-05-16 16:00:00","relativedeadline":"senare"}]}',

    'query-before-test-1' => "INSERT INTO quiz(cid, vers, deadline, relativedeadline, qname) VALUES (1885, 1337, '2024-05-15 15:00:00', 'snart', 'quiz to be deleted');",
    'query-before-test-2' => "SELECT MAX(id) AS id FROM quiz",
    'query-after-test-1' => "DELETE FROM quiz WHERE cid = 1885 AND qname = 'quiz to be deleted';",
