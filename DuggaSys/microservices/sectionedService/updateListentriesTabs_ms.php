<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session.
pdoConnect();
session_start();

$opt=getOP('opt');
$sectid=getOP('lid');
$tabs=getOP('tabs');

if(strcmp($opt,"UPDATETABS")===0){
    $query = $pdo->prepare("UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;");
    $query->bindParam(':lid', $sectid);
    $query->bindParam(':tabs',$tabs);

    if(!$query->execute()){
        $error=$query->errorInfo();
        $debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
    }
}
