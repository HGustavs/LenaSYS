<?php
    $token = file_get_contents('../../../secrets/canvas_token.txt', true);

    $url = 'http://canvas.webug.his.se/api/v1/courses?access_token=' . $token;
    $json = file_get_contents($url);
    $json_data = json_decode($json);
    print_r($json_data);
?>