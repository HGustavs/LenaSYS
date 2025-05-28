<?php

include_once "../../../../Shared/test.php";

$testsData = array(
  'retrieveFileedServiceTest' => array(
    'expected-output' => '{
        "entries":[],
        "debug":"NONE!",
       "gfiles":[],
        "lfiles":[],
        "access":false,
        "studentteacher":false,
        "superuser":true,
        "waccess":false,
        "supervisor":false
    }',

    'query-before-test-1' => "
      INSERT INTO fileLink 
        (fileid, cid, vers, kind, filename, path, filesize, uploaddate) 
      VALUES 
        (12345, 1, 1, 1, 'brrbrrpatapim.pdf', '/global/brrbrrpatapim.pdf', 1024, NOW())
    ",

    'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/fileedService/retrieveFileedService_ms.php',

    'service-data' => serialize(array(
      'opt'        => 'all',
      'courseid'   => 1,
      'coursevers' => 1,
      'fileid'        => 12345,
      'kind'       => 0,
      'username'   => 'brom',
      'password'   => 'password'
    )),

    'filter-output' => serialize(array(
      'entries',
      'debug',
      'gfiles',
      'lfiles',
      'access',
      'studentteacher',
      'superuser',
      'waccess',
      'supervisor'
    )),

    'query-after-test-1' => "
      DELETE FROM fileLink 
      WHERE fileid = 12345
    "
  )
);

testHandler($testsData, true);
