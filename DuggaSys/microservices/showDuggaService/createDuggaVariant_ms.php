<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include "../shared_microservices/getUid_ms.php";
getUid();

// Connect to database and start session
pdoConnect();
session_start();

function getUid(){
  // Checks user id, if user has none a guest id is set
  if(isset($_SESSION['uid'])){
      $userid=$_SESSION['uid'];
  }else{
      $userid="1";
  }

  $log_uuid = getOP('log_uuid');
  $log_timestamp = getOP('log_timestamp');

  $log_uuid = getOP('log_uuid');
  $info="opt: ".$opt." courseId: ".$courseId." courseVersion: ".$courseVersion." exampleName: ".$exampleName." sectionName: ".$sectionName." exampleId: ".$exampleId;
  logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "getUid_ms.php",$userid,$info);

  return $log_uuid;
}

//Get the necessary parameters from the request
$qid = getOP('qid');
$uid = getOP('uid');
$disabled = getOP('disabled');
$param = getOP('param');
$variantanswer = getOP('variantanswer');

$insertData = array(
  'quizID' => $qid,
  'creator' => $uid,
  'disabled' => $disabled,
  'param' => $param,
  'variantanswer' => $variantanswer
); 

// Service call to insert data into the Variant table
$result = insertIntoTableVariant($insertData);

if ($result['success']) {
  // Data successfully inserted into the Variant table
  echo "Data successfully inserted into the Variant table.";
} else {
  // Error occurred during insertion
  echo "Error: " . $result['message'];
}

//????echo json_encode(retrieveCourseedService($pdo, $ha, $debug, $writeAccess, $LastCourseCreated));

?>