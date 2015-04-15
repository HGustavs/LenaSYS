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
	$progressbarQuery = "SELECT SUM(user_course.result) AS finishedHP, class.hp as totalHP FROM user_course, course, class, user 
						WHERE user_course.uid = '".$userid."' AND user_course.cid = course.cid AND user.class = class.class";
	$coursesQuery = "SELECT course.coursename, user_course.result, course.hp, concat(user.firstname,' ',user.lastname) AS coordinator, course.courseHttpPage FROM user_course, course, user WHERE user_course.uid = '".$userid."' AND user_course.cid = course.cid AND user.uid=course.creator";
	
	//------------------------------------------------------------------------------------------------
	// Retrieve information
	//------------------------------------------------------------------------------------------------
	
	$retrievedData =  null;
	
	if($superUser) {
		//retrieve teacher data
	}
	else {
			//retrieve student data
			
			// data for title
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
			
			// data for progressbar
			$progress = array();
			
			$query = $pdo->prepare($progressbarQuery);
			
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 
			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
					array_push(
						$progress,
						array(
							'finishedHP' => $row['finishedHP'],
							'totalHP' => $row['totalHP']
							)
					);
				}
			}
			
			// data for course
			$courses = array();
			
			$query = $pdo->prepare($coursesQuery);
			
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 
			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
					array_push(
						$courses,
						array(
							'coursename' => $row['coursename'],
							'result' => $row['result'],
							'hp' => $row['hp'],
							'coordinator' => $row['coordinator'],
							'courseHttpPage' => $row['courseHttpPage']
							)
					);
				}
			}
			
			
			
			$retrievedData = array(
				'titleData' => $titleData,
				'progress' => $progress,
				'courses' => $courses,
				'debug' => $debug
			);
			
	}
	
	echo json_encode($retrievedData);

	
?>
