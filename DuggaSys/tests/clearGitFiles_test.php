<?php

namespace DuggaSys\tests;

// Set up mock environment
$_SERVER['DOCUMENT_ROOT'] = 'C:/xampp2/htdocs';

// Mock functions from sessions.php and basic.php
function pdoConnect() {
    return new MockPDO();
}

function getOP($key) {
    $mockData = [
        'opt' => 'SAVDU',
        'courseid' => '1234',
        'coursevers' => '1',
        'did' => '5678',
        'moment' => '1000',
        'answer' => 'Test answer'
    ];
    return isset($mockData[$key]) ? $mockData[$key] : 'UNK';
}

function isSuperUser($userid) {
    return false;
}

function makeLogEntry($userid, $type, $pdo, $description) {
    // Mock implementation
}

function logServiceEvent($log_uuid, $eventType, $script, $userid, $info) {
    // Mock implementation
}

// Mock PDO classes
class MockPDO {
    public function prepare($query) {
        return new MockPDOStatement();
    }
}

class MockPDOStatement {
    public function bindParam($param, &$value) {}
    public function execute() {
        return true;
    }
    public function fetchAll() {
        return [['grade' => 1, 'password' => 'testpassword']];
    }
    public function errorInfo() {
        return [0, 1, 'Test error'];
    }
}

// Mock session
$_SESSION = [
    'uid' => 'testuser',
    'loginname' => 'testlogin',
    'lastname' => 'Testlast',
    'firstname' => 'Testfirst',
    'submission-1234-1-5678-1000' => 'testhash',
    'submission-password-1234-1-5678-1000' => 'testpassword',
    'submission-variant-1234-1-5678-1000' => 'testvariant'
];

// Set up the correct path to the file being tested
$pathToSaveDuggaMS = __DIR__ . '/../microservices/showDuggaService/saveDugga_ms.php';

if (!file_exists($pathToSaveDuggaMS)) {
    die("Error: saveDugga_ms.php not found at $pathToSaveDuggaMS");
}

// Test cases
function testSaveDugga() {
    global $pathToSaveDuggaMS;
    
    // Set up test data
    $_POST = [
        'submission-1234-1-5678-1000' => 'testhash',
        'submission-password-1234-1-5678-1000' => 'testpassword',
        'submission-variant-1234-1-5678-1000' => 'testvariant'
    ];

    // Capture output
    ob_start();
    include $pathToSaveDuggaMS;
    $output = ob_get_clean();

    // Assert the output
    $result = json_decode($output, true);
    assert($result !== null, 'Output should be valid JSON');
    assert(isset($result['debug']), 'Result should contain debug key');
    
    echo "testSaveDugga passed\n";
}

// Run tests
testSaveDugga();

echo "All tests completed.\n";