<?php
    include 'login.php';

    function sendData($URL, $data){
        $ch = curl_init();
        $headers = array(
          "Authorization: Bearer ". $GLOBALS['token'],
        );

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_URL,$URL);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        

        curl_setopt($ch, CURLOPT_VERBOSE, true);

        $result=curl_exec ($ch);
        curl_close ($ch);

        $fileupload=json_decode($result,true);

        print_r($fileupload);
    }
    function getData($URL){
        $ch = curl_init();
        $headers = array(
          "Authorization: Bearer ". $GLOBALS['token'],
        );

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_URL,$URL);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        

        curl_setopt($ch, CURLOPT_VERBOSE, true);

        $result=curl_exec ($ch);
        curl_close ($ch);

        $fileupload=json_decode($result,true);

        return $fileupload;
    }

    function courses(){
        $url = "http://canvas.webug.his.se/api/v1/courses";
        return getData($url);
    }

    function courseStudents($course){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/users";
        return getData($url);
    }

    function commentAssignment($student, $assignment){
        $comment = [
            "comment" => "Testar detta",
        ];
        $url = "http://canvas.webug.his.se/api/v1/courses/{$assignment['course_id']}/assignments/{$assignment['id']}/submissions/{$student['id']}/comments/1";
        sendData($url, $comment);
    }
    function getAssignment($student, $assignment){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$assignment['course_id']}/assignments/{$assignment['id']}/submissions/{$student['id']}";
        return getCurl($url);
     }
    function assignments($course){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments";
        return getData($url);
     }
    function submissions($course, $assignment){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments/{$assignment['id']}/submissions";
        return getData($url);
    }
    function studentSubmission($student, $assignment){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$assignment['course_id']}/assignments/{$assignment['id']}/submissions/{$student['id']}";
        return getData($url);
    }

?>