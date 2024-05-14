<?php
include_once "../../../../Shared/test.php";

$testsData = array(
    'setVisibleListEntries_ms' => array(
        'expected-output' => '{}',
        'query-before-test-1' => "INSERT INTO listentries(cid, entryname,visible, creator, vers) VALUES (1885, 'setvisListEntry',0, 101, 1337);",
        'query-before-test-2' => "SELECT lid FROM listentries  WHERE entryname = 'setvisListEntry';",
        'query-after-test-1' => "DELETE FROM listentries WHERE entryname = 'setvisListEntry';",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/setVisibleListentries_ms.php',
        'service-data' => serialize(
            array( 
                'username' => 'brom',
                'password' => 'password',
                'lid' => '<!query-before-test-2!><*[0]["lid"]*>',
                'visible' => '2',
                'cid' => '1885',
                'vers' => '1337',
                'log_uuid' => 'W7Ul29YJYRDE2z8',
                'opt' => 'UNK',
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'none'
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON