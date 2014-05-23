<?php 
session_start();
include_once dirname(__FILE__) . "/../../Shared/external/password.php";
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();

function getUsername($uid) {
    global $pdo;
	$stmt = $pdo->prepare("SELECT username FROM user WHERE uid=:uid");
	$stmt->bindParam(':uid', $uid);
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	return $result['username'];
}

$return = array();
if(array_key_exists('user_id', $_POST)) {
	$user_ids = $_POST['user_id'];
	if (array_key_exists('user_id', $_POST)) {
		foreach($user_ids as $user) {
		  $stmt = $pdo->prepare("DELETE FROM user_course WHERE uid=:uid");
		  $stmt->bindParam(':uid', $user);
		  if($stmt->execute() && $stmt->rowCount() > 0) {
			  $return[] = getUsername($user);
		  }
		}
				
	}
} else {
	$return = array("success" => false);
}
echo json_encode($return);
?>
