<?php

//---------------------------------------------------------------------------------------------------------------
// logservice - Contains ajax calls for logging
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";

// Connect to database and start session
pdoConnect();
session_start();

// Decode json input data and run the corresponding log function
$json = json_decode(file_get_contents('php://input'), true);

if (!is_null($json) && isset($json['log']) && isset($json['data'])) {
	switch ($json['log']) {
		case 'click':
			logClick($json['data']);
			break;
		case 'mousemove':
			logMousemove($json['data']);
			break;
	}                                                      
}

function logClick($data) {
	logClickEvent(json_encode($data));
}

function logMousemove($data) {
	var_dump($data);
	logMousemoveEvent($data['page'],$data['mouseX'],$data['mouseY']);
}
?>