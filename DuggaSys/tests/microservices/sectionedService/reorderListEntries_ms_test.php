<?php
include_once "../../../../Shared/test.php";

// This test uses the pos value of each listentry to check if a listentry has been moved
// This test fails if there are new listentries added prior to performing the test

$testsData = array(
    'reorderListEntries' => array(
        'expected-output' => '{"entries":[{"entryname":"JavaScript-Code:","lid":"1","pos":"0"},{"entryname":"JS-TEST template 2","lid":"4001","pos":"1"},{"entryname":"JS-TEST template 1","lid":"4000","pos":"2"},{"entryname":"JS-TEST template 3","lid":"4002","pos":"3"},{"entryname":"JS-TEST template 4","lid":"4003","pos":"4"},{"entryname":"JS-TEST template 5","lid":"4004","pos":"5"},{"entryname":"JS-TEST template 6","lid":"4005","pos":"6"},{"entryname":"JS-TEST template 7","lid":"4006","pos":"7"},{"entryname":"JS-TEST template 8","lid":"4007","pos":"8"},{"entryname":"JS-TEST template 9","lid":"4008","pos":"9"},{"entryname":"JS-TEST template 10","lid":"4009","pos":"10"},{"entryname":"HTML-Code:","lid":"2","pos":"11"},{"entryname":"Html-test template 1","lid":"5000","pos":"12"},{"entryname":"Html-test template 2","lid":"5001","pos":"13"},{"entryname":"Html-test template 3","lid":"5002","pos":"14"},{"entryname":"Html-test template 4","lid":"5003","pos":"15"},{"entryname":"Html-test template 5","lid":"5004","pos":"16"},{"entryname":"Html-test template 6","lid":"5005","pos":"17"},{"entryname":"Html-test template 7","lid":"5006","pos":"18"},{"entryname":"Html-test template 8","lid":"5007","pos":"19"},{"entryname":"Html-test template 9","lid":"5008","pos":"20"},{"entryname":"Html-test template 10","lid":"5009","pos":"21"},{"entryname":"SQL-CODE:","lid":"4","pos":"22"},{"entryname":"SQL-TEST template 1","lid":"3110","pos":"23"},{"entryname":"SQL-TEST template 2","lid":"3111","pos":"24"},{"entryname":"SQL-TEST template 3","lid":"3112","pos":"25"},{"entryname":"SQL-TEST template 4","lid":"3113","pos":"26"},{"entryname":"SQL-TEST template 5","lid":"3114","pos":"27"},{"entryname":"SQL-TEST template 6","lid":"3115","pos":"28"},{"entryname":"SQL-TEST template 7","lid":"3116","pos":"29"},{"entryname":"SQL-TEST template 8","lid":"3117","pos":"30"},{"entryname":"SQL-TEST template 9","lid":"3118","pos":"31"},{"entryname":"SQL-TEST template 10","lid":"3119","pos":"32"},{"entryname":"PHP-CODE:","lid":"5","pos":"33"},{"entryname":"PHP-TEST template 1","lid":"2110","pos":"34"},{"entryname":"PHP-TEST template 2","lid":"2111","pos":"35"},{"entryname":"PHP-TEST template 3","lid":"2112","pos":"36"},{"entryname":"PHP-TEST template 4","lid":"2113","pos":"37"},{"entryname":"PHP-TEST template 5","lid":"2114","pos":"38"},{"entryname":"PHP-TEST template 6","lid":"2115","pos":"39"},{"entryname":"PHP-TEST template 7","lid":"2116","pos":"40"},{"entryname":"PHP-TEST template 8","lid":"2117","pos":"41"},{"entryname":"PHP-TEST template 9","lid":"2118","pos":"42"},{"entryname":"PHP-TEST template 10","lid":"2119","pos":"43"},{"entryname":"Other:","lid":"6","pos":"44"}],"debug":"NONE!","coursename":"Testing-Course","coursevers":"1337","coursecode":"G1337","courseid":"1885"}',
        'query-after-test-1' => 'UPDATE listentries SET pos=1 WHERE lid=4000;',
        'query-after-test-2' => 'UPDATE listentries SET pos=2 WHERE lid=4001;',
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/reorderListEntries_ms.php',
        'service-data' => serialize(
            array( 
                // Data that service needs to execute function
                'courseid' => '1885',
                'coursename' => '1885',
                'coursevers' => '1337',
                'comment' => 'undefined',
                'opt' => 'REORDER',
                'order' => '0XX1XX0,1XX4001XX0,2XX4000XX0,3XX4002XX0,4XX4003XX0,5XX4004XX0,6XX4005XX0,7XX4006XX0,8XX4007XX0,9XX4008XX0,10XX4009XX0,11XX2XX0,12XX5000XX0,13XX5001XX0,14XX5002XX0,15XX5003XX0,16XX5004XX0,17XX5005XX0,18XX5006XX0,19XX5007XX0,20XX5008XX0,21XX5009XX0,22XX4XX0,23XX3110XX0,24XX3111XX0,25XX3112XX0,26XX3113XX0,27XX3114XX0,28XX3115XX0,29XX3116XX0,30XX3117XX0,31XX3118XX0,32XX3119XX0,33XX5XX0,34XX2110XX0,35XX2111XX0,36XX2112XX0,37XX2113XX0,38XX2114XX0,39XX2115XX0,40XX2116XX0,41XX2117XX0,42XX2118XX0,43XX2119XX0,44XX6XX0',
                'username' => 'brom',
                'password' => 'password',
            )
        ),
        'filter-output' => serialize(
            array( 
                // Filter what output to use in assert test, use none to use all ouput from service
                'entries' => array(
                    'entryname',
                    'lid',
                    'pos'
                ),
                'debug',
                'coursename',
                'coursevers',
                'coursecode',
                'courseid',
            )
        ),
    )
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
