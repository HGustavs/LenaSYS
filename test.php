<?php

header("Access-Control-Allow-Origin: *");

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    echo json_encode(assertEqual($_POST['value1'], $_POST['value2']));

}

function assertEqual($value1, $value2){
    $equalTest = assert($value1, $value2);
    if ($equalTest){
        echo "Test 1 (assertEqual): passed";
        $equalTestResult = "passed";
    }
    else{
        echo "test 1 (assertEqual): failed";
        $equalTestResult = "failed";
    }

    return array(
        'Test 1 (assertEqual)' => $equalTestResult,
    );
}

