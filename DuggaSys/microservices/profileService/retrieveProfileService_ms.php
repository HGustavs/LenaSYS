<?php

function retrieveProfileService($debug, $success, $status){
	$array = array(
        "success" => $success,
        "status" => $status,
        "debug" => $debug
		);
    return $array;
}

header("Content-Type: application/json");
echo json_encode($array);
