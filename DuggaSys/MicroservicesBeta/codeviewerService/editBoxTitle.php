<?php
    date_default_timezone_set("Europe/Stockholm");
    
    require __DIR__ . '../Misc/checkUserStatus.php';

    echo checkUserStatusTest();

    if(checklogin() && ($writeAccess=="w" || isSuperUser($_SESSION['uid']))) {
        if(strcmp('EDITTITLE',$opt)===0) {
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
        }
    }
?>