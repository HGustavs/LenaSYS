<?php
$logginDataJSON = file_get_contents("php://input"); // JSON string from dugga.js
$date = date('d-m-y h:i:s'); // Current clock and time

// Write to file
$fp = fopen('logging.json', 'w');
fwrite($fp, $logginDataJSON);
fclose($fp);

echo json_encode(['success wirting to log file'=>true]);

?>