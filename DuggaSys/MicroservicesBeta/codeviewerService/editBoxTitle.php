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
    
    // Global variables
	$exampleId=getOP('exampleid');
	$boxId=getOP('boxid');
	$opt=getOP('opt');
    
    
    require __DIR__ . '../Misc/checkUserStatus.php'; //Need to check user status
    require __DIR__ . '/codeViewerRetriveInformation.php'; //Retrive information, not sure if relevent
    require __DIR__ . '../Misc/checkUserStatus.php'; //Console debug

    echo checkUserStatusTest();
    echo consoleDebug("Test");

    //Check access
    //if(checklogin() && ($hasWriteAccess==true || $hasSuperAccess==true)){
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
    //}

    echo retrieveCodeViewerInformation();

    
?>