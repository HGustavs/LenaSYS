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

// Prepare the SQL statement
$query = $pdo->prepare("INSERT INTO variant(quizID,creator,disabled,param,variantanswer) VALUES (:qid,:uid,:disabled,:param,:variantanswer)");

// Bind parameters
$query->bindParam(':qid', $qid);
$query->bindParam(':uid', $uid);
$query->bindParam(':disabled', $disabled);
$query->bindParam(':param', $param);
$query->bindParam(':variantanswer', $variantanswer);

// Execute the query
if ($query->execute()) {
  // Data successfully inserted into the Variant table
  echo "Data successfully inserted into the Variant table.";
} else {
  // Error occurred during insertion
  $error = $query->errorInfo();
  echo "Error: " . $error[2];
}

//????echo json_encode(retrieveCourseedService($pdo, $ha, $debug, $writeAccess, $LastCourseCreated));

?>