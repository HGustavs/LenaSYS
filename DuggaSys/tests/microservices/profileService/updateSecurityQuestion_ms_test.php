<?php
include "../../../../Shared/test.php";

// Hashed password for password verfication
$testPassword = password_hash('secret', PASSWORD_BCRYPT);

// TODO 'uid' should not be hard coded or manually inserted in USER table. Modify the testHandler function to keep same code structure.

$testdata = [
    'update security question' => [
        'expected-output' => '{"success":true,"status":"","debug":"NONE!"}', // Updating security question & answer was successful
        'query-before-test' => "INSERT INTO user (uid, username, password, securityquestion, securityquestionanswer) VALUES (200000, 'testuser', '$testPassword', 'What is old question', 'old');", // Insert a user with old security question
        'query-after-test' => "DELETE FROM user WHERE uid = 200000;", // Clean up after the test
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/profileService/updateSecurityQuestion_ms.php',
        'service-data' => serialize([ // Data that the service needs to execute the function
            'userid' => 200000, 
            'username' => 'testuser',
            'password' => 'secret', 
            'action' => 'challenge',
            'securityquestion' => 'What is new question', 
            'answer' => 'new'
]),
        'filter-output' => serialize([
'none'
        ]),
    ],
];

testHandler($testdata, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON