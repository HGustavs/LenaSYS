<?php
function getIndexFile($url) {
    $indexFilePath = "/index.txt";
    $url = $url . $indexFilePath;

    $curl = curl_init($url);
    curl_setopt($curl, CURLOPT_USERAGENT, 'curl/7.48.0');
    curl_setopt($curl, CURLOPT_HEADER, 0);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, 0);
    curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, 0);
    $response = json_decode(curl_exec($curl));
    $http_response_code = curl_getinfo($curl, CURLINFO_HTTP_CODE);
    curl_close($curl);
    
    if($http_response_code == 200){
        return explode("\n", file_get_contents($response->download_url));
    } else {
        return false;
    }
}
?>