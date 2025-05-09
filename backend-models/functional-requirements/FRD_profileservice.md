| Functionality Requirement No. | Function Requirement Description |
  | --- | --- |
  | FR1 | A non-superuser shall be able to change challenge/security questions. |
  | FR2 | A non-superuser shall be able to change password. |
  
  | FN No: | Test Proposal: |
  | --- | --- |
  | FR1 | Try changing challenge question while logged into a superuser/teacher. |
  | FR2 | Try changing password while logged into a superuser/teacher. |
  
  | FN No: | Input/output |
  | --- | --- |
  | FR1 | The user updates the securityquestion and securityquestionanswer in the user table. If everything went successfully the $success will be set to “true”. |
  | FR2 | The user updates the password in the user table. If everything went successfully the $success will be set to “true”. |
  
   | FN No: | FR1 |
  | --- | --- |
  | Shall | A non-superuser **shall** be able to change challenge/security questions. |
  | While | **While** the non-superuser have an active duggaSession |
  | When | **When** the change is requested. |
  | Where | **Where** the non-superuser is able to change challenge/security questions. |
  | If Then | **If** the change cannot be made **then** an error is provided |
  
   | FN No: | FR2 |
  | --- | --- |
  | Shall | A non-superuser **shall** be able to change password. |
  | While | **While** the non-superuser have an active duggaSession |
  | When | **When** the non-superuser presses “change password” |
  | Where | **Where** a “change password” function is available |
  | If Then | **If** the change cannot be made **Then** an error is provided |
