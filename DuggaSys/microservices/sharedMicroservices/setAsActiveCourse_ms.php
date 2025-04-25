<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../HelperFunction_ms.php";

pdoConnect();
session_start();

$data = recievePost(['cid', 'vers']);

$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
$query->bindParam(':cid', $data['cid']);
$query->bindParam(':vers', $data['vers']);

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error updating entries\n" . $error[2];
    echo json_encode($debug);
}
