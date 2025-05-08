<?php

//----------------------------------------------------------------------------------
// callMicroservicePOST - Sends a POST request to a microservice.
//----------------------------------------------------------------------------------

function callMicroservicePOST(string $path, array $dataToSend, bool $returnValue = false) {
    // Build the full URL for the microservice endpoint
    $baseURL = "http://" . $_SERVER['HTTP_HOST'] . "/LenaSYS/DuggaSys/microservices/";
    $url = $baseURL . $path;

    // Initialize cURL session
    $ch = curl_init($url);
    
    // Set cURL options for a POST request
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, $returnValue);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $dataToSend);

    // Execute the request
    $response = curl_exec($ch);

    // Handle potential cURL errors
    if (curl_errno($ch)) {
        $response = json_encode(['error' => curl_error($ch)]);
    }

    // Close the cURL session
    curl_close($ch);

    // Return response if requested
    return $returnValue ? $response : null;
}

function recieveMicroservicePOST(array $requiredKeys = []) {

    $receivedData = [];

    foreach ($requiredKeys as $key) {
        if (!isset($_POST[$key])) {
            echo json_encode(["error" => "Missing required POST parameter: $key"]);
            exit;
        }
        $receivedData[$key] = $_POST[$key];
    }

    return $receivedData;
}
//Supposed to be used instead of includes

function callMicroserviceGET(string $path){
    $baseURL = "https://" . $_SERVER['HTTP_HOST'] . "/LenaSYS/DuggaSys/microservices/";
    $url = $baseURL . $path;
  
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    if ($response === false) {
        error_log("Error fetching microservice: " . curl_error($ch));
        return null;
    }

    $data = json_decode($response, true);
    return $data;
}

//---------------------------------------------------------------------------------------------------------------
// Example, how the get and connect the correct microservices
//
//  Replaces the include. Change the path to the correct microservice, and find a suitable or the correct variable to use
//  This is supposed to be in the file that USES the include:
//                      include_once "../microservices/curlService.php";
//                      $uid = callMicroserviceGET("../sharedMicroservices/getUid_ms.php");
//
//  In the file that is used as an include, in this example the "getUid_ms.php" file, put this instead of the return:
//                      header('Content-Type: application/json');
//                      echo json_encode(['uid' => $userid]);
//
//  In echo json_encode, use the same variable that is used for the microservicePath, here it is the uid and...
//  $userid here is what the return variable is/was; (['*microservicePath variable*' => *the return $variable*])
//---------------------------------------------------------------------------------------------------------------
?>
