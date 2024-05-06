<?php

include "../../../../Shared/test.php";

$testsData = array(
    'update password' => array(
        'expected-output' => '{"blabla}"}',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/profileService/updateUserPassword_ms.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'a99birol',
            'password' => 'password',
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