<?php

include_once "../../../Shared/basic.php";
include_once "../../../DuggaSys/microservices/curlService.php"; //curlService

function retrieveAccessedService($pdo, $debug, $userid, $cid, $log_uuid, $opt="", $newusers=""){

    // UID microservice
    $data = callMicroserviceGET("sharedMicroservices/getUid_ms.php");
    $userid = $data['uid'] ?? -1;

    $entries=array();
    $teachers=array();
    $classes=array();
    $groups=array();
    $courses=array();
    $submissions=array();
    $queryResult = 'NONE!';

    $hasAccess = false;
    if (hasAccess($userid, $cid, 'w') || isSuperUser($userid)) {
        $hasAccess = true;
    }

    if(checklogin() && $hasAccess) {

        $query = $pdo->prepare("SELECT user.uid as uid,username,firstname,lastname,ssn,access,class,modified,vers,requestedpasswordchange,examiner,groups, TIME_TO_SEC(TIMEDIFF(now(),addedtime))/60 AS newly FROM user, user_course WHERE cid=:cid AND user.uid=user_course.uid;");
        $query->bindParam(':cid', $cid);
        if(!$query->execute()){
            $error=$query->errorInfo();
            $debug="Error reading user entries\n".$error[2];
        }
        $result = $query->fetchAll(PDO::FETCH_ASSOC);
        // Adds all teachers for course to array
        $examiners = array();
        foreach($result as $row){
            if($row['access'] == 'W') {
                array_push($examiners, $row);
            }
        }

        foreach($result as $row){
            $entry = array(
                'username' => json_encode(['username' => $row['username']]),
                'ssn' => json_encode(['ssn' => $row['ssn']]),
                'firstname' => json_encode(['firstname' => $row['firstname']]),
                'lastname' => json_encode(['lastname' => $row['lastname']]),
                'class' => json_encode(['class' => $row['class']]),
                'modified' => $row['modified'],
                'examiner' => json_encode(['examiner' => $row['examiner']]),
                'vers' => json_encode(['vers' => $row['vers']]),
                'access' => json_encode(['access' => $row['access']]),
                'groups' => json_encode(['groups' => $row['groups']]),
                'requestedpasswordchange' => json_encode(['username' => $row['username'] ,'recent' => $row['newly'],'requested' => $row['requestedpasswordchange']])
            );
            array_push($entries, $entry);
        }

        $query = $pdo->prepare("SELECT user_course.uid FROM user_course WHERE user_course.access = 'W' GROUP by user_course.uid;");
        if(!$query->execute()){
            $error=$query->errorInfo();
            $debug="Error reading user entries\n".$error[2];
        }
        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
            $teacher = array(
                'name' => $row['firstname']." ".$row['lastname'],
                'uid' => $row['uid']
            );
            array_push($teachers, $teacher);
        }

        $query = $pdo->prepare("SELECT * FROM class;");
        if(!$query->execute()){
            $error=$query->errorInfo();
            $debug="Error reading user entries\n".$error[2];
        }
        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
            $classe = array(
                'class' => $row['class'],
                'responsible' => $row['responsible'],
                'classname' => $row['classname'],
                'regcode' => $row['regcode'],
                'classcode' => $row['classcode'],
                'hp' => $row['hp'],
                'tempo' => $row['tempo'],
                'hpProgress' => $row['hpProgress'],
            );
            array_push($classes, $classe);
        }


        $query = $pdo->prepare("SELECT groupval,groupkind,groupint FROM `groups` ORDER BY groupkind,groupint;");
        if(!$query->execute()){
            $error=$query->errorInfo();
            $debug="Error reading group entries\n".$error[2];
        }
        foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
            $group = array(
                'groupval' => $row['groupval'],
                'groupkind' => $row['groupkind'],
                'groupint' => $row['groupint'],
            );
            array_push($groups, $group);
        }

        $query=$pdo->prepare("SELECT cid,coursecode,vers,versname,coursename,coursenamealt,startdate,enddate FROM vers WHERE cid=:cid;");

        $query->bindParam(':cid', $cid);
        if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug="Error reading courses\n".$error[2];
        }else{
            foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
                array_push(
                    $courses,
                    array(
                        'cid' => $row['cid'],
                        'coursecode' => $row['coursecode'],
                        'vers' => $row['vers'],
                        'versname' => $row['versname'],
                        'coursename' => $row['coursename'],
                        'coursenamealt' => $row['coursenamealt'],
                        'startdate' => $row['startdate'],
                        'enddate' => $row['enddate']
                    )
                );
            }
        }

        // 	// Find user submissions in old versions
        $query=$pdo->prepare("SELECT course.cid, uid, vers.vers, versname FROM course, userAnswer, vers WHERE course.cid=:cid AND course.cid=userAnswer.cid AND vers.vers=userAnswer.vers AND userAnswer.vers!=activeversion;");
        $query->bindParam(':cid', $cid);
        if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug="Error reading submissions\n".$error[2];
        }else{
            foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
                array_push(
                    $submissions,
                    array(
                        'cid' => $row['cid'],
                        'uid' => $row['uid'],
                        'vers' => $row['vers'],
                        'versname' => $row['versname']
                    )
                );
            }
        }

        $access = true;
    }

    $array = array(
        'entries' => $entries,
        'debug' => $debug,
        'teachers' => $teachers,
        'classes' => $classes,
        'courses' => $courses,
        'groups' => $groups,
        'queryResult' => $queryResult,
        'examiners' => $examiners,
        'submissions' => $submissions,
        'access' => $access
    );


    // Fetch username from retrieveUsername_ms.php
    $data = callMicroserviceGET("sharedMicroservices/retrieveUsername_ms.php");
    $username = $data['username'] ?? 'unknown';

    $info = "opt: $opt cid: $cid uid: $userid username: $username newusers: $newusers";
    logServiceEvent($log_uuid, EventTypes::ServiceServerEnd, "accessedservice.php", $userid, $info);
    
    return $array;
}
