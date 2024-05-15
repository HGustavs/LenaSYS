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

## updateListEntriesTabs_ms_test

This tests the ms updateListEntriesTabs

## updateQuizDeadline_ms_test

This tests the ms updateQuizDeadline

Expected output: '{"debug":"NONE!","duggor":[{"qname":"quiz to be deleted","deadline":"2024-05-16 16:00:00","relativedeadline":"senare"}]}',

    'query-before-test-1' => "INSERT INTO quiz(cid, vers, deadline, relativedeadline, qname) VALUES (1885, 1337, '2024-05-15 15:00:00', 'snart', 'quiz to be deleted');",
    'query-before-test-2' => "SELECT MAX(id) AS id FROM quiz",
    'query-after-test-1' => "DELETE FROM quiz WHERE cid = 1885 AND qname = 'quiz to be deleted';",
