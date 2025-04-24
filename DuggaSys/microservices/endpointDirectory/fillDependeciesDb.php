<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// path to the dependencies markdown file
$mdFile = realpath(__DIR__ . '/../Microservices_inverse_dependencies.md');
if (!file_exists($mdFile)) {
    die("Dependency markdown file not found.");
}

// echo $mdFile;

// connect to the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// clear previous dependencies
// $db->exec("DELETE FROM dependencies");

$content = file_get_contents($mdFile);
$lines = explode("\n", $content);

// echo "<pre>";
// echo print_r($lines);
// echo "</pre>";

$currentMicroservice = null;

// loop through the lines
foreach ($lines as $line) {
    $trimmedLine = trim($line);

    // header for a microservice has ###
    if (preg_match('/^### (.+)/', $trimmedLine, $match)) {
        $currentMicroservice = $match[1];
        // echo $currentMicroservice . "<br>";
        continue;
    }

    // skip those containing "None"
    if (strtolower($trimmedLine === "none") || $trimmedLine === '') {
        continue;
    }

    // when reaching a valid dependency row
    if ($currentMicroservice !== null && preg_match('/^- (.+)/', $trimmedLine, $match)) {
        // it will look something like this, ex: accessedService/addClass_ms.php
        $dependsOnPath = trim($match[1]);

        // some documentation uses \, replace these with / if they are used
        $normalizedPath = str_replace('\\', '/', $dependsOnPath);

        // get the filename without extension as the name for the microservice
        $fileName = basename($normalizedPath);

        // remove .php if it exists, otherwise use the name
        if (str_ends_with($fileName, '.php')) {
            $dependsOnName = preg_replace('/\.php$/', '', $fileName);
        } else {
            $dependsOnName = $fileName;
        }

        // insert into database 
        // TODO: Fix so it insert with ID instead
        $stmt = $db->prepare("
            INSERT INTO dependencies (ms_name, depends_on)
            VALUES (?, ?)
        ");
        $stmt->execute([
            $currentMicroservice,
            $dependsOnName
        ]);

        echo "Added: " . $currentMicroservice . " depends on: " . $dependsOnName . "<br>";
        // echo $currentMicroservice . " depends on: " . $dependsOnName . " (filepath: " . $dependsOnPath . "<br>";
    }

}

?>