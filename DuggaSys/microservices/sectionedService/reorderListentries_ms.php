<?php
  date_default_timezone_set("Europe/Stockholm");

  include_once "../Shared/session.php";
  include_once "../Shared/basic.php";
  include_once "../Shared/microservices/getUid_ms.php";

  pdoConnect();
  session_start();
?>