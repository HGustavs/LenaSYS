<?php

// connect to the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// clear previous data
$db->exec("DELETE FROM microservices");

// points to microservice folder
$basePath = realpath(__DIR__ . '/../');
// points to project root
$rootPath = realpath($basePath . '/../');

$services = scandir($basePath);

foreach ($services as $serviceName) {
    $servicePath = $basePath . '/' . $serverName;

    echo $servicePath . " = " . $serviceName . "<br>";

    if ($serviceName === '.' || $serviceName === '..') {
        continue;
    }
    if (!is_dir($servicePath)) {
        continue;
    }

    // search for .php and .js files 
    $files = scandir($servicePath);
    foreach ($files as $file) {

    }


}

?>