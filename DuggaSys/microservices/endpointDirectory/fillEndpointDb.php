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

    // extract blocks with regex
    $fields = [
        'ms_name' => '/# MICROSERVICE NAME #\s*(.+)/i',
        'ms_path' => '/# SEARCHPATH #\s*(.+)/i',
        'file_name' => '/# FILENAME #\s*(.+)/i',
        'description' => '/# DESCRIPTION #\s*(.+)/i',
        'parameters' => '/# PARAMETERS #\s*(.+)/i',
        'render' => '/# RENDER #\s*(.+)/i',
    ];

    $values = [];

    foreach ($fields as $key => $regex) {
        if (preg_match($regex, $content, $match)) {
            $values[$key] = trim($match[1]);
        } else {
            // if something is missing
            $values[$key] = null;
        }
    }

    // insert into database
    $stmt = $db->prepare("
        INSERT INTO microservices (ms_name, file_name, ms_path, parameters, documentation, render)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $values['ms_name'],
        $values['file_name'],
        $values['ms_path'],
        $values['parameters'],
        $values['description'],
        $values['render']
    ]);

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