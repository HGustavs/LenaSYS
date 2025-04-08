<?php

include "../../Shared/test.php";

// Define the tests data
$testsData = array(
    'test_valid_session_data' => array(
        'expected-output' => json_encode(array(
            'test_value' => 'expected_value'
        )),
        'query-before-test-1' => "INSERT INTO submission (hash, hashpwd, variant, segment) VALUES ('validhash', 'validpwd', 'variant1', 'moment1')",
        'variables-query-before-test-1' => "validhash, validpwd, variant1, moment1",
        'query-after-test-1' => "DELETE FROM submission WHERE hash = 'validhash'",
        'service' => 'http://localhost/path_to/processDuggafile_ms.php',
        'service-data' => serialize(array(
            'courseid' => '1',
            'coursevers' => '1',
            'duggaid' => '1',
            'duggainfo' => array('qrelease' => '2022-01-01 00:00:00'),
            'moment' => 'moment1',
            'session' => array(
                'submission-1-1-1-moment1' => 'validhash',
                'submission-password-1-1-1-moment1' => 'validpwd',
                'submission-variant-1-1-1-moment1' => 'variant1',
                'uid' => 1
            )
        )),
        'filter-output' => serialize(array('none'))
    ),
    'test_invalid_session_data' => array(
        'expected-output' => json_encode((object)array()), 
        'service' => 'http://localhost/DuggaSys\microservices\showDuggaService\processDuggaFile_ms.php',
        'service-data' => serialize(array(
            'courseid' => '1',
            'coursevers' => '1',
            'duggaid' => '1',
            'duggainfo' => array('qrelease' => '2022-01-01 00:00:00'),
            'moment' => 'moment1',
            'session' => array() 
        )),
        'filter-output' => serialize(array('none'))
    ),
    'test_superuser_fallback' => array(
        'expected-output' => json_encode(array(
            'some_expected_output' => 'expected_value' // Adjust based on actual expected output
        )),
        'query-before-test-1' => "INSERT INTO submission (hash, hashpwd, variant, segment) VALUES ('invalidhash', 'validpwd', 'variant1', 'moment1')",
        'variables-query-before-test-1' => "invalidhash, validpwd, variant1, moment1",
        'query-after-test-1' => "DELETE FROM submission WHERE hash = 'invalidhash'",
        'service' => 'http://localhost/DuggaSys\microservices\showDuggaService\processDuggaFile_ms.php',
        'service-data' => serialize(array(
            'courseid' => '1',
            'coursevers' => '1',
            'duggaid' => '1',
            'duggainfo' => array('qrelease' => '2022-01-01 00:00:00'),
            'moment' => 'moment1',
            'session' => array(
                'submission-1-1-1-moment1' => 'invalidhash',
                'submission-password-1-1-1-moment1' => 'validpwd',
                'submission-variant-1-1-1-moment1' => 'variant1',
                'uid' => 1,
                'superuser' => true
            )
        )),
        'filter-output' => serialize(array('none'))
    ),
    'test_file_handling' => array(
        'expected-output' => json_encode(array(
            'some_expected_output' => 'expected_value' //unsure here
        )),
        'query-before-test-1' => "INSERT INTO submission (hash, hashpwd, variant, segment, filepath, filename, seq, extension, kind) VALUES ('validhash', 'validpwd', 'variant1', 'moment1', '/path/to/file/', 'file', 1, 'txt', 3)",
        'variables-query-before-test-1' => "validhash, validpwd, variant1, moment1",
        'query-after-test-1' => "DELETE FROM submission WHERE hash = 'validhash'",
        'service' => 'http://localhost/path_to/processDuggafile_ms.php',
        'service-data' => serialize(array(
            'courseid' => '1',
            'coursevers' => '1',
            'duggaid' => '1',
            'duggainfo' => array('qrelease' => '2022-01-01 00:00:00'),
            'moment' => 'moment1',
            'session' => array(
                'submission-1-1-1-moment1' => 'validhash',
                'submission-password-1-1-1-moment1' => 'validpwd',
                'submission-variant-1-1-1-moment1' => 'variant1',
                'uid' => 1
            )
        )),
        'filter-output' => serialize(array('none'))
    ),
    'test_feedback_retrieval' => array(
        'expected-output' => json_encode(array(
            'some_expected_output' => 'expected_value' // Adjust based on actual expected output
        )),
        'query-before-test-1' => "INSERT INTO submission (hash, hashpwd, variant, segment, filepath, filename, seq, extension, kind) VALUES ('validhash', 'validpwd', 'variant1', 'moment1', '/path/to/file/', 'file', 1, 'txt', 3)",
        'variables-query-before-test-1' => "validhash, validpwd, variant1, moment1",
        'query-after-test-1' => "DELETE FROM submission WHERE hash = 'validhash'",
        'service' => 'http://localhostDuggaSys\microservices\showDuggaService\processDuggaFile_ms.php',
        'service-data' => serialize(array(
            'courseid' => '1',
            'coursevers' => '1',
            'duggaid' => '1',
            'duggainfo' => array('qrelease' => '2023-01-01 00:00:00'), // set future release date
            'moment' => 'moment1',
            'session' => array(
                'submission-1-1-1-moment1' => 'validhash',
                'submission-password-1-1-1-moment1' => 'validpwd',
                'submission-variant-1-1-1-moment1' => 'variant1',
                'uid' => 1
            )
        )),
        'filter-output' => serialize(array('none'))
    ),
);

// Runs the test handler
testHandler($testsData, false); // Change to true for pretty print (HTML)

?>