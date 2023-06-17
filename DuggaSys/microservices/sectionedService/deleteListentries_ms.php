<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../../../../coursesyspw.php";

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$sectid=getOP('lid');

// will be changed to ms
if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="UNK";
}

if(strcmp($opt,"DEL")===0) {
    $query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
    $query->bindParam(':lid', $sectid);

    if(!$query->execute()) {
        if($query->errorInfo()[0] == 23000) {
            $debug = "The item could not be deleted because of a foreign key constraint.";
        } else {
            $debug = "The item could not be deleted.";
        }
    }

}