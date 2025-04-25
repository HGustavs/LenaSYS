<?php

    //Supposed to be used instead of includes

    function callMicroserviceGET($microservicePath){
        $baseURL = "https://" . $_SERVER['HTTP_HOST'];
        //$baseURL = "http://localhost";

        //The variable microservicePath will be used to locate the correct file
        $url = $baseURL . $microservicePath;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
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
//                      include_once "../microservices/HelperFunction_ms.php";
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