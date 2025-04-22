# Inverse dependencies

This is a list of inverse dependencies of all microservices.

## accessedService

This is a list of all inverse dependencies of files in the accessedService folder.

### addClass

No dependecies

### addUser
No inverse dependencies.

### getAccessedService
No inverse dependencies

### retrieveAccessedService

accessedService:
    addClass_ms.php
    addUser_ms.php
    getAccessedService_ms.php
    updateUser_ms.php

### updateUser
No inverse dependencies.

### updateUserCourse (No includes)

## codeviewerService

This is a list of all inverse dependencies of files in the codeviewerService folder.

### deleteCodeExample (No inverse dependencies)

### editBoxTitle
No inverse dependencies


### editCodeExample
No inverse dependencies.

### editContentOfExample
No inverse dependencies.

### retrieveCodeviewerService
[deleteCodeExample_ms.php](codeviewerService/deleteCodeExample_ms.php)
[editBoxTitle_ms.php](codeviewerService/editBoxTitle_ms.php)
[editCodeExample_ms.php](codeviewerService/editCodeExample_ms.php)
[editContentOfExample_ms.php](codeviewerService/editContentOfExample_ms.php)

### updateCodeExampleTemplate
No inverse dependencies 

## courseedService

This is a list of all inverse dependencies of files in the courseedService folder.

### changeActiveCourseVersion_courseed
There is no inverse dependencies

### copyCourseVersion
There is no list of all inverse dependencies

### createCourseVersion
(No inverse dependencies)

### createMOTD
No inverse dependencies

### createNewCourse
No inverse dependencies

### deleteCourseMaterial
[retrieveCourseedService_ms.php](courseedService/retrieveCourseedService_ms.php)

### getCourseed
    No inverse dependencies
    (completely replaced by retrieveAllCourseedServiceData)

### retrieveAllCourseedServiceData
No inverse dependencies found.

### retrieveCourseedService
- courseedService/changeActiveCourseVersion_courseed_ms.php
- courseedService/copyCourseVersion_ms.php
- courseedService/createCourseVersion_ms.php
- courseedService/createMOTD_ms.php
- courseedService/createNewCourse_ms.php
- courseedService/deleteCourseMaterial_ms.php
- courseedService/getCourseed_ms.php
- courseedService/retrieveAllCourseedServiceData_ms.php
- courseedService/specialUpdate_ms.php
- courseedService/updateActiveCourseVersion_courseed_ms.php
- courseedService/updateCourse_ms.php
- courseedService/updateCourseVersion_ms.php

### specialUpdate
No inverse dependencies

### updateActiveCourseVersion_courseed
No inverse dependencies.

### updateCourse
No inverse dependencies

### updateCourseVersion
No inverse dependencies

## duggaedService

This is a list of all inverse dependencies of files in the duggaedService folder.

### createDugga
No inverse dependencies.

### createDuggaVariant
No inverse dependencies.

### deleteDugga
No inverse dependencies

### deleteDuggaVariant
No inverse dependencies

### retrieveDuggaedService
\duggaedService\createDugga.ms.php
\duggaedService\createDuggaVariant_ms.php
\duggaedService\deleteDugga_ms.php
\duggaedService\deleteDuggaVariant_ms.php
\duggaedService\updateDugga_ms.php
\duggaedService\updateDuggaVariant_ms.php

### updateDugga
No inverse dependencies.

### updateDuggaVariant
No inverse dependencies.

## fileedService

This is a list of all inverse dependencies of files in the fileedService folder.

### deleteFileLink
No inverse dependencies.

### getFileedService
No inverse dependencies. 

### updateFileLink
No inverse dependencies.

## gitCommitService

This is a list of all inverse dependencies of files in the gitCommitService folder.

### clearGitFiles
[refreshGithubRepo_ms.php](GitCommitService/refreshGithubRepo_ms.php)

### fetchOldToken
No inverse dependencies

### getCourseID
No inverse dependencies.

### insertIntoSQLite
- gitCommitService/getCourseID_ms.php

### newUpdateTime
(no inverse dependencies found)

### refreshCheck
(no inverse dependencies found)

### refreshGithubRepo
No inverse dependencies.

### retrieveGitCommitService
No inverse dependencies.

## gitFetchService

This is a list of all inverse dependencies of files in the gitFetchService folder.

### bfs
No inverse dependencies.

### downloadToWebServer
No inverse dependencies.

### getGithubURL
No inverse dependencies

### getIndexFile
No inverse dependencies

### insertToFileLink
No inverse dependencies.

### insertToMetadata
No inverse dependencies.

## highscoreService

This is a list of all inverse dependencies of files in the highscoreService folder.

### highscoreservice
No inverse dependencies. (Not in use)

### retrieveHighscoreService
- ..\highscoreService\highscoreservice_ms.php

## profileService

This is a list of all inverse dependencies of files in the profileService folder.

### retrieveProfileService
Inverse dependency found on in both "DuggaSys/microservices/profileService/updtateSecurityQuestion_ms.php" and "DuggaSys/microservices/profileService/updateUserPassowrd_ms.php"

### updateSecurityQuestion
The service is never used as an inverse dependency

### updateUserPassword
(no inverse dependencies found)

## resultedService

This is a list of all inverse dependencies of files in the resultedService folder.

### getUserAnswer

### retrieveResultedService

## sectionedService

This is a list of all inverse dependencies of files in the sectionedService folder.

### changeActiveCourseVersion_sectioned
No inverse dependencies. 

### createGithubCodeExample
No inverse dependencies.

### createListEntry
No inverse dependencies.

### deleteListEntries
No inverse dependencies.

### getCourseGroupsAndMembers
    No inverse dependencies.
    (Replaced with readCourseGroupsAndMembers_ms.php)

### getCourseVersions
    No inverse dependencies.
    (Replaces with readCourseVersions_ms.php)


### getDeletedListEntries
(no inverse found)

### getGroupValues
(no inverse found)

### getListEntries

    No inverse dependencies. 
    Supposed to be replaced with retrieveAllSectionedServiceData_ms.php   

### getUserDuggaFeedback

    No inverse dependencies.
    Replaced with readUserDuggaFeedback_ms.php

### readCourseGroupsAndMembers
No inverse dependencies.

### readCourseVersions
- ..\sectionedService\retrieveSectionedService_ms.php

### readGroupValues
No inverse dependencies.

### readUserDuggaFeedback
No inverse dependencies.

### removeListEntries
No inverse dependencies.

### reorderListEntries
No inverse dependencies.

### retrieveAllCourseVersions
No inverse dependencies.

### retrieveSectionedService
\sectionedService\changeActiveCourseVersion_sectioned_ms.php
\sectionedService\createGithubCodeExample_ms.php
\sectionedService\createListEntry_ms.php
\sectionedService\deleteListEntries_ms.php
\sectionedService\getCourseGroupsAndMembers_ms.php
\sectionedService\getDeletedListEntries_ms.php
\sectionedService\getGroupValues_ms.php
\sectionedService\getListEntries_ms.php
\sectionedService\getUserDuggaFeedback_ms.php
\sectionedService\readCourseGroupsAndMembers_ms.php
\sectionedService\readGroupValues_ms.php
\sectionedService\readUserDuggaFeedback_ms.php
\sectionedService\removeListEntries_ms.php
\sectionedService\reorderListEntries_ms.php
\sectionedService\retrieveAllCourseVersions_ms.php
\sectionedService\setVisibleListentries_ms.php
\sectionedService\updateActiveCourseVersion_sectioned_ms.php
\sectionedService\updateCourseVersion_sectioned_ms.php
\sectionedService\updateListEntries_ms.php
\sectionedService\updateListEntriesGradesystem_ms.php
\sectionedService\updateListEntriesTabs_ms.php
\sectionedService\updateListEntryOrder_ms.php
\sectionedService\updateQuizDeadline_ms.php
\sectionedService\updateVisibleListEntries_ms.php

### setVisibleListentries
(no inverse dependencies found)

### updateActiveCourseVersion_sectioned
(no inverse dependencies found)


### updateCourseVersion_sectioned

### updateListEntries
No inverse dependencies.


### updateListEntriesGradesystem
No inverse dependencies.

### updateListEntriesTabs
No inverse dependencies.


### updateListEntryOrder
No inverse dependencies.

### updateQuizDeadline
No inverse dependencies.

### updateVisibleListEntries
No dependencies found.

## sharedMicroservices

This is a list of all inverse dependencies of files in the sharedMicroservices folder.

### createNewCodeExample
copyCourseVersion_ms.php
createGithubCodeExample_ms.php
createListEntry_ms.php
### createNewListEntry
- coursedService/copyCourseVersion_ms.php
- sectionedService/createGithubCodeExample_ms.php
- sectionedService/createListEntry_ms.php

### getUid

##### sharedMicroservices
[createNewCodeExample_ms.php](sharedMicroservices/createNewCodeExample_ms.php)
[retrieveUsername_ms.php](sharedMicroservices/retrieveUsername_ms.php)
[micupdateSecurityQuestion_ms.php](sharedMicroservices/micupdateSecurityQuestion_ms.php)
[updateSecurityQuestion_ms.php](sharedMicroservices/updateSecurityQuestion_ms.php)
[updateUserPassword_ms.php](sharedMicroservices/updateUserPassword_ms.php)

##### sectionedService
[createGithubCodeExample_ms.php](sectionedService/createGithubCodeExample_ms.php)
[createListEntry_ms.php](sectionedService/createListEntry_ms.php)
[deleteListEntries_ms.php](sectionedService/deleteListEntries_ms.php)
[getCourseVersions_ms.php](sectionedService/getCourseVersions_ms.php)
[getDeletedListEntries_ms.php](sectionedService/getDeletedListEntries_ms.php)
[getGroupValues_ms.php](sectionedService/getGroupValues_ms.php)
[getListEntries_ms.php](sectionedService/getListEntries_ms.php)
[readCourseVersions_ms.php](sectionedService/readCourseVersions_ms.php)
[readGroupValues_ms.php](sectionedService/readGroupValues_ms.php)
[removeListEntries_ms.php](sectionedService/removeListEntries_ms.php)
[reorderListEntries_ms.php](sectionedService/reorderListEntries_ms.php)
[setVisibleListentries_ms.php](sectionedService/setVisibleListentries_ms.php)
[updateCourseVersion_sectioned_ms.php](sectionedService/updateCourseVersion_sectioned_ms.php)
[updateListEntries_ms.php](sectionedService/updateListEntries_ms.php)
[updateListEntriesGradesystem_ms.php](sectionedService/updateListEntriesGradesystem_ms.php)
[updateListEntriesTabs_ms.php](sectionedService/updateListEntriesTabs_ms.php)
[updateListEntryOrder_ms.php](sectionedService/updateListEntryOrder_ms.php)
[updateVisibleListEntries_ms.php](sectionedService/updateVisibleListEntries_ms.php)

##### resultedService
[getUserAnswer_ms.php](resultedService/getUserAnswer_ms.php)

##### profileService
[updateSecurityQuestion_ms.php](profileService/updateSecurityQuestion_ms.php)
[updateUserPassword_ms.php](profileService/updateUserPassword_ms.php)

##### highscoreService
[highscoreservice_ms.php](highscoreService/highscoreservice_ms.php)

##### fileedService
[deleteFileLink_ms.php](fileedService/deleteFileLink_ms.php)
[getFileedService_ms.php](fileedService/getFileedService_ms.php)
[updateFileLink_ms.php](fileedService/updateFileLink_ms.php)

##### duggaedService
[createDugga_ms.php](duggaedService/createDugga_ms.php)
[createDuggaVariant_ms.php](duggaedService/createDuggaVariant_ms.php)
[deleteDugga_ms.php](duggaedService/deleteDugga_ms.php)
[deleteDuggaVariant_ms.php](duggaedService/deleteDuggaVariant_ms.php)
[updateDugga_ms.php](duggaedService/updateDugga_ms.php)

###### courseedService
[changeActiveCourseVersion_courseed_ms.php](courseedService/changeActiveCourseVersion_courseed_ms.php)
[copyCourseVersion_ms.php](courseedService/copyCourseVersion_ms.php)
[createCourseVersion_ms.php](courseedService/createCourseVersion_ms.php)
[createMOTD_ms.php](courseedService/createMOTD_ms.php)
[createNewCourse_ms.php](courseedService/createNewCourse_ms.php)
[getCourseed_ms.php](courseedService/getCourseed_ms.php)
[retrieveAllCourseedServiceData_ms.php](courseedService/retrieveAllCourseedServiceData_ms.php)
[retrieveCourseedService_ms.php](courseedService/retrieveCourseedService_ms.php)
[specialUpdate_ms.php](courseedService/specialUpdate_ms.php)
[updateActiveCourseVersion_courseed_ms.php](courseedService/updateActiveCourseVersion_courseed_ms.php)
[updateCourse_ms.php](courseedService/updateCourse_ms.php)
[updateCourseVersion_ms.php](courseedService/updateCourseVersion_ms.php)

##### codeviewerService
[deleteCodeExample_ms.php](codeviewerService/deleteCodeExample_ms.php)
[editBoxTitle_ms.php](codeviewerService/editBoxTitle_ms.php)
[editCodeExample_ms.php](codeviewerService/editCodeExample_ms.php)
[editContentOfExample_ms.php](codeviewerService/editContentOfExample_ms.php)
[updateCodeExampleTemplate_ms.php](codeviewerService/updateCodeExampleTemplate_ms.php)

##### accessedService
[addClass_ms.php](accessedService/addClass_ms.php)
[addUser_ms.php](accessedService/addUser_ms.php)
[getAccessedService_ms.php](accessedService/getAccessedService_ms.php)
[updateUser_ms.php](accessedService/updateUser_ms.php)
[updateUserCourse_ms.php](accessedService/updateUserCourse_ms.php)

### isSuperUser
No inverse dependencies

### logUserEvent (No dependencies)

### retrieveUsername

### setAsActiveCourse
    updateCourseVersion_ms.php
    updateCourseVersion_sectioned_ms.php
    
### updateSecurityQuestion
(no inverse dependencies found)

### updateUserPassword
(no inverse dependencies found)

### retrieveUsername

- accessedService/retrieveAccessedService_ms.php
- fileedService/updateFileLink_ms.php
- courseedService/updateCourseVersion_ms.php
- courseedService/createCourseVersion_ms.php
- courseedService/updateCourse_ms.php
- courseedService/createNewCourse_ms.php
- courseedService/copyCourseVersion_ms.php
- sectionedService/updateCourseVersion_sectioned_ms.php
- sectionedService/createListEntry_ms.php
- sharedMicroservices/createNewCodeExample_ms.php
- sharedMicroservices/createNewListEntry_ms.php

## showDuggaServices

This is a list of all inverse dependencies of files in the showDuggaServices folder.

### getShowDugga

### loadDugga

### processDuggaFile

### retrieveShowDuggaService

### saveDugga

### updateActiveUsers

### retrieveFileedService
[deleteFileLink_ms.php](/fileedService/deleteFileLink_ms.php) <br>
[getFileedService_ms.php](/fileedService/getFileedService_ms.php) <br>
[updateFileLink_ms.php](/fileedService/updateFileLink_ms.php)
