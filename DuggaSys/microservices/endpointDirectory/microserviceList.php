<?php
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// get all microservices
$msQuery = $db->query("SELECT * FROM microservices");
$microservices = $msQuery->fetchAll(PDO::FETCH_ASSOC);

echo "<pre>";

foreach ($microservices as $ms) {
    echo "<table border='1' style='margin-bottom: 10px; text-align: left;'>";
    echo "<tr><th>Microservice</th><td>" . $ms['ms_name'] . "</td>";
    echo "<tr><th>Description</th><td>" . $ms['description'] . "</td>";
    // get parameters connected to the microservice
    $paramStmt = $db->prepare("SELECT * FROM parameters WHERE microservice_id = ?");
    $paramStmt->execute([$ms['id']]);
    $params = $paramStmt->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($params)) {
        foreach ($params as $p) {
            echo "<tr><th>Parameter</th><td>" . $p['parameter_name'] . "</td>";
            echo "<tr><th>Parameter Type</th><td>" . $p['parameter_type'] . "</td>";
            echo "<tr><th>Parameter Description</th><td>" . $p['parameter_description'] . "</td>";
        }
    } else {
        echo "<tr><th>Parameter</th><td>No parameters</td>";
    }
    echo "<tr><th>Calling Methods</th><td>" . $ms['calling_methods'] . "</td>";
    // get outputs connected to the microservice
    $outputStmt = $db->prepare("SELECT * FROM outputs WHERE microservice_id = ?");
    $outputStmt->execute([$ms['id']]);
    $outputs = $outputStmt->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($outputs)) {
        foreach ($outputs as $o) {
            echo "<tr><th>Output</th><td>" . $o['output_name'] . "</td>";
            echo "<tr><th>Output Type</th><td>" . $o['output_type'] . "</td>";
            echo "<tr><th>Output Description</th><td>" . $o['output_description'] . "</td>";
        }
    } else {
        echo "<tr><th>Parameter</th><td>No outputs</td>";
    }
    echo "<tr><th>Microservices Used</th><td>" . $ms['microservices_used'] . "</td>";
    echo "</table>";
}

echo "</pre>";
?>