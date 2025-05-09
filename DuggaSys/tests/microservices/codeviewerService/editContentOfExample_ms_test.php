<?php

include_once "../../../../Shared/test.php";

$testsData = array(
    'editContentOfExample_ms' => array(
        'expected-output' => '{"box":[[1,"UPDATED","\u003C!DOCTYPE html\u003E\r\n\u003Chtml\u003E\r\n\u003Cbody\u003E\r\n\r\n\u003Ch2\u003EHTML Images\u003C\/h2\u003E\r\n\u003Cp\u003EHTML images are defined with the img tag:\u003C\/p\u003E\r\n\r\n\u003Cimg src=\"w3schools.jpg\" alt=\"W3Schools.com\" width=\"104\" height=\"142\"\u003E\r\n\r\n\u003C\/body\u003E\r\n\u003C\/html\u003E\r\n",4,"Html-test box 2","HTML-TEST2.html",11,"..\/..\/..\/courses\/global\/HTML-TEST2.html",2]],"improws":[[1,10,20],[1,100,200],[1,300,400]],"beforeafter":[[999997,"html","editContentOfExampleTest",999996,999998],[6000,"html","HTML-TEST1.html",6001,6000],[6001,"html","HTML-TEST1.html",6002,6000],[6002,"html","HTML-TEST1.html",6003,6001],[6003,"html","HTML-TEST1.html",6004,6002],[6004,"html","HTML-TEST1.html",6005,6003],[6005,"html","HTML-TEST1.html",6006,6004],[6006,"html","HTML-TEST1.html",6007,6005],[6007,"html","HTML-TEST1.html",6008,6006],[6008,"html","HTML-TEST1.html",6009,6007],[6009,"html","HTML-TEST1.html",6000,6008],[7000,"js","JS-TEST1.js",7001,7000],[7001,"js","JS-TEST1.js",7002,7000],[7002,"js","JS-TEST1.js",7003,7001],[7003,"js","JS-TEST1.js",7004,7002],[7004,"js","JS-TEST1.js",7005,7003],[7005,"js","JS-TEST1.js",7006,7004],[7006,"js","JS-TEST1.js",7007,7005],[7007,"js","JS-TEST1.js",7008,7006],[7008,"js","JS-TEST1.js",7009,7007],[7009,"js","JS-TEST1.js",7000,7008],[9000,"PHP","PHP-TEST1.PHP",9001,9000],[9001,"PHP","PHP-TEST1.PHP",9002,9000],[9002,"PHP","PHP-TEST1.PHP",9003,9001],[9003,"PHP","PHP-TEST1.PHP",9004,9002],[9004,"PHP","PHP-TEST1.PHP",9005,9003],[9005,"PHP","PHP-TEST1.PHP",9006,9004],[9006,"PHP","PHP-TEST1.PHP",9007,9005],[9007,"PHP","PHP-TEST1.PHP",9008,9006],[9008,"PHP","PHP-TEST1.PHP",9009,9007],[9009,"PHP","PHP-TEST1.PHP",9000,9008],[8000,"SQL","SQL-TEST1.SQL",8001,8000],[8001,"SQL","SQL-TEST1.SQL",8002,8000],[8002,"SQL","SQL-TEST1.SQL",8003,8001],[8003,"SQL","SQL-TEST1.SQL",8004,8002],[8004,"SQL","SQL-TEST1.SQL",8005,8003],[8005,"SQL","SQL-TEST1.SQL",8006,8004],[8006,"SQL","SQL-TEST1.SQL",8007,8005],[8007,"SQL","SQL-TEST1.SQL",8008,8006],[8008,"SQL","SQL-TEST1.SQL",8009,8007],[8009,"SQL","SQL-TEST1.SQL",8000,8008]]}',

        'query-before-test-1' => "INSERT INTO codeexample (exampleid, cid, examplename, sectionname, beforeid, afterid, runlink, uid, cversion, templateid) VALUES (999997, 1885, 'editContentOfExampleTest', 'html', 999996, 999998, 'HTML-TEST1.html', 101, 1337, 10)",
        'query-before-test-2' => "INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, wordlistid, fontsize) VALUES (1, 999997, 'Html-test box 1', 'Code', 'HTML-TEST1.html', 3, 9)",        
        'query-before-test-3' => "INSERT INTO improw (boxid, exampleid, istart, iend, uid) VALUES (1, 999997, 10, 20, 101)",
        'query-before-test-4' => "INSERT INTO improw (boxid, exampleid, istart, iend, uid) VALUES (1, 999997, 30, 40, 101)",

        'query-after-test-1' => "DELETE FROM improw WHERE boxid = 1 AND exampleid = 999997", 
        'query-after-test-2' => "DELETE FROM box WHERE boxid = 1 AND exampleid = 999997",
        'query-after-test-3' => "DELETE FROM codeexample WHERE exampleid = 999997",


        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/codeviewerService/editContentOfExample_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password', 
                'opt' => 'EDITCONTENT',
                'exampleid' => 999997, 
                'courseid' => 1885,
                'cvers' => 1337,
                'boxid' => 1,
                'boxtitle' => 'Html-test box 2',
                'boxcontent' => 'UPDATED',
                'wordlist' => 4,
                'filename' => 'HTML-TEST2.html',
                'fontsize' => 11,
                'addedRows' => '[100,200],[300,400]',
                'removedRows' => '[30,40]',
            )
        ),
        'filter-output' => serialize(
            array(
                'box',
                'beforeafter',                
                'improws'
            ),
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = pretty print (HTML), false = raw JSON
