<?php

	//---------------------------------------------------------------------------------------------------------------
	// UserMangagementService - Displays student data or teacher data for a specified course
	//---------------------------------------------------------------------------------------------------------------

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services!
	include_once "../Shared/basic.php";
	include_once "../Shared/sessions.php";

	// Connect to database and start session
	pdoConnect();
	session_start();

	
	$opt = getOP('opt');
	$pnr = getOP('pnr');
	$studyprogram = getOP('username');
	$classname = getOP('classname');

	
	if(isset($_SESSION['uid'])){
			$userid=$_SESSION['uid'];
	}else{
			$userid="UNK";	
	} 
	

	
	if(isSuperUser($userid)){
			$isTeacher=true;
	}else{
			$isTeacher=false;
	}

	
	$debug="NONE!";
	
	//------------------------------------------------------------------------------------------------
	// Queries
	//------------------------------------------------------------------------------------------------
	
	//queries teachers
	
	$classDropMenu = "SELECT class.class,class.classcode FROM class,user WHERE user.uid = '".$userid."' AND class.responsible = user.uid order by class.classcode;";
	$studentInformation = "SELECT user.uid, CONCAT(firstname, ' ', lastname) AS fullname,user.username,user.ssn,user.email FROM user,class WHERE class.class = user.class and class.class = '".$classname."';";
	
	$studentResults = "SELECT (SELECT SUM(hp) FROM studentresultCourse WHERE username= :uid 
							AND studentresultCourse.cid=course.cid) AS result FROM user_course, course, programcourse 
							WHERE user_course.uid = :uid AND programcourse.class =  '".$classname."'
							AND programcourse.cid = course.cid AND user_course.cid = course.cid
							ORDER BY user_course.period ASC;";
	
	//queries student
	$titleQuery = "SELECT CONCAT(firstname, ' ', lastname) AS fullname, class FROM user WHERE user.uid = '".$userid."';";
	//$progressbarQuery = "SELECT SUM(user_course.result) AS completedHP, class.hp as totalHP FROM user_course, course, class, user 
		//				WHERE user_course.uid = '".$userid."' AND user_course.cid = course.cid AND user.class = class.class";
	$progressbarQuery = "SELECT (SELECT SUM(hp) FROM studentresultCourse WHERE username = '".$userid."') AS completedHP, class.hp as totalHP FROM user_course, course, class, user 
						WHERE user_course.uid = '".$userid."' AND user_course.cid = course.cid AND user.class = class.class";
	//$coursesQuery = "SELECT course.coursename, user_course.result, course.hp, CONCAT(user.firstname,' ',user.lastname) AS coordinator, course.courseHttpPage 
	//FROM user_course, course, user WHERE user_course.uid = '".$userid."' AND user_course.cid = course.cid AND user.uid=course.creator";
	$coursesQuery = "SELECT course.coursename, (SELECT SUM(hp) FROM studentresultCourse
	WHERE username='".$userid."' AND studentresultCourse.cid=course.cid) AS result, course.hp, CONCAT(user.firstname,' ',user.lastname) AS coordinator, course.courseHttpPage, user_course.period ,user_course.term 
	FROM user_course, course, user WHERE user_course.uid = '".$userid."' AND user_course.cid = course.cid AND user.uid=course.creator ORDER BY user_course.period ASC";
	//------------------------------------------------------------------------------------------------
	// Retrieve information
	//------------------------------------------------------------------------------------------------
	
	$retrievedData =  null;
	
	if($isTeacher) {
		//retrieve teacher data

		if(strcmp($opt,'TOOLBAR') === 0){
			
			//retrive data for dropdownmenu 
			$classes = array();
			$query = $pdo->prepare($classDropMenu);
		
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 

			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
					array_push(
						$classes,
						array(
							'class' => $row['class'],
							'classcode' => $row['classcode']
						)
					);
				}

				$retrievedData 	= array(
					'type'		=> $opt,
					'classes'	=> $classes,
					'debug' 	=> $debug
				);
			}
		}
		else if(strcmp($opt, 'VIEW') === 0) {
			//retive data for studentlist
			$studentlist = array();
			$query = $pdo->prepare($studentInformation);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 

			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
				
					/* Nestled query to get results for the given student */ 
					$course_results = array();
					$sql_query = $pdo->prepare($studentResults);
					$sql_query->bindParam(':uid', $row['uid']);
		
					if(!$sql_query->execute()) {
						$error=$sql_query->errorInfo();
						$debug="Error reading data from user ". $error[2]; 
					} else {
			
						foreach($sql_query->fetchAll(PDO::FETCH_ASSOC) as $course_row){
							array_push(
								$course_results,
								array(
									'result' => $course_row['result']
								)
							);
						}
			
					}
				
					array_push(
						$studentlist,
						array(
							'fullname' => $row['fullname'],
							'username' => $row['username'],
							'ssn'	   => $row['ssn'],
							'email'	   => $row['email'],
							'results'   => $course_results	//Add the results for the student
						)
					);
				}

				$retrievedData 	= array(
					'type'			=> $opt,
					'classname'		=> $classname,
					'studentlist'	=> $studentlist,
					'debug' 		=> $debug
				);
			}
		}
	}
	else {
			//retrieve student data
			
			// data for title
			$fullname = "";
			$class = "";
			
			$query = $pdo->prepare($titleQuery);
			
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 
			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
					$fullname 	= $row['fullname'];
					$class		= $row['class'];
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
							'completedHP' => $row['completedHP'],
							'totalHP' => $row['totalHP']
							)
					);
				}
			}
			
			$year = array();
			
			// data for course
			$courses = array();
			
			//When executing query result is not correct below
			
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
							'course_responsible' => $row['coordinator'],
							'course_link' => $row['courseHttpPage'],
							'term' => $row['term'],
							'period' => $row['period']
							)
					);
				}
			}
			
			$year = array(
				'value' => '1',
				'courses' => $courses
			);
			
			
			
			$retrievedData 	= array(
				'fullname' 	=> $fullname,
				'class' 	=> $class,
				'progress' 	=> $progress,
				'year' 		=> $year,
				'debug' 	=> $debug
			);
			
	}
	
	echo json_encode($retrievedData);
	
?>
