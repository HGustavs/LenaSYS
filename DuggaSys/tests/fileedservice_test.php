<?php
	include "../../Shared/test.php";
 
	$testsData = array(
		'create course test' => array(
			'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
			'service' => 'localhost/LenaSYS/DuggaSys/courseedservice.php',
			'service-data' => serialize(array( // Data that service needs to execute function
				'opt' => 'NEW',
				'username' => 'usr',
				'password' => 'pass',
				'coursecode' => 'IT466G',
				'coursename' => 'TestCourseFromAPI4',
				'uid' => '101'
			)),
			'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
				'debug',
				'readonly'
			)),
		),
		'create course test 2' => array(
			'expected-output' => '{"debug":"NONE!","motd":"UNK"}',
			'service' => 'localhost/LenaSYS/DuggaSys/courseedservice.php',
			'service-data' => serialize(array( // Data that service needs to execute function
				'opt' => 'NEW',
				'username' => 'usr',
				'password' => 'pass',
				'coursecode' => 'IT466G',
				'coursename' => 'TestCourseFromAPI5',
				'uid' => '101'
			)),
			'filter-output' => serialize(array( // Filter what output to use in assert test, use none to use all ouput from service
				'none'
			)),
		),
	);
	 
	testHandler($testsData, false);





?>