<?php
include_once "../Shared/sessions.php";
include_once "../Shared/basic.php";    
session_start();
pdoConnect();


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

?>