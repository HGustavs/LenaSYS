<?php
    $token = file_get_contents('../../../secrets/canvas_token.txt', true);

    function courses(){
        $token = $GLOBALS["token"];
        $url = "http://canvas.webug.his.se/api/v1/courses?access_token={$token}";
        $json = file_get_contents($url);
        $json_data = json_decode($json, true);
        $temp = array();
        foreach ($json_data as $key=>$value) {
            array_push($temp, $value);
         }
        return $temp;
    }

    function assignments($course){
        $token = $GLOBALS["token"];
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments?access_token={$token}";
        $json = file_get_contents($url);
        $json_data = json_decode($json, true);
        $temp = array();
        foreach ($json_data as $key=>$value) {
            array_push($temp, $value);
         }
         return $temp;
     }

    $courses = courses();
    foreach ($courses as $course){
        $assignments = assignments($course);
        foreach($assignments as $assignment){
            echo <<<EOL
            <h3>Course: {$course['name']} <br>
            Assignment: {$assignment['name']}</h3>
            URL : {$assignment['html_url']}
            <hr>
            EOL;
        }
    }

?>