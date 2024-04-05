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

?>