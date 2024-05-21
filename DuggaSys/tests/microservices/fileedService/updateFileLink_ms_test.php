<?php
include_once "../../../../Shared/test.php";
include_once "../../../../Shared/sessions.php";

session_start();
pdoConnect();

$debug = '';

// Create test files
$debug .= createTestFile('GlobalUpdateFileLinkTestFile.txt', 'GFILE', $debug);
$debug .= createTestFile('CourseLocalUpdateFileLinkTestFile.txt', 'MFILE', $debug);
$debug .= createTestFile('VersionLocalUpdateFileLinkTestFile.txt', 'LFILE', $debug);

//------------------------------------------------------------------------------------------
// Tests for each kind of file
//------------------------------------------------------------------------------------------
$testsData = array(
    'updateFileLink_ms - Global file' => array(
        'expected-output' => '{"entries":[{"filename":"{\"filename\":\"diagram.json\",\"shortfilename\":\"diagram\",\"kind\":\"Global\",\"extension\":\"json\",\"filePath\":\"..\\\/courses\\\/global\\\/diagram.json\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"GlobalUpdateFileLinkTestFile.txt\",\"shortfilename\":\"GlobalUpdateFileLinkTestFile\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/GlobalUpdateFileLinkTestFile.txt\"}","filesize":"{\"size\":\"7\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"helloWorld.html\",\"shortfilename\":\"helloWorld\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/helloWorld.html\"}","filesize":"{\"size\":\"137\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex1.txt\",\"shortfilename\":\"HTML_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex2.txt\",\"shortfilename\":\"HTML_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex3.txt\",\"shortfilename\":\"HTML_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex4.txt\",\"shortfilename\":\"HTML_Ex4\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex4.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex5.txt\",\"shortfilename\":\"HTML_Ex5\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex5.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex6.txt\",\"shortfilename\":\"HTML_Ex6\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex6.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex7.txt\",\"shortfilename\":\"HTML_Ex7\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex7.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex8.txt\",\"shortfilename\":\"HTML_Ex8\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex8.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST1.html\",\"shortfilename\":\"HTML-TEST1\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST1.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST2.html\",\"shortfilename\":\"HTML-TEST2\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST2.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST3.html\",\"shortfilename\":\"HTML-TEST3\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST3.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST4.html\",\"shortfilename\":\"HTML-TEST4\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST4.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex1.txt\",\"shortfilename\":\"JavaScript_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex2.txt\",\"shortfilename\":\"JavaScript_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex3.txt\",\"shortfilename\":\"JavaScript_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JS-TEST1.js\",\"shortfilename\":\"JS-TEST1\",\"kind\":\"Global\",\"extension\":\"js\",\"filePath\":\"..\\\/courses\\\/global\\\/JS-TEST1.js\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JS-TEST2.js\",\"shortfilename\":\"JS-TEST2\",\"kind\":\"Global\",\"extension\":\"js\",\"filePath\":\"..\\\/courses\\\/global\\\/JS-TEST2.js\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"mdTest.md\",\"shortfilename\":\"mdTest\",\"kind\":\"Global\",\"extension\":\"md\",\"filePath\":\"..\\\/courses\\\/global\\\/mdTest.md\"}","filesize":"{\"size\":\"60\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex1.txt\",\"shortfilename\":\"PHP_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex2.txt\",\"shortfilename\":\"PHP_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex3.txt\",\"shortfilename\":\"PHP_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP-TEST1.php\",\"shortfilename\":\"PHP-TEST1\",\"kind\":\"Global\",\"extension\":\"php\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP-TEST1.php\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"Shader_Ex1.txt\",\"shortfilename\":\"Shader_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/Shader_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"Shader_Ex2.txt\",\"shortfilename\":\"Shader_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/Shader_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"SQL-TEST1.sql\",\"shortfilename\":\"SQL-TEST1\",\"kind\":\"Global\",\"extension\":\"sql\",\"filePath\":\"..\\\/courses\\\/global\\\/SQL-TEST1.sql\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"SQL-TEST2.sql\",\"shortfilename\":\"SQL-TEST2\",\"kind\":\"Global\",\"extension\":\"sql\",\"filePath\":\"..\\\/courses\\\/global\\\/SQL-TEST2.sql\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"CourseLocalUpdateFileLinkTestFile.txt\",\"shortfilename\":\"CourseLocalUpdateFileLinkTestFile\",\"kind\":\"Course local\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/1885\\\/CourseLocalUpdateFileLinkTestFile.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Course local\"}"},{"filename":"{\"filename\":\"VersionLocalUpdateFileLinkTestFile.txt\",\"shortfilename\":\"VersionLocalUpdateFileLinkTestFile\",\"kind\":\"Version local\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/1885\\\/1337\\\/VersionLocalUpdateFileLinkTestFile.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Version local\"}"}]}',

        'query-after-test-1' => "DELETE FROM fileLink WHERE filename = 'GlobalUpdateFileLinkTestFile.txt' AND cid = 1885",

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
                    'filename',
                    'filesize'
                )    
            ),
        ),
    ),
    'updateFileLink_ms - Course local file' => array(
        'expected-output' => '{"entries":[{"filename":"{\"filename\":\"diagram.json\",\"shortfilename\":\"diagram\",\"kind\":\"Global\",\"extension\":\"json\",\"filePath\":\"..\\\/courses\\\/global\\\/diagram.json\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"helloWorld.html\",\"shortfilename\":\"helloWorld\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/helloWorld.html\"}","filesize":"{\"size\":\"137\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex1.txt\",\"shortfilename\":\"HTML_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex2.txt\",\"shortfilename\":\"HTML_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex3.txt\",\"shortfilename\":\"HTML_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex4.txt\",\"shortfilename\":\"HTML_Ex4\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex4.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex5.txt\",\"shortfilename\":\"HTML_Ex5\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex5.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex6.txt\",\"shortfilename\":\"HTML_Ex6\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex6.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex7.txt\",\"shortfilename\":\"HTML_Ex7\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex7.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex8.txt\",\"shortfilename\":\"HTML_Ex8\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex8.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST1.html\",\"shortfilename\":\"HTML-TEST1\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST1.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST2.html\",\"shortfilename\":\"HTML-TEST2\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST2.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST3.html\",\"shortfilename\":\"HTML-TEST3\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST3.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST4.html\",\"shortfilename\":\"HTML-TEST4\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST4.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex1.txt\",\"shortfilename\":\"JavaScript_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex2.txt\",\"shortfilename\":\"JavaScript_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex3.txt\",\"shortfilename\":\"JavaScript_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JS-TEST1.js\",\"shortfilename\":\"JS-TEST1\",\"kind\":\"Global\",\"extension\":\"js\",\"filePath\":\"..\\\/courses\\\/global\\\/JS-TEST1.js\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JS-TEST2.js\",\"shortfilename\":\"JS-TEST2\",\"kind\":\"Global\",\"extension\":\"js\",\"filePath\":\"..\\\/courses\\\/global\\\/JS-TEST2.js\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"mdTest.md\",\"shortfilename\":\"mdTest\",\"kind\":\"Global\",\"extension\":\"md\",\"filePath\":\"..\\\/courses\\\/global\\\/mdTest.md\"}","filesize":"{\"size\":\"60\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex1.txt\",\"shortfilename\":\"PHP_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex2.txt\",\"shortfilename\":\"PHP_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex3.txt\",\"shortfilename\":\"PHP_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP-TEST1.php\",\"shortfilename\":\"PHP-TEST1\",\"kind\":\"Global\",\"extension\":\"php\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP-TEST1.php\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"Shader_Ex1.txt\",\"shortfilename\":\"Shader_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/Shader_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"Shader_Ex2.txt\",\"shortfilename\":\"Shader_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/Shader_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"SQL-TEST1.sql\",\"shortfilename\":\"SQL-TEST1\",\"kind\":\"Global\",\"extension\":\"sql\",\"filePath\":\"..\\\/courses\\\/global\\\/SQL-TEST1.sql\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"SQL-TEST2.sql\",\"shortfilename\":\"SQL-TEST2\",\"kind\":\"Global\",\"extension\":\"sql\",\"filePath\":\"..\\\/courses\\\/global\\\/SQL-TEST2.sql\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"CourseLocalUpdateFileLinkTestFile.txt\",\"shortfilename\":\"CourseLocalUpdateFileLinkTestFile\",\"kind\":\"Course local\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/1885\\\/CourseLocalUpdateFileLinkTestFile.txt\"}","filesize":"{\"size\":\"7\",\"kind\":\"Course local\"}"},{"filename":"{\"filename\":\"VersionLocalUpdateFileLinkTestFile.txt\",\"shortfilename\":\"VersionLocalUpdateFileLinkTestFile\",\"kind\":\"Version local\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/1885\\\/1337\\\/VersionLocalUpdateFileLinkTestFile.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Version local\"}"}]}',

        'query-after-test-1' => "DELETE FROM fileLink WHERE filename = 'CourseLocalUpdateFileLinkTestFile.txt' AND cid = 1885",

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
                    'filename',
                    'filesize'
                )    
            ),
        ),
    ),
    'updateFileLink_ms - Version local file' => array(
        'expected-output' => '{"entries":[{"filename":"{\"filename\":\"diagram.json\",\"shortfilename\":\"diagram\",\"kind\":\"Global\",\"extension\":\"json\",\"filePath\":\"..\\\/courses\\\/global\\\/diagram.json\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"helloWorld.html\",\"shortfilename\":\"helloWorld\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/helloWorld.html\"}","filesize":"{\"size\":\"137\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex1.txt\",\"shortfilename\":\"HTML_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex2.txt\",\"shortfilename\":\"HTML_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex3.txt\",\"shortfilename\":\"HTML_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex4.txt\",\"shortfilename\":\"HTML_Ex4\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex4.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex5.txt\",\"shortfilename\":\"HTML_Ex5\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex5.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex6.txt\",\"shortfilename\":\"HTML_Ex6\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex6.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex7.txt\",\"shortfilename\":\"HTML_Ex7\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex7.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML_Ex8.txt\",\"shortfilename\":\"HTML_Ex8\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML_Ex8.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST1.html\",\"shortfilename\":\"HTML-TEST1\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST1.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST2.html\",\"shortfilename\":\"HTML-TEST2\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST2.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST3.html\",\"shortfilename\":\"HTML-TEST3\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST3.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"HTML-TEST4.html\",\"shortfilename\":\"HTML-TEST4\",\"kind\":\"Global\",\"extension\":\"html\",\"filePath\":\"..\\\/courses\\\/global\\\/HTML-TEST4.html\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex1.txt\",\"shortfilename\":\"JavaScript_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex2.txt\",\"shortfilename\":\"JavaScript_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JavaScript_Ex3.txt\",\"shortfilename\":\"JavaScript_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/JavaScript_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JS-TEST1.js\",\"shortfilename\":\"JS-TEST1\",\"kind\":\"Global\",\"extension\":\"js\",\"filePath\":\"..\\\/courses\\\/global\\\/JS-TEST1.js\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"JS-TEST2.js\",\"shortfilename\":\"JS-TEST2\",\"kind\":\"Global\",\"extension\":\"js\",\"filePath\":\"..\\\/courses\\\/global\\\/JS-TEST2.js\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"mdTest.md\",\"shortfilename\":\"mdTest\",\"kind\":\"Global\",\"extension\":\"md\",\"filePath\":\"..\\\/courses\\\/global\\\/mdTest.md\"}","filesize":"{\"size\":\"60\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex1.txt\",\"shortfilename\":\"PHP_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex2.txt\",\"shortfilename\":\"PHP_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP_Ex3.txt\",\"shortfilename\":\"PHP_Ex3\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP_Ex3.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"PHP-TEST1.php\",\"shortfilename\":\"PHP-TEST1\",\"kind\":\"Global\",\"extension\":\"php\",\"filePath\":\"..\\\/courses\\\/global\\\/PHP-TEST1.php\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"Shader_Ex1.txt\",\"shortfilename\":\"Shader_Ex1\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/Shader_Ex1.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"Shader_Ex2.txt\",\"shortfilename\":\"Shader_Ex2\",\"kind\":\"Global\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/global\\\/Shader_Ex2.txt\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"SQL-TEST1.sql\",\"shortfilename\":\"SQL-TEST1\",\"kind\":\"Global\",\"extension\":\"sql\",\"filePath\":\"..\\\/courses\\\/global\\\/SQL-TEST1.sql\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"SQL-TEST2.sql\",\"shortfilename\":\"SQL-TEST2\",\"kind\":\"Global\",\"extension\":\"sql\",\"filePath\":\"..\\\/courses\\\/global\\\/SQL-TEST2.sql\"}","filesize":"{\"size\":\"0\",\"kind\":\"Global\"}"},{"filename":"{\"filename\":\"VersionLocalUpdateFileLinkTestFile.txt\",\"shortfilename\":\"VersionLocalUpdateFileLinkTestFile\",\"kind\":\"Version local\",\"extension\":\"txt\",\"filePath\":\"..\\\/courses\\\/1885\\\/1337\\\/VersionLocalUpdateFileLinkTestFile.txt\"}","filesize":"{\"size\":\"7\",\"kind\":\"Version local\"}"}]}',

        'query-after-test-1' => "DELETE FROM fileLink WHERE filename = 'VersionLocalUpdateFileLinkTestFile.txt' AND cid = 1885",
        
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
                    'filename',
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
/*$paths = [
    "C:/xampp/htdocs/LenaSYS/courses/global/GlobalUpdateFileLinkTestFile.txt",
    "C:/xampp/htdocs/LenaSYS/courses/1885/CourseLocalUpdateFileLinkTestFile.txt",
    "C:/xampp/htdocs/LenaSYS/courses/1885/1337/VersionLocalUpdateFileLinkTestFile.txt"
];*/
$paths = [
    "../../../../courses/global/GlobalUpdateFileLinkTestFile.txt",
    "../../../../courses/1885/CourseLocalUpdateFileLinkTestFile.txt",
    "../../../../courses/1885/1337/VersionLocalUpdateFileLinkTestFile.txt"
];

// Delete test files
foreach ($paths as $path) {
    if (file_exists($path)) {
        if (!unlink($path)) {
            $debug .= "Error deleting file: $path<br>";
        }
    }
    else{
        $debug .= "File at path $path doesn't exist<br>";
    }
}

if (empty($debug)) {
    $debug = "NONE!";
}

echo "<strong>Problems handling test files:</strong> " . $debug;

// Creates file using curl request
function createTestFile($filename, $kind, $debug) {
    $data = array(
        'userid' => 'brom',
        'courseid' => 1885,
        'coursevers' => 1337,
        'kind' => 'EFILE',
        'newEmptyFile[]' => $filename,
        'efilekind[]' => $kind,     
    );

    $curl = curl_init("http://localhost/LenaSYS/DuggaSys/filereceive.php");
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    curl_exec($curl);

    // Error handling
    if(curl_errno($curl)) {
        $error_message = curl_error($curl);
        $debug = "cURL Error for $filename: $error_message\n";
    }

    curl_close($curl);

    return $debug;
}