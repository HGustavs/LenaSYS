| Functionality Requirement No. | Function Requirement Description |
| --- | --- |
| FR1 | Teacher shall be able to fetch data from codeexample |
| FR2 | Teacher shall be able to update codeexample |
| FR3 | Student shall be able to view codeexample |

| FN No. | Test Proposal: |
| --- | --- |
| FR1 | Log into teacher and access any codeexample and see if they can be accessed. This might just be a non-functional req, while viewing is functional. |
| FR2 | Log into any teacher or superuser and update/edit the codeexample. Try from both. |
| FR3 | Log into any student and try to view any codeexample. Also try on a user with no access or from logged out to see what happens. |

| FN No: | FR1 |
| --- | --- |
| Shall | Teacher shall be able to fetch data from codeexample |
| While | While the teacher has access to the course |
| When | When Accessing codeviewer |
| Where | Where the user has access (writeaccess = w or issuperuser) |
| If Then | If file does not exist Then provide error |

| FN No: | FR2 |
| --- | --- |
| Shall | Teacher shall be able to update codeexample |
| While | While the teacher has access to the course |
| When | When codeexample exists |
| Where | Where the user has access (writeaccess = w or issuperuser) |
| If Then | If file does not exist Then provide error |

| FN No: | FR3 |
| --- | --- |
| Shall | Student shall be able to view codeexample |
| While | While the student is enlisted to the course as a student |
| When | When viewing a specific codeexample |
| Where | Where Everyone has access. (This has no actual check to see if the user is a student.) |
| If Then | If file does not exist Then provide error |