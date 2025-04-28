<?php
// select where to create the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';

// remove old database if it exists
if (file_exists($dbFile)) {
    unlink($dbFile);
    echo "Removed database";
}

// create the database
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

$db->exec("CREATE TABLE IF NOT EXISTS microservices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ms_name TEXT NOT NULL,
    description TEXT,
    calling_methods TEXT,
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

// this one to many relationship between microservices and outputs exists since a microservice can have multiple outputs
$db->exec("CREATE TABLE IF NOT EXISTS outputs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    microservice_id INTEGER NOT NULL,
    output_name TEXT,
    output_type TEXT,
    output_description TEXT,
    FOREIGN KEY (microservice_id) REFERENCES microservices(id)
);");

// this table will document inverse dependecies that microservies has
$db->exec("CREATE TABLE IF NOT EXISTS dependencies (
    dependency_id INTEGER PRIMARY KEY AUTOINCREMENT, 
    -- microservice_id INTEGER NOT NULL,
    ms_name TEXT NOT NULL,
    depends_on TEXT NOT NULL,
    path TEXT NOT NULL
    -- FOREIGN KEY (microservice_id) REFERENCES microservices(id)
);");

echo "Database has been created";

?>