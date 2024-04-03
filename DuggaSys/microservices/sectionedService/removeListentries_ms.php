<?php

date_default_timezone_set("Europe/Stockholm");

include ('../../../Shared/sessions.php');
include_once "../../../Shared/basic.php";
include('../shared_microservices/getUid_ms.php');

pdoConnect();
session_start();

$sectid=getOP('lid');

echo($sectid);

$query = $pdo->prepare("UPDATE listentries SET visible = '3' WHERE lid=:lid");
$query->bindParam(':lid', $sectid);

if(!$query->execute()) {
    if($query->errorInfo()[0] == 23000) {
        $debug = "foreign key constraint.";
    } else {
        $debug = "Error.";
    }
}

?>
