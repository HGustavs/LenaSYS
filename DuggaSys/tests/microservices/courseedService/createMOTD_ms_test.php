<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'updateDugga_ms' => array(
        'expected-output' => '{"debug":"NONE!","motd":"TESTING-MOTD-DELETE","readonly":"1"}',
        'query-after-test-1' => 'DELETE FROM settings WHERE motd="TESTING-MOTD-DELETE"',
        'service' => 'http://localhost/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(
            array(
                'opt' => 'SETTINGS',
                'motd' => 'TESTING-MOTD-DELETE',
                'readonly' => '1',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array(
                'debug',
                'motd',
                'readonly'
            )
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>
