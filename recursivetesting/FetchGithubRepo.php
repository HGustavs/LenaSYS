<?php
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";    
session_start();
pdoConnect(); // Connect to database and start session

//Get data from AJAX call in courseed.js and then runs the function getNewCourseGithub link
if(isset($_POST['action'])) 
{
    if($_POST['action'] == 'getNewCourseGitHub') 
    {
        getNewCourseGitHub($_POST['githubURL']);
    }
};

//Calls getGithubURL to get the correct URL for the API. Then calls the Breadth-first algorithm to get all files.
function getNewCourseGitHub($githubURL)
{
    getGitHubURL($githubURL);
}

function getGitHubURL($url)
{
    $urlParts = explode('/', $url);
    // In normal GitHub Repo URL:s, the username is the third object separated by a slash
    $username = $urlParts[3];
    // In normal GitHub Repo URL:s, the repo is the fourth object separated by a slash
    $repository = $urlParts[4];
    // Translates the parts broken out of $url into the correct URL syntax for an API-URL 
    $translatedURL = 'https://api.github.com/repos/'.$username.'/'.$repository.'/contents/';
    bfs($translatedURL, $repository);
}

// ------ DUMMY DATA FOR TESTING------ 
// Here you paste the appropriate link for the given repo that you wish to inspect and traverse.
// $url = 'https://github.com/e21krida/Webbprogrammering-Examples';
// Dismantles the $url into an array of each component, separated by a slash
// $urlParts = explode('/', $url);
// In normal GitHub Repo URL:s, the username is the third object separated by a slash
// $username = $urlParts[3];
// In normal GitHub Repo URL:s, the repo is the fourth object separated by a slash
// $repository = $urlParts[4];
// Translates the parts broken out of $url into the correct URL syntax for an API-URL 
// $translatedURL = 'https://api.github.com/repos/'.$username.'/'.$repository.'/contents/';
// bfs($translatedURL, $repository);
// ----------------------------------

function insertToFileLink($cid, $item) {
    global $pdo;
    $fileText = $item['name']; 
    $filePath = $item['path']; 
    $filesize = $item['size']; // Size
    $kindid = 3; // The kind(course local/version local/global), 3 = course local

    $query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=:kindid AND path=:filePath;"); 
    // bind query results into local vars.
    $query->bindParam(':filename', $fileText);
    $query->bindParam(':cid', $cid);
    $query->bindParam(':filePath', $filePath);
    $query->bindParam(':kindid', $kindid);
    $query->execute();
    $norows = $query->fetchColumn();

    // creates SQL strings for inserts into filelink database table. Different if-blocks determine the visible scope of the file. Runs if the file doesn't exist in the DB.
    if ($norows == 0) {      
        $query = $pdo->prepare("INSERT INTO fileLink(filename, path, kind,cid,filesize) VALUES(:filename, :filePath, :kindid,:cid,:filesize)");
        $query->bindParam(':cid', $cid);
        $query->bindParam(':filename', $fileText);
        $query->bindParam(':filePath', $filePath);
        $query->bindParam(':filesize', $filesize);
        $query->bindParam(':kindid', $kindid);
        // Runs SQL query and runs general error handling if it fails.
        if (!$query->execute()) {
            $error = $query->errorInfo();
            echo "Error updating file entries" . $error[2];
            // $errortype ="uploadfile";
            $errorvar = $error[2];
            print_r($error);
            echo $errorvar;
        } 
    }
}
    
function bfs($url, $repository)
{
    $visited = array();
    $fifoQueue = array();
    // TODO remove repository creation bacuse we create folders in course local
    // If the directory doesn't exist, make it
    if(!file_exists('../../LenaSYS/courses/' . $repository . '')) {
        if(!mkdir('../../LenaSYS/courses/' . $repository . '')){
        echo "Error creating folder: $repository";
        die;
      }
    }
    array_push($fifoQueue, $url);
    $pdoLite = new PDO('sqlite:../../githubMetadata/metadata2.db');

    // TODO link the course with cid, should not be hardcoded 
    $cid = 1; // 1 för webbprogramering 
    
    while (!empty($fifoQueue)) {
        // TODO REMOVE RGB old styling 
        // Randomizes colors for easier presentation
        $R = rand(155, 255);
        $G = rand(155, 255);
        $B = rand(155, 255);
        $currentUrl = array_shift($fifoQueue);
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
            if ($json) {
                foreach ($json as $item) {
                    // Checks if the fetched item is of type 'file'
                    if ($item['type'] == 'file') {
                        // Retrieves the contents of each individual file based on the fetched "download_url"
                        $fileContents = file_get_contents($item['download_url']);
                        $path = '../../LenaSYS/courses/'. $cid . '/' . "Github" .'/' . $item['path'];
                        echo "<script>console.log('Debug Objects: " . $path . "' );</script>";
                        // Creates the directory for each individual file based on the fetched "path"
                        if (!file_exists((dirname($path)))) {
                            mkdir(dirname($path), 0777, true);
                        } 

                        insertToFileLink($cid, $item);
                        // Writes the file to the respective folder. 
                        file_put_contents($path, $fileContents);
                        // TODO remove old html style
                        echo '<table style="background-color: rgb(' . $R . ',' . $G . ',' . $B . ')"><tr><th>Name</th><th>URL</th><th>Type</th><th>Size</th><th>Download URL</th><th>SHA</th><th>Path</th></tr>';
                        echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>' . $item['size'] . '</td><td><a href="' . $item['download_url'] . '">Download URL</a></td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';                           
                        // Checks if the fetched item is of type 'dir'
                    } else if ($item['type'] == 'dir') {
                        // TODO REMOVE old styling 
                        echo '<table style="background-color: rgb(' . $R . ',' . $G . ',' . $B . ')"><tr><th>Name</th><th>URL</th><th>Type</th><th>Size</th><th>Download URL</th><th>SHA</th><th>Path</th></tr>';
                        echo '<tr><td>' . $item['name'] . '</td><td><a href="' . $item['html_url'] . '">HTML URL</a></td><td>' . $item['type'] . '</td><td>-</td><td>NULL</td><td>' . $item['sha'] . '</td><td>' . $item['path'] . '</td></tr>';
                        if (!in_array($item['url'], $visited)) {
                            array_push($visited, $item['url']);
                            array_push($fifoQueue, $item['url']);
                        }
                    }
                    $query = $pdoLite->prepare('INSERT INTO gitRepos (repoName, repoURL, repoFileType, repoDownloadURL, repoSHA, RepoPath) VALUES (:repoName, :repoURL, :repoFileType, :repoDownloadURL, :repoSHA, :repoPath)');
                    $query->bindParam(':repoName', $item['name']);
                    $query->bindParam(':repoURL', $item['repoURL']);
                    $query->bindParam(':repoFileType', $item['type']);
                    $query->bindParam(':repoDownloadURL', $item['download_url']);
                    $query->bindParam(':repoSHA', $item['sha']);
                    $query->bindParam(':repoPath', $item['path']);
                    $query->execute();
                    echo "</table>"; 
                }
            } else {
                //422: Unprocessable entity
                http_response_code(422);
                header('Content-type: application/json');
                $response = array(
                    'message' => "The JSON-file is invalid",
                    'json' => $json
                );

                echo json_encode($response);
            }
        } else {
            //503: Service is unavailable
            http_response_code(503);
            header('Content-type: application/json');
            $response = array(
                'message' => "Github services are unavailable at this time.",
                'data' => $data
            );

            echo json_encode($response);
        }
    }
}
?>
