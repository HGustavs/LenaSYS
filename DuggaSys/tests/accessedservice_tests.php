
<?php

include "../Shared/test.php";

$testsData = array(
    // Test 1
    'create access test' => array(
        'expected-output' => '{"debug":"NONE!", "motd":"UNK"}',
        'query-before-test-1' => "SELECT userid FROM user WHERE username = 'testuser1'", // May change userid to uid
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array( // The data that the service needs to execute
            'opt' => 'UPDAT', // May change UPDAT to UPDATE
            'prop' => 'firstname',
            'val' => 'test',
            'uid' => 'testuser1',
            'blop' => '!query-before-test-1! [0][uid]' 
        )),
        'filter-output' => serialize(array(
            'none' // To use all output from service
        )),
    ),
    // Test 2
    'create access test 2' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "SELECT userid FROM user WHERE username = 'testuser1'", // May change userid to uid
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array( 
            'opt' => 'UPDAT',
            'prop' => 'lastname',
            'val' => 'test',
            'uid' => 'testuser1',
            'blop' => '!query-before-test-1! [0][uid]'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Test 3
    'create access test 3' => array(
        'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
        'query-before-test-1' => "SELECT userid FROM user WHERE username = 'testuser1'", // May change userid to uid
        'query-before-test-2' => "INSERT INTO user(username, pwd) VALUES('testuser1', 'testpwd')",
        'query-after-test-1' => "DELETE FROM user WHERE username = 'testuser1'",
        'query-after-test-2' => "DELETE FROM user WHERE username = 'testuser1'",
        'service' => 'https://cms.webug.se/root/G2/a20fanma/LenaSYS/DuggaSys/accessedservice.php',
        'service-data' => serialize(array(
            'opt' => 'UPDAT',
            'prop' => 'ssn',
            'val' => 'test',
            'uid' => 'testuser1',
            'blop' => '!query-before-test-1! [0][uid]'
        )),
        'filter-output' => serialize(array(
            'none'
        )),
    ),
    // Create new test
);

// Call JSON data, how to view the result
testHandler($testsData, false);

?>