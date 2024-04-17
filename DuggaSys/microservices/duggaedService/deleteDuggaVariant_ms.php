<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

pdoConnect();
session_start();

$opt=getOP('opt');
$vid=getOP('vid');

if(strcmp($opt,"DELVARI")===0){
    $query = $pdo->prepare("DELETE FROM userAnswer WHERE variant=:vid;");
    $query->bindParam(':vid', $vid);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating user".$error[2];
    }

    $query = $pdo->prepare("DELETE FROM variant WHERE vid=:vid;");
    $query->bindParam(':vid', $vid);

    if(!$query->execute()) {
        $error=$query->errorInfo();
        $debug="Error updating user".$error[2];
    }
}
?>
