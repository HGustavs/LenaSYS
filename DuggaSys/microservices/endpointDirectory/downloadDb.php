<?php

// path to the databasefile
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';

if (file_exists($dbFile)) {
    // inform browser that that this is a file transfer and not a website
    header('Content-Description: File Transfer');
    header('Content-Type: application/octet-stream');
    // download as a file and give it the basename 
    header('Content-Disposition: attachment; filename="' . basename($dbFile) . '"');
    // dont cache the answer to get the latest version every time
    header('Expires: 0');
    header('Cache-Control: must-revalidate');
    header('Pragma: public');
    // tell browser the size of the file
    header('Content-Length: ' . filesize($dbFile));
    // read file content and send to browser
    readFile($dbFile);
    exit;
} else {
    echo "Database not found";
}

?>