<?php

function retrieveProfileService($debug, $success, $status){
	$array = array(
        "success" => $success,
        "status" => $status,
        "debug" => $debug
		);
    return $array;
}