<?php



include "../../Shared/test.php";


$testsData = array(

'get data from userAnswer (student)' => array(
    
    'query-before-test-4' => "INSERT INTO userAnswer (hash, password, variant, cid, moment) VALUES('ghj1jfg2', 'dsa4cxz5', 13, 9999, 'momentValue');",
    'query-after-test-1' => "DELETE FROM userAnswer WHERE hash = 'ghj1jfg2';",
    'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    'service-data' => serialize(array( // Data that service needs to execute function
        'opt' => 'SAVDU',
        'hash' => 'ghj1jfg2',
        'username' => 'a99marjo',
        'password' => 'password',
        'moment' => 'momentValue'
    )),
    
),
'get data from userAnswer (teacher)' => array(
    
    'query-before-test-4' => "INSERT INTO userAnswer (hash, password, variant, cid, moment) VALUES('ghj1jfg2', 'dsa4cxz5', 13, 9999, 'momentValue');",
    'query-after-test-1' => "DELETE FROM userAnswer WHERE hash = 'ghj1jfg2';",
    'service' => 'http://localhost/LenaSYS/DuggaSys/showDuggaservice.php',
    'service-data' => serialize(array( // Data that service needs to execute function
        'opt' => 'SAVDU',
        'hash' => 'ghj1jfg2',
        'username' => 'stei',
        'password' => 'password',
        'moment' => 'momentValue'
    )),
   
),

);