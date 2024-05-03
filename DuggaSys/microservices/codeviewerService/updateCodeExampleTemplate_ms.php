<?php

include_once "../../../Shared/sessions.php";
include_once "../../../Shared/basic.php";
include_once "../sharedMicroservices/getUid_ms.php";

pdoConnect();
session_start();

$userid = getUid();

$opt=getOP('opt');
$templateNumber=getOP('templateno');

if(checklogin() && ($writeAccess=="w" || isSuperUser($_SESSION['uid']))) {
    $writeAccess="w"; // TODO: Redundant? Is set a couple of rows above

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
        if($templateNumber==1||$templateNumber==2) $boxCount=2;
        if($templateNumber==3||$templateNumber==4 ||$templateNumber==8) $boxCount=3;
        if($templateNumber==5||$templateNumber==6 ||$templateNumber==7) $boxCount=4;
        if($templateNumber==9) $boxCount=5;

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
    }else if(strcmp('EDITEXAMPLE',$opt)===0){
        if(isset($_POST['playlink'])) {$playlink = $_POST['playlink'];}
        if(isset($_POST['examplename'])) {$exampleName = $_POST['examplename'];}
        if(isset($_POST['sectionname'])) {$sectionName = $_POST['sectionname'];}
        if(isset($_POST['beforeid'])) {$beforeId = $_POST['beforeid'];}
        if(isset($_POST['afterid'])) {$afterId = $_POST['afterid'];}

        // Change content of example
        $query = $pdo->prepare( "UPDATE codeexample SET runlink = :playlink , examplename = :examplename, sectionname = :sectionname WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
        $query->bindParam(':playlink', $playlink);
        $query->bindParam(':examplename', $exampleName);
        $query->bindParam(':sectionname', $sectionName);
        $query->bindParam(':exampleid', $exampleId);
        $query->bindParam(':cid', $courseId);
        $query->bindParam(':cvers', $courseVersion);
        if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug.="Error updating example: ".$error[2]." ".__LINE__;
        }

        // TODO: Check for better way to get and set before/afterId
        if($beforeId!="UNK"){
            $query = $pdo->prepare( "UPDATE codeexample SET beforeid = :beforeid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
            $query->bindParam(':beforeid', $beforeId);
            $query->bindParam(':exampleid', $exampleId);
            $query->bindParam(':cid', $courseId);
            $query->bindParam(':cvers', $courseVersion);
            if(!$query->execute()) {
                $error=$query->errorInfo();
                $debug.="Error updaring example: ".$error[2]." ".__LINE__;
            }
        }
        if($afterId!="UNK"){
            $query = $pdo->prepare( "UPDATE codeexample SET afterid = :afterid WHERE exampleid = :exampleid AND cid = :cid AND cversion = :cvers;");
            $query->bindParam(':afterid', $afterId);
            $query->bindParam(':exampleid', $exampleId);
            $query->bindParam(':cid', $courseId);
            $query->bindParam(':cvers', $courseVersion);
            if(!$query->execute()) {
                $error=$query->errorInfo();
                $debug.="Error updaring example: ".$error[2]." ".__LINE__;
            }
        }
        if(isset($_POST['addedWords'])) {
            // Converts to array
            $addedWords = explode(",",$_POST['addedWords']);

            // Loops through the array of added words and inserts them one by one.
            foreach ($addedWords as $word) {
                $query = $pdo->prepare("INSERT INTO impwordlist(exampleid,word,uid) VALUES (:exampleid,:word,:uid);");
                $query->bindParam(':exampleid', $exampleId);
                $query->bindParam(':word', $word);
                $query->bindParam(':uid', $_SESSION['uid']);
                if(!$query->execute()) {
                    $error=$query->errorInfo();
                    $debug.="Error updaring example: ".$error[2]." ".__LINE__;
                }
            }
        }
        if(isset($_POST['removedWords'])) {
            // Converts to array
            $removedWords = explode(",",$_POST['removedWords']);

            // Loops through the array of removed words and deletes them one by one.
            foreach ($removedWords as $word) {
                $query = $pdo->prepare("DELETE FROM impwordlist WHERE word=:word AND exampleid=:exampleid;");
                $query->bindParam(':exampleid', $exampleId);
                $query->bindParam(':word', $word);
                if(!$query->execute()) {
                    $error=$query->errorInfo();
                    $debug.="Error deleting impword: ".$error[2]." ".__LINE__;
                }
            }
        }
    }else if(strcmp('EDITCONTENT',$opt)===0) {
        $exampleId = $_POST['exampleid'];
        $boxId = $_POST['boxid'];
        $boxTitle = $_POST['boxtitle'];
        $boxContent = $_POST['boxcontent'];
        $wordlist = $_POST['wordlist'];
        $filename = $_POST['filename'];
        $fontsize = $_POST['fontsize'];
        $addedRows = $_POST['addedRows'];
        $removedRows = $_POST['removedRows'];

        $query = $pdo->prepare("UPDATE box SET boxtitle=:boxtitle, boxcontent=:boxcontent, filename=:filename, fontsize=:fontsize, wordlistid=:wordlist WHERE boxid=:boxid AND exampleid=:exampleid;");
        $query->bindParam(':boxtitle', $boxTitle);
        $query->bindParam(':boxcontent', $boxContent);
        $query->bindParam(':wordlist', $wordlist);
        $query->bindParam(':filename', $filename);
        $query->bindParam(':fontsize', $fontsize);
        $query->bindParam(':boxid', $boxId);
        $query->bindParam(':exampleid', $exampleId);
        $query->execute();

        if (isset($_POST['addedRows'])) {
            preg_match_all("/\[(.*?)\]/", $addedRows, $matches, PREG_PATTERN_ORDER);
            foreach ($matches[1] as $match) {
                $row = explode(",", $match);
                $query = $pdo->prepare("INSERT INTO improw(boxid,exampleid,istart,iend,uid) VALUES (:boxid,:exampleid,:istart,:iend,:uid);");
                $query->bindValue(':boxid', $boxId);
                $query->bindValue(':exampleid', $exampleId);
                $query->bindValue(':istart', $row[1]);
                $query->bindValue(':iend', $row[2]);
                $query->bindValue(':uid', $_SESSION['uid']);
                $query->execute();
            }
        }

        if (isset($_POST['removedRows'])) {
            preg_match_all("/\[(.*?)\]/", $removedRows, $matches, PREG_PATTERN_ORDER);
            foreach ($matches[1] as $match) {
                $row = explode(",", $match);
                $query = $pdo->prepare("DELETE FROM improw WHERE boxid=:boxid AND istart=:istart AND iend=:iend AND exampleid=:exampleid;");
                $query->bindValue(':boxid', $boxId);
                $query->bindValue(':exampleid', $exampleId);
                $query->bindValue(':istart', $row[1]);
                $query->bindValue(':iend', $row[2]);
                $query->execute();
            }
        }
    }else if(strcmp('EDITTITLE',$opt)===0) {
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
    } else if (strcmp('DELEXAMPLE', $opt) === 0) {

        $query1 = $pdo->prepare("DELETE FROM improw WHERE exampleid=:exampleid;");
        $query1->bindValue(':exampleid', $exampleId);				
        
        $query2 = $pdo->prepare("DELETE FROM box WHERE exampleid=:exampleid;");
        $query2->bindValue(':exampleid', $exampleId);				

        $query3 = $pdo->prepare("DELETE FROM impwordlist WHERE exampleid=:exampleid;");
        $query3->bindValue(':exampleid', $exampleId);				

        $query4 = $pdo->prepare("DELETE FROM codeexample WHERE exampleid=:exampleid;");
        $query4->bindValue(':exampleid', $exampleId);
    
        $query5 = $pdo->prepare("DELETE FROM listentries WHERE lid=:lid;");
        $lid = getOP('lid');
        $query5->bindValue(':lid', $lid);

        if(!$query1->execute()) {
                $error = $query1->errorInfo();
                echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
                return;
        }
        if(!$query2->execute()) {
            $error = $query2->errorInfo();
            echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
            return;
        }
        if(!$query3->execute()) {
            $error = $query3->errorInfo();
            echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
            return;
        }
        if(!$query4->execute()) {
            $error = $query4->errorInfo();
            echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
            return;
        }
        if(!$query5->execute()) {
            $error = $query5->errorInfo();
            echo (json_encode(array('writeaccess' => 'w', 'debug' => $error[2])));
            return;
        }
        echo (json_encode(array('deleted' => true, 'debug' => $debug)));
        return;
    }
}