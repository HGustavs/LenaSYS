<?php
$logginDataJSON = file_get_contents("php://input"); // JSON string from dugga.js

// Write to file
$fp = fopen('logging.json', 'w');
fwrite($fp, $logginDataJSON);
fclose($fp);

echo json_encode(['success wirting to log file'=>true]);

?>