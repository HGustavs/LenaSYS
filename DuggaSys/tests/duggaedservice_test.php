<?php

include "../../Shared/test.php";

$testdata = array(
    'create  test' => array(
            'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
            'service' => 'https://cms.webug.se/root/G2/students/c21axepe/LenaSYS/DuggaSys/duggaedservice.php',
            'service-data' => serialize(array( // Data that service needs to execute function
                    'opt' => 'GET',
                    'cid' => '2',
                    'coursevers' => '97732',
                    'username' => 'toddler',
                    'password' => 'Kong'
                    
            )),
            'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
                    'debug',
                    'motd'
            )),
    ),

);
 
testHandler($testdata, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON

?>