<?php 
session_start();
include_once(dirname(__FILE__) . "/../../../coursesyspw.php");	
include_once(dirname(__FILE__) . "/../../Shared/sessions.php");
pdoConnect();
$cid = $_POST['courseid'];
$entries=array();

if(checklogin() && (hasAccess($_SESSION['uid'], $cid, 'w') || isSuperUser($_SESSION['uid']))) {
	$query = $pdo->prepare("SELECT user.uid as uid,username,access,firstname,lastname FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid");
	$query->bindParam(':cid', $cid);
	$query->execute();

	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		$entry = array(
			'uid' => $row['uid'],
			'username' => $row['username'],
			'access' => $row['access'],
			'firstname' => $row['firstname'],
			'lastname' => $row['lastname']
		);

		array_push($entries, $entry);
	}
	$array = array(
		'entries' => $entries,
		'success' => true
	);
} else {
	$array = array(
		'success' => false,
		'reason' => 'Access denied'
	);
}

echo json_encode($array);

?>
