<?php

// connect to the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// clear previous data
$db->exec("DELETE FROM microservices");

// points to microservice folder
$basePath = realpath(__DIR__ . '/../');
// points to project root
// $rootPath = realpath($basePath . '/../');
$mdFiles = glob($basePath . '/*.md');

// loop through every .md-file
foreach ($mdFiles as $mdFile) {
    $content = file_get_contents($mdFile);

    // check if the markdown file includes correct headline
    if (!preg_match('/### MICROSERVICE DOCUMENTATION ###/', $content)) {
        continue;
    }

    // extract blocks with regex
    $fields = [
        'ms_name' => '/# MICROSERVICE NAME #\s*(.+)/i',
        'ms_path' => '/# SEARCHPATH #\s*(.+)/i',
        'file_name' => '/# FILENAME #\s*(.+)/i',
        'description' => '/# DESCRIPTION #\s*(.+)/i',
        'parameters' => '/# PARAMETERS #\s*(.+)/i',
        'render' => '/# RENDER #\s*(.+)/i',
    ];

    $values = [];

    foreach ($fields as $key => $regex) {
        if (preg_match($regex, $content, $match)) {
            $values[$key] = trim($match[1]);
        } else {
            // if something is missing
            $values[$key] = null;
        }
    }

    // print what is inserted (for debugging)
    echo "✔ Adding:\n";
    echo "  Microservice:  " . $values['ms_name'] . "\n";
    echo "  Filename:       " . $values['file_name'] . "\n";
    echo "  Path:        " . $values['ms_path'] . "\n";
    echo "  Description:   " . $values['description'] . "\n";
    echo "  Parameters:    " . $values['parameters'] . "\n";
    echo "  Render:        " . $values['render'] . "\n\n";

    // insert into database
    $stmt = $db->prepare("
        INSERT INTO microservices (ms_name, file_name, ms_path, parameters, description, render)
        VALUES (?, ?, ?, ?, ?, ?)
    ");

    $stmt->execute([
        $values['ms_name'],
        $values['file_name'],
        $values['ms_path'],
        $values['parameters'],
        $values['description'],
        $values['render']
    ]);

}

?>