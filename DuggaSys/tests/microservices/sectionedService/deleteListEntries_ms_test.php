<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'deleteListEntries_ms' => array(
        'expected-output' => '{"entries":[{"entryname":"JavaScript-Code:"},{"entryname":"JS-TEST template 1"},{"entryname":"JS-TEST template 2"},{"entryname":"JS-TEST template 3"},{"entryname":"JS-TEST template 4"},{"entryname":"JS-TEST template 5"},{"entryname":"JS-TEST template 6"},{"entryname":"JS-TEST template 7"},{"entryname":"JS-TEST template 8"},{"entryname":"JS-TEST template 9"},{"entryname":"JS-TEST template 10"},{"entryname":"HTML-Code:"},{"entryname":"Html-test template 1"},{"entryname":"Html-test template 2"},{"entryname":"Html-test template 3"},{"entryname":"Html-test template 4"},{"entryname":"Html-test template 5"},{"entryname":"Html-test template 6"},{"entryname":"Html-test template 7"},{"entryname":"Html-test template 8"},{"entryname":"Html-test template 9"},{"entryname":"Html-test template 10"},{"entryname":"SQL-CODE:"},{"entryname":"SQL-TEST template 1"},{"entryname":"SQL-TEST template 2"},{"entryname":"SQL-TEST template 3"},{"entryname":"SQL-TEST template 4"},{"entryname":"SQL-TEST template 5"},{"entryname":"SQL-TEST template 6"},{"entryname":"SQL-TEST template 7"},{"entryname":"SQL-TEST template 8"},{"entryname":"SQL-TEST template 9"},{"entryname":"SQL-TEST template 10"},{"entryname":"PHP-CODE:"},{"entryname":"PHP-TEST template 1"},{"entryname":"PHP-TEST template 2"},{"entryname":"PHP-TEST template 3"},{"entryname":"PHP-TEST template 4"},{"entryname":"PHP-TEST template 5"},{"entryname":"PHP-TEST template 6"},{"entryname":"PHP-TEST template 7"},{"entryname":"PHP-TEST template 8"},{"entryname":"PHP-TEST template 9"},{"entryname":"PHP-TEST template 10"},{"entryname":"Other:"}],"debug":"NONE!"}',

        'query-before-test-1' => "INSERT INTO listentries(cid, entryname, creator, vers) VALUES (1885, 'listentry to be deleted', 101, 1337);",
        'query-before-test-2' => "SELECT MAX(lid) AS lid FROM listentries",
        'variables-query-before-test-3' => "lid",
        'query-before-test-3' => "INSERT INTO userAnswer (cid, moment, useranswer, vers, hash, password) VALUES(1885, ?, 'useranswer to be deleted', 1337, 'ghj1ghj2', 'asddasdd');",
        'query-after-test-1' => "DELETE FROM userAnswer WHERE cid = 1885 AND useranswer = 'useranswer to be deleted';", // Failsafe
        'query-after-test-2' => "DELETE FROM listentries WHERE cid = 1885 AND entryname = 'listentry to be deleted';", // Failsafe
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/deleteListEntries_ms.php',
        'service-data' => serialize(
            array( 
                // Data that service needs to execute function
                'courseid' => 1885,
                'coursevers' => 1337,
                'opt' => 'DEL',
                'lid' => '<!query-before-test-2!><*[0]["lid"]*>',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'entryname',
                ),
                'debug',
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON