<?php



date_default_timezone_set("Europe/Stockholm");

include_once "../../../Shared/basic.php";
include_once "../../../Shared/sessions.php";
include_once "../shared_microservices/getUid_ms.php";
include_once 'sectionedservice_test.php';


function updateCourseVersion_sectioned($username, $password, $courseId, $versionId, $motd, $versname, $startDate, $endDate) {
   
    // Create an instance of the SectionedService
    $sectionedService = new SectionedService();

    // Authenticate the user (this will depend on your authentication method)
    if ($sectionedService->authenticate($username, $password)) {

        try {
            // Update the 'motd' column
            $sectionedService->updateTableVers($courseId, $versionId, 'motd', $motd);

            // Update the 'versname', 'startdate', and 'enddate' columns
            $sectionedService->updateTableVers($courseId, $versionId, 'versname', $versname);
            $sectionedService->updateTableVers($courseId, $versionId, 'startdate', $startDate);
            $sectionedService->updateTableVers($courseId, $versionId, 'enddate', $endDate);

            // Set the active version
            $sectionedService->setActiveCourseVersion($courseId, $versionId);

        } catch (Exception $e) {
            // Handle any exceptions that occur during the update process

            error_log($e->getMessage());
            return array('status' => 'error', 'message' => 'Failed to update course version');
        }
    } else {
        // Handle authentication failure
        return array('status' => 'error', 'message' => 'The Authentication failed');
    }

    // If everything is successful, then return a success message
    return array('status' => 'success', 'message' => 'The Course version updated successfully');
}
?>
