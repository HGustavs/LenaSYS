<?php

include "../Shared/test.php";

$testsData = array(
    'Get active users' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'UPDATEAU',
            'hash' => 'hnf3j58s'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'debug',
            'readonly'
        )),
    ),
    'Get active users' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'UPDATEAU',
            'hash' => 'tj7dh2nb',
            'AUtoken' => '999'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'update active users' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'UPDATEAU',
            'hash' => 'hjk4ert6',
            'AUtoken' => '9999'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'get data from userAnswer' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'SAVDU',
            'hash' => 'ghj1jfg2'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'update submitted dugga' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'SAVDU',
            'hash' => 'dfg4zxc5',
            'haspwd' => 'asdfasdf',
            'answer' => 'im updated'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'submit dugga' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'opt' => 'SAVDU',
            'cid' => '9999',
            'coursevers' => '52432',
            'duggaid' => '1',
            'moment' => 'SAVED VALUE FROM PREVIOUS QUERY//this value is an INT, so no quotation marks.',
            'variant' => '3',
            'hash' => 'ghj1ghj2',
            'haspwd' => 'asddasdd',
            'answer' => 'NULL'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'super-view data from useranswer on hash' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'hash' => 'dfg4zxc5'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'super-view data from useranswer on moment' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'moment' => '"VALUE FROM PREVIOUS QUERY"//value is an INT, no quotation marks.'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'super-view data on quizname' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'moment' => '"VALUE FROM PREVIOUS QUERY"//value is an INT, no quotation marks.'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'view data on userAnswer' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'hash' => 'ghj1ghj2',
            'hashpwd' => 'asddasdd'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
    'super-view data on quizname' => array(
        'expected-output' => '{"debug":"[Guest] Missing hash\/password\/variant!","param":"{}","answer":"UNK","danswer":"UNK","score":0,"highscoremode":"","grade":"UNK","submitted":"","marked":"","deadline":"UNK","release":"UNK","files":[],"userfeedback":"UNK","feedbackquestion":"UNK","variant":"UNK","ishashindb":false,"variantsize":"UNK","variantvalue":"UNK","password":"UNK","hashvariant":"UNK","isFileSubmitted":"UNK","isTeacher":0,"variants":[],"duggaTitle":"UNK","hash":"UNK","hashpwd":"UNK","opt":"UNK","link":"UNK"}',
        'service' => 'https://cms.webug.se/root/G2/students/a21oscgu/LenaSYS/DuggaSys/courseedservice.php',
        'service-data' => serialize(array( // Data that service needs to execute function
            'courseid' => '9999',
            'duggaid' => '1',
            'tmpvariant' => '3',
            'tmphash' => 'ghj1ghj2',
            'tmphashpwd' => 'UNK'
        )),
        'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
            'none'
        )),
    ),
);

testHandler($testsData, false); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON