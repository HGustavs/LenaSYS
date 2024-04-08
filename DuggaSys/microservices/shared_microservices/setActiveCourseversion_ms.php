<?php
  date_default_timezone_set ("Europe/Stockholm");
  //Bacis application services
  include_once "../../../Shared/basic.php";
  include_once "../../../Shared/sessions.php";
  include_once "../shared_microservices/getUid_ms.php";
  include_once "../shared_microservices/updateTableCourse.php";

  //connect to database and start session
  pdoConnect();
  session_start();

  //global variables
  $cid = hetOP('cid');
  $versid = getOP ('versid');
  $makeActive = getOP('makeActive');

  getUid();

  if ($makeActive == 3){
    //update the active version using the updateTableCourse service
    $updateData = array(
      'activeversion' => $versid  //data to update
    );

    $updateCondition = array(
      'cid' => $cid  //condition to identify the course
    );
    
    //call the updateTableCourse service
    $updateResult = updateTableCourse ($updateData,$updateCondition);

    if (!$updateResult){
      $debug = "Error updating entries";  //Handle updates faliure
      
    }
  }
?>