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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['tableInfo'])) {
        $tableInfo = json_decode($_POST['tableInfo'], true);
    }
    if (isset($_POST['duggaFilterOptions'])) {
        $duggaFilterOptions = json_decode($_POST['duggaFilterOptions'], true);
    }
}

// Prepare return array
$returnArray = array(
    'tableInfo' => $tableInfo,
    'duggaFilterOptions' => $duggaFilterOptions
);

// Send back as JSON
header('Content-Type: application/json');
echo json_encode($returnArray);
?>