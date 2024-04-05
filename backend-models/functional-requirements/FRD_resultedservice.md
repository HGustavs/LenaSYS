| Functionality requirement No. | Function Requirement Description |
| ------------- | ------------- |
| FR1 | Teacher/super-user shall be able to view all student results |
| FR2 | Teacher/super-user shall be able to filter student results |

| FN No| Test Prosoal: |
| ------------- | ------------- |
| FR1| Login as different teachers/super-users and see if all can access the information thats in the database. The data should also be displayed in the payload/preview of resultedservice.php |
| FR2| Try to filter the student results and compare the result with the datebase results to check that the correct data is shown |

| FN No: | FR1|
| ------------- | ------------- |
| Shall | Teacher/super-user shall be able to view all student result in a course |
| While | While the teacher/super-user has access to the course |
| When | When the teacher/super-user presses the "Edit student results" button |
| Where | Where a edit student results button is visible  |
| If then | If the user is not a teacher/super-user then the option to view student results is not visible |

| FN No: | FR2 |
| ------------- | ------------- |
| Shall | Teacher shall be able to filter dugga |
| While | While the teacher has access to the course |
| When | When the student has made a submission of a dugga |
| Where | Where you access student results a Show dugga filter button shall be visible | 
| If then | If the user cant access student results this option shall not be visible | 