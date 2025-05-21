<?php

//----------------------------------------------------------------------------------
// setAsActiveCourse_ms.php - Used to update which course version should be active
//----------------------------------------------------------------------------------

// All services to include
date_default_timezone_set("Europe/Stockholm");
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../curlService.php";

// Connect to database
pdoConnect(); 

// Uses curlService.php to verify the receiving data
$data = recieveMicroservicePOST(['cid', 'versid']);
$cid = $data['cid'];
$versid = $data['versid'];


// Prepare the SQL update
$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
$query->bindParam(':cid', $cid);
$query->bindParam(':vers', $versid);

// Executes the query and handles the response 
if ($query->execute()) {
    echo json_encode(["status" => "success"]);
} else {
    $error = $query->errorInfo();
    echo json_encode(["status" => "error", "message" => $error[2]]);

}
