<?php 
	
		date_default_timezone_set("Europe/Stockholm");
	
		// Include basic application services!
		include_once("../../Shared/sessions.php");
		include_once("../../Shared/courses.php");
	
		// Connect to database and start session
		pdoConnect();
		session_start();
	
		$courseid=$_POST['courseid'];
		$opt=$_POST['opt'];	
		
		$debug="NONE!";
		if(checklogin()){
			$ha = hasAccess($_SESSION['uid'], $courseid, 'w') || isSuperUser($_SESSION["uid"]);
			if($ha){
				$entries=array();
				if (strcmp("example", $opt) === 0) {
					$query = $pdo->prepare("SELECT exampleid AS id, examplename AS name FROM codeexample WHERE cid = :1");
				} else {
					// Implement this in test database
					$query = $pdo->prepare("SELECT * FROM quiz WHERE cid = :1");
				}
				$query -> bindParam(':1', $courseid);
				$result=$query->execute();
				if (!$result) err("SQL Query Error: ".$pdo->errorInfo(),"Field Querying Error!");
				foreach($query->fetchAll() as $row) {
					array_push(
						$entries,
						array(
							'id' => $row['id'],
							'name' => $row['name'],
						)
					);
				}
				$array = array(
					'entries' => $entries,
				);
				
				echo json_encode($array);
			} else {
				echo json_encode("No access");
			}
		} else {
			echo json_encode("No access");
		}
?>
