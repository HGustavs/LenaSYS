<?php
    date_default_timezone_set("Europe/Stockholm");
    
    // Include basic application services
    include_once ("../../../../coursesyspw.php");
    include_once ("../../../Shared/sessions.php");
    include_once ("../../../Shared/basic.php");

    function getUid(){
        // Checks user id, if user has none a guest id is set
        if(isset($_SESSION['uid'])){
            $userid=$_SESSION['uid'];
        }else{
            $userid="guest";
        }

        $log_uuid = getOP('log_uuid');
        $log_timestamp = getOP('log_timestamp');

        $log_uuid = getOP('log_uuid');
        $info="opt: ".$opt." courseId: ".$courseId." courseVersion: ".$courseVersion." exampleName: ".$exampleName." sectionName: ".$sectionName." exampleId: ".$exampleId;
        logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "getUid_ms.php",$userid,$info);

        $appuser=(array_key_exists('uid', $_SESSION) ? $_SESSION['uid'] : 0);

        return $userid;
    }
?>