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

    // echo $mdFile;

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
                // collect in a list if there are multiple lines
                $descLines = [];
                // start from the line after the description header
                for ($j = $i + 1; $j < count($lines); $j++) {
                    $line = trim($lines[$j]);
                    // break if an empty line or a new header is reacher
                    if ($line === '' || preg_match('/^#+ /', $line)) {
                        break;
                    }
                    $descLines[] = $line;
                }
                // connect the rows if a row was found 
                if (!empty($descLines)) {
                    $description = implode('<br>', $descLines);
                }
                break;
            }
        }

        // store parameter information in arrays, in case there are multiple
        $parameters = [];
        $parameter_types = [];
        $parameter_descriptions = [];

        $inParamSection = false;
        $currentParam = null;
        $currentType = null;
        $currentDesc = null;

        for ($i = 0; $i < count($lines); $i++) {
            $line = trim($lines[$i]);

            // start when we reach parameter headline
            if ($line === '## Input Parameters') {
                $inParamSection = true;
                continue;
            }

            // break when reaching a new section
            if ($inParamSection && preg_match('/^## /', $line)) {
                break;
            }

            if ($inParamSection) {
                // save previous parameter when a new one is found
                if (stripos($line, '- Parameter:') === 0) {
                    if ($currentParam !== null) {
                        $parameters[] = $currentParam;
                        $parameter_types[] = $currentType !== null ? $currentType : '';
                        $parameter_descriptions[] = $currentDesc !== null ? $currentDesc : '';
                    }

                    // start a new parameter
                    $currentParam = trim(substr($line, strlen('- Parameter:')));
                    $currentType = null;
                    $currentDesc = null;
                }

                // type
                if (stripos($line, '- Type:') === 0) {
                    $currentType = trim(substr($line, strlen('- Type:')));
                }

                // description can be multiple lines
                if (stripos($line, '- Description:') === 0) {
                    $currentDesc = trim(substr($line, strlen('- Description:')));

                    // collect more lines without modifying $i
                    $k = $i + 1;
                    while ($k < count($lines)) {
                        $next = trim($lines[$k]);

                        if ($next === '' || preg_match('/^[-#]/', $next)) {
                            break;
                        }

                        $currentDesc .= ' ' . $next;
                        $k++;
                    }
                }
            }
        }

        // add last parameter after the loop
        if ($inParamSection && $currentParam !== null) {
            $parameters[] = $currentParam;
            $parameter_types[] = $currentType !== null ? $currentType : '';
            $parameter_descriptions[] = $currentDesc !== null ? $currentDesc : '';
        }

        $calling_methods = '';
        for ($i = 0; $i < count($lines); $i++) {
            $line = trim($lines[$i]);

            if ($line === '## Calling Methods') {
                $methods = [];

                for ($j = $i + 1; $j < count($lines); $j++) {
                    $methodLine = trim($lines[$j]);

                    // break if empty line of new header
                    if ($methodLine === '' || preg_match('/^## /', $methodLine)) {
                        break;
                    }

                    $methods[] = $methodLine;
                }

                // combine into one string (GET, POST, etc..)
                $calling_methods = implode(', ', $methods);
                break;
            }
        }


        // for debugging
        echo "<pre>";
        print_r($ms_name . "<br>");
        print_r($description);
        print_r($parameters);
        print_r($parameter_types);
        print_r($parameter_descriptions);
        print_r($calling_methods);
        echo "</pre>";

        // echo "<pre>";
        // print_r($lines);
        // echo "</pre>";

    }

    // echo "<pre>";
    // print_r($mdFile);
    // echo "</pre>";

}


?>