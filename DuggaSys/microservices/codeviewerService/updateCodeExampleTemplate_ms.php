<?php

//
// This microservice is used on DuggaSys when you create a new code example for a course and chose a template to display that code
// The microservice selects the selected template and retrieves a CSS-file containing the template to display on the page. The code for displaying different 
// CSS-files can be found in codeviewerService.php and dugga.js
//

date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../curlService.php";

pdoConnect();
session_start();

$userid = callMicroserviceGET("sharedMicroservices/getUid_ms.php");

// Checks and sets user rights
if(checklogin() && (hasAccess($userid, $courseId, 'w') || hasAccess($userid, $courseId, 'st'))){
	$writeAccess="w";
}else{
	$writeAccess="s";
}

$opt=getOP('opt');
$templateNumber=getOP('templateno');
$exampleId=getOP('exampleid');
$courseId=getOP('courseid');
$courseVersion=getOP('cvers');

if(checklogin() && ($writeAccess=="w" || isSuperUser($userid) == true)) {

    if(strcmp('SETTEMPL',$opt)===0){
        // Parse content array
        $content = getOP('content');
        $cArray = explode(',', $content);
        $multiArray = array_chunk($cArray, 3);

        $query = $pdo->prepare( "UPDATE codeexample SET templateid = :templateno WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
        $query->bindParam(':templateno', $templateNumber);
        $query->bindParam(':exampleid', $exampleId);
        $query->bindParam(':cid', $courseId);
        $query->bindParam(':cvers', $courseVersion);

        // Update code example to reflect change of template
        if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug.="Error updating code example: ".$error[2];
        }

        // There are at least two boxes, create two boxes to start with
        if($templateNumber==10) $boxCount=1;
        else if($templateNumber==1||$templateNumber==2) $boxCount=2;
        else if($templateNumber==3||$templateNumber==4 ||$templateNumber==8) $boxCount=3;
        else if($templateNumber==5||$templateNumber==6 ||$templateNumber==7) $boxCount=4;
        else if($templateNumber==9) $boxCount=5;

        // Create appropriate number of boxes
        for($i=1;$i<$boxCount+1;$i++){
            $kind = $multiArray[$i-1][0];
            $file = $multiArray[$i-1][1];
            $wordlist = $multiArray[$i-1][2];

            $query = $pdo->prepare("SELECT * FROM box WHERE boxid = :i AND exampleid = :exampleid;");

            $query->bindParam(':i', $i);
            $query->bindParam(':exampleid', $exampleId);
            $query->execute();

            if($query->fetch(PDO::FETCH_ASSOC)){
                // Update box, if it already exist
                $query = $pdo->prepare("UPDATE box SET boxcontent = :boxcontent, filename = :filename, wordlistid = :wordlistid WHERE boxid = :i AND exampleid = :exampleid;");
            } else if (!$query->fetch(PDO::FETCH_ASSOC)){
                // Create box, if it does not exist
                $query = $pdo->prepare("INSERT INTO box(boxid,exampleid,boxtitle,boxcontent,settings,filename,wordlistid,fontsize) VALUES (:i,:exampleid, :boxtitle, :boxcontent, :settings, :filename, :wordlistid, :fontsize);");
                $query->bindValue(':boxtitle', 'Title');
                $query->bindValue(':settings', '[viktig=1]'); //TODO: Check what viktig is and what it's for
                $query->bindValue(':fontsize', '9');
            } else {
                // Should be impossible to reach, only for safety
                continue;
            }

            $query->bindParam(':i', $i);
            $query->bindParam(':exampleid', $exampleId);
            $query->bindValue(':boxcontent', $kind);
            $query->bindValue(':filename', $file);
            $query->bindValue(':wordlistid', $wordlist);
            
            // Update code example to reflect change of template
            if(!$query->execute()) {
                $error=$query->errorInfo();
                // If we get duplicate key error message, ignore error, otherwise carry on adding to debug message
                if(strpos($error[2],"Duplicate entry")==-1) $debug.="Error creating new box: ".$error[2];
            }
        }
    }
}