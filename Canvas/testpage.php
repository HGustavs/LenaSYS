<?php

include 'api.php';

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