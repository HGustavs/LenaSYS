<?php
include_once "../../../../Shared/test.php";

$testsData = array(

  'removeListEntries_sectionedTest ' => array(

    // Insert a test listentry row
    'query-before-test-1' => "
      INSERT INTO listentries (lid, cid, vers, entryname, visible, creator)
      VALUES (9999, 1885, 950, 'Test', 1, 1);
    ",

    'expected-output' => '{"debug":"NONE!"}',

    'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/sectionedService/removeListEntries_ms.php',

    'service-data' => serialize(array(
      'courseid'   => 1885,
      'coursevers' => 950,
      'log_uuid'   => '',
      'opt'        => 'updateListEntries',
      'lid'        => 9999,
      'creator'    => 1,
      'username'   => 'brom',
      'password'   => 'password'
    )),

    'filter-output' => serialize(array('debug')),

    'query-after-test-1' => "
      DELETE FROM listentries WHERE lid = 9999;
    ",
  )

);

testHandler($testsData, true);
