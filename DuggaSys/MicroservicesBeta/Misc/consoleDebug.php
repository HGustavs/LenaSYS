<?php
    pdoConnect();
    session_start();
    
    function consoleDebug($output){
        $output = $output;
        if (is_array($output)){
            $output = implode(',', $output);
        }

        echo "<script>console.log('Debug: '" + $output + "');</script>";
    }
?>