<?php
include "../../Shared/test.php";
include_once "../../../coursesyspw.php";

$testsData = array(
	'Delete file test' => array(
		'expected-output' => '{"entries":[],"debug":"NONE!","gfiles":[],"lfiles":[],"access":false,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
		'service' => 'cms.webug.se/root/G2/students/b21kurar/LenaSYS/DuggaSys/fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'cid' => '1234',
			'opt' => 'DELFILE',
			'coursevers' => 'test',
			'coursename' => 'test.txt',
			'kind' => 1,
			'fid' => 1,
			'contents' => ''
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
			'entries',
			'debug',
			'gfiles',
			'lfiles',
			'access',
			'studentteacher',
			'supeuser',
			'waccess',
			'supervisor'
		)),
	),
	'Save file test' => array(
		'expected-output' => '{"entries":[],"debug":"NONE!","gfiles":[],"lfiles":[],"access":false,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
		'service' => 'cms.webug.se/root/G2/students/b21kurar/LenaSYS/DuggaSys/fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'opt' => 'SAVEFILE',
			'filename' => 'testfilename',
			'filesize' => 'test',
			'kindid' => '2',
			'vers' => 'testvers',
			'cid' => '' // value from previous query
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
			'entries',
			'debug',
			'gfiles',
			'lfiles',
			'access',
			'studentteacher',
			'supeuser',
			'waccess',
			'supervisor'
		)),
	),

	'Retrieve file path test' => array( // UNFINISHED
		'expected-output' => '',
		'service' => 'cms.webug.se/root/G2/students/b21kurar/LenaSYS/DuggaSys/fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'fid' => 1,
			'expectedPath' => '' // path to file
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
		)),
	),

	'Logging service events test' => array( // I think that this one isn't necessary
		'expected-output' => '{"entries":[],"debug":"NONE!","gfiles":[],"lfiles":[],"access":false,"studentteacher":false,"superuser":true,"waccess":false,"supervisor":false}',
		'service' => 'cms.webug.se/root/G2/students/b21kurar/LenaSYS/DuggaSys/fileedservice.php',
		'service-data' => serialize(array( // Data that service needs to execute function
			'username' => 'brom',
			'password' => 'password',
			'log_uuid' => '123',
			'user_id' => '1',
			'script_name' => 'fileedservice.php',
			'event_type' => 'EventTypes::ServiceServerStart',
			'info' => 'DELFILE 123 2023-00-00 1 test.txt 2'
			
		)),
		'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
			'entries',
			'debug',
			'gfiles',
			'lfiles',
			'access',
			'studentteacher',
			'supeuser',
			'waccess',
			'supervisor'
		)),
	),

);

testHandler($testsData, false);
