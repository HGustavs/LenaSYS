<?php

//------------------------------------------------------------------------------------------------
// logUserEvent - Creates a new userbased event in the log.db database.
//------------------------------------------------------------------------------------------------

function logUserEvent($uid, $username, $eventType, $description) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO userLogEntries (uid, username, eventType, description, userAgent, remoteAddress) VALUES (:uid, :username, :eventType, :description, :userAgent, :remoteAddress)');
	$query->bindParam(':uid', $uid);
	$query->bindParam(':username', $username);
	$query->bindParam(':eventType', $eventType);
	$query->bindParam(':description', $description);
	$query->bindParam(':userAgent', $_SERVER['HTTP_USER_AGENT']);
	$query->bindParam(':remoteAddress', $_SERVER['REMOTE_ADDR']);
	$query->execute();
}

?>