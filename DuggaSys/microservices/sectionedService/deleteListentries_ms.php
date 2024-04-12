<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";
include('../shared_microservices/getUid_ms.php');

// Connect to database and start session
pdoConnect();
session_start();

$userid = getUid();
if (checklogin()) { //This entire checklogin should be working by using the getUid instead, but for the time being it doesn't.

    if(isSuperUser($userid)) {

    // Gets username based on uid, USED FOR LOGGING
    $query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
    $query->bindParam(':uid', $userid);
    $query-> execute();

    // This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
    while ($row = $query->fetch(PDO::FETCH_ASSOC)){
        $username = $row['username'];
    }


    $opt=getOP('opt');
    $courseid=getOP('courseid');
    $coursevers=getOP('coursevers');
    $moment=getOP('moment');
    $sectid=getOP('lid');
    $sectname=getOP('sectname');
    $kind=getOP('kind');
    $link=getOP('link');
    $visibility=getOP('visibility');
    $order=getOP('order');
    $gradesys=getOP('gradesys');
    $highscoremode=getOP('highscoremode');
    $versid=getOP('versid');
    $coursename=getOP('coursename');
    $versname=getOP('versname');
    $coursecode=getOP('coursecode');
    $coursenamealt=getOP('coursenamealt');
    $comments=getOP('comments');
    $makeactive=getOP('makeactive');
    $startdate=getOP('startdate');
    $enddate=getOP('enddate');
    $showgrps=getOP('showgrp');
    $grptype=getOP('grptype');
    $deadline=getOP('deadline');
    $relativedeadline=getOP('relativedeadline');
    $pos=getOP('pos');
    $jsondeadline = getOP('jsondeadline');
    $studentTeacher = false;
    $feedbackenabled =getOP('feedback');
    $feedbackquestion =getOP('feedbackquestion');
    $motd=getOP('motd');
    $tabs=getOP('tabs');
    $exampelid=getOP('exampleid');
    $url=getOP('url');

    $lid=getOP('lid');
    $visbile = 0;
    $avgfeedbackscore = 0;

    $grpmembershp="UNK";
    $unmarked = 0;
    $groups=array();
    $grplst=array();

    if($feedbackenabled != 1){
        $feedbackenabled = 0;
    }

    if($gradesys=="UNK") $gradesys=0;

            $today = date("Y-m-d H:i:s");

            $debug="NONE!";

            $info="opt: ".$opt." courseid: ".$courseid." coursevers: ".$coursevers." coursename: ".$coursename;
            $log_uuid = getOP('log_uuid');
            logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "sectionedservice.php",$userid,$info);

            //------------------------------------------------------------------------------------------------
            // Services
            //------------------------------------------------------------------------------------------------

            
            $isSuperUserVar=false;

            $hasread=hasAccess($userid, $courseid, 'r');
            $studentTeacher=hasAccess($userid, $courseid, 'st');
            $haswrite=hasAccess($userid, $courseid, 'w');

            if(checklogin()){
                if(isset($_SESSION['uid'])){
                    $userid=$_SESSION['uid'];
                    $hasread=hasAccess($userid, $courseid, 'r');
                    $studentTeacher=hasAccess($userid, $courseid, 'st');
                    $haswrite=hasAccess($userid, $courseid, 'w');
                }else{
                    $userid="guest";
                }
                $stmt = $pdo->prepare("SELECT groupKind,groupVal FROM `groups`");

                if (!$stmt->execute()) {
                    $error=$stmt->errorInfo();
                    $debug="Error getting groups " . $error[2];
                } else {
                    foreach($stmt->fetchAll(PDO::FETCH_ASSOC) as $row){
                        if(!isset($groups[$row['groupKind']])){
                            $groups[$row['groupKind']]=array();
                        }
                        array_push($groups[$row['groupKind']],$row['groupVal']);
                    }
                }

                $isSuperUserVar=isSuperUser($userid);
                $ha = $haswrite || $isSuperUserVar;
                if(strcmp($opt,"GRP")===0) {
                    $query = $pdo->prepare("SELECT user.uid,user.username,/*user.firstname,user.lastname,*/user.email,user_course.groups FROM user,user_course WHERE user.uid=user_course.uid AND cid=:cid AND vers=:vers");
                    $query->bindParam(':cid', $courseid);
                    $query->bindParam(':vers', $coursevers);
                    /*
                    $glst=array();
                    if($showgrp!="UNK"){
                        foreach($groups as $grptype){
                            if(in_array($showgrp,$grptype)){
                                $glst=$grptype;
                                break;
                            }
                        }
                    }
                    */
                    if($query->execute()) {
                        $showgrps=explode(',',$showgrps);
                        $showgrp=$showgrps[0];
                        if($ha || $studentTeacher)$showgrp=explode('_',$showgrp)[0];
                        foreach($query->fetchAll() as $row) {
                            $grpmembershp=$row['groups'];
                            $idx=strpos($grpmembershp,$showgrp);
                            while($idx!==false){
                                $grp=substr($grpmembershp,$idx,strpos($grpmembershp,' ',$idx)-$idx);
                                $email=$row['email'];
                                if(is_null($email)){
                                    $email=$row['username']."@student.his.se";
                                }
                            //    array_push($grplst, array($grp,$row['firstname'],$row['lastname'],$email));
                                $idx=strpos($grpmembershp,$showgrp,$idx+1);
                            }
                        }
                        sort($grplst);
                        /*
                        foreach($query->fetchAll() as $row) {
                            if(isset($row['groups'])){
                                $grpmembershp = explode(" ", $row['groups']);

                                foreach($grpmembershp as $member){
                                    if($ha||in_array($member,$glst)){
                                    foreach($groups as $groupKind=>$group){
                                        if(in_array($member,$group)){
                                            if(!isset($grplst[$groupKind])){
                                                $grplst[$groupKind]=array();
                                            }
                                            if(!isset($grplst[$groupKind][$member])){
                                                $grplst[$groupKind][$member]=array();
                                            }
                                            array_push($grplst[$groupKind][$member], array($row['firstname'],$row['lastname'],$row['email']));
                                        }
                                    }

                                    }

                                }
                            }
                        }
                        */
                    }else{
                        $debug="Failed to get group members!";
                    }
                }
                
                if($ha || $studentTeacher) {
                    // The code for modification using sessions
                    if(strcmp($opt,"DEL")===0) {
                        $query = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid");
                        $query->bindParam(':lid', $sectid);

                        if(!$query->execute()) {
                            if($query->errorInfo()[0] == 23000) {
                                $debug = "The item could not be deleted because of a foreign key constraint.";
                            } else {
                                $debug = "The item could not be deleted.";
                            }
                        }

                    }
                    //This will change the visibility of a listentry to deleted instead of deleting the item from the database. This will enable restoring deleted items.
                    if(strcmp($opt,"DELETED")===0) {
                        $query = $pdo->prepare("UPDATE listentries SET visible = '3' WHERE lid=:lid");
                        $query->bindParam(':lid', $sectid);

                        if(!$query->execute()) {
                            if($query->errorInfo()[0] == 23000) {
                                $debug = "foreign key constraint.";
                            } else {
                                $debug = "Error.";
                            }
                        }
                    }
                    
                    else if(strcmp($opt,"NEW")===0) {

                        // Insert a new code example and update variables accordingly.
                        if($link==-1) {
                            $queryz2 = $pdo->prepare("SELECT * FROM codeexample ORDER BY exampleid DESC LIMIT 1");
                            if(!$queryz2->execute()) {
                                $error=$queryz2->errorInfo();
                                $debug="Error reading entries".$error[2];
                            }
                            foreach($queryz2->fetchAll() as $row) {
                                $sname=$row['exampleid'] + 1;
                            }
                                $sname = $sectname . $sname;
                                $query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);");

                                $query2->bindParam(':cid', $courseid);
                                $query2->bindParam(':cversion', $coursevers);
                                $query2->bindParam(':ename', $sectname);
                                $query2->bindParam(':sname', $sname);

                                if(!$query2->execute()) {
                                    $error=$query2->errorInfo();
                                    $debug="Error updating entries".$error[2];
                                }

                                $link=$pdo->lastInsertId();
                        }

                        $query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) 
                                                                VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind)");
                        
                        if ($kind == 4) {
                            $query->bindParam(':gradesys', $gradesys);
                        } else {
                            $query->bindParam(':gradesys', $tabs);
                        }

                        $query->bindParam(':cid', $courseid);
                        $query->bindParam(':cvs', $coursevers);
                        $query->bindParam(':usrid', $userid);
                        $query->bindParam(':entryname', $sectname);
                        $query->bindParam(':link', $link);
                        $query->bindParam(':kind', $kind);
                        $query->bindParam(':comment', $comments);
                        $query->bindParam(':visible', $visibility);
                        $query->bindParam(':highscoremode', $highscoremode);
                        $query->bindParam(':pos', $pos);	

                        if ($grptype != "UNK") {
                            $query->bindParam(':groupkind', $grptype);
                        } else {
                            $query->bindValue(':groupkind', null, PDO::PARAM_STR);

                            // Logging for newly added items
                            $description=$sectname;
                            logUserEvent($userid, $username, EventTypes::SectionItems,$sectname);

                        }


                        if(!$query->execute()) {
                            $error=$query->errorInfo();
                            $debug="Error updating entries".$error[2];
                        }

                    } else if(strcmp($opt,"REORDER")===0) {
                        $orderarr=explode(",",$order);

                        foreach ($orderarr as $key => $value) {
                            $armin=explode("XX",$value);
                            $query = $pdo->prepare("UPDATE listentries set pos=:pos,moment=:moment WHERE lid=:lid;");
                            $query->bindParam(':lid', $armin[1]);
                            $query->bindParam(':pos', $armin[0]);
                            $query->bindParam(':moment', $armin[2]);
                        

                            if(!$query->execute()) {
                                $error=$query->errorInfo();
                                $debug="Error updating entries".$error[2];
                            }
                        }
                    } else if(strcmp($opt,"UPDATE")===0) {

                        // Insert a new code example and update variables accordingly.
                        if($link==-1) {

                                // Find section name - Last preceding section name if none - assigns UNK - so we know that nothing was found
                                // kind 0 == Header || 1 == Section || 2 == Code  ||�3 == Test (Dugga)|| 4 == Moment�|| 5 == Link
                                $sname = "UNK";
                                $queryz = $pdo->prepare("SELECT entryname FROM listentries WHERE vers=:cversion AND cid=:cid AND (kind=1 or kind=0 or kind=4) AND (pos < (SELECT pos FROM listentries WHERE lid=:lid)) ORDER BY pos DESC LIMIT 1;");
                                $queryz->bindParam(':cid', $courseid);
                                $queryz->bindParam(':cversion', $coursevers);
                                $queryz->bindParam(':lid', $sectid);
                                if(!$queryz->execute()) {
                                    $error=$queryz->errorInfo();
                                    $debug="Error reading entries".$error[2];
                                }
                                foreach($queryz->fetchAll() as $row) {
                                            $sname=$row['entryname'];
                                }

                                $query2 = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion) values (:cid,:ename,:sname,1,:cversion);");

                                $query2->bindParam(':cid', $courseid);
                                $query2->bindParam(':cversion', $coursevers);
                                $query2->bindParam(':ename', $sectname);
                                $query2->bindParam(':sname', $sname);

                                if(!$query2->execute()) {
                                    $error=$query2->errorInfo();
                                    $debug="Error updating entries".$error[2];
                                }

                                $link=$pdo->lastInsertId();
                        }

                        $query = $pdo->prepare("UPDATE listentries set highscoremode=:highscoremode, gradesystem=:gradesys, moment=:moment,entryname=:entryname,kind=:kind,link=:link,visible=:visible,comments=:comments,groupKind=:groupkind, feedbackenabled=:feedbackenabled, feedbackquestion=:feedbackquestion WHERE lid=:lid;");
                    
                        if ($kind == 4) {
                            $query->bindParam(':gradesys', $gradesys);
                        } else {
                            $query->bindParam(':gradesys', $tabs);
                        }

                        $query->bindParam(':lid', $sectid);
                        $query->bindParam(':entryname', $sectname);
                        $query->bindParam(':comments', $comments);
                        $query->bindParam(':highscoremode', $highscoremode);
                        $query->bindParam(':feedbackenabled', $feedbackenabled);
                        $query->bindParam(':feedbackquestion', $feedbackquestion);

                        if ($grptype != "UNK") {
                            $query->bindParam(':groupkind', $grptype);
                        } else {
                            $query->bindValue(':groupkind', null, PDO::PARAM_STR);
                        }

                        if($moment=="null") $query->bindValue(':moment', null,PDO::PARAM_INT);
                        else $query->bindParam(':moment', $moment);

                        $query->bindParam(':kind', $kind);
                        $query->bindParam(':link', $link);
                        $query->bindParam(':visible', $visibility);

                        if(!$query->execute()) {
                            $error=$query->errorInfo();
                            $debug="Error updating entries".$error[2];
                        }

                        // insert into list forthe specific course
                        if($kind == 4){
                            $query2 = $pdo->prepare("INSERT INTO list(listnr,listeriesid,responsible,course) values('23415',:lid,'Christina Sjogren',:cid);");

                            $query2->bindParam(':cid', $courseid);
                            $query2->bindParam(':lid', $sectid);

                            if(!$query2->execute()) {
                                $error=$query2->errorInfo();
                                $debug="Error updating entries".$error[2];
                            }
                        }
                    }else if(strcmp($opt,"UPDATEDEADLINE")===0){
                        $deadlinequery = $pdo->prepare("UPDATE quiz SET deadline=:deadline, relativedeadline=:relativedeadline WHERE id=:link;");
                        $deadlinequery->bindParam(':deadline',$deadline);
                        $deadlinequery->bindParam(':relativedeadline',$relativedeadline);
                        $deadlinequery->bindParam(':link',$link);
                        
                        if(!$deadlinequery->execute()){
                            $error=$deadlinequery->errorInfo();
                            $debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
                        }
                    }else if(strcmp($opt,"UPDATETABS")===0){
                        $query = $pdo->prepare("UPDATE listentries SET gradesystem=:tabs WHERE lid=:lid;");
                        $query->bindParam(':lid', $sectid);
                        $query->bindParam(':tabs',$tabs);
                        
                        if(!$query->execute()){
                            $error=$query->errorInfo();
                            $debug="ERROR THE DEADLINE QUERY FAILED".$error[2];
                        }
                    }else if(strcmp($opt,"UPDATEVRS")===0) {
                            // After column 'motd' exist on all releases this query can be merged with the original 'UPDATEVERS' below
                            $query = $pdo->prepare("UPDATE vers SET motd=:motd WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
                            $query->bindParam(':cid', $courseid);
                            $query->bindParam(':coursecode', $coursecode);
                            $query->bindParam(':vers', $versid);
                            $query->bindParam(':motd', $motd);
                            if(!$query->execute()){
                                $error=$query->errorInfo();
                                $debug="Error updating entries: Missing column 'motd' ".$error[2];
                            }

                            $query = $pdo->prepare("UPDATE vers SET versname=:versname,startdate=:startdate,enddate=:enddate WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
                            $query->bindParam(':cid', $courseid);
                            $query->bindParam(':coursecode', $coursecode);
                            $query->bindParam(':vers', $versid);
                            $query->bindParam(':versname', $versname);
                            //$query->bindParam(':motd', $motd);
                    // if start and end dates are null, insert mysql null value into database

                            if($startdate=="null") $query->bindValue(':startdate', null,PDO::PARAM_INT);
                            else $query->bindParam(':startdate', $startdate);
                            if($enddate=="null") $query->bindValue(':enddate', null,PDO::PARAM_INT);
                            else $query->bindParam(':enddate', $enddate);

                            if(!$query->execute()) {
                                $error=$query->errorInfo();
                                $debug="Error updating entries".$error[2];
                            }
                            if($makeactive==3){
                                    $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
                                    $query->bindParam(':cid', $courseid);
                                    $query->bindParam(':vers', $versid);

                                    if(!$query->execute()) {
                                        $error=$query->errorInfo();
                                        $debug="Error updating entries".$error[2];
                                    }
                            }

                            // Logging for editing course version
                            $description=$courseid." ".$versid;
                            logUserEvent($userid, $username, EventTypes::EditCourseVers, $description);	

                    } else if(strcmp($opt,"CHGVERS")===0) {
                        $query = $pdo->prepare("UPDATE course SET activeversion=:vers WHERE cid=:cid");
                        $query->bindParam(':cid', $courseid);
                        $query->bindParam(':vers', $versid);

                        if(!$query->execute()) {
                            $error=$query->errorInfo();
                            $debug="Error updating entries".$error[2];
                        }
                    } else if (strcmp($opt, "HIDDEN") === 0) {
                        $visible = 0;
                        $query = $pdo->prepare("UPDATE listentries SET visible=:visible WHERE lid=:lid");
                        $query->bindParam(':lid', $sectid);
                        $query->bindParam(':visible', $visible);
                        if(!$query->execute()) {
                            $error=$query->errorInfo();
                            $debug="Error updating entries".$error[2]; 
                        }
                    } else if (strcmp($opt, "PUBLIC") === 0){
                        $visible = 1;
                        $query = $pdo->prepare("UPDATE listentries SET visible=:visible WHERE lid=:lid");
                        $query->bindParam(':lid', $sectid);
                        $query->bindParam(':visible', $visible);
                        if(!$query->execute()) {
                            $error=$query->errorInfo();
                            $debug="Error updating entries".$error[2]; 
                        }
                    } else if(strcmp($opt,"REFGIT")===0) {
                        class githubDB extends SQLite3 {
                            function __construct() {
                                $this->open("../../githubMetadata/metadata2.db");
                            }
                        }
                        $query1 = $pdo->prepare("SELECT filename FROM box WHERE exampleid=:exampleid;");
                        $query1->bindParam(":exampleid", $exampleid);
                        $query1->execute();
                        $query2 = $pdo->prepare("SELECT cid FROM codeexample WHERE exampleid=:exampleid;");
                        $query2->bindParam(":exampleid", $exampleid);
                        $query2->execute();
                        $files = array();
                        $row2 = $query2->fetchAll();
                        $cid = $row2['cid'];
                        foreach($query1->fetchAll() as $row1) {
                            array_push($files, $row1['filename']);
                        }
                        $gdb = new githubDB();
                        $downloads = array();
                        foreach($files as $file) {
                            $que = $gdb->query("SELECT downloadURL FROM gitFiles WHERE cid=".$cid." AND fileName=".$file.";");
                            while($row = $que->fetchArray(SQLITE3_ASSOC) ) {
                                array_push($downloads, $row['downloadURL']);
                            }
                        }
                        $gdb->close();
                        
                    } else if(strcmp($opt,"CREGITEX")===0) {
                        //Get cid
                        $query = $pdo->prepare("SELECT cid FROM listentries WHERE lid=:lid;");
                        $query->bindParam(":lid", $lid);
                        $query->execute();
                        $e = $query->fetchAll();
                        $courseid = $e[0]['cid'];

                        //Get dir from the listentrie that was clicked
                        $query = $pdo->prepare("SELECT githubDir FROM listentries WHERE lid=:lid;");
                        $query->bindParam(":lid", $lid);
                        $query->execute();
                        $e = $query->fetchAll();
                        $githubDir = $e[0]['githubDir'];
                        $dirPath = "../courses/".$courseid."/Github/" . $githubDir;	

                        //Get the version of the course from where the button was pressed
                        $query = $pdo->prepare("SELECT vers FROM listentries WHERE lid=:lid");
                        $query->bindParam(":lid", $lid);
                        $query->execute();
                        $e = $query->fetchAll();
                        $coursevers = $e[0]['vers'];

                        $allFiles = array();
                        $files = scandir($dirPath);
                        foreach($files as $file) {
                            if(is_file($dirPath."/".$file)) {
                                $temp = array();
                                foreach($files as $file2) {
                                    $n1 = explode(".", $file);
                                    $n2 = explode(".", $file2);
                                    if(is_file($dirPath."/".$file2) && $n1[0] == $n2[0]) {
                                        array_push($temp, $file2);
                                    }
                                }
                                array_push($allFiles, $temp);
                            }
                        }
                        //Get active version of the course
                        
                        

                        foreach($allFiles as $groupedFiles){	
                            //get the correct examplename
                            $explodeFiles = explode('.',$groupedFiles[0]);
                            $exampleName = $explodeFiles[0];
                            //count if there is already a codeexample or if we should create a new one on the current coursevers where the button was pressed.
                            $query1 = $pdo->prepare("SELECT COUNT(*) AS count FROM codeexample  WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;");
                            $query1->bindParam(":cid", $courseid);
                            $query1->bindParam(":examplename", $exampleName);
                            $query1->bindParam(":vers", $coursevers);
                            $query1->execute();
                            $result = $query1->fetch(PDO::FETCH_OBJ);
                            $counted = $result->count;

                            //if no codeexample exist create a new one
                            if ($counted == 0) {
                                

                                //Get the last position in the listenries to add new course at the bottom
                                $query = $pdo->prepare("SELECT pos FROM listentries WHERE cid=:cid ORDER BY pos DESC;");
                                $query->bindParam(":cid", $courseid);
                                $query->execute();
                                $e = $query->fetchAll();
                                $pos = $e[0]['pos'] + 1; //Gets the last filled position+1 to put the new codexample at

                                //select the files that has should be in the codeexample
                                $fileCount = count($groupedFiles);
                                //Start create the codeexample
                                if ($fileCount > 0 && $fileCount < 6) {
                                    //Select the correct template, only template for 1 up to 5 files exist
                                    switch ($fileCount) {
                                        case 1:
                                            $templateNumber = 10;
                                            break;
                                        case 2:
                                            $templateNumber = 1;
                                            break;
                                        case 3:
                                            $templateNumber = 3;
                                            break;
                                        case 4:
                                            $templateNumber = 5;
                                            break;
                                        case 5:
                                            $templateNumber = 9;
                                            break;
                                    }
                                    $examplename = $exampleName;
                                    $sectionname = $exampleName;
                                    //create codeexample
                                    $query = $pdo->prepare("INSERT INTO codeexample(cid,examplename,sectionname,uid,cversion,templateid) values (:cid,:ename,:sname,1,:cversion,:templateid);");
                                    $query->bindParam(":cid", $courseid);
                                    $query->bindParam(":ename", $examplename);
                                    $query->bindParam(":sname", $sectionname);
                                    $query->bindParam(":cversion", $coursevers);
                                    $query->bindParam(":templateid", $templateNumber);
                                    $query->execute();

                                    //select the latest codeexample created to link boxes to this codeexample
                                    $query = $pdo->prepare("SELECT MAX(exampleid) as LatestExID FROM codeexample;");
                                    $query->execute();
                                    $result = $query->fetch(PDO::FETCH_OBJ);
                                    $exampleid = $result->LatestExID;

                                    //Add each file to a box and add that box to the codeexample and set the box to its correct content.
                                    for ($i = 0; $i < count($groupedFiles); $i++) {
                                        $filename = $groupedFiles[$i];
                                        $parts = explode('.', $filename);
                                        $filetype = "CODE";
                                        $wlid = 0;
                                        switch ($parts[1]) {
                                            case "js":
                                                $filetype = "CODE";
                                                $wlid = 1;
                                                break;
                                            case "php":
                                                $filetype = "CODE";
                                                $wlid = 2;
                                                break;
                                            case "html":
                                                $filetype = "CODE";
                                                $wlid = 3;
                                                break;
                                            case "txt":
                                                $filetype = "DOCUMENT";
                                                $wlid = 4;
                                                break;
                                            case "md":
                                                $filetype = "DOCUMENT";
                                                $wlid = 4;
                                                break;
                                            case "java":
                                                $filetype = "CODE";
                                                $wlid = 5;
                                                break;
                                            case "sr":
                                                $filetype = "CODE";
                                                $wlid = 6;
                                                break;
                                            case "sql":
                                                $filetype = "CODE";
                                                $wlid = 7;
                                                break;
                                            default:
                                                $filetype = "DOCUMENT";
                                                $wlid = 4;
                                                break;
                                        }

                                        $boxid = $i + 1;
                                        $fontsize = 9;
                                        $setting = "[viktig=1]";
                                        $boxtitle = substr($filename, 0, 20);
                                        $query = $pdo->prepare("INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, :settings, :wordlistid, :fontsize);");
                                        $query->bindParam(":boxid", $boxid);
                                        $query->bindParam(":exampleid", $exampleid);
                                        $query->bindParam(":boxtitle", $boxtitle);
                                        $query->bindParam(":boxcontent", $filetype);
                                        $query->bindParam(":filename", $filename);
                                        $query->bindParam(":settings", $setting);
                                        $query->bindParam(":wordlistid", $wlid);
                                        $query->bindParam(":fontsize", $fontsize);
                                        $query->execute();																																																
                                    }

                                    $link = "UNK";
                                    $kind = 2;
                                    $visible = 1;
                                    $uid = 1;
                                    $comment = null;
                                    $gradesys = null;
                                    $highscoremode = 0;
                                    $groupkind = null;
                                    //add the codeexample to listentries
                                    $query = $pdo->prepare("INSERT INTO listentries (cid,vers, entryname, link, kind, pos, visible,creator,comments, gradesystem, highscoremode, groupKind) 
                                                                                                        VALUES(:cid,:cvs,:entryname,:link,:kind,:pos,:visible,:usrid,:comment, :gradesys, :highscoremode, :groupkind);");
                                    $query->bindParam(":cid", $courseid);
                                    $query->bindParam(":cvs", $coursevers);
                                    $query->bindParam(":entryname", $examplename);
                                    $query->bindParam(":link", $exampleid);
                                    $query->bindParam(":kind", $kind);
                                    $query->bindParam(":pos", $pos);
                                    $query->bindParam(":visible", $visible);
                                    $query->bindParam(":usrid", $uid);
                                    $query->bindParam(":comment", $comment);
                                    $query->bindParam(":gradesys", $gradesys);
                                    $query->bindParam(":highscoremode", $highscoremode);
                                    $query->bindParam(":groupkind", $groupkind);
                                    $query->execute();
                                }
                                
                            } else {
                                //Check for update
                                //TODO: Implement update for already existing code-examples.
                                
                                $query1 = $pdo->prepare("SELECT exampleid AS eid FROM codeexample  WHERE cid=:cid AND examplename=:examplename AND cversion=:vers;");
                                $query1->bindParam(":cid", $courseid);
                                $query1->bindParam(":examplename", $exampleName);
                                $query1->bindParam(":vers", $coursevers);
                                $query1->execute();
                                $result = $query1->fetch(PDO::FETCH_OBJ);
                                $eid = $result->eid;

                                $query1 = $pdo->prepare("SELECT COUNT(*) AS boxCount FROM box WHERE exampleid=:eid;");
                                $query1->bindParam(":eid", $eid);
                                $query1->execute();
                                $result = $query1->fetch(PDO::FETCH_OBJ);
                                $boxCount = $result->boxCount;

                                $likePattern = $exampleName .'.%';
                                $pdolite = new PDO('sqlite:../../githubMetadata/metadata2.db');
                                $query = $pdolite->prepare("SELECT * FROM gitFiles WHERE cid = :cid AND fileName LIKE :fileName;"); 
                                $query->bindParam(':cid', $courseid);
                                $query->bindParam(':fileName', $likePattern);
                                $query->execute();				
                                $rows = $query->fetchAll();
                                $exampleCount = count($rows);
                                
                                //Check if to be hidden
                                if($exampleCount==0){
                                    $visible = 0;																								
                                    $query = $pdo->prepare("UPDATE listentries SET visible=:visible WHERE cid=:cid AND vers=:cvs AND entryname=:entryname;");
                                    $query->bindParam(":cid", $courseid);
                                    $query->bindParam(":cvs", $coursevers);
                                    $query->bindParam(":entryname", $exampleName);
                                    $query->bindParam(":visible", $visible);
                                    $query->execute();
                                
                                //Check if remove box
                                }else if ($boxCount > $exampleCount){		
                                    $query = $pdo->prepare("SELECT filename FROM box WHERE exampleid = :eid;"); 
                                    $query->bindParam(':eid', $eid);				
                                    $query->execute();
                                    $boxRows = $query->fetchAll();
        
                                    foreach($boxRows as $bRow){
                                        $boxName = $bRow['filename'];
                                        $exist = false;
                                        foreach ($rows as $row) {
                                            $fileName = $row['fileName'];
                                            if(strcmp($boxName,$fileName)==0){
                                                $exist = true;
                                            }	
                                        }
                                        if($exist==false){										
                                            $query = $pdo->prepare("SELECT boxid AS bid WHERE exampleid = :eid AND filename=:boxName;");
                                            $query->bindParam(':eid', $eid); 
                                            $query->bindParam(':boxName', $boxName);
                                            $query->execute();
                                            $result = $query->fetch(PDO::FETCH_OBJ);
                                            $bid = $result->bid;

                                            $query = $pdo->prepare("DELETE FROM box WHERE exampleid = :eid AND filename=:boxName;");
                                            $query->bindParam(':eid', $eid); 
                                            $query->bindParam(':boxName', $boxName);
                                            $query->execute();
                                            
                                            for ($i =$bid; $i<$boxCount;$i++){
                                                $oldBoxID = $i+1;
                                                $query = $pdo->prepare("UPDATE box SET boxid=:newBoxID WHERE exampleid = :eid AND boxid=:oldBoxID;");
                                                $query->bindParam(':newBoxID', $i); 
                                                $query->bindParam(':eid', $eid); 
                                                $query->bindParam(':oldBoxID', $oldBoxID);
                                                $query->execute();
                                                
                                            }
                                            $boxCount--;
                                        }	
                                    }
                                    switch ($exampleCount) {
                                        case 1:
                                            $templateNumber = 10;
                                            break;
                                        case 2:
                                            $templateNumber = 1;
                                            break;
                                        case 3:
                                            $templateNumber = 3;
                                            break;
                                        case 4:
                                            $templateNumber = 5;
                                            break;
                                        case 5:
                                            $templateNumber = 9;
                                            break;
                                    }
                                    $query = $pdo->prepare("UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;");
                                    $query->bindParam(":templateid", $templateNumber);
                                    $query->bindParam(":eid", $eid);
                                    $query->execute();
                                                            
                                //Check if adding box
                                }else if ($boxCount < $exampleCount){

                                    $query = $pdo->prepare("SELECT filename FROM box WHERE exampleid = :eid;"); 
                                    $query->bindParam(':eid', $eid);				
                                    $query->execute();
                                    $boxRows = $query->fetchAll();

                                    foreach ($rows as $row) {
                                        $fileName = $row['fileName'];
                                        $exist=false;
                                        foreach($boxRows as $bRow){
                                            $boxName = $bRow['filename'];
                                            if(strcmp($boxName,$fileName)==0){
                                                $exist = true;
                                            }	

                                        }
                                        if($exist==false){
                                            $parts = explode('.', $fileName);
                                            $filetype = "CODE";
                                            $wlid = 0;
                                            switch ($parts[1]) {
                                                case "js":
                                                    $filetype = "CODE";
                                                    $wlid = 1;
                                                    break;
                                                case "php":
                                                    $filetype = "CODE";
                                                    $wlid = 2;
                                                    break;
                                                case "html":
                                                    $filetype = "CODE";
                                                    $wlid = 3;
                                                    break;
                                                case "txt":
                                                    $filetype = "DOCUMENT";
                                                    $wlid = 4;
                                                    break;
                                                case "md":
                                                    $filetype = "DOCUMENT";
                                                    $wlid = 4;
                                                    break;
                                                case "java":
                                                    $filetype = "CODE";
                                                    $wlid = 5;
                                                    break;
                                                case "sr":
                                                    $filetype = "CODE";
                                                    $wlid = 6;
                                                    break;
                                                case "sql":
                                                    $filetype = "CODE";
                                                    $wlid = 7;
                                                    break;
                                                default:
                                                    $filetype = "DOCUMENT";
                                                    $wlid = 4;
                                                    break;
                                            }	

                                            $query = $pdo->prepare("SELECT MAX(boxid) FROM box WHERE exampleid = :eid;"); 
                                            $query->bindParam(':eid', $eid);				
                                            $query->execute();
                                            $boxid = $query->fetchColumn();
                                
                                            $boxid = $boxid + 1;
                                            $fontsize = 9;
                                            $setting = "[viktig=1]";
                                            $boxtitle = substr($fileName, 0, 20);
                                            
                                            $query = $pdo->prepare("INSERT INTO box (boxid, exampleid, boxtitle, boxcontent, filename, settings, wordlistid, fontsize) VALUES (:boxid, :exampleid, :boxtitle, :boxcontent, :filename, :settings, :wordlistid, :fontsize);");
                                            $query->bindParam(":boxid", $boxid);
                                            $query->bindParam(":exampleid", $eid);
                                            $query->bindParam(":boxtitle", $boxtitle);
                                            $query->bindParam(":boxcontent", $filetype);
                                            $query->bindParam(":filename", $fileName);
                                            $query->bindParam(":settings", $setting);
                                            $query->bindParam(":wordlistid", $wlid);
                                            $query->bindParam(":fontsize", $fontsize);
                                            $query->execute();

                                        }
                                    }

                                    switch ($exampleCount) {
                                        case 1:
                                            $templateNumber = 10;
                                            break;
                                        case 2:
                                            $templateNumber = 1;
                                            break;
                                        case 3:
                                            $templateNumber = 3;
                                            break;
                                        case 4:
                                            $templateNumber = 5;
                                            break;
                                        case 5:
                                            $templateNumber = 9;
                                            break;
                                    }
                                    $query = $pdo->prepare("UPDATE codeexample SET templateid=:templateid WHERE exampleid=:eid;");
                                    $query->bindParam(":templateid", $templateNumber);
                                    $query->bindParam(":eid", $eid);
                                    $query->execute();
                                }
                            } 
                        }
                    
                    } else if (strcmp($coursevers, "null")!==0) {
                        // Get every coursevers of courses so we seed groups to every courseversion
                        $stmt = $pdo->prepare("SELECT vers FROM vers WHERE cid=:cid");
                        $stmt->bindParam(":cid", $courseid);
                        $stmt->execute();
                        $courseversions = $stmt->fetchAll(PDO::FETCH_COLUMN);
                        $totalGroups = 24 * count($courseversions);
                    } 
                }
            }
        }}

?>
