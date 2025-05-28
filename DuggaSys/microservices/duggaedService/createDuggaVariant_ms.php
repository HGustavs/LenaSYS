<?php
//---------------------------------------------------------------------
// createDuggaVariant_ms.php - Used for creating a variant for a dugga.
//---------------------------------------------------------------------

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";
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
$userid = getUid();

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

$log_uuid=getOP('log__uuid');
$coursevers = getOP('coursevers');

header('Content-Type: application/json');

$dataToSend = [
  'debug' => $debug,
  'userid' => $userid,
  'cid' => $cid,
  'coursevers' => $coursevers,
  'log_uuid' => $log_uuid
];

echo callMicroservicePOST("duggaedService/retrieveDuggaedService_ms.php", $dataToSend, true);
