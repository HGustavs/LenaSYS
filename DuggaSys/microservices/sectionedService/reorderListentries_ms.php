<?php
  date_default_timezone_set("Europe/Stockholm");

  include_once "../../../Shared/sessions.php";
  include_once "../../../Shared/basic.php";
  include_once "../shared_microservices/getUid_ms.php";

  pdoConnect();
  session_start();

  //Get the necessary parameters from the request
  $courseid = getOP('courseid');
  $coursevers = getOP('coursevers');
  $pos = getOP('pos');
  $moment = getOP('moment');
  $order = getOP('order');
  $lid = getOP('lid');
  $opt = getOP('opt');

  //Call the updateTableListentries service to update the pos & moment columns

  //the query
  $query = $pdo->prepare("UPDATE listentries set pos=:pos,moment=:moment WHERE lid=:lid;");

  //from sectionedservice.php
  if(strcmp($opt,"REORDER")===0) {
  $orderarr=explode(",",$order);

    foreach ($orderarr as $key => $value) {
      $armin=explode("XX",$value);
      $query->bindParam(':lid', $armin[1]);
      $query->bindParam(':pos', $armin[0]);
      $query->bindParam(':moment', $armin[2]);        

      if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating entries".$error[2];
      }
    }
  }

  echo json_encode(array('courseid' => $courseid, 'coursevers' => $coursevers, 'pos' => $pos, 'moment' => $moment, 'debug' => $debug));
  return;