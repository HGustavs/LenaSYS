<?php
$logginDataJSON = file_get_contents("php://input"); // JSON string from dugga.js

$logFileName = "log.json"
$latestLogFileName = "latestlog.json"

$fileContent = file_get_contents(logFileName);
$fileContentArray = json_decode($fileContent);
array_push($fileContentArray, $logginDataJSON);
$newJSONData = json_encode($fileContentArray);

// Write to all log file
$fp = fopen(logFileName, 'w');
fwrite($fp, $newJSONData);
fclose($fp);

// Write latest log
$fp = fopen(latestLogFileName, 'w');
fwrite($fp, $logginDataJSON);
fclose($fp);


echo json_encode(['success wirting to log file'=>true]);

?>