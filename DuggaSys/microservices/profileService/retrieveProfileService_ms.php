<?php

function pg($name, $default = null) {
    return $_POST[$name] ?? $_GET[$name] ?? $default;
}

$successRaw = pg('success', false);                 
$success     = filter_var($successRaw);
$status      = pg('status', '');
$debug       = pg('debug',  '');

function retrieveProfileService($debug, $success, $status){
	$array = array(
        "success" => $success,
        "status" => $status,
        "debug" => $debug
		);
    return $array;
}

$response = retrieveProfileService($debug, $success, $status);

header('Content-Type: application/json');
echo json_encode($response);
exit;
