<?php

include_once("../../../Shared/basic.php");
include_once("../../../Shared/sessions.php");

session_start();

// Test data
$data = array(
    'log_uuid' => 'rhahC0YLOLqby9N',
    'userid' => '1234',
    'eventType' => 18,
    'service' => 'courseedservice.php',
    'info' => 'opt=NEW&coursename=teeeee&coursecode=te123t&log_uuid=eFPdYgx1WzOK6rz',
    'timestamp' => null,
);

$url = 'http://localhost/LenaSYS/DuggaSys/microservices/shared_microservices/logServiceEvent_ms.php';
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
if ($response === false) {
    echo "Failed curl request";
}else{
	echo "POST REQUEST WAS PERFORMED";
	echo $response;
}
curl_close($ch);

?>


