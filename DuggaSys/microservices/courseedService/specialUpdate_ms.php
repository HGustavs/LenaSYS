<?php


    date_default_timezone_set("Europe/Stockholm");

    // Include basic application services!
    include_once "../../../Shared/sessions.php";
    include_once "../../../Shared/basic.php";
    include_once "../sharedMicroservices/getUid_ms.php";

    // Connect to database and start session
    pdoConnect();
    session_start();
    
    $opt = getOP('opt');
    $cid = getOP('cid');
    $courseGitURL = getOP('courseGitURL');



    // checks that the user is a superuser and logged in
    if(checklogin() && isSuperUser(getUid()) == true) {
        $userid = getUid();  

        if (strcmp($opt, "SPECIALUPDATE") === 0) {

            $query = $pdo->prepare("SELECT * from course WHERE cid=:cid;");
            $query->bindParam(':cid', $cid);
        
            if (!$query->execute()) {
                $error = $query->errorInfo();
                $debug = "Error finding course specifics\n" . $error[2];
            } else {
                foreach ($query->fetchAll(PDO::FETCH_ASSOC) as $row) {
                    $query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode, courseGitURL=:courseGitURL WHERE cid=:cid;");
        
                    print_r($row['coursename'] . $row['visibility'] . $row['coursecode']);
                    $query->bindParam(':cid', $cid);
                    $query->bindParam(':coursename', $row['coursename']);
                    $query->bindParam(':visibility', $row['visibility']);
                    $query->bindParam(':coursecode', $row['coursecode']);
                    $query->bindParam(':courseGitURL', $courseGitURL);
                    try{
                        $query->execute();
                    }
                    catch(Exception $e){
                        $query = $pdo->prepare("UPDATE course SET coursename=:coursename, visibility=:visibility, coursecode=:coursecode WHERE cid=:cid;");
                        $query->bindParam(':cid', $cid);
                        $query->bindParam(':coursename', $row['coursename']);
                        $query->bindParam(':visibility', $row['visibility']);
                        $query->bindParam(':coursecode', $row['coursecode']);
                        $query->execute();
                    }
        
                    if (!$query->execute()) {
                        $error = $query->errorInfo();
                        $debug = "Error updating entries\n" . $error[2];
                    }
                }
        
            }
        }

    }

?>