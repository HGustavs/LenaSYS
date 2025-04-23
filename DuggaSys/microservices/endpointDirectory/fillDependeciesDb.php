<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// path to the dependencies markdown file
$mdFile = realpath(__DIR__ . '/../Microservices_inverse_dependencies.md');
if (!file_exists($mdFile)) {
    die("Dependency markdown file not found.");
}

echo $mdFile;

// connect to the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// clear previous dependencies
// $db->exec("DELETE FROM dependencies");

$content = file_get_contents($mdFile);
$lines = explode("\n", $content);

echo "<pre>";
echo print_r($lines);
echo "</pre>";

?>