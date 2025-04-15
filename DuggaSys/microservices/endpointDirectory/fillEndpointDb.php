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
        // skip empty sections
        if (trim($section) === '') {
            continue;
        }

        // microservice name
        preg_match('/^\s*(.+)/', $section, $nameMatch);
        if (isset($nameMatch[1])) {
            $ms_name = trim($nameMatch[1]);
        } else {
            $ms_name = null;
        }

        // description
        preg_match('/## Description\s*(.*?)\n(?:\n|#)/si', $section, $descMatch);
        if (isset($descMatch[1])) {
            $description = trim($descMatch[1]);
        } else {
            $description = null;
        }

        // parameter table
        preg_match('/\| Parameter \| Type \| Description \|.*?\| (.+?) \| (.+?) \| (.+?) \|/si', $section, $paramMatch);
        // parameter
        if (isset($paramMatch[1])) {
            $parameter = trim($paramMatch[1]);
        } else {
            $parameter = null;
        }
        // parameter type
        if (isset($paramMatch[2])) {
            $parameter_type = trim($paramMatch[2]);
        } else {
            $parameter_type = null;
        }
        // parameter description
        if (isset($paramMatch[3])) {
            $parameter_description = trim($paramMatch[3]);
        } else {
            $parameter_description = null;
        }

        // calling methods 
        preg_match('/## Calling Methods\s*(GET|POST|PUT|DELETE)/i', $section, $callMatch);
        if (isset($callMatch[1])) {
            $calling_methods = $callMatch[1];
        } else {
            $calling_methods = null;
        }

        // output table
        preg_match('/\| Output \| Type \| Description \|.*?\| (.+?) \| (.+?) \| (.+?) \|/si', $section, $outputMatch);
        if (isset($outputMatch[1])) {
            $output = trim($outputMatch[1]);
        } else {
            $output = null;
        }
        // output type
        if (isset($outputMatch[2])) {
            $output_type = trim($outputMatch[2]);
        } else {
            $output_type = null;
        }
        // output description
        if (isset($outputMatch[3])) {
            $output_description = trim($outputMatch[3]);
        } else {
            $output_description = null;
        }

        // microservices used
        preg_match('/### Microservices Used\s*(.+)/i', $section, $usedMatch);
        if (isset($usedMatch[1])) {
            $microservices_used = trim($usedMatch[1]);
        } else {
            $microservices_used = null;
        }

        $stmt = $db->prepare("
            INSERT INTO microservices (
            ms_name, description, parameter, parameter_type, parameter_description, calling_methods, output, output_type, output_description, microservices_used
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");

        $stmt->execute([
            $ms_name,
            $description,
            $parameter,
            $parameter_type,
            $parameter_description,
            $calling_methods,
            $output,
            $output_type,
            $output_description,
            $microservices_used
        ]);

    }

    // print what is inserted (for debugging)
    echo "Adding:<br>";
    echo "ms_name: " . $ms_name . "<br>";
    echo "description: " . $description . "<br>";
    echo "parameter: " . $parameter . "<br>";
    echo "parameter_type: " . $parameter_type . "<br>";
    echo "parameter_description: " . $parameter_description . "<br>";
    echo "calling_metods: " . $calling_methods . "<br>";
    echo "output: " . $output . "<br>";
    echo "output_type: " . $output_type . "<br>";
    echo "output_description: " . $output_description . "<br>";
    echo "microservices_used: " . $microservices_used . "<br>";

}

?>