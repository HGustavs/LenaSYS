<?php
//---------------------------------------------------------------------
// createDuggaVariant_ms.php - Used for creating a variant for a dugga.
//---------------------------------------------------------------------

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

date_default_timezone_set("Europe/Stockholm");

pdoConnect();
session_start();

// Global variables
$opt = getOP('opt');
$qid = getOP('qid');
$disabled = getOP('disabled');
$param = getOP('parameter');
$answer = getOP('variantanswer');
$cid = getOP('cid');
$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");

if (!(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess($userid, $cid, 'st'))))
    return;

if (!(strcmp($opt, "ADDVARI") === 0))
    return;

$querystring = "INSERT INTO variant(quizID, creator, disabled, param, variantanswer) VALUES (:qid, :uid, :disabled, :param, :variantanswer)";
$stmt = $pdo->prepare($querystring);
$stmt->bindParam(':qid', $qid);
$stmt->bindParam(':uid', $userid);
$stmt->bindParam(':disabled', $disabled);
$stmt->bindParam(':param', $param);
$stmt->bindParam(':variantanswer', $answer);

if (!$stmt->execute()) {
    $error = $stmt->errorInfo();
    $debug = "Error updating entries" . $error[2];
}

include_once("retrieveDuggaedService_ms.php");
$log_uuid=getOP('log__uuid');
$coursevers = getOP('coursevers');
$retrievedData = retrieveDuggaedService($pdo, $debug, $userid, $cid, $coursevers, $log_uuid);
echo json_encode($retrievedData);
