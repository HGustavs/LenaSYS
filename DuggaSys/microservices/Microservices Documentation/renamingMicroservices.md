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