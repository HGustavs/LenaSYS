<?php
    include_once "../Shared/test.php";

    $testData = array(
        'value1' => 'test',
        'value2' => 'test',
        'service' => 'https://cms.webug.se/root/G2/students/c21alest/LenaSYS/DuggaSys/courseedservice.php',
        'serviceData' => serialize(array( // Data that service needs to execute function
            'opt' => 'NEW',
            'username' => 'usr',
            'password' => 'pass',
        )),
        'test1Debug' => false, // If true more information of test will be displayed
        'test2Debug' => true,
        'test3Debug' => true,
    );
    
    testHandler($testData, false); // 2nd argument true = prettyprint (HTML) false = raw JSON, no debug mode is avalible when using prettyprint
?>