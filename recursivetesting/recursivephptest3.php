<!DOCTYPE html>
<html lang="en">
<!-- <script src="recursivejs.js" type="module"></script> -->

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<style>
    table, tr {
        border: 1px;
        border-color: black;
        border-style: solid;
    }
    table > p, tr > p, td > p {
        font-family: Arial, Helvetica, sans-serif;
    }
    .key {
        width: 150px;
        font-weight: bold;
        font-size: 16px;
    }
    .value {
        width: 800px;
        font-style: italic;
        font-size: 14px;
    }
</style>

<body>
    <?php
    CheckURL("https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/");
    function checkURL($URL)
    {
        $opts = [
            'http' => [
                'method' => 'GET',
                'header' => [
                    'User-Agent: PHP'
                ]
            ]
        ];
        $context = stream_context_create($opts);
        $streamGet = file_get_contents($URL, true, $context);
        $data = json_decode($streamGet, true);
        BFS($data);
    }

    function BFS($data)
    {
        foreach ($data as $item) {
            echo "<table style='border: 1px solid black'>";
            if($item['type'] == 'file') {
            
            }
            else if($item['type'] == 'dir') {

            }
        }
        echo "</table>";
    }

    ?>
</body>

</html>