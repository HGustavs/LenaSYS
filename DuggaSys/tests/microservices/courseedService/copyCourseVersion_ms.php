<?php
include "../../../../Shared/test.php";

// Simulated data for test
$testCourseName = "Test Course";
$testVisibility = 1; // Public
$testCourseCode = "TC101";
$testCourseGitURL = "https://github.com/test/repo";

// Test data setup
$testdata = [
    'update course information' => [
        'expected-output' => '{"success":true,"status":"","debug":"NONE!"}', // Expecting a successful course update
        'query-before-test' => "INSERT INTO course (cid, coursename, visibility, coursecode, courseGitURL) VALUES (1001, 'Old Name', 0, 'Old101', 'https://github.com/old/repo');", // Pre-insert a course entry to update
        'query-after-test' => "DELETE FROM course WHERE cid = 1001;", // Clean up after test
        'service' => 'http://localhost/LenaSYS/DuggaSys/microservices/retrieveCourseedService_ms.php',
        'service-data' => serialize([ // Data that the service needs to execute the function
            'opt' => 'update',
            'cid' => 1001, 
            'coursename' => $testCourseName,
            'visib' => $testVisibility,
            'coursecode' => $testCourseCode,
            'courseGitURL' => $testCourseGitURL
        ]),
        'filter-output' => serialize([
            'none'
        ]),
    ],
];

testHandler($testdata, true); // prettyPrint: true = prettyprint (HTML), false = raw JSON
?>
