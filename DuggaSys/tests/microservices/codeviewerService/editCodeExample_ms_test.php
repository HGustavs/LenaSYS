<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'editCodeExample' => array(
        'expected-output' => '{"impwords":["UPDATED"],"beforeafter":[[999998,"html","editCodeExampleTestUPDATED",888888,777777],[6000,"html","HTML-TEST1.html",6001,6000],[6001,"html","HTML-TEST1.html",6002,6000],[6002,"html","HTML-TEST1.html",6003,6001],[6003,"html","HTML-TEST1.html",6004,6002],[6004,"html","HTML-TEST1.html",6005,6003],[6005,"html","HTML-TEST1.html",6006,6004],[6006,"html","HTML-TEST1.html",6007,6005],[6007,"html","HTML-TEST1.html",6008,6006],[6008,"html","HTML-TEST1.html",6009,6007],[6009,"html","HTML-TEST1.html",6000,6008],[7000,"js","JS-TEST1.js",7001,7000],[7001,"js","JS-TEST1.js",7002,7000],[7002,"js","JS-TEST1.js",7003,7001],[7003,"js","JS-TEST1.js",7004,7002],[7004,"js","JS-TEST1.js",7005,7003],[7005,"js","JS-TEST1.js",7006,7004],[7006,"js","JS-TEST1.js",7007,7005],[7007,"js","JS-TEST1.js",7008,7006],[7008,"js","JS-TEST1.js",7009,7007],[7009,"js","JS-TEST1.js",7000,7008],[9000,"PHP","PHP-TEST1.PHP",9001,9000],[9001,"PHP","PHP-TEST1.PHP",9002,9000],[9002,"PHP","PHP-TEST1.PHP",9003,9001],[9003,"PHP","PHP-TEST1.PHP",9004,9002],[9004,"PHP","PHP-TEST1.PHP",9005,9003],[9005,"PHP","PHP-TEST1.PHP",9006,9004],[9006,"PHP","PHP-TEST1.PHP",9007,9005],[9007,"PHP","PHP-TEST1.PHP",9008,9006],[9008,"PHP","PHP-TEST1.PHP",9009,9007],[9009,"PHP","PHP-TEST1.PHP",9000,9008],[8000,"SQL","SQL-TEST1.SQL",8001,8000],[8001,"SQL","SQL-TEST1.SQL",8002,8000],[8002,"SQL","SQL-TEST1.SQL",8003,8001],[8003,"SQL","SQL-TEST1.SQL",8004,8002],[8004,"SQL","SQL-TEST1.SQL",8005,8003],[8005,"SQL","SQL-TEST1.SQL",8006,8004],[8006,"SQL","SQL-TEST1.SQL",8007,8005],[8007,"SQL","SQL-TEST1.SQL",8008,8006],[8008,"SQL","SQL-TEST1.SQL",8009,8007],[8009,"SQL","SQL-TEST1.SQL",8000,8008]]}',

        'query-before-test-1' => "INSERT INTO codeexample (exampleid, cid, examplename, sectionname, beforeid, afterid, runlink, uid, cversion, templateid) VALUES (999998, 1885, 'editCodeExampleTest', 'html', 999997, 999999, 'HTML-TEST1.html', 101, 1337, 10)",
        'query-before-test-2' => "INSERT INTO impwordlist(exampleid, word, uid) VALUES (999998, 'IShouldBeDeleted', 101)",

        'query-after-test-1' => "DELETE FROM impwordlist WHERE exampleid = 999998",
        'query-after-test-2' => "DELETE FROM codeexample WHERE exampleid = 999998",

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/codeviewerService/editCodeExample_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password', 
                'opt' => 'EDITEXAMPLE',
                'exampleid' => 999998, 
                'courseid' => 1885,
                'cvers' => 1337,
                'playlink' => 'HTML-TEST1.html',
                'examplename' => 'editCodeExampleTestUPDATED',
                'sectionname' => 'html',
                'beforeid' => 888888,
                'afterid' => 777777,
                'addedWords' => 'UPDATED',
                'removedWords' => 'IShouldBeDeleted'
            )
        ),
        'filter-output' => serialize(
            array(
                'beforeafter',
                'impwords'
            ),
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = pretty print (HTML), false = raw JSON
