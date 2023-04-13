

<html>
    <head>
        <style>
          
        </style>
    </head>
    <body>
        
<?php

$url = "https://cms.webug.se/root/G2/students/a21jeaha/LenaSYS/Shared/logging.json";
$jsontext = file_get_contents($url);
$arr = json_decode($jsontext, true);

$opt = $arr['opt'];
$apara[] = $arr['apara'];
$kind = $arr['kind'];
$apara_type = $arr['apara_type'];
$dateTime = $arr['dateTime'];  

    echo "<tr>"; 
        echo "<td>";
            echo $apara;
            foreach($apara as array)
            echo "<tr>";
            echo $apara[];
            echo "</tr>";
        echo "</td>";
    echo "</tr>";

    


?>
</body>
</html>