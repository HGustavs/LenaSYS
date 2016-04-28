<?php 
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
// Connect to database and start session
pdoConnect();
session_start();

$option = getOP('option');
$value = getOP('value');

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(isset($_SESSION['uid']) && checklogin() && isSuperUser($_SESSION['uid')){
	if(isset($option)){
		switch($option){
			case 'mousemoveLogging':
				setMouseMoveOption();
				break;
			case 'fourthRound':
				function()
				break;
		}
	}
} else {
	die('access denied');
}

function setMouseMoveOption(){
	$query = $pdo->prepare("UPDATE options SET value = :value WHERE option = :option");
	$query->bindParam(':value', $value);
	$query->bindParam(':option', $option);
	$query->execute();
}
?>
