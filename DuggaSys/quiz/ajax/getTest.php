<?php
	session_start();

	$_SESSION['user']['id'] = 1;
    $user_id = $_SESSION['user']['id'];
    getAccess();
	function getAccess(){
		try{
			$pdo = new PDO('mysql:dbname=lenasys; host=188.226.197.97', 'lenasys','lena1337');
		}catch(PDOException $e){
			echo $e;
		}
		if($_POST['testid'] != "undefined") {
			$testid = $_POST['testid'];
			$query = "SELECT user_course.access FROM test,user_course where test.cid = user_course.cid and test.id = :testid and user_course.uid = :uid";
			$params = array(':uid' => $_SESSION['user']['id'],':testid' => $testid);
		}
		elseif($_POST['courseid'] != "undefined") {
			$cid = $_POST['courseid'];
			$query = "SELECT access from user_course where uid = :uid and cid = :cid";
			$params = array(':uid' => $_SESSION['user']['id'], ':cid' => $cid);
		}
		$stmt = $pdo->prepare($query);
		$stmt->execute($params);
		$result = $stmt->fetch(PDO::FETCH_OBJ);

		if($result) {
			$_SESSION['user']['permission'] = $result->access;
			print $result->access;
		}
		else {
			print "";
		}
	}

?>	