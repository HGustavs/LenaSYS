<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";

// Connect to database and start session
pdoConnect();
session_start();

if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
	$loginname=$_SESSION['loginname'];
	$lastname=$_SESSION['lastname'];
	$firstname=$_SESSION['firstname'];
}else{
	$userid = "student";		
}

$array = array(
    'variant' => $variant,
    'answer' => $answer,
    'variantanswer' => $variantanswer,
    'param' => $param,
    'newcourseid' => $newcourseid,
    'newcoursevers' => $newcoursevers,
    'newduggaid' => $newduggaid
);

header('Content-Type: application/json');
echo json_encode($array);
