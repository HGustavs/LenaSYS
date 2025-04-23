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

// this table will document inverse dependecies that microservies has
$db->exec("CREATE TABLE IF NOT EXISTS dependencies (
    microservice_id INTEGER NOT NULL,
    depends_on TEXT NOT NULL,
    FOREIGN KEY (microservice_id) REFERENCES microservices(id)
    -- there can't be a foreign key before the documentation for the microservies has been created
    -- so for now the name has to be inserted, but later, the best way will be to insert the id of the ms that the ms is depending on
    -- example below
    -- depends_on INTEGER NOT NULL,
    -- FOREIGN KEY (depends_on) REFERENCES microservices(id)
);");

echo "Database has been created";

?>