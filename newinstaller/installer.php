<?php 
    foreach (glob("tools/*.php") as $tools) {
        include $tools;
    }

?>