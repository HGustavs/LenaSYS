<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST'){

    // Test 1 assertEqual
    echo json_encode(assertEqual($_POST['value1'], $_POST['value2']));

    // Test 2 login
    echo json_encode(loginTest($_POST['user'], $_POST['pwd']));


}

// Test 1: assert equal test
function assertEqual($value1, $value2){
    if (($_POST['value1'] != null) && ($_POST['value2'] != null)){
        $equalTest = assert($value1, $value2);
        if ($equalTest){
            $equalTestResult = "passed";
        }
        else{
            $equalTestResult = "failed";
        }
    }
    else{
        $equalTestResult = "failed no valid values";
    }

    return array(
            'Test 1 (assertEqual)' => $equalTestResult,
            'value1' => $value1,
            'value2' => $value2
        );
}

// Test 2: login test
function loginTest($user, $pwd){
    // Session includes login functionality
    include_once "../Shared/sessions.php";
    if (login($user, $pwd, false)) {
        $loginTestResult = "passed";
    }
    else{
        $loginTestResult = "failed";
    }

    return array(
            'Test 2 (login):' => $loginTestResult,
            'username' => $user,
            'password' => $pwd
        );
}

?>