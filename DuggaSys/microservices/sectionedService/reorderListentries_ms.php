<?php
  date_default_timezone_set("Europe/Stockholm");

  include_once "../Shared/sessions.php";
  include_once "../Shared/basic.php";
  include_once "../Shared/microservices/getUid_ms.php";

  pdoConnect();
  session_start();

  //Get the necessary parameters from the request
  $courseid = getOP('courseid');
  $coursevers = getOP('coursevers');
  $pos = getOP('pos');
  $moment = getOP('moment');

  //Call the updateTableListentries service to update the pos & moment columns

  $query = $pdo->prepare("CALL updateTableListentries (:courseid, :coursevers, :pos, :moment)");
  $query->bindParam(':courseid, $courseid');
  $query->bindParam(':coursevers, $coursevers');
  $query->bindParam(':pos, $pos');
  $query->bindParam(':moment, $moment');

  if (!$query->execute()){
    $error = $query->errorInfo();
    $debug = "Error updating entries" . $error[2];
  }

  echo json_encode(array('courseid' => $courseid, 'coursevers' => $coursevers, 'pos' => $pos, 'moment' => $moment, 'debug' => $debug));
  return;
?>