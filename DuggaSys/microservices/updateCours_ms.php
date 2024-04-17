<?php
// Input validation and sanitization
$courseId = filter_input(INPUT_POST, 'courseId', FILTER_VALIDATE_INT); 
$courseName = filter_input(INPUT_POST, 'courseName', FILTER_SANITIZE_STRING);

$coursename = getOP('coursename');

// Retrieve cid
$cid = getOP('cid'); // Inserted here

// Update Course Logic
$updateSuccessful = updateCourse($cid, $coursename, $visibility, $coursecode);

// Error handling
if (!$updateSuccessful) {
    $error = "Error updating course information.";
    // Log the error
    logError($error);
} else {
    // Log the successful course update
    logCourseEditEvent($userid, $username, $coursename, $coursecode, $visibility);
}

// Update Course Logic 
try {
    $query = $db->prepare("UPDATE courses SET courseName = :coursename WHERE courseId = :courseId");
    $query->bindParam(':coursename', $coursename); // Bind the coursename variable
    $query->bindParam(':courseId', $courseId); // Bind the courseId variable
    $query->execute();

    // Success Response
    echo json_encode(['status' => 'success', 'message' => 'Course updated successfully']); 
} catch (PDOException $e) {
    // Error Response
    echo json_encode(['status' => 'error', 'message' => 'Error updating course: ' . $e->getMessage()]);
}
