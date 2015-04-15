<?php

	//---------------------------------------------------------------------------------------------------------------
	// UserMangagementService - Displays User Course Status or Study Program Status
	//---------------------------------------------------------------------------------------------------------------

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	// Connect to database and start session
	pdoConnect();
	session_start();

	
	$pnr = getOP('pnr');
	$studyprogram = getOP('username');
	

	
	if(isset($_SESSION['uid'])){
			$userid=$_SESSION['uid'];
	}else{
			$userid="UNK";	
	} 
	

	
	if(isSuperUser($userid)){
			$superUser=true;
	}else{
			$superUser=false;
	}

	
	$debug="NONE!";
	
	//------------------------------------------------------------------------------------------------
	// Queries
	//------------------------------------------------------------------------------------------------
	
	//queries teachers
	
	//queries student
	$titleQuery = "SELECT CONCAT(firstname, ' ', lastname) AS fullname, class FROM user WHERE user.uid = '".$userid."';";
	//$progressbarQuery = "";
	//$yearQuery = "";
	
	//------------------------------------------------------------------------------------------------
	// Retrieve information
	//------------------------------------------------------------------------------------------------
	
	$retrievedData =  null;
	
	if($superUser) {
		//retrieve teacher data
	}
	else {
			//retrieve student data
			
			$titleData = array();
			
			$query = $pdo->prepare($titleQuery);
			
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 
			} else {
				
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
					array_push(
						$titleData,
						array(
							'fullname' => $row['fullname'],
							'class' => $row['class']
							)
					);
				}
			}
			
			$retrievedData = array(
				'titleData' => $titleData,
				'debug' => $debug
			);
			
	}
	
	echo json_encode($retrievedData);

	
?>
