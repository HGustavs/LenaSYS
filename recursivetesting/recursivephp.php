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
    var_dump($contentArr);
    echo "<table>";
    echo "<td>";
    foreach($contentArr as $contentItem) {
        echo "<tr>$contentItem</tr>";
    }
    echo "</td>";
    echo "</table>";
    ?>
</body>
</html>

