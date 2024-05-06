<?php

// Include basic application services!
include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";

function fetchOldToken($pdolite, $cid) {

    $query = $pdolite->prepare('SELECT gitToken FROM gitRepos WHERE cid=:cid');
    $query->bindParam(':cid', $cid);
    $query->execute();

    $old_token="";
    foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
        $old_token = $row['gitToken'];
    }

    if(strlen($old_token)>1)
    {
        return $old_token;
    }
    else
    {
        return null;
    }
}
?>
