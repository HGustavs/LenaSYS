

<?php
//-------------------------------------------------------------------------------------------------------
// Microservice updateQuizDeadline updates the deadline for a quiz (dugga)
//-------------------------------------------------------------------------------------------------------

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../../../DuggaSys/gitfetchService.php";

// Connect to database and start session
pdoConnect();
session_start();

//should be replaced with getuid when getuid is fixed, see monolithic-to-microservices.md
if(isset($_SESSION['uid'])){
	$userid=$_SESSION['uid'];
}else{
	$userid="guest";
}

$opt=getOP('opt');
$courseid=getOP('courseid');
$link=getOP('link');

$deadline=getOP('deadline');
$relativedeadline=getOP('relativedeadline');
$studentTeacher = false;

		if(checklogin()){
			if(isset($_SESSION['uid'])){
				$userid=$_SESSION['uid'];
				$hasread=hasAccess($userid, $courseid, 'r');
				$studentTeacher=hasAccess($userid, $courseid, 'st');
				$haswrite=hasAccess($userid, $courseid, 'w');
			}else{
				$userid="guest";
			}
			
			if(strcmp($opt,"UPDATEDEADLINE")===0){
				$deadlinequery = $pdo->prepare("UPDATE quiz SET deadline=:deadline, relativedeadline=:relativedeadline WHERE id=:link;");
				$deadlinequery->bindParam(':deadline',$deadline);
				$deadlinequery->bindParam(':relativedeadline',$relativedeadline);
				$deadlinequery->bindParam(':link',$link);
				
				if(!$deadlinequery->execute()){
					$error=$deadlinequery->errorInfo();
					$debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
				}
			}
		}
?>
