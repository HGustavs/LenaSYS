<?php

//---------------------------------------------------------------------------------------------------------------
// editorService - Saves and Reads content for Code Editor
//---------------------------------------------------------------------------------------------------------------

// Missing Functionality
//		New Code Example + New Dugga
//		Graying link accordingly

date_default_timezone_set("Europe/Stockholm");

include ('../shared_microservices/getUid_ms.php');

getUid();

// Connect to database and start session
pdoConnect();
session_start();

$opt=getOP('opt');
$coursename=getOP('coursename');
$coursecode=getOP('coursecode');
$courseGitURL=getOP('courseGitURL'); // for github url

$ha=null;

$query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
$query->bindParam(':uid', $userid);
$query-> execute();

while ($row = $query->fetch(PDO::FETCH_ASSOC)){
	$username = $row['username'];
}

$isSuperUserVar=false;

if(checklogin()){
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="UNK";
	}
	$isSuperUserVar=isSuperUser($userid);

	$ha = $isSuperUserVar;

	if($ha){

			$query = $pdo->prepare("INSERT INTO course (coursecode,coursename,visibility,creator, hp, courseGitURL) VALUES(:coursecode,:coursename,0,:usrid, 7.5, :courseGitURL)");

			$query->bindParam(':usrid', $userid);
			$query->bindParam(':coursecode', $coursecode);
			$query->bindParam(':coursename', $coursename);
			$query->bindParam(':courseGitURL', $courseGitURL); // for github url

			if(!$query->execute()) {
				$error=$query->errorInfo();
				$debug="Error updating entries\n".$error[2];
			} 

			echo json_encode(array('code' => $coursecode, 'name' => $coursename, 'debug' => $debug));
			return;
			
		
	}
}

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

$entries=array();

$queryreg = $pdo->prepare("SELECT cid FROM user_course WHERE uid=:uid");
$queryreg->bindParam(':uid', $userid);

if(!$queryreg->execute()) {
    $error=$queryreg->errorInfo();
    $debug="Error reading courses\n".$error[2];
}

$userRegCourses = array();
foreach($queryreg->fetchAll(PDO::FETCH_ASSOC) as $row){
    $userRegCourses[$row['cid']] = $row['cid'];
}

$queryz = $pdo->prepare("SELECT cid,access FROM user_course WHERE uid=:uid;");
$queryz->bindParam(':uid', $userid);

if(!$queryz->execute()) {
	$error=$queryz->errorInfo();
	$debug="Error reading courses\n".$error[2];
}

$userCourse = array();
foreach($queryz->fetchAll(PDO::FETCH_ASSOC) as $row){
	$userCourse[$row['cid']] = $row['access'];
}

//Delete course matterial from courses that have been marked as deleted.
$deleted = 3;
$query = $pdo->prepare("DELETE codeexample FROM course,codeexample WHERE course.visibility=:deleted AND codeexample.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
} 

$query = $pdo->prepare("DELETE listentries FROM course,listentries WHERE course.visibility=:deleted AND listentries.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
} 

$query = $pdo->prepare("DELETE quiz FROM course,quiz WHERE course.visibility=:deleted AND quiz.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
} 

$query = $pdo->prepare("DELETE vers FROM course,vers WHERE course.visibility=:deleted AND vers.cid = course.cid;");
$query->bindParam(':deleted', $deleted);
 if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
} 

//Delete Courses that have been marked as deleted.
$query = $pdo->prepare("DELETE course FROM course WHERE visibility=:deleted;");
$query->bindParam(':deleted', $deleted);
if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
}


$query = $pdo->prepare("SELECT coursename,coursecode,cid,visibility,activeversion,activeedversion FROM course ORDER BY coursename");

/*

0 == hidden
1 == public
2 == login
3 == deleted

*/

if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
}else{
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
			$writeAccess = false;
			if (isset ($userCourse[$row['cid']])){
					if ($userCourse[$row['cid']] == "W") $writeAccess = true;
			}
			if ($isSuperUserVar ||
			$row['visibility']==1 ||
			($row['visibility']==2 && (isset ($userCourse[$row['cid']] ))) ||
			($row['visibility']==0 && $writeAccess)){
				$isRegisteredToCourse = false;
				foreach($userRegCourses as $userRegCourse){
					if($userRegCourse == $row['cid']){
						$isRegisteredToCourse = true;
						break;
					}
				}
				array_push(
					$entries,
					array(
						'cid' => $row['cid'],
						'coursename' => $row['coursename'],
						'coursecode' => $row['coursecode'],
						'visibility' => $row['visibility'],
						'activeversion' => $row['activeversion'],
						'activeedversion' => $row['activeedversion'],
						'registered' => $isRegisteredToCourse
						)
					);
			}
		}
}

$versions=array();
$query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt FROM vers;");

if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading courses\n".$error[2];
}else{
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		array_push(
			$versions,
			array(
				'cid' => $row['cid'],
				'coursecode' => $row['coursecode'],
				'vers' => $row['vers'],
				'versname' => $row['versname'],
				'coursename' => $row['coursename'],
				'coursenamealt' => $row['coursenamealt']
			)
		);
	}
}


$query=$pdo->prepare("SELECT motd,readonly FROM settings;");

if(!$query->execute()) {
	$error=$query->errorInfo();
	$debug="Error reading settings\n".$error[2];
}else{
	$motd="UNK";
	$readonly=0;
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		$motd=$row["motd"];
		$readonly=$row["readonly"];
	}
}



$array = array(
	'LastCourseCreated' => $LastCourseCreated,
	'entries' => $entries,
	'versions' => $versions,
	"debug" => $debug,
	'writeaccess' => $ha,
	'motd' => $motd,
	'readonly' => $readonly
	);

?>