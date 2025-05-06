<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "processDuggaFile_ms.php";

pdoConnect();
session_start();

$moment = $_POST['moment'] ?? "UNK";
$courseid = $_POST['courseid'] ?? "UNK";
$hash = $_POST['hash'] ?? "UNK";
$password = $_POST['password'] ?? "UNK";
$coursevers = $_POST['coursevers'] ?? "UNK";
$duggaid = $_POST['duggaid'] ?? "UNK";
$opt = $_POST['opt'] ?? "UNK";

$debug = "NONE!";
$variant = "UNK";
$answer = "UNK";
$variantanswer = "UNK";
$param = "{}";
$link = "UNK";
$duggatitle = "UNK";
$duggainfo = ['deadline' => 'UNK', 'qrelease' => 'UNK'];

$isTeacher = isSuperUser($_SESSION["uid"] ?? "") ? 1 : 0;

// Try loading data from userAnswer
if ($hash !== "UNK" && $password !== "UNK") {
    $sql = "SELECT vid, variant.variantanswer, useranswer, param, cid, vers, quiz 
            FROM userAnswer 
            LEFT JOIN variant ON userAnswer.variant = variant.vid 
            WHERE hash = :hash AND password = :password";
    $query = $pdo->prepare($sql);
    $query->bindParam(':hash', $hash);
    $query->bindParam(':password', $password);
    $query->execute();

    foreach ($query->fetchAll() as $row) {
        $variant = $row['vid'] ?? "UNK";
        $answer = $row['useranswer'] ?? "UNK";
        $variantanswer = $row['variantanswer'] ?? "UNK";
        $param = html_entity_decode($row['param']);
        $courseid = $row['cid'];
        $coursevers = $row['vers'];
        $duggaid = $row['quiz'];
    }

    if ($variant !== "UNK") {
        $_SESSION["submission-$courseid-$coursevers-$duggaid"] = $hash;
        $_SESSION["submission-password-$courseid-$coursevers-$duggaid"] = $password;
        $_SESSION["submission-variant-$courseid-$coursevers-$duggaid"] = $variant;
        $link = "http://" . $_SERVER['HTTP_HOST'] . "/sh/?s=$hash";

        processDuggaFiles($pdo, $courseid, $coursevers, $duggaid, $duggainfo, $moment);
    } else {
        $debug = "[Guest] Could not load dugga! Invalid hash/password.";
    }
} else {
    $debug = "[Guest] Missing hash/password.";
}

header('Content-Type: application/json');
echo json_encode([
    "debug" => $debug,
    "param" => $param,
    "answer" => $answer,
    "danswer" => $variantanswer,
    "hash" => $hash,
    "hashpwd" => $password,
    "duggaTitle" => $duggatitle,
    "opt" => $opt,
    "variant" => $variant,
    "deadline" => $duggainfo['deadline'],
    "release" => $duggainfo['qrelease'],
    "link" => $link,
    "isTeacher" => $isTeacher
]);
