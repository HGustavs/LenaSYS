<?php
// This microservice is used to retrieve a username from a specific userid (uid) 

include_once "getUid_ms.php";

function retrieveUsername($pdo)
{
	date_default_timezone_set("Europe/Stockholm");

	$userid = getUid();

	$query = $pdo->prepare("SELECT username FROM user WHERE uid = :uid");
	$query->bindParam(':uid', $userid);
	$query->execute();

	if (checklogin() == true) {
		while ($row = $query->fetch(PDO::FETCH_ASSOC)) {
			$username = $row['username'];
		}
	}

	return $username;
}
