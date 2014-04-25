<?php
	$teacher = true;
	session_start();
	$_SESSION['user']['id'] = 1;
    $user_id = $_SESSION['user']['id'];
    getAccess();
	function getAccess(){
		try{
			$pdo = new PDO('mysql:dbname=lenasys; host=localhost', 'root','');
		}catch(PDOException $e){
			echo $e;
		}
		if($_POST['testid'] != "undefined") {
			$testid = $_POST['testid'];
			$query = "SELECT users_courses.access FROM test,users_courses where test.cid = users_courses.cid and test.id = :testid and users_courses.uid = :uid";
			$params = array(':uid' => $_SESSION['user']['id'],':testid' => $testid);
		}
		elseif($_POST['courseid'] != "undefined") {
			$cid = $_POST['courseid'];
			$query = "SELECT access from users_courses where uid = :uid and cid = :cid";
			$params = array(':uid' => $_SESSION['user']['id'], ':cid' => $cid);
		}
		$stmt = $pdo->prepare($query);
		$stmt->execute($params);
		$result = $stmt->fetch(PDO::FETCH_OBJ);

		$_SESSION['user']['permission'] = $result->access;
		print $result->access;
	}

?>	