<?php

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services
	include_once ("../../../../coursesyspw.php");
	include_once ("../../../Shared/sessions.php");
	include_once ("../../../Shared/basic.php");
	//include ('../Misc/checkUserStatus.php'); //Need to check user status

	//Remove when ms is working
	//include_once ("../../../Shared/courses.php");
	//include_once ("../../../Shared/database.php");

	// Connect to database and start session
	pdoConnect();
	session_start();

	// Global variables
	$exampleId=getOP('exampleid');
	$boxId=getOP('boxid');
	$opt=getOP('opt');
	
	// Checks user id, if user has none a guest id is set
	if(isset($_SESSION['uid'])){
		$userid=$_SESSION['uid'];
	}else{
		$userid="1";
	}

	$log_uuid = getOP('log_uuid');
	$log_timestamp = getOP('log_timestamp');

	$log_uuid = getOP('log_uuid');
	$info="opt: ".$opt." courseId: ".$courseId." courseVersion: ".$courseVersion." exampleName: ".$exampleName." sectionName: ".$sectionName." exampleId: ".$exampleId;
	logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "editBoxTitle.php",$userid,$info);

	$appuser=(array_key_exists('uid', $_SESSION) ? $_SESSION['uid'] : 0);

	$exampleCount = 0;

  	$query = $pdo->prepare( "SELECT exampleid,sectionname,examplename,runlink,cid,cversion,beforeid,afterid,public FROM codeexample WHERE exampleid = :exampleid;");
  	$query->bindParam(':exampleid', $exampleId);
	$query->execute();

	while ($row = $query->fetch(PDO::FETCH_ASSOC)){
		$exampleCount++;
	}

	// TODO: Better handle a situation where there are no examples available
	if($exampleCount>0){
		if(checklogin() && ($writeAccess=="w" || isSuperUser($_SESSION['uid']))) {

			if(strcmp('EDITTITLE',$opt)===0) {
				$exampleid = $_POST['exampleid'];
				$boxId = $_POST['boxid'];
				$boxTitle = $_POST['boxtitle'];

				$query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle WHERE boxid=:boxid AND exampleid=:exampleid;");
				$query->bindParam(':boxtitle', $boxTitle);
				$query->bindValue(':exampleid', $exampleId);
				$query->bindParam(':boxid', $boxId);
				$query->execute();

				echo json_encode(array('title' => $boxTitle, 'id' => $boxId));
				return;
			} 
		}
    }
?>