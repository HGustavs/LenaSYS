<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// path to the dependencies markdown file
$mdFile = realpath(__DIR__ . '/../Microservices_inverse_dependencies.md');
if (!file_exists($mdFile)) {
    die("Dependency markdown file not found.");
}

// connect to the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// clear previous dependencies
$db->exec("DELETE FROM dependencies");

$content = file_get_contents($mdFile);
$lines = explode("\n", $content);

$currentMicroservice = null;

// loop through the lines
foreach ($lines as $line) {
    $trimmedLine = trim($line);

    // header for a microservice has ###
    if (preg_match('/^### (.+)/', $trimmedLine, $match)) {
        $currentMicroservice = $match[1];
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

        // normalize the names to always have the correct format
        $searchNameCurrent = normalizeMsName($currentMicroservice);
        $searchNameDepends = normalizeMsName($dependsOnName);

        // get id for current microservice
        $stmt = $db->prepare("SELECT id FROM microservices WHERE ms_name = ?");
        $stmt->execute([$searchNameCurrent]);
        $microserviceId = $stmt->fetchColumn();

        // get id for the microservice that is depended on
        $stmt = $db->prepare("SELECT id FROM microservices WHERE ms_name = ?");
        $stmt->execute([$searchNameDepends]);
        $dependsOnId = $stmt->fetchColumn();

        // insert wether id is found or not
        $stmt = $db->prepare("
            INSERT INTO dependencies (microservice_id, depends_on_id, ms_name, depends_on, path)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $microserviceId ?: null, // null if none was found
            $dependsOnId ?: null,
            $currentMicroservice,
            $dependsOnName,
            $dependsOnPath
        ]);

    }

}

function normalizeMsName($name) {
    // if name already ends with '_ms.php' return
    if (str_ends_with($name, '_ms.php')) {
        return $name;
    }
    // otherwise, add '_ms.php'
    return $name . '_ms.php';
}

echo "Dependencies inserted.<br>";

?>