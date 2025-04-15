<?php

// connect to the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// clear previous data
$db->exec("DELETE FROM microservices");

// points to microservice folder
$basePath = realpath(__DIR__ . '/../');
$mdFiles = glob($basePath . '/*/*.md');

// loop through every .md-file
foreach ($mdFiles as $mdFile) {
    $content = file_get_contents($mdFile);

    // split section within the markdown file (the beginning of each microservice starts with "#Name of file service/service")
    $services = preg_split('/# Name of file\/service/i', $content);

    foreach ($services as $service) {

    }

    // // extract blocks with regex
    // $fields = [
    //     'ms_name' => '/# MICROSERVICE NAME #\s*(.+)/i',
    //     'ms_path' => '/# SEARCHPATH #\s*(.+)/i',
    //     'file_name' => '/# FILENAME #\s*(.+)/i',
    //     'description' => '/# DESCRIPTION #\s*(.+)/i',
    //     'parameters' => '/# PARAMETERS #\s*(.+)/i',
    //     'render' => '/# RENDER #\s*(.+)/i',
    // ];

    // $values = [];

    // foreach ($fields as $key => $regex) {
    //     if (preg_match($regex, $content, $match)) {
    //         $values[$key] = trim($match[1]);
    //     } else {
    //         // if something is missing
    //         $values[$key] = null;
    //     }
    // }

    // // print what is inserted (for debugging)
    // echo "  Adding:<br>";
    // echo "  Microservice:  " . $values['ms_name'] . "<br>";
    // echo "  Filename:       " . $values['file_name'] . "<br>";
    // echo "  Path:        " . $values['ms_path'] . "<br>";
    // echo "  Description:   " . $values['description'] . "<br>";
    // echo "  Parameters:    " . $values['parameters'] . "<br>";
    // echo "  Render:        " . $values['render'] . "<br>";

    // // insert into database
    // $stmt = $db->prepare("
    //     INSERT INTO microservices (ms_name, file_name, ms_path, parameters, description, render)
    //     VALUES (?, ?, ?, ?, ?, ?)
    // ");

    // $stmt->execute([
    //     $values['ms_name'],
    //     $values['file_name'],
    //     $values['ms_path'],
    //     $values['parameters'],
    //     $values['description'],
    //     $values['render']
    // ]);

}

?>