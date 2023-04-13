<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>

<style>
    html {
        font-family: "Lucida Console", "Monaco", monospace;
    }

    table {
        margin: 0 auto;
        border-collapse: collapse;
        text-align: left;
        border: 1px solid black;
    }

    th,
    td,
    tr {
        width: 325px;
        padding: 10px;
        border: 1px solid black;
        font-size: 14px;
    }
</style>

<body>
    <?php

    // Here you paste the appropriate link for the given repo that you wish to inspect and traverse.
    $url = 'https://github.com/e21krida/Webbprogrammering-Examples';
    // Dismantles the $url into an array of each component, separated by a slash
    $urlParts = explode('/', $url);
    // In normal GitHub Repo URL:s, the username is the third object separated by a slash
    $username = $urlParts[3];
    // In normal GitHub Repo URL:s, the repo is the fourth object separated by a slash
    $repository = $urlParts[4];
    // Translates the parts broken out of $url into the correct URL syntax for an API-URL 
    $translatedURL = 'https://api.github.com/repos/'.$username.'/'.$repository.'/contents/';
    bfs($translatedURL);
    $pdo = new PDO($database, $username, $password);
    function insertIntoTable($item) {

    $query = $pdo->prepare('INSERT INTO gitRepos (repoName, repoURL, repoFileType, repoDownloadURL, repoSHA, RepoPath)
                          VALUES (:repoName, :repoURL, :repoFileType, :repoDownloadURL, :repoSHA, :repoPath)');
    $query->bindParam(':repoName', $item['name']);
    $query->bindParam(':repoURL', $item['repoURL']);
    $query->bindParam(':repoFileType', $item['type']);
    $query->bindParam(':repoDownloadURL', $item['download_url']);
    $query->bindParam(':repoSHA', $item['sha']);
    $query->bindParam(':repoPath', $item['path']);
    }

    function bfs($url)
    {
        $visited = array();
        $fifoQueue = array();
        array_push($fifoQueue, $url);

        while (!empty($fifoQueue)) {
            // Randomizes colors for easier presentation
            $R = rand(155, 255);
            $G = rand(155, 255);
            $B = rand(155, 255);
            $currentUrl = array_shift($fifoQueue);
            echo "<h3 style='display: flex; place-content: center;'>" . $currentUrl . "</h3>";
            // Necessary headers to send with the request, 'User-Agent: PHP' is necessary. 
            $opts = [
                'http' => [
                    'method' => 'GET',
                    'header' => [
                        'User-Agent: PHP',
                        // If you wish to avoid the API-fetch limit, below is a comment that implements the ability to send a GitHub token key, 
                        // simply replace 'YOUR_GITHUB_API_KEY' with a working token and un-comment the line to send the token as a header for your request. 
                        // To clarify, the syntax will remain as 'Authorization: Bearer 'YOUR_GITHUB_API_KEY' which is a personal token (Settings -> Developer Settings -> Personal Access Token)
                        // Example: 'Authorization: Bearer ghp_y2h1AzwRlaCpUFzEgafT656bDoNSCQ7Y2GSx'
                        // 'Authorization: Bearer YOUR_GITHUB_API_KEY'
                    ]
                ]
            ];
            // Starts a stream with the required headers
            $context = stream_context_create($opts);
            // Fetches the data with the stream included
            $data = @file_get_contents($currentUrl, true, $context);
            if ($data) {
                // Decodes the fetched data into JSON
                $json = json_decode($data, true);
                // Loops through each item fetched in the JSON data
                foreach ($json as $item) {
                    if ($json) {
                        // Checks if the fetched item is of type 'file'
                        if ($item['type'] == 'file') {
                            echo '<table style="background-color: rgb(' . $R . ',' . $G . ',' . $B . ')"><tr><th>Name</th><th>URL</th><th>Type</th><th>Size</th><th>Download URL</th><th>SHA</th><th>Path</th></tr>';
                            echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>' . $item['size'] . '</td><td><a href="' . $item['download_url'] . '">Download URL</a></td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
                            // Checks if the fetched item is of type 'dir'
                        } else if ($item['type'] == 'dir') {
                            echo '<table style="background-color: rgb(' . $R . ',' . $G . ',' . $B . ')"><tr><th>Name</th><th>URL</th><th>Type</th><th>Size</th><th>Download URL</th><th>SHA</th><th>Path</th></tr>';
                            echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>-</td><td>NULL</td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
                            if (!in_array($item['url'], $visited)) {
                                array_push($visited, $item['url']);
                                array_push($fifoQueue, $item['url']);
                            }
                        }
                        insertIntoTable($item);
                        echo "</table>";
                    } else {
                        echo "<h2 style='display: flex; place-content: center;'>Invalid JSON</h2>";    
                    }
                }
            } else {
                echo "<h2 style='display: flex; place-content: center;'>Invalid Link</h2>";     
            }
        }
    }
    ?>
</body>

</html>