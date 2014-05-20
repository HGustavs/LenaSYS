<?php 
session_start();
include_once dirname(__FILE__) . "/../../Shared/external/password.php";
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();
function getUsername($user){
    global $pdo;
	$stmt = $pdo->prepare("SELECT username FROM user WHERE uid='$user'");
	$stmt->execute();
	$result = $stmt->fetch(PDO::FETCH_ASSOC);
	return $result['username'];
}
$user_ids = $_POST['user_id'];
$return = array();
if (isset($_POST['user_id'])) {

	foreach($user_ids as $user) {
	  $return[] = getUsername($user);
	  $pdo->query( "DELETE FROM user_course WHERE uid='$user'" );
	}
    		
}
echo json_encode($return);

?>