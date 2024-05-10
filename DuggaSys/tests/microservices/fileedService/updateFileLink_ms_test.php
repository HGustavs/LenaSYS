<?php
include_once "../../../../Shared/test.php";
include_once "../../../../Shared/sessions.php";

session_start();
pdoConnect();

$fileDebug = 'NONE!';

// Create test files
createTestFile('GlobalUpdateFileLinkTestFile.txt', 'GFILE');
createTestFile('CourseLocalUpdateFileLinkTestFile.txt', 'MFILE');
createTestFile('VersionLocalUpdateFileLinkTestFile.txt', 'LFILE');

//------------------------------------------------------------------------------------------
// Tests for each kind of file
//------------------------------------------------------------------------------------------
$testsData = array(
    'updateFileLink_ms - Global file' => array(
        'expected-output' => '{"entries":[{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":7,\"kind\":\"Global\"}"},{"filesize":"{\"size\":137,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":60,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Course local\"}"},{"filesize":"{\"size\":0,\"kind\":\"Version local\"}"}]}',

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/fileedService/updateFileLink_ms.php',
        'service-data' => serialize(array(
                'opt' => 'SAVEFILE',
                'cid' => 1885,
                'coursevers' => 1337,
                'filename' => 'GlobalUpdateFileLinkTestFile.txt',
                'kind' => 2,
                'contents' => "UPDATED",
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(array(
                'entries' => array(
                    'filesize'
                )    
            ),
        ),
    ),
    'updateFileLink_ms - Course local file' => array(
        'expected-output' => '{"entries":[{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":7,\"kind\":\"Global\"}"},{"filesize":"{\"size\":137,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":60,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":7,\"kind\":\"Course local\"}"},{"filesize":"{\"size\":0,\"kind\":\"Version local\"}"}]}',

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/fileedService/updateFileLink_ms.php',
        'service-data' => serialize(array(
                'opt' => 'SAVEFILE',
                'cid' => 1885,
                'coursevers' => 1337,
                'filename' => 'CourseLocalUpdateFileLinkTestFile.txt',
                'kind' => 3,
                'contents' => "UPDATED",
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(array(
                'entries' => array(
                    'filesize'
                )    
            ),
        ),
    ),
    'updateFileLink_ms - Version local file' => array(
        'expected-output' => '{"entries":[{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":7,\"kind\":\"Global\"}"},{"filesize":"{\"size\":137,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":60,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":0,\"kind\":\"Global\"}"},{"filesize":"{\"size\":7,\"kind\":\"Course local\"}"},{"filesize":"{\"size\":7,\"kind\":\"Version local\"}"}]}',

        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/fileedService/updateFileLink_ms.php',
        'service-data' => serialize(array(
                'opt' => 'SAVEFILE',
                'cid' => 1885,
                'coursevers' => 1337,
                'filename' => 'VersionLocalUpdateFileLinkTestFile.txt',
                'kind' => 4,
                'contents' => "UPDATED",
                'username' => 'brom',
                'password' => 'password'
            )
        ),
        'filter-output' => serialize(array(
                'entries' => array(
                    'filesize'
                )    
            ),
        ),
    ),
);

testHandler($testsData, true); // 2nd argument (prettyPrint): true = prettyprint (HTML), false = raw JSON
//------------------------------------------------------------------------------------------
// End of tests
//------------------------------------------------------------------------------------------

// Paths to test files
$paths = [
    "C:/xampp/htdocs/LenaSYS/courses/global/GlobalUpdateFileLinkTestFile.txt",
    "C:/xampp/htdocs/LenaSYS/courses/1885/CourseLocalUpdateFileLinkTestFile.txt",
    "C:/xampp/htdocs/LenaSYS/courses/1885/1337/VersionLocalUpdateFileLinkTestFile.txt"
];

// Delete DB-records of test files
$querystring = "DELETE FROM fileLink WHERE filename LIKE '%UpdateFileLinkTestFile.txt' AND cid= 1885";
$query = $pdo->prepare($querystring);

if (!$query->execute()) {
    $error = $query->errorInfo();
    $fileDebug = "Error deleting global test file from database " . $error[2];
}

// Delete test files
foreach ($paths as $path) {
    if (file_exists($path)) {
        if (!unlink($path)) {
            $fileDebug .= "Error deleting file: $path";
        }
    }
}

echo "<strong>Problems handling test files:</strong> " . $fileDebug;

function createTestFile($filename, $kind) {
    $data = array(
        'userid' => 'brom',
        'courseid' => 1885,
        'coursevers' => 1337,
        'kind' => 'EFILE',
        'newEmptyFile[]' => array($filename),
        'efilekind[]' => array($kind),     
    );

    $curl = curl_init("http://localhost/LenaSYS/DuggaSys/filereceive.php");
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    curl_exec($curl);

    // Error handling
    if(curl_errno($curl)) {
        $error_message = curl_error($curl);
        echo $error_message;
    }
    curl_close($curl);
}