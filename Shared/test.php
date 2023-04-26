<?php

if ($_SERVER['REQUEST_METHOD'] === 'POST'){
    // Test 1
    echo json_encode(assertEqual($_POST['value1'], $_POST['value2']));
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

?>