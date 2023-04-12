<?php
$logginDataJSON = file_get_contents("php://input"); // json string

$fp = fopen('logging.json', 'w');
fwrite($fp, $logginDataJSON);
fclose($fp);

echo json_encode(['success'=>true]);

?>