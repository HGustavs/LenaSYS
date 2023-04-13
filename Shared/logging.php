<?php
$loggingDataJSON = file_get_contents("php://input"); // JSON string from dugga.js

$latestLogFile = "logs/latestlog.json";
$logFile = "logs/log.json";

// Append log to log file
file_put_contents($logFile, $loggingDataJSON, FILE_APPEND);

// Save latest log
file_put_contents($latestLogFile, $loggingDataJSON);

?>