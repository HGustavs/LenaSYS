# Renaming microservices
Several microservice files need to be renamed to follow a naming convention based on CRUD (Create, Read, Update, Delete), which would lead to the microservice names being easier to understand only based on the microservice/file name.
Since the microservices are included in multiple other microservices, renaming them will affect all files that reference them.

When the microservice/file name has been changed, mark it here, as well as in LenaSYS/DuggaSys/microservices
/Microservices.md, that the renameing is completed.

RENAME THE ACTUAL MICROSERVICEFILE AS WELL AS ALL THE PLACES THE MICROSERVICEFILE NAME IS USED.

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