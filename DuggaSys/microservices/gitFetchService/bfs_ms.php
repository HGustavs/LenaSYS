<?php

function bfs($url, $cid, $opt) 
{
    // Different URL depending on operation
    date_default_timezone_set("Europe/Stockholm");
    if($opt == "GETCOMMIT"){
        $url = getGitHubURLCommit($url);
    }
    else{
        $url = getGitHubURL($url);
    }
    $filesToIgnore = getIndexFile($url);
    $filesVisited = array();
    $visited = array();
    $fifoQueue = array();
    array_push($fifoQueue, $url);
    setcookie("missingToken", 0, time() + (5), "/");
    global $pdoLite;
    $pdoLite = new PDO('sqlite:../../githubMetadata/metadata2.db');

	$query = $pdoLite->prepare('SELECT gitToken FROM gitRepos WHERE cid=:cid');
	$query->bindParam(':cid', $cid);

	$query->execute();
	foreach($query->fetchAll(PDO::FETCH_ASSOC) as $row){
		$token = $row['gitToken'];
	}


    while (!empty($fifoQueue)) {
        $currentUrl = array_shift($fifoQueue);
        // Necessary headers to send with the request, 'User-Agent: PHP' is necessary. 
        //if there is a github token it will be used
        if(isset($token))
        {
            $opts = [
                'http' => [
                    'method' => 'GET',
                    'header' => [
                        'User-Agent: PHP',
                        // If you wish to avoid the API-fetch limit, below is a comment that implements the ability to send a GitHub token key, 
                        // simply replace 'YOUR_GITHUB_API_KEY' with a working token and un-comment the line to send the token as a header for your request. 
                        // To clarify, the syntax will remain as 'Authorization: Bearer 'YOUR_GITHUB_API_KEY' which is a personal token (Settings -> Developer Settings -> Personal Access Token)
                        // Example: 'Authorization: Bearer ghp_y2h1AzwRlaCpUFzEgafT656bDoNSCQ7Y2GSx'
                        'Authorization: Bearer '.$token
                    ]
                ]
            ];
        }
        else{
            $opts = [
                'http' => [
                    'method' => 'GET',
                    'header' => [
                        'User-Agent: PHP',
                    ]
                ]
            ];
        }
        // Starts a stream with the required headers
        $context = stream_context_create($opts);
        // Fetches the data with the stream included
        $data = @file_get_contents($currentUrl, true, $context);
        // If unable to get file contents then it is logged into the specified textfile with
        // the specific http error code
        if($data === false || !$data) {
            if(strlen($token)<1)
            {
                setcookie("missingToken", 1, time() + (5), "/");
            }
            else
            {
                $curl = curl_init($url);
                curl_setopt($curl, CURLOPT_USERAGENT, 'curl/7.48.0');
                curl_setopt($curl, CURLOPT_HEADER, 0);
                curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
                $response = json_decode(curl_exec($curl));
                $http_response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
                $message = "\n" . date("Y-m-d H:i:s",time()) . " - Error: connection failed - Error code: ".$http_response_code."\n";
                $file = '../../LenaSYS/log/gitErrorLog.txt';
                
                http_response_code($http_response_code);
                error_log($message, 3, $file);
            }
        }
        if ($data) {
            // Decodes the fetched data into JSON
            $json = json_decode($data, true);
            if($opt == "GETCOMMIT"){
                return $json['sha'];
            }
            // Loops through each item fetched in the JSON data
            if ($json) {
                foreach ($json as $item) {
                    // Checks if the fetched item is of type 'file'
                    if ($item['type'] == 'file') {
                        //If an index file has been found, check against the content of the index file
                        if ($item['name'] != ".gitignore") {
                            if ($filesToIgnore) {
                                // If the file is not part of files to ignore, resume (Index file)
                                if (!in_array($item['name'], $filesToIgnore) && !in_array($item['name'], $filesVisited)) {
                                    if ($opt == "REFRESH") {
                                        insertToMetaData($cid, $item);
                                        array_push($filesVisited,$item['name']);
                                    } else if ($opt == "DOWNLOAD") {
                                        insertToFileLink($cid, $item);
                                        insertToMetaData($cid, $item);
                                        downloadToWebserver($cid, $item);
                                        array_push($filesVisited,$item['name']);
                                    }
                                }
                                // Otherwise, fetch and download all files
                            } else {
                                if (!in_array($item['name'], $filesVisited)) {
                                    if ($opt == "REFRESH") {
                                        insertToMetaData($cid, $item);
                                        array_push($filesVisited,$item['name']);
                                    } else if ($opt == "DOWNLOAD") {
                                        insertToFileLink($cid, $item);
                                        insertToMetaData($cid, $item);
                                        downloadToWebserver($cid, $item);
                                        array_push($filesVisited,$item['name']);
                                    }
                                }
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
        }
    }
}

?>