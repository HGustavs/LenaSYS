<?php 
date_default_timezone_set("Europe/Stockholm");
// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
// Connect to database and start session
pdoConnect();
session_start();

$label = getOP('label');
$value = getOP('value');

$debug="NONE!";	

//------------------------------------------------------------------------------------------------
// Services
//------------------------------------------------------------------------------------------------
if(isset($_SESSION['uid']) && checklogin() && isSuperUser($_SESSION['uid'])){
	if(isset($label)){
		$query = $pdo->prepare("UPDATE options SET value = :value WHERE label = :label");
		$query->bindParam(':value', $value);
		$query->bindParam(':label', $label);
		$query->execute();
		echo json_encode(array('success' => true));
	}
} else {
	die('access denied');
}

?>
