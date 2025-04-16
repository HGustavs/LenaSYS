<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

// connect to the database
$dbFile = __DIR__ . '/endpointDirectory_db.sqlite';
$db = new PDO('sqlite:' . $dbFile);
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// clear previous data
$db->exec("DELETE FROM microservices");

// search recursively for .md files 
function findMdFiles($dir): array
{
    $rii = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir));
    $mdFiles = [];

    // loop through files and save md files pathname
    foreach ($rii as $file) {
        $isFile = !$file->isDir();
        $isMd = strtolower($file->getExtension()) === 'md';

        // if the current item is a markdown file, add its path to the array
        if ($isFile && $isMd) {
            $mdFiles[] = $file->getPathname();
        }
    }

    return $mdFiles;
}

$basePath = realpath(__DIR__ . '/../');
$mdFiles = findMdFiles($basePath);

// loop through the saved files
foreach ($mdFiles as $mdFile) {
    $content = file_get_contents($mdFile);

    // skip files that are not structured documentation
    if (!preg_match('/# Name of file\/service/i', $content)) {
        continue;
    }

    // split on each microservice block (if there is documentation for more than one microservice in the same md file)
    $services = preg_split('/# Name of file\/service\s*/i', $content);
    // remove empty strings and lines
    $services = array_filter(array_map('trim', $services));

    echo $mdFile;

    // loop through each microservice inside the md file
    foreach ($services as $service) {
        // remove empty spaces
        if (trim($service === '')) {
            continue;
        }
        // split the string ($service) into an array of rows to be able to analyze the content for each row
        $lines = explode("\n", $service);

        // microservice name is the first non-empty line
        $ms_name = "No name";
        if (isset($lines[0]) && trim($lines[0]) !== '') {
            $ms_name = trim($lines[0]);
        }

        $description = "No description";
        // save the next not empty line after finding description header
        for ($i = 0; $i < count($lines); $i++) {
            if (trim($lines[$i]) === '## Description') {
                if (isset($lines[$i + 1])) {
                    $nextLine = trim($lines[$i + 1]);
                    if ($nextLine !== '') {
                        $description = $nextLine;
                    }
                }
                break;
            }
        }

        echo "<pre>";
        print_r($ms_name . "<br>");
        print_r($description);
        echo "</pre>";

        // echo "<pre>";
        // print_r($lines);
        // echo "</pre>";

    }

    // echo "<pre>";
    // print_r($mdFile);
    // echo "</pre>";

}

// echo "<pre>";
// print_r($mdFiles);
// echo "</pre>";



?>