<?php
include_once "./getUid_ms.php";
include_once "./retrieveUsername_ms.php";

//Here we add a http call for post requests
header('Content-Type: application/json');

// This makes the function only accept POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Only POST allowed']);
    exit;
}
// Error handling regarding the six values needed
// These are required for the post call to work
$required = [
    'courseid', 'coursevers', 'sectionname',
    'link', 'log_uuid', 'templateNumber'
];
//If any value is missing the function will return error code 400 and a error message
foreach ($required as $f) {
    if (! isset($_POST[$f])) {
        http_response_code(400);
        echo json_encode([
            'error' => "Missing parameter: $f"
        ]);
        exit;
    }
}
// Turn post values into locals
$courseid = $_POST['courseid'];
$coursevers = $_POST['coursevers'];
$sectionname = $_POST['sectionname'];
$link = $_POST['link'];
$log_uuid = $_POST['log_uuid'];
$templateNumber = $_POST['templateNumber'];

// Here we call the original function
$result = createNewCodeExample(
    $pdo,
    null,
    $courseid,
    $coursevers,
    $sectionname,
    $link,
    $log_uuid,
    $templateNumber
);

// Return the result as JSON
echo json_encode($result);
exit;

//Here is where the microservice function starts
function createNewCodeExample($pdo, $exampleid, $courseid, $coursevers, $sectname, $link, $log_uuid, $templateNumber=0){
	if (!is_null($exampleid)){
		$sname = $sectname . ($exampleid + 1);
	}else{
		$sname= $sectname;
	}
	$debug="NONE!";
	$query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion,templateid) values (:cid,:ename,:sname,1,:cversion, :templateid);");
	$query2->bindParam(':cid', $courseid);
	$query2->bindParam(':cversion', $coursevers);
	$query2->bindParam(':ename', $sectname);
	$query2->bindParam(':sname', $sname);
	$query2->bindParam(":templateid", $templateNumber);
	if (!$query2->execute()) {
		$error = $query2->errorInfo();
		$debug = "Error updating entries" . $error[2];
	}
	$link = $pdo->lastInsertId();

	$userid = getUid();
	$username = retrieveUsername($pdo);
	logUserEvent($userid, $username, EventTypes::SectionItems, $sectname);

	return array('debug'=>$debug,'link'=>$link);
}
