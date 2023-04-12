<?php
$loggingDataJSON = file_get_contents("php://input"); // JSON string from dugga.js

// Write latest log
$fp = fopen('logging', 'w');
fwrite($fp, $loggingDataJSON);
fclose($fp);

echo json_encode(['success wirting to log file'=>true]);

?>