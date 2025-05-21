# Inverse dependencies

This is a list of inverse dependencies of all microservices.

## accessedService

This is a list of all inverse dependencies of files in the accessedService folder.

### addClass

None

### addUser

None

### getAccessedService

None

### retrieveAccessedService

- accessedService/addClass_ms.php
- accessedService/addUser_ms.php
- accessedService/getAccessedService_ms.php
- accessedService/updateUser_ms.php

### updateUser

None

### updateUserCourse

None 

## codeviewerService

This is a list of all inverse dependencies of files in the codeviewerService folder.

### deleteCodeExample

None 

### editBoxTitle

None

### editCodeExample

None

### editContentOfExample

None
### retrieveCodeviewerService

- codeviewerService/deleteCodeExample_ms.php
- codeviewerService/editBoxTitle_ms.php
- codeviewerService/editCodeExample_ms.php
- codeviewerService/editContentOfExample_ms.php

### updateCodeExampleTemplate

None 

## courseedService

This is a list of all inverse dependencies of files in the courseedService folder.

### changeActiveCourseVersion_courseed

None

### copyCourseVersion

None

### createCourseVersion

None

### createMOTD

None

### createNewCourse

None

### deleteCourseMaterial
- courseedService/retrieveCourseedService_ms.php

### getCourseed

None (completely replaced by retrieveAllCourseedServiceData)

### retrieveAllCourseedServiceData

None

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
None
### updateActiveCourseVersion_courseed
None
### updateCourse
None
### updateCourseVersion
None
## duggaedService

This is a list of all inverse dependencies of files in the duggaedService folder.

### createDugga
None
### createDuggaVariant
None
### deleteDugga
None
### deleteDuggaVariant
None
### retrieveDuggaedService
- duggaedService\createDugga.ms.php
- duggaedService\createDuggaVariant_ms.php
- duggaedService\deleteDugga_ms.php
- duggaedService\deleteDuggaVariant_ms.php
- duggaedService\updateDugga_ms.php
- duggaedService\updateDuggaVariant_ms.php

### updateDugga
None
### updateDuggaVariant
None
## fileedService

This is a list of all inverse dependencies of files in the fileedService folder.

### deleteFileLink
None
### getFileedService
None
### updateFileLink
None
## gitCommitService

This is a list of all inverse dependencies of files in the gitCommitService folder.

### clearGitFiles
- GitCommitService/refreshGithubRepo_ms.php

### fetchOldToken
None
### getCourseID
None
### insertIntoSQLite
- gitCommitService/getCourseID_ms.php

### newUpdateTime
None
### refreshCheck
None
### refreshGithubRepo
None
### retrieveGitCommitService
None
## gitFetchService

This is a list of all inverse dependencies of files in the gitFetchService folder.

### bfs
None
### downloadToWebServer
None
### getGithubURL
None
### getIndexFile
None
### insertToFileLink
None
### insertToMetadata
None

## highscoreService

This is a list of all inverse dependencies of files in the highscoreService folder.

### highscoreservice
None 
### retrieveHighscoreService
- highscoreService\highscoreservice_ms.php

## profileService

This is a list of all inverse dependencies of files in the profileService folder.


### retrieveProfileService

- DuggaSys/microservices/profileService/updtateSecurityQuestion_ms.php
- DuggaSys/microservices/profileService/updateUserPassowrd_ms.php"

### updateSecurityQuestion

None

### updateUserPassword

None

## resultedService

This is a list of all inverse dependencies of files in the resultedService folder.

### getUserAnswer

None

### retrieveResultedService

- resultedService\getUserAnswer_ms.php

## sectionedService

This is a list of all inverse dependencies of files in the sectionedService folder.

### changeActiveCourseVersion_sectioned

None 
### createGithubCodeExample
None
### createListEntry
None 
### deleteListEntries
None 

### getCourseGroupsAndMembers
None (Replaced with readCourseGroupsAndMembers_ms.php)

### getCourseVersions

None

### getDeletedListEntries

None 

### getGroupValues

None 

### getListEntries

None replaced with retrieveAllSectionedServiceData_ms.php   

### getUserDuggaFeedback

None Replaced with readUserDuggaFeedback_ms.php

### readCourseGroupsAndMembers

None 

### readCourseVersions
- sectionedService\retrieveSectionedService_ms.php

### readGroupValues

None

### removeListEntries

None

### reorderListEntries

None

### retrieveAllCourseVersions

None

### retrieveSectionedService
- \sectionedService\changeActiveCourseVersion_sectioned_ms.php
- \sectionedService\deleteListEntries_ms.php
- \sectionedService\getCourseGroupsAndMembers_ms.php
- \sectionedService\getDeletedListEntries_ms.php
- \sectionedService\getGroupValues_ms.php
- \sectionedService\getListEntries_ms.php
- \sectionedService\getUserDuggaFeedback_ms.php
- \sectionedService\readCourseGroupsAndMembers_ms.php
- \sectionedService\readGroupValues_ms.php
- \sectionedService\readUserDuggaFeedback_ms.php
- \sectionedService\removeListEntries_ms.php
- \sectionedService\reorderListEntries_ms.php
- \sectionedService\retrieveAllCourseVersions_ms.php
- \sectionedService\setVisibleListentries_ms.php
- \sectionedService\updateActiveCourseVersion_sectioned_ms.php
- \sectionedService\updateCourseVersion_sectioned_ms.php
- \sectionedService\updateListEntries_ms.php
- \sectionedService\updateListEntriesGradesystem_ms.php
- \sectionedService\updateListEntriesTabs_ms.php
- \sectionedService\updateListEntryOrder_ms.php
- \sectionedService\updateQuizDeadline_ms.php
- \sectionedService\updateVisibleListEntries_ms.php
- \sectionedService\createGithubCodeExample_ms.php
- \sectionedService\createListEntry_ms.php

### setVisibleListentries
None

### updateActiveCourseVersion_sectioned
None

### updateCourseVersion_sectioned

### updateListEntries
None

### updateListEntriesGradesystem

None

### updateListEntriesTabs

None 

### updateListEntryOrder

None

### updateQuizDeadline

None 

### updateVisibleListEntries

None 

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
- sharedMicroservices/createNewCodeExample_ms.php
- sharedMicroservices/updateSecurityQuestion_ms.php
- sharedMicroservices/updateUserPassword_ms.php
- sharedMicroservices/retrieveUsername_ms.php

##### sectionedService
- sectionedService/createGithubCodeExample_ms.php
- sectionedService/createListEntry_ms.php
- sectionedService/deleteListEntries_ms.php
- sectionedService/getCourseVersions_ms.php
- sectionedService/getDeletedListEntries_ms.php
- sectionedService/getGroupValues_ms.php
- sectionedService/getListEntries_ms.php
- sectionedService/readCourseVersions_ms.php
- sectionedService/reorderListEntries_ms.php
- sectionedService/setVisibleListentries_ms.php
- sectionedService/updateCourseVersion_sectioned_ms.php
- sectionedService/updateListEntries_ms.php
- sectionedService/updateListEntriesGradesystem_ms.php
- sectionedService/updateListEntriesTabs_ms.php
- sectionedService/updateListEntryOrder_ms.php
- sectionedService/updateVisibleListEntries_ms.php
- sectionedService/readGroupValues_ms.php
- sectionedService/removeListEntries_ms.php

##### resultedService
- resultedService/getUserAnswer_ms.php

##### profileService
- profileService/updateSecurityQuestion_ms.php
- profileService/updateUserPassword_ms.php

##### highscoreService
- highscoreService/highscoreservice_ms.php

##### fileedService
- fileedService/deleteFileLink_ms.php
- fileedService/getFileedService_ms.php
- fileedService/updateFileLink_ms.php
- fileedService/retrieveFileedService_ms.php

##### duggaedService
- duggaedService/createDugga_ms.php
- duggaedService/deleteDugga_ms.php
- duggaedService/deleteDuggaVariant_ms.php
- duggaedService/updateDugga_ms.php
- duggaedService/createDuggaVariant_ms.php
- duggaedService/updateDuggaVariant_ms.php

##### courseedService
- courseedService/changeActiveCourseVersion_courseed_ms.php
- courseedService/copyCourseVersion_ms.php
- courseedService/createCourseVersion_ms.php
- courseedService/createMOTD_ms.php
- courseedService/createNewCourse_ms.php
- courseedService/getCourseed_ms.php
- courseedService/retrieveAllCourseedServiceData_ms.php
- courseedService/retrieveCourseedService_ms.php
- courseedService/updateCourse_ms.php
- courseedService/updateCourseVersion_ms.php
- courseedService/specialUpdate_ms.php
- courseedService/updateActiveCourseVersion_courseed_ms.php

##### codeviewerService
- codeviewerService/deleteCodeExample_ms.php
- codeviewerService/editBoxTitle_ms.php
- codeviewerService/editCodeExample_ms.php
- codeviewerService/editContentOfExample_ms.php
- codeviewerService/updateCodeExampleTemplate_ms.php
- codeviewerService/retrieveCodeviewerService_ms.php

##### accessedService

- accessedService/addClass_ms.php
- accessedService/addUser_ms.php
- accessedService/getAccessedService_ms.php
- accessedService/updateUser_ms.php
- accessedService/updateUserCourse_ms.php
- accessedService/retrieveAccessedService_ms.php

### isSuperUser
None

### logUserEvent

None 

### retrieveUsername

TODO

### setAsActiveCourse
- courseedService/updateCourseVersion_ms.php
- sectionedService/updateCourseVersion_sectioned_ms.php
### updateSecurityQuestion
(no inverse dependencies found)

### updateUserPassword
(no inverse dependencies found)

### retrieveUsername

- accessedService/retrieveAccessedService_ms.php
- fileedService/updateFileLink_ms.php
- courseedService/updateCourseVersion_ms.php
- courseedService/createCourseVersion_ms.php
- courseedService/copyCourseVersion_ms.php
- sectionedService/updateCourseVersion_sectioned_ms.php
- sectionedService/createListEntry_ms.php
- sharedMicroservices/createNewCodeExample_ms.php
- sharedMicroservices/createNewListEntry_ms.php

## showDuggaServices

This is a list of all inverse dependencies of files in the showDuggaServices folder.

### getShowDugga

None


### loadDugga
- showDuggaService/retrieveShowDuggaService_ms.php


### processDuggaFile
- showDuggaService/retrieveShowDuggaService_ms.php

### retrieveShowDuggaService
- showDuggaService/getShowDugga_ms.php
- showDuggaService/loadDugga_ms.php
- showDuggaService/saveDugga_ms.php
- showDuggaService/updateActiveUsers_ms.php

### updateActiveUsers

None

### retrieveFileedService
- fileedService/deleteFileLink_ms.php
- fileedService/getFileedService_ms.php
- fileedService/updateFileLink_ms.php
