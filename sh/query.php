<?php 

//Queries the entire course table
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
		echo "Error: Try a more narrow query, there were multiple matches.";
		return 'UNK';
	} 

	insertCoursekey($array[0],$urlkey);
	return $array;
}
//Queries the existing table of unique matches
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

//Inserts a value into the table
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

//returns potential values before LenaSYS in the server address.
function serverRoot(){
	$self = $_SERVER["PHP_SELF"]; 
	$root = explode('/',$self);
	$docroot = array();
	for ($i=0;$i<count($root);$i++){
		if($root[$i] == 'LenaSYS'){
			break;
		}elseif ($root[$i]!=''){
			$u = '/'.$root[$i];
			$docroot[] = $u;
		}

	}
	$result = implode($docroot);
	return $result;
}

//Parses a query value to a url
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
		$url = serverRoot()."/LenasSYS/DuggaSys/showdoc.php?cid=" . 
			$a['cid'] ."&coursevers=" . 
			$c['courseservers'] ."&fname=" . 
			$a['filename'];
	}
	else $url = serverRoot()."/LenaSYS/DuggaSys/sectioned.php?courseid=" . 
		$c->getCid() ."&coursename=" . 
		$c->getCoursename() . "&coursevers=" .  
		$c->getCourseserver();

	return $url;
}