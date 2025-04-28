<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// path to the database file
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';

// remove old database if it exists
if (file_exists($dbFile)) {
    unlink($dbFile);
    echo "Old database removed.<br>";
}

// create a new database
require_once __DIR__ . '/installEndpointDb.php';

// fill database with microservice documentation
require_once __DIR__ . '/fillEndpointDb.php';

// fill database with dependencies documentation
require_once __DIR__ . '/fillDependenciesDb.php';

?>