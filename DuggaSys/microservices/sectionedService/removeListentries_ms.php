<?php

date_default_timezone_set("Europe/Stockholm");

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include('../shared_microservices/getUid_ms.php');

pdoConnect();
session_start();

$lid=getOP('lid');

// The code for modification using sessions

$query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
$query->bindParam(':lid', $sectid);

if(!$query->execute()) {
  if($query->errorInfo()[0] == 23000) {
    $debug = "The item could not be deleted because of a foreign key constraint.";
  } else {
    $debug = "The item could not be deleted.";
  }
}

echo json_encode(array('lid' => $sectid, 'debug' => $debug));

return;

?>