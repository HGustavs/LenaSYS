<?php
date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../Shared/sessions.php";
/*
function setAsActiveCourse($pdo, $cid, $versid)
{
	$query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
	$query->bindParam(':cid', $cid);
	$query->bindParam(':vers', $versid);

	if (!$query->execute()) {
		$error = $query->errorInfo();
		$debug = "Error updating entries\n" . $error[2];
		echo json_encode($debug);
	}
}

*/

function setAsActiveCourse()
{
	pdoConnect();
	session_start();
	file_put_contents("../../../log/log.json", "GLORY\n", FILE_APPEND);

	setcookie("lastmsg", "Something happened", time() + 3600);
	echo "setactivecourse hej";
    header("Content-Type: application/json");
    //need to fix _SERVER
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        if (isset($_POST['cid'], $_POST['versid'])) {
            $cid = $_POST['cid'];
            $versid = $_POST['versid'];
        }
    }
    $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
    $query->bindParam(':cid', $cid);
    $query->bindParam(':vers', $versid);


    if (!$query->execute()) {
        $error = $query->errorInfo();
        $debug = "Error updating entries\n" . $error[2];
        echo json_encode($debug);
    }
}
