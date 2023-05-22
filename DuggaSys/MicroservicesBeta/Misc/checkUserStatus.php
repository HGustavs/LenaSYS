<?php
    date_default_timezone_set("Europe/Stockholm");
    
    // Include basic application services
    include_once ("../../../Shared/sessions.php");
    include_once ("../../../../coursesyspw.php");
    include_once ("../../../Shared/basic.php");
    //include_once ("../../../Shared/courses.php");
	//include_once ("../../../Shared/database.php");

    function checkUuid(){
        // Checks user id, if user has none a guest id is set
        if(isset($_SESSION['uid'])){
            $userid=$_SESSION['uid'];
        }else{
            $userid="1";
        }

        $log_uuid = getOP('log_uuid');
        $log_timestamp = getOP('log_timestamp');

        $log_uuid = getOP('log_uuid');
        $info="opt: ".$opt." courseId: ".$courseId." courseVersion: ".$courseVersion." exampleName: ".$exampleName." sectionName: ".$sectionName." exampleId: ".$exampleId;
        logServiceEvent($log_uuid, EventTypes::ServiceServerStart, "checkUserStatus.php",$userid,$info);

        $appuser=(array_key_exists('uid', $_SESSION) ? $_SESSION['uid'] : 0);

        return $log_uuid;
    }
?>