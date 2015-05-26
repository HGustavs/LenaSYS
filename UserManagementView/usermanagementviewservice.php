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
	$classname = getOP('classname');
	$retrievedData =  null;
	$studentid = getOP('studentid');
	$renderstudent = getOP('renderstudent');

	/* Failer handling for incorrect userid */

	if(isset($_SESSION['uid'])){
			$userid=$_SESSION['uid'];
	}else{
			$userid="UNK";
			$debug="Invalid userid";
			$retrievedData = array('debug' => $debug);
			echo json_encode($retrievedData);
	} 
	
	if($renderstudent == 'render'){
		$userid=$studentid;
	}
	
	if(isSuperUser($userid)){
			$isTeacher=true;
	}else{
			$isTeacher=false;
	}
	error_log(print_r($userid,true));
	$debug="NONE!";
	
	//------------------------------------------------------------------------------------------------
	// Queries
	//------------------------------------------------------------------------------------------------
	
	//###################################### Teacher queries #########################################
	
	$classDropMenu = "SELECT class.class,class.classcode FROM class,user WHERE user.uid = '".$userid."' AND class.responsible = user.uid order by class.classcode;";
	$studentInformation = "SELECT user.uid, CONCAT(firstname, ' ', lastname) AS fullname,user.username,user.ssn,user.email FROM user,class WHERE class.class = user.class and class.class = '".$classname."' ORDER BY user.lastname ASC;";
	
	$studentResults = "SELECT course.coursename,(SELECT SUM(hp) FROM studentresultCourse WHERE username= :uid 
							AND studentresultCourse.cid=course.cid) AS result, course.hp FROM user_course, course, programcourse 
							WHERE user_course.uid = :uid AND programcourse.class =  '".$classname."'
							AND programcourse.cid = course.cid AND user_course.cid = course.cid
							ORDER BY user_course.period ASC;";
	
	$classCourses = "SELECT course.cid, course.coursecode AS name, course.hp FROM course, programcourse WHERE programcourse.class =  '".$classname."' AND programcourse.cid = course.cid;";
	$classCoursesResults = "SELECT SUM(hp) AS result FROM studentresultCourse WHERE studentresultCourse.cid = :cid GROUP BY username HAVING SUM(hp) >= :hp;";
	$classStudentCount = "SELECT COUNT(uid) AS count FROM user WHERE user.class = '".$classname."';";

	//###################################### Student queries ##########################################
	$titleQuery = "SELECT CONCAT(firstname, ' ', lastname) AS fullname, class FROM user WHERE user.uid = '".$userid."';";
	$reg_course_student = "SELECT (SELECT course.coursecode from course where course.cid = course_req.cid) AS coursecode, 
							(SELECT course.coursecode from course where course.cid =course_req.req_cid) AS reg_coursecode
 								from course, course_req where course.cid= course_req.cid;";
	$progressbarQuery = "SELECT (SELECT SUM(hp) FROM studentresultCourse WHERE username = '".$userid."') AS completedHP, class.hp as totalHP FROM user_course, course, class, user 
						WHERE user_course.uid = '".$userid."' AND user_course.cid = course.cid AND user.class = class.class";
						
	$coursesQuery = "SELECT course.coursename, course.coursecode, (SELECT SUM(hp) FROM studentresultCourse
	WHERE username='".$userid."' AND studentresultCourse.cid=course.cid) AS result, course.hp, CONCAT(user.firstname,' ',user.lastname) AS coordinator, course.courseHttpPage, user_course.period ,user_course.term 
	FROM user_course, course, user WHERE user_course.uid = '".$userid."' AND user_course.cid = course.cid AND user.uid=course.creator ORDER BY user_course.period ASC";
	
	//------------------------------------------------------------------------------------------------
	// Retrieve Teacher information
	//------------------------------------------------------------------------------------------------
	
	if($isTeacher) {
	
		// Get data for the tool bar
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
		
		//Get userdata for the given class (view data)
		else if(strcmp($opt, 'VIEW') === 0) {
			$courselist = array();
			$query = $pdo->prepare($classCourses);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 

			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){

					/* -- Nestled query to get sum of hp and amount of students who's completed course -- */ 
					$sql_query = $pdo->prepare($classCoursesResults);
					$sql_query->bindParam(':cid', $row['cid']);
					$sql_query->bindParam(':hp', $row['hp']);
					$result = 0;
		
					if(!$sql_query->execute()) {
						$error=$sql_query->errorInfo();
						$debug="Error reading data from user ". $error[2]; 
					} else {
			
						foreach($sql_query->fetchAll(PDO::FETCH_ASSOC) as $result_row){
							$result = $result + $result_row['result'];
						}
			
					}

					$sql_query = $pdo->prepare($classStudentCount);
		
					if(!$sql_query->execute()) {
						$error=$sql_query->errorInfo();
						$debug="Error reading data from user ". $error[2]; 
					} else {
			
						foreach($sql_query->fetchAll(PDO::FETCH_ASSOC) as $count_row){
							$count = $count_row['count'];
						}
			
					}
				

					array_push(
						$courselist,
						array(
							'name' 			=> $row['name'],
							'hp'			=> $row['hp'],
							'result'		=> $result,
							'studentCount'	=> $count
						)
					);
				}
			}


			$studentlist = array();
			$query = $pdo->prepare($studentInformation);

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 

			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
				
					/* -------------------------------------------------------- */
					/* -- Nestled query to get results for the given student -- */ 
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
									'coursename' => $course_row['coursename'],
									'result' => $course_row['result'],
									'hp'	 => $course_row['hp']
								)
							);
						}
			
					}
					/* ------------------------------------------------------- */
					
					array_push(
						$studentlist,
						array(
							'uid' => $row['uid'],
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
					'courselist'	=> $courselist,
					'debug' 		=> $debug
				);
			}
		}
	}
	
	//------------------------------------------------------------------------------------------------
	// Retrieve Student information
	//------------------------------------------------------------------------------------------------
	
	else {
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

			// requierments for hover effects.
			$reqCourses = array();
			
			$query = $pdo->prepare($reg_course_student);
			
			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error reading data from user ". $error[2]; 
			} else {
				foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
					array_push(
						$reqCourses,
						array(
							'coursecode' => $row['coursecode'],
							'reg_coursecode' => $row['reg_coursecode']
							)
					);
				}
			}
			
			$year = array();
			
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
							'course_responsible' => $row['coordinator'],
							'course_link' => $row['courseHttpPage'],
							'term' => $row['term'],
							'period' => $row['period'],
							'coursecode' => $row['coursecode']
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
				'reqCourses'=> $reqCourses,
				'debug' 	=> $debug
			);
			
	}
	
	//Pass the data
	echo json_encode($retrievedData);
	
?>
