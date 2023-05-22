<?php

	date_default_timezone_set("Europe/Stockholm");

	// Include basic application services
	include_once ("../../../../coursesyspw.php");
	include_once ("../../../Shared/sessions.php");
	include_once ("../../../Shared/basic.php");
	include ('../Misc/checkUserStatus.php'); //Need to check user statuss

	// Connect to database and start session
	pdoConnect();
	session_start();

	// Global variables
	$exampleId=getOP('exampleid');
	$boxId=getOP('boxid');
	$opt=getOP('opt');
	
	cUST();

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