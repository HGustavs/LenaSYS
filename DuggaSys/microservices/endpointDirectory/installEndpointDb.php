<?php
// select where to create the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';

// create or open the database
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$db->exec("CREATE TABLE IF NOT EXISTS microservices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ms_name TEXT NOT NULL,
    description TEXT,
    calling_methods TEXT,
    output TEXT,
    output_type TEXT,
    output_description TEXT,
    microservices_used TEXT
);");

// this one to many relationship between microservices and parameter exists since a microservice can have multiple parameters
$db->exec("CREATE TABLE IF NOT EXISTS parameters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    microservice_id INTEGER NOT NULL,
    parameter_name TEXT,
    parameter_type TEXT,
    parameter_description TEXT,
    FOREIGN KEY (microservice_id) REFERENCES microservices(id)
);");

$db->exec("CREATE TABLE IF NOT EXISTS dependencies (
    microservice_id INTEGER NOT NULL,
    depends_on TEXT NOT NULL,
    FOREIGN KEY (microservice_id) REFERENCES microservices(id),
    FOREIGN KEY (depends_on) REFERENCES microservices(ms_name)
);");

echo "Database has been created";

?>