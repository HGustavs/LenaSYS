# Renaming microservices
Several microservice files need to be renamed to follow a naming convention based on CRUD (Create, Read, Update, Delete), which would lead to the microservice names being easier to understand only based on the microservice/file name.
Since the microservices are included in multiple other microservices, renaming them will affect all files that reference them.
When the microservice/file has been changed, mark it here, as well as in LenaSYS/DuggaSys/microservices
/Microservices.md, that the renameing is completed.

---

## accessedService
Microservices to be renamed in the accessedService folder.

### addClass_ms.php
New filename: <ins>createClass_ms.php</ins>

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
New filename: <ins>createUser_ms.php</ins>

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
New filename: <ins>retrieveAllAcessedServiceData_ms.php</ins>

Used in, where the microservice/file name also needs to be changed:
- DuggaSys/microservices/accessedService/getAccessedService_ms.php
- DuggaSys/microservices/deprecated_microservices.md
- DuggaSys/microservices/Microservices.md
- DuggaSys/microservices/Microservices Documentation/accessedService.md
- DuggaSys/microservices/Microservices_inverse_dependencies.md

---