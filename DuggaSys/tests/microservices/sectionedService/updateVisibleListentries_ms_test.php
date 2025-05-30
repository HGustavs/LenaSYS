<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'updateVisibleListEntries_ms' => array(
        'expected-output' => '{"entries":[{"entryname":"to be deleted","visible":0},{"entryname":"JavaScript-Code:","visible":1},{"entryname":"JS-TEST template 1","visible":1},{"entryname":"JS-TEST template 2","visible":1},{"entryname":"JS-TEST template 3","visible":1},{"entryname":"JS-TEST template 4","visible":1},{"entryname":"JS-TEST template 5","visible":1},{"entryname":"JS-TEST template 6","visible":1},{"entryname":"JS-TEST template 7","visible":1},{"entryname":"JS-TEST template 8","visible":1},{"entryname":"JS-TEST template 9","visible":1},{"entryname":"JS-TEST template 10","visible":1},{"entryname":"HTML-Code:","visible":1},{"entryname":"Html-test template 1","visible":1},{"entryname":"Html-test template 2","visible":1},{"entryname":"Html-test template 3","visible":1},{"entryname":"Html-test template 4","visible":1},{"entryname":"Html-test template 5","visible":1},{"entryname":"Html-test template 6","visible":1},{"entryname":"Html-test template 7","visible":1},{"entryname":"Html-test template 8","visible":1},{"entryname":"Html-test template 9","visible":1},{"entryname":"Html-test template 10","visible":1},{"entryname":"SQL-CODE:","visible":1},{"entryname":"SQL-TEST template 1","visible":1},{"entryname":"SQL-TEST template 2","visible":1},{"entryname":"SQL-TEST template 3","visible":1},{"entryname":"SQL-TEST template 4","visible":1},{"entryname":"SQL-TEST template 5","visible":1},{"entryname":"SQL-TEST template 6","visible":1},{"entryname":"SQL-TEST template 7","visible":1},{"entryname":"SQL-TEST template 8","visible":1},{"entryname":"SQL-TEST template 9","visible":1},{"entryname":"SQL-TEST template 10","visible":1},{"entryname":"PHP-CODE:","visible":1},{"entryname":"PHP-TEST template 1","visible":1},{"entryname":"PHP-TEST template 2","visible":1},{"entryname":"PHP-TEST template 3","visible":1},{"entryname":"PHP-TEST template 4","visible":1},{"entryname":"PHP-TEST template 5","visible":1},{"entryname":"PHP-TEST template 6","visible":1},{"entryname":"PHP-TEST template 7","visible":1},{"entryname":"PHP-TEST template 8","visible":1},{"entryname":"PHP-TEST template 9","visible":1},{"entryname":"PHP-TEST template 10","visible":1},{"entryname":"Other:","visible":1}],"debug":"NONE!"}',
        'query-before-test-1' => "INSERT INTO listentries(cid, entryname, visible, creator, vers) VALUES (1885, 'to be deleted', 1, 101, 1337);",
        'query-before-test-2' => "SELECT MAX(lid) AS lid FROM listentries",
        'query-after-test-1' => "DELETE FROM listentries WHERE cid = 1885 AND entryname = 'to be deleted';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateVisibleListEntries_ms.php',
        'service-data' => serialize(
            array( 
                'courseid' => 1885,
                'coursevers' => 1337,
                'opt' => 'SETVISIBILITY',
                'lid' => '<!query-before-test-2!><*[0]["lid"]*>',
                'visible' => 0,
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'entryname',
                    'visible',
                ),
                'debug',
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON