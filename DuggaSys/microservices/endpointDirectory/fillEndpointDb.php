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

echo "<pre>";
print_r($mdFiles);
echo "</pre>";

?>