<?php

include 'api.php';
// print data from submitted assigment, we can tell the date submission was made and did it by looking at user_id
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
                        /*
                        This code bellow works for making a comment on a submission.
                        It was used to comment on Kristina Larsson' submission 
                        http://canvas.webug.his.se/courses/1/assignments/1?module_item_id=7
                        but it should work on other submissions also if the course and submission exists.

                        $data = [
                            "comment" => [
                                "text_comment" => "Mera mer"
                                ]
                            ];
                        print_r(putCommentSubmission($course, $submission, $data));
                        */
                    }
                }
                echo "<hr>";
            }
        }
        

        // print our student id and name.
        $students = getCourseStudents($course);  
        foreach($students as $student){
            if($student['id'] == 7){
                echo <<<EOL
                Student: {$student['name']}
                <br>
                ID: {$student['id']}
                <hr>
                EOL;
                
            }
        }
        echo "<br>";
        
    }

?>