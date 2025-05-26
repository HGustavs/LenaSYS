# Renaming microservices
Several microservice files need to be renamed to follow a naming convention based on CRUD (Create, Read, Update, Delete), which would lead to the microservice names being easier to understand only based on the microservice/file name.
Since the microservices are included in multiple other microservices, renaming them will affect all files that reference them.

When the microservice/file name has been changed, mark it here, as well as in LenaSYS/DuggaSys/microservices
/Microservices.md and backend-models/microservices/duggaSys services/Microservices.md, that the renameing is completed.

RENAME THE ACTUAL MICROSERVICEFILE, THE TESTFILE RELATED TO THE MICROSERVICE, AS WELL AS ALL THE PLACES THE MICROSERVICEFILE NAME IS USED.

---

## accessedService
Microservices to be renamed in the accessedService folder.

### addClass_ms.php
New name: <ins>createClass_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/accessedService/addClass_ms.php
- includeInstructions.md
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/endpointDirectory/fillDependenciesDb.php
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/accessedService.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/microservices/accessedService/addClass_ms_test.php

---

### addUser_ms.php
New name: <ins>createUser_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/accessedService/addUser_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/accessedService.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/tests/microservices/accessedService/addUser_ms_test.php

---

### getAccessedService_ms.php
New name: <ins>retrieveAllAcessedServiceData_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/accessedService/getAccessedService_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/accessedService.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md

---

## codeviewerService
Microservices to be renamed in the codeviewerService folder.

### editBoxTitle_ms.php
New name: <ins>updateBoxTitle_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/codeviewerService/editBoxTitle_ms.php
- DuggaSys/microservices/monolithic-to-microservices.md
- DuggaSys/microservices/deprecated_microservices.md
- Shared/dugga.js
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/codeviewerService.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/microservices/codeviewerService/editBoxTitle_ms_test.php
- DuggaSys/tests/microservices/codeviewerService/codeviewerService_documentation.md

---

### editCodeExample_ms.php
New name: <ins>updateCodeExample_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/Microservices.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### editContentOfExample_ms.php
New name: <ins>updateContentOfExample_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/codeviewerService/editContentOfExample_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- Shared/dugga.js
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/codeviewerService.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/microservices/codeviewerService/editContentOfExample_ms_test.php
- DuggaSys/tests/microservices/codeviewerService/codeviewerService_documentation.md

---

## courseedService
Microservices to be renamed in the courseedService folder.

### changeActiveCourseVersion_courseed_ms.php
New name: <ins>updateActiveCourseVersion_courseed_ms.php</ins>

<ins>updateActiveCourseVersion_courseed_ms</ins>, that is supposed to replace this file, has already been created. 
The only difference between <ins>changeActiveCourseVersion_courseed_ms.php</ins> and <ins>updateActiveCourseVersion_courseed_ms</ins> is the if-statement checklogin().
This file is supposed to be removed completely since the new version, <ins>updateActiveCourseVersion_courseed_ms</ins>, already exists.
Be careful and check where <ins>changeActiveCourseVersion_courseed_ms.php</ins> is used, and remove it OR replace it with <ins>updateActiveCourseVersion_courseed_ms</ins>. Both of these microservices are references in some files.
Since both files still exist, a more exact documentation of where both of these microservices are referenced is therefore made.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/courseedService/changeActiveCourseVersion_courseed_ms.php (ONLY changeActiveCourseVersion_courseed_ms.php IS USED)
- DuggaSys/tests/microservices/courseedService/changeActiveCourseVersion_courseed_ms_test.php (ONLY changeActiveCourseVersion_courseed_ms.php IS USED)
- DuggaSys/microservices/deprecated_microservices.md (ONLY changeActiveCourseVersion_courseed_ms.php IS USED)
- DuggaSys/microservices/courseedService/updateActiveCourseVersion_courseed_ms.php (ONLY updateActiveCourseVersion_courseed_ms.php is used)
- DuggaSys/tests/microservices/courseedService/updateActiveCourseVersion_courseed_ms_test.php (ONLY updateActiveCourseVersion_courseed_ms.php is used)
- DuggaSys/microservices/Microservices.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices_inverse_dependencies.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices Documentation/courseedService.md (BOTH ARE USED)
- backend-models/microservices/duggaSys services/Microservices.md (BOTH ARE USED)

---

### updateActiveCourseVersion_courseed_ms.php 
Supposed to REPLACE <ins>changeActiveCourseVersion_courseed_ms.php</ins>, but that file still exists. See explanation above, under the <ins>changeActiveCourseVersion_courseed_ms.php</ins> header.
Since both files still exist, a more exact documentation of where both of these microservices are referenced is therefore made.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/courseedService/changeActiveCourseVersion_courseed_ms.php (ONLY changeActiveCourseVersion_courseed_ms.php IS USED)
- DuggaSys/tests/microservices/courseedService/changeActiveCourseVersion_courseed_ms_test.php (ONLY changeActiveCourseVersion_courseed_ms.php IS USED)
- DuggaSys/microservices/deprecated_microservices.md (ONLY changeActiveCourseVersion_courseed_ms.php IS USED)
- DuggaSys/microservices/courseedService/updateActiveCourseVersion_courseed_ms.php (ONLY updateActiveCourseVersion_courseed_ms.php is used)
- DuggaSys/tests/microservices/courseedService/updateActiveCourseVersion_courseed_ms_test.php (ONLY updateActiveCourseVersion_courseed_ms.php is used)
- DuggaSys/microservices/Microservices.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices_inverse_dependencies.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices Documentation/courseedService.md (BOTH ARE USED)
- backend-models/microservices/duggaSys services/Microservices.md (BOTH ARE USED)

---

### getCourseed_ms.php
New name: <ins>retrieveAllCourseedServiceData_ms.php</ins>

<ins>retrieveAllCourseedServiceData_ms.php</ins>, that is supposed to replace this file, has already been created. 
The only difference between <ins>getCourseed_ms.php</ins> and <ins>retrieveAllCourseedServiceData_ms.php</ins> is the if-statement checklogin().
This file is supposed to be removed completely since the new version, <ins>retrieveAllCourseedServiceData_ms.php</ins>, already exists.
Be careful and check where <ins>getCourseed_ms.php</ins> is used, and remove it OR replace it with <ins>retrieveAllCourseedServiceData_ms.php</ins>. Both of these microservices are references in some files.
Since both files still exist, a more exact documentation of where both of these microservices are referenced is therefore made.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/courseedService/retrieveAllCourseedServiceData_ms.php (ONLY retrieveAllCourseedServiceData_ms.php IS USED)
- DuggaSys/tests/microservices/courseedService/retrieveCourseedService_ms_test.php (ONLY retrieveAllCourseedServiceData_ms.php IS USED)
- DuggaSys/microservices/courseedService/getCourseed_ms.php (ONLY getCourseed_ms.php)
- DuggaSys/microservices/deprecated_microservices.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices Documentation/courseedService.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices_inverse_dependencies.md (BOTH ARE USED)
- DuggaSys/tests/microservices/courseedService/deleteCourseMaterial_ms_test.php (BOTH ARE USED)

---

### retrieveAllCourseedServiceData_ms.php
Supposed to REPLACE <ins>getCourseed_ms.php</ins>, but that file still exists. See explanation above, under the <ins>getCourseed_ms.php</ins> header.
Since both files still exist, a more exact documentation of where both of these microservices are referenced is therefore made.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/courseedService/retrieveAllCourseedServiceData_ms.php (ONLY retrieveAllCourseedServiceData_ms.php IS USED)
- DuggaSys/tests/microservices/courseedService/retrieveCourseedService_ms_test.php (ONLY retrieveAllCourseedServiceData_ms.php IS USED)
- DuggaSys/microservices/courseedService/getCourseed_ms.php (ONLY getCourseed_ms.php)
- DuggaSys/microservices/deprecated_microservices.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices Documentation/courseedService.md (BOTH ARE USED)
- DuggaSys/microservices/Microservices_inverse_dependencies.md (BOTH ARE USED)
- DuggaSys/tests/microservices/courseedService/deleteCourseMaterial_ms_test.php (BOTH ARE USED)

---

## duggaedService
No microservices to be renamed in the duggaedService folder.

---

## endpointDirectory
Does not contain microservices. No files to be renamed.

---

## fileedService
Microservices to be renamed in the fileedService folder.

### getFileedService_ms.php
New name: <ins>"retrieveAllFileedServiceData_ms.php</ins>.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/fileedService/getFileedService_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- Shared/dugga.js
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md

---

## gitCommitService
Microservices to be renamed in the gitCommitService folder.

### clearGitFiles_ms.php
New name: <ins>readCourseID_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitCommitService/clearGitFiles_ms.php
- DuggaSys/microservices/Microservices Documentation/gitCommitService.md
- DuggaSys/microservices/gitCommitService/refreshGithubRepo_ms.php
- DuggaSys/microservices/Microservices.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### fetchOldToken_ms.php
New name: <ins>readGitToken_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitCommitService/fetchOldToken_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/gitCommitService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### getCourseID_ms.php
New name: <ins>readCourseID_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitCommitService/getCourseID_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices Documentation/gitCommitService.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md

---

### insertIntoSQLite_ms.php
New name: <ins>syncGitRepoMetadata_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitCommitService/insertIntoSQLite_ms.php
- DuggaSys/microservices/gitCommitService/getCourseID_ms.php
- DuggaSys/microservices/Microservices Documentation/gitCommitService.md
- DuggaSys/microservices/Microservices.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### newUpdateTime_ms.php
New name: <ins>updateTime_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitCommitService/newUpdateTime_ms.php
- DuggaSys/microservices/gitCommitService/refreshCheck_ms.php
- DuggaSys/microservices/Microservices Documentation/gitCommitService.md
- DuggaSys/microservices/Microservices.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/newUpdateTime_test.php

---

### refreshCheck_ms.php
New name: <ins>updateThrottle_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitCommitService/refreshCheck_ms.php
- DuggaSys/microservices/Microservices Documentation/gitCommitService.md
- DuggaSys/microservices/gitCommitService/refreshGithubRepo_ms.php
- DuggaSys/microservices/Microservices.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### refreshGithubRepo_ms.php
New name: <ins>updateGithubRepo_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitCommitService/refreshGithubRepo_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/gitCommitService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

## gitFetchService
Microservices to be renamed in the gitFetchService folder.

### getGitHubURL_ms.php
New name: <ins>getGitHubAPIUrl_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitFetchService/getGithubURL_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/gitFetchService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### getIndexFile_ms.php
New name: <ins>readIndexFile_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitFetchService/getIndexFile_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/gitFetchService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### insertToFileLink_ms.php
New name: <ins>createFileLinkEntry_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitFetchService/insertToFileLink_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/gitFetchService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### insertToMetaData_ms.php
New name: <ins>createGitFilesMetadata_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/gitFetchService/insertToMetadata_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/gitFetchService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

## highscoreService
Microservices to be renamed in the highscoreService folder.

### highscoreservice_ms.php
New name: <ins>readHighscore_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/deprecated_microservices.md
- Shared/dugga.js
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- backend-models/microservices/duggaSys services/Microservices.md

---

## profileService
No microservices to be renamed in the profileService folder.

---

## resultedService
Microservices to be renamed in the resultedService folder.

### getUserAnswer_ms.php
New name: <ins>readUserAnswer_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/resultedService/getUserAnswer_ms.php
- DuggaSys/microservices/Microservices Documentation/resultedService.md
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/microservices/resultedService/getUserAnswer_ms_test.php
- DuggaSys/tests/microservices/resultedService/Microservices_docuementation.md

---

## sectionedService
Microservices to be renamed in the sectionedService folder.

### changeActiveCourseVersion_sectioned_ms.php
New name: <ins>updateActiveCourseVersion_sectioned_ms.php</ins>
A new file with the new name has already been created. It is an exact copy of the old one, so that file should just be removed along with the related test-file. Keep only <ins>updateActiveCourseVersion_sectioned_ms.php</ins>.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/changeActiveCourseVersion_sectioned_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/microservices/sectionedService/changeActiveCourseVersion_sectioned_ms_test.php

---

### getCourseGroupsAndMembers_ms.php
New name: <ins>readCourseGroupsAndMembers_ms.php</ins>.
A new file with the new name has already been created and is in use. It is an exact copy of the old one, so that file should just be removed. Keep only <ins>readCourseGroupsAndMembers_ms.php</ins>.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/getCourseGroupsAndMembers_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### getCourseVersions_ms.php
New name: <ins>readCourseVersions_ms.php</ins>.
A new file with the new name has already been created and is in use. The new microservice is similar to the old one with some changes, but they work the same way - the old file should just be removed. Keep only <ins>readCourseVersions_ms.php</ins>.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/getCourseVersions_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### getDeletedListEntries_ms.php
New name: <ins>readRemovedListentries_ms.php</ins>.
Is not documented in DuggaSys/microservices/Microservices.md, only in backend-models/microservices/duggaSys services/Microservices.md, but should be renamed to follow the same nameconvention as the other files.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/getDeletedListEntries_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/sectioned.js
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md

---

### getGroupValues_ms.php
New name: <ins>readGroupValues_ms.php</ins>.
A new file with the new name has already been created and is in use. The new microservice is the exact same, but with an array added in the new one - the old file should just be removed. Keep only <ins>readGroupValues_ms.php</ins>.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/getGroupValues_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### getListEntries_ms.php
New name: <ins>retrieveAllSectionedServiceData_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/getListEntries_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- Shared/dugga.js
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- DuggaSys/tests/microservices/sectionedService/getListEntries_ms_test.php
- DuggaSys/tests/microservices/sectionedService/retrieveSectionedService_ms_test.php
- DuggaSys/tests/microservices/sectionedService/readCourseVersions_ms_test.php
- DuggaSys/tests/microservices/sectionedService/Microservices_test_documentation.md

---

### getUserDuggaFeedback_ms.php
New name: <ins>readUserDuggaFeedback_ms.php</ins>.
A new file with the new name has already been created and is in use. The new microservice is very similar, it just includes more data as output. The old file should just be removed. Keep only <ins>readUserDuggaFeedback_ms.php</ins>.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/getUserDuggaFeedback_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### reorderListEntries_ms.php
New name: <ins>updateListEntryOrder_ms.php</ins>.
A new file with the new name has already been created and is in use. It is an exact copy of the old one, so that file should just be removed. Keep only <ins>updateListEntryOrder_ms.php</ins>.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/reorderListEntries_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- backend-models/microservices/duggaSys services/Microservices.md

---

### retrieveAllCourseVersions_ms.php
New name: <ins>readAllCourseVersions_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/retrieveAllCourseVersions_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md

---

### setVisibleListentries_ms.php
New name: <ins>updateVisibleListEntries_ms.php</ins>.
A new file with the new name has already been created and is in use. It is very similar to the old one but works the same way, so the old file should just be removed along with the related test-file. Keep only <ins>updateVisibleListEntries_ms.php</ins>.

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sectionedService/setVisibleListentries_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/microservices/sectionedService/setVisibleListentries_ms_test.php

---

## sharedMicroservices
Microservices to be renamed in the sharedMicroservices folder.

### getUid_ms.php
New name: <ins>readUid_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sharedMicroservices/getUid_ms.php
- DuggaSys/microservices/curlService.php
- DuggaSys/microservices/Microservices Documentation/fileedService.md
- DuggaSys/microservices/Microservices Documentation/resultedService.md
- DuggaSys/microservices/courseedService/createMOTD_ms.php
- DuggaSys/microservices/courseedService/updateCourse_ms.php
- DuggaSys/microservices/sectionedService/reorderListEntries_ms.php
- DuggaSys/microservices/sectionedService/getListEntries_ms.php
- DuggaSys/microservices/sectionedService/updateListEntriesGradesystem_ms.php
- DuggaSys/microservices/courseedService/createNewCourse_ms.php
- DuggaSys/microservices/accessedService/updateUser_ms.php
- DuggaSys/microservices/sectionedService/getDeletedListEntries_ms.php
- DuggaSys/microservices/accessedService/addClass_ms.php
- DuggaSys/microservices/duggaedService/updateDugga_ms.php
- DuggaSys/microservices/codeviewerService/updateCodeExampleTemplate_ms.php
- DuggaSys/microservices/sectionedService/readCourseVersions_ms.php
- DuggaSys/microservices/resultedService/getUserAnswer_ms.php
- DuggaSys/microservices/Microservices Documentation/codeviewerService.md
- DuggaSys/microservices/courseedService/retrieveCourseedService_ms.php
- DuggaSys/microservices/duggaedService/createDugga_ms.php
- DuggaSys/microservices/sectionedService/getCourseVersions_ms.php
- DuggaSys/microservices/sectionedService/updateListEntriesTabs_ms.php
- DuggaSys/microservices/codeviewerService/editCodeExample_ms.php
- DuggaSys/microservices/profileService/updateUserPassword_ms.php
- DuggaSys/microservices/duggaedService/deleteDugga_ms.php
- DuggaSys/microservices/sharedMicroservices/updateUserPassword_ms.php
- DuggaSys/microservices/courseedService/specialUpdate_ms.php
- DuggaSys/microservices/courseedService/getCourseed_ms.php
- DuggaSys/microservices/codeviewerService/editBoxTitle_ms.php
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/courseedService/changeActiveCourseVersion_courseed_ms.php
- DuggaSys/microservices/Microservices Documentation/accessedService.md
- DuggaSys/microservices/duggaedService/createDuggaVariant_ms.php
- DuggaSys/microservices/sectionedService/deleteListEntries_ms.php
- DuggaSys/microservices/duggaedService/deleteDuggaVariant_ms.php
- DuggaSys/microservices/sectionedService/updateVisibleListEntries_ms.php
- DuggaSys/microservices/accessedService/updateUserCourse_ms.php
- DuggaSys/microservices/highscoreService/highscoreservice_ms.php
- DuggaSys/microservices/sectionedService/setVisibleListentries_ms.php
- DuggaSys/microservices/fileedService/updateFileLink_ms.php
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/microservices/accessedService/retrieveAccessedService_ms.php
- DuggaSys/microservices/profileService/updateSecurityQuestion_ms.php
- DuggaSys/microservices/courseedService/copyCourseVersion_ms.php
- DuggaSys/microservices/codeviewerService/deleteCodeExample_ms.php
- DuggaSys/microservices/duggaedService/updateDuggaVariant_ms.php
- DuggaSys/microservices/sectionedService/removeListEntries_ms.php
- DuggaSys/microservices/Microservices Documentation/courseedService.md
- DuggaSys/microservices/sectionedService/getGroupValues_ms.php
- DuggaSys/microservices/courseedService/updateActiveCourseVersion_courseed_ms.php
- DuggaSys/microservices/sharedMicroservices/updateSecurityQuestion_ms.php
- DuggaSys/microservices/sectionedService/updateCourseVersion_sectioned_ms.php
- DuggaSys/microservices/fileedService/retrieveFileedService_ms.php
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- DuggaSys/microservices/sharedMicroservices/retrieveUsername_ms.php
- DuggaSys/microservices/sectionedService/createGithubCodeExample_ms.php
- DuggaSys/microservices/codeviewerService/editContentOfExample_ms.php
- DuggaSys/microservices/Microservices Documentation/sharedMicroservices.md
- DuggaSys/microservices/fileedService/deleteFileLink_ms.php
- DuggaSys/microservices/fileedService/getFileedService_ms.php
- DuggaSys/microservices/courseedService/updateCourseVersion_ms.php
- DuggaSys/microservices/courseedService/createCourseVersion_ms.php
- DuggaSys/microservices/Microservices Documentation/duggaedService.md
- DuggaSys/microservices/accessedService/getAccessedService_ms.php
- DuggaSys/microservices/accessedService/addUser_ms.php
- DuggaSys/microservices/sectionedService/readGroupValues_ms.php
- DuggaSys/microservices/sharedMicroservices/createNewCodeExample_ms.php
- DuggaSys/microservices/sectionedService/createListEntry_ms.php
- DuggaSys/microservices/sectionedService/updateListEntries_ms.php
- DuggaSys/microservices/courseedService/retrieveAllCourseedServiceData_ms.php
- DuggaSys/microservices/monolithic-to-microservices.md

### retrieveUsername_ms.php
New name: <ins>readUsername_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sharedMicroservices/retrieveUsername_ms.php
- DuggaSys/microservices/courseedService/updateCourse_ms.php
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/sectionedService/createListEntry_ms.php
- DuggaSys/microservices/courseedService/createNewCourse_ms.php
- DuggaSys/microservices/Microservices Documentation/sharedMicroservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/courseedService/updateCourseVersion_ms.php
- DuggaSys/microservices/accessedService/retrieveAccessedService_ms.php
- DuggaSys/microservices/courseedService/copyCourseVersion_ms.php
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/microservices/fileedService/updateFileLink_ms.php
- DuggaSys/microservices/courseedService/createCourseVersion_ms.php
- DuggaSys/microservices/sectionedService/updateCourseVersion_sectioned_ms.php
- DuggaSys/microservices/Microservices Documentation/courseedService.md
- DuggaSys/microservices/sharedMicroservices/createNewCodeExample_ms.php
- DuggaSys/microservices/sharedMicroservices/createNewListEntry_ms.php

### setAsActiveCourse_ms.php
New name: <ins>updateActiveCourse_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/sharedMicroservices/setAsActiveCourse_ms.php
- DuggaSys/microservices/curlService.php
- DuggaSys/microservices/Microservices Documentation/microserviceCodingStandard.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/courseedService/updateCourseVersion_ms.php
- DuggaSys/microservices/Microservices Documentation/microserviceRefactorPOSTnoAnswer.md
- DuggaSys/microservices/Microservices Documentation/sharedMicroservices.md
- DuggaSys/microservices/Microservices Documentation/sectionedService.md
- DuggaSys/microservices/Microservices Documentation/microserviceRefactorPOSTWithAnswer.md
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/microservices/Microservices Documentation/courseedService.md
- DuggaSys/microservices/sectionedService/updateCourseVersion_sectioned_ms.php

## showDuggaService
Microservices to be renamed in the showDuggaService folder.

### getShowDugga_ms.php
New name: <ins>retrieveAllShowDuggaServiceData_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/showDuggaService/getShowDugga_ms.php
- Shared/dugga.js
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/showDuggaService.md

### loadDugga_ms.php
New name: <ins>readSubmittedDugga_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/showDuggaService/loadDugga_ms.php
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md
- DuggaSys/microservices/Microservices Documentation/showDuggaService.md
- DuggaSys/microservices/showDuggaService/retrieveShowDuggaService_ms.php
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/microservices/showDuggaService/loadDugga_ms_test.php

### processDuggaFile_ms.php
New name: <ins>processSubmittedDugga_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/showDuggaService/processDuggaFile_ms.php
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/showDuggaService.md
- DuggaSys/microservices/showDuggaService/retrieveShowDuggaService_ms.php
- backend-models/microservices/duggaSys services/Microservices.md
- DuggaSys/tests/microservices/processDuggaFile_test.php

