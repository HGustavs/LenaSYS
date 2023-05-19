<?php
    date_default_timezone_set("Europe/Stockholm");
    
    // Include basic application services
    include_once "../Shared/sessions.php";
    include_once "../Shared/basic.php";
    
    function checkUserStatusTest(){
        // Checks user id, if user has none a guest id is set
        if(isset($_SESSION['uid'])){
            $userid=$_SESSION['uid'];
        }else{
            $userid="1";
        }

        // Gets username based on uid, USED FOR LOGGING
        $query = $pdo->prepare( "SELECT username FROM user WHERE uid = :uid");
        $query->bindParam(':uid', $userid);
        $query-> execute();

        $log_uuid = getOP('log_uuid');
        $log_timestamp = getOP('log_timestamp');

        $log_uuid = getOP('log_uuid');
        $info="opt: ".$opt." courseId: ".$courseId." courseVersion: ".$courseVersion." exampleName: ".$exampleName." sectionName: ".$sectionName." exampleId: ".$exampleId;
        logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "codeviewerService.php",$userid,$info);

        // This while is only performed if userid was set through _SESSION['uid'] check above, a guest will not have it's username set, USED FOR LOGGING
        while ($row = $query->fetch(PDO::FETCH_ASSOC)){
            $username = $row['username'];
        }

        //Users: superuser, studentteacher, write, read, supervisor 
        // Checks and sets user rights
        if(checklogin() && (hasAccess($userid, $courseId, 'w'))){ //Write
        	$hasWAccess = true;
            print_r("w:true");
        } else {
            $hasWAccess = false;
            print_r("w:false");
        } 

        if(checklogin() && (hasAccess($userid, $courseId, 'st'))){ //studentteacher
            $hasStAccess= true;
            print_r("st:true");
        } else {
            $hasStAccess = false;
            print_r("st:false");
        } 

        if(checklogin() && (hasAccess($userid, $courseId, 'r'))){ //Read
            $hasRAccess= true;
            print_r("r:true");
        } else {
            $hasRAccess = false;
            print_r("r:false");
        } 

        if(checklogin() && (hasAccess($userid, $courseId, 'sv'))){ //Supervisor
            $hasSvAccess= true;
            print_r("sv:true");
        } else {
            $hasSvAccess = false;
            print_r("sv:false");
        } 
        
        if (checklogin() && (isSuperUser($userid))){ //Super user
            $hasSuperAccess = true;
            print_r("super:true");
        } else {
            $hasSuperAccess = false;
            print_r("super:false");
        }

    var_dump($hasWAccess,$hasSvAccess,$hasSuperAccess,$hasStAccess,$hasRAccess);        
    }
?>