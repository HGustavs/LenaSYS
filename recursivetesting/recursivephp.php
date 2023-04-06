<!DOCTYPE html>
<html lang="en">
<script src="recursivejs.js" type="module"></script>
<head>
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<?php
$opts = [
    'http' => [
        'method' => 'GET',
        'header' => [
            'User-Agent: PHP'
            ]
            ]
        ];
        
        $context = stream_context_create($opts);
        $content = file_get_contents("https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/", false, $context);
        $contentArr = json_decode($content, true);
        foreach($contentArr as $contentArr2) {
            echo "<table style='border: 1px solid black'>";
            echo "<td>";
            foreach($contentArr2 as $key => $value) {
                echo "<tr><td>" . $key . "</td>";
                if(is_array($value) == true) {
                    foreach($value as $k2 => $v2) {
                        echo "<td>" . $k2 . "</td>";
                    }
                } else {
                    echo "<td>" . $value . "</td></tr>";
                }
                if($value == "dir") {
                    print_r($value);
                    print_r($key);
                }
            }
            echo "</tr>";
            echo "</table>";
        }
        ?> 
    </body>
</html>