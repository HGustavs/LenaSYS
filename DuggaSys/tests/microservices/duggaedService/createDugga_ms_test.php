<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'createDugga_ms' => array(
        'expected-output' => '{"entries":[{"qname":"Bitdugga1","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-01-30 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"Bitdugga2","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-01-25 15:30:00","qrelease":"2015-01-08 00:00:00","jsondeadline":""},{"qname":"colordugga1","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-01-20 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"colordugga2","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-01-18 15:30:00","qrelease":"2015-01-08 00:00:00","jsondeadline":""},{"qname":"linjedugga1","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-02-10 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"linjedugga2","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-02-15 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"dugga1","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-02-05 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"dugga2","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-02-20 15:30:00","qrelease":"2015-02-01 00:00:00","jsondeadline":""},{"qname":"Quiz","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-02-19 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"Rapport","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-02-19 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"HTML CSS Testdugga","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-02-19 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"Clipping masking testdugga","autograde":1,"gradesystem":2,"qstart":null,"deadline":"2015-02-19 15:30:00","qrelease":"2015-01-01 00:00:00","jsondeadline":""},{"qname":"createDuggaTest","autograde":0,"gradesystem":1,"qstart":null,"deadline":null,"qrelease":null,"jsondeadline":"{\"TestJSON\":\"2024-04-04 04:04:04\"}"}]}',
        
        'query-after-test-1' => "DELETE FROM quiz WHERE qname = 'createDuggaTest'",
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/duggaedService/createDugga_ms.php',
        'service-data' => serialize(
            array(
                // Data that service needs to execute function
                'opt' => 'SAVDUGGA',
                'cid' => '2',
                'nme' => 'createDuggaTest',
                'coursevers' => '97732',
                'autograde' => '0',
                'gradesys' => '1',
                'template' => 'group-assignment',
                'jsondeadline' => '{"TestJSON":"2024-04-04 04:04:04"}',
                'release' => '2024-01-02 02:02:02',
                'deadline' => '2024-01-01 01:01:01',
                'qstart' => '2024-01-03',
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(array(
                'entries' => array(
                    'qname',
                    'autograde',
                    'gradesystem',
                    'quizfile',
                    'qstart',
                    'deadline',
                    'qrelease',
                    'jsondeadline'
                ),
            )     
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON