<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid = "student";		
}

$hash = getOP('hash');
$moment = getOP('moment');

// === Replace the include with a cURL call to the microservice ===
$baseURL = "http://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/DuggaSys/microservices/showDuggaService/retrieveShowDuggaService_ms.php";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
	'hash' => $hash,
	'moment' => $moment
]));

$response = curl_exec($ch);
curl_close($ch);

// === Output the response as JSON ===
header("Content-Type: application/json");
echo $response;
