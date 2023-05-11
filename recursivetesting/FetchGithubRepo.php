<?php
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";    
session_start();
pdoConnect(); // Connect to database and start session

//Get data from AJAX call in courseed.js and then runs the function getNewCourseGithub link
/* if(isset($_POST['action'])) 
{
    if($_POST['action'] == 'getNewCourseGitHub') 
    {
       getGitHubURL($_POST['githubURL']);
    }
}; */

function getGitHubURL($url)
{
    $urlParts = explode('/', $url);
    // In normal GitHub Repo URL:s, the username is the third object separated by a slash
    $username = $urlParts[3];
    // In normal GitHub Repo URL:s, the repo is the fourth object separated by a slash
    $repository = $urlParts[4];
    // Translates the parts broken out of $url into the correct URL syntax for an API-URL 
    $translatedURL = 'https://api.github.com/repos/'.$username.'/'.$repository.'/contents/';
    // bfs($translatedURL, "REFRESH");
    return $translatedURL;
}

function insertToFileLink($cid, $item) 
{
    global $pdo;
    $kindid = 3; // The kind(course local/version local/global), 3 = course local
    $query = $pdo->prepare("SELECT count(*) FROM fileLink WHERE cid=:cid AND filename=:filename AND kind=:kindid AND path=:filePath;"); 
    // bind query results into local vars.
    $query->bindParam(':filename', $item['name']);
    $query->bindParam(':cid', $cid);
    $query->bindParam(':filePath', $item['path']);
    $query->bindParam(':kindid', $kindid);
    $query->execute();
    // creates SQL strings for inserts into filelink database table. Different if-blocks determine the visible scope of the file. Runs if the file doesn't exist in the DB.
    if ($query->fetchColumn() == 0) {      
        $query = $pdo->prepare("INSERT INTO fileLink(filename, path, kind,cid,filesize) VALUES(:filename, :filePath, :kindid,:cid,:filesize)");
        $query->bindParam(':cid', $cid);
        $query->bindParam(':filename', $item['name']);
        $query->bindParam(':filePath', $item['path']);
        $query->bindParam(':filesize', $item['size']);
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

function insertToMetaData($cid, $item) 
{
    global $pdoLite;
    $query = $pdoLite->prepare('INSERT INTO gitFiles (cid, fileName, fileType, fileURL, downloadURL, fileSHA, filePath) VALUES (:cid, :fileName, :fileType, :fileURL, :downloadURL, :fileSHA, :filePath)');
    $query->bindParam(':cid', $cid);
    $query->bindParam(':fileName', $item['name']);
    $query->bindParam(':fileType', $item['type']);
    $query->bindParam(':fileURL', $item['url']);
    $query->bindParam(':downloadURL', $item['download_url']);
    $query->bindParam(':fileSHA', $item['sha']);
    $query->bindParam(':filePath', $item['path']);
    $query->execute();
}

function downloadToWebServer($cid, $item) 
{
    // Retrieves the contents of each individual file based on the fetched "download_url"
    $fileContents = file_get_contents($item['download_url']);
    $path = '../../LenaSYS/courses/'. $cid . '/' . "Github" .'/' . $item['path'];
    // Creates the directory for each individual file based on the fetched "path"
    if (!file_exists((dirname($path)))) {
        mkdir(dirname($path), 0777, true);
    } 
    // Writes the file to the respective folder. 
    file_put_contents($path, $fileContents);    
}
    
//Retrieves the content of a repos index-file
function getIndexFile($url) {
	$indexFilePath = "/index.txt";
	$url = $url . $indexFilePath;

	$headers = get_headers($url);
  if(substr($headers[0], 9, 3) == "200"){
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
				//'Authorization: Bearer YOUR_GITHUB_API_KEY'
				]
			]
		];
		// Starts a stream with the required headers
		$context = stream_context_create($opts);
		// Fetches the data with the stream included
		$data = @file_get_contents($url, true, $context);
		if($data) {
			$json = json_decode($data, true);
			if($json) {
				//Get content of JSON-object and split files to individual index of the array
				$array = file_get_contents($json['download_url']);
				return explode("\n", $array);
			}
		}
	}	
}

function bfs($url, $cid, $opt) 
{
    $url = getGitHubURL($url);
    $filesToDownload = getIndexFile($url);
    $visited = array();
    $fifoQueue = array();
    array_push($fifoQueue, $url);
    global $pdoLite;
    $pdoLite = new PDO('sqlite:../../githubMetadata/metadata2.db');
    while (!empty($fifoQueue)) {
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
								if ($item['type'] == 'file') {
									if($filesToDownload){
										//If file is part of filestoDownload (Index file)
										if(in_array($item['name'], $filesToDownload)){
											// Checks if the fetched item is of type 'file'
											if($opt == "REFRESH") {
												insertToMetaData($cid, $item);
											}
											else if($opt == "DOWNLOAD") {
												insertToFileLink($cid, $item);
												insertToMetaData($cid, $item);
												downloadToWebserver($cid, $item);  
											}                 
										}
									} else {
											// Checks if the fetched item is of type 'file'
											if($opt == "REFRESH") {
												insertToMetaData($cid, $item);
											}
											else if($opt == "DOWNLOAD") {
												insertToFileLink($cid, $item);
												insertToMetaData($cid, $item);
												downloadToWebserver($cid, $item);  
											}      
									}
									// Checks if the fetched item is of type 'dir'
								} else if ($item['type'] == 'dir') {
									if (!in_array($item['url'], $visited)) {
										array_push($visited, $item['url']);
										array_push($fifoQueue, $item['url']);
									}
								}
              }
            } else {
                //422: Unprocessable entity
                http_response_code(422);
                header('Content-type: application/json');
                $response = array(
                    'message' => "The JSON-file is invalid"
                );

                echo json_encode($response);
            }
        } else {
            //503: Service is unavailable
            http_response_code(503);
            header('Content-type: application/json');
            $response = array(
                'message' => "Github services are unavailable at this time."
            );
            echo json_encode($response);
        }
    }
}

?>
