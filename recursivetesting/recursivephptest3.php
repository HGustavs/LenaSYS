<!DOCTYPE html>
<html lang="en">
<!-- <script src="recursivejs.js" type="module"></script> -->

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<style>
    table {
        width: 1500px;
        margin: 0 auto;
        border-collapse: collapse;
        text-align: left;
        border: 1px solid black;
    }

    th,
    td,
    tr {
        width: 250px;
        padding: 10px;
        border: 1px solid black;
    }

    table>p,
    tr>p,
    td>p {
        font-family: Arial, Helvetica, sans-serif;
    }

    .path1 {
        background-color: #FFCCCC;
    }

    .path2 {
        background-color: #CCFFCC;
    }

    .path3 {
        background-color: #CCCCFF;
    }
</style>

<body>
    <?php
    BFS('https://api.github.com/repos/e21krida/Webbprogrammering-Examples/contents/');
    function BFS($url)
    {
        $opts = [
            'http' => [
                'method' => 'GET',
                'header' => [
                    'User-Agent: PHP',
                    'Authorization: Bearer YOUR_GITHUB_API_KEY' // Replace YOUR_GITHUB_API_KEY with your actual GitHub API key
                ]
            ]
        ];
        $context = stream_context_create($opts);
        $data = file_get_contents($url, true, $context);
        $json = json_decode($data, true);

        // Loops through each item fetched in the JSON data
        foreach ($json as $item) {
            // Count the number of slashes in the path
            $path_count = substr_count($item['path'], '/');
            // Determine the class of the table element based on the path count
            $table_class = 'path' . ($path_count + 1);
            echo '<table class="' . $table_class . '"><tr><th>Name</th><th>URL</th><th>Type</th><th>Size</th><th>Download URL</th><th>SHA</th><th>Path</th></tr>';            // Checks if the fetched item is of type 'file'
            if ($item['type'] == 'file') {
                echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>' . $item['size'] . '</td><td><a href="' . $item['download_url'] . '">Download URL</a></td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
                // Checks if the fetched item is of type 'dir'
            } else if ($item['type'] == 'dir') {
                echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>-</td><td>NULL</td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
                BFS($item['url']);
            }
            echo "</table>";
        }
    }

    ?>
</body>

</html>