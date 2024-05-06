<?php

include "../../../../Shared/test.php";

$testsData = array(
    'update password (user)' => array(
        'expected-output' => '{"success":true,"status":"","debug":"NONE!"}',
        'query-before-test-1' => "INSERT INTO user(username, password) VALUES ( 'testuser1', '\$2y\$10\$qGYP1gTTr7SG5/WbRlxCm.1tPmmZonKSYlAJaLj00pBEAJxyeKtI2');",
        'query-after-test-1' => "DELETE FROM user WHERE username ='testuser1';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/profileService/updateUserPassword_ms.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'testuser1',
            'password' => 'password',
            'action' => 'password',
            'newPassword' => 'Newpassword1',
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'success',
            'status',
        )),
    ),
);



testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON