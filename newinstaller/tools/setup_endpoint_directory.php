<?php

function setup_endpoint_directory($verbose = false) {
    if ($verbose) {
        SSESender::transmit("Starting setup of endpoint directory...");
    }
    
    ini_set('display_errors', 1);
    error_reporting(E_ALL);

    // path to the database file
    $dbFile = __DIR__ . '/../DuggaSys/microservices/endpointDirectory/endpointDirectory_db.sqlite';
    // create and fill the database using setup script
    require_once __DIR__ . '/../../DuggaSys/microservices/endpointDirectory/setupEndpointDirectory.php';

    if ($verbose) {
        SSESender::transmit("Endpoint directory setup completed.");
    }
}