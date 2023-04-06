<!DOCTYPE html>
<html lang="en">
<!-- <script src="recursivejs.js" type="module"></script> -->

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<body>
    <?php
    checkURL("https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/");
    function checkURL($URL) {
        $opts = [
            'http' => [
                'method' => 'GET',
                'header' => [
                    'User-Agent: PHP'
                ]
            ]
        ];
        $stream = stream_context_create($opts);
        $streamGet = file_get_contents($URL, false, $stream);
        $data = json_decode($streamGet, true);
        BFS($data);
    }

    function BFS($data) {
        checkURL("https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/");
        foreach ($data as $dataArr) {
            echo "<table style='border: 1px solid black'>";
            foreach ($dataArr as $key => $value) {
                if (is_array($value) == true) {
                    foreach ($value as $key2 => $value2) {
                        echo "<tr><td>" . $key2 . "</td>";
                        echo "<td>" . $value2 . "</td></tr>";
                    }
                } else {
                    echo "<td>" . $key . "</td></tr>";
                    echo "<td>" . $value . "</td></tr>";
                }
                if ($value["type"] == "dir") {
                    $finalValue = json_decode($value);
                    echo "<p>" . ($finalValue) . "</p>";
                    // TODO: Implement recursive checking of urls within git_url when $value of the "type" attribute == "dir"
                }
            }
            echo "</table>";
        }
    }
    ?>
</body>

</html>