<?php

//----------------------------------------------------------------------------------
// setAsActiveCourse_ms.php - Used to update which course version should be active
//----------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

// Connect to database
pdoConnect(); 

$cid;
$versid;


// Handle incoming POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['cid'], $_POST['versid'])) {
        $cid = $_POST['cid'];
        $versid = $_POST['versid'];
	}
}

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
