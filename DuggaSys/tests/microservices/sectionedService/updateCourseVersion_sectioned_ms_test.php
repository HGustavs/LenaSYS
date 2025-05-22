<?php
include_once "../../../../Shared/test.php";

$testsData = array(

  'updateCourseVersion_sectionedTest' => array(

    'query-before-test-1' => "
      INSERT INTO vers 
        (cid, coursecode, vers, versname, startdate, enddate, motd) 
      VALUES 
        (1885, 'G1337', 420, 'updateCourseVersionSectionedTest', '2025-01-01', '2025-01-30', 'Test')
    ",

    'expected-output' => '{"debug":"NONE!"}',

    'service'      => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/updateCourseVersion_sectioned_ms.php',
    'service-data' => serialize(array(
      'opt'         => 'UPDATEVRS',
      'courseid'    => 1885,
      'coursecode'  => 'TCODE',
      'coursevers'  => 420,           
      'versid'      => 420,
      'motd'        => 'test success',
      'versname'    => 'completeUpdateCourseVersionSectionedTest',
      'startdate'   => '2025-01-01',
      'enddate'     => '2025-01-30',
      'makeactive'  => 0,           
      'username'    => 'brom',  
      'password'    => 'password'
    )),

    'filter-output' => serialize(array('debug')),

    'query-after-test-1' => "
      DELETE FROM vers 
      WHERE cid = 1885 
        AND coursecode = 'G1337' 
        AND vers = 420
    ",

  )

);

testHandler($testsData, true);
