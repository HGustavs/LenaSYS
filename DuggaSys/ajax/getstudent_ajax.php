<?php 

include_once(dirname(__FILE__) . "/../../Shared/external/password.php");
include_once(dirname(__FILE__) . "/../../../coursesyspw.php");	
include_once(dirname(__FILE__) . "/../../Shared/basic.php");
pdoConnect();
$cid = $_POST['courseid'];
$entries=array();
foreach($pdo->query( "SELECT * FROM user, user_course WHERE cid='$cid' and user.uid=user_course.uid" ) as $row){
   array_push(
		$entries,
		array(
			'uid' => $row['uid'],
			'username' => $row['username'],
			'access' => $row['access']
		)
	);
}
$array = array(
	'entries' => $entries,
);
echo json_encode($array);

?>