<?php
header('Content-Type: text/plain');

// Get parameters
$serviceName = $_GET['name'] ?? '';
$renderMode = $_GET['render'] ?? 'md';

// Check if service name was entered
if (empty($serviceName)) {
    die("Please specify a service name with ?name=service_name");
}

$db = new PDO('sqlite:endpointDirectory_db.sqlite');
$query = $db->prepare("SELECT * FROM microservices WHERE ms_name = ?");
$query->execute([$serviceName]);
$service = $query->fetch();

// Invalid service
if (!$service) {
    die("Service not found");
}

// Load file
$markdown = file_get_contents('testMarkDownFile.md');
echo $markdown;  // Returns raw md
?>