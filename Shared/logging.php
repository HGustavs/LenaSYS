<?php
$logginDataJSON = file_get_contents("php://input"); // JSON string from dugga.js

$logFileName = "log.json"
$latestLogFileName = "latestlog.json"

// Write to log file
$fileContent = file_get_contents(logFileName);
$fileContentArray = json_decode($fileContent);
array_push($fileContentArray, $logginDataJSON);
$newJSONData = json_encode($fileContentArray);
file_put_contents(logFileName, $newJSONData);

// Write latest log
file_put_contents(latestLogFileName, $logginDataJSON);

echo json_encode(['success writing to log file'=>true]);

?>