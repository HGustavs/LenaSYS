<?php
    date_default_timezone_set("Europe/Stockholm");

    // Include basic application services
	include_once ("../../coursesyspw.php");
	include_once ("../Shared/sessions.php");
	include_once ("../Shared/basic.php");
	include_once ("../Shared/courses.php");
	include_once ("../Shared/database.php");

    // Connect to database and start session
	pdoConnect();
	session_start();
    
    require '../Misc/checkUserStatus.php'; //Need to check user status
    require '/codeViewerRetriveInformation.php'; //Retrive information, not sure if relevent
    include '../Misc/checkUserStatus.php'; //Console debug

    echo checkUserStatusTest();
    echo consoleDebug("Test");

    // Global variables
	$exampleId=getOP('exampleid');
	$boxId=getOP('boxid');
	$opt=getOP('opt');    

    //Check access
    if(checklogin() && ($hasWriteAccess==true || $hasSuperAccess==true)){
    //if(checklogin() && ($writeAccess=="w" || isSuperUser($_SESSION['uid']))) {
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

    echo retrieveCodeViewerInformation();

    
?>