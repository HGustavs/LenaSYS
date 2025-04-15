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
    description TEXT NOT NULL,
    parameter TEXT,
    parameter_type TEXT.
    parameter_description TEXT,
    calling_methods TEXT,
    output TEXT,
    output_type TEXT,
    output_description TEXT,
    microservices_used TEXT
    )
");

echo "Database has been created";

?>