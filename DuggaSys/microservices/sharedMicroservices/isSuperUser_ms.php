<?php

date_default_timezone_set("Europe/Stockholm");

function isSuperUser_ms($pdo, $userId){
        $query = $pdo->prepare('SELECT count(uid) AS count FROM user WHERE uid=:1 AND superuser=1');
        $query->bindParam(':1', $userId);
        $query->execute();
        $result = $query->fetch();
        if ($result["count"]==1) {
                return true;
        }else{
                return false;
        }
}

?>
