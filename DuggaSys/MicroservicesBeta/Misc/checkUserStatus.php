<?php
    date_default_timezone_set("Europe/Stockholm");
    
    // Include basic application services
    include_once "../Shared/sessions.php";
    include_once "../Shared/basic.php";

    // Connect to database and start session
    pdoConnect();
    session_start();

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

        //Users: superuser, studentteacher, write, read, superviser 
        // Checks and sets user rights
        if(checklogin() && (hasAccess($userid, $courseId, 'w'))){
            $writeAccess="w";
        }else (checklogin() && (hasAccess($userid, $courseId, 'st'))){
            $writeAccess="st";
        }else (checklogin() && (hasAccess($userid, $courseId, 'r'))){
            $writeAccess="r";
        }else (checklogin() && (hasAccess($userid, $courseId, 'sv'))){
            $writeAccess="sv";
        }
    }
?>