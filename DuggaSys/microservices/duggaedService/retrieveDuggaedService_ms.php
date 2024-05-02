<?php

date_default_timezone_set("Europe/Stockholm");

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

//------------------------------------------------------------------------------------------------
// Retrieve Information
//------------------------------------------------------------------------------------------------

function retrieveDuggaedService($pdo, $debug="NONE!", $userid, $cid, $coursevers, $log_uuid){

    $mass=array();
    $entries=array();
    $variants=array();
    $files=array();
    $duggaPages = array();

    //fethces the coursecode and coursename so they can be used as title on the browser tab.
    //The variable is used in duggaed.js with the 'sectionedPageTitle' id
    $query = $pdo->prepare("SELECT coursename,coursecode,cid FROM course WHERE cid=:cid LIMIT 1");
    $query->bindParam(':cid', $cid);

    $coursename = "Course not Found!";
    $coursecode = "Coursecode not found!";

    if($query->execute()) {
        foreach($query->fetchAll() as $row) {
            $coursename=$row['coursename'];
            $coursecode=$row['coursecode'];
        }
    } else {
        $error=$query->errorInfo();
        $debug="Error reading entries".$error[2];
    }

    $writeaccess = false;
    if(checklogin() && (hasAccess($userid, $cid, 'w') || isSuperUser($userid) || hasAccess($userid, $cid, 'st'))){
        $writeaccess = true;

        $query = $pdo->prepare("SELECT id,cid,autograde,gradesystem,qname,quizFile,qstart,deadline,qrelease,modified,vers,jsondeadline FROM quiz WHERE cid=:cid AND vers=:coursevers ORDER BY id;");
        $query->bindParam(':cid', $cid);
        $query->bindParam(':coursevers', $coursevers);
        if(!$query->execute()){
            $error=$query->errorInfo();
            $debug="Error updating entries".$error[2];
        }

        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){

            $queryz = $pdo->prepare("SELECT vid,quizID,param,variantanswer,modified,disabled FROM variant WHERE quizID=:qid ORDER BY vid;");
            $queryz->bindParam(':qid',  $row['id']);

            if(!$queryz->execute()){
                $error=$queryz->errorInfo();
                $debug="Error updating entries".$error[2];
            }

            foreach($queryz->fetchAll(PDO::FETCH_ASSOC) as $rowz){

                $entryz = array(
                    "vid" => $rowz["vid"],
                    "param" => html_entity_decode($rowz["param"]),
                    "notes" => html_entity_decode($rowz["param"]),
                    "variantanswer" => html_entity_decode($rowz["variantanswer"]),
                    "modified" => $rowz["modified"],
                    "disabled" => $rowz["disabled"],
                    "arrowVariant" => $rowz["vid"],
                    "cogwheelVariant" => $rowz["vid"],
                    "trashcanVariant" => $rowz["vid"]
                    );

                array_push($variants, html_entity_decode($rowz["variantanswer"]));
                array_push($mass, $entryz);
            }

            $entry = array(
                'variants' => $mass,
                'did' => $row['id'],
                'qname' => html_entity_decode($row['qname']),
                'autograde' => $row['autograde'],
                'gradesystem' => $row['gradesystem'],
                'quizFile' => $row['quizFile'],
                'qstart' => $row['qstart'],
                'deadline' => $row['deadline'],
                'qrelease' => $row['qrelease'],
                'modified' => $row['modified'],
                'arrow' => $row['id'],
                'cogwheel' => $row['id'],
                'jsondeadline' => html_entity_decode($row['jsondeadline']),
                'trashcan' => $row['id']
                );

            array_push($entries, $entry);
        }
        $dir = './templates';
        $giles = scandir($dir);
        foreach ($giles as $value){
            if(endsWith($value,".html")){
                array_push($files,substr ( $value , 0, strlen($value)-5 ));
                $duggaPages[substr ( $value , 0, strlen($value)-5 )] = file_get_contents("templates/".$value);
            }
        }
    }

    $array = array(
        'entries' => $entries,
        'debug' => $debug,
        'writeaccess' => $writeaccess,
        'files' => $files,
        'duggaPages' => $duggaPages,
        'coursecode' => $coursecode,
        'coursename' => $coursename,
        'variants' => $variants
    );

    //echo json_encode($array);

    logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "retrieveDuggaedService_ms.php",$userid,$info);

    return $array;
}
