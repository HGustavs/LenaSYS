<?php
    include 'login.php';
    
    function sendData($URL, $data){
        $ch = curl_init();
        $headers = array(
          "Authorization: Bearer ". $GLOBALS['token'],
        );
        // giving curl session handle 
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_URL,$URL);
        curl_setopt($ch, CURLOPT_POST,1);
        //curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'POST');
        curl_setopt($ch, CURLOPT_POSTFIELDS, ($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        

        curl_setopt($ch, CURLOPT_VERBOSE, true);

        $result=curl_exec ($ch);
        curl_close ($ch);

        $fileupload=json_decode($result,true);

        return $fileupload;
    }
    // gets data from the url.
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
    // getting course data 
    function courses(){
        $url = "http://canvas.webug.his.se/api/v1/courses";
        return getData($url);
    }
    // getting coursestudent data
    function courseStudents($course){

    function getCourses(){
        $url = "http://canvas.webug.his.se/api/v1/courses";
        return getData($url);
    }

    function getCourseStudents($course){
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/users";
        return getData($url);
    }

    function postCommentSubmission($course ,$submission){
        $comment = [
            "text_comment" => "Testar detta",
        ];
        
        echo "Målet :";
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments/{$submission['assignment_id']}/submissions/{$submission['user_id']}";
        echo $url . "<br>";
        print_r(getData($url));
        echo "<br><br><br>";
        print_r($submission);
        $url = "http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments/{$submission['assignment_id']}/submissions/{$submission['user_id']}";

        return sendData($url, $comment);
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