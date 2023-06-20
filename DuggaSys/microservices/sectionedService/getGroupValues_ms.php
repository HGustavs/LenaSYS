<?php

date_default_timezone_set("Europe/Stockholm");


//se till att det är rätt path
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="guest";
}

$stmt = $pdo->prepare("SELECT groupKind,groupVal FROM `groups`");

if (!$stmt->execute()) {
    $error=$stmt->errorInfo();
    $debug="Error getting groups " . $error[2];
} else {
    foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row){
        if(!isset($groups[$row['groupKind']])){
            $groups[$row['groupKind']]=array();
        }
        array_push($groups[$row['groupKind']],$row['groupVal']);
    }
}

?>