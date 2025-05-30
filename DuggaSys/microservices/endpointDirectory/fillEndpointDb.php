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

    // skip the file named 'microservice_connections.md', its content is not wanted in the database
    if (basename($mdFile) === 'microservice_connections.md') {
        continue;
    }
    // also skip the template file
    if (basename($mdFile) === 'template.md') {
        continue;
    }
    // skip files that are not structured documentation
    if (!preg_match('/# Name of file\/service/i', $content)) {
        continue;
    }

    // split on each microservice block (if there is documentation for more than one microservice in the same md file)
    $services = preg_split('/# Name of file\/service\s*/i', $content);
    // remove empty strings and lines
    $services = array_filter(array_map('trim', $services));

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
                    // skip template placeholder text
                    if ($line === '*Description of what the service do and its function in the system.*') {
                        continue;
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

                    // remove "- " if it exists at start
                    if (strpos($methodLine, '- ') === 0) {
                        $methodLine = substr($methodLine, 2);
                    }

                    $methods[] = $methodLine;
                }

                // combine into one string (GET, POST, etc..)
                $calling_methods = implode(', ', $methods);
                break;
            }
        }

        // store output information in arrays, in case there are multiple
        $outputs = [];
        $output_types = [];
        $output_descriptions = [];

        $inOutputSection = false;
        $currentOutput = null;
        $currentOutputType = null;
        $currentOutputDesc = null;

        for ($i = 0; $i < count($lines); $i++) {
            $line = trim($lines[$i]);

            // start when we reach output headline
            if ($line === '## Output Data and Format') {
                $inOutputSection = true;
                continue;
            }

            // break when reaching a new section
            if ($inOutputSection && preg_match('/^## /', $line)) {
                break;
            }

            if ($inOutputSection) {
                // save previous output when a new one is found
                if (stripos($line, '- Output:') === 0) {
                    if ($currentOutput !== null) {
                        $outputs[] = $currentOutput;
                        $output_types[] = $currentOutputType !== null ? $currentOutputType : '';
                        $output_descriptions[] = $currentOutputDesc !== null ? $currentOutputDesc : '';
                    }

                    // start a new output
                    $currentOutput = trim(substr($line, strlen('- Output:')));
                    $currentOutputType = null;
                    $currentOutputDesc = null;
                }

                // type
                if (stripos($line, '- Type:') === 0) {
                    $currentOutputType = trim(substr($line, strlen('- Type:')));
                }

                // description can be multiple lines
                if (stripos($line, '- Description:') === 0) {
                    $currentOutputDesc = trim(substr($line, strlen('- Description:')));

                    // collect more lines without modifying $i
                    $j = $i + 1;
                    while ($j < count($lines)) {
                        $next = trim($lines[$j]);

                        if ($next === '' || preg_match('/^[-#]/', $next)) {
                            break;
                        }

                        $currentOutputDesc .= ' ' . $next;
                        $j++;
                    }
                }
            }
        }

        // add last output after the loop
        if ($inOutputSection && $currentOutput !== null) {
            $outputs[] = $currentOutput;
            $output_types[] = $currentOutputType !== null ? $currentOutputType : '';
            $output_descriptions[] = $currentOutputDesc !== null ? $currentOutputDesc : '';
        }

        $example_code = '';

        for ($i = 0; $i < count($lines); $i++) {
            $line = trim($lines[$i]);

            // when reaching examples of use
            if ($line === '## Examples of Use') {
                $codeStarted = false;
                $codeLines = [];

                for ($j = $i + 1; $j < count($lines); $j++) {
                    $currentLine = trim($lines[$j]);

                    if (!$codeStarted && $currentLine === '`') {
                        $codeStarted = true;
                        continue;
                    }

                    if ($codeStarted) {
                        if ($currentLine === '`') {
                            // if its the end of the code block example
                            break;
                        }
                        // keep indentations
                        $codeLines[] = $lines[$j];
                    }
                }

                // assemble code block
                if (!empty($codeLines)) {
                    $example_code = implode("\n", $codeLines);
                }

                break;
            }
        }

        $microservices_used = '';

        for ($i = 0; $i < count($lines); $i++) {
            $line = trim($lines[$i]);

            // when reaching microservices used 
            if ($line === '### Microservices Used') {
                $used = [];

                // collect rows until reaching an empty line or new headling
                for ($j = $i + 1; $j < count($lines); $j++) {
                    $nextLine = trim($lines[$j]);

                    if ($nextLine === '' || preg_match('/^#+ /', $nextLine)) {
                        break;
                    }

                    // skip placeholder-text in the template
                    if (trim($nextLine) === '*Includes and microservices used*') {
                        continue;
                    }

                    $used[] = $nextLine;
                }

                // combine into one string
                if (!empty($used)) {
                    $microservices_used = implode(', ', $used);
                }
                break;
            }
        }

        // insert into microservice
        $stmt = $db->prepare("
        INSERT INTO microservices (
            ms_name,
            description,
            calling_methods,
            microservices_used
        ) VALUES (?, ?, ?, ?)
        ");

        $stmt->execute([
            $ms_name,
            $description,
            $calling_methods,
            $microservices_used
        ]);

        // get the id of the recently inserted microservice 
        $microservice_id = $db->lastInsertId();

        // add every parameter to the database along with the id from the last inserted microservice
        $parameter_stmt = $db->prepare("
        INSERT INTO parameters (microservice_id, parameter_name, parameter_type, parameter_description)
        VALUES (?, ?, ?, ?)
        ");

        for ($i = 0; $i < count($parameters); $i++) {
            $paramName = $parameters[$i];
            $paramType = $parameter_types[$i] ?? '';
            $paramDesc = $parameter_descriptions[$i] ?? '';

            $parameter_stmt->execute([
                $microservice_id,
                $paramName,
                $paramType,
                $paramDesc
            ]);
        }

        // prepare statement to insert outputs
        $output_stmt = $db->prepare("
        INSERT INTO outputs (microservice_id, output_name, output_type, output_description)
        VALUES (?, ?, ?, ?)
        ");

        // loop through all collected outputs for the current microservice and insert them
        for ($i = 0; $i < count($outputs); $i++) {
            $outputName = $outputs[$i];
            $outputType = $output_types[$i] ?? '';
            $outputDesc = $output_descriptions[$i] ?? '';

            $output_stmt->execute([
                $microservice_id,
                $outputName,
                $outputType,
                $outputDesc
            ]);
        }

    }
}

echo "Microservices documentation inserted.<br>";

?>