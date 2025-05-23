<?php
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";
include_once "retrieveAccessedService_ms.php";

date_default_timezone_set("Europe/Stockholm");

pdoConnect();
session_start();

$opt = getOP('opt');
$prop = getOP('prop');
$cid = getOP('courseid');
$uid = getOP('uid');
$firstname = getOP('firstname');
$lastname = getOP('lastname');
$ssn = getOP('ssn');
$username = getOP('user_name');
$className = getOP('className');
$log_uuid = getOP('log_uuid');
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
$debug = "NONE!";

if (!(checklogin() && isSuperUser($userid) == true)) {
    $debug = "Access not granted.";
    $array = retrieveAccessedService($pdo, $debug, $userid, $cid, $log_uuid, $opt, null);
    echo json_encode($array);
    return;
}

if (!(strcmp($opt, "UPDATEUSER") == 0)) {
    $debug = "OPT does not match.";
    $array = retrieveAccessedService($pdo, $debug, $userid, $cid, $log_uuid, $opt, null);
    echo json_encode($array);
    return;
}

switch ($prop) {
    case "firstname":
        $query = $pdo->prepare("UPDATE user SET firstname=:firstname WHERE uid=:uid;");
        $query->bindParam(':firstname', $firstname);
        $query->bindParam(':uid', $uid);
        break;
    case "lastname":
        $query = $pdo->prepare("UPDATE user SET lastname=:lastname WHERE uid=:uid;");
        $query->bindParam(':lastname', $lastname);
        $query->bindParam(':uid', $uid);
        break;
    case "ssn":
        $query = $pdo->prepare("UPDATE user SET ssn=:ssn WHERE uid=:uid;");
        $query->bindParam(':ssn', $ssn);
        $query->bindParam(':uid', $uid);
        break;
    case "username":
        $query = $pdo->prepare("UPDATE user SET username=:username WHERE uid=:uid;");
        $query->bindParam(':username', $username);
        $query->bindParam(':uid', $uid);
        break;
    case "class":
        $query = $pdo->prepare("UPDATE user SET class=:class WHERE uid=:uid;");
        $query->bindParam(':class', $className);
        $query->bindParam(':uid', $uid);
        break;
    default:
        $debug = "Invalid property.";
        $array = retrieveAccessedService($pdo, $debug, $userid, $cid, $log_uuid, $opt, null);
        echo json_encode($array);
        return;
}

if (!$query->execute()) {
    $error = $query->errorInfo();
    $debug = "Error updating entries\n" . $error[2];
}

$array = retrieveAccessedService($pdo, $debug, $userid, $cid, $log_uuid, $opt, null);
echo json_encode($array);
