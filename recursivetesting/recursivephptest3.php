<!DOCTYPE html>
<html lang="en">
<!-- <script src="recursivejs.js" type="module"></script> -->

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<style>
    table,
    tr {
        border: 1px;
        border-color: black;
        border-style: solid;
    }

    table>p,
    tr>p,
    td>p {
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
    BFS('https://api.github.com/repos/HGustavs/Webbprogrammering-Examples/contents/');
    function BFS($url)
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
        $data = file_get_contents($url, true, $context);
        $json = json_decode($data, true);

        // Loops through each item fetched in the JSON data
        foreach ($json as $item) {
            echo '<table><tr><th>Name</th><th>URL</th><th>Type</th><th>Size</th><th>Download URL</th><th>SHA</th><th>Path</th></tr>';
            // Checks if the fetched item is of type 'file'
            if ($item['type'] == 'file') {
                echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>' . $item['size'] . '</td><td><a href="' . $item['download_url'] . '">Download URL</a></td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
                // Checks if the fetched item is of type 'dir'
            } else if ($item['type'] == 'dir') {
                echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">' . $item['html_url'] . '</a></td><td>' . $item['type'] . '</td><td>-</td><td>NULL</td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
                BFS($item['url']);
            }
            echo "</table>";
        }
    }

    ?>
</body>

</html>