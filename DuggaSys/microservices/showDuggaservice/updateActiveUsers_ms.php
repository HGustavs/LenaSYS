<?php

include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";

pdoConnect(); // Connect to database and start session
session_start();


$hash=getOP('hash');
$AUtoken=getOP('AUtoken');

$query = $pdo->prepare("SELECT active_users FROM groupdugga WHERE hash=:hash");
	$query->bindParam(':hash', $hash);
	$query->execute();
	$result = $query->fetch();
	$active = $result['active_users'];
	if($active == null){
		$query = $pdo->prepare("INSERT INTO groupdugga(hash,active_users) VALUES(:hash,:AUtoken);");
		$query->bindParam(':hash', $hash);
		$query->bindParam(':AUtoken', $AUtoken);
		$query->execute();
	}else{
		$newToken = (int)$active + (int)$AUtoken;
		$query = $pdo->prepare("UPDATE groupdugga SET active_users=:AUtoken WHERE hash=:hash;");
		$query->bindParam(':hash', $hash);
		$query->bindParam(':AUtoken', $newToken);
		$query->execute();
	}
?>