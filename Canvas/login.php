<?php
    $local = "../../../secrets/canvas_token.txt";
    $server =  "";
    
    if (file_exists($local)){
        $token = file_get_contents($local, true);
    }  elseif (file_exists($server)){
        $token = file_get_contents($server, true);
    } else {
        error_log("Can't find token for canvas", 0);
        $token = "NoToken";
    }
    
?>