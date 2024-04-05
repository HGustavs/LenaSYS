<?php
include "../../Shared/test.php";
include_once "../../../coursesyspw.php";

$testsData = array(
	'Edit file test' => array(
		'expected-output' => '{"debug":"NONE!","gfiles":[],"lfiles":[],"access":true,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
		'service' => 'fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'cid' => '1894',
			'coursevers' => '52432',
			'opt' => 'SAVEFILE',
			'cid' => '1894',
			'contents' => "<div class='err'><span style='font-weight:bold;'>Bummer!</span> You have reached a non-navigable link!!!</div>",
			'filename' => 'helloWorld.html',
			'filepath' => '../courses/global/helloWorld.html', 
			'kind' => '2'
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
			'debug',
			'gfiles',
			'lfiles',
			'access',
			'studentteacher',
			'superuser',
			'waccess',
			'supervisor'
		)),
	),
	'Delete file - Global test' => array(
		'expected-output' => '{"debug":"The file was deleted.","gfiles":[],"lfiles":[],"access":true,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
		'service' => 'fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'cid' => '1894',
			'coursevers' => '52432',
			'opt' => 'DELFILE',
			'fid' => '47',
			'cid' => '1894',
			'coursevers' => '52432',
			'filename' => 'helloWorld.html',
			'kind' => '2',
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
			'debug',
			'gfiles',
			'lfiles',
			'access',
			'studentteacher',
			'superuser',
			'waccess',
			'supervisor'
		)),
	),
	'Delete file codeexample test' => array(
		'expected-output' => '{"debug":"This file is part of a code example. Remove it from there before removing the file.","gfiles":[],"lfiles":[],"access":true,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
		'service' => 'fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'cid' => '1894',
			'coursevers' => '52432',
			'opt' => 'DELFILE',
			'fid' => '4',
			'cid' => '1894',
			'coursevers' => '52432',
			'filename' => 'HTML_Ex1.txt',
			'kind' => '2',
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
			'debug',
			'gfiles',
			'lfiles',
			'access',
			'studentteacher',
			'superuser',
			'waccess',
			'supervisor'
		)),
	),
	'Delete file - Course local file test' => array(
		'expected-output' => '{"debug":"The file was deleted.","gfiles":[],"lfiles":[],"access":true,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
		'service' => 'fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'cid' => '2',
			'coursevers' => '97732',
			'opt' => 'DELFILE',
			'fid' => '43',
			'cid' => '2',
			'coursevers' => '97732',
			'filename' => 'test.png',
			'kind' => '3',
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
			'debug',
			'gfiles',
			'lfiles',
			'access',
			'studentteacher',
			'superuser',
			'waccess',
			'supervisor'
		)),
	),
	'Delete file - Course version local file test' => array(
		'expected-output' => '{"debug":"The file was deleted.","gfiles":[],"lfiles":[],"access":true,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
		'service' => 'fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'cid' => '2',
			'coursevers' => '97732',
			'opt' => 'DELFILE',
			'fid' => '49',
			'cid' => '2',
			'coursevers' => '97732',
			'filename' => 'testJS.js',
			'kind' => '4',
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
			'debug',
			'gfiles',
			'lfiles',
			'access',
			'studentteacher',
			'superuser',
			'waccess',
			'supervisor'
		)),
	)

	// Part of 'Retrieve Infromation' for the service, unnecessary
	// 'Retrieve file path test' => array( // UNFINISHED
	// 	'expected-output' => '',
	// 	'service' => 'fileedservice.php',
	// 	'service-data' => serialize(array( // Data that service needs to execute function
	// 		'username' => 'brom',
	// 		'password' => 'password',
	// 		'fid' => 1,
	// 		'expectedPath' => '' // path to file
	// 	)),
	// 	'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
	// 	)),
	// )
		// Don't need to test logging
	// 'Logging service events test' => array( // I think that this one isn't necessary
	// 	'expected-output' => '{"entries":[],"debug":"NONE!","gfiles":[],"lfiles":[],"access":false,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
	// 	'service' => 'fileedservice.php',
	// 	'service-data' => serialize(array( // Data that service needs to execute function
	// 		'username' => 'brom',
	// 		'password' => 'password',
	// 		'log_uuid' => '123',
	// 		'user_id' => '1',
	// 		'script_name' => 'fileedservice.php',
	// 		'event_type' => 'EventTypes::ServiceServerStart',
	// 		'info' => 'DELFILE 123 2023-00-00 1 test.txt 2'
			
	// 	)),
	// 	'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
	// 		'entries',
	// 		'debug',
	// 		'gfiles',
	// 		'lfiles',
	// 		'access',
	// 		'studentteacher',
	// 		'supeuser',
	// 		'waccess',
	// 		'supervisor'
	// 	)),
	// ),



);

testHandler($testsData, true);
