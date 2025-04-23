<?php
header('Content-Type: text/plain');

$search = $_GET['name'] ?? $_GET['description'] ?? $_GET['parameter'] ?? '';
if (empty($search)) {
    die("Please use existing parameter");
}

$db = new PDO('sqlite:endpointDirectory_db.sqlite');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Determine search type and prepare query
if (isset($_GET['name'])) {
    $query = $db->prepare("SELECT * FROM microservices WHERE ms_name = ?");
} elseif (isset($_GET['description'])) {
    $query = $db->prepare("SELECT * FROM microservices WHERE description LIKE ?");
    $search = "%$search%";
} elseif (isset($_GET['parameter'])) {
    $query = $db->prepare("SELECT * FROM microservices WHERE parameters LIKE ?");
    $search = "%$search%";
}

$query->execute([$search]);
$service = $query->fetch(PDO::FETCH_ASSOC);

if (!$service) {
    die("Service not found");
}

// Convert to md
echo "### MICROSERVICE DOCUMENTATION ###\n\n";
foreach ($service as $key => $value) {
    echo "# " . strtoupper($key) . " #\n";
    echo $value . "\n\n";
}
?>
