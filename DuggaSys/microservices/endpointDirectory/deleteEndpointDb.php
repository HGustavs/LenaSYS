<?php
$dbFile = 'endpointDirectory_db.sqlite';

if (file_exists($dbFile)) {
    unlink($dbFile);
    echo "Database deleted.";
} else {
    http_response_code(404);
    echo "Database file not found.";
}
?>