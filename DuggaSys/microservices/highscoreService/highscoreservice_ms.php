<?php 

//---------------------------------------------------------------------------------------------------------------
// Highscoreservice Microservice - Used by highscore system to communicate with the database
//---------------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
//include_once "retrieveHighscoreService_ms.php";

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$courseid=getOP('courseid');
$coursename=getOP('coursename');
$coursevers=getOP('coursevers');
$duggaid=getOP('did');
$variant=getOP('lid');
$moment=getOP('moment');
$hash=getOP("hash");
$userid = getUid();

$debug="NONE!";	

$log_uuid = getOP('log_uuid');
$info="opt: ".$opt." courseid: ".$courseid." coursename: ".$coursename;
logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "highscoreservice.php",$userid,$info);

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------

//Re-engineer
$baseURL = "https://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/DuggaSys/microservices/sectionedService/retrieveHighscoreService_ms.php?" . http_build_query([
    'did' => $duggaid,
    'lid' => $variant
]);

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);
echo json_encode($data);

?>

