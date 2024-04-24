<?php 
    date_default_timezone_set("Europe/Stockholm");

    include_once "../../../Shared/sessions.php";
    include_once "../../../Shared/basic.php";

    pdoConnect();
    session_start();

    if(isset($_session['uid'])){
        $userid = $_SESSION['uid']; 
    }
    else{
        $userid = "guest";
    }

    $cid = getOP('cid');
    $coursecode = getOP('coursecode');
    $versname = getOP('versname');
    $vers = getOP('vers');
    $motd = getOP('motd');
    $startdate = getOP('startdate');
    $enddate = getOP('enddate');

    $isSuperUserVar = isSuperUser($userid);
    $ha = (checklogin() && ($haswrite || $isSuperUserVar));

    if($ha || $studentTeacher){

        $query = ("UPDATE vers SET motd=:motd WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
        $query = $pdo->prepare($query);
        $query->bindParam(':cid', $cid);
        $query->bindParam(':coursecode', $coursecode);
        $query->bindParam(':vers', $vers);
        $query->bindParam(':motd', $motd);

        if(!$query->execute()) {
            $error=$query->errorInfo();
            $debug="Error updating entries".$error[2];
        }

        $query2 = $pdo->prepare("UPDATE vers SET versname=:versname, startdate=:startdate, enddate=:enddate WHERE cid=:cid AND coursecode=:coursecode AND vers=:vers;");
        $query2->bindParam(':cid', $cid);
        $query2->bindParam(':coursecode', $coursecode);
        $query2->bindParam(':vers', $vers);
        $query2->bindParam(':versname', $versname);
        $query2->bindParam(':startdate', $startdate);
        $query2->bindParam(':enddate', $enddate);
    
        if(!$query2->execute()) {
            $error=$query2->errorInfo();
            $debug="Error updating entries".$error[2];
        }

    }
    
?>