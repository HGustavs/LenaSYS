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
$getOption = getOP('getOption');

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

if(isset($getOption)){
	if(isset($_SESSION['uid']) && checklogin() && isSuperUser($_SESSION['uid'])){
		$query = $pdo->prepare("SELECT value FROM options WHERE label = :getOption");
		$query->bindParam(':getOption', $getOption);
		$query->execute();
		echo $query->fetch(PDO::FETCH_ASSOC);
	} else {
		die('access denied');
	}
}
?>