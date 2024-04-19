<?php

// This microservice is used to retrieve a username from a specific userid (uid) 

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/basic.php";
include_once "../Shared/sessions.php";


// Connect to database and start session
pdoConnect();
session_start();


// Gets username based on uid
$query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query->execute();


if(checklogin() == true){
	while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
		$username = $row['username'];
	}
}

?>