<?php
    include 'login.php';

    function sendData($URL, $data){
        $ch = curl_init($URL);
        $headers = array(
          "Authorization: Bearer ". $GLOBALS['token'],
        );

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        

        $result=curl_exec ($ch);
        curl_close ($ch);

        $fileupload=json_decode($result,true);

        return $fileupload;
    }
    function getData($URL){
        $ch = curl_init($URL);
        $headers = array(
          "Authorization: Bearer ". $GLOBALS['token'],
        );

        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        

        curl_setopt($ch, CURLOPT_VERBOSE, true);

        $result=curl_exec ($ch);
        curl_close ($ch);

        $fileupload=json_decode($result,true);

        return $fileupload;
    }

    function getCourses(){
        $url = "http://canvas.webug.his.se/api/v1/courses";
        return getData($url);
    }

    function getCourseStudents($course){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/users";
        return getData($url);
    }

    function putCommentSubmission($course, $submission, $data){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments/{$submission['assignment_id']}/submissions/{$submission['user_id']}";
        return sendData($url, $data);
    }
    function getAssignment($student, $assignment){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$assignment['course_id']}/assignments/{$assignment['id']}/submissions/{$student['id']}";
        return getCurl($url);
     }
    function getAssignments($course){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments";
        return getData($url);
     }
    function getSubmissions($course, $assignment){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments/{$assignment['id']}/submissions";
        return getData($url);
    }
    function getSubmission($student, $assignment){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$assignment['course_id']}/assignments/{$assignment['id']}/submissions/{$student['id']}";
        return getData($url);
    }

?>