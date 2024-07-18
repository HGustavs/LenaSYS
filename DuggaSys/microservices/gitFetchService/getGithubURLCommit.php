<?php

// GitHub API endpoint
$api_url = "https://api.github.com/repos/HGustavs/LenaSYS/commits"; //generic link as makeshift solution

// Replace with your GitHub Personal Access Token if you have one
$github_token = "";

// Initialize cURL session
$curlhandle = curl_init($api_url);

// Set cURL options
$headers = ["User-Agent: PHP Script"];
if (!empty($github_token)) {
    $headers[] = "Authorization: token $github_token";
}

curl_setopt($curlhandle, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curlhandle, CURLOPT_HTTPHEADER, $headers);

// Execute cURL request
$response = curl_exec($curlhandle);

// Check for cURL errors
if (curl_errno($curlhandle)) {
    echo json_encode(["error" => "cURL error: " . curl_error($curlhandle)]);
    exit;
}

// Get HTTP status code
$http_code = curl_getinfo($curlhandle, CURLINFO_HTTP_CODE);

// Close cURL session
curl_close($curlhandle);

// Check HTTP status code
if ($http_code != 200) {
    echo json_encode(["error" => "HTTP error: $http_code", "response" => $response]);
    exit;
}

// Decode JSON response
$commits = json_decode($response, true);

// Check if JSON decoding was successful
if (json_last_error() !== JSON_ERROR_NONE) {
    echo json_encode([
        "error" => "JSON decoding error: " . json_last_error_msg(),
        "raw_response" => $response
    ]);
    exit;
}

// Check if received an array of commits
if (!is_array($commits)) {
    echo json_encode([
        "error" => "Unexpected response format",
        "response_type" => gettype($commits),
        "response" => $commits
    ]);
    exit;
}

// Process and return the commits data
$processed_commits = [];
foreach ($commits as $commit) {
    if (isset($commit["sha"], $commit["commit"]["message"], $commit["commit"]["author"]["name"], $commit["commit"]["author"]["date"])) {
        $processed_commits[] = [
            "sha" => $commit["sha"],
            "message" => $commit["commit"]["message"],
            "author" => $commit["commit"]["author"]["name"],
            "date" => $commit["commit"]["author"]["date"]
        ]; //change to be able to commit don't mind this comment 
    }
}
// Output the commits as JSON
header("Content-Type: application/json");
echo json_encode($processed_commits);