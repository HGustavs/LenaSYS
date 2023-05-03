| Functionality Requirement No. | Function Requirement Description (User should be able to...) |
 | --- | --- |
 | FR1 | Create new course |
 | FR2 | Create new course version |
 | FR3 | Update course version |
 | FR4 | Change a course version |
 | FR5 | Copy a course version |
 | FR6 | Update name and or visibility of course |
 | FR7 | Set the message of the day |
 | FR8 | Set courseed to read only |
 | FR9 | Retrive course information |
 
 | FN No: | Test Proposal: |
 | --- | --- |
 | FR1 | Log in on superuser -> press + -> fill in information according to the formats displayed. -> create. See if all steps work properly. This should send opt=NEW |
 | FR2 | Log in on superuser -> go to course -> press + -> fill in information according to the formats displayed. -> create. See if all steps work properly. This should send opt=NEWVRS |
 | FR3 | Log in on superuser -> go to course -> press edit(cogwheel) -> fill in information according to the formats displayed -> Save. See if all steps work properly. This should send opt=UPDATEVRS |
 | FR4 | Log in on superuser -> go to course -> press dropdown -> Change course version. See if all steps work properly. This should send opt=CHGVRS |
 | FR5 | Log in on superuser -> go to course -> press + -> fill in information according to the formats displayed. -> Copy content from selected course in dropdown menu -> create. See if all steps work properly. This should send opt=CPYVRS |
 | FR6 | Log in on superuser -> press cogwheel on any course -> Change name and or visibility. This should send opt=UPDATE |
 | FR7 | Log in on superuser -> press cogwheel at top "course organization system" -> set message of the day. This should send opt=SETTINGS |
 | FR8 | Log in on superuser -> press cogwheel at top "course organization system" -> set to read only in checkbox. This should send opt=SETTINGS |
 | FR9 | Log in on any type of user and see if they can display course information. This might be considered non-functional. |
 | NOTE: | FR1-FR8 Can also be tested for other users to make sure only super users can access these features. |

 | FN No: | F1 |
 | --- | --- |
 | Shall | User shall be able to create new course |
 | While | While the user is super |
 | When | When user clicks add button |
 | Where | Where courses are displayed |
 | If Then | If a new course was created then log this |
 
 | FN No: | F2 |
 | --- | --- |
 | Shall | User shall be able to create new course version |
 | While | While the user is super |
 | When | When user clicks create button |
 | Where | Where courses are displayed |
 | If Then | If a new course version was created then log this |
 
 | FN No: | F3 |
 | --- | --- |
 | Shall | User shall be able to update course version |
 | While | While the user is super |
 | When | When user clicks save button |
 | Where | Where courses are displayed |
 
 | FN No: | F4 |
 | --- | --- |
 | Shall | User shall be able to change a course version |
 | While | While the user is super |
 | When | When user clicks save button |
 | Where | Where courses are displayed |
 
 | FN No: | F5 |
 | --- | --- |
 | Shall | User shall be able to copy a course version |
 | While | While the user is super |
 | When | When user clicks copy button |
 | Where | Where courses are displayed |
 | If Then | If a course was copyed then log this |
 
 | FN No: | F6 |
 | --- | --- |
 | Shall | User shall be able to update name and or visibility of course |
 | While | While the user is super |
 | When | When user clicks save button |
 | Where | Where courses are displayed |
 
 | FN No: | F7 |
 | --- | --- |
 | Shall | User shall be able to set the message of the day |
 | While | While the user is super |
 | When | When user clicks save button |
 | Where | Where server settings are edited |
 
 | FN No: | F8 |
 | --- | --- |
 | Shall | User shall be able to set courseed to read only |
 | While | While the user is super |
 | When | When user clicks save button |
 | Where | Where server settings are edited |
 
 | FN No: | F9 |
 | --- | --- |
 | Shall | User shall be able to gather all their courses |
 | While | While the user is logged in |
 | When | When user open the page * |
 | Where | Where courses are displayed |
 | If Then | If material is marked as deleted then delete the course material |
 
 
