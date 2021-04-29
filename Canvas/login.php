<?php
    $token = file_get_contents('../../../secrets/canvas_token.txt', true);

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

    $courses = courses();
    foreach ($courses as $course){
        $assignments = assignments($course);
        $saveAssignment;
        foreach($assignments as $assignment){
            if ($assignment['id'] == 1){
                echo <<<EOL
                <h3>
                    Course: {$course['name']}
                    <br>
                    Assignment: {$assignment['name']}
                </h3>
                URL : {$assignment['html_url']}
                <hr>
                EOL;
                $saveAssignment = $assignment;
                $submissions = submissions($course, $assignment);
                foreach($submissions as $submission){
                    print_r($submission);
                    echo <<<EOL
                    <br>
                    <br>
                    Submission ID: {$submission['id']}
                    <br>
                    Student  ID: {$submission['user_id']}
                    <br>
                    url: {$submission['preview_url']}
                    <hr style="color:grey">
                    EOL;
                }
                echo "<hr>";
            }
        }
        $saveStudent;
        $students = courseStudents($course);  
        foreach($students as $student){
            if($student['id'] == 7){
                echo <<<EOL
                Student: {$student['name']}
                <br>
                ID: {$student['id']}
                <hr>
                EOL;
                $saveStudent = $student;
                
            }
        }
        //commentAssignment($saveStudent, $saveAssignment);
        echo "<br>";
        //studentSubmission($saveStudent, $saveAssignment);
    }



?>