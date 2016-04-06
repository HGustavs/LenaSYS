<?php

//---------------------------------------------------------------------------------------------------------------
// analytictoolservice - Contains ajax calls for analytic tool
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";

// Connect to database and start session
pdoConnect();
session_start();

if (isset($_SESSION['uid']) && checklogin() && isSuperUser($_SESSION['uid'])) {
	if (isset($_POST['query'])) {
		switch ($_POST['query']) {
			case 'test':
				echo json_encode(array(
					'testdata' => 'kebab'
				));
				break;
		}
	} else {
		echo 'N/A';
	}
} else {
	die('access denied');
}
