<?php
$loggingDataJSON = file_get_contents("php://input"); // JSON string from dugga.js

if(file_exists('logs/log.json')){
    $fileContent = file_get_contents('log.json');
    $fileArray = json_decode($fileContent);
    $fileArray[] = $loggingDataJSON;
    $fp = fopen('logs/log.json', 'w');
    fwrite($fp, $loggingDataJSON);
    fclose($fp);
    echo json_encode('Updated data in log file');
}
else{
    if(file_put_contents('logs/log.json', $loggingDataJSON)){
        echo json_encode('Added latest log to log file');
    }
}

// Write latest log
$fp = fopen('logs/latestlog.json', 'w');
fwrite($fp, $loggingDataJSON);
fclose($fp);

echo json_encode('success writing to log file');

?>