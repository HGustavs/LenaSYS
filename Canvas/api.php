<?php
    include 'login.php';

    //  Canvas connection handlers
    //  Creates the request in such a way that canvas can resive it

    // Puts data on to canvas
    function putData($URL, $data){
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

    // gets data from the url.
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
    

    // GET API
    // Functions created to handle the get requests and return the values in a array format

    // getting course data 
    function getCourses(){
        return getData("http://canvas.webug.his.se/api/v1/courses");
    }

    function getCourse($courseID){
        return getData("http://canvas.webug.his.se/api/v1/courses/{$courseID}");
    }
    // getting coursestudent data
    function getCourseStudents($course){
        return getData("http://canvas.webug.his.se/api/v1/courses/{$course['id']}/users");
    }

    function getAssignment($student, $assignment){
        return getData("http://canvas.webug.his.se/api/v1/courses/{$assignment['course_id']}/assignments/{$assignment['id']}/submissions/{$student['id']}");
     }

    function getAssignments($course){
        return getData("http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments");
     }

    function getSubmissions($course, $assignment){
        return getData("http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments/{$assignment['id']}/submissions");
    }

    function getSubmission($student, $assignment){
        return getData("http://canvas.webug.his.se/api/v1/courses/{$assignment['course_id']}/assignments/{$assignment['id']}/submissions/{$student['id']}");
    }

    
    // PUT API
    // Functions created to handle the put requests and return the response in a array format

    function putCommentSubmission($course, $submission, $data){
        return putData("http://canvas.webug.his.se/api/v1/courses/{$course['id']}/assignments/{$submission['assignment_id']}/submissions/{$submission['user_id']}", $data);
    }

?>