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
// $rootPath = realpath($basePath . '/../');
$mdFiles = glob($basePath . '/*.md');

// loop through every .md-file
foreach ($mdFiles as $mdFile) {
    $content = file_get_contents($mdFile);

    // check if the markdown file includes correct headline
    if (!preg_match('/### MICROSERVICE DOCUMENTATION ###/', $content)) {
        continue;
    }

}


// $services = scandir($basePath);

// foreach ($services as $serviceName) {
//     $servicePath = $basePath . '/' . $serverName;

//     echo $servicePath . " = " . $serviceName . "<br>";

//     if ($serviceName === '.' || $serviceName === '..') {
//         continue;
//     }
//     if (!is_dir($servicePath)) {
//         continue;
//     }

//     // search for .php and .js files 
//     $files = scandir($servicePath);
//     foreach ($files as $file) {
//         // echo $file . "<br>";
//     }


// }

?>