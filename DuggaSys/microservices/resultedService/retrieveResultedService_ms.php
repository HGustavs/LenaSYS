<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

pdoConnect();
session_start();

// Receive data from POST
$tableInfo = [];
$duggaFilterOptions = [];
$data = recieveMicroservicePOST(['tableInfo', 'duggaFilterOptions']);
$tableInfo = json_decode($data['tableInfo'], true);
$duggaFilterOptions = json_decode($data['duggaFilterOptions'], true);

// Prepare return array
$returnArray = array(
    'tableInfo' => $tableInfo,
    'duggaFilterOptions' => $duggaFilterOptions
);

// Send back as JSON
header('Content-Type: application/json');
echo json_encode($returnArray);
?>