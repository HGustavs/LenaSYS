<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

pdoConnect(); // Connect to database and start session
session_start();

$opt = getOP('opt');
$courseid = getOP('courseid');
$coursevers = getOP('coursevers');
$duggaid = getOP('did');
$moment = getOP('moment');
$hash = getOP('hash');
$hashpwd = getOP('password');

// fallback from session/post
if ($courseid !== "UNK" && $coursevers !== "UNK" && $duggaid !== "UNK" && $moment !== "UNK") {
    if (isset($_POST["submission-$courseid-$coursevers-$duggaid-$moment"])) {
        $hash = $_POST["submission-$courseid-$coursevers-$duggaid-$moment"];
        $hashpwd = $_POST["submission-password-$courseid-$coursevers-$duggaid-$moment"];
    } else if (isset($_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"])) {
        $hash = $_SESSION["submission-$courseid-$coursevers-$duggaid-$moment"];
        $hashpwd = $_SESSION["submission-password-$courseid-$coursevers-$duggaid-$moment"];
    }
}

header("Content-Type: application/json");
$baseURL = "http://" . $_SERVER['HTTP_HOST'];
$url = $baseURL . "/LenaSYS/DuggaSys/microservices/showDuggaService/retrieveShowDuggaService_ms.php";

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'moment' => $moment,
    'courseid' => $courseid,
    'hash' => $hash,
    'password' => $hashpwd,
    'coursevers' => $coursevers,
    'duggaid' => $duggaid,
    'opt' => $opt
]));

$response = curl_exec($ch);
curl_close($ch);
echo $response;
