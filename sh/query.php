<?php 
function courseQuery($course){
	global $pdo;
	$urlkey = $course;
	$c = '"%' . $course . '%"';
	$sql = "SELECT cid, coursename, activeversion, coursecode 
	 FROM course 
	 WHERE (cid LIKE " . $c . " OR coursename LIKE " . $c . 
	 " OR activeversion LIKE " . $c . 
	 " OR coursecode LIKE " . $c . ")
	 AND visibility=1";
	$array = array();

	foreach ($pdo->query($sql) as $row) {
		$cid = $row['cid'];
		$coursename = $row['coursename'];
		$coursecode = $row['coursecode'];
		$courseservers = $row['activeversion'];
		$course = new Course($cid, $coursename, $coursecode, $courseservers);
		$array[] = $course;
	}

	$count = count($array);

	if($count == 0){
		echo 'No matches found';
		return 'UNK';
	}
	if($count > 1){
		echo "Try a more narrow query, these were your matches:<br>";
		for($i=0; $i<$count;$i++){
		$array[$i]->test();
		}
		return 'UNK';
	} 

	insertCoursekey($array[0],$urlkey);
	return $array;
}

function keyQuery($course){
	global $pdo;
	$sql = "SELECT * FROM coursekeys WHERE urlkey LIKE '".$course."';";
	$query = $pdo->prepare($sql);
	$query->execute();
	$count = $query->rowCount();
	$array = array();

	if($count == 1) {
		foreach ($query as $row) {
			$cid = $row['cid'];
			$coursename = $row['coursename'];
			$coursecode = $row['coursecode'];
			$courseservers = $row['activeversion'];
			$course = new Course($cid, $coursename, $coursecode, $courseservers);
			$array[] = $course;
			return $array;			
	} 		
	} else return courseQuery($course);	
}

function insertCoursekey($c, $course){
	global $pdo;
	$sql = "INSERT INTO coursekeys(cid, urlkey, coursecode, coursename, activeversion)
	VALUES (".$c->getCid().", '".
	$course."', '".
	$c->getCoursecode()."', '".
	$c->getCoursename()."', ".
	$c->getCourseserver()." );";

	$query = $pdo->prepare($sql);
	try{
	$query->execute();
	}
	catch(Exception $e){
		echo 'Error. The urlkey already exists.';
	}
}

function queryToUrl($course, $assignment){
	global $pdo;	
	$array = keyQuery($course);	
	$c = $array[0];

	if($array=='UNK')
		return 'UNK';

	if($course == 'UNK')
		echo "Unknown Course";

	if($assignment != 'UNK'){
		$a = assignmentQuery($assignment);
		$url = "/LenasSYS/DuggaSys/showdoc.php?cid=" . 
			$a['cid'] ."&coursevers=" . 
			$c['courseservers'] ."&fname=" . 
			$a['filename'];
	}
	else $url = "/LenaSYS/DuggaSys/sectioned.php?courseid=" . 
		$c->getCid() ."&coursename=" . 
		$c->getCoursename() . "&coursevers=" .  
		$c->getCourseserver();

	return $url; 
}