<?php
include "../../../../Shared/test.php";
$testsData = array(
    'copyCourseVersion_ms' => array(
        'expected-output' => '{"status":"success", "message":"Course version copied successfully"}',

        'query-before-test-1' => "INSERT INTO vers (cid, coursecode, vers, versname, coursename, coursenamealt, startdate, enddate, motd) VALUES (2001, 'CSE101', '001', 'Spring 2024', 'Computer Science I', 'Comp Sci I', '2024-01-01', '2024-05-01', 'Welcome to Computer Science I!');",
        'query-before-test-2' => "INSERT INTO quiz (id, cid, qname, vers) VALUES (1001, 2001, 'Intro Quiz', '001');",

        'query-after-test-1' => "DELETE FROM vers WHERE cid = 2001 AND vers = '002';",
        'query-after-test-2' => "DELETE FROM quiz WHERE cid = 2001 AND vers = '002';", // Clean up new version
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/copyCourseVersion_ms.php',
        'service-data' => serialize(
            array(
                'username' => 'brom',
                'password' => 'password',
                'opt' => 'CPYVRS',
                'cid' => 2001,
                'coursecode' => 'CSE101',
                'versid' => '002',
                'versname' => 'Autumn 2024',
                'coursename' => 'Computer Science I',
                'coursenamealt' => 'Comp Sci I',
                'startdate' => '2024-08-01',
                'enddate' => '2024-12-01',
                'motd' => 'Welcome to the autumn semester!',
                'copycourse' => '001', // The version to copy
                'makeactive' => 3
            )
        ),
        'filter-output' => serialize(
            array(
                // Decide on fields to verify, such as successful copy and any new IDs generated
            )
        ),
    ),
);

testHandler($testsData, true);

?>
