<?php

include 'api.php';

$courses = getCourses();
    foreach ($courses as $course){
        $assignments = getAssignments($course);
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
                $submissions = getSubmissions($course, $assignment);
                foreach($submissions as $submission){
                    if($submission['user_id'] == 5){
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
                        postCommentSubmission($course, $submission);
                    }
                }
                echo "<hr>";
            }
        }
        $saveStudent;
        $students = getCourseStudents($course);  
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
        echo "<br>";
        //studentSubmission($saveStudent, $saveAssignment);
    }

?>