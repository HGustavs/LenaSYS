<?php

// Open log database and create table if it does not exist
$log_db = new PDO('sqlite:../log.db');
$sql = '
	CREATE TABLE IF NOT EXISTS logEntries (
		id INTEGER PRIMARY KEY,
		eventType INTEGER,
		description TEXT,
		timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
	);
';
$log_db->exec($sql);


//------------------------------------------------------------------------------------------------
// logEvent
//------------------------------------------------------------------------------------------------
//
// Creates a new log entry in the log database (log.db, located at the root directory)
//

function logEvent($eventType, $description) {
	$query = $GLOBALS['log_db']->prepare('INSERT INTO logEntries (eventType, description) VALUES (:eventType, :description)');
	$query->bindParam(':eventType', $eventType);
	$query->bindParam(':description', $description);
	$query->execute();
}


//------------------------------------------------------------------------------------------------
// EventTypes
//------------------------------------------------------------------------------------------------
//
// Contains constants for log event types
//

abstract class EventTypes {
	const DuggaRead = 1;
	const DuggaWrite = 2;
	const LoginSuccess = 3;
	const LoginFail = 4;
}

?>