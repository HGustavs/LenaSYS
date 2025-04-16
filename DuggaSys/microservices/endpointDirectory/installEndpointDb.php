<?php
// select where to create the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';

// create or open the database
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$db->exec("
    CREATE TABLE IF NOT EXISTS microservices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ms_name TEXT NOT NULL,
    file_name TEXT NOT NULL,
    ms_path TEXT NOT NULL,
    parameters TEXT NOT NULL,
    description TEXT NOT NULL,
    render TEXT NOT NULL
    )
");

echo "Database has been created";

?>