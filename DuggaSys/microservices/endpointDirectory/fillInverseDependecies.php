<?php
// select where to create the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';

// create or open the database
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);



?>