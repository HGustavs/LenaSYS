<?php

include "../../Shared/test.php";   // Include the test file
include_once "../../../coursesyspw.php";  // Include the logged in user

$testsData = array(   // Test-data is saved on this array that is then tested in test.php file





)

// test
testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
?>