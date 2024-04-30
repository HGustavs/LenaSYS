<?php



include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";  


session_start();
pdoConnect();  // Connect to database and start session


class DownloadToWebServer {
    public function download($url, $cid, $opt) {
        // Simplified code to download files from GitHub and save to web server


        // Parse the GitHub URL
        $urlParts = explode('/', $url);
        $username = $urlParts[3];
        $repository = $urlParts[4];

        // Construct the  $translatedURL
        $translatedURL = 'https://api.github.com/repos/'.$username.'/'.$repository.'/contents/';

        // Fetch data from the  $translatedURL
        $data = file_get_contents( $translatedURL);
        $json = json_decode($data, true);

        // Iterate over each item in the JSON data
        foreach ($json as $item) {
            if ($item['type'] == 'file') {
                // Download file and save to web server
                
                $fileContents = file_get_contents($item['download_url']);
                $path = '../../LenaSYS/courses/'. $cid . '/' . "Github" .'/' . $item['path'];
                file_put_contents($path, $fileContents);
            }
        }
    }
}

// Usage:
$service = new DownloadToWebServer();
$service->download($url, $cid, $opt);
?>
