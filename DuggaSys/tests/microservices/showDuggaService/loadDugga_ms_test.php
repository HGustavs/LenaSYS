<?php

include "../../../../Shared/test.php";

$testsData = array(

    'load dugga' => array(
        'expected-output' => '{"variant":"991","answer":"useranswer","variantanswer":"{variantanswer}","param":"{testparam}"}',
        'query-before-test-1' => "INSERT INTO variant (vid,param, variantanswer) VALUES (991,'{testparam}','{variantanswer}');",
        'query-before-test-2' => "INSERT INTO listentries (lid,cid,vers, entryname, visible,creator) VALUES(9991,1885,1337,'LDMOMENT',1,101);",
        'query-before-test-3' => "INSERT INTO userAnswer (cid, variant, moment,useranswer, hash) VALUES (1885, 991, 9991,'useranswer', 'hnf3j58s');",
        'query-after-test-1' => "DELETE FROM userAnswer WHERE hash = 'hnf3j58s';",
        'query-after-test-2' => "DELETE FROM variant WHERE vid = 991;",
        'query-after-test-3' => "DELETE FROM listentries WHERE lid = 9991;",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/showDuggaService/loadDugga_ms.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'username' => 'brom',
            'password' => 'password',
            'hash' => 'hnf3j58s',
            'moment' => '9991',
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'variant',
            'answer',
            'variantanswer',
            'param',

        )),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON