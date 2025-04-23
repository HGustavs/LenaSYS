<?php
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// get all microservices
$msQuery = $db->query("SELECT * FROM microservices");
$microservices = $msQuery->fetchAll(PDO::FETCH_ASSOC);

echo "<pre>";

foreach ($microservices as $ms) {
    echo "<table style='border: 1px solid black; margin-bottom: 10px; text-align: left;'>";
    echo "<tr><th style='border: 1px solid black;'>Microservice</th><td style='border: 1px solid black';>" . $ms['ms_name'] . "</td>";
    echo "<tr><th style='border: 1px solid black';>Description</th><td style='border: 1px solid black';>" . $ms['description'] . "</td>";
    // get parameters connected to the microservice
    $paramStmt = $db->prepare("SELECT * FROM parameters WHERE microservice_id = ?");
    $paramStmt->execute([$ms['id']]);
    $params = $paramStmt->fetchAll(PDO::FETCH_ASSOC);
    if (!empty($params)) {
        foreach ($params as $p) {
            echo "<tr><th style='border: 1px solid black';>Parameter</th><td style='border: 1px solid black';>" . $p['parameter_name'] . "</td>";
            echo "<tr><th style='border: 1px solid black';>Parameter Type</th><td style='border: 1px solid black';>" . $p['parameter_type'] . "</td>";
            echo "<tr><th style='border: 1px solid black';>Parameter Description</th><td style='border: 1px solid black';>" . $p['parameter_description'] . "</td>";
        }
    } else {
        echo "<tr><th style='border: 1px solid black';>Parameter</th><td style='border: 1px solid black';>No parameters</td>";
    }
    echo "<tr><th style='border: 1px solid black';>Calling Methods</th><td style='border: 1px solid black';>" . $ms['calling_methods'] . "</td>";
    echo "<tr><th style='border: 1px solid black';>Output</th><td style='border: 1px solid black';>" . $ms['output'] . "</td>";
    echo "<tr><th style='border: 1px solid black';>Output Type</th><td style='border: 1px solid black';>" . $ms['output_type'] . "</td>";
    echo "<tr><th style='border: 1px solid black';>Output Description</th><td style='border: 1px solid black';>" . $ms['output_description'] . "</td>";
    echo "<tr><th style='border: 1px solid black';>Microservices Used</th><td style='border: 1px solid black';>" . $ms['microservices_used'] . "</td>";
}

echo "</pre>";
?>